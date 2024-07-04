.PHONY:  dev_api prod_api logs prod services

dev_api:
	cd backend && docker compose -f docker-compose.dev.yml up --build --remove-orphans

prod_api:
	cd backend && docker compose -f docker-compose.yml up
