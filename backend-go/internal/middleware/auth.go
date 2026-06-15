package middleware

import (
	"net/http"

	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	AuthService *service.AuthService
}

func (m *AuthMiddleware) RequireBasicAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		username, password, ok := c.Request.BasicAuth()
		if !ok || username == "" || password == "" {
			c.Header("WWW-Authenticate", `Basic realm="Technical Management"`)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Authentication required"})
			return
		}
		user, err := m.AuthService.Authenticate(username, password)
		if err != nil {
			handleError(c, err)
			return
		}
		if user == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
			return
		}
		c.Set("user", user)
		c.Next()
	}
}

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userAny, ok := c.Get("user")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Authentication required"})
			return
		}
		user := userAny.(*service.User)
		for _, role := range roles {
			if user.Role == role {
				c.Next()
				return
			}
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Forbidden"})
	}
}

func RequireWriteAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		userAny, ok := c.Get("user")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Authentication required"})
			return
		}
		user := userAny.(*service.User)
		if user.Role == "readonly" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Read-only role cannot edit data"})
			return
		}
		c.Next()
	}
}
