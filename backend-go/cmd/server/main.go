package main

import (
	"log"

	"technical-management/backend-go/internal/config"
	"technical-management/backend-go/internal/database"
	"technical-management/backend-go/internal/router"
	"technical-management/backend-go/internal/service"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	authService := service.NewAuthService(db)
	if err := authService.EnsureDefaultAdmin(); err != nil {
		log.Fatalf("failed to ensure default admin: %v", err)
	}
	r := router.New(db)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
