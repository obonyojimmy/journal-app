.PHONY:  dev_api prod_api app_install app

dev_api:
	cd backend && docker compose -f docker-compose.dev.yml up --build --remove-orphans

prod_api:
	cd backend && docker compose -f docker-compose.yml up

app_install:
	cd app && npm install

app:
	cd app && npx expo start
