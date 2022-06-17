library("readxl")
library("rjson")
library('markdown')
library('data.table')
library("glue")


BOM_FILE <- "BOM_extended.xlsx"
OUT_DIR <- "bom_tables"
SD_IMAGE_LINK <- "http://TEST"

dir.create(OUT_DIR, recursive=T)
sheets <- readxl::excel_sheets(BOM_FILE)
for(s in sheets){

    message(paste("parsing", s))
    dt <- as.data.table(readxl::read_excel("BOM_extended.xlsx", sheet=s))

    dt[, description := sapply(description, function(x){
            # parse {{}} template symbols
            if(is.na(x))
                return("")
            x <- glue(x)
            o <- markdownToHTML(text = x, fragment.only = TRUE)
            print(o)
            o

    })]
    dt_rows <- split(dt, 1:nrow(dt))

    names(dt_rows) <- dt$tag
    json_table <- toJSON(dt_rows,)
    filename <- paste( OUT_DIR , paste(s, "json", sep=".") ,sep="/")
    message(paste("Parse table", s, "to", filename))
    write(json_table, filename)
}