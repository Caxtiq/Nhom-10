package domain

import "gorm.io/gorm"

type ShiftSwap struct {
	gorm.Model
	RequesterID   uint   `json:"RequesterID"`
	TargetUserID  uint   `json:"TargetUserID"`
	ShiftID       uint   `json:"ShiftID"`
	Status        string `json:"Status" gorm:"default:'pending'"` // pending, approved, rejected
}
