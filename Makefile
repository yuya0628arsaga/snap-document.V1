SHELL=/bin/bash

ifeq ($(OS), Windows_NT)
OS_NAME="Windows"
else
UNAME=$(shell uname)
ifeq ($(UNAME),Linux)
OS_NAME="Linux"
else
ifeq ($(UNAME),Darwin)
OS_NAME="MacOS"
else
OS_NAME="Other"
endif
endif
endif

build:
	docker-compose build --no-cache --force-rm

install:
	make build
	cp .env.example .env
	make up
	docker compose exec app sed -e 's/APP_ENV=local/APP_ENV=testing/' -e 's/DB_DATABASE=.*/DB_DATABASE=snap_document_test/' .env.example > .env.testing
	docker compose exec app composer install
	docker compose exec app npm install
	docker compose exec app php artisan key:generate
	docker compose exec app php artisan key:generate --env=testing
	sudo chmod -fR 777 storage bootstrap

up:
	USER_NAME=$(shell id -nu) USER_ID=$(shell id -u) GROUP_NAME=$(shell id -ng) GROUP_ID=$(shell id -g) OS_NAME=$(OS_NAME) docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

fresh:
	docker-compose exec app php artisan migrate:fresh --seed

ps:
	docker ps

format:
	docker-compose exec app ./vendor/bin/pint

tinker:
	docker-compose exec app php artisan tinker

clear:
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear


ifeq ($(OS_NAME), "Linux")
shell:
	docker exec -it snap-document-app su -s /bin/bash $(shell id -un)
else
shell:
	docker exec -it snap-document-app /bin/bash
endif

models:
	php artisan -N ide-helper:models

ide-helper:
	php artisan ide-helper:generate
	php artisan ide-helper:models --nowrite
	php artisan ide-helper:meta