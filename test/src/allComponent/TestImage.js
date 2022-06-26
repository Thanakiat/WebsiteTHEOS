import React, { useRef,useState,Component } from 'react';
import { connect } from 'react-redux';
import XMLParser from "react-xml-parser";
import { Icon } from '@iconify/react';
import {Button,Modal,Form,Image} from 'react-bootstrap';
import Axios from 'axios';

const TestImage=()=> {
  

  return (
    <div>
        <Image />
        
    </div>
    
  );
}

export default TestImage;