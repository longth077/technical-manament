const { ENTITY_LABELS } = require("../utils/report-labels");

class ReportController {
  constructor(reportService) {
    this.reportService = reportService;
  }

  exportEntityExcel = async (req, res, next) => {
    try {
      const { entity } = req.params;
      const filters = req.query || {};

      const buffer = await this.reportService.exportEntityExcel(
        entity,
        filters,
      );

      const label = ENTITY_LABELS[entity] || entity;
      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const filename = `bao-cao-${entity}-${dateTag}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      );
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReportController;
