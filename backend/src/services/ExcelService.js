const ExcelJS = require('exceljs');

class ExcelService {
  /**
   * Export data to Excel buffer
   * @param {Array<{key: string, label: string}>} columns - column definitions
   * @param {Array<Object>} data - array of row objects
   * @param {string} sheetName - worksheet name
   * @returns {Promise<Buffer>} Excel file buffer
   */
  async exportToExcel(columns, data, sheetName = 'Data') {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Technical Management System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);

    // Add "TT" (row number) as first column header
    worksheet.columns = [
      { header: 'TT', key: '_rowNum', width: 6 },
      ...columns.map((col) => ({
        header: col.label,
        key: col.key,
        width: Math.max(col.label.length * 1.5, 15),
      })),
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1A73E8' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Add data rows
    data.forEach((row, idx) => {
      const rowData = { _rowNum: idx + 1 };
      columns.forEach((col) => {
        rowData[col.key] = row[col.key] ?? '';
      });
      worksheet.addRow(rowData);
    });

    // Add borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    return workbook.xlsx.writeBuffer();
  }

  /**
   * Parse Excel file buffer into array of objects
   * @param {Buffer} buffer - Excel file buffer
   * @param {Array<{key: string, label: string}>} columns - expected column definitions
   * @returns {Promise<Array<Object>>} parsed data rows
   */
  async parseExcel(buffer, columns) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet || worksheet.rowCount < 2) {
      return [];
    }

    // Read header row to map column positions
    const headerRow = worksheet.getRow(1);
    const headerMap = {};
    headerRow.eachCell((cell, colNumber) => {
      const value = String(cell.value || '').trim();
      // Match by label name
      const col = columns.find(
        (c) => c.label.toLowerCase() === value.toLowerCase()
      );
      if (col) {
        headerMap[colNumber] = col.key;
      }
    });

    const results = [];
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      // Skip completely empty rows
      let hasData = false;
      const obj = {};
      columns.forEach((col) => {
        obj[col.key] = '';
      });

      row.eachCell((cell, colNumber) => {
        const key = headerMap[colNumber];
        if (key) {
          const value = cell.value;
          obj[key] = value != null ? String(value).trim() : '';
          if (obj[key]) hasData = true;
        }
      });

      if (hasData) {
        results.push(obj);
      }
    }

    return results;
  }
}

module.exports = new ExcelService();
