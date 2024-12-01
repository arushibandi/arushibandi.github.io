package main

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// Feel free to modify this as you like :-)

/*
In software, complex problems are broken up into smaller pieces, where each piece can be reasoned about separate from the whole,
devoid of the greater "context" in which it operates. However, such abstractions are not always so simple to do -- oftentimes,
cancellation signals or metadata needs to be carried across request and function call boundaries. This simple program demonstrates the
use of context timeouts through a visualization of a grid containing cells simultaneously being operated on.

This data stored in a 2D slice of boolean values, protected by a read-write lock against concurrent operations.
*/
type state struct {
	mu    *sync.RWMutex
	inner [][]bool
}

// newState(n, m) initializes the [][]bool with n rows and m columns, all initialized to store false.
func newState(n, m int) *state {
	s := make([][]bool, n)
	for i := range s {
		s[i] = make([]bool, m)
	}
	return &state{
		mu:    &sync.RWMutex{},
		inner: s,
	}
}

// Converts a state to string for printing.
func (s *state) String() string {
	str := ""
	rowToString := func(s []bool) string {
		strs := ""
		for _, b := range s {
			if b {
				strs += "* "
			} else {
				strs += "- "
			}
		}
		return strs
	}
	s.mu.RLock()
	for _, r := range s.inner {
		str += rowToString(r) + "\n"
	}
	s.mu.RUnlock()
	return str
}

// f(ctx, b) waits until the context is closed before storing true in b.
// This is used to update the value of a cell in our grid.
func f(ctx context.Context, b *bool, mu *sync.RWMutex) {
	// Wait for the ctx.Done() channel to be notified before updating b's value
	<-ctx.Done()
	mu.Lock()
	*b = true
	mu.Unlock()
}

func main() {
	// Use these to change the size of the grid
	n := 15
	m := 85

	// Initialize the grid
	state := newState(n, m)

	// Pick how long the program should last
	seconds := 10
	end := time.After(time.Duration(seconds) * time.Second)
	ctx := context.Background()

	for i := 0; i < n; i++ {
		for j := 0; j < m; j++ {
			// For each of the cells, create a child context that gets cancelled at a random millisecond
			// in the span of the program's life.
			timeout := time.Duration(rand.Intn(seconds*1000)) * time.Millisecond
			ctxI, cancelI := context.WithTimeout(ctx, timeout)
			// Always clean up contexts!
			defer cancelI()
			go f(ctxI, &state.inner[i][j], state.mu)
		}
	}

	// Update the output every 50 milliseconds
	t := time.NewTicker(25 * time.Millisecond)
	for {
		select {
		case <-end:
			// End the program
			t.Stop()
			return
		case <-t.C:
			fmt.Print("\x0c", state)
		}
	}
}
