const ExcelJS = require("exceljs");
const { ENTITY_LABELS, ENTITY_COLUMNS } = require("../utils/report-labels");

// Colour palette
const COLOR_HEADER_BG = "FF1F3864"; // dark navy
const COLOR_HEADER_FG = "FFFFFFFF"; // white
const COLOR_TITLE_BG = "FF2E75B6"; // medium blue
const COLOR_TITLE_FG = "FFFFFFFF";
const COLOR_ALT_ROW = "FFDCE6F1"; // light blue stripe
const COLOR_BORDER = "FFB8CCE4";
const COLOR_TOTAL_BG = "FFFFD966"; // yellow for totals

/** Format a date value to dd/MM/yyyy */
function fmtDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Thin border helper */
function border() {
  const side = { style: "thin", color: { argb: COLOR_BORDER } };
  return { top: side, left: side, bottom: side, right: side };
}

class ReportService {
  constructor(models) {
    this.models = models;
  }

  /**
   * Pre-load all FK and enum lookup maps needed by the column definitions.
   */
  async buildLookups(columns) {
    const lookups = {}; // key: "fk:tableName:field" or "enum:type"

    const fkNeeded = new Map(); // table -> Set<field>
    const enumTypes = new Set();

    for (const col of columns) {
      if (col.type.startsWith("fk:")) {
        const [, table, field] = col.type.split(":");
        if (!fkNeeded.has(table)) fkNeeded.set(table, new Set());
        fkNeeded.get(table).add(field);
      } else if (col.type.startsWith("enum:")) {
        enumTypes.add(col.type.split(":")[1]);
      }
    }

    // FK lookups — one query per table, covers all needed fields
    for (const [table, fields] of fkNeeded.entries()) {
      if (!this.models[table]) continue;
      const fieldArr = [...fields];
      const rows = await this.models[table].findAll({
        raw: true,
        attributes: ["id", ...fieldArr],
      });
      for (const field of fieldArr) {
        const map = {};
        for (const r of rows) map[String(r.id)] = r[field] ?? "";
        lookups[`fk:${table}:${field}`] = map;
      }
    }

    // Enum lookups
    if (enumTypes.size > 0 && this.models.enum_constants) {
      const enumRows = await this.models.enum_constants.findAll({
        raw: true,
        where: { type: [...enumTypes] },
      });
      for (const r of enumRows) {
        const key = `enum:${r.type}`;
        if (!lookups[key]) lookups[key] = {};
        lookups[key][String(r.id)] = r.enum ?? "";
      }
    }

    return lookups;
  }

  /** Resolve a cell value using lookups */
  resolveValue(rawVal, colType, lookups) {
    if (rawVal === null || rawVal === undefined) return "";

    if (colType.startsWith("fk:")) {
      const [, table, field] = colType.split(":");
      const map = lookups[`fk:${table}:${field}`];
      return map ? (map[String(rawVal)] ?? String(rawVal)) : String(rawVal);
    }

    if (colType.startsWith("enum:")) {
      const map = lookups[colType];
      return map ? (map[String(rawVal)] ?? String(rawVal)) : String(rawVal);
    }

    if (colType === "boolean") {
      return rawVal ? "CÃ³" : "KhÃ´ng";
    }

    if (colType === "date") {
      return fmtDate(rawVal);
    }

    if (colType === "currency") {
      const n = Number(rawVal);
      return isNaN(n) ? String(rawVal) : n;
    }

    if (colType === "number") {
      const n = Number(rawVal);
      return isNaN(n) ? String(rawVal) : n;
    }

    return String(rawVal);
  }

  /**
   * Internal: add one formatted sheet to an existing workbook.
   */
  _addFormattedSheet(workbook, entityName, rows, colDefs, lookups) {
    const entityLabel = ENTITY_LABELS[entityName] || entityName;
    const numCols = colDefs.length;

    const sheet = workbook.addWorksheet(entityLabel.substring(0, 31), {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
      },
      views: [{ state: "frozen", ySplit: 4 }],
    });

