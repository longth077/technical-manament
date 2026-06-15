package handler

import (
	"net/http"
	"time"

	"technical-management/backend-go/internal/middleware"
	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	Service *service.AdminService
}

func (h *AdminHandler) GetUsers(c *gin.Context) {
	users, err := h.Service.ListUsers()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (h *AdminHandler) GetPendingUsers(c *gin.Context) {
	users, err := h.Service.ListPendingUsers()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (h *AdminHandler) ApproveUser(c *gin.Context) {
	if err := h.Service.ApproveUser(c.Param("userId")); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User approved"})
}

func (h *AdminHandler) UpdateRole(c *gin.Context) {
	var req struct {
		Role string `json:"role" binding:"required,oneof=admin user readonly"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid role"})
		return
	}
	if err := h.Service.UpdateRole(c.Param("userId"), req.Role); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Role updated"})
}

func (h *AdminHandler) DeleteUser(c *gin.Context) {
	if err := h.Service.DeleteUser(c.Param("userId")); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}

func (h *AdminHandler) ExportSQL(c *gin.Context) {
	sql, err := h.Service.ExportSQL()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.Header("Content-Type", "application/sql")
	c.Header("Content-Disposition", `attachment; filename="technical-management.sql"`)
	c.String(http.StatusOK, sql)
}

func (h *AdminHandler) ImportSQL(c *gin.Context) {
	var req struct {
		SQL string `json:"sql" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	if err := h.Service.ImportSQL(req.SQL); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "SQL imported"})
}

func (h *AdminHandler) ExportCSV(c *gin.Context) {
	data, err := h.Service.ExportCSVZip()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.Header("Content-Type", "application/zip")
	c.Header("Content-Disposition", `attachment; filename="technical-management-csv.zip"`)
	c.Data(http.StatusOK, "application/zip", data)
}

func (h *AdminHandler) ImportCSV(c *gin.Context) {
	var req struct {
		Base64 string `json:"base64" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	if err := h.Service.ImportCSVZip(req.Base64); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "CSV imported"})
}

func (h *AdminHandler) ExportExcel(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Excel export is not implemented in Go backend yet"})
}

func (h *AdminHandler) ImportExcel(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Excel import is not implemented in Go backend yet"})
}

func (h *AdminHandler) ExportAllReports(c *gin.Context) {
	dateTag := time.Now().Format("20060102")
	c.Header("Content-Disposition", `attachment; filename="bao-cao-toan-he-thong-`+dateTag+`.xlsx"`)
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Report export is not implemented in Go backend yet"})
}
