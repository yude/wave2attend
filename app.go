package main

import (
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

var App *fiber.App

func InitApp() {
	// echo; web framework for Go
	App = fiber.New()

	// The front (index.html)
	App.Static("/", "html")
	App.Static("/change-name", "html/change-name.html")

	// API endpoint for member listing
	App.Get("/api/members", func(c *fiber.Ctx) error {
		var m []Member
		r := DB.Find(&m)

		if r.RowsAffected == 0 {
			return c.Status(http.StatusOK).JSON(&fiber.Map{
				"success": true,
				"result":  m,
			})
		}

		return c.Status(http.StatusOK).JSON(&fiber.Map{
			"success": true,
			"result":  m,
		})
	})

	// API endpoint for updat member's name
	App.Get("/api/update-name", func(c *fiber.Ctx) error {
		idm := c.Queries()["idm"]
		name := c.Queries()["name"]
		if idm == "" {
			return c.Status(http.StatusOK).JSON(&fiber.Map{
				"status":  "error",
				"message": "Empty Idm",
			})
		}
		if name == "" {
			return c.Status(http.StatusOK).JSON(&fiber.Map{
				"status":  "error",
				"message": "Empty name",
			})
		}

		var member Member
		DB.Model(Member{IDm: idm}).First(&member)

		DB.Model(&member).Updates(
			Member{
				IDm:  idm,
				Name: name,
			},
		)

		return c.Status(http.StatusOK).JSON(&fiber.Map{
			"status":  "success",
			"message": "Successfully updated member's name",
		})
	})

	// API endpoint for update member's status
	App.Get("/api/status", func(c *fiber.Ctx) error {
		idm := c.Queries()["idm"]
		status := c.Queries()["status"]
		if idm == "" {
			return c.Status(http.StatusOK).JSON(&fiber.Map{
				"status":  "error",
				"message": "Empty Idm",
			})
		}
		if !(status == "in" || status == "out") {
			return c.Status(http.StatusOK).JSON(&fiber.Map{
				"status":  "error",
				"message": "Invalid status",
			})
		}

		var member Member
		DB.Model(Member{IDm: idm}).First(&member)

		DB.Model(&member).Updates(
			Member{
				IDm:       idm,
				Status:    status,
				UpdatedAt: time.Now(),
			},
		)

		return c.Status(http.StatusOK).JSON(&fiber.Map{
			"status":  "success",
			"message": "Successfully updated member's status",
		})
	})
}
