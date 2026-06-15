package handler

import (
	"net/http"

	"technical-management/backend-go/internal/middleware"
	"technical-management/backend-go/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Service *service.AuthService
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=8,max=255"`
		FullName string `json:"fullName" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	user, err := h.Service.Signup(req.Username, req.Email, req.Password, req.FullName)
	if err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Signup submitted and waiting for admin approval", "user": user})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userAny, _ := c.Get("user")
	user := userAny.(*service.User)
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	var req struct {
		CurrentPassword string `json:"currentPassword" binding:"required"`
		NewPassword     string `json:"newPassword" binding:"required,min=8,max=255"`
		ConfirmPassword string `json:"confirmPassword" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}
	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"message": "confirmPassword does not match"})
		return
	}
	userAny, _ := c.Get("user")
	user := userAny.(*service.User)
	if err := h.Service.ChangePassword(user.ID, req.CurrentPassword, req.NewPassword); err != nil {
		middleware.HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}
