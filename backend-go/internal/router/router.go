package router

import (
	"os"
	"path/filepath"

	"technical-management/backend-go/internal/handler"
	"technical-management/backend-go/internal/middleware"
	"technical-management/backend-go/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func New(db *gorm.DB) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(middleware.Recover())
	r.Use(cors.Default())

	authService := service.NewAuthService(db)
	adminService := service.NewAdminService(db)
	entityService := service.NewEntityService(db)
	enumService := service.NewEnumService(db)

	authHandler := &handler.AuthHandler{Service: authService}
	adminHandler := &handler.AdminHandler{Service: adminService}
	entityHandler := &handler.EntityHandler{Service: entityService}
	enumHandler := &handler.EnumHandler{Service: enumService}

	imageDir := filepath.Clean(filepath.Join("..", "warehouse_images"))
	_ = os.MkdirAll(imageDir, 0o755)
	warehouseHandler := &handler.WarehouseImageHandler{DB: db, ImageDir: imageDir}

	authMw := (&middleware.AuthMiddleware{AuthService: authService}).RequireBasicAuth()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})
	r.Static("/uploads/warehouse_images", imageDir)

	api := r.Group("/api")
	{
		api.POST("/auth/signup", authHandler.Signup)
		api.GET("/auth/me", authMw, authHandler.Me)
		api.POST("/auth/change-password", authMw, authHandler.ChangePassword)

		api.GET("/admin/users", authMw, middleware.RequireRole("admin"), adminHandler.GetUsers)
		api.GET("/admin/users/pending", authMw, middleware.RequireRole("admin"), adminHandler.GetPendingUsers)
		api.PATCH("/admin/users/:userId/approve", authMw, middleware.RequireRole("admin"), adminHandler.ApproveUser)
		api.PATCH("/admin/users/:userId/role", authMw, middleware.RequireRole("admin"), adminHandler.UpdateRole)
		api.DELETE("/admin/users/:userId", authMw, middleware.RequireRole("admin"), adminHandler.DeleteUser)
		api.GET("/admin/reports/excel", authMw, middleware.RequireRole("admin", "user"), adminHandler.ExportAllReports)

		api.GET("/admin/export/sql", authMw, middleware.RequireRole("admin"), adminHandler.ExportSQL)
		api.GET("/admin/export/excel", authMw, middleware.RequireRole("admin"), adminHandler.ExportExcel)
		api.POST("/admin/import/sql", authMw, middleware.RequireRole("admin"), adminHandler.ImportSQL)
		api.POST("/admin/import/excel", authMw, middleware.RequireRole("admin"), adminHandler.ImportExcel)
		api.GET("/admin/export/csv", authMw, middleware.RequireRole("admin"), adminHandler.ExportCSV)
		api.POST("/admin/import/csv", authMw, middleware.RequireRole("admin"), adminHandler.ImportCSV)

		api.POST("/warehouse-images/upload", authMw, middleware.RequireWriteAccess(), warehouseHandler.Upload)
		api.DELETE("/warehouse-images/:id", authMw, middleware.RequireWriteAccess(), warehouseHandler.Remove)

		api.GET("/entities/:entity", authMw, entityHandler.List)
		api.POST("/entities/:entity", authMw, middleware.RequireWriteAccess(), entityHandler.Create)
		api.PUT("/entities/:entity/:id", authMw, middleware.RequireWriteAccess(), entityHandler.Update)
		api.DELETE("/entities/:entity/:id", authMw, middleware.RequireWriteAccess(), entityHandler.Delete)
		api.GET("/reports/:entity/excel", authMw, middleware.RequireRole("admin", "user"), entityHandler.ReportExcel)

		api.GET("/enums", authMw, enumHandler.ListTypes)
		api.GET("/enums/:type", authMw, enumHandler.ListByType)
		api.POST("/enums/:type", authMw, middleware.RequireWriteAccess(), enumHandler.AddValue)
		api.DELETE("/enums/:type/:id", authMw, middleware.RequireRole("admin", "user"), enumHandler.DeleteValue)
	}

	return r
}
