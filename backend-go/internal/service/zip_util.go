package service

import (
	"archive/zip"
	"bytes"
	"io"
)

type ZipEntry struct {
	Name    string
	Content string
}

func zipFiles(files []struct {
	name string
	data string
}) ([]byte, error) {
	buf := new(bytes.Buffer)
	zw := zip.NewWriter(buf)
	for _, file := range files {
		w, err := zw.Create(file.name)
		if err != nil {
			return nil, err
		}
		if _, err := w.Write([]byte(file.data)); err != nil {
			return nil, err
		}
	}
	if err := zw.Close(); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func unzipFiles(data []byte) ([]ZipEntry, error) {
	zr, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return nil, err
	}
	entries := make([]ZipEntry, 0, len(zr.File))
	for _, f := range zr.File {
		rc, err := f.Open()
		if err != nil {
			return nil, err
		}
		content, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			return nil, err
		}
		entries = append(entries, ZipEntry{Name: f.Name, Content: string(content)})
	}
	return entries, nil
}
