#!/bin/sh

# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::gitbook', 'bookdown::pdf_book'))"
Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::gitbook'))"
# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::pdf_book'))"
