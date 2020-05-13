package api

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"reflect"
	"strconv"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross-chain-hackathon/backend/apiserver/rdb"
	"github.com/datachainlab/cross-chain-hackathon/backend/apiserver/restcli"
	"github.com/datachainlab/cross/x/ibc/cross/types"
	"github.com/google/go-cmp/cmp"
)

var (
	alwaysEqual = cmp.Comparer(func(_, _ interface{}) bool { return true })
	cmpOpt      = cmp.FilterValues(func(x, y interface{}) bool {
		vx, vy := reflect.ValueOf(x), reflect.ValueOf(y)
		return (vx.IsValid() && vy.IsValid() && vx.Type() == vy.Type()) &&
			(vx.Kind() == reflect.Slice || vx.Kind() == reflect.Map) &&
			(vx.Len() == 0 && vy.Len() == 0)
	}, alwaysEqual)
)

type Job struct {
	config   Config
	duration time.Duration
}

func NewJob(config *Config) *Job {
	duration := time.Duration(config.Job.DurationSec) * time.Second
	return &Job{
		//db:       db,
		config:   *config,
		duration: duration,
	}
}

func (j *Job) Start(ctx context.Context) {
	log.Println("job start")
	go j.loop(ctx)
}

func (j *Job) loop(ctx context.Context) {
	timer := time.NewTicker(j.duration)
	defer timer.Stop()

	for {
		select {
		case <-ctx.Done():
			break
		case <-timer.C:
			log.Println("job update")
			j.update(ctx)
		}
	}
}

func (j *Job) update(ctx context.Context) {
	db, err := rdb.InitDB()
	if err != nil {
		log.Println(err)
		return
	}

	/* STEP1: select TradeRequest */
	trs, err := SelectOngoingTradeRequest(db)
	if err != nil {
		log.Println(err)
		return
	}
	if len(trs) == 0 {
		return
	}

	/* STEP2: get MsgInitiate txs */
	// HACK page should be stored to reduce the number of requests.
	page := 1
	url := j.config.Node[KEY_COORDINATOR].Addr
	txs, err := getMsgInitiates(url, page)
	if err != nil {
		log.Println(err)
		return
	}

	/* STEP3: match TradeRequest with the above txs */
	for _, tx := range txs {
		for i := 0; i < len(trs); i++ {
			tr := trs[i]
			if cmp.Equal(tx.Tx, tr.CrossTx, cmpOpt) {
				/* STEP4: check the coordinator status with tx.Data (= TxID of MsgInitiate) */
				status, err := getCoordinatorStatus(url, tx.Data)
				if err != nil {
					log.Println(err)
					return
				}

				if status != tr.Status {
					tr.Status = status
					if err := UpdateTradeRequestStatus(db, tr); err != nil {
						log.Println(err)
						return
					}
				}
				log.Printf("Job updated a TradeRequest status: ID: %d, Status: %d", tr.Id, tr.Status)

				trs = append(trs[:i], trs[i+1:]...)
				break
			}

		}
	}
}

type searchTxsResult struct {
	TotalCount string       `json:"total_count"` // Count of all txs
	Count      string       `json:"count"`       // Count of txs in current page
	PageNumber string       `json:"page_number"` // Index of current page, start from 1
	PageTotal  string       `json:"page_total"`  // Count of total pages
	Limit      string       `json:"limit"`       // Max count txs per page
	Txs        []txResponse `json:"txs"`         // List of txs in current page
}

type txResponse struct {
	Height    string              `json:"height"`
	TxHash    string              `json:"txhash"`
	Codespace string              `json:"codespace,omitempty"`
	Code      string              `json:"code,omitempty"`
	Data      string              `json:"data,omitempty"`
	RawLog    string              `json:"raw_log,omitempty"`
	Logs      sdk.ABCIMessageLogs `json:"logs,omitempty"`
	Info      string              `json:"info,omitempty"`
	GasWanted string              `json:"gas_wanted,omitempty"`
	GasUsed   string              `json:"gas_used,omitempty"`
	Tx        CrossTx             `json:"tx,omitempty"`
	Timestamp string              `json:"timestamp,omitempty"`
}

type abciMessageLog struct {
	MsgIndex string `json:"msg_index"`
	Log      string `json:"log"`

	// Events contains a slice of Event objects that were emitted during some
	// execution.
	Events []stringEvent `json:"events"`
}

type stringEvent struct {
	Type       string          `json:"type,omitempty"`
	Attributes []sdk.Attribute `json:"attributes,omitempty"`
}

type coordinatorResult struct {
	Height string                    `json:"height"`
	Result coordinatorStatusResponse `json:"result"`
}

type coordinatorStatusResponse struct {
	TxID            string                `json:"tx_id" yaml:"tx_id"`
	CoordinatorInfo types.CoordinatorInfo `json:"coordinator_info" yaml:"coordinator_info"`
	Completed       bool                  `json:"completed" yaml:"completed"`
}

// default page should be 1
func getMsgInitiates(url string, page int) ([]txResponse, error) {
	body, err := restcli.Get(fmt.Sprintf("%s/txs?message.action=cross_initiate&page=%d", url, page))
	if err != nil {
		return nil, err
	}
	var res searchTxsResult
	if err := json.Unmarshal(body, &res); err != nil {
		return nil, err
	}
	total, err := strconv.Atoi(res.PageTotal)
	if err != nil {
		return nil, err
	}
	if total <= page {
		return res.Txs, nil
	}
	// HACK this is recursive
	txs, err := getMsgInitiates(url, page+1)
	if err != nil {
		// ignore err
		return res.Txs, nil
	}
	return append(res.Txs, txs...), nil
}

func getCoordinatorStatus(url string, txID string) (TradeRequestStatus, error) {
	body, err := restcli.Get(fmt.Sprintf("%s/cross/coordinator/%s", url, txID))
	if err != nil {
		return 0, err
	}
	var res coordinatorResult
	if err := json.Unmarshal(body, &res); err != nil {
		return 0, err
	}
	if res.Result.CoordinatorInfo.IsCompleted() {
		if res.Result.Completed {
			return REQUEST_COMPLETED, nil
		}
		return REQUEST_FAILED, nil
	}
	return REQUEST_ONGOING, nil
}
