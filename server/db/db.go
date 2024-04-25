package db

import (
	"database/sql"

	// _ "github.com/lib/pq"
	_ "github.com/go-sql-driver/mysql"
)

type Databse struct {
	db *sql.DB
}

func NewDatabase() (*Databse, error) {
	db, err := sql.Open("mysql", "root:mypassword@tcp(localhost:3306)/go_chat?charset=utf8")

	if err != nil {
		return nil, err
	}

	return &Databse{db: db}, nil
}

func (d *Databse) Close() {
	d.db.Close()
}

func (d *Databse) GetDb() *sql.DB {
	return d.db
}
