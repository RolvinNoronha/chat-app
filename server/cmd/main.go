package main

import (
	"log"
	"server/db"
	"server/internal/user"
	"server/internal/ws"
	"server/router"
)

func main() {

	dbConn, err := db.NewDatabase()

	if err != nil {
		log.Fatalf("Could not initialize database: %s", err)
	}

	log.Print("Successfully connected to the database")

	userRepo := user.NewRepository(dbConn.GetDb())
	userService := user.NewService(userRepo)
	userHandler := user.NewHandler(userService)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()

	router.InitHandler(userHandler, wsHandler)

	router.Start("0.0.0.0:8080")
}
