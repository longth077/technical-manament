package service

import (
	"encoding/base64"
	"encoding/csv"
	"errors"
	"fmt"
	"regexp"
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
		table, ok := constants.ResolveEntityTable(entity)
		if !ok {
			continue
		}
		var rows []map[string]any
		if err := s.db.Table(table).Find(&rows).Error; err != nil {
			return "", err
		}
		lines = append(lines, fmt.Sprintf("DELETE FROM %s;", table))
		for _, row := range rows {
			keys := make([]string, 0, len(row))
			vals := make([]string, 0, len(row))
			for k, v := range row {
				keys = append(keys, k)
				vals = append(vals, sqlValue(v))
			}
			lines = append(lines, fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s);", table, strings.Join(keys, ","), strings.Join(vals, ",")))
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
			if strings.EqualFold(trimmed, "SET FOREIGN_KEY_CHECKS=0") || strings.EqualFold(trimmed, "SET FOREIGN_KEY_CHECKS=1") {
				continue
			}
			if table, ok := parseDeleteStatement(trimmed); ok {
				if err := tx.Table(table).Where("1 = 1").Delete(nil).Error; err != nil {
					return err
				}
				continue
			}
			table, payload, ok, err := parseInsertStatement(trimmed)
			if err != nil {
				return err
			}
			if ok {
				if err := tx.Table(table).Create(payload).Error; err != nil {
					return err
				}
				continue
			}
			return NewHttpError(422, "Only exported SQL format is supported for import")
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
		table, ok := constants.ResolveEntityTable(entity)
		if !ok {
			continue
		}
		var rows []map[string]any
		if err := s.db.Table(table).Order("id ASC").Find(&rows).Error; err != nil {
			return nil, err
		}
		if len(rows) == 0 {
			files = append(files, struct {
				name string
				data string
			}{name: table + ".csv", data: ""})
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
		}{name: table + ".csv", data: b.String()})
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
			table, ok := constants.ResolveEntityTable(entity)
			if !ok {
				continue
			}
			reader := csv.NewReader(strings.NewReader(entry.Content))
			records, err := reader.ReadAll()
			if err != nil {
				return err
			}
			if err := tx.Table(table).Where("1 = 1").Delete(nil).Error; err != nil {
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
				if err := tx.Table(table).Create(payload).Error; err != nil {
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

var (
	deletePattern = regexp.MustCompile(`(?i)^DELETE\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)$`)
	insertPattern = regexp.MustCompile(`(?i)^INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.+)\)\s+VALUES\s*\((.+)\)$`)
)

func parseDeleteStatement(stmt string) (string, bool) {
	match := deletePattern.FindStringSubmatch(stmt)
	if len(match) != 2 {
		return "", false
	}
	table, ok := constants.ResolveEntityTable(match[1])
	return table, ok
}

func parseInsertStatement(stmt string) (string, map[string]any, bool, error) {
	match := insertPattern.FindStringSubmatch(stmt)
	if len(match) != 4 {
		return "", nil, false, nil
	}
	table, ok := constants.ResolveEntityTable(match[1])
	if !ok {
		return "", nil, false, NewHttpError(422, "Unsupported entity in SQL import")
	}
	columns := strings.Split(match[2], ",")
	values, err := splitSQLValues(match[3])
	if err != nil {
		return "", nil, false, err
	}
	if len(columns) != len(values) {
		return "", nil, false, errors.New("invalid SQL import format")
	}
	payload := map[string]any{}
	for i := range columns {
		col := strings.TrimSpace(columns[i])
		payload[col] = parseSQLLiteral(values[i])
	}
	return table, payload, true, nil
}

func splitSQLValues(raw string) ([]string, error) {
	parts := make([]string, 0)
	var current strings.Builder
	inQuote := false
	escaped := false
	for _, ch := range raw {
		if escaped {
			current.WriteRune(ch)
			escaped = false
			continue
		}
		if ch == '\\' {
			current.WriteRune(ch)
			escaped = true
			continue
		}
		if ch == '\'' {
			current.WriteRune(ch)
			inQuote = !inQuote
			continue
		}
		if ch == ',' && !inQuote {
			parts = append(parts, strings.TrimSpace(current.String()))
			current.Reset()
			continue
		}
		current.WriteRune(ch)
	}
	if inQuote {
		return nil, errors.New("invalid SQL import format")
	}
	parts = append(parts, strings.TrimSpace(current.String()))
	return parts, nil
}

func parseSQLLiteral(v string) any {
	trimmed := strings.TrimSpace(v)
	if strings.EqualFold(trimmed, "NULL") {
		return nil
	}
	if strings.HasPrefix(trimmed, "'") && strings.HasSuffix(trimmed, "'") && len(trimmed) >= 2 {
		unquoted := trimmed[1 : len(trimmed)-1]
		unquoted = strings.ReplaceAll(unquoted, "\\'", "'")
		unquoted = strings.ReplaceAll(unquoted, "\\\\", "\\")
		return unquoted
	}
	return trimmed
}
