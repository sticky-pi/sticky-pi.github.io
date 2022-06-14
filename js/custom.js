// global consts
var INFO_DIV_ID = "doc-info";
var DOCS_GRAPH_ID = "doc-graph";
var GRAPHML_PATH = "../assets/hardware/doc_graph.graphml"
var GRAPH_STYLE_PATH = "../assets/hardware/graph_style.json"
var ALL_PARTS_PATH = "../assets/hardware/parts.json"
var PROCS_PATH = "../assets/hardware/processes.json"
var IMGS_DIR_PATH = "../assets/hardware"

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
 * - element positions
// TODO: change ele_type to enum
 */
function graphML_to_cyEles(gml_data) {
	// make XML parser
    let $gml = $( $.parseXML(gml_data) );

    let cy_eles_data = [];
    let curr_cy_ele_obj;
    //let curr_ele_tag;
    //let curr_ele_pos;

    let $all_nodes = $gml.find("node");
    $all_nodes.each( function() {
        curr_cy_ele_obj = {
            group: "nodes",
            data: { id: "", label: "" },
            position: { x: 0, y: 0 },
        };

        curr_cy_ele_obj.data.id = $(this).attr("id");
        curr_cy_ele_obj.data.label = get_GML_tag(this, "node");
        curr_cy_ele_obj.position = get_GML_pos(this, "node");
        //console.log(curr_cyEle.position());

        cy_eles_data.push(curr_cy_ele_obj);
    });
    let $all_edges = $gml.find("edge");
    $all_edges.each( function() {
        curr_cy_ele_obj = {
            group: "edges",
            data: {
                id: "", label: "",
                source: "", target: ""
            }
        };
        curr_cy_ele_obj.data.id = $(this).attr("id");
        curr_cy_ele_obj.data.label = get_GML_tag(this, "edge");
        curr_cy_ele_obj.data.source = $(this).attr("source");
        curr_cy_ele_obj.data.target = $(this).attr("target");

        cy_eles_data.push(curr_cy_ele_obj);
    });

    return cy_eles_data;
}

/*
function get_node_pos_init_graph(id, gml_data) {
    let $gml = $( $.parseXML(gml_data) );
    return(get_GML_pos( $gml.find('#'+id), "node"));
}
*/

/*
function setup_tooltip() {
    //cy.removeListener("mouseover", "node, edge");
    cy.on("mouseover", "node, edge", function(event) {
        // adapted from Cyto-Popper extension docs (https://github.com/cytoscape/cytoscape.js-popper)
        let ref = event.target.popperRef();
        console.log(ref);
        console.log(ref.getBoundingClientRect);
        // dummy DOM element for tooltip
        let $dumDOM = $('#'+ DOCS_GRAPH_ID ).append("<div></div>");
        $dumDOM.html( event.target.data("label") );

        let tip = new tippy($dumDOM[0], {
			getReferenceClientRect: ref.getBoundingClientRect,
			trigger: "manual",
			content: $dumDOM.html()
        });

        //tip.show();
    });

    //cy.removeListener("mouseover", "node, edge");
    cy.on("mouseout", "node, edge", function(event) {
        //this.id2tip[event.target.id()].hide();
    });
}
*/

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

function update_info_panel(clicked_ele, info_div_id, items_data, imgs_dir_root) {
    //console.log(clicked_ele.id() + " : " + clicked_ele.data("label"));
    // key is tag
    let tag = clicked_ele.data("label");
    // make a copy, ensure no data actually modified
    let ite_data = Object.assign({}, items_data[tag]);
    //console.log(ite_data);

    let $info_panel = $('#'+ info_div_id);
    $info_panel.html( "<h1>"+ ite_data["part"] +"</h1>");

    let img_HTML = `<img src="${imgs_dir_root}/${tag}.jpg" />`;
    $info_panel.append(img_HTML);

    // already showing [part] as Title
    delete ite_data.part;
	$info_panel.append( obj_to_HTMLtable(ite_data) );
}

function init_graph(graphml_data, graph_style_data) {
    var cy = window.cy = cytoscape({
        container: $('#'+DOCS_GRAPH_ID)[0],

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

        elements: graphML_to_cyEles(graphml_data),

        ready: function(event) {
            console.log("graph created");
        }
    });
    // make edges unselectable
    cy.$("edge").unselectify();
    // change processes to diamonds
    // we denote processes by preceding _'s in the tags
    cy.$('node[label^="_"]').style( "shape", "diamond" );

    // ensure elements come into view
    cy.fit();
    /*
    cy.center();
    cy.zoom(1.0);
    */

    /*
    console.log("graph elements: ", cy.elements(""));
    console.log("graph assigned to ", cy.container());
    console.log(cy.graphml());
    */

    // only respond to node clicks
    cy.on("tap", "node", function(event) {
        // check if already done: set current URL hash to clicked element's tag
		let clicked_tag = event.target.data("label");
        if (window.location.hash != clicked_tag) {
            window.location.hash = ('#'+ clicked_tag);
            //window.location.reload();
        }
    });

    return cy;
}

function handle_URL_hash(event) {
    // data: {graph: cytoscape graph, all_parts_data: obj, procs_data: obj, imgs_dir_root: str, info_div_id: str}
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
            console.log("node");
            update_info_panel(seld, event.data.info_div_id, event.data.all_parts_data, event.data.imgs_dir_root);
        }
        else if (seld.isEdge()) {
            console.log("edge");
            update_info_panel(seld, event.data.info_div_id, event.data.procs_data, event.data.imgs_dir_root);
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
            console.log( $.parseXML(graphml_data) );
        }),
        $.getJSON(GRAPH_STYLE_PATH, function(stylesheet_data) {
            graph_style_data = stylesheet_data;
            console.log(graph_style_data);
        }),
        // just check if exist, fetch on demand
        $.getJSON(ALL_PARTS_PATH, function(parts_data) {
            all_parts_data = parts_data;
        }),
        $.getJSON(PROCS_PATH, function(procs_data) {
            procs_data = procs_data;
        })
    )
    .then(function() {
        cy = window.cy = init_graph(graphml_data, graph_style_data);

        //console.log("checked");
        // enable dynamic checking
        $(window).on("hashchange", {
            graph: cy,
            all_parts_data: all_parts_data,
            procs_data: procs_data,
            imgs_dir_root: IMGS_DIR_PATH,
            info_div_id: INFO_DIV_ID
        }, handle_URL_hash);
        console.log("bound");

        // hashchange event doesn't include initial loading
        $(window).trigger("hashchange", {
            graph: cy,
            all_parts_data: all_parts_data,
            procs_data: procs_data,
            imgs_dir_root: IMGS_DIR_PATH,
            info_div_id: INFO_DIV_ID
        });
        console.log("after run");
    });
});
