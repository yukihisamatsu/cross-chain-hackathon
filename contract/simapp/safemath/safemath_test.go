package safemath

import (
	"math"
	"testing"
)

func TestAdd64(t *testing.T) {
	type args struct {
		a uint64
		b uint64
	}
	tests := []struct {
		name  string
		args  args
		want  uint64
		want1 bool
	}{
		{"normal", args{100, 10}, 110, true},
		{"overflow", args{math.MaxUint64, 2}, 1, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := Add64(tt.args.a, tt.args.b)
			if got != tt.want {
				t.Errorf("Add64() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("Add64() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func TestSub64(t *testing.T) {
	type args struct {
		a uint64
		b uint64
	}
	tests := []struct {
		name  string
		args  args
		want  uint64
		want1 bool
	}{
		{"normal", args{100, 10}, 90, true},
		{"overflow", args{10, 11}, 18446744073709551615, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := Sub64(tt.args.a, tt.args.b)
			if got != tt.want {
				t.Errorf("Sub64() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("Sub64() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func TestMul64(t *testing.T) {
	type args struct {
		a uint64
		b uint64
	}
	tests := []struct {
		name  string
		args  args
		want  uint64
		want1 bool
	}{
		{"normal", args{4, 5}, 20, true},
		{"overflow", args{10000000000000000000, 2}, 1553255926290448384, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := Mul64(tt.args.a, tt.args.b)
			if got != tt.want {
				t.Errorf("Mul64() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("Mul64() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func TestDiv64(t *testing.T) {
	type args struct {
		a uint64
		b uint64
	}
	tests := []struct {
		name  string
		args  args
		want  uint64
		want1 bool
	}{
		{"normal case1", args{4, 5}, 0, true},
		{"normal case2", args{10000, 4}, 2500, true},
		{"division by zero", args{5, 0}, 0, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := Div64(tt.args.a, tt.args.b)
			if got != tt.want {
				t.Errorf("Div64() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("Div64() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func TestMod64(t *testing.T) {
	type args struct {
		a uint64
		b uint64
	}
	tests := []struct {
		name  string
		args  args
		want  uint64
		want1 bool
	}{
		{"normal case1", args{1, 3}, 1, true},
		{"normal case2", args{10, 4}, 2, true},
		{"division by zero", args{5, 0}, 0, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := Mod64(tt.args.a, tt.args.b)
			if got != tt.want {
				t.Errorf("Mod64() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("Mod64() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}
