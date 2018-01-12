// import JS libraries
import $ from 'jquery';
import * as calcite from 'calcite-web';

// import css files
import styles from'./style/calcite-web.min.css';
import './style/main.css';
import { setTimeout } from 'timers';

// import other files
import cities from './us-cities-coordinates.json';
// import testTiff from './assets/test.tif';

$(document).ready(function(){
    
    dojo.require("esri/arcgis/utils");
    dojo.require("esri/request");

    dojo.require("esri/geometry/Extent");
    dojo.require("esri/geometry/Point");
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
        // const MS_AZURE_SERVER_URL = "http://vm-land-arcgis1.eastus.cloudapp.azure.com";
        // const LANDCOVER_PROCESSING_SERVICE_URL ="http://vm-land-arcgis1.eastus.cloudapp.azure.com/LCHandler.cshtml";

        const LANDCOVER_PROCESSING_SERVICE_URL ="http://vm-land-arcdemo.eastus.cloudapp.azure.com/LCHandler.cshtml";
        const LANDCOVER_PROCESSING_SERVICE_URLS = [
            "http://vm-land-arcdemo.eastus.cloudapp.azure.com/LCHandler.cshtml",
            "http://vm-land-arcgis1.eastus.cloudapp.azure.com/LCHandler.cshtml"
        ];

        const LANDCOVER_MAP_IMAGE_LAYER_ID = 'landcoverMapImageLayer';
        const AREA_SELECT_GRAPHIC_LAYER_ID = 'areaSelectGraphicLayer'; 

        const LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP = {
            "classified": "output_hard",
            "confidence": "output_soft"
        };
        const DEFAULT_LANDCOVER_IMAGE_OUTPUT_TYPE = LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP["classified"];

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
            this.NAIPLayer = null;
            this.NAIPImageServerURL = null;
            this.shiftValues = [5, 5, 5, 5]; // [water, forest, field, build], value range 0-10 with 1 decimal place
            this.extentForSelectedArea = null;
            this.lockForSelectedArea = false;
            this.landcoverImageOutputType = DEFAULT_LANDCOVER_IMAGE_OUTPUT_TYPE; // output_hard or output_soft;
            this.aiServerUrl = null;
            this.aiServerResponse = null;
            
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
                    this.setAiServerURL(LANDCOVER_PROCESSING_SERVICE_URLS[0]);
                    this.flyToRandomLocation();
                });
            };

            this._setMap = function(map){
                this.map = map;
            };

            this._setNAIPLayer = function(layer){
                this.NAIPLayer = layer;
            };

            this.setAiServerURL = function(url){
                this.aiServerUrl = url;
            };

            this._setAiServerResponse = function(response){
                this.aiServerResponse = response;
            };

            this._setExtentForSelectedArea = function(extent){
                this.extentForSelectedArea = extent;
                if(extent){
                    userInterfaceUtils.updateTileSelectionCtrlPanelPosition();
                }
            }

            this._getShiftValues = function(){
                let shifts = this.shiftValues.map(d=>{return d});
                return shifts;
            };

            this.toggleLockForSelectedArea = function(isLocked=false){
                this.lockForSelectedArea = isLocked;
            }

            this.setLandcoverImageOutputType = function(outputType){
                this.landcoverImageOutputType = outputType;
            }

            // call this function to set and reset the shiftValues
            this.updateShiftValues = function(index=null, value=null){
                if(!index && !value){
                    this.shiftValues = [5, 5, 5, 5];
                } else {
                    // this.shiftValues[index] = value * 1.0 / 10;
                    this.shiftValues[index] = value;
                }

                if(this.extentForSelectedArea){
                    this._getLandcoverImgForSelectedArea(this.extentForSelectedArea);
                }                
            }

            this._setNAIPImageServerURL = function(webMapResopnse){
                let operationalLayers = webMapResopnse.itemInfo.itemData.operationalLayers;   
                let NAIPLayer = operationalLayers.filter(d=>{
                    return d.title === 'NAIP';
                })[0];
                if(NAIPLayer){
                    this._setNAIPLayer(NAIPLayer.layerObject);
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
                let opacityVal = userInterfaceUtils.getOpacitySliderValue();
                var mapImageLayer = new esri.layers.MapImageLayer({
                    'id': LANDCOVER_MAP_IMAGE_LAYER_ID,
                    'opacity': opacityVal
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
                // let opacityVal = userInterfaceUtils.getOpacitySliderValue();
                // this.setOpcityForLandcoverMapImageLayer(opacityVal);
                mapImageLayer.removeAllImages();
                mapImageLayer.addImage(mapImage);
            }

            this.setOpcityForLandcoverMapImageLayer = function(value){
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.setOpacity(value);
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
                map.on('pan-start', (point, extent)=>{
                    this._mapOnMoveStartHandler();
                });
                map.on('pan-end', (point, extent)=>{
                    this._mapOnMoveEndHandler();
                });
                map.on('zoom-start', (point, extent)=>{
                    this._mapOnMoveStartHandler();
                });
                map.on('zoom-end', (point, extent)=>{
                    this._mapOnMoveEndHandler();
                });
                map.on('update-end', ()=>{
                    this._mapOnUpdateEndHandler();
                });
            };

            // show area select highlight layer on click
            this._mapOnClickHandler = function(evt){    
                //console.log(evt);
                if(!this.lockForSelectedArea){
                    this.resetSeletcedArea();
                    let areaSelectHighlightGraphic = this._getSquareAreaGraphic(evt);
                    let sqExtent = this._getSquareExtentByMapPoint(evt.mapPoint);
                    this._setExtentForSelectedArea(sqExtent);
                    this._updateAreaSelectLayer(areaSelectHighlightGraphic);
                    this._getLandcoverImgForSelectedArea(sqExtent);
                } 
                // lock selected area to prevent selecting another area while processing and reviewing lan cover image for the current area
                this.toggleLockForSelectedArea(true); 
            };

            // show area select reference layer on mousemove
            this._mapOnMousemoveHandler = function(evt){
                // console.log(evt);
                if(!this.lockForSelectedArea){
                    let sqAreaReferenceGraphic = this._getSquareAreaGraphic(evt);
                    this.map.graphics.clear();
                    this.map.graphics.add(sqAreaReferenceGraphic);    
                } else {
                    this.map.graphics.clear();
                }
            };

            this._mapOnMoveStartHandler = function(){
                if(this.extentForSelectedArea){
                    // console.log('start panning/zooming, hide panel for selected tile');
                    userInterfaceUtils.toggleTileSelectionControlPanel(false);
                }
            };

            this._mapOnMoveEndHandler = function(point, extent){
                if(this.extentForSelectedArea){
                    userInterfaceUtils.updateTileSelectionCtrlPanelPosition();
                    userInterfaceUtils.toggleTileSelectionControlPanel(true);
                }
            };

            this._mapOnUpdateEndHandler = function(){
                this.toggleNAIPLayer(true);
            }

            this.resetSeletcedArea = function(){
                this._clearLandcoverMapImage();
                this._setExtentForSelectedArea(null);
                this._updateAreaSelectLayer(null);
                this._setAiServerResponse(null);
                userInterfaceUtils.toggleTileSelectionControlPanel(false);
                userInterfaceUtils.toggleTrainingImageContainer(false);
                userInterfaceUtils.resetTrainingImageGridCells();
                userInterfaceUtils.resetLandcoverSliderValues();
            }

            this._getLandcoverImgForSelectedArea = function(sqExtent){

                userInterfaceUtils.toggleLoadingIndicator(true);

                this._exportNAIPImageForSelectedArea(sqExtent).then(response=>{
                    if(response.error){
                        console.error("error when export NAIP image", response.error);
                        userInterfaceUtils.showRequestFailedAlert();
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
                    url: this.aiServerUrl,
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
                this._setAiServerResponse(response);
                this.loadTiffImage();
            };

            this._requestAIServerOnErrorHandler = function(error){
                console.error( "error when retrieve landcover classification image from AI server" );
                userInterfaceUtils.showRequestFailedAlert();
            };

            this.loadTiffImage = function(){
                if(this.aiServerResponse && this.lockForSelectedArea){
                    let outputType = this.landcoverImageOutputType;
                    let imageSrcPath = this.aiServerResponse[outputType];
    
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', imageSrcPath);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function (e) {
                        var buffer = xhr.response;
                        var tiff = new Tiff({buffer: buffer});
                        var canvasForTiffImg = tiff.toCanvas();
                        if (canvasForTiffImg) {
                            let imageData = canvasForTiffImg.toDataURL();
                            userInterfaceUtils.getCanvasForTiffImgSideLength(canvasForTiffImg);
                            userInterfaceUtils.toggleLoadingIndicator(false);
                            userInterfaceUtils.populateTrainingImage(imageData);
                        }
                    };
                    xhr.send();
                } 
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
            this._updateAreaSelectLayer = function(graphicToAdd=null){
                let areaSelectGraphicLayer = this.map.getLayer(AREA_SELECT_GRAPHIC_LAYER_ID);
                areaSelectGraphicLayer.clear();
                if(graphicToAdd){
                    areaSelectGraphicLayer.add(graphicToAdd);
                }
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
                const OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC = [0, 0, 0, 200];

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
            };

            this.getScreenPositionForSelectedArea = function(){
                let extent = this.extentForSelectedArea;
                let topLeftPoint = new esri.geometry.Point( {"x": extent.xmin, "y": extent.ymax, "spatialReference": {" wkid": extent.spatialReference.wkid } });
                let topRightPoint = new esri.geometry.Point( {"x": extent.xmax, "y": extent.ymax, "spatialReference": {" wkid": extent.spatialReference.wkid } });
                let topLeftScreenPoint = this._convertMapPointToScreenPoint(topLeftPoint);
                let topRightScreenPoint = this._convertMapPointToScreenPoint(topRightPoint);
                return {
                    'topLeftScreenPoint': topLeftScreenPoint,
                    'topRightScreenPoint': topRightScreenPoint
                };
            };

            this._convertMapPointToScreenPoint = function(mapPoint){
                let screenPoint = esri.geometry.toScreenPoint(this.map.extent, this.map.width, this.map.height, mapPoint);
                return screenPoint;
            };

            this._getSimpleFillSymbol = function(fillColorRGBA=[0,0,0,0], outlineColorRGBA=[0,0,0,0]){
                let symbol = new esri.symbol.SimpleFillSymbol({
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": fillColorRGBA,
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": outlineColorRGBA,
                        "width": .5
                    }
                });
                return symbol;
            };

            this.getMapZoomLevel = function(){
                return this.map.getZoom();
            };

            this.zoomIn = function(){
                let newZoomLevel = this.getMapZoomLevel() + 1;
                this.map.setZoom(newZoomLevel);
            };

            this.zoomOut = function(){
                let newZoomLevel = this.getMapZoomLevel() - 1;
                this.map.setZoom(newZoomLevel);
            };

            this._getRandomCity = function(){
                let randomItemIndex = Math.floor(Math.random() * cities.length);
                let randomCityCoord = cities[randomItemIndex].fields.coordinates;
                let randomCityLabel = cities[randomItemIndex].fields.city + ', ' + cities[randomItemIndex].fields.state;
                return {
                    'label': randomCityLabel,
                    'coordinates': randomCityCoord
                };
            };

            this.flyToRandomLocation = function(){
                this.toggleNAIPLayer(false);
                let randomCity = this._getRandomCity();
                let randomLocationPt = new esri.geometry.Point({"x": randomCity.coordinates[1], "y": randomCity.coordinates[0], "spatialReference": {"wkid": 4326 } });
                this.map.centerAt(randomLocationPt);
                this.toggleLockForSelectedArea(false); 
                userInterfaceUtils.showMessage(randomCity.label);
            };

            this.toggleNAIPLayer = function(isVisible){
                if(isVisible){
                    this.NAIPLayer.show();
                } else {
                    this.NAIPLayer.hide();
                }
            };

        }

        function UserInterfaceUtils(){

            const NUM_OF_GRID_CELLS = 16;
            const ALERT_DISPALY_TIME = 6000; // in ms
            
            // cache DOM nodes
            const $body = $('body');
            const $loadingIndicator = $('#loader-for-landcover-image-request');
            const $trainingImage = $('#training-image');
            const $trainingImageSquareDiv = $('#training-image-square-div');
            const $trainingImageGridDiv = $('#training-image-grid');
            const $trainingImageMsg = $('#training-image-message');
            const $requestFailedAlert = $('#ai-request-failed-alert');
            const $gerenalInfoAlert = $('#general-info-alert');
            const $sliders = $('.customized-slider');
            const $tileSelectionCtrlPanel = $('#tile-selection-control-panel');
            const $opacitySlider = $('#opacity-slider');
            const $animationBtnsContainer = $('#animation-btns-container');
            const $tileSelectionCloseBtn = $('#close-tile-selection-btn');
            const $swicthServiceBtn = $('.js-switch-ldhandler-service-url');
            const $flyToRandomLocationBtn = $('.js-fly-to-random-location');
            const $selectOutputTypeBtn = $('.js-select-output-type-btn');

            this.canvasForTiffImgSideLength = 0;

            this.startup = function(){
                this._populateTrainingImageGridCells(NUM_OF_GRID_CELLS);
                this.initEventHandlers();
            };

            this.initEventHandlers = function(){
                let self = this;
                $body.on('click', '.grid-cell', trainingImageGridCellOnClickHandler);
                $sliders.on('change', sliderOnChangeHandler);
                $tileSelectionCloseBtn.on('click', tileSelectionCloseBtnOnClickHandler);
                $opacitySlider.on('change', opacitySliderOnChangeHandler);
                $swicthServiceBtn.on('click', swicthServiceBtnOnClickHandler);
                $flyToRandomLocationBtn.on('click', flyToRandomLocationBtnOnClickHandler);
                $selectOutputTypeBtn.on('click', selectOutputTypeBtnOnClickHandler);

                function trainingImageGridCellOnClickHandler(evt){
                    let targetGridCell = $(this);
                    let targetCellIndex = targetGridCell.attr('data-grid-index');
                    targetGridCell.addClass('active');
                    targetGridCell.siblings().removeClass('active');
                    self._getTrainingImageTile(targetCellIndex).then(imageTileDataURL=>{
                        landcoverApp.addImageToLandcoverMapImageLayer(imageTileDataURL);
                        self.toggleTileSelectionControlPanel(true);
                    });
                }

                function sliderOnChangeHandler(evt){
                    let targetSlider = $(this);
                    let targetSliderIndex = $sliders.index(this);
                    let targetSliderVal = +targetSlider.val();
                    landcoverApp.updateShiftValues(targetSliderIndex, targetSliderVal);
                    self.toggleTrainingImageContainer(false);
                    self.populateTileFromActiveGridCellToMap();
                    // self.resetTrainingImageGridCells();
                    // console.log(targetSliderIndex, targetSliderVal);
                }

                function tileSelectionCloseBtnOnClickHandler(evt){
                    landcoverApp.resetSeletcedArea();
                    landcoverApp.toggleLockForSelectedArea(false); // unlock the selected area so user can select new area
                }

                function opacitySliderOnChangeHandler(evt){
                    // let targetSlider = $(this);
                    // let currentValue = +targetSlider.val();
                    let opacityValue = self.getOpacitySliderValue();
                    landcoverApp.setOpcityForLandcoverMapImageLayer(opacityValue);
                }

                function flyToRandomLocationBtnOnClickHandler(evt){
                    landcoverApp.resetSeletcedArea();
                    landcoverApp.flyToRandomLocation();
                }

                function swicthServiceBtnOnClickHandler(evt){
                    let targetBtn = $(this);
                    let targetBtnIdx = +targetBtn.attr('data-url-index');
                    targetBtn.addClass('is-active');
                    targetBtn.siblings().removeClass('is-active');
                    landcoverApp.setAiServerURL(LANDCOVER_PROCESSING_SERVICE_URLS[targetBtnIdx]);
                    self.showMessage('Switched to use LC Handler Service ' + (targetBtnIdx + 1));
                }

                function selectOutputTypeBtnOnClickHandler(evt){
                    let targetBtn = $(this);
                    let outputType = targetBtn.attr('data-output-type');
                    $selectOutputTypeBtn.removeClass('is-active');
                    $('.js-select-output-type-btn[data-output-type="' + outputType + '"]').addClass('is-active'); // select by output type because we have two sets of js-select-output-type-btn

                    landcoverApp.setLandcoverImageOutputType(LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP[outputType]);
                    landcoverApp.loadTiffImage();
                }
            };

            this.getOpacitySliderValue = function(){
                let value = $opacitySlider.val();
                value = (10 - value) / 10;
                return +value;
            };

            this.resetLandcoverSliderValues = function(){
                $sliders.val(5);
            };

            this.toggleTileSelectionControlPanel = function(isVisible){
                let isCtrlPanelActive = $('.grid-cell').hasClass('active');
                let zoomLevel = landcoverApp.getMapZoomLevel();
                let isVisibleInCurrentZoomLevel = ( zoomLevel >= 15) ? true : false;
                // console.log(isVisibleInCurrentZoomLevel);

                if(zoomLevel >= 16){
                    $animationBtnsContainer.removeClass('hide');
                } else {
                    $animationBtnsContainer.addClass('hide');
                }

                if(isVisible && isCtrlPanelActive && isVisibleInCurrentZoomLevel){
                    $tileSelectionCtrlPanel.removeClass('hide');
                } else {
                    $tileSelectionCtrlPanel.addClass('hide');
                }
            };

            this.updateTileSelectionCtrlPanelPosition = function(topLeftScreenPoint, topRightScreenPoint){
                // console.log(topLeftScreenPoint, topRightScreenPoint);
                let screenPos = landcoverApp.getScreenPositionForSelectedArea();
                let $tileSelectionCtrlPanelHeight = $tileSelectionCtrlPanel.height();
                $tileSelectionCtrlPanel.css('top', (screenPos.topLeftScreenPoint.y - $tileSelectionCtrlPanelHeight) + 'px');
                $tileSelectionCtrlPanel.css('left', screenPos.topLeftScreenPoint.x - 1 + 'px');
                $tileSelectionCtrlPanel.css('width', (screenPos.topRightScreenPoint.x - screenPos.topLeftScreenPoint.x + 1)  + 'px' );
            }

            this.populateTrainingImage = function(imageData){
                $trainingImage.attr('src', imageData);
                this.toggleTrainingImageContainer(true);
                this.populateTileFromActiveGridCellToMap();
            };

            this.populateTileFromActiveGridCellToMap = function(){
                let isActiveGridCell = $('.grid-cell').hasClass('active');
                if(isActiveGridCell){
                    $('.grid-cell.active').trigger('click');
                } else {
                    $('.grid-cell:eq(0)').trigger('click'); // add the first tile from the training image to the map
                }
            }

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
                this.toggleLoadingIndicator(false);
                $requestFailedAlert.removeClass('hide');
                setTimeout(function(){
                    $requestFailedAlert.addClass('hide');
                }, ALERT_DISPALY_TIME);
            };

            this.showMessage = function(msgText){
                $gerenalInfoAlert.html('<span class="avenir-demi">' + msgText + '</span>');
                $gerenalInfoAlert.removeClass('hide');
                setTimeout(function(){
                    $gerenalInfoAlert.addClass('hide');
                }, ALERT_DISPALY_TIME);
            };

        }

    }
});

