module github.com/datachainlab/cross-chain-hackathon/contract

go 1.13

require (
	github.com/cosmos/cosmos-sdk v0.38.3
	github.com/datachainlab/cross v0.0.0-20200424150132-40de97112d18
	github.com/otiai10/copy v1.1.1
	github.com/spf13/cobra v1.0.0
	github.com/spf13/viper v1.6.3
	github.com/stretchr/testify v1.5.1
	github.com/tendermint/go-amino v0.15.1
	github.com/tendermint/tendermint v0.33.4
	github.com/tendermint/tm-db v0.5.1
)

replace github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4

replace github.com/cosmos/cosmos-sdk => github.com/cosmos/cosmos-sdk v0.34.4-0.20200422222342-f6e9ee762358
