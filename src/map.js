define([], function() {
    require(["esri/map", "dojo/domReady!"], function(Map) {
        var map = new Map("mapDiv", {
            center: [-118, 34.5],
            zoom: 8,
            basemap: "topo"
        });
    });
});
