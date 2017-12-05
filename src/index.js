import $ from 'jquery';

dojo.require("esri/arcgis/utils");
dojo.ready(init); 

function init() {  

    esri.arcgis.utils.createMap("c132c7e396f64a11bfa1c24082bdb0c5", 'mapDiv').then(function(response){
        console.log(response);
    });
}