package api

import "github.com/spf13/viper"

type Config struct {
	Node     map[string]NodeInfo     `yml:"node"`
	Path     map[string]ChannelInfo  `yml:"path"`
	Contract map[string]ContractInfo `yml:"contract"`
}

// for config
type NodeInfo struct {
	Addr    string `yml:"addr"`
	ChainId string `yml:"chainId"`
}

type ContractInfo struct {
	Id string `yml:"id"`
}

func NewConfigFromViper(v *viper.Viper) (*Config, error) {
	c := Config{}
	if err := v.Unmarshal(&c); err != nil {
		return nil, err
	}
	return &c, nil
}
