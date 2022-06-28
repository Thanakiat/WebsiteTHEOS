import React, { Component,useState,useEffect } from 'react';
import {Navbar,Container,Nav,Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import Axios from 'axios';
import '../CSS/Navbar.css'

import {useNavigate } from "react-router-dom";

const NavbarMenu =(props)=> {
    const navigate = useNavigate();
    useEffect(() => {
        if(props.user.username !== '' && props.user.email !== '' && props.user.firstname !== '' && props.user.lastname !== '' ){
            navigate('/SELECTORDER', { replace: true })
        }else{
            navigate('/LOGIN', { replace: true })
        }
    },[]);



    return (
        <>
        </>
    );
    
    
  }

  const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
  });
  const mapDispatchToProps = (dispatch) => ({
    
  });
  export default connect(mapStateToProps,mapDispatchToProps)(NavbarMenu);

  