import React, { useState } from 'react';
import { connect } from 'react-redux';
import {Button,Form,Modal,InputGroup,ListGroup} from 'react-bootstrap'
import { Icon } from '@iconify/react';
import '../CSS/SelectCustomer.css';
import {add_customer_email,set_customer_data} from '../action/Evnets';
import Modal_warning_textinput from './Modal_warning_textinput';
import  Axios  from 'axios';
import {useNavigate } from "react-router-dom";
import { IP_BACKEND } from '../config/Config';

const SearchCustomer =(props)=>{
   
    const [customerListheight,setCustomerListheight] = useState('0px');
    const [customer_id,setCustomer_id] = useState('');
    const [customer_name,setCustomer_name] = useState('');
    const [customer_email,setCustomer_email] = useState('');
    const [customer_FTP,setCustomer_FTP] = useState('127.0.0.1');
    const [customer_username,setCustomer_username] = useState('');
    const [customer_password,setCustomer_password] = useState('');
    const [customer_description,setCustomer_description] = useState('');
    const [status_search,setStatus_search] = useState(true);
    const [modal_checkInput,setModal_checkInput] = useState(false);
    const [all_customer,setAll_customer] = useState(null);
    const [search_customer,setSearch_customer] = useState('');
    const [confirm_add_customer,setConfirm_add_customer] = useState(false);
    const [show_search_customer,setShow_search_customer] = useState('flex');
    const [show_add_button_customer,setShow_add_button_customer] = useState('none');
    const navigate = useNavigate();
      

    const choiceCustomer=(customer)=>{
        //console.log(customer)
        setCustomerListheight('0px')
        setCustomer_id(customer.ID)
        setCustomer_name(customer.NAME)
        setCustomer_email(customer.EMAIL)
        // setCustomer_FTP(customer.FTP)

        setCustomer_username(customer.USERNAME)
        setCustomer_password(customer.PASSWORD)
        setCustomer_description(customer.DESCRIPTION)
        setSearch_customer('')

    }
    const ReturnIcon=()=>{
        if(customerListheight === '0px'){
          return(
            <Icon icon="ant-design:search-outlined" style={{width:'20px',height:'100%',display:'flex',}} />
          )
        }else{
          return(
            <Icon icon="ant-design:close-outlined" style={{width:'20px',height:'100%',display:'flex'}} /> 
          )
            
        }
      }
    const handlesearch=()=>{
        var customer_search = '';
        if(search_customer === ''){
            customer_search = '-'
        }else{
            customer_search = search_customer
        }

        if(customerListheight === '0px'){
            Axios.get(IP_BACKEND+'/getcustomer/'+customer_search).then((res)=>{

                setAll_customer(res.data)
                setCustomerListheight('150px')
            })
        }else{
            setAll_customer(null)
            setCustomerListheight('0px')
            
        }
    
    }

    const Searchhandle=()=>{
        setCustomer_id('')
        setCustomer_name('')
        setCustomer_email('')
        // setCustomer_FTP('')
        setCustomerListheight('0px')
        setCustomer_username('')
        setCustomer_password('')
        setCustomer_description('')
        setSearch_customer('')
        setStatus_search(!status_search)
        if(show_search_customer === 'flex'){
            setShow_search_customer('none')
            setShow_add_button_customer('flex')
        }else if(show_search_customer === 'none'){
            setShow_search_customer('flex')
            setShow_add_button_customer('none')
        }
    }

    const handleModal_warning=()=>{
        setModal_checkInput(!modal_checkInput)
    }

    const CustomerSelect_component=()=>{
        if(all_customer !== null){
            return(
                <ListGroup  style={{height:customerListheight,width:'23vw',overflow:'auto',position:'absolute',}}  >
                    {
                        all_customer.map((customer)=>{
                            return(
                                <ListGroup.Item action onClick={()=>choiceCustomer(customer)} key={customer.ID}>
                                <h6>Name: {customer.NAME}</h6>
                                <h6>email: {customer.EMAIL}</h6>
                                <h6>Username: {customer.USERNAME}</h6>
                                </ListGroup.Item>
                            )
                            })
                    }
                </ListGroup>
            )
        }
    }

    const confirm_Insert_customer=()=>{
       var this_customer ={
            name:customer_name,
            email:customer_email,
            FTP:customer_FTP,
            username:customer_username,
            password:customer_password,
            customer_description:customer_description,
        }
        Axios.post(IP_BACKEND+'create_customer/',{
            this_customer:this_customer
        }).then((response)=>{
            setConfirm_add_customer(!confirm_add_customer)
            setCustomer_id('')
            setCustomer_name('')
            setCustomer_email('')
            setCustomer_username('')
            setCustomer_password('')
            setCustomer_description('')
            setSearch_customer('')
            console.log(response)
        })
    }

    const Modal_confirm_add_customer=()=>{
        return(
            <Modal show={confirm_add_customer} onHide={()=>{setConfirm_add_customer(!confirm_add_customer)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail FTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Name: {customer_name}</h5>
                    <h5>Email: {customer_email}</h5>
                    <h5>Description: {customer_description}</h5>
                    <h5>FTP: {customer_FTP}</h5>
                    <h5>Username: {customer_username}</h5>
                    <h5>password: {customer_password}</h5>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setConfirm_add_customer(!confirm_add_customer)}}>
                    Close
                </Button>
                <Button variant="primary" onClick={confirm_Insert_customer}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const goto_Detail_order=()=>{
        if(customer_name ==='' || customer_email ==='' ||
        customer_FTP ==='' ||
        customer_username ==='' || customer_password ==='' ||
        customer_description ==='' || props.allemail.length ===0){
            setModal_checkInput(!modal_checkInput)
        }
        else{
            var this_customer ={
                customer_id:customer_id,
                name:customer_name,
                email:customer_email,
                FTP:customer_FTP,
                username:customer_username,
                password:customer_password,
                customer_description:customer_description,
            }
            props.set_customer_data(this_customer)
            props.add_customer_email(props.allemail)
            navigate('/DETAILORDER')
        }
            
        
    }

    const addNew_Customer=()=>{
        setConfirm_add_customer(!confirm_add_customer)
    }

        return (
            <div id='searchcustomerzonex'>
                < Modal_warning_textinput modal_checkInput={modal_checkInput} 
                    handleModal_warning={handleModal_warning} 
                />
                <Modal_confirm_add_customer/>
                <Form.Check type="checkbox" label="New FTP"  onChange={Searchhandle} />
                
                <div>
                    <InputGroup style={{marginTop:'10px',display:show_search_customer}} >
                        <Form.Control
                            placeholder="Customername"
                            id='inputsearchcustomer'
                            onChange={(e)=>setSearch_customer(e.target.value)} 
                            value = {search_customer}

                        />
                        <Button variant="dark" id='searchbuttoncustomer' onClick={handlesearch}>
                            <ReturnIcon/>
                        </Button>
                    </InputGroup>
                    
                    <CustomerSelect_component/>

                    <Form.Control readOnly={status_search} value={customer_name} placeholder='Customername'
                        style={{marginTop:'10px',borderRadius:50}}
                        onChange={(e)=>setCustomer_name(e.target.value)} 
                     />
                    <Form.Control readOnly={status_search} value={customer_email} placeholder='Email'
                        style={{marginTop:'10px',borderRadius:50}}
                        onChange={(e)=>setCustomer_email(e.target.value)} 
                     />
                    <Form.Control readOnly value={customer_FTP} placeholder='FTP'
                        style={{marginTop:'10px',borderRadius:50}}
                        // onChange={(e)=>setCustomer_FTP(e.target.value)} 
                     />
                    <Form.Control readOnly={status_search} value={customer_description} placeholder='Description'
                        style={{marginTop:'10px',borderRadius:50}}
                        onChange={(e)=>setCustomer_description(e.target.value)} 
                     />
                    <Form.Control readOnly={status_search} value={customer_username} placeholder='Username'
                        style={{marginTop:'10px',borderRadius:50}}
                        onChange={(e)=>setCustomer_username(e.target.value)} 
                     />
                    <Form.Control readOnly={status_search} value={customer_password} placeholder='Password'
                        style={{marginTop:'10px',borderRadius:50}}
                        onChange={(e)=>setCustomer_password(e.target.value)} 
                     />
                </div>

                <Button style={{display:show_add_button_customer,justifyContent:'center'}} variant="dark" id='addcustomerButton'
                onClick={()=>addNew_Customer()}  >
                    Add customer
                </Button>
                <Button variant="success" id='addcustomerButton' onClick={goto_Detail_order} >
                    Next
                </Button>
                <Button variant="danger" id='addcustomerButton' >
                    Cancel
                </Button>
            </div>
        );
    
    
  }
const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
    customer_select:state.Reducer.customer_select,
});
const mapDispatchToProps = (dispatch) => ({
    add_customer_email: (item) => dispatch(add_customer_email(item)),
    set_customer_data : (item) => dispatch(set_customer_data(item)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SearchCustomer);