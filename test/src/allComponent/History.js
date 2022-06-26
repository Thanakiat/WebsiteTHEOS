import React, { useState,useEffect } from 'react';
import NavbarMenu from './NavbarMenu';
import {Table,Button,FormControl,FloatingLabel,Form} from 'react-bootstrap';
import  Axios  from 'axios';
import {useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { IP_BACKEND } from '../config/Config';
function History() {
    const navigate = useNavigate();
    const [page,setPage] = useState(1);
    const [showpage,setShowPage] = useState(1);
    const [allData,setAllData] = useState([]);
    const [startDate,setStartDate] = useState('');
    const [endDate,setEndDate] = useState('');
    const [exportData,setexportData] = useState([]);
    useEffect(() => {
        Axios.get(IP_BACKEND+'/getHistory/-',{
        }).then((response)=>{
            setAllData(response.data)
            console.log(response.data)
        })
        Axios.get(IP_BACKEND+'/getDataForExport/-',{
        }).then((response)=>{
            setexportData(response.data)
            console.log(response.data)
        })
    },[]);  

    const gotoDetailHistory=(data)=>{
      console.log(data)
      navigate('/HistoryDetail',{state:data} )
    }

  const add_page=()=>{
      setPage(parseInt(page) +1)
      setShowPage(parseInt(page)+1)
      // get_searchTool_option(searchoption,parseInt(page)+1)
  }
  const minus_page=()=>{
      if(parseInt(page) -1 >0){
          setPage(parseInt(page) -1)
          setShowPage(parseInt(page)-1)
          // get_searchTool_option(searchoption,parseInt(page)-1)
      }

  }
  const get_data_for_search=()=>{
    
    var option_select = '';
        var new_start_date = startDate.split('-')
        var format_start_date = new_start_date[2]+'-'+new_start_date[1]+'-'+new_start_date[0]
        var new_end_date = endDate.split('-')
        var format_end_date = new_end_date[2]+'-'+new_end_date[1]+'-'+new_end_date[0]
        if(startDate !==''){
            option_select = option_select+" AND Date >= '"+format_start_date+"'"
        }if(endDate !==''){
            option_select =option_select+" AND Date <= '"+format_end_date+"'"
        }
        console.log(option_select)
    Axios.get(IP_BACKEND+'/getHistory/'+option_select,{
        }).then((response)=>{
            setAllData(response.data)
            console.log(response.data)
        })
    Axios.get(IP_BACKEND+'/getDataForExport/'+option_select,{
      }).then((response)=>{
          setexportData(response.data)
          console.log(response.data)
      })
  }






    return (
      <div>
          <NavbarMenu/>
          <h1>History</h1>
          <div style={{display:'flex',flexDirection:'row',marginTop:'10px',alignItems:'center'}}>
            <FloatingLabel label="Date start" style={{marginLeft:'15px'}} >
                <Form.Control  type="date" placeholder="Normal text" style={{borderRadius:15}}
                    onChange={(e)=>setStartDate(e.target.value)} value={startDate}
                    />
            </FloatingLabel>
            <FloatingLabel  label="Date end" style={{marginLeft:'15px'}}>
                <Form.Control  type="date" placeholder="Normal text" style={{borderRadius:15}}
                    onChange={(e)=>setEndDate(e.target.value)} value={endDate}
                    />
            </FloatingLabel>
            <Button variant='dark' style={{borderRadius:'5px',marginLeft:'15px'}} onClick={get_data_for_search} >Search</Button>
            <CSVLink data={exportData} filename={"THEOS_REPORT.csv"} style={{marginLeft:'15px'}} >
              Export
            </CSVLink>
          </div>
          

          
          {/* <Button variant='dark' style={{borderRadius:'5px'}}   >Export excel</Button> */}
          <div style={{display:'flex',justifyContent:'center',margin:'15px'}}>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={minus_page}>{'<'}</Button>
                <FormControl style={{width:'20%',marginLeft:'15px',marginRight:'15px',borderRadius:'20px',textAlign:'center'}}
                 value={showpage} readOnly/>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={add_page} >{'>'}</Button>
            </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Employees</th>
                <th>Sumary images</th>
                <th>Sumary email</th>
              </tr>
            </thead>
            <tbody>
              {
                allData.slice(((page-1)*50),(page*50)).map((history,index)=>{
                  return(
                    <tr key = {index} onClick={()=>gotoDetailHistory(history)}>
                      <td>{history.ID_order}</td>
                      <td>{history.Date}</td>
                      <td>{history.Time}</td>
                      <td>{history.Employee}</td>
                      <td>{history.SUMMARY_IMAGE}</td>
                      <td>{history.SUMMARY_EMAIL}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
          <div style={{display:'flex',justifyContent:'center',margin:'15px'}}>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={minus_page}>{'<'}</Button>
                <FormControl style={{width:'20%',marginLeft:'15px',marginRight:'15px',borderRadius:'20px',textAlign:'center'}}
                 value={showpage} readOnly/>
                <Button variant='dark' style={{borderRadius:'20px'}} onClick={add_page} >{'>'}</Button>
            </div>
      </div>
      
      
    );
  }
  
  export default History;
  