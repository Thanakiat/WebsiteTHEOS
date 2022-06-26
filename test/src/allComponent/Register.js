import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../CSS/Register.css'
import {Form,Button,Modal } from 'react-bootstrap';
import Axios from 'axios';
import validator from 'validator'
import { IP_BACKEND } from '../config/Config';

class Register extends Component {
    constructor(props){
        super(props)
        
        this.state={
            username:'',
            firstname:'',
            lastname:'',
            email:'',
            password:'',
            confirm_password:'',
            username_info:'',
            firstname_info:'',
            lastname_info:'',
            email_info:'',
            password_info:'',
            confirm_password_info:'',
            show_modal:false,
            title_modal:'',
            body_modal:''
        }
      }
    handleusername=(e)=>{
        this.setState({username:e.target.value})
    }
    handlefirstname=(e)=>{
        this.setState({firstname:e.target.value})
    }
    handlelastname=(e)=>{
        this.setState({lastname:e.target.value})
    }
    handleemail=(e)=>{
        this.setState({email:e.target.value})
    }
    
    handlepassword=(e)=>{
        this.setState({password:e.target.value})
    }
    handleconfirm_password=(e)=>{
        this.setState({confirm_password:e.target.value})
    }

    register=()=>{
        Axios.post(IP_BACKEND+'/create_user/',{
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            username : this.state.username,
            email : this.state.email,
            password : this.state.password,
        })
    }

    checkUser=()=>{
        if(this.state.username ==='' || this.state.firstname ==='' || this.state.lastname ===''||
            this.state.email === '' || this.state.password === '' || this.state.confirm_password ===''){
                this.setState({title_modal:'Warning'})
                this.setState({body_modal:'Incomplete information,Please complete the information.'})
                this.setState({show_modal:!this.state.show_modal})
                //console.log('Incomplete information,Please complete the information.')
        }else if(!validator.isEmail(this.state.email)){
            
            this.setState({title_modal:'Warning'})
            this.setState({body_modal:'This email Invalid format. '})
            this.setState({show_modal:!this.state.show_modal})
            
        }else if(this.state.password !== this.state.confirm_password){
            this.setState({title_modal:'Warning'})
            this.setState({body_modal:'Password not match,Please try again.'})
            this.setState({show_modal:!this.state.show_modal})
            //console.log('Password not match,Please try again.')
        }else{
            Axios.get(IP_BACKEND+'/checkuser/'+this.state.username+'/'+this.state.email).then((response)=>{
            //setuserLogin(response.data)
            console.log(response.data)
            if(response.data.length === 0){
                this.register()
                //this.setState({title_modal:'Success'})
                //this.setState({body_modal:'You can register.'})
                //this.setState({show_modal:!this.state.show_modal})
                //console.log('can register')
            }else{
                this.setState({title_modal:'Unsuccess'})
                this.setState({body_modal:'Username or email is a same user in this website.'})
                this.setState({show_modal:!this.state.show_modal})
                //console.log('can not register')
            }
            // response.data.map((data)=>{
            //     if(data.username === username && data.password_user === password){
            //         console.log('can login')
            //     }
            // })
        })
        }
        
    }
    handleModal=()=>{
        this.setState({show_modal:!this.state.show_modal})
    }
    showModalWarning=()=>{
        return(
            <Modal show={this.state.show_modal} onHide={this.handleModal}>
                <Modal.Header closeButton>
                <Modal.Title>{this.state.title_modal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.body_modal}</Modal.Body>
                <Modal.Footer>
                
                <Button variant="primary" onClick={this.handleModal}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    

    render(){
        return (
            
            <div id='bgRegister'>  
                <div id='bgFromRegister'>
                    <h1 id='registerhead'>Register</h1>
                    {this.showModalWarning()}
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Firstname {this.state.firstname_info}</Form.Label>
                            <Form.Control placeholder="Firstname" onChange={this.handlefirstname} id='Inputbox' />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Lastname {this.state.lastname_info}</Form.Label>
                            <Form.Control placeholder="Lastname" onChange={this.handlelastname} id='Inputbox' />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Username {this.state.username_info}</Form.Label>  
                            <Form.Control placeholder="Username" onChange={this.handleusername} id='Inputbox' />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Email {this.state.email_info}</Form.Label>
                            <Form.Control type="email" placeholder="Email" onChange={this.handleemail} id='Inputbox' />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Password {this.state.password_info}</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={this.handlepassword} id='Inputbox' />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Confirm password {this.state.confirm_password_info}</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" onChange={this.handleconfirm_password} id='Inputbox' />
                        </Form.Group>

                        
                        <div id='bgRegisandForget'>
                            <Button variant="dark" href="/"  id='RegisterandForgetbutton' >Cancel</Button>
                            <Button variant="dark" onClick={this.checkUser} href="/" id='RegisterandForgetbutton' >Register</Button>
                        </div>
                        
                    </Form>
                </div>

            </div>
          );
    }
    
  }
const mapStateToProps = (state) => ({ 
    
});
const mapDispatchToProps = (dispatch) => ({
    
});




export default connect(mapStateToProps,mapDispatchToProps)(Register);