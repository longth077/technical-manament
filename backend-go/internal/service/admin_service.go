package service

import (
	"encoding/base64"
	"encoding/csv"
	"fmt"
	"strings"

	"technical-management/backend-go/internal/constants"

	"gorm.io/gorm"
)

type AdminService struct {
	db *gorm.DB
}

func NewAdminService(db *gorm.DB) *AdminService {
	return &AdminService{db: db}
}

func (s *AdminService) ListUsers() ([]map[string]any, error) {
	var users []map[string]any
	err := s.db.Table("users").Select("id, username, email, full_name as fullName, role, status, created_at as createdAt").Order("id ASC").Find(&users).Error
	return users, err
}

func (s *AdminService) ListPendingUsers() ([]map[string]any, error) {
	var users []map[string]any
	err := s.db.Table("users").Select("id, username, email, full_name as fullName, role, status").Where("status = ?", "pending").Order("created_at ASC").Find(&users).Error
	return users, err
}

func (s *AdminService) ApproveUser(id string) error {
	res := s.db.Table("users").Where("id = ?", id).Update("status", "approved")
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return NewHttpError(404, "User not found")
	}
	return nil
}

func (s *AdminService) UpdateRole(id string, role string) error {
	res := s.db.Table("users").Where("id = ?", id).Update("role", role)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return NewHttpError(404, "User not found")
	}
	return nil
}

func (s *AdminService) DeleteUser(id string) error {
	res := s.db.Table("users").Where("id = ?", id).Delete(nil)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return NewHttpError(404, "User not found")
	}
	return nil
}

func (s *AdminService) ExportSQL() (string, error) {
	lines := []string{"SET FOREIGN_KEY_CHECKS=0;"}
	for _, entity := range constants.EntityNames {
		var rows []map[string]any
		if err := s.db.Table(entity).Find(&rows).Error; err != nil {
			return "", err
		}
		lines = append(lines, fmt.Sprintf("DELETE FROM %s;", entity))
		for _, row := range rows {
			keys := make([]string, 0, len(row))
			vals := make([]string, 0, len(row))
			for k, v := range row {
				keys = append(keys, k)
				vals = append(vals, sqlValue(v))
			}
			lines = append(lines, fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s);", entity, strings.Join(keys, ","), strings.Join(vals, ",")))
		}
	}
	lines = append(lines, "SET FOREIGN_KEY_CHECKS=1;")
	return strings.Join(lines, "\n"), nil
}

func (s *AdminService) ImportSQL(sql string) error {
	stmts := strings.Split(sql, ";")
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, stmt := range stmts {
			trimmed := strings.TrimSpace(stmt)
			if trimmed == "" {
				continue
			}
			if err := tx.Exec(trimmed).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (s *AdminService) ExportCSVZip() ([]byte, error) {
	var files []struct {
		name string
		data string
	}
	for _, entity := range constants.EntityNames {
		var rows []map[string]any
		if err := s.db.Table(entity).Order("id ASC").Find(&rows).Error; err != nil {
			return nil, err
		}
		if len(rows) == 0 {
			files = append(files, struct {
				name string
				data string
			}{name: entity + ".csv", data: ""})
			continue
		}
		headers := make([]string, 0, len(rows[0]))
		for key := range rows[0] {
			headers = append(headers, key)
		}
		var b strings.Builder
		w := csv.NewWriter(&b)
		_ = w.Write(headers)
		for _, row := range rows {
			record := make([]string, len(headers))
			for i, h := range headers {
				record[i] = fmt.Sprintf("%v", row[h])
				if row[h] == nil {
					record[i] = ""
				}
			}
			_ = w.Write(record)
		}
		w.Flush()
		files = append(files, struct {
			name string
			data string
		}{name: entity + ".csv", data: b.String()})
	}
	return zipFiles(files)
}

func (s *AdminService) ImportCSVZip(base64Zip string) error {
	data, err := base64.StdEncoding.DecodeString(base64Zip)
	if err != nil {
		return err
	}
	entries, err := unzipFiles(data)
	if err != nil {
		return err
	}
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, entry := range entries {
			entity := strings.TrimSuffix(entry.Name, ".csv")
			if !constants.IsValidEntity(entity) {
				continue
			}
			reader := csv.NewReader(strings.NewReader(entry.Content))
			records, err := reader.ReadAll()
			if err != nil {
				return err
			}
			if err := tx.Exec("DELETE FROM " + entity).Error; err != nil {
				return err
			}
			if len(records) <= 1 {
				continue
			}
			headers := records[0]
			for _, r := range records[1:] {
				payload := map[string]any{}
				for i, h := range headers {
					if i < len(r) {
						if strings.TrimSpace(r[i]) == "" {
							payload[h] = nil
						} else {
							payload[h] = r[i]
						}
					}
				}
				if err := tx.Table(entity).Create(payload).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}

func sqlValue(v any) string {
	if v == nil {
		return "NULL"
	}
	s := fmt.Sprintf("%v", v)
	s = strings.ReplaceAll(s, `\\`, `\\\\`)
	s = strings.ReplaceAll(s, `'`, `\\'`)
	return "'" + s + "'"
}