    // â”€â”€ Row 1: Main title â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    sheet.mergeCells(1, 1, 1, numCols);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = `BÃO CÃO: ${entityLabel.toUpperCase()}`;
    titleCell.font = {
      bold: true,
      size: 14,
      color: { argb: COLOR_TITLE_FG },
      name: "Times New Roman",
    };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLOR_TITLE_BG },
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 28;

    // â”€â”€ Row 2: Subtitle / date â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    sheet.mergeCells(2, 1, 2, numCols);
    const subCell = sheet.getCell(2, 1);
    subCell.value = `NgÃ y xuáº¥t bÃ¡o cÃ¡o: ${fmtDate(new Date())}`;
    subCell.font = { italic: true, size: 11, name: "Times New Roman" };
    subCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(2).height = 20;

    // â”€â”€ Row 3: Record count â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    sheet.mergeCells(3, 1, 3, numCols);
    const countCell = sheet.getCell(3, 1);
    countCell.value = `Tá»•ng sá»‘ báº£n ghi: ${rows.length}`;
    countCell.font = { size: 11, name: "Times New Roman" };
    countCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(3).height = 18;

    // â”€â”€ Row 4: Column headers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const headerRow = sheet.getRow(4);
    headerRow.height = 22;
    colDefs.forEach((col, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = col.label;
      cell.font = {
        bold: true,
        size: 11,
        color: { argb: COLOR_HEADER_FG },
        name: "Times New Roman",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLOR_HEADER_BG },
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = border();
    });

    // â”€â”€ Column widths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    colDefs.forEach((col, i) => {
      sheet.getColumn(i + 1).width = col.width || 18;
    });

    // â”€â”€ Data rows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const currencyColIndexes = [];
    colDefs.forEach((col, i) => {
      if (col.type === "currency") currencyColIndexes.push(i + 1);
    });
    const hasCurrencyCol = currencyColIndexes.length > 0;

    rows.forEach((row, rowIdx) => {
      const sheetRowIdx = rowIdx + 5;
      const sheetRow = sheet.getRow(sheetRowIdx);
      sheetRow.height = 18;
      const isAlt = rowIdx % 2 === 1;

      colDefs.forEach((col, colIdx) => {
        const cell = sheetRow.getCell(colIdx + 1);
        const resolved = this.resolveValue(row[col.key], col.type, lookups);
        cell.value = resolved === "" ? null : resolved;

        if (col.type === "number" || col.type === "currency") {
          cell.alignment = { horizontal: "right", vertical: "middle" };
          if (col.type === "currency" && typeof resolved === "number") {
            cell.numFmt = "#,##0";
          }
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: false,
          };
        }

        cell.font = { size: 11, name: "Times New Roman" };
        cell.border = border();

        if (isAlt) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_ALT_ROW },
          };
        }
      });
    });

    // â”€â”€ Currency total row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (hasCurrencyCol && rows.length > 0) {
      const totalRowIdx = rows.length + 5;
      const totalSheetRow = sheet.getRow(totalRowIdx);
      totalSheetRow.height = 20;

      const firstCurrIdx = currencyColIndexes[0];
      if (firstCurrIdx > 1) {
        sheet.mergeCells(totalRowIdx, 1, totalRowIdx, firstCurrIdx - 1);
      }
      const labelCell = totalSheetRow.getCell(1);
      labelCell.value = "Tá»”NG Cá»˜NG";
      labelCell.font = { bold: true, size: 11, name: "Times New Roman" };
      labelCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLOR_TOTAL_BG },
      };
      labelCell.alignment = { horizontal: "right", vertical: "middle" };
      labelCell.border = border();

      colDefs.forEach((col, colIdx) => {
        const cell = totalSheetRow.getCell(colIdx + 1);
        if (col.type === "currency") {
          const colLetter = sheet.getColumn(colIdx + 1).letter;
          cell.value = {
            formula: `SUM(${colLetter}5:${colLetter}${rows.length + 4})`,
          };
          cell.numFmt = "#,##0";
          cell.font = { bold: true, size: 11, name: "Times New Roman" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_TOTAL_BG },
          };
          cell.alignment = { horizontal: "right", vertical: "middle" };
          cell.border = border();
        } else if (colIdx + 1 >= firstCurrIdx) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_TOTAL_BG },
          };
          cell.border = border();
        }
      });
    }

    // â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const footerRowIdx =
      rows.length + (hasCurrencyCol && rows.length > 0 ? 7 : 6);
    sheet.mergeCells(footerRowIdx, 1, footerRowIdx, numCols);
    const footerCell = sheet.getCell(footerRowIdx, 1);
    footerCell.value =
      "Há»‡ thá»‘ng Quáº£n lÃ½ Ká»¹ thuáº­t â€” TÃ i liá»‡u Ä‘Æ°á»£c táº¡o tá»± Ä‘á»™ng, cÃ³ giÃ¡ trá»‹ tham kháº£o.";
    footerCell.font = {
      italic: true,
      size: 10,
      color: { argb: "FF808080" },
      name: "Times New Roman",
    };
    footerCell.alignment = { horizontal: "center" };
  }

  /**
   * Export a single entity to an Excel workbook buffer â€” formatted Vietnamese report.
   */
  async exportEntityExcel(entityName, filters = {}) {
    if (!this.models[entityName]) {
      const err = new Error(`Entity khÃ´ng tá»“n táº¡i: ${entityName}`);
      err.status = 404;
      throw err;
    }

    const colDefs = ENTITY_COLUMNS[entityName];
    if (!colDefs) {
      const err = new Error(`ChÆ°a cáº¥u hÃ¬nh bÃ¡o cÃ¡o cho: ${entityName}`);
      err.status = 400;
      throw err;
    }

    const lookups = await this.buildLookups(colDefs);

    const whereClause = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== "") whereClause[k] = v;
    }
    const rows = await this.models[entityName].findAll({
      raw: true,
      order: [["id", "ASC"]],
      ...(Object.keys(whereClause).length ? { where: whereClause } : {}),
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Há»‡ thá»‘ng Quáº£n lÃ½ Ká»¹ thuáº­t";
    workbook.created = new Date();
    workbook.modified = new Date();

    this._addFormattedSheet(workbook, entityName, rows, colDefs, lookups);

    return workbook.xlsx.writeBuffer();
  }

  /**
   * Export ALL reportable entities into a single multi-sheet workbook.
   * Sheets are in the same order as ENTITY_COLUMNS keys.
   */
  async exportAllExcel() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Há»‡ thá»‘ng Quáº£n lÃ½ Ká»¹ thuáº­t";
    workbook.created = new Date();
    workbook.modified = new Date();

    for (const entityName of Object.keys(ENTITY_COLUMNS)) {
      if (!this.models[entityName]) continue;
      const colDefs = ENTITY_COLUMNS[entityName];
      const lookups = await this.buildLookups(colDefs);
      const rows = await this.models[entityName].findAll({
        raw: true,
        order: [["id", "ASC"]],
      });
      this._addFormattedSheet(workbook, entityName, rows, colDefs, lookups);
    }

    return workbook.xlsx.writeBuffer();
  }
}

module.exports = ReportService;
