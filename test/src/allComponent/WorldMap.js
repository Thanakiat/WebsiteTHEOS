import React, { useState,useEffect } from 'react';
import {

    TileLayer,
    Rectangle,
    Polygon,
    Map
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Button,FormControl,Modal} from 'react-bootstrap'
import { Icon } from '@iconify/react';
import SearchTool from './SearchTool';
import ImageSelect from './ImageSelect';
import NavbarMenu from './NavbarMenu';
import ScriptReadCUF from '../scriptReadFile/ScriptReadCUF';
import ScriptReadDIM from '../scriptReadFile/ScriptReadDIM';
import  Axios  from 'axios';
import { IP_BACKEND } from '../config/Config';




const WorldMap=(props)=>{

    const blackOptions = { color: 'black' }

    const [seletemode, setseletemode] = useState(false);
    const [firstlat,setfirstlat] = useState(null);
    const [firstlng,setfirstlng] = useState(null);
    const [dirstlat,setdirstlat] = useState(null);
    const [dirstlng,setdirstlng] = useState(null);

    const [modalimportFile,setmodalimportFile] = useState(false);

    const [modalwarningCUF,setmodalwarningCUF] = useState(false);
    const [modalwarningDIM,setmodalwarningDIM] = useState(false);


    const [allData,setAllData] = useState([]);
    const [page,setPage] = useState(1);
    const [showpage,setShowPage] = useState(1);
    const [searchoption,setSearchOption] = useState('');
    const [searchArea,setSearchArea] = useState('');


    
    const handleStart_draw_box=(e)=>{
        if(seletemode === true){
            const { lat, lng } = e.latlng;
            // console.log('lat = '+lat)
            // console.log('lng = '+lng) 
            if(dirstlat !== null){
                // console.log('lat = '+lat)
                // console.log('lng = '+lng) 
                Seletemode()
            }else{
                setfirstlat(lat)
                setfirstlng(lng)
            }
        }
    }

    const handleDrawing_box=(e)=>{
        if(seletemode === true){
            if(firstlat !== null){
                const { lat, lng } = e.latlng;
                setdirstlat(lat)
                setdirstlng(lng)
            }

        }
    }

    const Seletemode=()=>{
        setseletemode(!seletemode)
        if(seletemode === false){
            setfirstlat(null)
            setfirstlng(null)
            setdirstlat(null)
            setdirstlng(null)
            setSearchArea('')
           
        }else{
            var top,left,right,bottom = null;
            if(firstlat > dirstlat){
                top = firstlat;
                bottom = dirstlat;
            }else{
                top = dirstlat;
                bottom = firstlat;
            }
            if(firstlng > dirstlng){
                right = firstlng;
                left = dirstlng;
            }else{
                right = dirstlng;
                left = firstlng;
            }
            console.log('top = '+top)
            console.log('left = '+left)
            console.log('right = '+right)
            console.log('bottom = '+bottom)

            var new_option_search = '';
            if(top !== null && left !== null && right !== null && bottom !== null){
                new_option_search = ' AND ((SE_LON BETWEEN '+left+' AND '+right+' AND SE_LAT BETWEEN '+bottom+' AND '+top+
                ') OR (SW_LON BETWEEN '+left+' AND '+right+' AND SW_LAT BETWEEN '+bottom+' AND '+top+
                ') OR (NE_LON BETWEEN '+left+' AND '+right+' AND NE_LAT BETWEEN '+bottom+' AND '+top+
                ') OR (NW_LON BETWEEN '+left+' AND '+right+' AND NW_LAT BETWEEN '+bottom+' AND '+top+
                '))'
            }
            setSearchArea(new_option_search)
            // get_searchTool_option(new_option_search,1)
        }
        
    }

    const Clicktodelete=()=>{
        setfirstlat(null)
        setfirstlng(null)
        setdirstlat(null)
        setdirstlng(null)
        setSearchArea('')
    }
    const Box=()=>{
        if(dirstlat !== null){
            return(
                <Rectangle bounds={[[firstlat,firstlng],[dirstlat,dirstlng]]}
                color='purple'
                //pathOptions={blackOptions}  
                />
            )
        }
    }
    const handleCloseModalImport=()=>{
        setmodalimportFile(!modalimportFile)
    }

    const handleClose_Show_warning_CUF=()=>{
        setmodalwarningCUF(!modalwarningCUF)
    }

    const handleClose_Show_warning_DIM=()=>{
        setmodalwarningDIM(!modalwarningDIM)
    }

    const Show_warning_CUF=()=>{
        return(
            <Modal show={modalwarningCUF} onHide={handleClose_Show_warning_CUF}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your select file they have not CUF file.
                </Modal.Body>
            </Modal>
        )
    }
    const Show_warning_DIM=()=>{
        return(
            <Modal show={modalwarningDIM} onHide={handleClose_Show_warning_DIM}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your select file they have not DIM file.
                </Modal.Body>
            </Modal>
        )
    }

    const Show_import_file=()=>{
        return(
            <Modal show={modalimportFile} onHide={handleCloseModalImport}>
                <Modal.Header closeButton>
                    <Modal.Title>Import file</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{display:'flex',flexDirection:'row',flex:1}}>
                        <ScriptReadCUF handleCloseModalImport={handleCloseModalImport} handleClose_Show_warning_CUF={handleClose_Show_warning_CUF}  />
                        <ScriptReadDIM handleCloseModalImport={handleCloseModalImport} handleClose_Show_warning_DIM={handleClose_Show_warning_DIM} />
                    </div>
                    
                </Modal.Body>
            </Modal>
        )
    }




    useEffect(() => {
        Axios.get(IP_BACKEND+'/imagedata/',{
        }).then((response)=>{
            setAllData(response.data)
        })
    },[]);

    const get_searchTool_option=(option,page)=>{
        if(option !== searchoption){
            setSearchOption(option)
            setPage(1)
            setShowPage(1)
        }
        console.log(option)
        if(option!==''){
            Axios.get(IP_BACKEND+'/imagedata_with_option/'+option+'/'+page,{
            }).then((response)=>{
                console.log(response.data)
                setAllData(response.data)
            })
        }else{
            Axios.get(IP_BACKEND+'/imagedata_with_option/-'+'/'+page,{
            }).then((response)=>{
                console.log(response.data)
                setAllData(response.data)
            })
        }
    }

    const changePage_withForm=(e)=>{
        console.log(e.key);
        if (e.key === 'Enter') {
            setShowPage(parseInt(e.target.value))
            setPage(parseInt(e.target.value))
            get_searchTool_option(searchoption,page)
        }else{
            setShowPage(e.target.value)
        }
    }
    const add_page=()=>{
        setPage(parseInt(page) +1)
        setShowPage(parseInt(page)+1)
        get_searchTool_option(searchoption,parseInt(page)+1)
    }
    const minus_page=()=>{
        if(parseInt(page) -1 >0){
            setPage(parseInt(page) -1)
            setShowPage(parseInt(page)-1)
            get_searchTool_option(searchoption,parseInt(page)-1)
        }

    }
    
    
    return (
        <div>
        <NavbarMenu/>
        <Show_import_file/>
        <Show_warning_CUF/>
        <Show_warning_DIM/>
        <div style={{display:'flex',flexDirection:'row'}} >
          <SearchTool get_searchTool_option={get_searchTool_option} searchArea={searchArea} Clicktodelete={Clicktodelete}/>
          <div style={{width:'100vw',height:'92vh',overflow: 'auto'}}>
            <div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{backgroundColor:'black',width:'70px',height:'92vh'}} >  
                        <Button variant="dark"  style={{borderRadius:0,width:'70px',height:'70px'}} onClick={handleCloseModalImport}>
                            <Icon icon="bx:import" style={{width:'30px',height:'30px'}} />
                            <h4 style={{textAlign:'center',fontSize:'10px'}}>IMPORT</h4>
                        </Button>
                        <Button variant="dark" onClick={Seletemode} style={{borderRadius:0,width:'70px',height:'70px'}}>
                            <Icon icon="carbon:select-02" style={{width:'30px',height:'30px'}} />
                            <h4 style={{textAlign:'center',fontSize:'10px'}}>SELECT</h4>
                        </Button>
                        <Button variant="dark" onClick={Clicktodelete} style={{borderRadius:0,width:'70px',height:'70px'}}>
                            <Icon icon="ant-design:delete-outlined" style={{width:'30px',height:'30px'}} />
                            <h4 style={{textAlign:'center',fontSize:'10px'}}>CLEAR</h4>
                        </Button>
                    </div>
                    <Map
                            center={[10.276389, 97.571111]}
                            zoom={5}
                            
                            style={{ height: "92vh",width:'100vw' }}
                            onmousemove={handleDrawing_box}
                            onClick={handleStart_draw_box}
                        >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {
                            allData.map((data)=>{
                                return(
                                    <div key={data.ID}>
                                        <Polygon  color='black'  //pathOptions={{color: 'black'}} 
                                            positions={
                                                [
                                                    [ parseFloat(data.NE_LAT) ,parseFloat(data.NE_LON) ],
                                                    [ parseFloat(data.NW_LAT) ,parseFloat(data.NW_LON) ],
                                                    [ parseFloat(data.SW_LAT) ,parseFloat(data.SW_LON) ],
                                                    [ parseFloat(data.SE_LAT) ,parseFloat(data.SE_LON) ]
                                                ]    
                                            }
                                            onclick={
                                                (e)=>{
                                                    console.log(data.ID)
                                                }
                                            }
                                           
                                        />
                                       
                                    </div>
                                        
                                )
                            })
                            
                        }
                        
                        {/* <Polygon  color='black'  //pathOptions={{color: 'black'}} 
                                            positions={
                                                [
                                                    [ 11.35054,99.67026],
                                                    [10.81945,102.22612],

                                                    [ 13.48503,102.80729],
                                                    [ 14.01229,100.22474]
                                                    // [10.81945, 99.67026 ],
                                                    // // [ ],
                                                    // [14.01229,102.80729],
                                                    // [],
                                                   
                                                ]    
                                            }

                                           
                                        /> */}

                        
                        <Box/>
                    </Map>
                </div>
            </div>

            <div style={{display:'flex',justifyContent:'center',margin:'15px'}}>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={minus_page}>{'<'}</Button>
                <FormControl style={{width:'20%',marginLeft:'15px',marginRight:'15px',borderRadius:'20px',textAlign:'center'}}
                 value={showpage} readOnly/>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={add_page} >{'>'}</Button>
            </div>
            
            <ImageSelect  alldata={allData} />

            {/* <div style={{display:'flex',justifyContent:'center',margin:'15px'}}>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={minus_page}>{'<'}</Button>
                <FormControl style={{width:'20%',marginLeft:'15px',marginRight:'15px',borderRadius:'20px',textAlign:'center'}}
                 value={showpage} onChange={changePage_withForm} onKeyUp={changePage_withForm} />
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={add_page} >{'>'}</Button>
            </div> */}
            <div style={{display:'flex',justifyContent:'center',margin:'15px'}}>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={minus_page}>{'<'}</Button>
                <FormControl style={{width:'20%',marginLeft:'15px',marginRight:'15px',borderRadius:'20px',textAlign:'center'}}
                 value={showpage} readOnly/>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={add_page} >{'>'}</Button>
            </div>
          </div>
        </div>
    </div>
        
    );
  }

  export default WorldMap;
  