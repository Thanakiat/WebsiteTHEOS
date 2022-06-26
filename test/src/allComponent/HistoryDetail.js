import React, { useState,useEffect } from 'react';
import NavbarMenu from './NavbarMenu';
import {Table,Form} from 'react-bootstrap';
import  Axios  from 'axios';
import {useLocation} from 'react-router-dom';
import { IP_BACKEND } from '../config/Config';
function HistoryDetail(props,{ route, navigation }) {
    const [allImage,setAllImage] = useState([]);
    const [Customer,setAllCustomer] = useState([0]);
    const [allEmail,setAllEmail]= useState([]);
    const location = useLocation();
    useEffect(() => {
        Axios.get(IP_BACKEND+'/getDetailHistoryCustomer/'+location.state.ID_order,{
        }).then((response)=>{
            setAllCustomer(response.data[0])
            //console.log(response.data)
        })
        Axios.get(IP_BACKEND+'/getDetailHistoryImage/'+location.state.ID_order,{
        }).then((response)=>{
            setAllImage(response.data)
            //console.log(response.data)
        })
        Axios.get(IP_BACKEND+'/getAllEmail/'+location.state.ID_order,{
        }).then((response)=>{
            setAllEmail(response.data)
            console.log(response.data)
        })
        //console.log(location.state)
    },[]);  

    

    return (
      <div>
          <NavbarMenu/>
          <h1>History</h1>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
            
            <div id='orderzone'>
              {
                allImage.map((order,index)=>{
                    return(
                      <div id='order' key={index}>
                        <h6>{order.id+"_"+order.MISSION+"_"+order.REVOLUTION_NUMBER+"_"+order.DATE+"_"+order.TIME}</h6>
                        
                        <div id='coldata' >
                            <img src={order.IMAGE_PATH} style={{width:'6vw',height:'6vw',marginRight:'10px'}} />
                          <div style={{marginRight:'10px'}}>
                              <h6 id='datatext'>MISSION: {order.MISSION}</h6>
                              <h6 id='datatext'>Date: {order.DATE}</h6>
                              <h6 id='datatext'>Time: {order.TIME}</h6>
                              <h6 id='datatext'>Revolution: {order.REVOLUTION_NUMBER}</h6>
                          </div>
                          <div>
                              <h6 id='datatext'>INSTRUMENT_TYPE: {order.INSTRUMENT_TYPE}</h6>
                              <h6 id='datatext'>INSTRUMENT_INDEX: {order.INSTRUMENT_INDEX}</h6>
                              <h6 id='datatext'>ROW: {order.ROW}</h6>
                              <h6 id='datatext'>PATH: {order.PATH}</h6>
                          </div>
                        </div>
                      </div>
                    )
                })
              }
            </div>
            <div id='searchcustomerzonex'>
                <div>
                    <Form.Control readOnly value={Customer.Name} placeholder='Customername'
                        style={{marginTop:'10px',borderRadius:50}}
                  
                     />
                    <Form.Control readOnly value={Customer.Email} placeholder='Email'
                        style={{marginTop:'10px',borderRadius:50}}
                   
                     />
                    <Form.Control readOnly value={Customer.FTP} placeholder='FTP'
                        style={{marginTop:'10px',borderRadius:50}}
                   
                     />
                    <Form.Control readOnly value={Customer.Username} placeholder='Username'
                        style={{marginTop:'10px',borderRadius:50}}
                        
                     />
                    <Form.Control readOnly value={Customer.Password} placeholder='Password'
                        style={{marginTop:'10px',borderRadius:50}}
                       
                     />
                </div>
            </div>
            <div id='customerzone'>
                  <Table style ={{backgroundColor:'#ffffff'}}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th style={{width:"70%"}}>Email</th>
                          
                        </tr>
                      </thead>
                      <tbody style={{}}>
                        {
                          allEmail.map((email,index)=>{
                            return(
                              <tr key={index} >
                                <td>{index+1}</td>
                                <td>{email.email}</td>
                  
                              </tr>
                            )
                            
                          })
                        }
                      </tbody>
                  </Table>
            </div>
          </div>
      </div>
      
      
    );
  }
  
  export default HistoryDetail;
  