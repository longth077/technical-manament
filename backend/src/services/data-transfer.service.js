const ExcelJS = require('exceljs');
const { sequelize } = require('../models');
const { ENTITY_NAMES } = require('../utils/entities');

const sqlValue = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
};

class DataTransferService {
  constructor(models) {
    this.models = models;
  }

  async exportSql() {
    const lines = ['SET FOREIGN_KEY_CHECKS=0;'];

    for (const name of ENTITY_NAMES) {
      const rows = await this.models[name].findAll({ raw: true });
      lines.push(`DELETE FROM ${name};`);
      for (const row of rows) {
        const keys = Object.keys(row);
        const values = keys.map((k) => sqlValue(row[k]));
        lines.push(`INSERT INTO ${name} (${keys.join(',')}) VALUES (${values.join(',')});`);
      }
    }

    lines.push('SET FOREIGN_KEY_CHECKS=1;');
    return lines.join('\n');
  }

  async exportExcel(entities = ENTITY_NAMES) {
    const workbook = new ExcelJS.Workbook();

    for (const name of entities) {
      if (!this.models[name]) continue;
      const sheet = workbook.addWorksheet(name.substring(0, 31));
      const rows = await this.models[name].findAll({ raw: true, order: [['id', 'ASC']] });
      if (!rows.length) continue;
      const headers = Object.keys(rows[0]);
      sheet.columns = headers.map((key) => ({ header: key, key, width: 20 }));
      sheet.addRows(rows);
    }

    return workbook.xlsx.writeBuffer();
  }

  async importSql(sqlText) {
    await sequelize.query(sqlText);
    return { success: true };
  }

  async importExcel(base64Content) {
    const workbook = new ExcelJS.Workbook();
    const content = Buffer.from(base64Content, 'base64');
    await workbook.xlsx.load(content);

    const tx = await sequelize.transaction();
    try {
      for (const worksheet of workbook.worksheets) {
        const entity = worksheet.name;
        const model = this.models[entity];
        if (!model) continue;

        const rows = [];
        const header = worksheet.getRow(1).values.slice(1);
        worksheet.eachRow((row, index) => {
          if (index === 1) return;
          const values = row.values.slice(1);
          const payload = {};
          header.forEach((h, i) => {
            payload[h] = values[i] ?? null;
          });
          rows.push(payload);
        });

        await model.destroy({ where: {}, truncate: true, transaction: tx, force: true });
        if (rows.length) {
          await model.bulkCreate(rows, { transaction: tx });
        }
      }

      await tx.commit();
      return { success: true };
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}

module.exports = DataTransferService;
