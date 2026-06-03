package service

import (
	"shift-management/domain"
	"gorm.io/gorm"
)

type notificationService struct {
	db *gorm.DB
}

func NewNotificationService(db *gorm.DB) NotificationService {
	return &notificationService{db: db}
}

// CreateNotification creates a new notification for a specific user
func (s *notificationService) CreateNotification(userID uint, message string) error {
	notif := domain.Notification{
		UserID:  userID,
		Message: message,
		IsRead:  false,
	}
	return s.db.Create(&notif).Error
}

// GetNotifications returns all notifications for a specific user, ordered by newest first
func (s *notificationService) GetNotifications(userID uint) ([]domain.Notification, error) {
	var notifs []domain.Notification
	err := s.db.Where("user_id = ?", userID).Order("created_at desc").Find(&notifs).Error
	return notifs, err
}

// MarkAsRead marks a specific notification as read
func (s *notificationService) MarkAsRead(notificationID uint) error {
	return s.db.Model(&domain.Notification{}).Where("id = ?", notificationID).Update("is_read", true).Error
}

// MarkAllAsRead marks all notifications for a specific user as read
func (s *notificationService) MarkAllAsRead(userID uint) error {
	return s.db.Model(&domain.Notification{}).Where("user_id = ?", userID).Update("is_read", true).Error
}

// DeleteNotificationByMessage deletes a notification with an exact message for a specific user
func (s *notificationService) DeleteNotificationByMessage(userID uint, message string) error {
	return s.db.Where("user_id = ? AND message = ?", userID, message).Delete(&domain.Notification{}).Error
}
