import React, { Component,useEffect } from "react";
import { withLeaflet } from "react-leaflet";
import LIR from "leaflet-imageoverlay-rotated";
import L from "leaflet";

const ImageOverlayRotated =(props)=>{
  const { map } = props.leaflet;
  var overlay;
  var satimagedata = props.data;
  var image_Height,image_position,image_style = '';
  useEffect(() => {
    console.log(props.data)
    var img = new Image()
    if(satimagedata.PANRAWIMAGE !== null){
      img.src = satimagedata.PANRAWIMAGE;
    }else{
      img.src = satimagedata.MSRAWIMAGE;
    }
    if(satimagedata.BROWSEBEGINLINE <0){
      image_Height = satimagedata.BROWSEENDLINE;
      image_position = '0';
      image_style = "width: 500px; height: "+image_Height+"px; object-fit: cover; object-position: 0px "+image_position+"px;"
      console.log(image_style)
    }else{
      if(img.height <satimagedata.BROWSEENDLINE){
        image_Height = img.height - satimagedata.BROWSEBEGINLINE;
      }else{
        image_Height = satimagedata.BROWSEENDLINE - satimagedata.BROWSEBEGINLINE;
      }
      
      image_position = satimagedata.BROWSEBEGINLINE;
      image_style = "width: 500px; height: "+image_Height+"px; object-fit: cover; object-position: 0px -"+image_position+"px;"
      console.log(image_style)
    }
    
    img.style = image_style;

    var point1,point2,point3;
    if(parseFloat(satimagedata.NW_LAT) >=parseFloat(satimagedata.SW_LAT)){
      point1 = L.latLng(parseFloat(satimagedata.NW_LAT),parseFloat(satimagedata.NW_LON));
      point2 = L.latLng(parseFloat(satimagedata.NE_LAT),parseFloat(satimagedata.NE_LON));
      point3 = L.latLng(parseFloat(satimagedata.SW_LAT),parseFloat(satimagedata.SW_LON));
    }else{
      point1 = L.latLng(parseFloat(satimagedata.SW_LAT),parseFloat(satimagedata.SW_LON));
      point2 = L.latLng(parseFloat(satimagedata.SE_LAT),parseFloat(satimagedata.SE_LON));
      point3 = L.latLng(parseFloat(satimagedata.NW_LAT),parseFloat(satimagedata.NW_LON));
    }
    
      overlay = L.imageOverlay.rotated(img, point1, point2, point3, {
      interactive: true,
    });
    overlay.addTo(map);
});

    return null;
  
}

export default withLeaflet(ImageOverlayRotated);





