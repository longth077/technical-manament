class EntityController {
  constructor(entityService, dataTransferService, reportService) {
    this.entityService = entityService;
    this.dataTransferService = dataTransferService;
    this.reportService = reportService;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.entityService.list(
        req.params.entity,
        req.query,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const row = await this.entityService.create(req.params.entity, req.body);
      res.status(201).json({ row });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const row = await this.entityService.update(
        req.params.entity,
        req.params.id,
        req.body,
      );
      res.json({ row });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.entityService.remove(req.params.entity, req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      next(error);
    }
  };

  reportExcel = async (req, res, next) => {
    try {
      const entity = req.params.entity;
      const filters = req.query || {};
      const buffer = await this.reportService.exportEntityExcel(
        entity,
        filters,
      );

      const { ENTITY_LABELS } = require("../utils/report-labels");
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

module.exports = EntityController;
