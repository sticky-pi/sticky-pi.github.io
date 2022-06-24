library("readxl")
library("rjson")
library('markdown')
library('data.table')
library("glue")
library("htm2txt")


BOM_FILE <- "BOM_extended.xlsx"
OUT_DIR <- "bom_tables"
SD_IMAGE_LINK <- "https://zenodo.org/record/6672639/files/custom-2022-05-31_sticky_pi_rpi.img.gz"

SEARCH_FIELD <- "search_str"

dir.create(OUT_DIR, recursive=T)
sheets <- readxl::excel_sheets(BOM_FILE)

l <- lapply(sheets, function(s){

    dt <- as.data.table(readxl::read_excel("BOM_extended.xlsx", sheet=s))

    dt[, description := sapply(description, function(x){
            # parse {{}} template symbols
            if(is.na(x))
                return("")
            x <- glue(x)
            o <- markdownToHTML(text = x, fragment.only = TRUE)

            o

    })]
    dt
})



dt_to_json <- function(dt, filename){
    dt_rows <- split(dt, 1:nrow(dt))
    names(dt_rows) <- dt$tag
    json_table <- toJSON(dt_rows)
    path <- paste( OUT_DIR , filename ,sep="/")
    write(json_table, path)
}

names(l) <- sheets
setnames(l$consumables, "quantity", "number")
missing_columns <- setdiff(colnames(l$parts), colnames(l$derived_parts))
for (f in missing_columns){
    l$derived_parts[, tmp_ := NA_character_]
    setnames(l$derived_parts, "tmp_", f)
}



setcolorder(l$derived_parts, colnames(l$parts))
setcolorder(l$consumables, colnames(l$parts))



parts <- rbindlist(list(l$parts, l$derived_parts, l$consumables))

processes <- l$processes
print(processes)

colnames(parts)
parts[, tmp_ := paste(description, note, part)]
parts[, tmp_ := htm2txt(parts$tmp_)]
setnames(parts, "tmp_", SEARCH_FIELD)

processes[, tmp_ := paste(description, note, name)]
processes[, tmp_ := htm2txt(processes$tmp_)]
setnames(processes, "tmp_", SEARCH_FIELD)

#todo concatenate processes[, description, notes, name]
#todo extract plaintext from both
dt_to_json(parts, "parts.json")
dt_to_json(processes, "processes.json")
print(processes)

print("done")