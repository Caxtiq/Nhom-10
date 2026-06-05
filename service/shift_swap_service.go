package service

import (
	"errors"
	"shift-management/domain"
	"shift-management/repository"
	"time"
)

type shiftSwapService struct {
	swapRepo    repository.ShiftSwapRepository
	shiftRepo   repository.ShiftRepository
	userRepo    repository.UserRepository
	settingRepo repository.SettingRepository
	notifSvc    NotificationService
}

func NewShiftSwapService(sr repository.ShiftSwapRepository, sh repository.ShiftRepository, ur repository.UserRepository, set repository.SettingRepository, notifSvc NotificationService) ShiftSwapService {
	return &shiftSwapService{
		swapRepo:    sr,
		shiftRepo:   sh,
		userRepo:    ur,
		settingRepo: set,
		notifSvc:    notifSvc,
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
	if err == nil {
		s.notifSvc.CreateNotification(targetUserID, "Có yêu cầu đổi ca làm việc, vui lòng kiểm tra trang chủ để xem chi tiết.")
	}
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

	// Check if shift has already started
	if time.Now().After(shift.StartTime) {
		return errors.New("shift has already started, cannot accept swap")
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

	ruleEngine := NewRuleEngine(minRest, setting)

	requester, err := s.userRepo.FindByID(swap.RequesterID)
	if err != nil {
		return err
	}

	// We use the requester's Role and SkillLevel as the baseline required skill
	// This ensures the target user has the same role and a skill level >= the requester's level.
	// We allow overtime (true) for swaps to increase candidate pool.
	if !ruleEngine.IsValid(targetUser, targetUserShifts, requester.Role, requester.SkillLevel, shift.StartTime, shift.EndTime, true) {
		return errors.New("target user violates scheduling rules (rest limit or skill level)")
	}

	// Update shift owner and mark as overtime
	shift.UserID = targetUser.ID
	if shift.Notes != "" {
		shift.Notes += " | "
	}
	shift.Notes += "[OVERTIME - Nhận từ Đổi ca]"
	if err := s.shiftRepo.Update(shift); err != nil {
		return err
	}

	// Approve this swap
	swap.Status = "approved"
	if err := s.swapRepo.Update(swap); err != nil {
		return err
	}

	// Reject all other pending swaps for this shift
	otherSwaps, _ := s.swapRepo.FindByShiftID(swap.ShiftID)
	for _, other := range otherSwaps {
		if other.ID != swap.ID && other.Status == "pending" {
			other.Status = "rejected"
			s.swapRepo.Update(other)
			// Delete the notification that was sent to them
			s.notifSvc.DeleteNotificationByMessage(other.TargetUserID, "Có yêu cầu đổi ca làm việc, vui lòng kiểm tra trang chủ để xem chi tiết.")
		}
	}

	return nil
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

func (s *shiftSwapService) AutoSwap(requesterID, shiftID uint) error {
	shift, err := s.shiftRepo.FindByID(shiftID)
	if err != nil {
		return err
	}

	if shift.UserID != requesterID {
		return errors.New("you can only auto-swap your own shift")
	}

	users, err := s.userRepo.FindAll()
	if err != nil {
		return err
	}

	allShifts, _ := s.shiftRepo.FindAll()
	userShiftsMap := make(map[uint][]domain.Shift)
	for _, sh := range allShifts {
		userShiftsMap[sh.UserID] = append(userShiftsMap[sh.UserID], *sh)
	}

	setting, _ := s.settingRepo.Get()
	minRest := 11.0
	if setting != nil && setting.MinRestHours > 0 {
		minRest = setting.MinRestHours
	}

	ruleEngine := NewRuleEngine(minRest, setting)

	var validUsers []*domain.User

	requester, err := s.userRepo.FindByID(requesterID)
	if err != nil {
		return err
	}

	for _, u := range users {
		if u.ID == requesterID || u.Role != requester.Role {
			continue
		}

		// We use the requester's Role and SkillLevel as the baseline required skill
		// This ensures the candidate has the same role and a skill level >= the requester's level.
		// We allow overtime (true) to prevent blocking notifications.
		if ruleEngine.IsValid(u, userShiftsMap[u.ID], requester.Role, requester.SkillLevel, shift.StartTime, shift.EndTime, true) {
			validUsers = append(validUsers, u)
		}
	}

	if len(validUsers) == 0 {
		// Fallback to manual admin assignment
		swap := &domain.ShiftSwap{
			RequesterID:  requesterID,
			TargetUserID: 0,
			ShiftID:      shiftID,
			Status:       "pending_admin_assignment",
		}
		if err := s.swapRepo.Save(swap); err != nil {
			return err
		}
		return errors.New("fallback_manual")
	}

	// Create a pending swap request for each eligible candidate
	for _, candidate := range validUsers {
		swap := &domain.ShiftSwap{
			RequesterID:  requesterID,
			TargetUserID: candidate.ID,
			ShiftID:      shiftID,
			Status:       "pending", // Wait for target user to accept
		}
		if err := s.swapRepo.Save(swap); err != nil {
			// If one fails, continue to others, or return. For now, continue but log (or ignore err if partial success is OK)
			continue
		}
		
		// Send notification
		s.notifSvc.CreateNotification(candidate.ID, "Có yêu cầu đổi ca làm việc, vui lòng kiểm tra trang chủ để xem chi tiết.")
	}
	return nil
}

func (s *shiftSwapService) AssignSwap(swapID, targetUserID uint) error {
	swap, err := s.swapRepo.FindByID(swapID)
	if err != nil {
		return err
	}
	if swap.Status != "pending" && swap.Status != "pending_admin_assignment" {
		return errors.New("only pending swaps can be assigned")
	}

	shift, err := s.shiftRepo.FindByID(swap.ShiftID)
	if err != nil {
		return err
	}

	shift.UserID = targetUserID
	if err := s.shiftRepo.Update(shift); err != nil {
		return err
	}

	swap.TargetUserID = targetUserID
	swap.Status = "approved"
	err = s.swapRepo.Update(swap)
	if err == nil {
		s.notifSvc.CreateNotification(targetUserID, "Admin đã phân công bạn nhận một ca làm việc từ yêu cầu đổi ca. Vui lòng kiểm tra lịch làm việc.")
	}
	return err
}
