package main

import (
	"encoding/json"
	"net/http"
)

type jsonResponse struct {
	Error bool `json:"error"`
	Message string `json:"Message"`
	Data any `json:"data,omitempty"`
}

func (app *Config) Broker (w http.ResponseWriter, r *http.Request) {
	payload := jsonResponse {
		Error: false,
		Message: " You've Hit the Broker Service",

	}
	_ = app.writeJSON(w, http.StatusOK, payload)
	
}