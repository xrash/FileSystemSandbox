package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

var tempdir = os.TempDir()

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /hello")
	fmt.Fprintf(w, "hello\n")
}

func upload(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /upload")

	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Printf("%v: %v\n", name, h)
		}
	}

	b, err := ioutil.ReadAll(req.Body)
	if err != nil {
		fmt.Println("Error reading body", err)
		return
	}

	tempfile, err := ioutil.TempFile(tempdir, "__file_uploaded")
	if err != nil {
		fmt.Println("Error creating temp file", err)
		return
	}

	written, err := tempfile.Write(b)
	if err != nil {
		fmt.Println("Error writing file", err)
		return
	}

	fmt.Printf("Written %d bytes to file %s\n", written, tempfile.Name())
}

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/upload", upload)
	http.ListenAndServe(":7778", nil)
}
