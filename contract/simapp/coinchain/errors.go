package coinchain

import "errors"

const (
	errMsgAdditionOverflow   = "addition overflow"
	errMsgInsufficientAmount = "insufficient amount"
	errMsgInvalidArg         = "invalid arg"
	errMsgInvalidArgsLength  = "invalid args length"

	errMsgNotImplemented = "not implemented yet"
)

var (
	ErrorAdditionOverflow   = errors.New(errMsgAdditionOverflow)
	ErrorInsufficientAmount = errors.New(errMsgInsufficientAmount)
	ErrorInvalidArg         = errors.New(errMsgInvalidArg)
	ErrorInvalidArgsLength  = errors.New(errMsgInvalidArgsLength)

	ErrorNotImplemented = errors.New(errMsgNotImplemented)
)
