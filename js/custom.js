// global consts
var INFO_DIV_ID = "doc-info";
var DOCS_GRAPH_ID = "doc-graph";
var HW_ASSETS_ROOT = "assets/hardware/";
var GRAPHML_PATH = HW_ASSETS_ROOT + "doc_graph.graphml"
var GRAPH_STYLE_PATH = "css/graph_style.css"
var ALL_PARTS_PATH = HW_ASSETS_ROOT + "parts.json"
var PROCS_PATH = HW_ASSETS_ROOT + "processes.json"
var IMGS_DIR_PATH = HW_ASSETS_ROOT
var DUMMY_PROCESS_VIDEO = "https://widgets.figshare.com/articles/15135750/embed?show_title=0"

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

/* for each element of ele_type("node" or "edge"), add to the Cyto graph from the GraphML data a...
 * - tag field
 * - name and short name field
 * - element positions
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
                // \/ part or proc \/
                type: ""
            },
            position: { x: 0, y: 0 },
        };

        cyEle_obj.data.id = $(this).attr("id");
        cyEle_obj.data.label = get_GML_tag(this, "node");
        try {
            // process
            //console.log(cyEle_obj.data.id + ':');
            if (cyEle_obj.data.label[0] === '_') {
                //console.log(procs_data[cyEle_obj.data.label]);
                cyEle_obj.data.name = procs_data[cyEle_obj.data.label].name;
                cyEle_obj.data.type = "proc";
            }
            // part
            else {
                //console.log(parts_data[cyEle_obj.data.label]);
                cyEle_obj.data.name = parts_data[cyEle_obj.data.label].part;
                cyEle_obj.data.type = "part";
            }
        }
        catch (err) {
            if (err instanceof TypeError) {
                console.log("name for element with tag "+ cyEle_obj.data.label +" may be missing from JSON properties file");
                console.log("continuing with name set to tag");
                cyEle_obj.data.name = cyEle_obj.data.label;
            }
        }
        cyEle_obj.data.short_name = cyEle_obj.data.name.slice(0, 9);
        cyEle_obj.position = get_GML_pos(this, "node");
        //console.log(curr_cyEle.position());

        cy_eles_data.push(cyEle_obj);
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
			return div;
		},
		arrow: true,
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

function update_info_panel(clicked_ele, items_data) {
    // key is tag
    let tag = clicked_ele.data("label");
    // make a copy, ensure no data actually modified
    let ite_data = Object();
    if (! tag in items_data){
        console.log("ERROR: No such tag: " + tag);
        ite_data = Object({"part": "FIXME"});
    }
    else {
        ite_data = Object.assign({}, items_data[tag]);
        if (ite_data["part"] == null){
            console.log("ERROR: tag" + tag + " seems empty");
            console.log(ite_data);
            ite_data = Object({"part": "FIXME"});
        }
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
        $(INFO_DIV_ID +" > h1").html(ite_data["name"]);
        $(INFO_DIV_ID +" > iframe").attr("src", src=DUMMY_PROCESS_VIDEO);
    }
    // parts
    else {
        $('#'+INFO_DIV_ID).addClass("part");
        $('#'+INFO_DIV_ID).removeClass("process");
        $(".process_only").hide();
        $(".part_only").show();

        $(".init_only").hide();
        $('#'+INFO_DIV_ID +" > h1").html(ite_data["part"] + "[" + ite_data["number"]  +"]");
        $('#'+INFO_DIV_ID +" > img").attr("src",IMGS_DIR_PATH + "/" + tag + ".jpg");

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

    let img_HTML = `<img src="${IMGS_DIR_PATH}/${tag}.jpg" />`;
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

            /*
            // change processes to diamonds
            // we denote processes by preceding _'s in the tags
            this.$('node[label^="_"]').style( "shape", "diamond" );
            this.$('node[label^="_"]').style( "background-color", "Khaki" );
            */
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
            update_info_panel(seld, event.data.all_parts_data, event.data.imgs_dir_root);
        }
        else if (seld.isEdge()) {
            //console.log("edge");
            update_info_panel(seld, event.data.procs_data, event.data.imgs_dir_root);
        }
    }
}

$( document ).ready(function () {
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
