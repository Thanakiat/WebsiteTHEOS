import React, { Component } from 'react';

import { Icon } from '@iconify/react';
import {Button,Form,Modal} from 'react-bootstrap'
import NavbarMenu from './NavbarMenu';
import { connect } from 'react-redux';
import {delete_order,clear_order} from '../action/Evnets';
import '../CSS/Cart.css'
class Cart extends Component {
  constructor(props){
    super(props)
    
    this.state={
      modalCartDelete:false,
      iddelte:null,
      modalClear:false
    }
  }
  deleteorder=(data)=>{
    this.props.delete_order(data)
    this.setState({modalCartDelete:!this.state.modalCartDelete})
  }
  handleClose=()=>{
    this.setState({modalCartDelete:!this.state.modalCartDelete})
  }
  openModalDelete=(id)=>{
    this.setState({iddelte:id})
    this.setState({modalCartDelete:!this.state.modalCartDelete})
  }

  showModalToDelete=(id)=>{
    return(
      <Modal show={this.state.modalCartDelete} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you need to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>this.deleteorder(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  
  clearorder=()=>{
    this.props.clear_order()
    this.setState({modalClear:!this.state.modalClear})
  }
  
  openModalClear=()=>{
    this.setState({modalClear:!this.state.modalClear})
  }
  showModalToClear=()=>{
    return(
      <Modal show={this.state.modalClear} onHide={this.openModalClear}>
        <Modal.Header closeButton>
          <Modal.Title>Clear order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you need to clear order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.openModalClear}>
            No
          </Button>
          <Button variant="primary" onClick={()=>this.clearorder()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render(){
    return (
      
      <div>
        <NavbarMenu/>
          
        <h1>CART ORDER</h1>
        {this.showModalToDelete(this.state.iddelte)}
        {this.showModalToClear()}
        <div id='cartOrder'>
          {
              this.props.cart.map((data)=>{
                  return(
                      
                      <div id='bgselectcartorder' key = {data.id}>
                          
                           <h6 >{data.name}</h6>
                           <div id='coldata'>
                                <img src={data.PRODUCT_IMAGE} style={{width:'100px',height:'100px',marginRight:'10px'}} />
                                <div style={{flex:2}} >
                                        <h6>MISSION: {data.MISSION}</h6>
                                        <h6>Date: {data.DATE}</h6>
                                        <h6>Time: {data.TIME}</h6>
                                        <h6>Revolution: {data.REVOLUTION_NUMBER}</h6>
                                    
                                </div>
                                <div style={{flex:2}} >
                                        <h6>MODE: {data.MODE}</h6>
                                        <h6>LEVEL: {data.LEVEL}</h6>
                                        <h6>PATH: {data.PATH}</h6>
                                        <h6>ROW: {data.ROW}</h6>
                                </div>
                                <div style={{flex:2}} >
                                        <h6>CENTER_LAT: {data.CENTER_LAT}</h6>
                                        <h6>CENTER_LON: {data.CENTER_LON}</h6>
                                </div>

                                <div id='coladdcartbutton'>
                                    <Button id='deletebutton' onClick={()=>this.openModalDelete(data.id)}>
                                        <Icon icon="ant-design:delete-outlined" style={{width:'30px',height:'30px'}} />
                                    </Button>
                                </div>
                           </div>
                      </div>
                  )   
              })
          }
          
        </div>
        <div id='clearandnextZone'>
          
          <Button variant="danger" id='clearButton' onClick={this.openModalClear} >Clear</Button>
          <Button variant="success" id='nextbutton' href="/SELECTCUSTOMER" >Next</Button>
        </div>
        
      </div>
    );
  }
    
}

const mapStateToProps = (state) => ({ 
  cart:state.Reducer.cart,
});
const mapDispatchToProps = (dispatch) => ({
  
  delete_order: (item) => dispatch(delete_order(item)),
  clear_order:() => dispatch(clear_order())
});
export default connect(mapStateToProps,mapDispatchToProps)(Cart);
  