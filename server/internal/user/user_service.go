package user

import (
	"context"
	"server/utils"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	secretKey = "secret"
)

type service struct {
	Repository
	timeout time.Duration
}

func NewService(repository Repository) Service {
	return &service{
		repository,
		time.Duration(2) * time.Second,
	}
}

func (s *service) CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		return nil, err
	}

	u := &User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}

	r, err := s.Repository.CreateUser(ctx, u)

	if err != nil {
		return nil, err
	}

	res := &CreateUserRes{
		Id:       strconv.Itoa(int(r.Id)),
		Username: r.Username,
		Email:    r.Email,
	}

	return res, nil
}

type MyJWTClaims struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *service) Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()

	u, err1 := s.GetUserByEmail(ctx, req.Email)
	if err1 != nil {
		return &LoginUserRes{}, err1
	}

	err2 := utils.CheckPassword(req.Password, u.Password)
	if err2 != nil {
		return &LoginUserRes{}, err2
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		Id:       strconv.Itoa(int(u.Id)),
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(u.Id)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	ss, err3 := token.SignedString([]byte(secretKey))
	if err3 != nil {
		return &LoginUserRes{}, err3
	}

	return &LoginUserRes{accessToken: ss, Username: u.Username, Id: strconv.Itoa(int(u.Id))}, nil
}
