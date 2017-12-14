// import JS libraries
import $ from 'jquery';
import * as calcite from 'calcite-web';

// import css files
import styles from'./style/calcite-web.min.css';
import './style/main.css';
import { setTimeout } from 'timers';

// import other files
// import testTiff from './assets/test.tif';

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
        const MS_AZURE_SERVER_URL = "http://vm-land-arcgis1.eastus.cloudapp.azure.com";
        const LANDCOVER_PROCESSING_SERVICE_URL ="http://vm-land-arcgis1.eastus.cloudapp.azure.com/LCHandler.cshtml";

        const LANDCOVER_MAP_IMAGE_LAYER_ID = 'landcoverMapImageLayer';
        const AREA_SELECT_GRAPHIC_LAYER_ID = 'areaSelectGraphicLayer'; 

        // app variables
        let landcoverApp = null;
        let userInterfaceUtils = null;

        // initiate user interface utils
        const initUserinterfaceUtils = (function(){
            calcite.init();
            userInterfaceUtils = new UserInterfaceUtils();
            userInterfaceUtils.startup();
        })();

        // initiate app
        const initApp = (function(){
            // esri.config.defaults.io.alwaysUseProxy = false;
            // esri.config.defaults.io.corsEnabledServers.push(MS_AZURE_SERVER_URL);

            landcoverApp = new LandcoverApp();
            landcoverApp.startup();
        })();

        function LandcoverApp(){

            this.map = null;
            this.NAIPImageServerURL = null;
            this.shiftValues = [5, 5, 5, 5];
            this.extentForSelectedArea = null;

            this.symbolForSquareAreaReferenceGraphic = null;
            this.symbolForSquareAreaHighlightGraphic = null;
            
            this.startup = function(){
                esri.arcgis.utils.createMap(WEB_MAP_ID, MAP_CONTAINER_ID).then(response=>{
                    // console.log(response);
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

            this._setExtentForSelectedArea = function(extent){
                this.extentForSelectedArea = extent;
            }

            this._getShiftValues = function(){
                let shifts = this.shiftValues.map(d=>{return d});
                return shifts;
            };

            // call this function to set and reset the shiftValues
            this.updateShiftValues = function(index=null, value=null){
                if(!index && !value){
                    this.shiftValues = [5, 5, 5, 5];
                } else {
                    this.shiftValues[index] = value * 1.0 / 10;
                }
            }

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

            this.addImageToLandcoverMapImageLayer = function(imageURL){
                let extent = this.extentForSelectedArea;
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

                userInterfaceUtils.toggleLoadingIndicator(true);
                userInterfaceUtils.toggleTrainingImageContainer(false);
                userInterfaceUtils.resetTrainingImageGridCells();

                let sqExtent = this._getSquareExtentByMapPoint(mapPoint);
                this._setExtentForSelectedArea(sqExtent);
                this._exportNAIPImageForSelectedArea(sqExtent).then(response=>{
                    if(response.error){
                        console.log("error when export NAIP image", response.error);
                        userInterfaceUtils.toggleLoadingIndicator(false);
                        return;
                    } else {
                        // console.log("Successfully export the NAIP Image ", response);
                        let params = this._getParamsToRequestAIServer(response);
                        this._requestAIServer(params);
                    }
                });
                // this._addImageToLandcoverMapImageLayer(tempImageToTest, sqExtent);
            };

            this._getParamsToRequestAIServer = function(exportedNAIPImageResponse){
                const MODE = "rgb"; // rgb or cls
                const SHIFTS = this._getShiftValues();
                exportedNAIPImageResponse.mode = MODE;
                exportedNAIPImageResponse.w = SHIFTS;
                return JSON.stringify(exportedNAIPImageResponse);
            };

            this._requestAIServer = function(params){
                $.ajax({
                    type: "POST",
                    url: LANDCOVER_PROCESSING_SERVICE_URL,
                    data: params,
                    dataType : 'json',
                    crossDomain: true,
                    context: this
                })
                .done(function( response ) {
                    this._requestAIServerOnSuccessHandler(response);
                })
                .fail(function() {
                    this._requestAIServerOnErrorHandler();
                });
            };

            this._requestAIServerOnSuccessHandler = function(response){
                // console.log(response);
                this._loadTiffImage(response.output_soft);
            };

            this._requestAIServerOnErrorHandler = function(response){
                console.error( "error when retrieve landcover classification image from AI server" );
                userInterfaceUtils.toggleLoadingIndicator(false);
                userInterfaceUtils.showRequestFailedAlert();
            };

            this._loadTiffImage = function(imageSrcPath){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', imageSrcPath);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    var buffer = xhr.response;
                    var tiff = new Tiff({buffer: buffer});
                    var canvasForTiffImg = tiff.toCanvas();
                    if (canvasForTiffImg) {
                        let imageData = canvasForTiffImg.toDataURL();
                        userInterfaceUtils.populateTrainingImage(imageData);
                        userInterfaceUtils.getCanvasForTiffImgSideLength(canvasForTiffImg);
                        userInterfaceUtils.toggleLoadingIndicator(false);
                    }
                };
                xhr.send();
            }

            this._exportNAIPImageForSelectedArea = function(inputExtent){
                let deferred = $.Deferred();
                let requestURL = this.NAIPImageServerURL + "/exportImage";
                let requestParams = this._getParamsToExportImageFromNAIPLayer(inputExtent);
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

            this._getParamsToExportImageFromNAIPLayer = function(selectedAreaExtent){
                const padding = 0;
                let requestParams = {
                    bbox: (selectedAreaExtent.xmin - padding) + "," + (selectedAreaExtent.ymin - padding) + "," + (selectedAreaExtent.xmax + padding) + "," + (selectedAreaExtent.ymax + padding),
                    size: (384 + 2 * padding) + "," + (384 + 2 * padding),
                    format: "tiff",
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

        function UserInterfaceUtils(){

            const NUM_OF_GRID_CELLS = 16;
            
            // cache DOM nodes
            const $body = $('body');
            const $loadingIndicator = $('#loader-for-landcover-image-request');
            const $trainingImage = $('#training-image');
            const $trainingImageSquareDiv = $('#training-image-square-div');
            const $trainingImageGridDiv = $('#training-image-grid');
            const $trainingImageMsg = $('#training-image-message');
            const $requestFailedAlert = $('#ai-request-failed-alert');

            this.canvasForTiffImgSideLength = 0;

            this.startup = function(){
                this._populateTrainingImageGridCells(NUM_OF_GRID_CELLS);
                this.initEventHandlers();
            };

            this.initEventHandlers = function(){
                let self = this;
                $body.on('click', '.grid-cell', trainingImageGridCellOnClickHandler);

                function trainingImageGridCellOnClickHandler(evt){
                    let targetGridCell = $(this);
                    let targetCellIndex = targetGridCell.attr('data-grid-index');
                    targetGridCell.addClass('active');
                    targetGridCell.siblings().removeClass('active');
                    self._getTrainingImageTile(targetCellIndex).then(imageTileDataURL=>{
                        // console.log(imageTileDataURL);
                        landcoverApp.addImageToLandcoverMapImageLayer(imageTileDataURL);
                    });
                }
            };

            this.populateTrainingImage = function(imageData){
                $trainingImage.attr('src', imageData);
                this.toggleTrainingImageContainer(true);
            };

            this.getCanvasForTiffImgSideLength = function(canvas){
                this.canvasForTiffImgSideLength = $(canvas).attr('width');
            };

            this._getGridCellPosition = function(cellIndex){
                cellIndex = +cellIndex;
                let numOfItemsPerRow = Math.sqrt(NUM_OF_GRID_CELLS);
                let numOfItemsPerColumn = numOfItemsPerRow;
                let gridCellRowIndex = Math.floor(cellIndex /  numOfItemsPerRow);
                let gridCellColIndex = cellIndex % numOfItemsPerColumn;
                return [gridCellColIndex, gridCellRowIndex];
            };

            this._getTrainingImageTile = function(cellIndex){
                let deferred = $.Deferred();

                let gridCellPosition = this._getGridCellPosition(cellIndex);
                let gridColIndex = gridCellPosition[0];
                let gridRowIndex = gridCellPosition[1];
                let tileSidelength = this.canvasForTiffImgSideLength / Math.sqrt(NUM_OF_GRID_CELLS);
                let trainingImageSrc = $trainingImage.attr('src');
                
                let canvas = document.createElement('canvas');
                canvas.width = tileSidelength;
                canvas.height = tileSidelength;

                let ctx = canvas.getContext("2d");
                var img = new Image;
                img.onload = ()=>{
                    // The X and Y coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
                    let sourceX = gridColIndex * tileSidelength;
                    let sourceY = gridRowIndex * tileSidelength;
                    // The width and height of the sub-rectangle of the source image to draw into the destination context
                    let sWidth = tileSidelength; 
                    let sHeight = tileSidelength;
                    // The X and Y coordinate in the destination canvas at which to place the top-left corner of the source image
                    let destinationX = 0;
                    let destinationY = 0;
                    // The width and height to draw the image in the destination canvas
                    let destinationCanvasWidth = tileSidelength;
                    let destinationCanvasHeight = tileSidelength;
                    let dataURL = null;

                    ctx.drawImage(img, sourceX, sourceY, sWidth, sHeight, destinationX, destinationY, destinationCanvasWidth, destinationCanvasHeight);
                    dataURL = canvas.toDataURL();
                    deferred.resolve(dataURL);
                };
                img.src = trainingImageSrc;
                return deferred.promise();
            };

            this._populateTrainingImageGridCells = function(numOfCells){
                let gridCellStrs = [];
                let gridCellWidthByPct = 1 / Math.sqrt(NUM_OF_GRID_CELLS) * 100;
                for(var i = 0; i < numOfCells; i++){
                    gridCellStrs.push(`<div class="grid-cell" data-grid-index=${i} style='width:${gridCellWidthByPct}%;'></div>`);
                }
                $trainingImageGridDiv.append(gridCellStrs.join(''));
            };

            this.resetTrainingImageGridCells = function(){
                $trainingImageGridDiv.find('.grid-cell').removeClass('active');
            };

            this.toggleTrainingImageContainer = function(isVisible){
                if(isVisible){
                    $trainingImageSquareDiv.removeClass('hide');
                } else {
                    $trainingImageSquareDiv.addClass('hide');
                }
            };

            this.toggleLoadingIndicator = function(isVisible){
                if(isVisible){
                    $loadingIndicator.removeClass('hide');
                    $loadingIndicator.addClass('is-active');
                    $trainingImageMsg.addClass('hide');
                } else {
                    $loadingIndicator.addClass('hide');
                    $loadingIndicator.removeClass('is-active');
                    $trainingImageMsg.removeClass('hide');
                }
            };

            this.showRequestFailedAlert = function(){
                $requestFailedAlert.removeClass('hide');
                setTimeout(function(){
                    $requestFailedAlert.addClass('hide');
                }, 2500);
            };


        }



        


    }
});

