createMigration
	migrate create -ext sql -dir db/migrations "migration_name"

migrateup:
	migrate -path db/migrations -database "mysql://root:mypassword@tcp(localhost:3306)/go_chat?charset=utf8" -verbose up

migratedown:
	migrate -path db/migrations -database "mysql://root:mypassword@tcp(localhost:3306)/go_chat?charset=utf8" -verbose down