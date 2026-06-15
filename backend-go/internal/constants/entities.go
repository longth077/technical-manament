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

func ResolveEntityTable(entity string) (string, bool) {
	switch entity {
	case "enum_constants":
		return "enum_constants", true
	case "unit_infos":
		return "unit_infos", true
	case "overviews":
		return "overviews", true
	case "staffs":
		return "staffs", true
	case "warehouses":
		return "warehouses", true
	case "warehouse_images":
		return "warehouse_images", true
	case "warehouse_equipments":
		return "warehouse_equipments", true
	case "warehouse_inspections":
		return "warehouse_inspections", true
	case "warehouse_accesses":
		return "warehouse_accesses", true
	case "warehouse_handovers":
		return "warehouse_handovers", true
	case "warehouse_exports":
		return "warehouse_exports", true
	case "warehouse_imports":
		return "warehouse_imports", true
	case "warehouse_lightnings":
		return "warehouse_lightnings", true
	case "weapons":
		return "weapons", true
	case "tech_equipments":
		return "tech_equipments", true
	case "vehicles":
		return "vehicles", true
	case "materials":
		return "materials", true
	case "staff_warehouses":
		return "staff_warehouses", true
	case "staff_weapons":
		return "staff_weapons", true
	case "staff_vehicles":
		return "staff_vehicles", true
	case "staff_tech_equipment":
		return "staff_tech_equipment", true
	default:
		return "", false
	}
}
