// FK fields supported as query filters per entity
const FILTER_FIELDS = {
  warehouses: ["keeper_id"],
  warehouse_images: ["warehouse_id"],
  warehouse_equipments: ["warehouse_id"],
  warehouse_inspections: ["warehouse_id"],
  warehouse_accesses: ["warehouse_id"],
  warehouse_handovers: ["warehouse_id"],
  warehouse_exports: ["warehouse_id"],
  warehouse_imports: ["warehouse_id"],
  warehouse_lightnings: ["warehouse_id"],
  staff_warehouses: ["staff_id", "warehouse_id", "is_main_keeper"],
  staff_weapons: ["staff_id", "weapon_id"],
  staff_vehicles: ["staff_id", "vehicle_id"],
  staff_tech_equipment: ["staff_id", "tech_equipment_id"],
  enum_constants: ["type"],
};

class EntityService {
  constructor(entityRepositories) {
    this.entityRepositories = entityRepositories;
  }

  getRepository(name) {
    const repo = this.entityRepositories[name];
    if (!repo) {
      const err = new Error("Invalid entity");
      err.status = 404;
      throw err;
    }
    return repo;
  }

  async list(entity, query = {}) {
    const repo = this.getRepository(entity);
    const where = {};

    const filterFields = FILTER_FIELDS[entity] || [];
    for (const field of filterFields) {
      if (query[field] !== undefined && query[field] !== "") {
        where[field] = query[field];
      }
    }

    if (query.page !== undefined || query.limit !== undefined) {
      const page = Math.max(1, parseInt(query.page) || 1);
      const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 50));
      const offset = (page - 1) * limit;
      return repo.findWithFilterPaginated(where, { page, limit, offset });
    }

    return { rows: await repo.findWithFilter(where) };
  }

  async create(entity, payload) {
    // Strip auto-managed fields so DB AUTO_INCREMENT always generates the id
    const {
      id: _id,
      created_at: _ca,
      updated_at: _ua,
      ...cleanPayload
    } = payload;
    this._validate(entity, cleanPayload, true);
    const repo = this.getRepository(entity);

    // Special: auto-set first keeper of a warehouse as main keeper
    if (
      entity === "staff_warehouses" &&
      cleanPayload.warehouse_id &&
      cleanPayload.staff_id
    ) {
      const existing = await repo.findWithFilter({
        warehouse_id: cleanPayload.warehouse_id,
      });
      if (existing.length === 0) {
        cleanPayload.is_main_keeper = 1;
      }
    }

    const row = await repo.create(cleanPayload);

    // Sync warehouse.keeper_id when this keeper is set as main
    if (
      entity === "staff_warehouses" &&
      row.is_main_keeper &&
      row.warehouse_id &&
      row.staff_id
    ) {
      const warehouseRepo = this.getRepository("warehouses");
      await warehouseRepo.update(row.warehouse_id, { keeper_id: row.staff_id });
    }

    return row;
  }

  async update(entity, id, payload) {
    // Strip auto-managed fields so clients cannot overwrite them
    const {
      id: _id,
      created_at: _ca,
      updated_at: _ua,
      ...cleanPayload
    } = payload;
    this._validate(entity, cleanPayload, false);
    const repo = this.getRepository(entity);

    // Special: promoting a keeper to main — enforce uniqueness and sync warehouse.keeper_id
    if (entity === "staff_warehouses" && cleanPayload.is_main_keeper) {
      const current = await repo.findById(id);
      if (current && current.warehouse_id) {
        // Unset is_main_keeper on all other keepers of this warehouse
        const allKeepers = await repo.findWithFilter({
          warehouse_id: current.warehouse_id,
        });
        for (const k of allKeepers) {
          if (String(k.id) !== String(id) && k.is_main_keeper) {
            await repo.update(k.id, { is_main_keeper: 0 });
          }
        }
        // Sync warehouse.keeper_id to this staff
        if (current.staff_id) {
          const warehouseRepo = this.getRepository("warehouses");
          await warehouseRepo.update(current.warehouse_id, {
            keeper_id: current.staff_id,
          });
        }
      }
    }

    const row = await repo.update(id, cleanPayload);
    if (!row) {
      const err = new Error("Record not found");
      err.status = 404;
      throw err;
    }
    return row;
  }

  async remove(entity, id) {
    const repo = this.getRepository(entity);

    // Special: if removing a main keeper, clear the warehouse.keeper_id
    if (entity === "staff_warehouses") {
      const row = await repo.findById(id);
      if (row && row.is_main_keeper && row.warehouse_id) {
        const warehouseRepo = this.getRepository("warehouses");
        await warehouseRepo.update(row.warehouse_id, { keeper_id: null });
      }
    }

    const ok = await repo.delete(id);
    if (!ok) {
      const err = new Error("Record not found");
      err.status = 404;
      throw err;
    }
  }

  _validate(entity, payload, isCreate = true) {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const errors = [];

    if (entity === "staffs") {
      if (!payload.full_name || String(payload.full_name).trim() === "")
        errors.push("full_name is required");
      if (!payload.id_number || String(payload.id_number).trim() === "")
        errors.push("id_number is required");
      if (!payload.rank_id) errors.push("rank_id is required");
      if (!payload.education_id) errors.push("education_id is required");
      if (payload.date_of_birth) {
        const dob = new Date(payload.date_of_birth);
        if (!isNaN(dob) && dob > today)
          errors.push("date_of_birth must not be in the future");
      }
    }

    if (entity === "warehouses") {
      if (!payload.code || String(payload.code).trim() === "")
        errors.push("code is required");
      if (!payload.function_desc || String(payload.function_desc).trim() === "")
        errors.push("function_desc is required");
    }

    if (entity === "warehouse_images") {
      if (!payload.file_path || String(payload.file_path).trim() === "")
        errors.push("file_path is required");
      if (!payload.file_type_id) errors.push("file_type_id is required");
    }

    if (entity === "warehouse_accesses") {
      if (
        payload.companion_count !== undefined &&
        Number(payload.companion_count) < 0
      )
        errors.push("companion_count must be >= 0");
    }

    if (entity === "warehouse_handovers") {
      if (payload.quantity !== undefined && Number(payload.quantity) < 0)
        errors.push("quantity must be >= 0");
      if (
        payload.return_quantity !== undefined &&
        Number(payload.return_quantity) < 0
      )
        errors.push("return_quantity must be >= 0");
    }

    if (entity === "warehouse_exports" || entity === "warehouse_imports") {
      if (
        payload.required_quantity !== undefined &&
        Number(payload.required_quantity) < 0
      )
        errors.push("required_quantity must be >= 0");
      if (
        payload.actual_quantity !== undefined &&
        Number(payload.actual_quantity) < 0
      )
        errors.push("actual_quantity must be >= 0");
      if (payload.unit_price !== undefined && Number(payload.unit_price) < 0)
        errors.push("unit_price must be >= 0");
      if (payload.total_price !== undefined && Number(payload.total_price) < 0)
        errors.push("total_price must be >= 0");
    }

    if (entity === "weapons" || entity === "materials") {
      if (!payload.name || String(payload.name).trim() === "")
        errors.push("name is required");
      if (payload.quantity !== undefined && Number(payload.quantity) < 0)
        errors.push("quantity must be >= 0");
      if (
        payload.assigned_unit !== undefined &&
        Number(payload.assigned_unit) < 0
      )
        errors.push("assigned_unit must be >= 0");
      if (
        payload.assigned_individual !== undefined &&
        Number(payload.assigned_individual) < 0
      )
        errors.push("assigned_individual must be >= 0");
      if (
        payload.year !== undefined &&
        payload.year !== null &&
        Number(payload.year) > currentYear
      )
        errors.push("year must not be greater than current year");
      const qty = Number(payload.quantity) || 0;
      const unit = Number(payload.assigned_unit) || 0;
      const ind = Number(payload.assigned_individual) || 0;
      if (unit + ind > qty)
        errors.push(
          "assigned_unit + assigned_individual must not exceed quantity",
        );
    }

    if (entity === "tech_equipments") {
      if (!payload.name || String(payload.name).trim() === "")
        errors.push("name is required");
      if (!payload.repair_id) errors.push("repair_id is required");
      if (payload.quantity !== undefined && Number(payload.quantity) < 0)
        errors.push("quantity must be >= 0");
      if (payload.allocation !== undefined && Number(payload.allocation) < 0)
        errors.push("allocation must be >= 0");
      if (
        payload.operating_hours !== undefined &&
        Number(payload.operating_hours) < 0
      )
        errors.push("operating_hours must be >= 0");
      if (
        payload.year !== undefined &&
        payload.year !== null &&
        Number(payload.year) > currentYear
      )
        errors.push("year must not be greater than current year");
      const qty = Number(payload.quantity) || 0;
      const alloc = Number(payload.allocation) || 0;
      if (alloc > qty) errors.push("allocation must not exceed quantity");
    }

    if (entity === "vehicles") {
      if (!payload.name || String(payload.name).trim() === "")
        errors.push("name is required");
      if (!payload.repair_id) errors.push("repair_id is required");
      if (payload.allocation !== undefined && Number(payload.allocation) < 0)
        errors.push("allocation must be >= 0");
      if (
        payload.operating_hours !== undefined &&
        Number(payload.operating_hours) < 0
      )
        errors.push("operating_hours must be >= 0");
      if (payload.km !== undefined && Number(payload.km) < 0)
        errors.push("km must be >= 0");
      if (
        payload.year !== undefined &&
        payload.year !== null &&
        Number(payload.year) > currentYear
      )
        errors.push("year must not be greater than current year");
    }

    if (entity === "staff_warehouses") {
      if (isCreate) {
        const hasStaff =
          payload.staff_id ||
          (payload.staff_name && String(payload.staff_name).trim());
        const hasWarehouse =
          payload.warehouse_id ||
          (payload.warehouse_code && String(payload.warehouse_code).trim());
        if (!hasStaff) errors.push("staff_id or staff_name is required");
        if (!hasWarehouse)
          errors.push("warehouse_id or warehouse_code is required");
      }
    }

    if (entity === "staff_weapons") {
      if (isCreate) {
        const hasStaff =
          payload.staff_id ||
          (payload.staff_name && String(payload.staff_name).trim());
        const hasWeapon =
          payload.weapon_id ||
          (payload.weapon_name && String(payload.weapon_name).trim());
        if (!hasStaff) errors.push("staff_id or staff_name is required");
        if (!hasWeapon) errors.push("weapon_id or weapon_name is required");
      }
    }

    if (entity === "staff_vehicles") {
      if (isCreate) {
        const hasStaff =
          payload.staff_id ||
          (payload.staff_name && String(payload.staff_name).trim());
        const hasVehicle =
          payload.vehicle_id ||
          (payload.vehicle_name && String(payload.vehicle_name).trim());
        if (!hasStaff) errors.push("staff_id or staff_name is required");
        if (!hasVehicle) errors.push("vehicle_id or vehicle_name is required");
      }
    }

    if (entity === "staff_tech_equipment") {
      if (isCreate) {
        const hasStaff =
          payload.staff_id ||
          (payload.staff_name && String(payload.staff_name).trim());
        const hasTech =
          payload.tech_equipment_id ||
          (payload.tech_equipment_name &&
            String(payload.tech_equipment_name).trim());
        if (!hasStaff) errors.push("staff_id or staff_name is required");
        if (!hasTech)
          errors.push("tech_equipment_id or tech_equipment_name is required");
      }
    }

    if (errors.length) {
      const err = new Error(errors.join("; "));
      err.status = 422;
      throw err;
    }
  }
}

module.exports = EntityService;
