import $ from 'jquery';
import * as calcite from 'calcite-web';

$(document).ready(function(){
    
    dojo.require("esri/arcgis/utils");
    dojo.ready(dojoOnReadyHandler); 
    
    function dojoOnReadyHandler() {  

        // app config data
        const WEB_MAP_ID = "0a5a934c55594e209d1e6f5cde00bae2";
        const MAP_CONTAINER_ID = 'mapDiv';

        // app variables
        let landcoverApp = null;

        // cache DOM nodes
        const $body = $('body');

        // initiate user interface utils
        const initUserinterfaceUtils = (function(){
            calcite.init();
        })();

        // initiate app
        const initApp = (function(){
            landcoverApp = new LandcoverApp();
            landcoverApp.startup();
        })();

        function LandcoverApp(){

            this.map = null;
            
            this.startup = function(){
                esri.arcgis.utils.createMap(WEB_MAP_ID, MAP_CONTAINER_ID).then(response=>{
                    console.log(response);
                    this._setMap(response.map);
                });
            }

            this._setMap = function(mapObject){
                this.map = mapObject;
            }
        }



        


    }
});

