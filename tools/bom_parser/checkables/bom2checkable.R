args <- commandArgs(trailingOnly = TRUE)
args
args[1]

flat_text <- read.csv(file=args[1])
#out_path <- paste("flat", args[0], ".md", sep='')
write.table(flat_text, file=args[2], sep="\n")
