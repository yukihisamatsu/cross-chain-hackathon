package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/lcd"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/server"
	"github.com/gorilla/handlers"
	"github.com/rakyll/statik/fs"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/tendermint/tendermint/libs/log"
	rpcserver "github.com/tendermint/tendermint/rpc/lib/server"
)

// ServeCommand will start the application REST service as a blocking process. It
// takes a codec to create a RestServer object and a function to register all
// necessary routes.
func ServeCommand(cdc *codec.Codec, registerRoutesFn func(*lcd.RestServer)) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "rest-server",
		Short: "Start LCD (light-client daemon), a local REST server",
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			listenAddr := viper.GetString(flags.FlagListenAddr)
			maxOpen := viper.GetInt(flags.FlagMaxOpenConnections)
			readTimeout := uint(viper.GetInt(flags.FlagRPCReadTimeout))
			writeTimeout := uint(viper.GetInt(flags.FlagRPCWriteTimeout))

			rs := lcd.NewRestServer(cdc)

			logger := log.NewTMLogger(log.NewSyncWriter(os.Stdout)).
				With("module", "rest-server")

			registerRoutesFn(rs)

			statikFS, err := fs.New()
			if err != nil {
				panic(err)
			}
			staticServer := http.FileServer(statikFS)
			rs.Mux.PathPrefix("/").Handler(staticServer)

			cfg := rpcserver.DefaultConfig()
			cfg.MaxOpenConnections = maxOpen
			cfg.ReadTimeout = time.Duration(readTimeout) * time.Second
			cfg.WriteTimeout = time.Duration(writeTimeout) * time.Second

			listener, err := rpcserver.Listen(listenAddr, cfg)
			server.TrapSignal(func() {
				err := listener.Close()
				logger.Error("error closing listener", "err", err)
			})
			if err != nil {
				return
			}

			logger.Info(
				fmt.Sprintf(
					"Starting application REST service (chain-id: %q)...",
					viper.GetString(flags.FlagChainID),
				),
			)

			return rpcserver.StartHTTPServer(
				listener,
				handlers.CORS(
					handlers.AllowedHeaders([]string{"Content-Type"}),
					handlers.AllowCredentials(),
				)(rs.Mux),
				logger,
				cfg,
			)
		},
	}

	return flags.RegisterRestServerFlags(cmd)
}
