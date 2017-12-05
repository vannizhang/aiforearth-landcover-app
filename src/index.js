import $ from 'jquery';
import * as calcite from 'calcite-web';

$(document).ready(function(){
    
    dojo.require("esri/arcgis/utils");
    dojo.require("esri/geometry/Extent");
    dojo.require("esri/symbols/SimpleLineSymbol");
    dojo.require("esri/graphic");
    dojo.require("esri/layers/graphics");

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
            this.areaSelectGraphicLayer = null;

            this.symbolForSquareAreaReferenceGraphic = null;
            this.symbolForSquareAreaHighlightGraphic = null;
            
            this.startup = function(){
                esri.arcgis.utils.createMap(WEB_MAP_ID, MAP_CONTAINER_ID).then(response=>{
                    // console.log(response);
                    this._setMap(response.map);
                    this._setMapEventHandlers(response.map);
                    this._initAreaSelectGraphicLayer(response.map);
                });
            };

            this._setMap = function(map){
                this.map = map;
            };

            this._initAreaSelectGraphicLayer = function(map){
                this.areaSelectGraphicLayer = new esri.layers.GraphicsLayer();
                map.addLayer(this.areaSelectGraphicLayer);
            }

            this._setMapEventHandlers = function(map){
                map.on('click', evt=>{
                    this._mapOnClickHandler(evt);
                });
                map.on('mouse-move', evt=>{
                    this._mapOnMousemoveHandler(evt);
                });
            };

            // show area select highlight layer on click
            this._mapOnClickHandler = function(evt){    
                //console.log(evt);
                let areaSelectHighlightGraphic = this._getSquareAreaGraphic(evt);
                this._addGraphicToAreaSelectLayer(areaSelectHighlightGraphic);
            };

            // show area select reference layer on mousemove
            this._mapOnMousemoveHandler = function(evt){
                // console.log(evt);
                let sqAreaReferenceGraphic = this._getSquareAreaGraphic(evt);
                this.map.graphics.clear();
                this.map.graphics.add(sqAreaReferenceGraphic);                
            };

            this._addGraphicToAreaSelectLayer = function(graphic){
                this.areaSelectGraphicLayer.clear();
                this.areaSelectGraphicLayer.add(graphic)
            };

            this._getSquareAreaGraphic = function(evt){
                // console.log(evt);
                let sqExtent = this._getSquareExtentByMapPoint(evt.mapPoint);
                let symbol = this._getSymbolForSquareAreaGraphicByEventType(evt.type);
                let areaSelectGraphic = new esri.Graphic(sqExtent, symbol);
                return areaSelectGraphic;
            };

            this._getSymbolForSquareAreaGraphicByEventType = function(eventType){
                const FILL_COLOR_FOR_REF_GRAPHIC = [50,50,50,100];
                const FILL_COLOR_FOR_HIGHLIGHT_GRAPHIC = [255, 0, 0, 100];

                this.symbolForSquareAreaReferenceGraphic = (!this.symbolForSquareAreaReferenceGraphic) ? this._getSimpleFillSymbol(FILL_COLOR_FOR_REF_GRAPHIC) : this.symbolForSquareAreaReferenceGraphic;
                this.symbolForSquareAreaHighlightGraphic = (!this.symbolForSquareAreaHighlightGraphic) ? this._getSimpleFillSymbol(FILL_COLOR_FOR_HIGHLIGHT_GRAPHIC) : this.symbolForSquareAreaHighlightGraphic;
                let symbolByEventType = (eventType === 'click') ? this.symbolForSquareAreaHighlightGraphic : this.symbolForSquareAreaReferenceGraphic;
                return symbolByEventType;
            };

            this._getSquareExtentByMapPoint = function(mapPoint){
                const SIDE_LENGTH_HALF = 192;
                let extent = new esri.geometry.Extent({
                    "xmin": mapPoint.x - SIDE_LENGTH_HALF, 
                    "ymin": mapPoint.y - SIDE_LENGTH_HALF,
                    "xmax": mapPoint.x + SIDE_LENGTH_HALF, 
                    "ymax": mapPoint.y + SIDE_LENGTH_HALF, 
                    "spatialReference": this.map.spatialReference
                });
                return extent;
            }

            this._getSimpleFillSymbol = function(fillColorRGBA=[0,0,0,0], outlineColorRGBA=[0,0,0,0]){
                let symbol = new esri.symbol.SimpleFillSymbol({
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": fillColorRGBA,
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": outlineColorRGBA,
                        "width": 1
                    }
                });
                return symbol;
            }
        }



        


    }
});

