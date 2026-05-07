package domain

import "gorm.io/gorm"

type Notification struct {
	gorm.Model
	UserID  uint   `json:"UserID"`
	Message string `json:"Message"`
	IsRead  bool   `json:"IsRead" gorm:"default:false"`
}
