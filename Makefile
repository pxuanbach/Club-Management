params := server

up:
	docker compose up -d

down:
	docker compose down

down-v:
	docker compose down -v

build:
	docker compose up -d --build

build-image:
	docker build -t pxuanbach/club-mng:$(params) ./$(params) 

push-image: 
	docker push pxuanbach/club-mng:$(params) 