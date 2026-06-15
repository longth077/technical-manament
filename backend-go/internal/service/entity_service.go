package service

import (
	"fmt"
	"strconv"
	"strings"

	"technical-management/backend-go/internal/constants"

	"gorm.io/gorm"
)

type EntityService struct {
	db *gorm.DB
}

func NewEntityService(db *gorm.DB) *EntityService {
	return &EntityService{db: db}
}

func (s *EntityService) List(entity string, query map[string]string) (map[string]any, error) {
	table, ok := constants.ResolveEntityTable(entity)
	if !ok {
		return nil, NewHttpError(404, "Invalid entity")
	}
	db := s.db.Table(table)
	for _, field := range constants.FilterFields[entity] {
		if v, ok := query[field]; ok && strings.TrimSpace(v) != "" {
			db = db.Where(fmt.Sprintf("%s = ?", field), v)
		}
	}
	if query["page"] != "" || query["limit"] != "" {
		page, _ := strconv.Atoi(query["page"])
		limit, _ := strconv.Atoi(query["limit"])
		if page <= 0 {
			page = 1
		}
		if limit <= 0 {
			limit = 50
		}
		if limit > 200 {
			limit = 200
		}
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
	var rows []map[string]any
	if err := db.Find(&rows).Error; err != nil {
		return nil, err
	}
	return map[string]any{"rows": rows}, nil
}

func (s *EntityService) Create(entity string, payload map[string]any) (map[string]any, error) {
	table, ok := constants.ResolveEntityTable(entity)
	if !ok {
		return nil, NewHttpError(404, "Invalid entity")
	}
	clean(payload)
	if err := s.db.Table(table).Create(&payload).Error; err != nil {
		return nil, err
	}
	if id, ok := payload["id"]; ok {
		var row map[string]any
		s.db.Table(table).Where("id = ?", id).Take(&row)
		return row, nil
	}
	return payload, nil
}

func (s *EntityService) Update(entity string, id string, payload map[string]any) (map[string]any, error) {
	table, ok := constants.ResolveEntityTable(entity)
	if !ok {
		return nil, NewHttpError(404, "Invalid entity")
	}
	clean(payload)
	res := s.db.Table(table).Where("id = ?", id).Updates(payload)
	if res.Error != nil {
		return nil, res.Error
	}
	if res.RowsAffected == 0 {
		return nil, NewHttpError(404, "Record not found")
	}
	var row map[string]any
	if err := s.db.Table(table).Where("id = ?", id).Take(&row).Error; err != nil {
		return nil, err
	}
	return row, nil
}

func (s *EntityService) Delete(entity string, id string) error {
	table, ok := constants.ResolveEntityTable(entity)
	if !ok {
		return NewHttpError(404, "Invalid entity")
	}
	res := s.db.Table(table).Where("id = ?", id).Delete(nil)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return NewHttpError(404, "Record not found")
	}
	return nil
}

func clean(payload map[string]any) {
	delete(payload, "id")
	delete(payload, "created_at")
	delete(payload, "updated_at")
}
