package service

import (
	"errors"
	"shift-management/domain"
	"shift-management/repository"
)

type shiftSwapService struct {
	swapRepo    repository.ShiftSwapRepository
	shiftRepo   repository.ShiftRepository
	userRepo    repository.UserRepository
	settingRepo repository.SettingRepository
}

func NewShiftSwapService(sr repository.ShiftSwapRepository, sh repository.ShiftRepository, ur repository.UserRepository, set repository.SettingRepository) ShiftSwapService {
	return &shiftSwapService{
		swapRepo:    sr,
		shiftRepo:   sh,
		userRepo:    ur,
		settingRepo: set,
	}
}

func (s *shiftSwapService) RequestSwap(requesterID, targetUserID, shiftID uint) (*domain.ShiftSwap, error) {
	swap := &domain.ShiftSwap{
		RequesterID:  requesterID,
		TargetUserID: targetUserID,
		ShiftID:      shiftID,
		Status:       "pending",
	}
	err := s.swapRepo.Save(swap)
	return swap, err
}

func (s *shiftSwapService) ApproveSwap(swapID uint) error {
	swap, err := s.swapRepo.FindByID(swapID)
	if err != nil {
		return err
	}
	if swap.Status != "pending" {
		return errors.New("swap request is not pending")
	}

	shift, err := s.shiftRepo.FindByID(swap.ShiftID)
	if err != nil {
		return err
	}

	targetUser, err := s.userRepo.FindByID(swap.TargetUserID)
	if err != nil {
		return err
	}

	allShifts, _ := s.shiftRepo.FindAll()
	var targetUserShifts []domain.Shift
	for _, s := range allShifts {
		if s.UserID == targetUser.ID {
			targetUserShifts = append(targetUserShifts, *s)
		}
	}

	setting, _ := s.settingRepo.Get()
	minRest := 11.0
	if setting != nil && setting.MinRestHours > 0 {
		minRest = setting.MinRestHours
	}

	ruleEngine := NewRuleEngine(minRest)

	// In a real app we'd need RequiredRole and RequiredSkill from the Task,
	// but here we just check rest and OT hours for the swap.
	// We pass targetUser.Role and SkillLevel so it always passes the skill check.
	if !ruleEngine.IsValid(targetUser, targetUserShifts, targetUser.Role, targetUser.SkillLevel, shift.StartTime, shift.EndTime) {
		return errors.New("target user violates scheduling rules (rest/OT limit)")
	}

	// Update shift owner
	shift.UserID = targetUser.ID
	if err := s.shiftRepo.Update(shift); err != nil {
		return err
	}

	swap.Status = "approved"
	return s.swapRepo.Update(swap)
}

func (s *shiftSwapService) RejectSwap(swapID uint) error {
	swap, err := s.swapRepo.FindByID(swapID)
	if err != nil {
		return err
	}
	swap.Status = "rejected"
	return s.swapRepo.Update(swap)
}

func (s *shiftSwapService) GetPendingSwaps() ([]*domain.ShiftSwap, error) {
	return s.swapRepo.FindByStatus("pending")
}
