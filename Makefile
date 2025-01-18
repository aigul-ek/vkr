## Variables
YELLOW := \033[1;33m
NC := \033[0m

.PHONY: up
up:
	@echo "${YELLOW}Starting:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml up -d

.PHONY: pull
pull:
	@echo "${YELLOW}Build:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml pull

.PHONY: down
down:
	@echo "${YELLOW}Stopping:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml down --remove-orphans

.PHONY: logs
logs:
	@echo "${YELLOW}Start following container logs:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml logs -f node

.PHONY: update
update:
	@echo "${YELLOW}Update Node container dependencies:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml exec node npm update --save

.PHONY: outdated
outdated:
	@echo "${YELLOW}Check Node container dependencies:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml exec node npm outdated

.PHONY: node
node:
	@echo "${YELLOW}Updating Node container NPM deps:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml exec node npm update --save

.PHONY: cleanup
cleanup:
	@echo "${YELLOW}Cleaning up node_modules:Dev...${NC}\n"
	@sudo rm -r ./node_modules

.PHONY: run
run:
	@echo "${YELLOW}Running index.js from Node container:Dev...${NC}\n"
	@docker compose -f dev.docker-compose.yml exec node npm run start
