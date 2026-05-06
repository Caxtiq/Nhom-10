package repository

import (
	"shift-management/domain"

	"gorm.io/gorm"
)

type settingRepo struct {
	db *gorm.DB
}

func NewSettingRepository(db *gorm.DB) SettingRepository {
	return &settingRepo{db: db}
}

func (r *settingRepo) Get() (*domain.SystemSetting, error) {
	var setting domain.SystemSetting
	err := r.db.First(&setting).Error
	return &setting, err
}

func (r *settingRepo) Update(setting *domain.SystemSetting) error {
	return r.db.Save(setting).Error
}
