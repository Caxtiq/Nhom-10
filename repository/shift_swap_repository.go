package repository

import (
	"shift-management/domain"
	"gorm.io/gorm"
)

type shiftSwapRepository struct {
	db *gorm.DB
}

func NewShiftSwapRepository(db *gorm.DB) ShiftSwapRepository {
	return &shiftSwapRepository{db}
}

func (r *shiftSwapRepository) Save(swap *domain.ShiftSwap) error {
	return r.db.Create(swap).Error
}

func (r *shiftSwapRepository) FindByID(id uint) (*domain.ShiftSwap, error) {
	var swap domain.ShiftSwap
	err := r.db.First(&swap, id).Error
	return &swap, err
}

func (r *shiftSwapRepository) FindByStatus(status string) ([]*domain.ShiftSwap, error) {
	var swaps []*domain.ShiftSwap
	err := r.db.Where("status = ?", status).Find(&swaps).Error
	return swaps, err
}

func (r *shiftSwapRepository) Update(swap *domain.ShiftSwap) error {
	return r.db.Save(swap).Error
}
