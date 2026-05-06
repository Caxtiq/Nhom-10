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
	FindAll() ([]*domain.Shift, error)
	Delete(id uint) error
}

type TaskRepository interface {
	Save(task *domain.Task) error
	FindAll() ([]*domain.Task, error)
	FindUnassigned() ([]*domain.Task, error)
	Update(task *domain.Task) error
}

type SettingRepository interface {
	Get() (*domain.SystemSetting, error)
	Update(setting *domain.SystemSetting) error
}

// ... other repositories like LocationRepository, TimeOffRepository
