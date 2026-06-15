package middleware

import (
	"net/http"

	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

func handleError(c *gin.Context, err error) {
	if httpErr, ok := err.(service.HttpError); ok {
		c.AbortWithStatusJSON(httpErr.Status, gin.H{"message": httpErr.Message})
		return
	}
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
}

func Recover() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered any) {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
	})
}
