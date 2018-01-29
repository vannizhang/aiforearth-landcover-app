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

    dojo.require("esri.arcgis.OAuthInfo");
    dojo.require("esri.IdentityManager");
    dojo.require("esri.arcgis.Portal");

    dojo.require("esri.dijit.Search");

    dojo.ready(dojoOnReadyHandler); 
    
    function dojoOnReadyHandler() {  

        // app config data
        const WEB_MAP_ID = "0a5a934c55594e209d1e6f5cde00bae2";
        const OAUTH_APP_ID = 'NQgZFGVs4UkjeP22';
        const MAP_CONTAINER_ID = 'mapDiv';
        const LANDCOVER_PROCESSING_SERVICE_URLS = [
            // "https://vm-land-arcdemo.eastus.cloudapp.azure.com/LCHandler.cshtml",
            // "https://vm-land-arcgis1.eastus.cloudapp.azure.com/LCHandler.cshtml"
            'https://landcovermap.com/LCHandler.cshtml',
            'https://arcgis.landcovermap.com/LCHandler.cshtml'
        ];
        const LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP = {
            "classified": "output_hard",
            "confidence": "output_soft"
        };
        const DEFAULT_LANDCOVER_IMAGE_OUTPUT_TYPE = LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP["classified"];
        const LANDCOVER_MAP_IMAGE_LAYER_ID = 'landcoverMapImageLayer';
        const AREA_SELECT_GRAPHIC_LAYER_ID = 'areaSelectGraphicLayer'; 
        const REVERSE_GEOCODE_URL = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode';
        const FIND_ADDRESS_CANDIDATES_URL = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
        
        // config data for training results table 
        const TRAINING_RESULTS_TABLE_URL = 'https://services6.arcgis.com/TAVvcHO9Uf3mGozE/arcgis/rest/services/aiforearth_landcover_app_training_results/FeatureServer/0';
        const FIELD_NAME_OBJECTID = 'FID';
        const FIELD_NAME_UNIQUEID = 'unique_id';
        const FIELD_NAME_CREATOR = 'creator';
        const FIELD_NAME_LOCATION_NAME = 'location_name';
        const FIELD_NAME_LAT = 'lat';
        const FIELD_NAME_LON = 'lon';
        const FIELD_NAME_WATER = 'water_value';
        const FIELD_NAME_FOREST = 'forest_value';
        const FIELD_NAME_FIELD = 'field_value';
        const FIELD_NAME_BUILT = 'built_value';
        const ATTACHMENT_NAME_LAND_COVER_IMG = 'landcover.png';
        const ATTACHMENT_NAME_NAIP_IMG = 'naip.png';

        // app core modules
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
            this.locationNameForSelectedArea = '';
            this.uniqueIDForSelectedArea = ''; // this value will be used to choose between addFeature vs editFeature when user click the "teach the machine" btn
            this.exportedNAIPImageHerf = '';
            this.portalUser = null;
            this.isNAIPLayerDisabledByUser = false;
            this.currentProcessUID = ''; // the UID that will be used to identify the most current request that has been sent to AI server
            
            let symbolForSquareAreaReferenceGraphic = null;
            let symbolForSquareAreaHighlightGraphic = null;
            let timer = null; // use this timer to delay the final action of updateShiftValuesByIndex function to prevent calling _getLandcoverImgForSelectedArea function multiple times in short time 
            
            this.startup = function(){
                this._signInToArcGISPortal(OAUTH_APP_ID);
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

            this._setPortalUser = function(portalUser){
                this.portalUser = portalUser;
            };

            this._setLocationNameForSelectedArea = function(locationName=''){
                this.locationNameForSelectedArea = locationName;
            };

            this._setUniqueIdForSelectedArea = function(uniqueID){
                this.uniqueIDForSelectedArea = uniqueID;
            };

            this._setExtentForSelectedArea = function(extent){
                this.extentForSelectedArea = extent;
                if(extent){
                    userInterfaceUtils.updateTileSelectionCtrlPanelPosition();
                }
            };

            this._setExportedNAIPImageHerf = function(href=''){
                this.exportedNAIPImageHerf = href ? href.replace('http://', 'https://') : '';
            };

            this.setIsNAIPLayerDisabledByUser = function(bool){
                this.isNAIPLayerDisabledByUser = bool;
            };

            this._setCurrentProcessUID = function(uid=''){
                this.currentProcessUID = uid;
            };

            this._getCenterPointOfSelectedAreaExtent = function(){
                let centerPt = (this.extentForSelectedArea) ? this.extentForSelectedArea.getCenter() : null;
                return centerPt;
            };

            this._getShiftValues = function(){
                let shifts = this.shiftValues.map(d=>{return d});
                return shifts;
            };

            this.toggleLockForSelectedArea = function(isLocked=false){
                this.lockForSelectedArea = isLocked;
            };

            this.setLandcoverImageOutputType = function(outputType){
                this.landcoverImageOutputType = outputType;
            };

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
                map.on('mouse-out', ()=>{
                    this._mapOnMouseoutHandler();
                });
            };

            // the main function to start selecting/processing an area
            this.selectAreaByPoint = function(point, uniqueID=null){
                // use the value from uniqueID parameter to determine if this function is triggered by map click event or seelction made from training results panel,
                // if it's triggered by map click event, we will have resetSeletcedArea() function to reset the silders to use shift values of [5,5,5,5], otherwise, use the shift values from sliders
                let keepCurrentSliderValues = uniqueID ? true : false;
                uniqueID = uniqueID || this._getUniqueID();
                 

                if(!point) {
                    console.error('a point geometry is required');
                    return;
                } else {
                    // reset selected area before start selecting new area
                    this.resetSeletcedArea(keepCurrentSliderValues);

                    let areaSelectHighlightGraphic = this._getSquareAreaGraphic(point);
                    let sqExtent = this._getSquareExtentByMapPoint(point);

                    this._setUniqueIdForSelectedArea(uniqueID);
                    this._setExtentForSelectedArea(sqExtent);
                    this._setAreaSelectLayer(areaSelectHighlightGraphic);
                    this._getLandcoverImgForSelectedArea(sqExtent);
                    this._reverseGeocode(point).then(result=>{
                        this._setLocationNameForSelectedArea(result);
                    });
    
                    // lock selected area to prevent selecting another area while processing and reviewing lan cover image for the current area
                    this.toggleLockForSelectedArea(true); 
                }
            };

            // call this function to set and reset the shiftValues
            this.updateShiftValuesByIndex = function(index=null, value=null, shouldRequerySelectedArea=false){
                if(!index && !value){
                    this.shiftValues = [5, 5, 5, 5];
                } else {
                    // this.shiftValues[index] = value * 1.0 / 10;
                    this.shiftValues[index] = value;
                }

                clearTimeout(timer);
                timer = window.setTimeout(() => {
                    if(this.extentForSelectedArea && shouldRequerySelectedArea){
                        this._getLandcoverImgForSelectedArea(this.extentForSelectedArea);
                        userInterfaceUtils.toggleTrainingImageContainer(false);
                    }
                    // console.log(this.shiftValues);
                }, 1500);
            };

            this.bulkUpdateShiftValues = function(values=[]){
                values = (values.length === 4) ? values : [5,5,5,5]; 
                this.shiftValues = values;
            };

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
                mapImageLayer.removeAllImages();
                mapImageLayer.addImage(mapImage);
            };

            this._getImageHrefFromLandcoverMapImageLayer = function(){
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                let images = mapImageLayer.getImages();
                let href = images.length ? images[0].href : null;
                return href;
            };

            this.setOpcityForLandcoverMapImageLayer = function(value){
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.setOpacity(value);
            };

            this._clearLandcoverMapImage = function(){
                let mapImageLayer = this.map.getLayer(LANDCOVER_MAP_IMAGE_LAYER_ID);
                mapImageLayer.removeAllImages();
            };

            this._mapOnClickHandler = function(evt){    
                // console.log(evt.mapPoint);
                // // original approach that won't allow select new area when tile selection window is open
                // if(!this.lockForSelectedArea){
                //     this.selectAreaByPoint(evt.mapPoint);
                // } 

                if(this.lockForSelectedArea){
                    userInterfaceUtils.closeTileSelectionWindow();
                }
                this.selectAreaByPoint(evt.mapPoint);
            };

            // show area select reference layer on mousemove
            this._mapOnMousemoveHandler = function(evt){

                if(!this.lockForSelectedArea){
                    let sqAreaReferenceGraphic = this._getSquareAreaGraphic(evt.mapPoint, evt.type);
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
                let zoomLevel = this.getMapZoomLevel();
                if(this.extentForSelectedArea){
                    userInterfaceUtils.updateTileSelectionCtrlPanelPosition();
                    userInterfaceUtils.toggleTileSelectionControlPanel(true);

                    if(zoomLevel <= 11){
                        userInterfaceUtils.toggleReturnToSelectedAreaBtn(true);
                    } else {
                        userInterfaceUtils.toggleReturnToSelectedAreaBtn(false);
                    }
                } 
            };

            this._mapOnUpdateEndHandler = function(){
                // show NAIP layer if it is not disabled by user
                if(!this.isNAIPLayerDisabledByUser){
                    this.toggleNAIPLayer(true);
                }
            };

            this._mapOnMouseoutHandler = function(evt){
                // console.log('mouseout');
            };

            this.resetSeletcedArea = function(keepCurrentSliderValues=false){
                // Do not call toggleLockForSelectedArea in this function
                this._clearLandcoverMapImage();
                this._setExtentForSelectedArea(null);
                this._setAreaSelectLayer(null);
                this._setAiServerResponse(null);
                this._setLocationNameForSelectedArea(null);
                this._setUniqueIdForSelectedArea(null);
                this._setExportedNAIPImageHerf(null);
                this._setCurrentProcessUID(null);

                userInterfaceUtils.toggleTileSelectionControlPanel(false);
                userInterfaceUtils.toggleTrainingImageContainer(false);
                userInterfaceUtils.resetTrainingImageGridCells();
                userInterfaceUtils.toggleReturnToSelectedAreaBtn(false);
                userInterfaceUtils.toggleLoadingIndicator(false);
                userInterfaceUtils.toggleUserInterfaceComponentsStatus(false);

                if(!keepCurrentSliderValues){
                    userInterfaceUtils.resetLandcoverSliderValues();
                }
            }

            this._getLandcoverImgForSelectedArea = function(sqExtent){

                userInterfaceUtils.toggleLoadingIndicator(true);

                // generate a new UID that will be used to identify each request send to AI server
                let processUID = this._getUniqueID();
                this._setCurrentProcessUID(processUID);

                this._exportNAIPImageForSelectedArea(sqExtent).then(response=>{
                    if(response.error){
                        // console.error("error when export NAIP image", response.error);
                        userInterfaceUtils.showRequestFailedAlert();
                        return;
                    } else {
                        // console.log("Successfully export the NAIP Image ", response);
                        let params = this._getParamsToRequestAIServer(response, processUID);
                        this._requestAIServer(params);
                        this._setExportedNAIPImageHerf(response.href);
                    }
                });
            };

            this._getParamsToRequestAIServer = function(exportedNAIPImageResponse, processUID){
                const MODE = "rgb"; // rgb or cls
                const SHIFTS = this._getShiftValues();
                exportedNAIPImageResponse.mode = MODE;
                exportedNAIPImageResponse.w = SHIFTS;
                exportedNAIPImageResponse.processUID = processUID;
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
                    // proceed to on success handler only if the area is still locked; and the processUID of this request equals the concurrent processUID 
                    if(this.lockForSelectedArea && response.processUID === this.currentProcessUID){
                        this._requestAIServerOnSuccessHandler(response);
                    } 
                })
                .fail(function() {
                    this._requestAIServerOnErrorHandler();
                });
            };

            this._requestAIServerOnSuccessHandler = function(response){
                // console.log(response);
                this._setAiServerResponse(response);
                this.populateOutputTiffImageFromAiServer(response.processUID);
            };

            this._requestAIServerOnErrorHandler = function(error){
                console.error( "error when retrieve landcover classification image from AI server" );
                this.resetSeletcedArea();
                this.toggleLockForSelectedArea(false);
                userInterfaceUtils.showRequestFailedAlert();
                userInterfaceUtils.toggleLoadingIndicator(false);
            };

            this._preloadUnselectedOutputTiffImg = function(){
                let unselectedOutputTpe = this.landcoverImageOutputType === 'output_hard' ? 'output_soft' : 'output_hard';
                let imageSrcPath = this.aiServerResponse[unselectedOutputTpe];
                let keyForCachedOutputTiffImg = unselectedOutputTpe + '_canvas';
                let cachedOutputTiffImg = this.aiServerResponse[keyForCachedOutputTiffImg];
                let canvasForTiffImgOnloadHandler = (canvasForTiffImg)=>{
                    this.aiServerResponse[keyForCachedOutputTiffImg] = canvasForTiffImg;
                }
                if(!cachedOutputTiffImg){
                    this._getCanvasForTiff(imageSrcPath, canvasForTiffImgOnloadHandler);
                }
            };

            this.populateOutputTiffImageFromAiServer = function(processUID){
                if(this.aiServerResponse && this.lockForSelectedArea && processUID === this.currentProcessUID){
                    // console.log('start processing response from AI server', this.aiServerResponse);
                    let outputType = this.landcoverImageOutputType;
                    let keyForCachedOutputTiffImg = outputType + '_canvas';
                    let cachedOutputTiffImg = this.aiServerResponse[keyForCachedOutputTiffImg];
                    let imageSrcPath = this.aiServerResponse[outputType];

                    let canvasForTiffImgOnloadHandler = (canvasForTiffImg)=>{
                        if(!cachedOutputTiffImg){
                            this.aiServerResponse[keyForCachedOutputTiffImg] = canvasForTiffImg;
                        }

                        if(this.lockForSelectedArea){
                            let imageData = canvasForTiffImg.toDataURL();
                            userInterfaceUtils.getCanvasForTiffImgSideLength(canvasForTiffImg);
                            userInterfaceUtils.populateTrainingImage(imageData);
                            userInterfaceUtils.toggleLoadingIndicator(false);
                            userInterfaceUtils.toggleUserInterfaceComponentsStatus(true);
                        }
                        // console.log('populating canvas for tiff image to training image container', canvasForTiffImg);
                    };

                    if(!cachedOutputTiffImg){
                        this._getCanvasForTiff(imageSrcPath, canvasForTiffImgOnloadHandler);
                        this._preloadUnselectedOutputTiffImg();
                    } else {
                        canvasForTiffImgOnloadHandler(cachedOutputTiffImg);
                    }
                } 
            };

            this._getCanvasForTiff = function(imageSrcPath, callback){
                console.log('converting tiff image to canvas');
                let xhr = new XMLHttpRequest();
                xhr.open('GET', imageSrcPath);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    var buffer = xhr.response;
                    var tiff = new Tiff({buffer: buffer});
                    var canvasForTiffImg = tiff.toCanvas();
                    if (canvasForTiffImg) {
                        callback(canvasForTiffImg);
                    }
                };
                xhr.send();
            };

            this._exportNAIPImageForSelectedArea = function(inputExtent){
                let deferred = $.Deferred();
                let requestURL = this.NAIPImageServerURL + "/exportImage";
                let requestParams = this._getParamsToExportImageFromNAIPLayer(inputExtent);

                this._makeRestApiRequest(requestURL, requestParams).then(response=>{
                    deferred.resolve(response);
                });
                return deferred.promise();
            };

            this._getParamsToExportImageFromNAIPLayer = function(selectedAreaExtent){
                const padding = 64;
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
            this._setAreaSelectLayer = function(graphicToAdd=null){
                let areaSelectGraphicLayer = this.map.getLayer(AREA_SELECT_GRAPHIC_LAYER_ID);
                areaSelectGraphicLayer.clear();
                if(graphicToAdd){
                    areaSelectGraphicLayer.add(graphicToAdd);
                }
            };

            // eventType values: 'click' or 'mousemove'
            this._getSquareAreaGraphic = function(mapPoint, eventType='click'){
                // console.log(evt);
                let sqExtent = this._getSquareExtentByMapPoint(mapPoint);
                let symbol = this._getSymbolForSquareAreaGraphicByEventType(eventType);
                let areaSelectGraphic = new esri.Graphic(sqExtent, symbol);
                return areaSelectGraphic;
            };

            this._getSymbolForSquareAreaGraphicByEventType = function(eventType){
                const FILL_COLOR_FOR_REF_GRAPHIC = [50,50,50,100];
                const OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC = [0, 0, 0, 200];

                symbolForSquareAreaReferenceGraphic = (!symbolForSquareAreaReferenceGraphic) ? this._getSimpleFillSymbol(FILL_COLOR_FOR_REF_GRAPHIC) : symbolForSquareAreaReferenceGraphic;
                symbolForSquareAreaHighlightGraphic = (!symbolForSquareAreaHighlightGraphic) ? this._getSimpleFillSymbol(null, OUTLINE_COLOR_FOR_HIGHLIGHT_GRAPHIC) : symbolForSquareAreaHighlightGraphic;
                let symbolByEventType = (eventType === 'click') ? symbolForSquareAreaHighlightGraphic : symbolForSquareAreaReferenceGraphic;
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
                let randomCity = this._getRandomCity();
                this.flyToLocationByXY(randomCity.coordinates[1], randomCity.coordinates[0], randomCity.label)
            };

            this.flyToLocationByXY = function(x, y, locationName){
                
                let point = new esri.geometry.Point({"x": x, "y": y, "spatialReference": {"wkid": 4326 } });
                this.toggleNAIPLayer(false);
                this.resetSeletcedArea();
                this.map.centerAt(point);
                this.toggleLockForSelectedArea(false); 

                if(locationName){
                    userInterfaceUtils.showMessage(locationName);
                }
            };

            this.toggleNAIPLayer = function(isVisible){
                if(isVisible){
                    this.NAIPLayer.show();
                } else {
                    this.NAIPLayer.hide();
                }
            };

            this._signInToArcGISPortal = function(OAuthAppID){
                let info = new esri.arcgis.OAuthInfo({
                    appId: OAuthAppID,
                    popup: false
                });
                esri.id.registerOAuthInfos([info]);
        
                new esri.arcgis.Portal(info.portalUrl)
                .signIn()
                .then(portalUser=>{
                    this._signInSuccessHandler(portalUser);
                })     
                .otherwise(
                    function (error){
                        console.log("Error occurred while signing in: ", error);
                    }
                );  
            };

            this._signInSuccessHandler = function(portalUser){
                console.log('signed in as ' + portalUser.username);
                this._setPortalUser(portalUser);
                this._getTrainingResults(portalUser.username);
            };

            this._getTrainingResults = function(){
                let userName = this.portalUser.username;
                let whereClause = `creator = '${userName}'`;
                this._queryTrainingResultsTable(whereClause).then(response=>{
                    if(!response.error){
                        // console.log(response.features);

                        if(response.features.length){

                            let objectIds = response.features.map(d=>{
                                return d.attributes[FIELD_NAME_OBJECTID]
                            }).join(',');
    
                            this._queryAttachments(objectIds).then(attachments=>{
                                // console.log(attachments);
                                let attachmentGroups = attachments.length ? attachments.attachmentGroups : [];
                                userInterfaceUtils.populateTrainingResults(response.features, attachments.attachmentGroups);
                            });
                        }

                    }
                });
            };

            this._getFeatureInfoForSelectedArea = function(){

                let switchValue = this._getShiftValues();
                let creatorUserID = this.portalUser.username;
                let uniqueID = this.uniqueIDForSelectedArea;
                let locationName = this.locationNameForSelectedArea;
                let centerPointOfSelecedArea = this._getCenterPointOfSelectedAreaExtent();
                let lngLatOfSelectedArea = this._getPointLngLat(centerPointOfSelecedArea);

                let featureInfo = { "attributes" : {} };
                featureInfo.attributes[FIELD_NAME_UNIQUEID] = uniqueID;
                featureInfo.attributes[FIELD_NAME_CREATOR] = creatorUserID;
                featureInfo.attributes[FIELD_NAME_LOCATION_NAME] = locationName;
                featureInfo.attributes[FIELD_NAME_LAT] = lngLatOfSelectedArea[1];
                featureInfo.attributes[FIELD_NAME_LON] = lngLatOfSelectedArea[0];
                featureInfo.attributes[FIELD_NAME_WATER] = switchValue[0];
                featureInfo.attributes[FIELD_NAME_FOREST] = switchValue[1];
                featureInfo.attributes[FIELD_NAME_FIELD] = switchValue[2];
                featureInfo.attributes[FIELD_NAME_BUILT] = switchValue[3];

                return featureInfo;
            };

            // return parameter object will be used to add/edit features
            this._getParamsToUpdateTrainingResultsFeatures = function(objectIdOfFeatureToEdit){
                let params = {
                    f: 'json',
                    features: []
                };
                let featureInfo = this._getFeatureInfoForSelectedArea();
                if(objectIdOfFeatureToEdit){
                    featureInfo.attributes[FIELD_NAME_OBJECTID] = objectIdOfFeatureToEdit;
                }
                params.features.push(JSON.stringify(featureInfo));
                return params;
            };

            this._manageTrainingResultsTableFeatures = function(isAddingNewFeature, objectIdOfFeatureToEdit=null){
                let self = this;
                let operationName = isAddingNewFeature ? 'addFeatures' : 'updateFeatures';
                let requestURL = TRAINING_RESULTS_TABLE_URL + '/' + operationName;
                let params = this._getParamsToUpdateTrainingResultsFeatures(objectIdOfFeatureToEdit);

                this._makeRestApiRequest(requestURL, params).then(response=>{
                    if(!response.error){
                        if(isAddingNewFeature){
                            onAddResultsSuccessHandler(response);
                        } else {
                            onUpdateResultsSuccessHandler(response);
                        }
                    }
                });

                function onAddResultsSuccessHandler(response){
                    let featureFID = ( response.addResults.length && response.addResults[0].success) ? response.addResults[0].objectId : null;
                    // need to wait till both images are uploaded before re-populate the training results panel
                    let countOfUploadedImgs = 0;
                    let uploadImgOnSuccessHandler = function(res){
                        if(!res.error){
                            countOfUploadedImgs++;
                            if(countOfUploadedImgs===2){
                                console.log('populating saved training results');
                                self._getTrainingResults();
                            }
                        }
                    };
                    self._uploadLandcoverImage(featureFID, uploadImgOnSuccessHandler);
                    self._uploadSelectedNAIPImage(featureFID, uploadImgOnSuccessHandler);
                    userInterfaceUtils.showMessage('information for selected area has been submitted.')
                    // console.log('successfully added new feature to training result table');
                }

                function onUpdateResultsSuccessHandler(response){
                    let featureFID = ( response.updateResults.length && response.updateResults[0].success) ? response.updateResults[0].objectId : null;
                    // console.log(`successfully updated feature (objectID: ${featureFID}) in training result table`);
                    // only needs to re-upload the land cover image because NAIP would be the unchanged for the same area
                    self._uploadLandcoverImage(featureFID);
                    userInterfaceUtils.showMessage('information for selected area has been updated.')
                }
            }

            this._queryTrainingResultsTable = function(whereClause){
                let deferred = $.Deferred();
                let requestURL = TRAINING_RESULTS_TABLE_URL + '/query ';
                let params = {
                    f: 'json',
                    outFields: '*',
                    where: whereClause
                };

                this._makeRestApiRequest(requestURL, params).then(response=>{
                    deferred.resolve(response);
                });

                return deferred.promise();
            };

            this._addFeatureToTrainingResultsTable = function(){
                this._manageTrainingResultsTableFeatures(true);
            };

            this._editTrainingResultsTable = function(objectIdOfFeatureToEdit){
                this._manageTrainingResultsTableFeatures(false, objectIdOfFeatureToEdit);
            };

            this.updateTrainingResultsTable = function(){
                if(this.uniqueIDForSelectedArea && this.lockForSelectedArea){
                    let whereClause = `unique_id = '${this.uniqueIDForSelectedArea}'`;
                    // get count of features by unique id, if count is 0, add a new feature, otherwise, edit the existing feature
                    this._queryTrainingResultsTable(whereClause).then(response=>{
                        if(!response.features.length) {
                            this._addFeatureToTrainingResultsTable();
                        } else {
                            // edit existing feature
                            let existingFeatureFID = response.features[0].attributes[FIELD_NAME_OBJECTID];
                            this._editTrainingResultsTable(existingFeatureFID);
                            // console.log('edit exiting feature', objectID);
                        }
                    });
                } else {
                    console.error('no land cover classification data to teach the machine');
                }
            };

            this.deleteFeatureFromTrainingResultsTable = function(uniqueID){
                let deferred = $.Deferred();
                let requestURL = TRAINING_RESULTS_TABLE_URL + '/deleteFeatures ';
                let whereClause = `${FIELD_NAME_UNIQUEID} = '${uniqueID}'`;
                let params = {
                    f: 'json',
                    where: whereClause
                };

                this._makeRestApiRequest(requestURL, params).then(response=>{
                    deferred.resolve(response);
                });

                return deferred.promise();
            };

            // call this function to add attachment or update attachment depends on if attachmentID is defined or not
            // use addAttachment operation if attachmentID parameter is null
            this._uploadAttachment = function(featureFID, formData, attachmentId=null){
                let deferred = $.Deferred();
                let operationName = attachmentId ? 'updateAttachment' : 'addAttachment';
                let requestURL = TRAINING_RESULTS_TABLE_URL + `/${featureFID}/${operationName}`;
                let params = {
                    f: 'json',
                };
                if(attachmentId){
                    params.attachmentId = attachmentId;
                }
                this._makeRestApiRequest(requestURL, params, formData).then(response=>{
                    deferred.resolve(response);
                });
                return deferred.promise();
            };

            this._queryAttachmentInfo = function(featureFID){
                let deferred = $.Deferred();
                let requestURL = TRAINING_RESULTS_TABLE_URL + `/${featureFID}/attachments`;
                let params = {
                    f: 'json',
                };
                this._makeRestApiRequest(requestURL, params).then(response=>{
                    deferred.resolve(response);
                });
                return deferred.promise();
            };

            this._queryAttachments = function(featureFIDs){
                let deferred = $.Deferred();
                let requestURL = TRAINING_RESULTS_TABLE_URL + `/queryAttachments`;
                let params = {
                    f: 'json',
                    objectIds: featureFIDs
                };
                this._makeRestApiRequest(requestURL, params).then(response=>{
                    deferred.resolve(response);
                });
                return deferred.promise();
            };

            this._uploadLandcoverImage = function(featureFID, callback){
                let imageData = this._getImageHrefFromLandcoverMapImageLayer();
                let formData = this._getAttachmentFormDataFromImageHref(imageData, ATTACHMENT_NAME_LAND_COVER_IMG);

                // the _getAttachmentIDByName function check if there is already a attchment with the same name, it would return the attachmentID or null value (if doesn't exist),
                // which would be used by the _uploadAttachment function to determine which operation it should use (addAttachment vs updateAttachment)
                this._getAttachmentIDByName(featureFID, ATTACHMENT_NAME_LAND_COVER_IMG).then(attachmentId=>{
                    this._uploadAttachment(featureFID, formData, attachmentId).then(res=>{
                        // console.log(res);
                        if(callback){
                            callback(res);
                        }
                    });
                });
            };

            this._uploadSelectedNAIPImage = function(featureFID, callback){
                let imageHref = this.exportedNAIPImageHerf;
                let canvasForTiffImgOnloadHandler = (canvasForTiffImg)=>{
                    let imageData = canvasForTiffImg.toDataURL();
                    let formData = this._getAttachmentFormDataFromImageHref(imageData, ATTACHMENT_NAME_NAIP_IMG);
                    this._uploadAttachment(featureFID, formData).then(res=>{
                        // console.log(res);
                        if(callback){
                            callback(res);
                        }
                    });
                };
                this._getCanvasForTiff(imageHref, canvasForTiffImgOnloadHandler);
            };

            this._getAttachmentIDByName = function(featureFID, attachmentName){
                let deferred = $.Deferred();
                this._queryAttachmentInfo(featureFID).then(results=>{
                    let attachmentInfos = results.attachmentInfos;
                    let attachmentId = null;
                    if(attachmentInfos.length){
                        attachmentId = attachmentInfos.filter(d=>{
                            return d.name === attachmentName;
                        })[0].id;
                    }
                    deferred.resolve(attachmentId);
                });
                return deferred.promise();
            };

            this._makeRestApiRequest = function(requestURL, params, formData=null){
                if(!requestURL){
                    console.error('requestURL is reqired');
                }
                params = params || { f: 'json' };

                let deferred = $.Deferred();
                let restApiRequest = esri.request({
                    url: requestURL,
                    content: params,
                    form: formData,
                    callbackParamName: "callback"
                }, {
                    usePost: true,
                });

                function requestSuccessHandler(response) {
                    // console.log(response);
                    deferred.resolve(response);
                }
        
                function requestErrorHandler(error) {
                    // console.error("Error: ", error);
                    deferred.resolve(error);
                }
    
                restApiRequest.then(requestSuccessHandler, requestErrorHandler);
                return deferred.promise();
            };

            this._getAttachmentFormDataFromImageHref = function(imageData, imageName){
                let b64Data = imageData.split(',')[1];
                let blob = this._b64toBlob(b64Data, 'image/png'); // create blob object 
                let formData = new FormData();  
                formData.append("attachment", blob, imageName);  
                return formData;
            }

            this._getPointLngLat = function(point){
                return esri.geometry.xyToLngLat(point.x, point.y);
            }

            this._getUniqueID = function(){
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            this._b64toBlob = function(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;
              
                var byteCharacters = atob(b64Data);
                var byteArrays = [];
              
                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                
                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                
                    var byteArray = new Uint8Array(byteNumbers);
                
                    byteArrays.push(byteArray);
                }
              
                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            };

            this._reverseGeocode = function(point, callback){
                let deferred = $.Deferred();
                let locationName = '';
                let pointGeomJson = point.toJson();
                let params = {
                    f: 'json',
                    location: JSON.stringify(pointGeomJson)
                };

                this._makeRestApiRequest(REVERSE_GEOCODE_URL, params).then(res=>{
                    if(!res.error){
                        locationName = res.address.City + ', ' + res.address.Region + ' ' + res.address.Postal;
                        deferred.resolve(locationName);
                    }
                });

                return deferred.promise();
            };

            this.getAddressCandidate = function(locationName=''){
                let deferred = $.Deferred();
                let params = {
                    f: 'json',
                    singleLine: locationName,
                    sourceCountry: 'USA'
                };

                this._makeRestApiRequest(FIND_ADDRESS_CANDIDATES_URL, params).then(res=>{
                    if(!res.error){
                        deferred.resolve(res);
                    }
                });

                return deferred.promise();
            };

            this.getPointByLongLat = function(lon, lat){
                let pt = new esri.geometry.Point({
                    latitude: lat,
                    longitude: lon
                });
                pt = esri.geometry.project(pt, this.map);
                return pt;
            };

            this.getMapZoomLevel = function(){
                return this.map.getZoom();
            };

            this.setMapCenter = function(point){
                this.toggleNAIPLayer(false);
                this.map.centerAt(point);
            };

            this.zoomToSelectedArea = function(){
                if(this.extentForSelectedArea){
                    this.map.setExtent(this.extentForSelectedArea, true);
                }
            };

        }

        function UserInterfaceUtils(){

            const NUM_OF_GRID_CELLS = 9;
            const ALERT_DISPALY_TIME = 5000; // in ms
            
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
            const $submitTrainingDataBtn = $('.js-submit-training-data');
            const $submitBtnBtn = $('.submit-training-data-btn'); // use this to manage the style of submit btn
            const $toggleTrainingResultsBtn = $('.js-toggle-training-results');
            const $trainingResultsBlockGroup = $('.training-locations-block-groups');
            const $sideNavBtn = $('.nav-btn-div');
            const $searchInput = $('#search-input');
            const $addressCandidatesList = $('.address-candidates-list');
            const $returnToSelectedAreaBtn = $('#return-to-selected-area-btn-wrap');
            const $toggleNAIPLayerBtn = $('.js-toggle-naip-layer');
            const $toggleMoreControlOptionsBtn = $('.js-toggle-more-control-options');
            const $moreCtrlOptions = $('#more-control-options-wrap');
            const $ctrlItemsWrap = $('.control-items-wrap');

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
                $submitTrainingDataBtn.on('click', submitTrainingDataBtnOnClickHandler);
                $toggleTrainingResultsBtn.on('click', toggleTrainingResults);
                $body.on('click', '.js-select-address-candidate', zoomToSelectedAddressCandidate);
                $body.on('click', '.js-zoom-to-selected-area', zoomToSelectedArea);
                $toggleNAIPLayerBtn.on('click', $toggleNAIPLayerBtnOnClickHandler);
                
                // $body.on('click', '.js-delete-training-location', deleteTrainingLocationOnClickHandler);
                // $body.on('click', '.js-open-training-location', openTrainingLocationOnClickHandler);

                $searchInput.on('keyup', searchInputOnKeyupHandler);
                $toggleMoreControlOptionsBtn.on('click', toggleMoreControlOptionsBtnOnClickHandler);
                $body.on('click', bodyOnClickHandler);
                
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
                    let shouldRequerySelectedArea = (evt.originalEvent !== undefined) ? true : false;

                    landcoverApp.updateShiftValuesByIndex(targetSliderIndex, targetSliderVal, shouldRequerySelectedArea);
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
                    let isTargetBtnDisabled = targetBtn.closest('.control-items-wrap').hasClass('disabled');
                    let outputType = targetBtn.attr('data-output-type');

                    if(!isTargetBtnDisabled){
                        $selectOutputTypeBtn.removeClass('is-active');
                        $('.js-select-output-type-btn[data-output-type="' + outputType + '"]').addClass('is-active'); // select by output type because we have two sets of js-select-output-type-btn
    
                        landcoverApp.setLandcoverImageOutputType(LANDCOVER_IMAGE_OUTPUT_TYPE_LOOKUP[outputType]);
    
                        if(landcoverApp.currentProcessUID){
                            self.toggleLoadingIndicator(true);
                            self.toggleTrainingImageContainer(false);
                            landcoverApp.populateOutputTiffImageFromAiServer(landcoverApp.currentProcessUID);
                        }
                    }
                }

                function submitTrainingDataBtnOnClickHandler(evt){
                    landcoverApp.updateTrainingResultsTable();
                }

                function toggleTrainingResults(evt){
                    $body.toggleClass('training-results-panel-visible');
                }

                function searchInputOnKeyupHandler(evt){
                    let currentText = $(this).val();
                    let textLength = currentText.length;

                    if(evt.keyCode == 13){
                        searchInputOnEnterHandler();
                    } else {
                        if(textLength > 3){
                            landcoverApp.getAddressCandidate(currentText).then(res=>{
                                if(res.candidates){
                                    self.populateAddressCandidates(res.candidates);
                                }
                            });
                        } else {
                            self.populateAddressCandidates([]);
                        }
                    }
                    evt.preventDefault();
                }

                function searchInputOnEnterHandler(){
                    let numOfCandidates = $addressCandidatesList.children().length;
                    if(numOfCandidates){
                        $addressCandidatesList.find('div').first().trigger('click');
                    }
                }

                function zoomToSelectedAddressCandidate(evt){
                    let targetCandidate = $(this);
                    let targetLocName = targetCandidate.text();
                    let targetLat = +targetCandidate.attr('data-lat');
                    let targetLon = +targetCandidate.attr('data-lon');
                    landcoverApp.flyToLocationByXY(targetLon, targetLat, targetLocName);
                    self.closeAddressCandidatesList();
                    self.setSearchLocationInputText(targetLocName);
                }

                function zoomToSelectedArea(evt){
                    landcoverApp.zoomToSelectedArea();
                }

                function $toggleNAIPLayerBtnOnClickHandler(evt){
                    let targetBtn = $(this);
                    targetBtn.toggleClass('is-naip-layer-visible');
                    let isVisible = targetBtn.hasClass('is-naip-layer-visible');
                    let isNAIPDisabledByUser = isVisible ? false : true;
                    landcoverApp.toggleNAIPLayer(isVisible);
                    landcoverApp.setIsNAIPLayerDisabledByUser(isNAIPDisabledByUser);
                }

                function toggleMoreControlOptionsBtnOnClickHandler(evt){
                    $moreCtrlOptions.toggleClass('hide');
                }

                function bodyOnClickHandler(evt){
                    let isMoreCtrlOptionsHide = $moreCtrlOptions.hasClass('hide');
                    if (!isMoreCtrlOptionsHide && !$toggleMoreControlOptionsBtn.is(evt.target) && $toggleMoreControlOptionsBtn.has(evt.target).length === 0 && !$moreCtrlOptions.is(evt.target) && $moreCtrlOptions.has(evt.target).length === 0) {
                        $moreCtrlOptions.addClass('hide');
                    } 
                }
            };

            this.populateAddressCandidates = function(candidates=[]){
                candidates = candidates.length > 5 ? candidates.slice(0, 5) : candidates;
                let candidatesHtmlStr = candidates.map(d=>{
                    let address = d.address;
                    let lat = d.location.y;
                    let lon = d.location.x;
                    return `<div class='js-select-address-candidate' data-lon='${lon}' data-lat='${lat}'>${address}</div>`;
                });
                // console.log(candidatesHtmlStr);
                $addressCandidatesList.html(candidatesHtmlStr);
            };

            this.closeAddressCandidatesList = function(){
                $addressCandidatesList.html('');
            };

            this.setSearchLocationInputText = function(value){
                $searchInput.val(value);
            }

            this.populateCountOfResults = function(num){
                $sideNavBtn.attr('data-num', num)
            };

            this.decrementCountOfResults = function(){
                let num = +$sideNavBtn.attr('data-num');
                num--;
                $sideNavBtn.attr('data-num', num);
            };

            this.populateTrainingResults = function(features=[], attachmentsGroups=[]){
                $trainingResultsBlockGroup.empty();
                if(features.length){
                    // console.log(features, attachmentsGroups);
                    this.populateCountOfResults(features.length);

                    let getAttachmentIdByName = function(attachmentInfos, name){
                        let attachmentInfo = attachmentInfos.filter(d=>{
                            return d.name === name;
                        });
                        let attachmentID = attachmentInfo.length ? attachmentInfo[0].id : null;
                        return attachmentID;
                    };

                    let addClickHanlderToTrainingResults = function(){
                        $body.off('click', '.js-open-training-location'); // Remove the click event for all "js-open-training-location" btns
                        $body.off('click', '.js-delete-training-location'); // Remove the click event for all "js-open-training-location" btns

                        $body.on('click', '.js-open-training-location', openTrainingLocationOnClickHandler);
                        $body.on('click', '.js-delete-training-location', deleteTrainingLocationOnClickHandler);
                    };

                    let openTrainingLocationOnClickHandler = (evt)=>{
                        let targetBtn = $(evt.currentTarget);
                        let trainingResultIndex = targetBtn.closest('.training-result-block').attr('data-index');
                        let targetFeature = features[+trainingResultIndex];

                        let uid = targetFeature.attributes[FIELD_NAME_UNIQUEID];
                        let lon = +targetFeature.attributes[FIELD_NAME_LON];
                        let lat = +targetFeature.attributes[FIELD_NAME_LAT];
                        let targetFeaturePoint = landcoverApp.getPointByLongLat(lon, lat);

                        let water = +targetFeature.attributes[FIELD_NAME_WATER];
                        let forest = +targetFeature.attributes[FIELD_NAME_FOREST];
                        let field = +targetFeature.attributes[FIELD_NAME_FIELD];
                        let built = +targetFeature.attributes[FIELD_NAME_BUILT];

                        this.setLandcoverSliderValues([water, forest, field, built]);

                        landcoverApp.selectAreaByPoint(targetFeaturePoint, uid);
                        landcoverApp.setMapCenter(targetFeaturePoint);
                        $body.toggleClass('training-results-panel-visible'); // hide training results table
                    };

                    let deleteTrainingLocationOnClickHandler = (evt)=>{
                        let targetBtn = $(evt.currentTarget);
                        let targetBlock = targetBtn.closest('.training-result-block');
                        let trainingResultIndex = targetBlock.attr('data-index');
                        let targetFeature = features[+trainingResultIndex];
                        let targetFeatureUID = targetFeature.attributes[FIELD_NAME_UNIQUEID];

                        landcoverApp.deleteFeatureFromTrainingResultsTable(targetFeatureUID).then(res=>{
                            if(!res.error){
                                targetBlock.remove();
                                this.decrementCountOfResults();
                                this.showMessage('imformation for selected area has been successfully removed');
                            }
                        });
                    }

                    let trainingResultsHtmlStr = features.map((feature, index)=>{

                        let objectId = +feature.attributes[FIELD_NAME_OBJECTID];
                        let locationName = feature.attributes[FIELD_NAME_LOCATION_NAME];
                        
                        let attachmentInfos = attachmentsGroups.filter(d=>{
                            return d.parentObjectId === objectId;
                        })[0].attachmentInfos;

                        let landcoverImgId = getAttachmentIdByName(attachmentInfos, ATTACHMENT_NAME_LAND_COVER_IMG);
                        let naipImgId = getAttachmentIdByName(attachmentInfos, ATTACHMENT_NAME_NAIP_IMG);

                        let htmlStr = `
                            <div class="block training-result-block trailer-half" data-index='${index}'>
                                <div class="training-location-images-wrap">
                                    <div style='background: url(${TRAINING_RESULTS_TABLE_URL}/${objectId}/attachments/${landcoverImgId}) center center no-repeat; background-size: cover;'></div>
                                    <div style='background: url(${TRAINING_RESULTS_TABLE_URL}/${objectId}/attachments/${naipImgId}) center center no-repeat; background-size: cover;'></div>
                                </div>
                                <div class="font-size--3">
                                    <span class='js-open-training-location mouse-pointer'>${locationName}</span>
                                    <span class='js-delete-training-location right icon-ui-trash mouse-pointer'></span>
                                </div>
                            </div>
                        `;
                        return htmlStr;
                    }); 

                    $trainingResultsBlockGroup.html(trainingResultsHtmlStr.join(''));
                    addClickHanlderToTrainingResults();
                }
            };

            this.getOpacitySliderValue = function(){
                let value = $opacitySlider.val();
                value = (10 - value) / 10;
                return +value;
            };

            this.resetLandcoverSliderValues = function(){
                $sliders.val(5);
                landcoverApp.bulkUpdateShiftValues();
            };

            this.setLandcoverSliderValues = function(values=[]){
                if(values.length === 4){
                    values.forEach( (value, index)=>{
                        let targetSlider = $sliders.eq(index);
                        targetSlider.val(value);
                    });
                }
                landcoverApp.bulkUpdateShiftValues(values);
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
                    // add the default tile from the training image to the map
                    // the server returns a 3×3 grid with the default in the centre, which has the index of 4
                    $('.grid-cell:eq(4)').trigger('click'); 
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

            this.toggleReturnToSelectedAreaBtn = function(isVisible){
                if(isVisible){
                    $returnToSelectedAreaBtn.removeClass('hide');
                } else {
                    $returnToSelectedAreaBtn.addClass('hide');
                }
            };

            this.closeTileSelectionWindow = function(){
                $tileSelectionCloseBtn.trigger('click');
            };

            this.toggleSumbitTrainingResultBtn = function(isActive){
                if(isActive){
                    $submitBtnBtn.removeClass('btn-disabled');
                } else {
                    $submitBtnBtn.addClass('btn-disabled');
                }
            };

            this.toggleAdjustmentSliderStatus = function(isActive){
                if(isActive){
                    $sliders.attr('disabled', false);
                } else {
                    $sliders.attr('disabled', true);
                }
            };

            this.toggleControlsWrapStatus = function(isActive){
                if(isActive){
                    $ctrlItemsWrap.removeClass('disabled');
                } else {
                    $ctrlItemsWrap.addClass('disabled');
                }
            };

            this.toggleUserInterfaceComponentsStatus = function(isActive){
                this.toggleSumbitTrainingResultBtn(isActive);
                this.toggleAdjustmentSliderStatus(isActive);
                this.toggleControlsWrapStatus(isActive);
            };

        }

    }
});

