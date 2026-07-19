# ─────────────────────────────────────────────────────────────────────────────
#  RAGify — Makefile shortcuts
#  Usage: make <command>
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: help up down logs restart reset setup

help:   ## Show available commands
	@echo ""
	@echo "  RAGify — Available Commands"
	@echo "  ─────────────────────────────────────"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@echo ""

setup:  ## First-time setup: copy .env.example to .env
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ .env created. Please fill in your API keys before running 'make up'."; \
	else \
		echo "⚠️  .env already exists. Edit it manually if needed."; \
	fi

up:     ## Build and start all services in background
	docker compose up --build -d

down:   ## Stop all services
	docker compose down

logs:   ## Stream logs from all services
	docker compose logs -f

restart: ## Restart all services without rebuilding
	docker compose restart

reset:  ## ⚠️  Stop, remove volumes, rebuild from scratch (deletes all data!)
	@read -p "This will delete ALL indexed documents. Are you sure? [y/N] " confirm; \
	[ "$$confirm" = "y" ] && docker compose down -v && docker compose up --build -d || echo "Cancelled."

status: ## Show running containers status
	docker compose ps
