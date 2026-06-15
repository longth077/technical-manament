package service

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID       uint64 `gorm:"column:id;primaryKey" json:"id"`
	Username string `gorm:"column:username" json:"username"`
	Email    string `gorm:"column:email" json:"email"`
	Password string `gorm:"column:password" json:"-"`
	FullName string `gorm:"column:full_name" json:"fullName"`
	Role     string `gorm:"column:role" json:"role"`
	Status   string `gorm:"column:status" json:"status"`
}

func (User) TableName() string { return "users" }

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) EnsureDefaultAdmin() error {
	hash, err := bcrypt.GenerateFromPassword([]byte("dank4920132018"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	var existing User
	err = s.db.Where("username = ?", "admin").First(&existing).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		user := User{
			Username: "admin",
			Email:    "thanhpxd49@gmail.com",
			Password: string(hash),
			FullName: "Administrator",
			Role:     "admin",
			Status:   "approved",
		}
		return s.db.Create(&user).Error
	}
	if err != nil {
		return err
	}
	return s.db.Model(&existing).Updates(map[string]any{
		"email":     "thanhpxd49@gmail.com",
		"password":  string(hash),
		"full_name": "Administrator",
		"role":      "admin",
		"status":    "approved",
	}).Error
}

func (s *AuthService) Signup(username, email, password, fullName string) (*User, error) {
	var count int64
	s.db.Model(&User{}).Where("username = ?", username).Count(&count)
	if count > 0 {
		return nil, NewHttpError(409, "Username already exists")
	}
	s.db.Model(&User{}).Where("email = ?", email).Count(&count)
	if count > 0 {
		return nil, NewHttpError(409, "Email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := User{
		Username: username,
		Email:    email,
		Password: string(hash),
		FullName: fullName,
		Role:     "user",
		Status:   "pending",
	}
	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *AuthService) Authenticate(credential, password string) (*User, error) {
	var user User
	if err := s.db.Where("username = ? OR email = ?", credential, credential).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, nil
	}
	if user.Status != "approved" {
		return nil, NewHttpError(403, "Account is pending approval")
	}
	return &user, nil
}

func (s *AuthService) ChangePassword(userID uint64, currentPassword, newPassword string) error {
	var user User
	if err := s.db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewHttpError(404, "User not found")
		}
		return err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)); err != nil {
		return NewHttpError(400, "Current password is incorrect")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.db.Model(&user).Update("password", string(hash)).Error
}
