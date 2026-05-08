package service

import (
	"errors"
	"sort"
	"shift-management/domain"
	"shift-management/repository"
)

type analyticsService struct {
	userRepo  repository.UserRepository
	shiftRepo repository.ShiftRepository
}

func NewAnalyticsService(ur repository.UserRepository, sr repository.ShiftRepository) AnalyticsService {
	return &analyticsService{
		userRepo:  ur,
		shiftRepo: sr,
	}
}

func (s *analyticsService) GetAttritionRisks() ([]*domain.AttritionRisk, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	allShifts, _ := s.shiftRepo.FindAll()
	userShiftsMap := make(map[uint][]domain.Shift)
	for _, sh := range allShifts {
		userShiftsMap[sh.UserID] = append(userShiftsMap[sh.UserID], *sh)
	}

	var risks []*domain.AttritionRisk
	for _, u := range users {
		risk := s.calculateUserRisk(u, userShiftsMap[u.ID])
		risks = append(risks, risk)
	}

	return risks, nil
}

func (s *analyticsService) calculateUserRisk(user *domain.User, shifts []domain.Shift) *domain.AttritionRisk {
	var totalHours float64
	for _, sh := range shifts {
		totalHours += sh.EndTime.Sub(sh.StartTime).Hours()
	}

	overtime := totalHours - float64(user.MaxWeeklyHours)
	if overtime < 0 {
		overtime = 0
	}

	// Base score from Overtime
	burnoutScore := int((overtime / float64(user.MaxWeeklyHours)) * 100)
	if burnoutScore > 100 {
		burnoutScore = 100
	} else if burnoutScore < 0 {
		burnoutScore = 0
	}

	// If no overtime but total hours is close to MaxWeeklyHours, give a base score
	if overtime == 0 && totalHours > 0 {
		burnoutScore = int((totalHours / float64(user.MaxWeeklyHours)) * 50) 
	}

	riskLevel := "Low"
	if burnoutScore >= 80 {
		riskLevel = "High"
	} else if burnoutScore >= 50 {
		riskLevel = "Medium"
	}

	return &domain.AttritionRisk{
		UserID:        user.ID,
		BurnoutScore:  burnoutScore,
		RiskLevel:     riskLevel,
		OvertimeHours: overtime,
		TotalShifts:   len(shifts),
	}
}

func (s *analyticsService) GetBackupSuggestions(targetUserID uint) ([]*domain.BackupSuggestion, error) {
	targetUser, err := s.userRepo.FindByID(targetUserID)
	if err != nil {
		return nil, errors.New("target user not found")
	}

	users, _ := s.userRepo.FindAll()
	allShifts, _ := s.shiftRepo.FindAll()
	userShiftsMap := make(map[uint][]domain.Shift)
	for _, sh := range allShifts {
		userShiftsMap[sh.UserID] = append(userShiftsMap[sh.UserID], *sh)
	}

	var suggestions []*domain.BackupSuggestion

	for _, u := range users {
		if u.ID == targetUserID || u.Role != targetUser.Role {
			continue
		}
		
		// Only suggest users with same or higher skill level
		if u.SkillLevel >= targetUser.SkillLevel {
			risk := s.calculateUserRisk(u, userShiftsMap[u.ID])
			
			// Only suggest people who are not burnt out
			if risk.BurnoutScore < 70 {
				suggestions = append(suggestions, &domain.BackupSuggestion{
					User:         u,
					BurnoutScore: risk.BurnoutScore,
					MatchReason:  "Skill Level Match & Low Workload",
				})
			}
		}
	}

	// Sort suggestions by BurnoutScore (Lowest first)
	sort.Slice(suggestions, func(i, j int) bool {
		return suggestions[i].BurnoutScore < suggestions[j].BurnoutScore
	})

	// Return top 3
	if len(suggestions) > 3 {
		suggestions = suggestions[:3]
	}

	return suggestions, nil
}
