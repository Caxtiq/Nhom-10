package service

import (
	"time"
	"shift-management/domain"
	"shift-management/repository"
)

type taskService struct {
	taskRepo    repository.TaskRepository
	userRepo    repository.UserRepository
	shiftRepo   repository.ShiftRepository
	settingRepo repository.SettingRepository
}

func NewTaskService(tr repository.TaskRepository, ur repository.UserRepository, sr repository.ShiftRepository, setRepo repository.SettingRepository) TaskService {
	return &taskService{
		taskRepo:    tr,
		userRepo:    ur,
		shiftRepo:   sr,
		settingRepo: setRepo,
	}
}

func (s *taskService) CreateTask(task *domain.Task) error {
	task.IsAssigned = false
	return s.taskRepo.Save(task)
}

func (s *taskService) GetAllTasks() ([]*domain.Task, error) {
	return s.taskRepo.FindAll()
}

func (s *taskService) AutoScheduleShifts() (int, error) {
	unassignedTasks, err := s.taskRepo.FindUnassigned()
	if err != nil {
		return 0, err
	}

	users, err := s.userRepo.FindAll()
	if err != nil {
		return 0, err
	}

	setting, _ := s.settingRepo.Get()
	maxHours := 8.0
	if setting != nil && setting.MaxShiftHours > 0 {
		maxHours = setting.MaxShiftHours
	}

	shiftsScheduled := 0

	for _, task := range unassignedTasks {
		taskDuration := task.EndTime.Sub(task.StartTime).Hours()
		shiftsNeeded := int(taskDuration / maxHours)
		if taskDuration > float64(shiftsNeeded)*maxHours {
			shiftsNeeded++
		}

		currentStartTime := task.StartTime
		
		for i := 0; i < shiftsNeeded; i++ {
			shiftDuration := maxHours
			// If adding maxHours exceeds the task end time, cap it
			if currentStartTime.Add(time.Duration(maxHours * float64(time.Hour))).After(task.EndTime) {
				shiftDuration = task.EndTime.Sub(currentStartTime).Hours()
			}
			shiftEndTime := currentStartTime.Add(time.Duration(shiftDuration * float64(time.Hour)))

			// Find available user
			userFound := false
			for _, user := range users {
				if user.Role == task.RequiredRole {
					// Create shift
					shift := &domain.Shift{
						UserID:     user.ID,
						LocationID: 1, 
						StartTime:  currentStartTime,
						EndTime:    shiftEndTime,
						Notes:      task.Title,
						Status:     "scheduled",
					}
					
					err := s.shiftRepo.Save(shift)
					if err == nil {
						shiftsScheduled++
						currentStartTime = shiftEndTime
						userFound = true
						break // Move to the next shift block for this task
					}
				}
			}
			
			if !userFound {
				break // Could not fulfill this segment
			}
		}
		
		// Mark task as assigned
		task.IsAssigned = true
		s.taskRepo.Update(task)
	}

	return shiftsScheduled, nil
}
