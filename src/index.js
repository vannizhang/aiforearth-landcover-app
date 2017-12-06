// import JS libraries
import $ from 'jquery';
import * as calcite from 'calcite-web';

// import css files
import styles from'./style/calcite-web.min.css';
import './style/main.css';

// import other files
// import tempImageToTest from './assets/temp.png';

$(document).ready(function(){
    
    dojo.require("esri/arcgis/utils");
    dojo.require("esri/request");

    dojo.require("esri/geometry/Extent");
    dojo.require("esri/symbols/SimpleLineSymbol");
    dojo.require("esri/graphic");
    
    dojo.require("esri/layers/graphics");
    dojo.require("esri/layers/MapImageLayer");
    dojo.require("esri/layers/MapImage");

    dojo.ready(dojoOnReadyHandler); 
    
    function dojoOnReadyHandler() {  

        // app config data
        const WEB_MAP_ID = "0a5a934c55594e209d1e6f5cde00bae2";
        const MAP_CONTAINER_ID = 'mapDiv';

        const LANDCOVER_MAP_IMAGE_LAYER_ID = 'landcoverMapImageLayer';
        const AREA_SELECT_GRAPHIC_LAYER_ID = 'areaSelectGraphicLayer'; 

        // app variables
        let landcoverApp = null;
        let userInterfaceShell = null;

        // initiate user interface utils
        const initUserinterfaceUtils = (function(){
            calcite.init();
            userInterfaceShell = new UserInterfaceShell();
        })();

        // initiate app
        const initApp = (function(){
            landcoverApp = new LandcoverApp();
            landcoverApp.startup();
        })();

        function LandcoverApp(){

            this.map = null;
            this.NAIPImageServerURL = null;

            this.symbolForSquareAreaReferenceGraphic = null;
            this.symbolForSquareAreaHighlightGraphic = null;
            
            this.startup = function(){
                esri.arcgis.utils.createMap(WEB_MAP_ID, MAP_CONTAINER_ID).then(response=>{
                    console.log(response);
                    let map = response.map;
                    this._setMap(map);
                    this._setNAIPImageServerURL(response);
                    this._setMapEventHandlers(map);
                    this._initAreaSelectGraphicLayer(map);
                    this._initMapImageLayerForLandcover(map);
                });
            };

            this._setMap = function(map){
                this.map = map;
            };

            this._setNAIPImageServerURL = function(webMapResopnse){
                let operationalLayers = webMapResopnse.itemInfo.itemData.operationalLayers;   
                let NAIPLayer = operationalLayers.filter(d=>{
                    return d.title === 'NAIP';
                })[0];
                if(NAIPLayer){
                    this.NAIPImageServerURL = NAIPLayer.url;
                } else {
                    console.log('NAIP layer not found!');
                    return;
                }
            };

            this._initAreaSelectGraphicLayer = function(map){
                let areaSelectGraphicLayer = new esri.layers.GraphicsLayer({
                    id: AREA_SELECT_GRAPHIC_LAYER_ID
                });
                map.addLayer(areaSelectGraphicLayer);
            };

            this._initMapImageLayerForLandcover = function(map){
                var mapImageLayer = new esri.layers.MapImageLayer({
                    'id': LANDCOVER_MAP_IMAGE_LAYER_ID
                });
                map.addLayer(mapImageLayer);
            };

            this._addImageToLandcoverMapImageLayer = function(imageURL, extent){
                let mapImage = new esri.layers.MapImage({
                    'extent': extent,
                    'href': imageURL
                });
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.removeAllImages();
                mapImageLayer.addImage(mapImage);
            }

            this._clearLandcoverMapImage = function(){
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.removeAllImages();
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
                userInterfaceShell.toggleLoadingIndicator(true);
                let areaSelectHighlightGraphic = this._getSquareAreaGraphic(evt);
                this._clearLandcoverMapImage();
                this._addGraphicToAreaSelectLayer(areaSelectHighlightGraphic);
                this._getLandcoverImgForSelectedArea(evt.mapPoint);
            };

            // show area select reference layer on mousemove
            this._mapOnMousemoveHandler = function(evt){
                // console.log(evt);
                let sqAreaReferenceGraphic = this._getSquareAreaGraphic(evt);
                this.map.graphics.clear();
                this.map.graphics.add(sqAreaReferenceGraphic);                
            };

            this._getLandcoverImgForSelectedArea = function(mapPoint){
                let sqExtent = this._getSquareExtentByMapPoint(mapPoint);
                this._exportNAIPImageForSelectedArea(sqExtent).then(response=>{
                    if(response.error){
                        console.log("error when export NAIP image", response.error);
                        return;
                    } else {
                        // console.log("Successfully export the NAIP Image ", response);
                        this._addImageToLandcoverMapImageLayer(response.href, sqExtent);
                    }
                    userInterfaceShell.toggleLoadingIndicator(false);
                });
                // this._addImageToLandcoverMapImageLayer(tempImageToTest, sqExtent);
            };

            this._exportNAIPImageForSelectedArea = function(inputExtent){
                let deferred = $.Deferred();
                let requestURL = this.NAIPImageServerURL + "/exportImage";
                let requestParams = this._getRequestParamsToExportImageFromNAIPLayer(inputExtent);
                let layersRequest = esri.request({
                    url: requestURL,
                    content: requestParams,
                    handleAs: "json",
                    callbackParamName: "callback"
                }, {
                    useProxy: false,
                    usePost: true
                });
                let reuqestOnSuccessHandler = function(response){
                    // console.log("Success: ", response);
                    deferred.resolve(response);
                };
                let reuqestOnErrorHandler = function(response){
                    // console.log("Error: ", error.message);
                    deferred.resolve({"error": error.message});
                }; 
                layersRequest.then(reuqestOnSuccessHandler, reuqestOnErrorHandler);
                return deferred.promise();
            };

            this._getRequestParamsToExportImageFromNAIPLayer = function(selectedAreaExtent){
                const padding = 0;
                let requestParams = {
                    bbox: (selectedAreaExtent.xmin - padding) + "," + (selectedAreaExtent.ymin - padding) + "," + (selectedAreaExtent.xmax + padding) + "," + (selectedAreaExtent.ymax + padding),
                    size: (384 + 2 * padding) + "," + (384 + 2 * padding),
                    format: "png",
                    renderingRule: '{"rasterFunction":"none"}',
                    f: "json"
                };
                return requestParams;
            };

            // highlight the user selected area
            this._addGraphicToAreaSelectLayer = function(graphic){
                let areaSelectGraphicLayer = this.map.getLayer(AREA_SELECT_GRAPHIC_LAYER_ID);
                areaSelectGraphicLayer.clear();
                areaSelectGraphicLayer.add(graphic);
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
                const OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC = [255, 0, 0, 200];

                this.symbolForSquareAreaReferenceGraphic = (!this.symbolForSquareAreaReferenceGraphic) ? this._getSimpleFillSymbol(FILL_COLOR_FOR_REF_GRAPHIC) : this.symbolForSquareAreaReferenceGraphic;
                this.symbolForSquareAreaHighlightGraphic = (!this.symbolForSquareAreaHighlightGraphic) ? this._getSimpleFillSymbol(null, OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC) : this.symbolForSquareAreaHighlightGraphic;
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

        function UserInterfaceShell(){
            // cache DOM nodes
            const $body = $('body');
            const $loadingIndicatorWrap = $('#loading-indicator-wrap');
            const $loadingIndicator = $('.loading-indicator');

            this.toggleLoadingIndicator = function(isVisible){
                if(isVisible){
                    $loadingIndicatorWrap.removeClass('hide');
                    $loadingIndicator.addClass('is-active');
                } else {
                    $loadingIndicatorWrap.add('hide');
                    $loadingIndicator.removeClass('is-active');
                }
            }
        }



        


    }
});

