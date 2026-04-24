package service

import "shift-management/domain"

type UserService interface {
	RegisterUser(user *domain.User) error
	Authenticate(email, password string) (*domain.User, error)
}

type ShiftService interface {
	ScheduleShift(shift *domain.Shift) error
	GetShiftsByUser(userId uint) ([]*domain.Shift, error)
}

type TimeOffService interface {
	SubmitRequest(req *domain.TimeOffRequest) error
	ReviewRequest(reqId uint, status domain.TimeOffStatus) error
}
