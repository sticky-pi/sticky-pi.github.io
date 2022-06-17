var PARTS_SEARCH_KEYS = ["part", "plain_description"];
var PROCS_SEARCH_KEYS = ["name", "plain_description"];

$(document).ready(function() {
    // search_data defined, assigned in "search_tags.js"
    /*
    $.get("search_tags.js", (dat) => {
        search_data = dat;
        console.log(search_data);
    }, "js");
    */

    const options = {
      isCaseSensitive: false,
      includeScore: true,
      shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      threshold: 0.5,
      distance: 60,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      ignoreFieldNorm: true,
      // fieldNormWeight: 1,
      keys: [
        "name"
      ]
    };

    // Create the Fuse index
    let index = Fuse.createIndex(options.keys, search_data);
    // initialize Fuse with the index
    let fuse = new Fuse(search_data, options, index);

    let pattern;
    let res;
    while (true) {
        pattern = prompt("search query");
        res = fuse.search(pattern);
        console.log(res);
    }
    /*
    $(".btn").click( function() {
        //console.log($("[type=\"search\"]"));
        pattern = $("[type=\"search\"]")[0].value;
    });
    */
});
