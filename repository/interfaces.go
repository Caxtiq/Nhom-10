package repository

import "shift-management/domain"

type UserRepository interface {
	Save(user *domain.User) error
	FindAll() ([]*domain.User, error)
	FindByID(id uint) (*domain.User, error)
	FindByUsername(username string) (*domain.User, error)
}

type ShiftRepository interface {
	Save(shift *domain.Shift) error
	FindByUserID(userID uint) ([]*domain.Shift, error)
	FindAll() ([]*domain.Shift, error)
	Delete(id uint) error
	FindByID(id uint) (*domain.Shift, error)
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
