package api

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/datachainlab/cross/x/ibc/contract/types"
)

const (
	TX_TYPE  = "cosmos-sdk/StdTx"
	MSG_TYPE = "cross/MsgInitiate"

	GAS = "200000"
	// about 1h when block is commited per 1s
	TIMEOUT_HEIGHT = 3600
)

// different from cross
type MsgContractCall struct {
	//Sender   string                 `json:"sender"`
	From     string                 `json:"from"`
	Signers  []byte                 `json:"signers"`
	CallInfo types.ContractCallInfo `json:"call_info"`
}

type ContractCallResult struct {
	Height string               `json:"height"`
	Result ContractCallResponse `json:"result"`
	// for convenient
	From     string `json:"-"`
	Contract []byte `json:"-"`
}

type ContractCallResponse struct {
	ReturnValue []byte `json:"return_value"`
	OPs         []Op   `json:"ops"`
}

func (n *NodeInfo) GetContractCallURL() string {
	return fmt.Sprintf("%s/%s", n.Addr, "cross/contract/call")
}

type Cross struct {
}

func NewCross() *Cross {
	return &Cross{}
}

func (c *Cross) SimulateContractCall(from string, ci types.ContractCallInfo, ni NodeInfo) (*ContractCallResult, error) {
	url := ni.GetContractCallURL()
	fmt.Printf("post url: %s\n", url)

	msg := &MsgContractCall{
		from,
		nil,
		ci,
	}

	j, err := json.Marshal(msg)
	if err != nil {
		return nil, err
	}
	fmt.Printf("request body: %s\n", string(j))
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(j))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	fmt.Printf("response body: %s\n", string(body))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("response http status != 200")
	}

	res := ContractCallResult{}
	if err := json.Unmarshal(body, &res); err != nil {
		return nil, err
	}
	// for convenient
	res.From = from
	res.Contract = ci.Bytes()
	return &res, nil
}

func (c *Cross) GenerateMsgInitiate(sender string, cis []ChannelInfo, ccrs []ContractCallResult, coordinator NodeInfo) (*CrossTx, error) {
	stdTx, err := generateStdTx(sender, coordinator.ChainId, cis, ccrs)
	if err != nil {
		return nil, err
	}
	return &CrossTx{
		Type:  TX_TYPE,
		Value: *stdTx,
	}, nil
}

func generateStdTx(sender, chainId string, cis []ChannelInfo, ccr []ContractCallResult) (*StdTx, error) {
	msg, err := generateMsg(sender, chainId, cis, ccr)
	if err != nil {
		return nil, err
	}
	return &StdTx{
		Msg: []Msg{*msg},
		Fee: StdFee{
			Amount: []Coin{},
			Gas:    GAS,
		},
		Signatures: []StdSignature{},
		Memo:       "",
	}, nil
}

func generateMsg(sender, chainId string, cis []ChannelInfo, ccr []ContractCallResult) (*Msg, error) {
	value, err := generateMsgInitiate(sender, chainId, cis, ccr)
	if err != nil {
		return nil, err
	}
	return &Msg{
		Type:  MSG_TYPE,
		Value: *value,
	}, nil
}

func generateMsgInitiate(sender, chainId string, cis []ChannelInfo, ccrs []ContractCallResult) (*MsgInitiate, error) {
	if len(cis) == 0 || len(cis) != len(ccrs) {
		return nil, fmt.Errorf("invalid input for generating MsgInitiate")
	}
	cts := make([]ContractTransaction, len(ccrs))
	for i := 0; i < len(ccrs); i++ {
		cts[i] = generateContractTx(cis[i], ccrs[i])
	}
	timeout, err := strconv.Atoi(ccrs[0].Height)
	if err != nil {
		return nil, err
	}
	timeout += TIMEOUT_HEIGHT
	mi := &MsgInitiate{
		Sender:               sender,
		ChainID:              chainId,
		ContractTransactions: cts,
		TimeoutHeight:        strconv.Itoa(timeout),
	}
	return mi, nil
}

func generateContractTx(ci ChannelInfo, ccr ContractCallResult) ContractTransaction {
	return ContractTransaction{
		Source:   ci,
		Signers:  []string{ccr.From},
		Contract: base64.StdEncoding.EncodeToString(ccr.Contract),
		Ops:      ccr.Result.OPs,
	}
}
