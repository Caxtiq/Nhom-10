package ui

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(handler *Handler) *gin.Engine {
	r := gin.Default()

	// CORS config for frontend
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	{
		api.POST("/auth/login", handler.Login)

		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			protected.GET("/users", handler.GetUsers)
			protected.POST("/users", handler.CreateUser)
			
			protected.GET("/shifts", handler.GetShifts)
			protected.POST("/shifts", handler.CreateShift)
			protected.POST("/shifts/:id/clock-in", handler.ClockIn)
			protected.POST("/shifts/:id/clock-out", handler.ClockOut)
			
			protected.GET("/tasks", handler.GetTasks)
			protected.POST("/tasks", handler.CreateTask)
			protected.POST("/tasks/auto-schedule", handler.AutoSchedule)
			
			protected.GET("/settings", handler.GetSetting)
			protected.PUT("/settings", handler.UpdateSetting)

			protected.GET("/swaps", handler.GetPendingSwaps)
			protected.POST("/swaps", handler.RequestSwap)
			protected.POST("/swaps/:id/approve", handler.ApproveSwap)
			protected.POST("/swaps/:id/reject", handler.RejectSwap)
			protected.POST("/swaps/auto", handler.AutoSwapRequest)

			protected.GET("/analytics/attrition", handler.GetAttritionRisks)
			protected.GET("/analytics/backups/:id", handler.GetBackupSuggestions)
		}
	}

	return r
}
