package domain

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Title        string    `gorm:"type:varchar(255);not null"`
	Description  string    `gorm:"type:text"`
	StartTime    time.Time `gorm:"not null"`
	EndTime      time.Time `gorm:"not null"`
	RequiredRole Role      `gorm:"type:varchar(20);not null"`
	IsAssigned   bool      `gorm:"default:false"`
	AssignedTo   *uint     `gorm:"index"` // Nullable, points to UserID if assigned
}
