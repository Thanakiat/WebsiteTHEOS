import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavbarMenu from './NavbarMenu';
import '../CSS/SelectCustomer.css'
import {Button,Form,Modal,FormControl,InputGroup,ListGroup, Table} from 'react-bootstrap'
import { Icon } from '@iconify/react';
import {delete_customer_email,clear_customer_email} from '../action/Evnets';
import SearchCustomer from './SearchCustomer'

class SelectCustomer extends Component {
    constructor(props){
        super(props)
        
        this.state={
          modal_delete_customer:false,
          delete_id_customer:null,
          allEmail:[],
          modal_show_img:false,
          add_email:''
        }
      }

    openmodal_deleteCustomer=(id)=>{
      this.setState({modal_delete_customer:!this.state.modal_delete_customer})
      this.setState({delete_id_customer:id})
    }

    handlemodal_deleteCustomer=()=>{
      this.setState({modal_delete_customer:!this.state.modal_delete_customer})
      //this.setState({delete_id_customer:id})
    }
    
    delete_customer=()=>{
      //console.log(this.state.delete_id_customer)
      this.props.delete_customer_select(this.state.delete_id_customer)
      this.setState({modal_delete_customer:!this.state.modal_delete_customer})
    }


    
    
    Modal_deleteCustomer=()=>{
      return(
        <Modal show={this.state.modal_delete_customer} onHide={this.handlemodal_deleteCustomer}>
          <Modal.Header closeButton>
            <Modal.Title>Warnning</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you need take customer out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handlemodal_deleteCustomer}>
              No
            </Button>
            <Button variant="primary" onClick={()=>this.delete_customer()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }
    handlemodal_add_email=()=>{
      this.setState({modal_show_img:!this.state.modal_show_img})
    }


    add_email=()=>{
      const index = this.state.allEmail.findIndex(email => email === this.state.add_email)
      if(index === -1){
        this.setState(prevState => ({
          allEmail: [...prevState.allEmail, this.state.add_email]
        }))
      }
      
     
      this.setState({add_email:''})
      this.handlemodal_add_email()
    }

    delete_email=(email)=>{
      let index = this.state.allEmail.indexOf(email)
      if (index !== -1) {
        this.state.allEmail.splice(index, 1);
         this.setState(this.state.allEmail);
      }
    }

    Modal_Add_email=()=>{
      
      return(
        <Modal show={this.state.modal_show_img} onHide={this.handlemodal_add_email}>
          <Modal.Header closeButton>
            <Modal.Title>Add Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Control type="email" placeholder="Email" onChange={(e)=>{this.setState({add_email:e.target.value})}}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handlemodal_add_email}>
              No
            </Button>
            <Button variant="primary" onClick={()=>this.add_email()}>
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
                {this.Modal_deleteCustomer()}
                {this.Modal_Add_email()}
                <h1>Select customer</h1>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                  <div id='orderDetailzone'>
                    {
                      this.props.cart.map((order)=>{
                          return(
                            <div id='orderDetail' key={order.id}>
                              <h6>{order.id+"_"+order.MISSION+"_"+order.REVOLUTION_NUMBER+"_"+order.DATE+"_"+order.TIME}</h6>
                              
                              <div id='coldata' >
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
                  <SearchCustomer allemail={this.state.allEmail} />
                  <div id='customerDetailzone'>
                    <Table style ={{backgroundColor:'#ffffff'}}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th style={{width:"70%"}}>Email</th>
                            <th><Button onClick={()=>this.handlemodal_add_email()}>add</Button></th>
                          </tr>
                        </thead>
                        <tbody style={{}}>
                          {
                            this.state.allEmail.map((email,index)=>{
                              return(
                                <tr key={index} >
                                  <td>{index+1}</td>
                                  <td>{email}</td>
                                  <td><Button onClick={()=>{this.delete_email(email)}}>Del</Button></td>
                                </tr>
                              )
                              
                            })
                          }
                          
                          
                        </tbody>
                    </Table>
                    {/*
                      this.props.customer_select.map((customer)=>{
                          return(
                            <div id='orderDetail' key={customer.id}>
                              
                              <div style={{display:'flex',justifyContent:'space-between'}}>
                                <h6>Customer: {customer.name} </h6>
                                <Button id='popcustomerButton' variant='dark' onClick={()=>{this.openmodal_deleteCustomer(customer.id)}}>
                                  <Icon icon="ant-design:close-outlined" />
                                </Button>
                              </div>
                              
                              <div id='coldata' >
                                  <div style={{marginRight:'10px'}}>
                                    {/* <h6 id='datatext'>ID: {customer.id} </h6> }
                                    <h6 id='datatext'>E-mail: {customer.email} </h6>
                                    <h6 id='datatext'>FTP: {customer.FTP} </h6>
                                  </div>
                                  <div>
                                    <h6 id='datatext'>Username: {customer.username} </h6>
                                    <h6 id='datatext'>Password: {customer.password} </h6>
                                  </div>
                              </div>
                              
                              
                            </div>
                          )
                      })
                    */}
                  </div>
                </div>
                
            </div>
          );
    }
    
  }
const mapStateToProps = (state) => ({ 
    
    cart:state.Reducer.cart,
    customer_select:state.Reducer.customer_select,
});
const mapDispatchToProps = (dispatch) => ({
    delete_customer_email: (item) => dispatch(delete_customer_email(item)),
    clear_customer_email:() => dispatch(clear_customer_email())
});




export default connect(mapStateToProps,mapDispatchToProps)(SelectCustomer);