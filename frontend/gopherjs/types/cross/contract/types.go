package contract

type ContractCallInfo struct {
	ID     string   `json:"id"`
	Method string   `json:"method"`
	Args   [][]byte `json:"args"`
}
