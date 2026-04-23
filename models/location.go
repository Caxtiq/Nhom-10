package models

import (
	"gorm.io/gorm"
)

// Location represents a physical location or department where shifts take place
type Location struct {
	gorm.Model
	Name    string  `gorm:"type:varchar(100);not null"`
	Address string  `gorm:"type:varchar(255)"`
	Shifts  []Shift `gorm:"foreignKey:LocationID"`
}
