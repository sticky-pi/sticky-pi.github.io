// global consts
var INFO_DIV_ID = "doc-info";
var DOCS_GRAPH_ID = "doc-graph";
var SEARCH_BAR_ID = "search-bar";
var THUMBNAIL_WIDTH = 128;
// max num chars for shortened/abbreviated name to be displayed in node label
var DISP_NAME_MAX_LEN = 13;

var HW_ASSETS_ROOT = "assets/hardware/";
var GRAPHML_PATH = HW_ASSETS_ROOT + "doc_graph.graphml"
var GRAPH_STYLE_PATH = "css/graph_style.css"

var ALL_PARTS_PATH = HW_ASSETS_ROOT + "parts.json"
var PROCS_PATH = HW_ASSETS_ROOT + "processes.json"
// matches the "search_str" field header in the above JSONs
var IMGS_DIR_PATH = HW_ASSETS_ROOT
var DUMMY_PROCESS_VIDEO = "https://widgets.figshare.com/articles/15135750/embed?show_title=0"

var SEARCH_KEY = "search_str";
/*
var SEARCH_KEYS = {
    part: [ "part", "description" ],
    proc: [ "name", "description" ]
}
*/
// img credit <a href="https://www.flaticon.com/free-icons/component" title="component icons">Component icons created by Freepik - Flaticon</a>
var PART_ICON_PATH = HW_ASSETS_ROOT + "part_icon.jpg";
// img cred <a href="https://www.flaticon.com/free-icons/process" title="process icons">Process icons created by Eucalyp - Flaticon</a>
var PROC_ICON_PATH = HW_ASSETS_ROOT + "proc_icon.png";

