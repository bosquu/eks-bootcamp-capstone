package main

import (
	"fmt"
 	"log"
 	"net/http"
)
 

const webPort = "80"

type Config struct {}

func main () {
	app := Config{}

	log.Printf("Broker Service is starting on port %s\n", webPort)

	// Define http Server
	srv := &http.Server {
		Addr: fmt.Sprintf(":%s", webPort),
		Handler: app.routes(),

	}

	// Starting Server
	 err := srv.ListenAndServe()
	 if err != nil {
		log.Panic(err)
	 }
}