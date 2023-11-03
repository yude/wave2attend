package main

import (
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

type Member struct {
	IDm       string    `json:"idm" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"-"`
}

func InitDB() {
	// gorm; ORM for Go
	var err error
	DB, err = gorm.Open(sqlite.Open("data.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	DB.AutoMigrate(&Member{})
	log.Println("Successfully initialized database.")
}
