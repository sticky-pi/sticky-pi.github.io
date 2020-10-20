#!/bin/sh

Rscript -e "bookdown::render_book('00-index.Rmd', 'bookdown::gitbook')"
