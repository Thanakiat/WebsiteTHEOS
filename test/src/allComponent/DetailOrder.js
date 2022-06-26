import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavbarMenu from './NavbarMenu';
import '../CSS/DetailOrder.css'
import {Button,Table,Form} from 'react-bootstrap';
import { Icon } from '@iconify/react';
import emailjs from '@emailjs/browser';
import  Axios  from 'axios';
import {clear_order,clear_customer_email,clear_customer_data} from '../action/Evnets';
import {useNavigate } from "react-router-dom";
import { IP_BACKEND,EMAIL_SERVICE_ID,EMAIL_TAMPLATE_ID,EMAIL_PUBLIC_KEY } from '../config/Config';

const DetailOrder=(props)=> {
  const navigate = useNavigate();
  const sendMail_and_FTP=()=>{
        console.log(props.cart)
        var allpathfile=[]
        props.cart.forEach((item,index) => {
            Axios.get(IP_BACKEND+'/get_SOURCE_PATH/'+item.IMAGE_ID+'/'+item.LEVEL).then((response)=>{
              allpathfile.push(response.data[0])
              console.log(allpathfile);
              console.log(index)
              if(index === props.cart.length-1){
                Axios.post(IP_BACKEND+'/ADD_IMAGE_IN_FTP_SERVER/',{
                  allfile:allpathfile,customername:props.customer.name
                }).then((response)=>{
                    console.log(response)
                    props.customer_email.forEach(email => {
                        var template_email = {
                          customer_id:props.customer.customer_id,
                          customer_email:email,
                          ftp_ip:props.customer.FTP,
                          customer_username:props.customer.username,
                          ucstomer_password:props.customer.password,
                          Employee_name:(props.user.firstname+' '+props.user.lastname)
                        }
                        console.log(template_email);
                        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TAMPLATE_ID, template_email, EMAIL_PUBLIC_KEY)
                          .then((result) => {
                              console.log(result.text);
                          }, (error) => {
                              console.log(error.text);
                          });
                    });
                })
              }
            })
        });
        
        var d = new Date();
        var hour = d.getHours(),minite = d.getMinutes(),second = d.getSeconds(),month = d.getMonth()+1,date = d.getDate();
        

        if(d.getMonth()+1 < 10){
          month = '0'+(d.getMonth()+1)
        }if(d.getDate() < 10){
          date  = '0'+ d.getDate()
        }if(d.getHours() < 10){
          hour  = '0'+d.getHours()
        }if(d.getMinutes() < 10){
          minite  = '0'+d.getMinutes()
        }if(d.getSeconds() < 10){
          second = '0'+d.getHours()
        }
        var History_Date= date+'-'+month+'-'+d.getFullYear()
        var History_Time= hour+':'+minite+':'+second
        var employee = props.user.firstname+' '+props.user.lastname
        var SUMMARY_IMAGE = props.cart.length
        var SUMMARY_EMAIL = props.customer_email.length
      


              Axios.post(IP_BACKEND+'/Add_history/',{
                History_Date:History_Date,
                History_Time:History_Time,
                employee:employee,
                SUMMARY_IMAGE:SUMMARY_IMAGE,
                SUMMARY_EMAIL:SUMMARY_EMAIL,
                customer:props.customer,
                cart:props.cart,
                allEmail:props.customer_email
              }).then((response)=>{
                  console.log(response)
                  props.clear_order()
                  props.clear_customer_email()
                  props.clear_customer_data()
                  
              })
      navigate('/SELECTORDER')  
  }
    


  return (
      
      <div>
          <NavbarMenu/>
          <h1>DetailOrder</h1>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'center',marginBottom:'20px'}}>
              <Button onClick={sendMail_and_FTP} style={{width:'25%',marginRight:'30px',borderRadius:'50px'}} variant='dark'>
                  Save and Send email
              </Button>
              <Button href='/SELECTCUSTOMER' style={{width:'25%',borderRadius:'50px'}} variant='dark'>
                  Edit order
              </Button>
          </div>
          
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
            
            <div id='orderzone'>
              {
                props.cart.map((order)=>{
                    return(
                      <div id='orderDetail' key={order.id}>
                        <h6>{order.id+"_"+order.MISSION+"_"+order.REVOLUTION_NUMBER+"_"+order.DATE+"_"+order.TIME}</h6>
                        
                        <div id='coldata' >
                          {/* <div id='imgstyle'>
                          </div> */}
                          <img src={order.PRODUCT_IMAGE} style={{width:'6vw',height:'6vw',marginRight:'10px'}} />
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
                    <Form.Control readOnly value={props.customer.name} placeholder='Customername'
                        style={{marginTop:'10px',borderRadius:50}}
                  
                     />
                    <Form.Control readOnly value={props.customer.email} placeholder='Email'
                        style={{marginTop:'10px',borderRadius:50}}
                   
                     />
                    <Form.Control readOnly value={props.customer.FTP} placeholder='FTP'
                        style={{marginTop:'10px',borderRadius:50}}
                   
                     />
                    <Form.Control readOnly value={props.customer.customer_description} placeholder='Description'
                        style={{marginTop:'10px',borderRadius:50}}
                      
                     />
                    <Form.Control readOnly value={props.customer.username} placeholder='Username'
                        style={{marginTop:'10px',borderRadius:50}}
                        
                     />
                    <Form.Control readOnly value={props.customer.password} placeholder='Password'
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
                          props.customer_email.map((email,index)=>{
                            return(
                              <tr key={index} >
                                <td>{index+1}</td>
                                <td>{email}</td>
                  
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
const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
    cart:state.Reducer.cart,
    customer_email:state.Reducer.customer_email,
    customer:state.Reducer.customer
});
const mapDispatchToProps = (dispatch) => ({
  clear_order: (item) => dispatch(clear_order(item)),
  clear_customer_email: () => dispatch(clear_customer_email()),
  clear_customer_data: () => dispatch(clear_customer_data()),
});




export default connect(mapStateToProps,mapDispatchToProps)(DetailOrder);