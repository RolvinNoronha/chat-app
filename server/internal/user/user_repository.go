package user

import (
	"context"
	"database/sql"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}

func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

func (r *repository) CreateUser(ctx context.Context, user *User) (*User, error) {

	query := "INSERT INTO users(username, password, email) VALUES(?, ?, ?)"
	result, err := r.db.ExecContext(ctx, query, user.Username, user.Password, user.Email)

	if err != nil {
		return &User{}, err
	}

	lastInsertedId, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	user.Id = int64(lastInsertedId)

	return user, nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	u := User{}

	query := "SELECT id, username, email, password FROM users WHERE email = ?"
	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.Id, &u.Username, &u.Email, &u.Password)

	if err != nil {
		return &User{}, err
	}

	return &u, nil
}
