class EntityController {
  constructor(entityService, dataTransferService) {
    this.entityService = entityService;
    this.dataTransferService = dataTransferService;
  }

  list = async (req, res, next) => {
    try {
      const rows = await this.entityService.list(req.params.entity, req.query);
      res.json({ rows });
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
      const row = await this.entityService.update(req.params.entity, req.params.id, req.body);
      res.json({ row });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.entityService.remove(req.params.entity, req.params.id);
      res.json({ message: 'Deleted' });
    } catch (error) {
      next(error);
    }
  };

  reportExcel = async (req, res, next) => {
    try {
      const entity = req.params.entity;
      const buffer = await this.dataTransferService.exportExcel([entity]);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${entity}-report.xlsx"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = EntityController;
