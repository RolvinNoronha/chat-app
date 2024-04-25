package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler(s Service) *Handler {
	return &Handler{
		Service: s,
	}
}

func (h *Handler) CreateUser(c *gin.Context) {
	var u CreateUserReq

	err1 := c.ShouldBindJSON(&u)
	if err1 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err1.Error()})
		return
	}

	res, err2 := h.Service.CreateUser(c.Request.Context(), &u)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) Login(c *gin.Context) {
	var u LoginUserReq

	err1 := c.ShouldBindJSON(&u)
	if err1 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err1.Error()})
		return
	}

	res, err2 := h.Service.Login(c.Request.Context(), &u)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})
		return
	}

	c.SetCookie("jwt", res.accessToken, 3600, "/", "localhost", true, true)

	response := &LoginUserRes{
		Username: res.Username,
		Id:       res.Id,
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logout successfull"})
}
