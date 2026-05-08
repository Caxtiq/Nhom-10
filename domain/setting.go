package domain

import "gorm.io/gorm"

type SystemSetting struct {
	gorm.Model
	MaxShiftHours float64 `json:"MaxShiftHours"`
	MinRestHours  float64 `json:"MinRestHours" gorm:"default:11.0"`
}
