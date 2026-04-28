class EnumController {
  constructor(enumService) {
    this.enumService = enumService;
  }

  listTypes = async (req, res, next) => {
    try {
      const types = await this.enumService.listTypes();
      res.json({ types });
    } catch (error) {
      next(error);
    }
  };

  listByType = async (req, res, next) => {
    try {
      const { type } = req.params;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(
        500,
        Math.max(1, parseInt(req.query.limit) || 100),
      );
      const result = await this.enumService.listByType(type, { page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  addValue = async (req, res, next) => {
    try {
      const { type } = req.params;
      const { enum: enumValue } = req.body;
      const row = await this.enumService.addValue(type, enumValue);
      res.status(201).json({ row });
    } catch (error) {
      next(error);
    }
  };

  deleteValue = async (req, res, next) => {
    try {
      await this.enumService.deleteValue(req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = EnumController;
