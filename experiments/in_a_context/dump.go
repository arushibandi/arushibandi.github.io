package main

import (
	"context"
	"fmt"
	"math/rand"
	"time"
)

/*
	In SFPC Machine Language, we consider how "a bit is a boundary" - computers cannot handle ambiguity.
	Computers only "know" what you tell them explicitly. This is contrasted with how humans operate, where
	the actions we take are necessarily preceded by previous actions that led us there, our intentions and
	motivations, all of which we "know" implicitly. While this abstraction away from local "context" allows
	programs to scale and handle many requests and users without requiring detailed information about the
	specificities of each client, oftentimes it is useful for a piece of code to know information like where
	a request is coming from, or fail requests within a certain timebound.

	The programming language golang gives a useful library in doing so: the context package. As stated in
	the documentation: Package context defines the Context type, which carries deadlines, cancellation signals,
	and other request-scoped values across API boundaries and between processes. (https://pkg.go.dev/context).
	I use this package in almost every function I write for work and thought it would be neat to explore using
	it outside my traditional use case of API requests and distributed systems programming.

	The library is actually quite simple, with only four methods on the Context type. The following code
	demonstrates a couple simple uses of these methods.
*/

// a random 1-minute brain dump of my top-level context as a string map :)
var myContext = map[string]string{
	"my name is":                 "arushi",
	"my eyes are":                "brown",
	"i am taking a class":        "called machine language",
	"writing this program feels": "silly and fun",
	"my hair is in":              "a bun",
	"later, i am going":          "shopping",
	"the time is":                "1 pm IST",
	"i am wearing":               "a sweater",
	"the temperature is":         "23 celsius",
	"23 celsius is":              "74 farenheit",
	"i am visiting":              "india",
}

func contextDump(ctx context.Context) {

	/*
		Much like human memory, there is no method like ctx.Values(), which would provide
		the caller access to all the data stored in the context ctx. So if you are trying to retrieve some
		data from the context, you must already know what it is that you are looking for! This is ironic -
		the program needs some extra "context" from the programmer in order to make use of the one its given.
	*/

	// In this case, I know I want to randomly print out the context I loaded earlier into the variable myContext.
	// this is the extra "context" in lieu of having a ctx.Values() functions
	for key := range myContext {
		// golang has no order to maps - there's some randomness we get for free and the program is not deterministic
		fmt.Printf("%s %s ", key, ctx.Value(key))

		select {
		case <-ctx.Done():
			// someone told me to stop dumping!
			// break the infinite recursion
			return
		default:
		}

		// slow down the prints to a human pace :)
		time.Sleep(time.Duration(rand.Intn(1000) * int(time.Millisecond)))
	}

}

func main() {
	// empty context!
	// from documentation: It is never canceled, has no values, and has no deadline.
	ctx := context.Background()

	for key, val := range myContext {
		ctx = context.WithValue(ctx, key, val)
	}

	// now the context is filled up!
	// let's do somethiung with it for 1 second
	cancelCtx, cancel := context.WithTimeout(ctx, 1*time.Second)
	// always cleanup your context!
	defer cancel()
	// start doing things!
	contextDump(cancelCtx)
}
