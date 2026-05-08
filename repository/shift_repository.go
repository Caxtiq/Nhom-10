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

func (r *shiftRepo) FindByUserID(userID uint) ([]*domain.Shift, error) {
	var shifts []*domain.Shift
	err := r.db.Where("user_id = ?", userID).Find(&shifts).Error
	return shifts, err
}

func (r *shiftRepo) FindByID(id uint) (*domain.Shift, error) {
	var shift domain.Shift
	err := r.db.First(&shift, id).Error
	if err != nil {
		return nil, err
	}
	return &shift, nil
}

func (r *shiftRepo) FindAll() ([]*domain.Shift, error) {
	var shifts []*domain.Shift
	err := r.db.Find(&shifts).Error
	return shifts, err
}

func (r *shiftRepo) Delete(id uint) error {
	return r.db.Delete(&domain.Shift{}, id).Error
}

func (r *shiftRepo) Update(shift *domain.Shift) error {
	return r.db.Save(shift).Error
}
