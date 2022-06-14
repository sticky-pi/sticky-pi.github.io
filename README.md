# Source for the [Sticky Pi website](https://sticky-pi.github.io).
Sticky Pi is a tool to monitor insect populations using camera-based smart traps and machine learning.

## Hardware
An **interactive documentation graph** for building the hardware of the open source [Sticky Pi](https://doc.sticky-pi.com/), a "smart" insect ecology data collection and exploration device. 

### Usage

### Configuration [Internal]
**NOTE**: tags are stored in the Cytoscape.js graph object under the key "label", ***not*** "tag", because Cytoscape.js's renderer/displayer doesn't recognize "tag" as a data field key
- *the* documentation graph specified by `assets/doc_graph.graphml`
- graph layout specified in `app/graph_GML.js` as `layout` in the Cytoscape.js graph construction, default `dagre`
- graph style (e.g. node and edge colour, size) specified as CSS-style sheet, `assets/graph_style.json`

##### Node Selecting Handling
- at initial loading, URL hash parsed --> trigger cytojs internal node select event
- when user taps a node,
    1. hash updated
    2. `hashchange` event binding in "main" function *automatically* trigger URL hash parsing
