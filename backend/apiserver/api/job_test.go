package api

import (
	"encoding/json"
	"reflect"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func Test_SearchTxsResultUnmarshal(t *testing.T) {
	in := []byte(`{"total_count":"1","count":"1","page_number":"1","page_total":"1","limit":"30","txs":[{"height":"52","txhash":"6AB03CF4D7B7E5363F48DAD24B1417806B258590B13E21ED46BF89566C8EE501","data":"9C932D6E2D7FE27F97C79190E88C01D4C4B066DAE0797C0B5A06AD5FAC466F29","raw_log":"[{\"msg_index\":0,\"log\":\"\",\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"cross_initiate\"}]},{\"type\":\"send_packet\",\"attributes\":[{\"key\":\"packet_data\",\"value\":\"{\\\"type\\\":\\\"cross\/PacketDataPrepare\\\",\\\"value\\\":{\\\"ContractTransaction\\\":{\\\"contract\\\":\\\"GqH1iNgKBXRyYWluEgdyZXNlcnZlGgQAAAAB\\\",\\\"ops\\\":[{\\\"type\\\":\\\"store\/lock\/Write\\\",\\\"value\\\":{\\\"K\\\":\\\"c2VhdC8x\\\",\\\"V\\\":\\\"a4Hwd+1tPviCzLZanUoVx\/a20V0=\\\"}}],\\\"signers\\\":[\\\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\\\"],\\\"source\\\":{\\\"channel\\\":\\\"ibconexfer\\\",\\\"port\\\":\\\"cross\\\"}},\\\"Sender\\\":\\\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\\\",\\\"TxID\\\":\\\"9C932D6E2D7FE27F97C79190E88C01D4C4B066DAE0797C0B5A06AD5FAC466F29\\\",\\\"TxIndex\\\":0}}\"},{\"key\":\"packet_timeout_height\",\"value\":\"18446744073709551615\"},{\"key\":\"packet_timeout_timestamp\",\"value\":\"0\"},{\"key\":\"packet_sequence\",\"value\":\"1\"},{\"key\":\"packet_src_port\",\"value\":\"cross\"},{\"key\":\"packet_src_channel\",\"value\":\"ibconexfer\"},{\"key\":\"packet_dst_port\",\"value\":\"cross\"},{\"key\":\"packet_dst_channel\",\"value\":\"ibczeroxfer\"},{\"key\":\"packet_data\",\"value\":\"{\\\"type\\\":\\\"cross\/PacketDataPrepare\\\",\\\"value\\\":{\\\"ContractTransaction\\\":{\\\"contract\\\":\\\"GqH1iNgKBWhvdGVsEgdyZXNlcnZlGgQAAAAC\\\",\\\"ops\\\":[{\\\"type\\\":\\\"store\/lock\/Write\\\",\\\"value\\\":{\\\"K\\\":\\\"cm9vbS8y\\\",\\\"V\\\":\\\"a4Hwd+1tPviCzLZanUoVx\/a20V0=\\\"}}],\\\"signers\\\":[\\\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\\\"],\\\"source\\\":{\\\"channel\\\":\\\"ibctwoxfer\\\",\\\"port\\\":\\\"cross\\\"}},\\\"Sender\\\":\\\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\\\",\\\"TxID\\\":\\\"9C932D6E2D7FE27F97C79190E88C01D4C4B066DAE0797C0B5A06AD5FAC466F29\\\",\\\"TxIndex\\\":1}}\"},{\"key\":\"packet_timeout_height\",\"value\":\"18446744073709551615\"},{\"key\":\"packet_timeout_timestamp\",\"value\":\"0\"},{\"key\":\"packet_sequence\",\"value\":\"1\"},{\"key\":\"packet_src_port\",\"value\":\"cross\"},{\"key\":\"packet_src_channel\",\"value\":\"ibctwoxfer\"},{\"key\":\"packet_dst_port\",\"value\":\"cross\"},{\"key\":\"packet_dst_channel\",\"value\":\"ibczeroxfer\"}]}]}]","logs":[{"msg_index":0,"log":"","events":[{"type":"message","attributes":[{"key":"action","value":"cross_initiate"}]},{"type":"send_packet","attributes":[{"key":"packet_data","value":"{\"type\":\"cross\/PacketDataPrepare\",\"value\":{\"ContractTransaction\":{\"contract\":\"GqH1iNgKBXRyYWluEgdyZXNlcnZlGgQAAAAB\",\"ops\":[{\"type\":\"store\/lock\/Write\",\"value\":{\"K\":\"c2VhdC8x\",\"V\":\"a4Hwd+1tPviCzLZanUoVx\/a20V0=\"}}],\"signers\":[\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\"],\"source\":{\"channel\":\"ibconexfer\",\"port\":\"cross\"}},\"Sender\":\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\",\"TxID\":\"9C932D6E2D7FE27F97C79190E88C01D4C4B066DAE0797C0B5A06AD5FAC466F29\",\"TxIndex\":0}}"},{"key":"packet_timeout_height","value":"18446744073709551615"},{"key":"packet_timeout_timestamp","value":"0"},{"key":"packet_sequence","value":"1"},{"key":"packet_src_port","value":"cross"},{"key":"packet_src_channel","value":"ibconexfer"},{"key":"packet_dst_port","value":"cross"},{"key":"packet_dst_channel","value":"ibczeroxfer"},{"key":"packet_data","value":"{\"type\":\"cross\/PacketDataPrepare\",\"value\":{\"ContractTransaction\":{\"contract\":\"GqH1iNgKBWhvdGVsEgdyZXNlcnZlGgQAAAAC\",\"ops\":[{\"type\":\"store\/lock\/Write\",\"value\":{\"K\":\"cm9vbS8y\",\"V\":\"a4Hwd+1tPviCzLZanUoVx\/a20V0=\"}}],\"signers\":[\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\"],\"source\":{\"channel\":\"ibctwoxfer\",\"port\":\"cross\"}},\"Sender\":\"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2\",\"TxID\":\"9C932D6E2D7FE27F97C79190E88C01D4C4B066DAE0797C0B5A06AD5FAC466F29\",\"TxIndex\":1}}"},{"key":"packet_timeout_height","value":"18446744073709551615"},{"key":"packet_timeout_timestamp","value":"0"},{"key":"packet_sequence","value":"1"},{"key":"packet_src_port","value":"cross"},{"key":"packet_src_channel","value":"ibctwoxfer"},{"key":"packet_dst_port","value":"cross"},{"key":"packet_dst_channel","value":"ibczeroxfer"}]}]}],"gas_wanted":"200000","gas_used":"79835","tx":{"type":"cosmos-sdk\/StdTx","value":{"msg":[{"type":"cross\/MsgInitiate","value":{"Sender":"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2","ChainID":"ibc0","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2"],"contract":"GqH1iNgKBXRyYWluEgdyZXNlcnZlGgQAAAAB","ops":[{"type":"store\/lock\/Write","value":{"K":"c2VhdC8x","V":"a4Hwd+1tPviCzLZanUoVx\/a20V0="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2"],"contract":"GqH1iNgKBWhvdGVsEgdyZXNlcnZlGgQAAAAC","ops":[{"type":"store\/lock\/Write","value":{"K":"cm9vbS8y","V":"a4Hwd+1tPviCzLZanUoVx\/a20V0="}}]}],"TimeoutHeight":"151","Nonce":"0"}}],"fee":{"amount":[],"gas":"200000"},"signatures":[{"pub_key":"61rphyEDaGck8hbHqW2SEt+wBALPkqaUBslusO2FYq1Wzr6kHYI=","signature":"k1Gn6Iq\/ud\/V5r9\/yQPS8scVe+Je0k1f\/0Qr8HWngNRfEJGB+xI1mABBumyAwsXW+4PPiKqJKEhZ6bNU6GP9FQ=="}],"memo":""}},"timestamp":"2020-05-12T10:33:30Z"}]}`)
	tx := []byte(`{"type":"cosmos-sdk/StdTx","value":{"msg":[{"type":"cross/MsgInitiate","value":{"Sender":"cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2","ChainID":"ibc0","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2"],"contract":"GqH1iNgKBXRyYWluEgdyZXNlcnZlGgQAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"c2VhdC8x","V":"a4Hwd+1tPviCzLZanUoVx/a20V0="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1dwqlqaldd5l03qkvkedf6js4clmtd52adtzcu2"],"contract":"GqH1iNgKBWhvdGVsEgdyZXNlcnZlGgQAAAAC","ops":[{"type":"store/lock/Write","value":{"K":"cm9vbS8y","V":"a4Hwd+1tPviCzLZanUoVx/a20V0="}}]}],"TimeoutHeight":"151","Nonce":"0"}}],"fee":{"amount":[],"gas":"200000"},"signatures":null,"memo":""}}`)

	res := searchTxsResult{}
	if err := json.Unmarshal(in, &res); err != nil {
		t.Error(err)
	}

	ct := CrossTx{}
	if err := json.Unmarshal(tx, &ct); err != nil {
		t.Error(err)
	}
	res.Txs[0].Tx.Value.Signatures = []StdSignature{}

	t.Logf("res:\t%+v\n", res.Txs[0].Tx)
	t.Logf("res:\t%+v\n", ct)

	alwaysEqual := cmp.Comparer(func(_, _ interface{}) bool { return true })
	opt := cmp.FilterValues(func(x, y interface{}) bool {
		vx, vy := reflect.ValueOf(x), reflect.ValueOf(y)
		return (vx.IsValid() && vy.IsValid() && vx.Type() == vy.Type()) &&
			(vx.Kind() == reflect.Slice || vx.Kind() == reflect.Map) &&
			(vx.Len() == 0 && vy.Len() == 0)
	}, alwaysEqual)
	if !cmp.Equal(res.Txs[0].Tx, ct, opt) {
		t.Error("doesn't equal error")
	}
}
