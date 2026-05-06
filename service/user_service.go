package service

import (
	"errors"
	"shift-management/domain"
	"shift-management/repository"
)

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) RegisterUser(user *domain.User) error {
	if user.Email == "" || user.Name == "" {
		return errors.New("name and email are required")
	}
	return s.repo.Save(user)
}

func (s *userService) Authenticate(email, password string) (*domain.User, error) {
	return nil, errors.New("not implemented")
}

func (s *userService) GetAllUsers() ([]*domain.User, error) {
	return s.repo.FindAll()
}
