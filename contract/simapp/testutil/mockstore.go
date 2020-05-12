package testutil

import "fmt"

// impl cross.Store interface
type MockStore struct {
	Store map[string][]byte
}

func NewMockStore() *MockStore {
	return &MockStore{
		Store: map[string][]byte{},
	}
}

func (ms *MockStore) Get(key []byte) []byte {
	v, ok := ms.Store[convKey(key)]
	if ok {
		return v
	}
	return nil
}
func (ms *MockStore) Has(key []byte) bool {
	_, ok := ms.Store[convKey(key)]
	return ok
}
func (ms *MockStore) Set(key, value []byte) {
	ms.Store[convKey(key)] = value
}
func (ms *MockStore) Delete(key []byte) {
	delete(ms.Store, convKey(key))
}

func convKey(key []byte) string {
	return fmt.Sprint(key)
}
