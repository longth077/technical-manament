package middleware

import "github.com/gin-gonic/gin"

func HandleError(c *gin.Context, err error) {
	handleError(c, err)
}
