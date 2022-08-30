#From base image Golang 1.19
#FROM golang:1.19-alpine as builder
#ENV CGO_ENABLED 0
#ENV GOPROXY=https://proxy.golang.org,direct
#RUN mkdir . /app 

#WORKDIR /app 

#COPY go.mod .
#COPY go.sum .
#COPY . .


#RUN go build -o brokerApp broker-service/cmd/api

#RUN chmod +x /app/brokerApp 

# Multi Stage build image

##FROM alpine:latest

#RUN mkdir /app 

#COPY --from=builder /app/brokerApp /app 

#CMD ["/app/brokerApp"]

# base go image
# base go image
FROM golang:1.18-alpine as builder

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN CGO_ENABLED=0 go build -o brokerApp ./cmd/api

RUN chmod +x /app/brokerApp

# build a tiny docker image
FROM alpine:latest

RUN mkdir /app

COPY --from=builder /app/brokerApp /app

CMD [ "/app/brokerApp" ]