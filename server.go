package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"io"
)

var tempdir = os.TempDir()

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /hello")
	fmt.Fprintf(w, "hello\n")
}

func uploadBinary(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /upload-binary")

	fmt.Println("Method", req.Method)

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

func uploadMultipart(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Got /upload-multipart")

	fmt.Println("Method", req.Method)

	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Printf("%v: %v\n", name, h)
		}
	}

    err := req.ParseMultipartForm(10 * 1024 * 1024)
	if err != nil {
		fmt.Println("Error parsing multipart request", err)
		return
	}

    file, _, err := req.FormFile("file")
    if err != nil {
		fmt.Println("Error getting data from multipart field", err)
		return
    }

	tempfile, err := ioutil.TempFile(tempdir, "__file_uploaded")
	if err != nil {
		fmt.Println("Error creating temp file", err)
		return
	}

	written, err := io.Copy(tempfile, file)
	if err != nil {
		fmt.Println("Error writing file", err)
		return
	}

	fmt.Printf("Written %d bytes to file %s\n", written, tempfile.Name())
}

func main() {
	http.HandleFunc("/hello", hello)
	http.HandleFunc("/upload-binary", uploadBinary)
	http.HandleFunc("/upload-multipart", uploadMultipart)
	http.ListenAndServe(":7778", nil)
}
