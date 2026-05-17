const fs = require("fs");

class WarehouseImageController {
  constructor(warehouseImageModel, enumConstantsModel) {
    this.model = warehouseImageModel;
    this.enumModel = enumConstantsModel;
    this.upload = this.upload.bind(this);
    this.remove = this.remove.bind(this);
  }

  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được tải lên" });
      }

      const { warehouse_id, file_type_id, description = "" } = req.body;

      if (!warehouse_id) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "warehouse_id là bắt buộc" });
      }

      // Resolve file_type_id: use provided value, else look up by mimetype
      let typeId = file_type_id ? parseInt(file_type_id, 10) : null;
      if (!typeId) {
        const { Op } = require("sequelize");
        const enumRow = await this.enumModel.findOne({
          where: { type: "warehouse_image_file_type", enum: req.file.mimetype },
        });
        if (enumRow) {
          typeId = Number(enumRow.id);
        } else {
          const fallback = await this.enumModel.findOne({
            where: { type: "warehouse_image_file_type" },
          });
          typeId = fallback ? Number(fallback.id) : null;
        }
      }

      if (!typeId) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: "Không xác định được loại file (file_type_id)" });
      }

      const row = await this.model.create({
        warehouse_id: parseInt(warehouse_id, 10),
        file_path: req.file.path, // absolute path on server
        file_type_id: typeId,
        description: description.toString().trim(),
      });

      res.status(201).json({ row: row.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "id không hợp lệ" });
      }

      const row = await this.model.findByPk(id);
      if (!row) return res.status(404).json({ message: "Không tìm thấy" });

      // Remove file from filesystem
      try {
        if (row.file_path && fs.existsSync(row.file_path)) {
          fs.unlinkSync(row.file_path);
        }
      } catch (_) {
        // Ignore file deletion errors — proceed with DB cleanup
      }

      await row.destroy();
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WarehouseImageController;
