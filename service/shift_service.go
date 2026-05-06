package service

import (
	"errors"
	"shift-management/domain"
	"shift-management/repository"
)

type shiftService struct {
	repo repository.ShiftRepository
}

func NewShiftService(repo repository.ShiftRepository) ShiftService {
	return &shiftService{repo: repo}
}

func (s *shiftService) ScheduleShift(shift *domain.Shift) error {
	if shift.StartTime.After(shift.EndTime) {
		return errors.New("start time must be before end time")
	}
	return s.repo.Save(shift)
}

func (s *shiftService) GetShiftsByUser(userId uint) ([]*domain.Shift, error) {
	return s.repo.FindByUserId(userId)
}

func (s *shiftService) GetAllShifts() ([]*domain.Shift, error) {
	return s.repo.FindAll()
}
