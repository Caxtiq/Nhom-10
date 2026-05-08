package domain

type AttritionRisk struct {
	UserID        uint    `json:"UserID"`
	BurnoutScore  int     `json:"BurnoutScore"` // 0-100
	RiskLevel     string  `json:"RiskLevel"`    // Low, Medium, High
	OvertimeHours float64 `json:"OvertimeHours"`
	TotalShifts   int     `json:"TotalShifts"`
}

type BackupSuggestion struct {
	User         *User  `json:"User"`
	BurnoutScore int    `json:"BurnoutScore"`
	MatchReason  string `json:"MatchReason"`
}