function capital_case(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function get_GML_tag($gml_node, ele_type) {
    // tags are val of yEd GraphML <label>s, inside <node>s, <edge>s
    //console.log("GraphML node: ", $gml_node);
                            // ex. node: "y:NodeLabel"
    let $label_node = $($gml_node)
        .find( `y\\:${ capital_case(ele_type) }Label` );
    tag = $label_node.text().trim();
    //console.log(tag);
    return tag;
}

function get_GML_pos($gml_node, ele_type, xscale=1, yscale=1) {
    // pos's are attributes of yEd GraphML <label>s, inside <node>s, <edge>s
    // Cyto pos format is an object, {x: float, y: float}
    let pos = {x: 0, y: 0};
    let geom_node = $($gml_node).find( "y\\:Geometry" );

    pos.x = xscale * geom_node.attr('x');
    pos.y = yscale * geom_node.attr('y');
    //console.log(pos);
    return pos;
}

function set_node_name(cyNode_obj, parts_data, procs_data) {
    try {
        // process
        //console.log(cyNode_obj.data.id + ':');
        if (cyNode_obj.data.label[0] === '_') {
            //console.log(procs_data[cyNode_obj.data.label]);
            cyNode_obj.data.name = procs_data[cyNode_obj.data.label].name;
        }
        // part
        else {
            //console.log(parts_data[cyNode_obj.data.label]);
            cyNode_obj.data.name = parts_data[cyNode_obj.data.label].part;
        }
    }
    catch (err) {
        if (err instanceof TypeError) {
            console.log("name for element with tag "+ cyNode_obj.data.label +" may be missing from JSON properties file");
            console.log("continuing with name set to tag");
            cyNode_obj.data.name = cyNode_obj.data.label;
        }
    }
    cyNode_obj.data.short_name = cyNode_obj.data.name.slice(0, DISP_NAME_MAX_LEN);
}

function set_node_type(cyNode_obj) {
    // process
    if (cyNode_obj.data.label[0] === '_') {
        cyNode_obj.data.is_proc = 1;
    }
    // part
    else {
        //console.log(parts_data[cyNode_obj.data.label]);
        cyNode_obj.data.is_proc = 0;
    }
}

// add given cytoscape node ID for part/proc in parts/procs_data
function props_data_add_cyID(cyNode_obj, parts_data, procs_data) {
    // for potential items in graph but not parts/procs properties JSON
    // warning message for user already logged by set_node_name()
    if (cyNode_obj.data.label in parts_data || cyNode_obj.data.label in procs_data) {
        // add id to parts/procs data
        if (cyNode_obj.data.is_proc == 1) {
            //console.log("process", cyNode_obj.data.label, cyNode_obj.data.is_proc, procs_data[ cyNode_obj.data.label ]);
            procs_data[ cyNode_obj.data.label ].id = cyNode_obj.data.id;
        }
        else {
            //console.log("part", cyNode_obj.data.label, cyNode_obj.data.is_proc, parts_data[ cyNode_obj.data.label ]);
            parts_data[ cyNode_obj.data.label ].id = cyNode_obj.data.id;
        }
    }
}

/* for each element of ele_type("node" or "edge"), add to the Cyto graph from the GraphML data a...
 * - tag field
 * - name and short name field
 * - element positions
 * and add the cytoscape node id to the parts/procs data
// TODO: change ele_type to enum
 */
function graphML_to_cyEles(gml_data, parts_data, procs_data) {
	// make parsers, parts and procs are already JS obj's
    let $gml = $( $.parseXML(gml_data) );

    let cy_eles_data = [];
    let cyEle_obj;

    let $all_nodes = $gml.find("node");
    $all_nodes.each( function() {
        cyEle_obj = {
            group: "nodes",
            // short name for keeping graph legible, will show full name in tooltip on hover
            data: { id: "", label: "",
                name: "", short_name: "",
                is_proc: 0
            },
            position: { x: 0, y: 0 },
        };

        cyEle_obj.data.id = $(this).attr("id");
        cyEle_obj.data.label = get_GML_tag(this, "node");
        set_node_name(cyEle_obj, parts_data, procs_data);
        set_node_type(cyEle_obj);
        cyEle_obj.position = get_GML_pos(this, "node");
        //console.log(curr_cyEle.position());

        cy_eles_data.push(cyEle_obj);

        props_data_add_cyID(cyEle_obj, parts_data, procs_data);
    });
    let $all_edges = $gml.find("edge");
    $all_edges.each( function() {
        cyEle_obj = {
            group: "edges",
            data: {
                id: "", label: "",
                source: "", target: ""
            }
        };
        cyEle_obj.data.id = $(this).attr("id");
        cyEle_obj.data.label = get_GML_tag(this, "edge");
        cyEle_obj.data.source = $(this).attr("source");
        cyEle_obj.data.target = $(this).attr("target");

        cy_eles_data.push(cyEle_obj);
    });

    //console.log(parts_data);
    //console.log(procs_data);

    return cy_eles_data;
}

/*
 * DEPRECATED
function get_node_pos_init_graph(id, gml_data) {
    let $gml = $( $.parseXML(gml_data) );
    return(get_GML_pos( $gml.find('#'+id), "node"));
}
*/

function make_node_tooltip(node) {
    // adapted from cyto-Popper extension docs (https://github.com/cytoscape/cytoscape.js-popper)
    let ref = node.popperRef();
    // dummy DOM element for tooltip
    let dumDOM = document.createElement("div");

    node.tip = tippy(dumDOM, {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: "manual",
        content: function() {
			// actual content div
			let div = document.createElement("div");
			div.innerHTML = node.data("name");

            if (node.data("is_proc") == 0) {
                div.appendChild( document.createElement("BR") );

                let img_ele = document.createElement("IMG");
                img_ele.src = IMGS_DIR_PATH + node.data("label") + ".jpg";
                // all 4:3 aspect ratio
                img_ele.width = THUMBNAIL_WIDTH;
                img_ele.height = THUMBNAIL_WIDTH * 0.75;
                div.appendChild(img_ele);
            }
			return div;
		},
		arrow: true,
        // padding
        maxWidth: THUMBNAIL_WIDTH + 15,
		placement: "top",
		hideOnClick: false,
        multiple: true,
        sticky: "reference",
	});
}

function obj_to_HTMLtable(data) {
    let HTMLstr = "<table>";
    for (key in data) {
        HTMLstr += "<tr>";
        HTMLstr += "<td>"+ key +"</td>";
        HTMLstr += "<td>"+ data[key] +"</td>";
        HTMLstr += "</tr>";
    }
	HTMLstr += "</table>";
	return HTMLstr;
}

function parse_ite_data_NAs_to_null(item_data) {
    for (field in item_data) {
        if (typeof item_data[field] == "string")
        {
            // change any fields containing "NA" to null
            if (item_data[field] == "NA") {
                item_data[field] = null;
            }
        }
    }
}

function update_info_panel(clicked_ele, parts_data, processes_data) {
    // key is tag
    let tag = clicked_ele.data("label");

    let items_data = {};
    let name_key = "";
    if (tag[0] == "_"){
        name_key = "name";
        items_data = processes_data;
    }
    else {
        name_key = "part";
        items_data = parts_data;
    }

    // make a copy, ensure no data actually modified
    let ite_data = Object();
    if (! tag in items_data){
        console.log("ERROR: No such tag: " + tag);
        ite_data = Object({"part": "FIXME"});
    }
    else {
        ite_data = Object.assign({}, items_data[tag]);
        if (ite_data[name_key] == null) {
            console.log("ERROR: tag: " + tag + " seems empty");
            console.log(ite_data);
            ite_data = Object({name_key: "FIXME"});
        }
        parse_ite_data_NAs_to_null(ite_data);
    }
    //console.log(ite_data);

    // processes
    if (tag[0] == "_"){
        $(INFO_DIV_ID).addClass("process");
        $(INFO_DIV_ID).removeClass("part");
        $(".part_only").hide();
        $(".init_only").hide();
        $(".process_only").show();
        if(ite_data["name"] == null){
            ite_data["name"] = "";
            console.log(tag + " has no 'name'");
        }

        // process icon
        $('#'+INFO_DIV_ID +" > h1 > img.type_icon").attr("src",PROC_ICON_PATH);
        $('#' + INFO_DIV_ID +" > h1 > span").html(ite_data["name"]);

        var video = $('#'+ INFO_DIV_ID +" > div > video");
        video.find("source").attr("src", ite_data["asset"]);
        video.get(0).load();
        video.get(0).play();
//        $( > source").attr("src", src=ite_data["asset"]);
//        $('#'+ INFO_DIV_ID +" > div > video").load();
//        $('#'+ INFO_DIV_ID +" > div > video").play()
    }
    // parts
    else {
        $('#'+INFO_DIV_ID).addClass("part");
        $('#'+INFO_DIV_ID).removeClass("process");
        $(".process_only").hide();
        $(".part_only").show();

        $(".init_only").hide();
        // part icon
        $('#'+INFO_DIV_ID +" > h1 > img.type_icon").attr("src",PART_ICON_PATH);
        $('#'+INFO_DIV_ID +" > h1 > span").html(ite_data["part"] + "[" + ite_data["number"]  +"]");
        $('#'+INFO_DIV_ID +" > img.part_only").attr("src",IMGS_DIR_PATH + tag + ".jpg");

        $('#'+INFO_DIV_ID +" > #footer > p > #price").html(ite_data["price_per_device_CAD"]);
        console.log(ite_data["link"]);
        $('#'+INFO_DIV_ID +" > #footer > p > #link").attr("href", ite_data["link"]);
    }
    if(ite_data["description"] == null){
            $('#'+INFO_DIV_ID +" > #description").html("");
    }
    else{
        $('#'+INFO_DIV_ID +" > #description").html(ite_data["description"]);
    }

    if(ite_data["note"] == null){
            $('#'+INFO_DIV_ID +" > #note").html("");
    }
    else{
        $('#'+INFO_DIV_ID +" > #note").html(ite_data["note"]);
    }

    /* DEPRECATED: simple properties HTML table
    let $info_panel = $('#'+ INFO_DIV_ID);
    $info_panel.html( "<h1>+ ite_data["part"] +"</h1>");

    let img_HTML = `<img src="${IMGS_DIR_PATH}${tag}.jpg" />`;
    $info_panel.append(img_HTML);

    // already showing [part] as Title
    delete ite_data.part;
	$info_panel.append( obj_to_HTMLtable(ite_data) );
    */
}

function init_graph(graphml_data, graph_style_data, parts_data, procs_data) {
    var cy = window.cy = cytoscape({
        container: $('#'+DOCS_GRAPH_ID)[0],

        elements: graphML_to_cyEles(graphml_data, parts_data, procs_data),

        style: graph_style_data,

        layout: {
            name: "preset",
			fit: false, // whether to fit to viewport
			padding: 0, // padding on fit
        },

        // user interaction configs
        autoungrabify: true,
        boxSelectionEnabled: false,
        minZoom: 0.1,
        maxZoom: 10,
        // only allow selecting one at a time
        selectionType: "single",

        ready: function(event) {
            console.log("graph created");
            // make edges unselectable
            this.edges().unselectify();
        }
    });

    cy.on("tap", function(event) {
        // disable deselecting any/all nodes (tapping background)
        if (event.target === cy) {
            cy.nodes().unselectify();
        }
        // only respond to node clicks
        else if (event.target.isNode())
        {
            cy.nodes().selectify();
            // check if already done: set current URL hash to clicked element's tag
            let clicked_tag = event.target.data("label");
            if (window.location.hash != clicked_tag) {
                window.location.hash = ('#'+ clicked_tag);
                //window.location.reload();
            }
        }
    });

    // ========= Tooltips ==========
    cy.batch(function() {
        cy.nodes("").forEach( function(node){
            make_node_tooltip(node);
        });
    });
    cy.unbind("mouseover", "node");
    cy.on("mouseover", "node", function(event) {
        //console.log("tooltip: ", event.target.tip, '\t', "node: ", event.target.renderedPosition());
        event.target.tip.show();
    });
    cy.unbind("mouseout", "node");
    cy.on("mouseout", "node", function(event) {
        event.target.tip.hide();
    });

    // ensure elements come into view
    cy.center();
    cy.zoom(1.0);
    cy.fit();

    return cy;
}

function get_item_name(ite_data) {
    try {
        if (ite_data.is_proc) {
            return ite_data.name;
        }
        else {
            return ite_data.part;
        }
    }
    catch (err) {
        if (err instanceof TypeError) {
            return ite_data.tag;
        }
    }
}

function insert_is_procs(data, whether_proc) {
    let filled_data = Object.values(data)
        .map(ele => (
            { ...ele, is_proc: whether_proc }
        )
    );
    return filled_data;
}

function init_search_bar(parts_data, procs_data) {
    let options = {
        // just merge parts_data, procs_data arrays
        data: [...insert_is_procs(parts_data, 0), ...insert_is_procs(procs_data, 1)],

        getValue: SEARCH_KEY,
        placeholder: "Search for a part or process",
        list: {
            match: { enabled: true },
            onChooseEvent: function() {
                let ite_data = $('#' + SEARCH_BAR_ID).getSelectedItemData();
                window.location.hash = ('#'+ ite_data.tag);
                $('#' + SEARCH_BAR_ID).val( get_item_name(ite_data));
            }
        },
        template: {
            type: "custom",
            method: function(val, item) {
                if (item.is_proc == 1) {
                    return "<img src='" + PROC_ICON_PATH + "'/> | " + item.name;
                }
                else {
                    return "<img src='" + PART_ICON_PATH + "'/> | " + item.part;
                }
            }
        }
    };

    $('#' + SEARCH_BAR_ID).easyAutocomplete(options);
}

function handle_URL_hash(event) {
    // data: {graph: cytoscape graph, all_parts_data: obj, procs_data: obj, imgs_dir_root: str, info_div_id: str}
    // due to system for disabling deselecting all by tapping background, need to ensure all nodes selectable again
    event.data.graph.elements().selectify();
    // first ensure any previous selections cleared
    event.data.graph.elements().unselect();

	// remove '#' symbol
    let tag = window.location.hash.slice(1);
    console.log(tag);

    if (tag) {
        let seld = event.data.graph.$(`[label = '${tag}']`);
		//console.log(tag, seld.position());

        // trigger graph's highlighting and etc on-select styling
        seld.select();

        if (seld.isNode()) {
            //console.log("node");
            update_info_panel(seld, event.data.all_parts_data, event.data.procs_data, event.data.imgs_dir_root);
        }
        else if (seld.isEdge()) {
            console.log("nothing happens when clicking on an edge");
//            update_info_panel(seld, event.data.procs_data, event.data.imgs_dir_root);
        }
    }
}

$( document ).ready(function () {
    $(".part_only").hide();
    var cy;
    let graphml_data;
    let graph_style_data;
    let all_parts_data;
    let procs_data;
    // first load both data files
    $.when(
        $.get(GRAPHML_PATH, function(gml_data) {
            graphml_data = gml_data;
        }),
        $.get(GRAPH_STYLE_PATH, function(stylesheet_data) {
            graph_style_data = stylesheet_data;
        }),
        // just check if exist, fetch on demand
        $.getJSON(ALL_PARTS_PATH, function(parts_data) {
            all_parts_data = parts_data;
        }),
        $.getJSON(PROCS_PATH, function(prcs_data) {
            procs_data = prcs_data;
        })
    )
    .then(function() {
        cy = window.cy = init_graph(graphml_data, graph_style_data, all_parts_data, procs_data);
        init_search_bar(all_parts_data, procs_data);

        // enable dynamic checking
        $(window).on("hashchange", {
            graph: cy,
            all_parts_data: all_parts_data,
            procs_data: procs_data,
            imgs_dir_root: IMGS_DIR_PATH,
            info_div_id: INFO_DIV_ID
        }, handle_URL_hash);

        // hashchange event doesn't include initial loading
        $(window).trigger("hashchange", {
            graph: cy,
            all_parts_data: all_parts_data,
            procs_data: procs_data,
            imgs_dir_root: IMGS_DIR_PATH,
            info_div_id: INFO_DIV_ID
        });
    });
});
