package securitychain

import "errors"

const (
	errMsgAdditionOverflow   = "addition overflow"
	errMsgInsufficientAmount = "insufficient amount"
	errMsgInvalidArg         = "invalid arg"
	errMsgInvalidArgsLength  = "invalid args length"
	errMsgInvalidSender      = "invalid sender"
	errMsgNotWhitelisted     = "not whitelisted"

	errMsgNotImplemented = "not implemented yet"
)

var (
	ErrorAdditionOverflow   = errors.New(errMsgAdditionOverflow)
	ErrorInsufficientAmount = errors.New(errMsgInsufficientAmount)
	ErrorInvalidArg         = errors.New(errMsgInvalidArg)
	ErrorInvalidArgsLength  = errors.New(errMsgInvalidArgsLength)
	ErrorInvalidSender      = errors.New(errMsgInvalidSender)
	ErrorNotWhitelisted     = errors.New(errMsgNotWhitelisted)

	ErrorNotImplemented = errors.New(errMsgNotImplemented)
)
