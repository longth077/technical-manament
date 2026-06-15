package handler

import (
	"errors"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"technical-management/backend-go/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type WarehouseImageHandler struct {
	DB       *gorm.DB
	ImageDir string
}

func (h *WarehouseImageHandler) Upload(c *gin.Context) {
	warehouseID := c.PostForm("warehouse_id")
	if strings.TrimSpace(warehouseID) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "warehouse_id là bắt buộc"})
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Không có file được tải lên"})
		return
	}
	if !isAllowedImage(file) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Chỉ chấp nhận file ảnh (jpeg, png, gif, webp)"})
		return
	}
	filename := strconv.FormatInt(time.Now().UnixNano(), 10) + filepath.Ext(file.Filename)
	storedPath := filepath.Join(h.ImageDir, filename)
	if err := c.SaveUploadedFile(file, storedPath); err != nil {
		middleware.HandleError(c, err)
		return
	}
	fileTypeID := c.PostForm("file_type_id")
	if strings.TrimSpace(fileTypeID) == "" {
		fileTypeID = "1"
	}
	row := map[string]any{
		"warehouse_id": warehouseID,
		"file_path":    storedPath,
		"file_type_id": fileTypeID,
		"description":  c.PostForm("description"),
	}
	if err := h.DB.Table("warehouse_images").Create(&row).Error; err != nil {
		_ = os.Remove(storedPath)
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"row": row})
}

func (h *WarehouseImageHandler) Remove(c *gin.Context) {
	id := c.Param("id")
	var row map[string]any
	if err := h.DB.Table("warehouse_images").Where("id = ?", id).Take(&row).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Không tìm thấy"})
			return
		}
		middleware.HandleError(c, err)
		return
	}
	if filePath, ok := row["file_path"].(string); ok && strings.TrimSpace(filePath) != "" {
		_ = os.Remove(filePath)
	}
	if err := h.DB.Table("warehouse_images").Where("id = ?", id).Delete(nil).Error; err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func isAllowedImage(file *multipart.FileHeader) bool {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif", ".webp":
		return true
	default:
		return false
	}
}
