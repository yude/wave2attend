package main

func main() {
	InitDB()
	InitApp()

	App.Listen(":8080")
}
