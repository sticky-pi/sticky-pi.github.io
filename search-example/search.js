// img credit <a href="https://www.flaticon.com/free-icons/component" title="component icons">Component icons created by Freepik - Flaticon</a>
var PART_ICON_PATH = "part_icon.png";
// img cred <a href="https://www.flaticon.com/free-icons/process" title="process icons">Process icons created by Eucalyp - Flaticon</a>
var PROC_ICON_PATH = "proc_icon.png";
var options = {
    url: "search_tags.json",

	getValue: "name",

    list: {
        match: { enabled: true }
    },

	template: {
		type: "custom",
        method: function(val, item) {
			if (item.type === "part") {
                return "<img src='" + PART_ICON_PATH + "'/> | " + val;
            }
            else {
                return "<img src='" + PROC_ICON_PATH + "'/> | " + val;
            }
        }
    }
};

$("#template-custom").easyAutocomplete(options);
