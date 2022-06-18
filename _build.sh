#!/bin/sh

# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::gitbook', 'bookdown::pdf_book'))"

Rscript -e "bookdown::render_book('index.Rmd', 'bookdown::gitbook')" &&
rsync -rvP assets/hardware/ _book/assets/hardware &&
rsync -rvP js/ _book/js &&
rsync -rvP css/ _book/css &&
rsync -rvP _libs/ _book/_libs

#rsync assets/*.mp4  _book/assets/ -v
# Rscript -e "bookdown::render_book('index.Rmd', c('bookdown::pdf_book'))"
