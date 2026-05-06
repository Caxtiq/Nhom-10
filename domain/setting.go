package domain

import "gorm.io/gorm"

type SystemSetting struct {
	gorm.Model
	MaxShiftHours float64 `gorm:"default:8.0"`
}
