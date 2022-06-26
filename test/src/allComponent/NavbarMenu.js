import React, { Component,useState,useEffect } from 'react';
import {Navbar,Container,Nav,Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import Axios from 'axios';
import '../CSS/Navbar.css'
import {useNavigate } from "react-router-dom";
import { clear_user,clear_order,clear_customer_email } from '../action/Evnets';
import { IP_BACKEND } from '../config/Config';
const NavbarMenu =(props)=> {
    const navigate = useNavigate();
    useEffect(() => {
        var username ='-',firstname ='-',lastname ='-',email = '-'
        if(props.user.firstname !==''){
            firstname = props.user.firstname
        }
        if(props.user.lastname !==''){
            lastname = props.user.lastname
        }
        if(props.user.email !==''){
            email = props.user.email
        }
        if(props.user.username !==''){
            username = props.user.username
        }
        Axios.get(IP_BACKEND+'/userNavbar/'+username+'/'+firstname+'/'+lastname+'/'+email,{
        }).then((response)=>{
            if(response.data.length !== 1){
                props.clear_user()
                props.clear_order()
                props.clear_customer_email()
                navigate('/LOGIN', { replace: true })
            }
        })
    },[]);

    const Logout=()=>{
        props.clear_user()
        props.clear_order()
        props.clear_customer_email()
        navigate('/LOGIN', { replace: true })
    }

    return (
        <Navbar id="navbar">
            
            <Nav  >
                <Nav.Link href="/SELECTORDER" id="navigateSelect">SELECT ORDER</Nav.Link>
                <Nav.Link href="/CART" id="navigateSelect">CART</Nav.Link>
                <Nav.Link href="/HISTORY" id="navigateSelect">HISTORY</Nav.Link>
                
                
            </Nav>
            <div id='profilezone'>
                
                <div id ="profiletext" >
                    <h5 id="profiletext" >{props.user.username}</h5>
                    <h5 id="profiletext" >{props.user.email}</h5>
                </div>
                
                <Button id='buttonLogout' onClick={Logout}  >Log out</Button>
            </div>
            
        </Navbar>
    );
    
    
  }

  const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
  });
  const mapDispatchToProps = (dispatch) => ({
    clear_user: () => dispatch(clear_user()),
    clear_order: () => dispatch(clear_order()),
    clear_customer_email: () => dispatch(clear_customer_email())
  });
  export default connect(mapStateToProps,mapDispatchToProps)(NavbarMenu);

  