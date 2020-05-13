package api

import "github.com/spf13/viper"

// HACK where should they are placed
const (
	KEY_COIN        = "coin"
	KEY_COORDINATOR = "coordinator"
	KEY_SECURITY    = "security"
	KEY_CO_COIN     = "coordinator-coin"
	KEY_CO_SECURITY = "coordinator-security"
)

type Config struct {
	Node     map[string]NodeInfo     `yml:"node"`
	Path     map[string]ChannelInfo  `yml:"path"`
	Contract map[string]ContractInfo `yml:"contract"`
	Job      JobInfo                 `yml:"job"`
}

// for config
type NodeInfo struct {
	Addr    string `yml:"addr"`
	ChainId string `yml:"chainId"`
}

type ContractInfo struct {
	Id string `yml:"id"`
}

type JobInfo struct {
	DurationSec int `yml:"durationSec"`
}

func NewConfigFromViper(v *viper.Viper) (*Config, error) {
	c := Config{}
	if err := v.Unmarshal(&c); err != nil {
		return nil, err
	}
	return &c, nil
}
