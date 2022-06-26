import React, { useState } from 'react';

import {Form,Button,Modal } from 'react-bootstrap';

import { connect } from 'react-redux';
import {login} from '../action/Evnets';

import '../CSS/Login.css'

import {useNavigate } from "react-router-dom";
import  Axios  from 'axios';
import { IP_BACKEND } from '../config/Config';
const Login=(props)=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modal_login, setModal_login] = useState(false);
    const navigate = useNavigate();
    const handleusername=(e)=>{
        //this.setState({username:e.target.value})
        setUsername(e.target.value)
    }
    const handlepassword=(e)=>{
        //this.setState({password:e.target.value})
        setPassword(e.target.value)
    }
    const gotoSelectImage=()=>{
        //console.log(username)
        if(username === '' || password === ''){
            handle_modalLogin()
        }else{
            Axios.get(IP_BACKEND+'/user/'+username+'/'+password).then((response)=>{

                
                if(response.data.length ===0){
                    handle_modalLogin()
                }else{
                    response.data.map((data)=>{
                        if(data.username === username && data.password_user === password){
                            const user = {
                                username:data.username,
                                email:data.email,
                                firstname:data.first_name,
                                lastname:data.last_name
                            }
                            props.setuser(user)
                            //console.log('can login')
                            if(data.status_user === 'admin'){
                                navigate('/EMPLOYEEMANAGE', { replace: true })
                            }else{
                                navigate('/SELECTORDER', { replace: true })
                            }
                        }
                    })
                }
                
            })
        }
        
    }
    const handle_modalLogin=()=>{
        setModal_login(!modal_login)
    }

    const Modal_Login=()=>{
        return(
            <Modal show={modal_login} onHide={handle_modalLogin}>
                <Modal.Header closeButton>
                <Modal.Title>Someting is wrong</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please try again.</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handle_modalLogin}>
                    Close
                </Button>
                
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div id='bgLogin'>
            <div id='bgFromLogin'>
                <Modal_Login/>
                <h2 style={{textAlign:'center'}}>Login</h2>
                <Form>
                    <Form.Group className="mb-3" >
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="Username" onChange={handleusername} id='Inputusernamebox' />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handlepassword} id='Inputpasswordbox' />
                    </Form.Group>
                    <Button variant="dark" onClick={gotoSelectImage} id='loginButton' >Login</Button>
                    <div id='bgRegisandForget'>
                        <Button variant="dark" href="/REGISTER"  id='RegisterandForgetbutton' >Register</Button>
                        {/* <Button variant="dark"   id='RegisterandForgetbutton' >Forget password</Button> */}
                    </div>
                    
                </Form>
            </div>
                
                
        </div>
    );
}
const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
});
const mapDispatchToProps = (dispatch) => ({
    setuser: (item) => dispatch(login(item))

});




export default connect(mapStateToProps,mapDispatchToProps)(Login);

  