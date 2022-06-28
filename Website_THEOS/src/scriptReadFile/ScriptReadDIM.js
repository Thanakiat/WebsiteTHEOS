import React, { Component,useRef,useState } from 'react';
import { connect } from 'react-redux';
import XMLParser from "react-xml-parser";
import { Icon } from '@iconify/react';
import {Button,Modal,Form} from 'react-bootstrap';

import  Axios  from 'axios';

function ScirptReadDIM(props) {
    const fileCUFRef = useRef();

    const ReadfileZip= (e)=>{
      e.preventDefault();
      const formData = new FormData();
      console.log(e.target.files);
      const data = {
        file : [],
        name : []
      }
      for(var i = 0;i < e.target.files.length;i++){
          data.file.push(e.target.files[i])
          formData.append("file", data.file[i]);
          if(i === e.target.files.length - 1){
              Axios.post(
              "http://127.0.0.1:5000/api/uploaddim",
              formData
              ).then((result)=>{
              console.log(result);
              window.location.reload()
          })
          }
      }
      
    }

    const Readfile=(e)=>{
        e.preventDefault();
        const reader = new FileReader();
        var dimfile;
        var all_file = e.target.files;
        var image;
        for(var i=0;i<all_file.length;i++){
            if(all_file[i].name.split(".")[1]==='DIM'){
                dimfile = all_file[i]
            }if(all_file[i].name ==='PREVIEW.JPG'){
              image = all_file[i]
              console.log(image)
            }
        }
        if(dimfile === undefined){
            
            props.handleCloseModalImport()
            props.handleClose_Show_warning_DIM()
        }else if(dimfile.name.split(".")[1] === 'DIM' && image !== undefined){
            const dim_data = {};
            reader.readAsText(dimfile);
            reader.onload = (e) => {
              const text = e.target.result;
              const xml = new XMLParser().parseFromString(text);
              
              dim_data.DATASET_NAME = xml.getElementsByTagName("DATASET_NAME")[0].value;

              

              
              dim_data.PROLINE_NAME = ((dim_data.DATASET_NAME.replaceAll(" ","_")).replaceAll(":","-")).replaceAll("/","-");

              var Vertex_LON_NW = xml.getElementsByTagName("FRAME_LON")[0].value;
              var Vertex_LAT_NW = xml.getElementsByTagName("FRAME_LAT")[0].value;
              var Vertex_LON_NE = xml.getElementsByTagName("FRAME_LON")[1].value;
              var Vertex_LAT_NE = xml.getElementsByTagName("FRAME_LAT")[1].value;
              var Vertex_LON_SW = xml.getElementsByTagName("FRAME_LON")[2].value;
              var Vertex_LAT_SW = xml.getElementsByTagName("FRAME_LAT")[2].value;
              var Vertex_LON_SE = xml.getElementsByTagName("FRAME_LON")[3].value;
              var Vertex_LAT_SE = xml.getElementsByTagName("FRAME_LAT")[3].value;

              
              dim_data.SOURCE_TYPE = xml.getElementsByTagName("SOURCE_TYPE")[0].value;
              dim_data.SOURCE_ID = xml.getElementsByTagName("SOURCE_ID")[0].value;
              dim_data.SOURCE_DESCRIPTION = xml.getElementsByTagName("SOURCE_DESCRIPTION")[0].value;
              dim_data.GRID_REFERENCE = xml.getElementsByTagName("GRID_REFERENCE")[0].value;
      
      
              var PATH = dim_data.GRID_REFERENCE.split("-")[0]
              var ROW = dim_data.GRID_REFERENCE.split("-")[1]
              

              ////////////////////////////////////////////////////////////////////////////////
              dim_data.IMAGING_DATE = xml.getElementsByTagName("IMAGING_DATE")[0].value;
              dim_data.SHIFT_VALUE = xml.getElementsByTagName("SHIFT_VALUE")[0].value;
              dim_data.IMAGING_TIME = xml.getElementsByTagName("IMAGING_TIME")[0].value;
      
              var YEAR = dim_data.IMAGING_DATE.split("-")[0]
              var MONTH = dim_data.IMAGING_DATE.split("-")[1]
              var DATE = dim_data.IMAGING_DATE.split("-")[2] // "%02d"%DATE

              var HOUR = dim_data.IMAGING_TIME.split(":")[0]
              var MINUTE = dim_data.IMAGING_TIME.split(":")[1]
              var SECOND = dim_data.IMAGING_TIME.split(":")[2]

      
      


              var SUN_AZIMUTH = xml.getElementsByTagName("SUN_AZIMUTH")[0].value;
              var SUN_ELEVATION = xml.getElementsByTagName("SUN_ELEVATION")[0].value;


      


              ////////////////////////////////////////////////////////////////////////////////
              dim_data.MISSION = xml.getElementsByTagName("MISSION")[0].value;
              dim_data.MISSION_INDEX = xml.getElementsByTagName("MISSION_INDEX")[0].value;
              dim_data.INSTRUMENT = xml.getElementsByTagName("INSTRUMENT")[0].value;
              dim_data.INSTRUMENT_INDEX = xml.getElementsByTagName("INSTRUMENT_INDEX")[0].value;
              dim_data.IMAGING_MODE = xml.getElementsByTagName("IMAGING_MODE")[0].value;
              dim_data.SCENE_PROCESSING_LEVEL = xml.getElementsByTagName("SCENE_PROCESSING_LEVEL")[0].value;
              dim_data.VIEWING_ANGLE_ALONG_TRACK = xml.getElementsByTagName("VIEWING_ANGLE_ALONG_TRACK")[0].value;
              dim_data.VIEWING_ANGLE_ACROSS_TRACK = xml.getElementsByTagName("VIEWING_ANGLE_ACROSS_TRACK")[0].value;
              dim_data.SATELLITE_INCIDENCE_ANGLE = xml.getElementsByTagName("SATELLITE_INCIDENCE_ANGLE")[0].value;
              dim_data.SATELLITE_AZIMUTH_ANGLE = xml.getElementsByTagName("SATELLITE_AZIMUTH_ANGLE")[0].value;

              dim_data.REVOLUTION_NUMBER = xml.getElementsByTagName("REVOLUTION_NUMBER")[0].value;
              dim_data.THEORETICAL_RESOLUTION = xml.getElementsByTagName("THEORETICAL_RESOLUTION")[0].value;

              

      
              ////////////////////////////////////////////////////////////////////////////////
              dim_data.GEO_TABLES = xml.getElementsByTagName("GEO_TABLES")[0].value;
              dim_data.HORIZONTAL_CS_TYPE = xml.getElementsByTagName("HORIZONTAL_CS_TYPE")[0].value;
              dim_data.HORIZONTAL_CS_CODE = xml.getElementsByTagName("HORIZONTAL_CS_CODE")[0].value;
              dim_data.HORIZONTAL_CS_NAME = xml.getElementsByTagName("HORIZONTAL_CS_NAME")[0].value;
    

              ////////////////////////////////////////////////////////////////////////////////
              dim_data.RASTER_CS_TYPE = xml.getElementsByTagName("RASTER_CS_TYPE")[0].value;
              dim_data.PIXEL_ORIGIN = xml.getElementsByTagName("PIXEL_ORIGIN")[0].value;
              dim_data.PROCESSING_LEVEL = xml.getElementsByTagName("PROCESSING_LEVEL")[0].value;
      
              
      
              
              //# Production
              dim_data.JOB_ID = xml.getElementsByTagName("JOB_ID")[0].value;
              dim_data.PRODUCT_INFO =  xml.getElementsByTagName("PRODUCT_INFO")[0].value;
              dim_data.PRODUCT_TYPE = xml.getElementsByTagName("PRODUCT_TYPE")[0].value;
              dim_data.DATASET_PRODUCER_NAME = xml.getElementsByTagName("DATASET_PRODUCER_NAME")[0].value;
              dim_data.DATASET_PRODUCER_URL = xml.getElementsByTagName("DATASET_PRODUCER_URL")[0].attributes.href;
              dim_data.DATASET_PRODUCTION_DATE = xml.getElementsByTagName("DATASET_PRODUCTION_DATE")[0].value;
              dim_data.SOFTWARE_NAME = xml.getElementsByTagName("SOFTWARE_NAME")[0].value;
              dim_data.SOFTWARE_VERSION = xml.getElementsByTagName("SOFTWARE_VERSION")[0].value;
              dim_data.PROCESSING_CENTER = xml.getElementsByTagName("PROCESSING_CENTER")[0].value;
              

      
              //# Raster_Dimensions
              dim_data.NCOLS = xml.getElementsByTagName("NCOLS")[0].value;
              dim_data.NROWS = xml.getElementsByTagName("NROWS")[0].value;
              dim_data.NBANDS = xml.getElementsByTagName("NBANDS")[0].value;
      
              //# Raster_Encoding
              dim_data.NBITS = xml.getElementsByTagName("NBITS")[0].value;
              dim_data.DATA_TYPE = xml.getElementsByTagName("DATA_TYPE")[0].value;
              dim_data.BYTEORDER = xml.getElementsByTagName("BYTEORDER")[0].value;
              dim_data.BANDS_LAYOUT = xml.getElementsByTagName("BANDS_LAYOUT")[0].value;
      
              //# Data_Processing
              dim_data.GEOMETRIC_PROCESSING = xml.getElementsByTagName("GEOMETRIC_PROCESSING")[0].value;
              dim_data.RADIOMETRIC_PROCESSING = xml.getElementsByTagName("RADIOMETRIC_PROCESSING")[0].value;

      
              //# Data_Access
              dim_data.DATA_FILE_ORGANISATION = xml.getElementsByTagName("DATA_FILE_ORGANISATION")[0].value;
              dim_data.DATA_FILE_FORMAT = xml.getElementsByTagName("DATA_FILE_FORMAT")[0].value;
              dim_data.DATA_FILE_PATH = xml.getElementsByTagName("DATA_FILE_PATH")[0].attributes.href;
      
              //# Data_Strip
              dim_data.DATA_STRIP_ID = xml.getElementsByTagName("DATA_STRIP_ID")[0].value;
              dim_data.LCNT = xml.getElementsByTagName("LCNT")[0].value;
              dim_data.IGPST = xml.getElementsByTagName("IGPST")[0].value;
              dim_data.FILE_NAME = xml.getElementsByTagName("FILE_NAME")[0].value;
              dim_data.COMPRESSION_RATIO = xml.getElementsByTagName("COMPRESSION_RATIO")[0].value;
              
      
              //# Time_Stamp
              dim_data.REFERENCE_BAND = xml.getElementsByTagName("REFERENCE_BAND")[0].value;
              dim_data.REFERENCE_TIME = xml.getElementsByTagName("REFERENCE_TIME")[0].value;
              dim_data.REFERENCE_LINE = xml.getElementsByTagName("REFERENCE_LINE")[0].value;
              dim_data.LINE_PERIOD = xml.getElementsByTagName("LINE_PERIOD")[0].value;
              dim_data.SATELLITE_ALTITUDE = xml.getElementsByTagName("SATELLITE_ALTITUDE")[0].value;

      
              //# Instrument_Biases
              dim_data.YAW = xml.getElementsByTagName("YAW")[0].value;
              dim_data.PITCH = xml.getElementsByTagName("PITCH")[0].value;
              dim_data.ROLL = xml.getElementsByTagName("ROLL")[0].value;

      
              //# Sensor_Calibration
              dim_data.CALIBRATION_TYPE = xml.getElementsByTagName("CALIBRATION_TYPE")[0].value;
              dim_data.CALIBRATION_VALIDITY = xml.getElementsByTagName("CALIBRATION_VALIDITY")[0].value;
              dim_data.CALIBRATION_FILENAME = xml.getElementsByTagName("CALIBRATION_FILENAME")[0].value;

              
              
              const PREFIX = "th1"
              var MODE =("%s",dim_data.IMAGING_MODE) 

              var PROJ;
              var SCENE;
              var SCENE_DISPLAY;
      
              if (MODE === 'MS'){
                MODE = "MSS"
              } 
              if (dim_data.HORIZONTAL_CS_CODE === 'epsg:4326' && dim_data.HORIZONTAL_CS_NAME.split("/").length === 1){
                PROJ = "gcs"
              }else{
                PROJ = dim_data.HORIZONTAL_CS_NAME.split("/")[1].replaceAll("UTM","").toLowerCase()
              }
      
              if (dim_data.DATASET_NAME.split(" ")[2] === "P+M"){
                SCENE = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+SECOND.toString().split(".")[0]+"_psp_"+PROJ
                SCENE_DISPLAY = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+SECOND.toString().split(".")[0]+"_psp"
              }else{
                SCENE = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+SECOND.toString().split(".")[0]+"_"+MODE.toLowerCase()+"_"+PROJ
                SCENE_DISPLAY = PREFIX+"_"+YEAR+MONTH+DATE+"_"+HOUR+MINUTE+SECOND.toString().split(".")[0]+"_"+MODE.toLowerCase()
              }
              //console.log('SCENE = '+SCENE)
              //console.log('SCENE_DISPLAY = '+SCENE_DISPLAY)

              // HOUR = ("%02d",parseInt(HOUR)) 
              // MINUTE = ("%02d",parseInt(MINUTE)) 
              PATH = ("%02d",parseInt(PATH)) 
              ROW = ("%02d",parseInt(ROW)) 
              var time = HOUR+':'+MINUTE+':'+  SECOND.slice(0,2);
              
              SUN_AZIMUTH = parseFloat(SUN_AZIMUTH).toFixed(2);
              SUN_ELEVATION = parseFloat(SUN_ELEVATION).toFixed(2);

              Vertex_LON_NW = parseFloat(Vertex_LON_NW).toFixed(3);
              Vertex_LAT_NW = parseFloat(Vertex_LAT_NW).toFixed(3)
              Vertex_LON_NE = parseFloat(Vertex_LON_NE).toFixed(3)
              Vertex_LAT_NE = parseFloat(Vertex_LAT_NE).toFixed(3)
              Vertex_LON_SW = parseFloat(Vertex_LON_SW).toFixed(3)
              Vertex_LAT_SW = parseFloat(Vertex_LAT_SW).toFixed(3)
              Vertex_LON_SE = parseFloat(Vertex_LON_SE).toFixed(3)
              Vertex_LAT_SE = parseFloat(Vertex_LAT_SE).toFixed(3)




              ////////////////////////////////////////////////////////////////////////////////
              dim_data.SCENE = SCENE
              dim_data.SCENE_DISPLAY = SCENE_DISPLAY

              ////////////////////////////////////////////////////////////////////////////////
              dim_data.Vertex_LON_NW = Vertex_LON_NW
              dim_data.Vertex_LAT_NW = Vertex_LAT_NW
              dim_data.Vertex_LON_NE = Vertex_LON_NE
              dim_data.Vertex_LAT_NE = Vertex_LAT_NE
              dim_data.Vertex_LON_SW = Vertex_LON_SW
              dim_data.Vertex_LAT_SW = Vertex_LAT_SW
              dim_data.Vertex_LON_SE = Vertex_LON_SE
              dim_data.Vertex_LAT_SE = Vertex_LAT_SE
              dim_data.SUN_AZIMUTH = SUN_AZIMUTH
              dim_data.SUN_ELEVATION = SUN_ELEVATION
              dim_data.IMAGING_TIME = time


              console.log("IMAGING_DATE " + dim_data.IMAGING_DATE )
              console.log("IMAGING_TIME " + dim_data.IMAGING_TIME )
              console.log("MISSION " + dim_data.MISSION )
              console.log("INSTRUMENT " + dim_data.INSTRUMENT )
              console.log("INSTRUMENT_INDEX " + dim_data.INSTRUMENT_INDEX )
              console.log("PATH " + PATH )
              console.log("ROW " + ROW )
              console.log("REVOLUTION_NUMBER " + dim_data.REVOLUTION_NUMBER )

              
              
              var ALGORITHM_TYPE_1 ; var ALGORITHM_NAME_1 ; var ALGORITHM_ACTIVATION_1 ;
      
              var ALGORITHM_TYPE_2 ; var ALGORITHM_NAME_2 ; var ALGORITHM_ACTIVATION_2 ;
      
              var ALGORITHM_TYPE_3 ; var ALGORITHM_NAME_3 ; var ALGORITHM_ACTIVATION_3 ;
      
              var BAND_INDEX_1 ; var BAND_OFFSET_1 ; var SFSC_BEGIN_1 ; 
              var SFSC_END_1   ; var DSR_BEGIN_1   ; var DSR_END_1   ;
      
              var BAND_INDEX_2 ; var BAND_OFFSET_2 ; var SFSC_BEGIN_2 ; 
              var SFSC_END_2   ; var DSR_BEGIN_2   ; var DSR_END_2   ;
      
              var BAND_INDEX_3 ; var BAND_OFFSET_3 ; var SFSC_BEGIN_3 ; 
              var SFSC_END_3   ; var DSR_BEGIN_3   ; var DSR_END_3   ;
      
              var BAND_INDEX_4 ; var BAND_OFFSET_4 ; var SFSC_BEGIN_4 ; 
              var SFSC_END_4   ; var DSR_BEGIN_4   ; var DSR_END_4   ;
      
      
              if(dim_data.PROCESSING_LEVEL === "1A"){
                dim_data.TIE_POINT_CRS_X1 = xml.getElementsByTagName("TIE_POINT_CRS_X")[0].value;
                dim_data.TIE_POINT_CRS_Y1 = xml.getElementsByTagName("TIE_POINT_CRS_Y")[0].value;
                dim_data.TIE_POINT_DATA_X1 = xml.getElementsByTagName("TIE_POINT_DATA_X")[0].value;
                dim_data.TIE_POINT_DATA_Y1 = xml.getElementsByTagName("TIE_POINT_DATA_Y")[0].value;
                dim_data.TIE_POINT_CRS_X2 = xml.getElementsByTagName("TIE_POINT_CRS_X")[1].value;
                dim_data.TIE_POINT_CRS_Y2 = xml.getElementsByTagName("TIE_POINT_CRS_Y")[1].value;
                dim_data.TIE_POINT_DATA_X2 = xml.getElementsByTagName("TIE_POINT_DATA_X")[1].value;
                dim_data.TIE_POINT_DATA_Y2 = xml.getElementsByTagName("TIE_POINT_DATA_Y")[1].value;
                dim_data.TIE_POINT_CRS_X3 = xml.getElementsByTagName("TIE_POINT_CRS_X")[2].value;
                dim_data.TIE_POINT_CRS_Y3 = xml.getElementsByTagName("TIE_POINT_CRS_Y")[2].value;
                dim_data.TIE_POINT_DATA_X3 = xml.getElementsByTagName("TIE_POINT_DATA_X")[2].value;
                dim_data.TIE_POINT_DATA_Y3 = xml.getElementsByTagName("TIE_POINT_DATA_Y")[2].value;
                dim_data.TIE_POINT_CRS_X4 = xml.getElementsByTagName("TIE_POINT_CRS_X")[3].value;
                dim_data.TIE_POINT_CRS_Y4 = xml.getElementsByTagName("TIE_POINT_CRS_Y")[3].value;
                dim_data.TIE_POINT_DATA_X4 = xml.getElementsByTagName("TIE_POINT_DATA_X")[3].value;
                dim_data.TIE_POINT_DATA_Y4 = xml.getElementsByTagName("TIE_POINT_DATA_Y")[3].value;



                if(dim_data.IMAGING_MODE === 'MS'){
      
                  ALGORITHM_TYPE_1 = xml.getElementsByTagName("ALGORITHM_TYPE")[0].value;
                  ALGORITHM_NAME_1 = xml.getElementsByTagName("ALGORITHM_NAME")[0].value;
                  ALGORITHM_ACTIVATION_1 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[0].value;
      
                  ALGORITHM_TYPE_2 = xml.getElementsByTagName("ALGORITHM_TYPE")[1].value;
                  ALGORITHM_NAME_2 = xml.getElementsByTagName("ALGORITHM_NAME")[1].value;
                  ALGORITHM_ACTIVATION_2 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[1].value;
      
                  ALGORITHM_TYPE_3 = xml.getElementsByTagName("ALGORITHM_TYPE")[1].value;
                  ALGORITHM_NAME_3 = xml.getElementsByTagName("ALGORITHM_NAME")[1].value;
                  ALGORITHM_ACTIVATION_3 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[1].value;
      
                  BAND_INDEX_1 = xml.getElementsByTagName("BAND_INDEX")[0].value;
                  BAND_OFFSET_1 = xml.getElementsByTagName("BAND_OFFSET")[0].value;
                  SFSC_BEGIN_1 = xml.getElementsByTagName("SFSC_BEGIN")[0].value;
                  SFSC_END_1 = xml.getElementsByTagName("SFSC_END")[0].value;
                  DSR_BEGIN_1 = xml.getElementsByTagName("DSR_BEGIN")[0].value;
                  DSR_END_1 = xml.getElementsByTagName("DSR_END")[0].value;
      
                  BAND_INDEX_2 = xml.getElementsByTagName("BAND_INDEX")[1].value;
                  BAND_OFFSET_2 = xml.getElementsByTagName("BAND_OFFSET")[1].value;
                  SFSC_BEGIN_2 = xml.getElementsByTagName("SFSC_BEGIN")[1].value;
                  SFSC_END_2 = xml.getElementsByTagName("SFSC_END")[1].value;
                  DSR_BEGIN_2 = xml.getElementsByTagName("DSR_BEGIN")[1].value;
                  DSR_END_2 = xml.getElementsByTagName("DSR_END")[1].value;
      
                  BAND_INDEX_3 = xml.getElementsByTagName("BAND_INDEX")[2].value;
                  BAND_OFFSET_3 = xml.getElementsByTagName("BAND_OFFSET")[2].value;
                  SFSC_BEGIN_3 = xml.getElementsByTagName("SFSC_BEGIN")[2].value;
                  SFSC_END_3 = xml.getElementsByTagName("SFSC_END")[2].value;
                  DSR_BEGIN_3 = xml.getElementsByTagName("DSR_BEGIN")[2].value;
                  DSR_END_3 = xml.getElementsByTagName("DSR_END")[2].value;
      
                  BAND_INDEX_4 = xml.getElementsByTagName("BAND_INDEX")[3].value;
                  BAND_OFFSET_4 = xml.getElementsByTagName("BAND_OFFSET")[3].value;
                  SFSC_BEGIN_4 = xml.getElementsByTagName("SFSC_BEGIN")[3].value;
                  SFSC_END_4 = xml.getElementsByTagName("SFSC_END")[3].value;
                  DSR_BEGIN_4 = xml.getElementsByTagName("DSR_BEGIN")[3].value;
                  DSR_END_4 = xml.getElementsByTagName("DSR_END")[3].value;
      
                  dim_data.LINE_NUMBER_1 = xml.getElementsByTagName("LINE_NUMBER")[0].value;
                  dim_data.GAIN_NUMBER_1 = xml.getElementsByTagName("GAIN_NUMBER")[0].value;
                  dim_data.PHYSICAL_BIAS_1 = xml.getElementsByTagName("PHYSICAL_BIAS")[0].value;
                  dim_data.PHYSICAL_GAIN_1 = xml.getElementsByTagName("PHYSICAL_GAIN")[0].value;
                  dim_data.PHYSICAL_UNIT_1 = xml.getElementsByTagName("PHYSICAL_UNIT")[0].value;
      
                  dim_data.LINE_NUMBER_2 = xml.getElementsByTagName("LINE_NUMBER")[1].value;
                  dim_data.GAIN_NUMBER_2 = xml.getElementsByTagName("GAIN_NUMBER")[1].value;
                  dim_data.PHYSICAL_BIAS_2 = xml.getElementsByTagName("PHYSICAL_BIAS")[1].value;
                  dim_data.PHYSICAL_GAIN_2 = xml.getElementsByTagName("PHYSICAL_GAIN")[1].value;
                  dim_data. PHYSICAL_UNIT_2 = xml.getElementsByTagName("PHYSICAL_UNIT")[1].value;
      
                  dim_data.LINE_NUMBER_3 = xml.getElementsByTagName("LINE_NUMBER")[2].value;
                  dim_data.GAIN_NUMBER_3 = xml.getElementsByTagName("GAIN_NUMBER")[2].value;
                  dim_data.PHYSICAL_BIAS_3 = xml.getElementsByTagName("PHYSICAL_BIAS")[2].value;
                  dim_data.PHYSICAL_GAIN_3 = xml.getElementsByTagName("PHYSICAL_GAIN")[2].value;
                  dim_data.PHYSICAL_UNIT_3 = xml.getElementsByTagName("PHYSICAL_UNIT")[2].value;
      
                  dim_data.LINE_NUMBER_4 = xml.getElementsByTagName("LINE_NUMBER")[3].value;
                  dim_data.GAIN_NUMBER_4 = xml.getElementsByTagName("GAIN_NUMBER")[3].value;
                  dim_data.PHYSICAL_BIAS_4 = xml.getElementsByTagName("PHYSICAL_BIAS")[3].value;
                  dim_data.PHYSICAL_GAIN_4 = xml.getElementsByTagName("PHYSICAL_GAIN")[3].value;
                  dim_data.PHYSICAL_UNIT_4 = xml.getElementsByTagName("PHYSICAL_UNIT")[3].value;
      
      
                  dim_data.ALGORITHM_TYPE = ALGORITHM_TYPE_1+"|"+ALGORITHM_TYPE_2+"|"+ALGORITHM_TYPE_3
                  dim_data.ALGORITHM_NAME = ALGORITHM_NAME_1+"|"+ALGORITHM_NAME_2+"|"+ALGORITHM_NAME_3
                  dim_data.ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1+"|"+ALGORITHM_ACTIVATION_2+"|"+ALGORITHM_ACTIVATION_3
                  dim_data.BAND_INDEX = BAND_INDEX_1+"|"+BAND_INDEX_2+"|"+BAND_INDEX_3+"|"+BAND_INDEX_4
                  dim_data.BAND_OFFSET = BAND_OFFSET_1+"|"+BAND_OFFSET_2+"|"+BAND_OFFSET_3+"|"+BAND_OFFSET_4
                  dim_data.SFSC_BEGIN = SFSC_BEGIN_1+"|"+SFSC_BEGIN_2+"|"+SFSC_BEGIN_3+"|"+SFSC_BEGIN_4
                  dim_data.SFSC_END = SFSC_END_1+"|"+SFSC_END_2+"|"+SFSC_END_3+"|"+SFSC_END_4
                  dim_data.DSR_BEGIN = DSR_BEGIN_1+"|"+DSR_BEGIN_2+"|"+DSR_BEGIN_3+"|"+DSR_BEGIN_4
                  dim_data.DSR_END = DSR_END_1+"|"+DSR_END_2+"|"+DSR_END_3+"|"+DSR_END_4
      
                }else{
                  ALGORITHM_TYPE_1 = xml.getElementsByTagName("ALGORITHM_TYPE")[0].value;
                  ALGORITHM_NAME_1 = xml.getElementsByTagName("ALGORITHM_NAME")[0].value;
                  ALGORITHM_ACTIVATION_1 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[0].value;
      
                  BAND_INDEX_1 = xml.getElementsByTagName("BAND_INDEX")[0].value;
                  BAND_OFFSET_1 = xml.getElementsByTagName("BAND_OFFSET")[0].value;
                  SFSC_BEGIN_1 = xml.getElementsByTagName("SFSC_BEGIN")[0].value;
                  SFSC_END_1 = xml.getElementsByTagName("SFSC_END")[0].value;
                  DSR_BEGIN_1 = xml.getElementsByTagName("DSR_BEGIN")[0].value;
                  DSR_END_1 = xml.getElementsByTagName("DSR_END")[0].value;
      
                  dim_data.LINE_NUMBER_1 = xml.getElementsByTagName("LINE_NUMBER")[0].value;
                  dim_data.GAIN_NUMBER_1 = xml.getElementsByTagName("GAIN_NUMBER")[0].value;
                  dim_data.PHYSICAL_BIAS_1 = xml.getElementsByTagName("PHYSICAL_BIAS")[0].value;
                  dim_data.PHYSICAL_GAIN_1 = xml.getElementsByTagName("PHYSICAL_GAIN")[0].value;
                  dim_data.PHYSICAL_UNIT_1 = xml.getElementsByTagName("PHYSICAL_UNIT")[0].value;
      
                      
                  dim_data.ALGORITHM_TYPE = ALGORITHM_TYPE_1
                  dim_data.ALGORITHM_NAME = ALGORITHM_NAME_1
                  dim_data.ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1
                  dim_data.BAND_INDEX = BAND_INDEX_1
                  dim_data.BAND_OFFSET = BAND_OFFSET_1
                  dim_data.SFSC_BEGIN = SFSC_BEGIN_1
                  dim_data.SFSC_END = SFSC_END_1
                  dim_data.DSR_BEGIN = DSR_BEGIN_1
                  dim_data.DSR_END = DSR_END_1



                  
                }
              }else{
                dim_data.ULXMAP = xml.getElementsByTagName("ULXMAP")[0].value;
                dim_data.ULYMAP = xml.getElementsByTagName("ULYMAP")[0].value;
                dim_data.XDIM = xml.getElementsByTagName("XDIM")[0].value;
                dim_data.YDIM = xml.getElementsByTagName("YDIM")[0].value;

                if(dim_data.IMAGING_MODE === 'MS'){
      
                  ALGORITHM_TYPE_1 = xml.getElementsByTagName("ALGORITHM_TYPE")[0].value;
                  ALGORITHM_NAME_1 = xml.getElementsByTagName("ALGORITHM_NAME")[0].value;
                  ALGORITHM_ACTIVATION_1 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[0].value;
      
                  ALGORITHM_TYPE_2 = xml.getElementsByTagName("ALGORITHM_TYPE")[1].value;
                  ALGORITHM_NAME_2 = xml.getElementsByTagName("ALGORITHM_NAME")[1].value;
                  ALGORITHM_ACTIVATION_2 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[1].value;
      
      
                  BAND_INDEX_1 = xml.getElementsByTagName("BAND_INDEX")[0].value;
                  BAND_OFFSET_1 = xml.getElementsByTagName("BAND_OFFSET")[0].value;
                  SFSC_BEGIN_1 = xml.getElementsByTagName("SFSC_BEGIN")[0].value;
                  SFSC_END_1 = xml.getElementsByTagName("SFSC_END")[0].value;
                  DSR_BEGIN_1 = xml.getElementsByTagName("DSR_BEGIN")[0].value;
                  DSR_END_1 = xml.getElementsByTagName("DSR_END")[0].value;
      
                  BAND_INDEX_2 = xml.getElementsByTagName("BAND_INDEX")[1].value;
                  BAND_OFFSET_2 = xml.getElementsByTagName("BAND_OFFSET")[1].value;
                  SFSC_BEGIN_2 = xml.getElementsByTagName("SFSC_BEGIN")[1].value;
                  SFSC_END_2 = xml.getElementsByTagName("SFSC_END")[1].value;
                  DSR_BEGIN_2 = xml.getElementsByTagName("DSR_BEGIN")[1].value;
                  DSR_END_2 = xml.getElementsByTagName("DSR_END")[1].value;
      
                  BAND_INDEX_3 = xml.getElementsByTagName("BAND_INDEX")[2].value;
                  BAND_OFFSET_3 = xml.getElementsByTagName("BAND_OFFSET")[2].value;
                  SFSC_BEGIN_3 = xml.getElementsByTagName("SFSC_BEGIN")[2].value;
                  SFSC_END_3 = xml.getElementsByTagName("SFSC_END")[2].value;
                  DSR_BEGIN_3 = xml.getElementsByTagName("DSR_BEGIN")[2].value;
                  DSR_END_3 = xml.getElementsByTagName("DSR_END")[2].value;
      
                  BAND_INDEX_4 = xml.getElementsByTagName("BAND_INDEX")[3].value;
                  BAND_OFFSET_4 = xml.getElementsByTagName("BAND_OFFSET")[3].value;
                  SFSC_BEGIN_4 = xml.getElementsByTagName("SFSC_BEGIN")[3].value;
                  SFSC_END_4 = xml.getElementsByTagName("SFSC_END")[3].value;
                  DSR_BEGIN_4 = xml.getElementsByTagName("DSR_BEGIN")[3].value;
                  DSR_END_4 = xml.getElementsByTagName("DSR_END")[3].value;
      
                  dim_data.LINE_NUMBER_1 = xml.getElementsByTagName("LINE_NUMBER")[0].value;
                  dim_data.GAIN_NUMBER_1 = xml.getElementsByTagName("GAIN_NUMBER")[0].value;
                  dim_data.PHYSICAL_BIAS_1 = xml.getElementsByTagName("PHYSICAL_BIAS")[0].value;
                  dim_data.PHYSICAL_GAIN_1 = xml.getElementsByTagName("PHYSICAL_GAIN")[0].value;
                  dim_data.PHYSICAL_UNIT_1 = xml.getElementsByTagName("PHYSICAL_UNIT")[0].value;
      
                  dim_data.LINE_NUMBER_2 = xml.getElementsByTagName("LINE_NUMBER")[1].value;
                  dim_data.GAIN_NUMBER_2 = xml.getElementsByTagName("GAIN_NUMBER")[1].value;
                  dim_data.PHYSICAL_BIAS_2 = xml.getElementsByTagName("PHYSICAL_BIAS")[1].value;
                  dim_data.PHYSICAL_GAIN_2 = xml.getElementsByTagName("PHYSICAL_GAIN")[1].value;
                  dim_data.PHYSICAL_UNIT_2 = xml.getElementsByTagName("PHYSICAL_UNIT")[1].value;
      
                  dim_data.LINE_NUMBER_3 = xml.getElementsByTagName("LINE_NUMBER")[2].value;
                  dim_data.GAIN_NUMBER_3 = xml.getElementsByTagName("GAIN_NUMBER")[2].value;
                  dim_data.PHYSICAL_BIAS_3 = xml.getElementsByTagName("PHYSICAL_BIAS")[2].value;
                  dim_data.PHYSICAL_GAIN_3 = xml.getElementsByTagName("PHYSICAL_GAIN")[2].value;
                  dim_data.PHYSICAL_UNIT_3 = xml.getElementsByTagName("PHYSICAL_UNIT")[2].value;
      
                  dim_data.LINE_NUMBER_4 = xml.getElementsByTagName("LINE_NUMBER")[3].value;
                  dim_data.GAIN_NUMBER_4 = xml.getElementsByTagName("GAIN_NUMBER")[3].value;
                  dim_data.PHYSICAL_BIAS_4 = xml.getElementsByTagName("PHYSICAL_BIAS")[3].value;
                  dim_data.PHYSICAL_GAIN_4 = xml.getElementsByTagName("PHYSICAL_GAIN")[3].value;
                  dim_data.PHYSICAL_UNIT_4 = xml.getElementsByTagName("PHYSICAL_UNIT")[3].value;
      
      
                  dim_data.ALGORITHM_TYPE = ALGORITHM_TYPE_1+"|"+ALGORITHM_TYPE_2
                  dim_data.ALGORITHM_NAME = ALGORITHM_NAME_1+"|"+ALGORITHM_NAME_2
                  dim_data.ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1+"|"+ALGORITHM_ACTIVATION_2
                  dim_data.BAND_INDEX = BAND_INDEX_1+"|"+BAND_INDEX_2+"|"+BAND_INDEX_3+"|"+BAND_INDEX_4
                  dim_data.BAND_OFFSET = BAND_OFFSET_1+"|"+BAND_OFFSET_2+"|"+BAND_OFFSET_3+"|"+BAND_OFFSET_4
                  dim_data.SFSC_BEGIN = SFSC_BEGIN_1+"|"+SFSC_BEGIN_2+"|"+SFSC_BEGIN_3+"|"+SFSC_BEGIN_4
                  dim_data.SFSC_END = SFSC_END_1+"|"+SFSC_END_2+"|"+SFSC_END_3+"|"+SFSC_END_4
                  dim_data.DSR_BEGIN = DSR_BEGIN_1+"|"+DSR_BEGIN_2+"|"+DSR_BEGIN_3+"|"+DSR_BEGIN_4
                  dim_data.DSR_END = DSR_END_1+"|"+DSR_END_2+"|"+DSR_END_3+"|"+DSR_END_4


                }else{
                  ALGORITHM_TYPE_1 = xml.getElementsByTagName("ALGORITHM_TYPE")[0].value;
                  ALGORITHM_NAME_1 = xml.getElementsByTagName("ALGORITHM_NAME")[0].value;
                  ALGORITHM_ACTIVATION_1 = xml.getElementsByTagName("ALGORITHM_ACTIVATION")[0].value;
      
                  BAND_INDEX_1 = xml.getElementsByTagName("BAND_INDEX")[0].value;
                  BAND_OFFSET_1 = xml.getElementsByTagName("BAND_OFFSET")[0].value;
                  SFSC_BEGIN_1 = xml.getElementsByTagName("SFSC_BEGIN")[0].value;
                  SFSC_END_1 = xml.getElementsByTagName("SFSC_END")[0].value;
                  DSR_BEGIN_1 = xml.getElementsByTagName("DSR_BEGIN")[0].value;
                  DSR_END_1 = xml.getElementsByTagName("DSR_END")[0].value;
      
                  dim_data.LINE_NUMBER_1 = xml.getElementsByTagName("LINE_NUMBER")[0].value;
                  dim_data.GAIN_NUMBER_1 = xml.getElementsByTagName("GAIN_NUMBER")[0].value;
                  dim_data.PHYSICAL_BIAS_1 = xml.getElementsByTagName("PHYSICAL_BIAS")[0].value;
                  dim_data.PHYSICAL_GAIN_1 = xml.getElementsByTagName("PHYSICAL_GAIN")[0].value;
                  dim_data.PHYSICAL_UNIT_1 = xml.getElementsByTagName("PHYSICAL_UNIT")[0].value;
      
                      
                  dim_data.ALGORITHM_TYPE = ALGORITHM_TYPE_1
                  dim_data.ALGORITHM_NAME = ALGORITHM_NAME_1
                  dim_data.ALGORITHM_ACTIVATION = ALGORITHM_ACTIVATION_1
                  dim_data.BAND_INDEX = BAND_INDEX_1
                  dim_data.BAND_OFFSET = BAND_OFFSET_1
                  dim_data.SFSC_BEGIN = SFSC_BEGIN_1
                  dim_data.SFSC_END = SFSC_END_1
                  dim_data.DSR_BEGIN = DSR_BEGIN_1
                  dim_data.DSR_END = DSR_END_1


      
                }
              }

              var ID_in_order =  null;
              const formData = new FormData();


              const myNewFile = new File([image], dim_data.JOB_ID+'.JPG', {type: image.type});
              
              formData.append("image", myNewFile)
              formData.append("fileName", dim_data.JOB_ID)
              
              



              Axios.get('http://localhost:3001/get_id_allfile/'+dim_data.IMAGING_DATE+'/'+dim_data.IMAGING_TIME+'/'+dim_data.MISSION+'/'+dim_data.REVOLUTION_NUMBER+
              '/'+dim_data.INSTRUMENT+'/'+dim_data.INSTRUMENT_INDEX+'/'+dim_data.IMAGING_MODE+'/'+PATH+'/'+ROW).then((response)=>{
                //console.log(response.data)
                console.log(response.data[0].ID)
               
                if(response.data.length === 1){
                  ID_in_order = response.data[0].ID
                  if(dim_data.IMAGING_MODE === 'MS' && dim_data.PROCESSING_LEVEL ==='1A' && response.data[0].MS1A_ID === null){
                    dim_data.IMAGE =  'http://127.0.0.1:3001/MS1A/'+dim_data.JOB_ID+'.JPG'
                    try {
                        const res =  Axios.post(
                            "http://localhost:3001/upload_MS1A",
                            formData
                        ).then(()=>{
                        
                    })
                    } catch (ex) {
                        console.log(ex);
                    }
                    Axios.post('http://localhost:3001/add_data/',{
                        data:dim_data
                    }).then((response)=>{
                      console.log(response.data.insertId)
                      Axios.put('http://localhost:3001/update_mode/',{
                        ID_in_order:ID_in_order,
                        insertId:response.data.insertId,
                        mode:'ms1a',
                        image:dim_data.IMAGE
                      }).then((res)=>{
                        window.location.reload()
                      })
                    })
                  }else if(dim_data.IMAGING_MODE === 'MS' && dim_data.PROCESSING_LEVEL ==='2A' && response.data[0].MS2A_ID === null){
                    dim_data.IMAGE =  'http://127.0.0.1:3001/MS2A/'+dim_data.JOB_ID+'.JPG'
                    try {
                        const res =  Axios.post(
                            "http://localhost:3001/upload_MS2A",
                            formData
                        ).then(()=>{
                        
                    })
                    } catch (ex) {
                        console.log(ex);
                    }
                    Axios.post('http://localhost:3001/add_data/',{
                        data:dim_data
                    }).then((response)=>{
                      console.log(response.data.insertId)
                      Axios.put('http://localhost:3001/update_mode/',{
                        ID_in_order:ID_in_order,
                        insertId:response.data.insertId,
                        mode:'ms2a',
                        image:dim_data.IMAGE
                      }).then((res)=>{
                        window.location.reload()
                      })
                    })
                  }else if(dim_data.IMAGING_MODE === 'PAN' && dim_data.PROCESSING_LEVEL ==='1A' && response.data[0].PAN1A_ID === null){
                    dim_data.IMAGE =  'http://127.0.0.1:3001/PAN1A/'+dim_data.JOB_ID+'.JPG'
                    try {
                        const res =  Axios.post(
                            "http://localhost:3001/upload_PAN1A",
                            formData
                        ).then(()=>{
                        
                    })
                    } catch (ex) {
                        console.log(ex);
                    }
                    Axios.post('http://localhost:3001/add_data/',{
                        data:dim_data
                    }).then((response)=>{
                      console.log(response.data.insertId)
                      Axios.put('http://localhost:3001/update_mode/',{
                        ID_in_order:ID_in_order,
                        insertId:response.data.insertId,
                        mode:'pan1a',
                        image:dim_data.IMAGE
                      }).then((res)=>{
                        window.location.reload()
                      })
                    })
                  }else if(dim_data.IMAGING_MODE === 'PAN' && dim_data.PROCESSING_LEVEL ==='2A' && response.data[0].PAN2A_ID === null){
                    dim_data.IMAGE =  'http://127.0.0.1:3001/PAN2A/'+dim_data.JOB_ID+'.JPG'
                    try {
                        const res =  Axios.post(
                            "http://localhost:3001/upload_PAN2A",
                            formData
                        ).then(()=>{

                    })
                    } catch (ex) {
                        console.log(ex);
                    }
                    Axios.post('http://localhost:3001/add_data/',{
                        data:dim_data
                    }).then((response)=>{
                      console.log(response.data.insertId)
                      Axios.put('http://localhost:3001/update_mode/',{
                        ID_in_order:ID_in_order,
                        insertId:response.data.insertId,
                        mode:'pan2a',
                        image:dim_data.IMAGE
                      }).then((res)=>{
                        window.location.reload()
                      })
                    })
                  }
                }

                //
              })


              
                
              
              
              //console.log(dim_data)


              props.handleCloseModalImport()
              
            };

            
        }

        
    }
    return(
        <div style={{flex:1,display:'flex'}}>
            <input
                ref={fileCUFRef}
                onChange={ReadfileZip}
                type="file"
                style={{ display: "none" }}
                multiple={true}
            />
            <Button style={{borderRadius:'0',width:'100%'}} variant="dark" onClick={()=>fileCUFRef.current.click()} >
                <Icon icon="ant-design:file-add-outlined"  style={{width:'100px',height:'100px'}}/>
                <h5>DIM file</h5>
            </Button>
        </div>
    )
    
}


const mapStateToProps = (state) => ({ 
    
});
const mapDispatchToProps = (dispatch) => ({
    
});




export default connect(mapStateToProps,mapDispatchToProps)(ScirptReadDIM);