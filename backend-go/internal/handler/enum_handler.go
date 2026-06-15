package handler

import (
	"net/http"
	"strconv"

	"technical-management/backend-go/internal/middleware"
	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

type EnumHandler struct {
	Service *service.EnumService
}

func (h *EnumHandler) ListTypes(c *gin.Context) {
	types, err := h.Service.ListTypes()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"types": types})
}

func (h *EnumHandler) ListByType(c *gin.Context) {
	page, _ := strconv.Atoi(c.Query("page"))
	limit, _ := strconv.Atoi(c.Query("limit"))
	result, err := h.Service.ListByType(c.Param("type"), page, limit)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EnumHandler) AddValue(c *gin.Context) {
	var req struct {
		Enum string `json:"enum" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "enum value is required"})
		return
	}
	row, err := h.Service.AddValue(c.Param("type"), req.Enum)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"row": row})
}

func (h *EnumHandler) DeleteValue(c *gin.Context) {
	if err := h.Service.DeleteValue(c.Param("id")); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
