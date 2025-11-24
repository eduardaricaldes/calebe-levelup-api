migrate:
	@read -p "Enter migration name: " name; \
	npx prisma migrate dev --name "$$name"

migration-deploy:
	npx prisma migrate deploy

generate:
	npx prisma generate

reset:
	npx prisma migrate reset --force

studio:
	npx prisma studio

test:
	pnpm vitest $(filter-out $@,$(MAKECMDGOALS))

run-dev:
	pnpm dev

.PHONY: migrate migration-deploy generate reset studio test run-dev
