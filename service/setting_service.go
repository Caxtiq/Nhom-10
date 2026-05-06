package service

import (
	"shift-management/domain"
	"shift-management/repository"
)

type settingService struct {
	repo repository.SettingRepository
}

func NewSettingService(repo repository.SettingRepository) SettingService {
	return &settingService{repo: repo}
}

func (s *settingService) GetSetting() (*domain.SystemSetting, error) {
	return s.repo.Get()
}

func (s *settingService) UpdateSetting(maxHours float64) error {
	setting, err := s.repo.Get()
	if err != nil {
		return err
	}
	setting.MaxShiftHours = maxHours
	return s.repo.Update(setting)
}
