# Форматирование и линтинг кода
lint-backend:
	cd backend && pnpm lint

lint-frontend:
	cd frontend && pnpm types && pnpm lint

format-backend:
	cd backend && pnpm format

format-frontend:
	cd frontend && pnpm format

laf: format-backend lint-backend format-frontend lint-frontend 
	@echo [-- All checks passed, code formatted --]