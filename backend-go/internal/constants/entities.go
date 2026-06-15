package constants

var EntityNames = []string{
	"enum_constants",
	"unit_infos",
	"overviews",
	"staffs",
	"warehouses",
	"warehouse_images",
	"warehouse_equipments",
	"warehouse_inspections",
	"warehouse_accesses",
	"warehouse_handovers",
	"warehouse_exports",
	"warehouse_imports",
	"warehouse_lightnings",
	"weapons",
	"tech_equipments",
	"vehicles",
	"materials",
	"staff_warehouses",
	"staff_weapons",
	"staff_vehicles",
	"staff_tech_equipment",
}

var FilterFields = map[string][]string{
	"warehouses":            {"keeper_id"},
	"warehouse_images":      {"warehouse_id"},
	"warehouse_equipments":  {"warehouse_id"},
	"warehouse_inspections": {"warehouse_id"},
	"warehouse_accesses":    {"warehouse_id"},
	"warehouse_handovers":   {"warehouse_id"},
	"warehouse_exports":     {"warehouse_id"},
	"warehouse_imports":     {"warehouse_id"},
	"warehouse_lightnings":  {"warehouse_id"},
	"staff_warehouses":      {"staff_id", "warehouse_id", "is_main_keeper"},
	"staff_weapons":         {"staff_id", "weapon_id"},
	"staff_vehicles":        {"staff_id", "vehicle_id"},
	"staff_tech_equipment":  {"staff_id", "tech_equipment_id"},
	"enum_constants":        {"type"},
}

func IsValidEntity(entity string) bool {
	for _, name := range EntityNames {
		if name == entity {
			return true
		}
	}
	return false
}
