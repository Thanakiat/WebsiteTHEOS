import React, { useState } from 'react';

import "leaflet/dist/leaflet.css";
import {Button,Form,FloatingLabel} from 'react-bootstrap'



function SearchTool(props) {
    const [startDate,setStartDate] = useState('');
    const [endDate,setEndDate] = useState('');
    const [mission,setmission] = useState('');
    const [revolution_Number,setRevolution_Number] = useState('');
    const [MODE,setMODE] = useState('');
    const [LEVEL,setLEVEL] = useState('');
    // const [INSTRUMENT_TYPE,setINSTRUMENT_TYPE] = useState('');
    // const [INSTRUMENT_INDEX,setINSTRUMENT_INDEX] = useState('');
    // const [PATH,setPATH] = useState('');
    // const [ROW,setROW] = useState('');



    const show_option=()=>{
        var option_select = '';
        if(startDate !==''){
            option_select = option_select+" AND DATE >= '"+startDate+"'"
        }if(endDate !==''){
            option_select =option_select+" AND DATE <= '"+endDate+"'"
        }if(mission !==''){
            option_select =option_select+" AND MISSION = '"+mission+"'"
        }if(revolution_Number !==''){
            option_select =option_select+" AND REVOLUTION_NUMBER = '"+revolution_Number+"'"
        }if(MODE !==''){
            option_select =option_select+" AND MODE = '"+MODE+"'"
        }if(LEVEL !==''){
            option_select =option_select+" AND "+MODE+LEVEL+'_ID IS NOT NULL '
        }
        // if(INSTRUMENT_TYPE !==''){
        //     option_select =option_select+" AND INSTRUMENT_TYPE = '"+INSTRUMENT_TYPE+"'"
        // }if(INSTRUMENT_INDEX !==''){
        //     option_select =option_select+" AND INSTRUMENT_INDEX = '"+INSTRUMENT_INDEX+"'"
        // }if(PATH !==''){
        //     option_select =option_select+" AND PATH = "+PATH
        // }if(ROW !==''){
        //     option_select =option_select+" AND ROW = "+ROW
        // }
        option_select= option_select+props.searchArea
        console.log(option_select)
        
        props.get_searchTool_option(option_select,1)

    }

    const resetvalue=()=>{
        setStartDate('')
        setEndDate('')
        setmission('')
        setRevolution_Number('')
        setMODE('')
        setLEVEL('')
        // setINSTRUMENT_TYPE('')
        // setINSTRUMENT_INDEX('')
        // setPATH('')
        // setROW('')
        props.Clicktodelete()
        props.get_searchTool_option('',1)
    }

    return (
        <div style={{width:'400px',backgroundColor:'rgb(0, 0, 0, 0.61)',height: "92vh",overflow:'auto'}}>
            <div  style={{margin:'10px'}}>
            <FloatingLabel label="Date start" >
                <Form.Control size="sm" type="date" placeholder="Normal text" style={{marginTop:'10px',borderRadius:15}}
                    onChange={(e)=>setStartDate(e.target.value)} value={startDate}
                    />
            </FloatingLabel>
            <FloatingLabel  label="Date end">
                <Form.Control size="sm" type="date" placeholder="Normal text" style={{marginTop:'10px',borderRadius:15}}
                    onChange={(e)=>setEndDate(e.target.value)} value={endDate}
                    />
            </FloatingLabel>
                
                
                <Form.Select size="sm" aria-label="Default select example" style={{marginTop:'10px',borderRadius:50}} 
                onChange={(e)=>setmission(e.target.value)} value={mission} > 
                    <option value='' >Select mission</option>
                    <option value="THEOS">THEOS</option>
                    {/* <option value="COSMO">COSMO</option>
                    <option value="RADARSAT">RADARSAT</option> */}
                </Form.Select>
                <Form.Control size="sm" type="text" placeholder="REVOLUTION NUMBER" style={{marginTop:'10px',borderRadius:50}}
                   onChange={(e)=>setRevolution_Number(e.target.value)} value={revolution_Number}
                />
                {/* <Form.Select size="sm" aria-label="Default select example" style={{marginTop:'10px',borderRadius:50}} >
                    <option>Collection</option>
                    <option value="1">SENTINEL-1</option>
                    <option value="2">SENTINEL-2 Single tile</option>
                    
                </Form.Select> */}
                <Form.Select size="sm" aria-label="Default select example" style={{marginTop:'10px',borderRadius:50}} 
                    onChange={(e)=>setMODE(e.target.value)} value={MODE}>
                    <option value=''>MODE</option>
                    <option value="MS">MS</option>
                    <option value="PAN">PAN</option>
                    <option value="PSP">PSP</option>
                </Form.Select>
                <Form.Select size="sm" aria-label="Default select example" style={{marginTop:'10px',borderRadius:50}} 
                onChange={(e)=>setLEVEL(e.target.value)} value={LEVEL}>
                    <option value='' >Proscessing level</option>
                    <option value="1A">LEVEL1A</option>
                    <option value="2A">LEVEL2A</option>
                </Form.Select>
                
                
                <Button variant="success" size="sm" style={{marginTop:'10px',width:'100%',borderRadius:50}} onClick={show_option} >Search</Button>
                <Button variant="danger" size="sm"  style={{marginTop:'10px',width:'100%',borderRadius:50}} onClick={resetvalue}>Reset</Button>

            </div>
            


        </div>
      
    );
  }
  
  export default SearchTool;
  