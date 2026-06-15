package service

type HttpError struct {
	Status  int
	Message string
}

func (e HttpError) Error() string {
	return e.Message
}

func NewHttpError(status int, message string) HttpError {
	return HttpError{Status: status, Message: message}
}
