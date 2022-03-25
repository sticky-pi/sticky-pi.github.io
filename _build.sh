#!/bin/sh

# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::gitbook', 'bookdown::pdf_book'))"
Rscript -e "bookdown::render_book('00-index.Rmd', 'bookdown::gitbook')"
#rsync assets/*.mp4  _book/assets/ -v
# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::pdf_book'))"
