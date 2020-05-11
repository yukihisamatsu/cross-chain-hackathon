module github.com/datachainlab/cross-chain-hackathon/backend/apiserver

go 1.13

require (
	github.com/datachainlab/cross v0.0.2
	github.com/gorilla/handlers v1.4.2
	github.com/gorilla/mux v1.7.4
	github.com/jmoiron/sqlx v1.2.0
	github.com/mattn/go-sqlite3 v2.0.3+incompatible
	github.com/spf13/viper v1.6.3
	google.golang.org/appengine v1.6.6 // indirect
)

replace github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
