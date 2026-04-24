package repository

import "shift-management/domain"

type UserRepository interface {
	Save(user *domain.User) error
	FindById(id uint) (*domain.User, error)
	FindAll() ([]*domain.User, error)
}

type ShiftRepository interface {
	Save(shift *domain.Shift) error
	FindByUserId(userId uint) ([]*domain.Shift, error)
	Delete(id uint) error
}

// ... other repositories like LocationRepository, TimeOffRepository
