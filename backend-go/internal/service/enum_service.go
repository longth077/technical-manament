package service

import "gorm.io/gorm"

type EnumService struct {
	db *gorm.DB
}

func NewEnumService(db *gorm.DB) *EnumService {
	return &EnumService{db: db}
}

func (s *EnumService) ListTypes() ([]string, error) {
	var types []string
	err := s.db.Table("enum_constants").Distinct("type").Order("type ASC").Pluck("type", &types).Error
	return types, err
}

func (s *EnumService) ListByType(t string, page int, limit int) (map[string]any, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 100
	}
	if limit > 500 {
		limit = 500
	}
	db := s.db.Table("enum_constants").Where("type = ?", t)
	var total int64
	if err := db.Count(&total).Error; err != nil {
		return nil, err
	}
	var rows []map[string]any
	if err := db.Order("id ASC").Limit(limit).Offset((page - 1) * limit).Find(&rows).Error; err != nil {
		return nil, err
	}
	return map[string]any{"rows": rows, "total": total, "page": page, "limit": limit}, nil
}

func (s *EnumService) AddValue(t string, value string) (map[string]any, error) {
	if t == "" {
		return nil, NewHttpError(422, "type is required")
	}
	if value == "" {
		return nil, NewHttpError(422, "enum value is required")
	}
	var count int64
	s.db.Table("enum_constants").Where("type = ? AND enum = ?", t, value).Count(&count)
	if count > 0 {
		return nil, NewHttpError(409, "Enum value already exists for this type")
	}
	row := map[string]any{"type": t, "enum": value}
	if err := s.db.Table("enum_constants").Create(&row).Error; err != nil {
		return nil, err
	}
	return row, nil
}

func (s *EnumService) DeleteValue(id string) error {
	res := s.db.Table("enum_constants").Where("id = ?", id).Delete(nil)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return NewHttpError(404, "Enum value not found")
	}
	return nil
}
