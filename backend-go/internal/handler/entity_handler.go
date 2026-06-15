package handler

import (
	"net/http"

	"technical-management/backend-go/internal/middleware"
	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

type EntityHandler struct {
	Service *service.EntityService
}

func (h *EntityHandler) List(c *gin.Context) {
	query := map[string]string{}
	for k, v := range c.Request.URL.Query() {
		if len(v) > 0 {
			query[k] = v[0]
		}
	}
	result, err := h.Service.List(c.Param("entity"), query)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EntityHandler) Create(c *gin.Context) {
	payload := map[string]any{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	row, err := h.Service.Create(c.Param("entity"), payload)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"row": row})
}

func (h *EntityHandler) Update(c *gin.Context) {
	payload := map[string]any{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	row, err := h.Service.Update(c.Param("entity"), c.Param("id"), payload)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"row": row})
}

func (h *EntityHandler) Delete(c *gin.Context) {
	if err := h.Service.Delete(c.Param("entity"), c.Param("id")); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func (h *EntityHandler) ReportExcel(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Entity report export is not implemented in Go backend yet"})
}
