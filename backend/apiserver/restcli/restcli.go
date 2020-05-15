package restcli

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
)

const (
	METHOD_GET  = "GET"
	METHOD_POST = "POST"
)

func Post(url string, bodyJSON []byte) ([]byte, error) {
	return request(METHOD_POST, url, bytes.NewBuffer(bodyJSON))
}

func Get(url string) ([]byte, error) {
	return request(METHOD_GET, url, nil)
}

func request(method, url string, reqBody io.Reader) ([]byte, error) {
	req, err := http.NewRequest(method, url, reqBody)
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
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		log.Printf("response body: %s\n", string(body))
		return nil, fmt.Errorf("response http status != 200")
	}
	return body, nil
}
