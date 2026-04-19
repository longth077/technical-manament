const ExcelJS = require('exceljs');
const { sequelize } = require('../models');
const { ENTITY_NAMES } = require('../utils/entities');

const sqlValue = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
};

const parseSqlValues = (input) => {
  const parts = [];
  let current = '';
  let inQuote = false;
  let escaped = false;

  for (const ch of input) {
    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escaped = true;
      continue;
    }
    if (ch === "'") {
      inQuote = !inQuote;
      current += ch;
      continue;
    }
    if (ch === ',' && !inQuote) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parseSqlLiteral = (literal) => {
  if (literal === 'NULL') return null;
  if (literal.startsWith("'") && literal.endsWith("'")) {
    return literal.slice(1, -1).replaceAll("\\'", "'").replaceAll('\\\\', '\\');
  }
  const num = Number(literal);
  return Number.isNaN(num) ? literal : num;
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
    const lines = sqlText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('--') && !line.startsWith('SET FOREIGN_KEY_CHECKS'));

    const tx = await sequelize.transaction();
    try {
      for (const line of lines) {
        if (line.startsWith('DELETE FROM ') && line.endsWith(';')) {
          const entity = line.slice('DELETE FROM '.length, -1).trim();
          if (!ENTITY_NAMES.includes(entity)) throw new Error(`Unsupported entity: ${entity}`);
          await this.models[entity].destroy({ where: {}, truncate: true, transaction: tx, force: true });
          continue;
        }

        if (line.startsWith('INSERT INTO ') && line.endsWith(';')) {
          const payloadLine = line.slice('INSERT INTO '.length, -1);
          const firstParen = payloadLine.indexOf('(');
          const valuesToken = ') VALUES (';
          const valuesPos = payloadLine.indexOf(valuesToken);
          const lastParen = payloadLine.lastIndexOf(')');

          if (firstParen <= 0 || valuesPos <= firstParen || lastParen <= valuesPos) {
            throw new Error('Invalid SQL import format');
          }

          const entity = payloadLine.slice(0, firstParen).trim();
          if (!ENTITY_NAMES.includes(entity)) throw new Error(`Unsupported entity: ${entity}`);

          const rawColumns = payloadLine.slice(firstParen + 1, valuesPos).trim();
          const rawValues = payloadLine.slice(valuesPos + valuesToken.length, lastParen).trim();

          const columns = rawColumns.split(',').map((c) => c.trim());
          const values = parseSqlValues(rawValues).map(parseSqlLiteral);
          if (columns.length !== values.length) throw new Error('Invalid SQL import format');
          const payload = Object.fromEntries(columns.map((col, index) => [col, values[index]]));
          await this.models[entity].create(payload, { transaction: tx });
          continue;
        }

        throw new Error('Only exported SQL format is supported for import');
      }

      await tx.commit();
      return { success: true };
    } catch (error) {
      await tx.rollback();
      throw error;
    }
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
