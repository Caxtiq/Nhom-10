package repository

import (
	"shift-management/domain"

	"gorm.io/gorm"
)

type shiftRepo struct {
	db *gorm.DB
}

func NewShiftRepository(db *gorm.DB) ShiftRepository {
	return &shiftRepo{db: db}
}

func (r *shiftRepo) Save(shift *domain.Shift) error {
	return r.db.Save(shift).Error
}

func (r *shiftRepo) FindByUserId(userId uint) ([]*domain.Shift, error) {
	var shifts []*domain.Shift
	err := r.db.Where("user_id = ?", userId).Find(&shifts).Error
	return shifts, err
}

func (r *shiftRepo) FindAll() ([]*domain.Shift, error) {
	var shifts []*domain.Shift
	err := r.db.Find(&shifts).Error
	return shifts, err
}

func (r *shiftRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Shift{}, id).Error
}
