import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button,Form,Modal,FormControl,InputGroup,ListGroup} from 'react-bootstrap'
class Modal_warning_textinput extends Component {
    constructor(props){
        super(props)
        
        this.state={
          
        }
      }

    

    render(){
        return (
            
            <Modal show={this.props.modal_checkInput} onHide={this.props.handleModal_warning}>
                <Modal.Header closeButton>
                <Modal.Title>Warnning</Modal.Title>
                </Modal.Header>
                    <Modal.Body>Incomplete information or Customer have in list</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleModal_warning}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
          );
    }
    
  }
const mapStateToProps = (state) => ({ 
    
});
const mapDispatchToProps = (dispatch) => ({
    
});




export default connect(mapStateToProps,mapDispatchToProps)(Modal_warning_textinput);