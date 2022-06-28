import React, { useRef,useState,Component } from 'react';
import { connect } from 'react-redux';
import XMLParser from "react-xml-parser";
import { Icon } from '@iconify/react';
import {Button,Modal,Form} from 'react-bootstrap';
import Axios from 'axios';

const ScirptReadCUF=(props)=> {

    const fileCUFRef = useRef();
    
    const ReadfileZip= (e)=>{
        e.preventDefault();
        const data = {
            file : [],
            name : []
        }
        const formData = new FormData();
        console.log(e.target.files);
        
        for(var i = 0;i < e.target.files.length;i++){
            data.file.push(e.target.files[i])
            formData.append("file", data.file[i]);
            if(i === e.target.files.length - 1){
                Axios.post(
                "http://127.0.0.1:5000/api/upload",
                formData
                ).then((result)=>{
                console.log(result);
                window.location.reload()
            })
            }
        }
        
    }

    
    const Readfile= (e)=>{
        //console.log(e.target.files[0].name)
        e.preventDefault();
        const reader = new FileReader();
        var cuffile;
        var all_file = e.target.files;
        var all_image = [];
        const formData = new FormData();
        const data = {
            file : [],
            name : []
          }
        console.log(all_file)
        for(var i=0;i<all_file.length;i++){
           
            if(all_file[i].name.split(".")[1]==='CUF'){
                cuffile = all_file[i]
            
            }else{
                
                all_image.push(all_file[i])
            }
            
        }
        if(cuffile === undefined){
            props.handleCloseModalImport()
            props.handleClose_Show_warning_CUF()
        }else if(cuffile.name.split(".")[1] === 'CUF'){
            var misstion,revolutionNumber,center_Viewing_Date,nwLat ,nwLon ,neLat,neLon ,swLat,swLon ,seLat,seLon,
            latSceneCenter,longSceneCenter,instrumentType,instrumentIdt,spectralMode,path,row,sunAzimuth,sunElevation,rawimage;


            
            var canupdate = true;

            reader.readAsText(cuffile);
            reader.onload = (e) => {
              const text = e.target.result;
              const xml = new XMLParser().parseFromString(text);
              //console.log(xml)
              misstion = xml.getElementsByTagName("mission")[0].value;
              
              revolutionNumber = xml.getElementsByTagName("revolutionNumber")[0].value;
              
              
              const segment_xml = xml.getElementsByTagName("segment");

              console.log(xml.getElementsByTagName("browseFileName"))
              if(xml.getElementsByTagName("browseFileName").length  === all_image.length){
                for(var i=0;i<all_image.length;i++){
                    if(xml.getElementsByTagName("browseFileName")[i].value !== all_image[i].name){
                        console.log('Miss match')
                        canupdate = !canupdate
                        break;
                    }else{
                        data.file.push(all_image[i])
                        data.name.push(all_image[i].name)
                        formData.append("image", all_image[i])
                    }
                    if(i === all_image.length-1){
                        console.log('can upload image')
                        try {
                            const res =  Axios.post(
                                "http://localhost:3001/upload",
                                formData
                            ).then(()=>{
                            
                        })
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
              }else{
                  console.log('File not complete')
                  canupdate = !canupdate
              }
              if(canupdate){
                //console.log(canupdate)
                segment_xml.map((segment)=>{
                    //console.log(segment)
                    instrumentType =segment.getElementsByTagName("instrumentType")[0].value;
    
                    instrumentIdt=segment.getElementsByTagName("instrumentIdt")[0].value;
                    spectralMode=segment.getElementsByTagName("spectralMode")[0].value;
                    rawimage =segment.getElementsByTagName("browseFileName")[0].value;
                    //console.log(rawimage)
                    

                    const scene_xml = segment.getElementsByTagName("scene")
          
                    scene_xml.map((scene)=>{
          
                      //console.log(scene);
                      var location_scene = scene.getElementsByTagName("locationScene");
                      center_Viewing_Date = scene.getElementsByTagName("centerViewingDate")[0].value;
                     
                      path =scene.getElementsByTagName("kPath")[0].value;
                      row =scene.getElementsByTagName("jRow")[0].value;
    
                      sunAzimuth =scene.getElementsByTagName("sunAzimuth")[0].value;
                      sunElevation =scene.getElementsByTagName("sunElevation")[0].value;
    
                      latSceneCenter = scene.getElementsByTagName("latSceneCenter")[0].value;
                      longSceneCenter = scene.getElementsByTagName("longSceneCenter")[0].value;
                      
                      const browseBeginLine = scene.getElementsByTagName("browseBeginLine")[0].value;
                      const browseEndLine = scene.getElementsByTagName("browseEndLine")[0].value;
                      var date = center_Viewing_Date.slice(0, 4)+'-'+center_Viewing_Date.slice(4, 6)+'-'+center_Viewing_Date.slice(6, 8);
                      var hour = center_Viewing_Date.slice(8, 10) ;
                      var minite = center_Viewing_Date.slice(10, 12) ;
                      var seconds = center_Viewing_Date.slice(12,14) ;
                      var time = hour+':'+minite+':'+ seconds;
    
                      location_scene.map((location)=>{
                        nwLat = location.getElementsByTagName("nwLat")[0].value;
                        nwLon = location.getElementsByTagName("nwLong")[0].value;
                        neLat = location.getElementsByTagName("neLat")[0].value;
                        neLon = location.getElementsByTagName("neLong")[0].value;
                        swLat = location.getElementsByTagName("swLat")[0].value;
                        swLon = location.getElementsByTagName("swLong")[0].value;
                        seLat = location.getElementsByTagName("seLat")[0].value;
                        seLon = location.getElementsByTagName("seLong")[0].value;
    

    

                        if(nwLat.slice(0,1) === "N"){
                            nwLat = (parseInt(nwLat.slice(1, 4))+(parseInt(nwLat.slice(4, 6))/60)+(parseInt(nwLat.slice(6))/3600)).toFixed(3)
                        }else if(nwLat.slice(0,1) === "S"){
                            nwLat = ((-1)*(parseInt(nwLat.slice(1, 4))+(parseInt(nwLat.slice(4, 6))/60)+(parseInt(nwLat.slice(6))/3600))).toFixed(3)
                        }
                        if(neLat.slice(0,1) === "N"){
                            neLat = (parseInt(neLat.slice(1, 4))+(parseInt(neLat.slice(4, 6))/60)+(parseInt(neLat.slice(6))/3600)).toFixed(3)
                        }else if(neLat.slice(0,1) === "S"){
                            neLat = ((-1)*(parseInt(neLat.slice(1, 4))+(parseInt(neLat.slice(4, 6))/60)+(parseInt(neLat.slice(6))/3600))).toFixed(3)
                        }
                        if(swLat.slice(0,1) === "N"){
                            swLat = (parseInt(swLat.slice(1, 4))+(parseInt(swLat.slice(4, 6))/60)+(parseInt(swLat.slice(6))/3600)).toFixed(3)
                        }else if(swLat.slice(0,1) === "S"){
                            swLat = ((-1)*(parseInt(swLat.slice(1, 4))+(parseInt(swLat.slice(4, 6))/60)+(parseInt(swLat.slice(6))/3600))).toFixed(3)
                        }
                        if(seLat.slice(0,1) === "N"){
                            seLat = (parseInt(seLat.slice(1, 4))+(parseInt(seLat.slice(4, 6))/60)+(parseInt(seLat.slice(6))/3600)).toFixed(3)
                        }else if(seLat.slice(0,1) === "S"){
                            seLat = ((-1)*(parseInt(seLat.slice(1, 4))+(parseInt(seLat.slice(4, 6))/60)+(parseInt(seLat.slice(6))/3600))).toFixed(3)
                        }

                        

                        if(nwLon.slice(0,1) === "E"){
                            nwLon = (parseInt(nwLon.slice(1, 4))+(parseInt(nwLon.slice(4, 6))/60)+(parseInt(nwLon.slice(6))/3600)).toFixed(3)
                        }else if(nwLon.slice(0,1) === "W"){
                            nwLon = ((-1)*(parseInt(nwLon.slice(1, 4))+(parseInt(nwLon.slice(4, 6))/60)+(parseInt(nwLon.slice(6))/3600))).toFixed(3)
                        }

                        if(neLon.slice(0,1) === "E"){
                            neLon = (parseInt(neLon.slice(1, 4))+(parseInt(neLon.slice(4, 6))/60)+(parseInt(neLon.slice(6))/3600)).toFixed(3)
                        }else if(neLon.slice(0,1) === "W"){
                            neLon = ((-1)*(parseInt(neLon.slice(1, 4))+(parseInt(neLon.slice(4, 6))/60)+(parseInt(neLon.slice(6))/3600))).toFixed(3)
                        }

                        if(swLon.slice(0,1) === "E"){
                            swLon = (parseInt(swLon.slice(1, 4))+(parseInt(swLon.slice(4, 6))/60)+(parseInt(swLon.slice(6))/3600)).toFixed(3)
                        }else if(swLon.slice(0,1) === "W"){
                            swLon = ((-1)*(parseInt(swLon.slice(1, 4))+(parseInt(swLon.slice(4, 6))/60)+(parseInt(swLon.slice(6))/3600))).toFixed(3)
                        }

                        if(seLon.slice(0,1) === "E"){
                            seLon = (parseInt(seLon.slice(1, 4))+(parseInt(seLon.slice(4, 6))/60)+(parseInt(seLon.slice(6))/3600)).toFixed(3)
                        }else if(seLon.slice(0,1) === "W"){
                            seLon = ((-1)*(parseInt(seLon.slice(1, 4))+(parseInt(seLon.slice(4, 6))/60)+(parseInt(seLon.slice(6))/3600))).toFixed(3)
                        }
    
                        
    
                            Axios.post('http://localhost:3001/add_data_cuffile/',{
                                misstion:misstion,
                                revolutionNumber:revolutionNumber,
                                date:date,
                                time:time,
                                instrumentType:instrumentType,
                                instrumentIdt:instrumentIdt,
                                spectralMode:spectralMode,
                                path:path,
                                row:row,
                                sunAzimuth:sunAzimuth,
                                sunElevation:sunElevation,
                                nwLat:nwLat,
                                nwLon:nwLon,
                                neLat:neLat,
                                neLon:neLon,
                                swLat:swLat,
                                swLon:swLon,
                                seLat:seLat,
                                seLon:seLon,
                                latSceneCenter:latSceneCenter,
                                longSceneCenter:longSceneCenter,
                                image:rawimage,
                                browseBeginLine:browseBeginLine,
                                browseEndLine:browseEndLine
                            }).then(()=>{
                                window.location.reload()
                            }
                                
                            )
    
                        
                        
                      })
                    })
                  })
              }else{
                  console.log('not upload')

              }
              
            };

            


            props.handleCloseModalImport()
            
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
                method="post"
            />
            <Button style={{borderRadius:'0',width:'100%'}} variant="dark" onClick={() => fileCUFRef.current.click()} >
                <Icon icon="ant-design:file-add-outlined" style={{width:'100px',height:'100px'}} />
                <h5>CUF file</h5>
            </Button>
        </div>
        
    )

  
}


const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
});
const mapDispatchToProps = (dispatch) => ({
    
});




export default connect(mapStateToProps,mapDispatchToProps)(ScirptReadCUF);