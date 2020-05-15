package securitychain

import "errors"

const (
	errMsgAddition           = "addition overflow"
	errMsgSubtraction        = "subtraction underflow"
	errMsgMultiplication     = "multiplication overflow"
	errMsgInsufficientAmount = "insufficient amount"
	errMsgInvalidArg         = "invalid arg"
	errMsgInvalidArgsLength  = "invalid args length"
	errMsgInvalidSender      = "invalid sender"
	errMsgNotWhitelisted     = "not whitelisted"
	errMsgRestrictedTransfer = "transfer is restricted"

	errMsgDividendNotPaid = "dividend is not paid yet"
	errMsgDividendPaid    = "dividend is already paid"

	errMsgNotImplemented = "not implemented yet"
)

var (
	ErrorAddition           = errors.New(errMsgAddition)
	ErrorSubtraction        = errors.New(errMsgSubtraction)
	ErrorMultiplication     = errors.New(errMsgMultiplication)
	ErrorInsufficientAmount = errors.New(errMsgInsufficientAmount)
	ErrorInvalidArg         = errors.New(errMsgInvalidArg)
	ErrorInvalidArgsLength  = errors.New(errMsgInvalidArgsLength)
	ErrorInvalidSender      = errors.New(errMsgInvalidSender)
	ErrorNotWhitelisted     = errors.New(errMsgNotWhitelisted)
	ErrorRestrictedTransfer = errors.New(errMsgRestrictedTransfer)

	ErrorDividendNotPaid = errors.New(errMsgDividendNotPaid)
	ErrorDividendPaid    = errors.New(errMsgDividendPaid)

	ErrorNotImplemented = errors.New(errMsgNotImplemented)
)
