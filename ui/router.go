package ui

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(handler *Handler) *gin.Engine {
	r := gin.Default()

	// CORS config for frontend
	r.Use(cors.Default())

	api := r.Group("/api")
	{
		api.GET("/users", handler.GetUsers)
		api.POST("/users", handler.CreateUser)
		
		api.GET("/shifts", handler.GetShifts)
		api.POST("/shifts", handler.CreateShift)
		
		api.GET("/tasks", handler.GetTasks)
		api.POST("/tasks", handler.CreateTask)
		api.POST("/tasks/auto-schedule", handler.AutoSchedule)
		
		api.GET("/settings", handler.GetSetting)
		api.PUT("/settings", handler.UpdateSetting)
	}

	return r
}
