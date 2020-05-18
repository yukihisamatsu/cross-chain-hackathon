package api

import (
	"errors"
	"net/http"
)

const (
	errMsgFailedDBConnect    = "failed to connect db"
	errMsgFailedDBGet        = "failed to get db data"
	errMsgFailedDBSet        = "failed to set db data"
	errMsgFailedDBBeginTx    = "failed to begin tx"
	errMsgFailedDBCommitTx   = "failed to commit tx"
	errMsgFailedDBRollbackTx = "failed to rollback tx"
	errMsgWrongStatus        = "wrong status"
)

var (
	ErrorFailedDBConnect    = errors.New(errMsgFailedDBConnect)
	ErrorFailedDBGet        = errors.New(errMsgFailedDBGet)
	ErrorFailedDBSet        = errors.New(errMsgFailedDBSet)
	ErrorFailedDBBeginTx    = errors.New(errMsgFailedDBBeginTx)
	ErrorFailedDBCommitTx   = errors.New(errMsgFailedDBCommitTx)
	ErrorFailedDBRollbackTx = errors.New(errMsgFailedDBRollbackTx)
	ErrorWrongStatus        = errors.New(errMsgWrongStatus)
	ErrorRecordAlreadyExit  = errors.New(errMsgFailedDBGet)
)

func HttpStatus(err error) int {
	if errors.Is(err, ErrorFailedDBSet) || errors.Is(err, ErrorWrongStatus) {
		return http.StatusBadRequest
	} else if errors.Is(err, ErrorFailedDBGet) {
		return http.StatusNotFound
	} else if errors.Is(err, ErrorFailedDBConnect) {
		return http.StatusServiceUnavailable
	} else {
		return http.StatusInternalServerError
	}
}
