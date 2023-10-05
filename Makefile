params := server

up:
	docker compose up -d

up-pro:
	docker compose -f docker-compose.yml -f deployment.yml up -d

down:
	docker compose down

down-pro:
	docker compose -f docker-compose.yml -f deployment.yml down

down-v:
	docker compose down -v

pull-pro:
	docker compose -f docker-compose.yml -f deployment.yml pull

build:
	docker compose up -d --build

build-image:
	docker build -t pxuanbach/club-mng:$(params) ./$(params) 

push-image: 
	docker push pxuanbach/club-mng:$(params) 