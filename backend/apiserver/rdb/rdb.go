package rdb

import (
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
	_ "github.com/mattn/go-sqlite3"
)

func InitDB( /*ctx context.Context*/ ) (*sqlx.DB, error) {
	path := os.Getenv("DB_PATH")
	// db, err := sqlx.ConnectContext(ctx, "sqlite3", path)
	db, err := sqlx.Connect("sqlite3", path)
	if err != nil {
		return nil, err
	}

	// use "json" struct tag directly
	db.Mapper = reflectx.NewMapper("json")
	return db, nil
}
