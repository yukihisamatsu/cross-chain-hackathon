package safemath

// Add64 performs + operation on two uint64 operands
// returning a result and status
func Add64(a, b uint64) (uint64, bool) {
	c := a + b
	if c >= a {
		return c, true
	}
	return c, false
}

// Sub64 performs - operation on two uint64 operands
// returning a result and status
func Sub64(a, b uint64) (uint64, bool) {
	c := a - b
	if c <= a {
		return c, true
	}
	return c, false
}

// Mul64 performs * operation on two uint64 operands
// returning a result and status
func Mul64(a, b uint64) (uint64, bool) {
	if a == 0 || b == 0 {
		return 0, true
	}
	c := a * b
	if c/b == a {
		return c, true
	}
	return c, false
}

// Div64 performs / operation on two uint64 operands
// returning a result and status
func Div64(a, b uint64) (uint64, bool) {
	if b == 0 {
		return 0, false
	}
	c := a / b
	return c, true
}

// Mod64 performs % operation on two uint64 operands
// returning a result and status
func Mod64(a, b uint64) (uint64, bool) {
	if b == 0 {
		return 0, false
	}
	c := a % b
	return c, true
}
