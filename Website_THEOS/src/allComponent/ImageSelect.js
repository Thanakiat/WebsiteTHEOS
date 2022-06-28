import React, { Component } from 'react';
import {
  TileLayer,
  Map
} from "react-leaflet";
import '../CSS/ImageSelectCSS.css'
import { Icon } from '@iconify/react';
import { connect } from 'react-redux';
import {add_cart} from '../action/Evnets';
import {Form,Button,Modal,Row,Col,Table } from 'react-bootstrap';
import  Axios  from 'axios';
import '../CSS/Modal.css'
import { IP_BACKEND } from '../config/Config';
import ImageOverlayRotated from './ImageOverlayRotated';
class ImageSelect extends Component {
    constructor(props){
        super(props)
        
        this.state={
          modaladdcard:false,
          modal_data:false,
          modal_image:false,
          modal_cart:false,
          itemaddcart:null,
          imageData:null,
          alldata:[],
          modeimage_modal:'',
          option:''
        }
      }

    handleClose=()=>{
        this.setState({modaladdcard:!this.state.modaladdcard})
    }

    openModal=(item)=>{

      var image_cart_item ={
        ID :item.ID,
        CENTER_LAT: item.CENTER_LAT,
        CENTER_LON: item.CENTER_LON,
        DATE: item.DATE,
        INSTRUMENT_INDEX: item.INSTRUMENT_INDEX,
        INSTRUMENT_TYPE: item.INSTRUMENT_TYPE,
        MISSION: item.MISSION,
        MODE: item.MODE,
        NE_LAT: item.NE_LAT,
        NE_LON: item.NE_LON,
        NW_LAT: item.NW_LAT,
        NW_LON: item.NW_LON,
        PATH: item.PATH,
        REVOLUTION_NUMBER: item.REVOLUTION_NUMBER,
        ROW: item.ROW,
        SE_LAT: item.SE_LAT,
        SE_LON: item.SE_LON,
        SUN_AZIMUTH: item.SUN_AZIMUTH,
        SUN_ELEVATION: item.SUN_ELEVATION,
        SW_LAT: item.SW_LAT,
        SW_LON:item.SW_LON,
        TIME: item.TIME
      }
      if(this.state.modeimage_modal === 'PAN1A'){
        image_cart_item.LEVEL = 'PAN1A'
        image_cart_item.IMAGE_ID = item.PAN1A_ID
        image_cart_item.PRODUCT_IMAGE = item.PAN1AIMAGE
      }else if(this.state.modeimage_modal === 'PAN2A'){
        image_cart_item.LEVEL = 'PAN2A'
        image_cart_item.IMAGE_ID = item.PAN2A_ID
        image_cart_item.PRODUCT_IMAGE = item.PAN2AIMAGE
      }else if(this.state.modeimage_modal === 'MS1A'){
        image_cart_item.LEVEL = 'MS1A'
        image_cart_item.IMAGE_ID = item.MS1A_ID
        image_cart_item.PRODUCT_IMAGE = item.MS1AIMAGE
      }else if(this.state.modeimage_modal === 'MS2A'){
        image_cart_item.LEVEL = 'MS2A'
        image_cart_item.IMAGE_ID = item.MS2A_ID
        image_cart_item.PRODUCT_IMAGE = item.MS2AIMAGE
      }
      if(image_cart_item.IMAGE_ID === null || image_cart_item.IMAGE_ID === 0){
        this.setState({modal_image:!this.state.modal_image})
      }else{
        this.setState({itemaddcart:image_cart_item})
        this.setState({modaladdcard:!this.state.modaladdcard})
      }
      }
      warnning_image=()=>{
        return(
          <Modal show={this.state.modal_image} onHide={()=>this.setState({modal_image:!this.state.modal_image})}>
            <Modal.Header closeButton>
              <Modal.Title>Can not add to cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>This image not have in database,Plaese add image to database.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>this.setState({modal_image:!this.state.modal_image})}>
                Close
              </Button>

            </Modal.Footer>
          </Modal>
        )
    }
    warnning_addcart=()=>{
      return(
        <Modal show={this.state.modal_cart} onHide={()=>this.setState({modal_cart:!this.state.modal_cart})}>
          <Modal.Header closeButton>
            <Modal.Title>Can not add to cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>This image has in cart.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>this.setState({modal_cart:!this.state.modal_cart})}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      )
  }

    showModalToAdd=(item)=>{
        return(
          <Modal show={this.state.modaladdcard} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add order</Modal.Title>
            </Modal.Header>
            <Modal.Body>DO you need to add this order?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={()=>{this.addToCart(item);
                  this.handleCloseData()
                }}
              >
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        )
    }
    addToCart=(item)=>{
        const index_item_cart = this.props.cart.findIndex(cart_item=>cart_item.id === item.ID && cart_item.LEVEL === item.LEVEL )
        console.log(index_item_cart);
        if(index_item_cart === -1){
          this.props.add_cart(item)
        }else{
          this.setState({modal_cart:!this.state.modal_cart})
        }
        
        console.log(this.props.cart)
        this.setState({modaladdcard:!this.state.modaladdcard})
    }


    openModalImageData=(data)=>{
      this.setState({modeimage_modal:(data.MODE+'1A')})
      this.setState({imageData:data})
      this.setState({modal_data:!this.state.modal_data})
    }


    handleCloseData=()=>{
        this.setState({modal_data:!this.state.modal_data})
    }

    showImage=()=>{
      if(this.state.modeimage_modal === 'MS1A' && this.state.imageData.MS1AIMAGE !== null){
        return(
              <img style={{marginTop:'10px'}}
                src={this.state.imageData.MS1AIMAGE}
                alt="new"
              />
        )
      }else if(this.state.modeimage_modal === 'MS2A'  && this.state.imageData.MS2AIMAGE !== null){
        return(
              <img style={{marginTop:'10px'}}
                src={this.state.imageData.MS2AIMAGE}
                alt="new"
              />
        )
      }else if(this.state.modeimage_modal === 'PAN1A'  && this.state.imageData.PAN1AIMAGE !== null){
        return(
              <img style={{marginTop:'10px'}}
                src={this.state.imageData.PAN1AIMAGE}
                alt="new"
              />
        )
      }else if(this.state.modeimage_modal === 'PAN2A'  && this.state.imageData.PAN2AIMAGE !== null){
        return(
              <img style={{marginTop:'10px'}}
                src={this.state.imageData.PAN2AIMAGE}
                alt="new"
              />
        )
      }else{
        return(
            <img style={{marginTop:'10px'}}
              src={IP_BACKEND+'/NoImage/No_image.png'}
              alt="new"
            />
          )
      }
    }

    showData_image=()=>{
      
      if(this.state.imageData !== null){
        var centerLat,centerLon;
        if(this.state.imageData.CENTER_LAT.slice(0,1) === 'N'){
          centerLat = (parseInt(this.state.imageData.CENTER_LAT.slice(1, 4))+(parseInt(this.state.imageData.CENTER_LAT.slice(4, 6))/60)+(parseInt(this.state.imageData.CENTER_LAT.slice(6))/3600)).toFixed(3)
        }else if(this.state.imageData.CENTER_LAT.slice(0,1) === 'S'){
          centerLat = ((-1)*(parseInt(this.state.imageData.CENTER_LAT.slice(1, 4))+(parseInt(this.state.imageData.CENTER_LAT.slice(4, 6))/60)+(parseInt(this.state.imageData.CENTER_LAT.slice(6))/3600))).toFixed(3)
        }

        if(this.state.imageData.CENTER_LON.slice(0,1) === 'E'){
          centerLon = (parseInt(this.state.imageData.CENTER_LON.slice(1, 4))+(parseInt(this.state.imageData.CENTER_LON.slice(4, 6))/60)+(parseInt(this.state.imageData.CENTER_LON.slice(6))/3600)).toFixed(3)
        }else if(this.state.imageData.CENTER_LON.slice(0,1) === 'W'){
          centerLon = ((-1)*(parseInt(this.state.imageData.CENTER_LON.slice(1, 4))+(parseInt(this.state.imageData.CENTER_LON.slice(4, 6))/60)+(parseInt(this.state.imageData.CENTER_LON.slice(6))/3600))).toFixed(3)
        }
        return(
          <Modal show={this.state.modal_data} onHide={this.handleCloseData} dialogClassName="my-modal"  >
            <Modal.Header closeButton>
              <Modal.Title>{'Index: '+this.state.imageData.ID}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
              <Row>
                  <Col>

                    <Map
                          center={[centerLat, centerLon]}
                          zoom={8}
                          style={{ height: "70vh",width:'35vw' }}
                      >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        
                        <ImageOverlayRotated data={this.state.imageData} />

                    </Map>


                  </Col>
                  <Col>
                      <h6>MISSION: {this.state.imageData.MISSION}</h6>
                      <h6>Date: {this.state.imageData.DATE}</h6>
                      <h6>Time: {this.state.imageData.TIME}</h6>
                      <h6>Revolution: {this.state.imageData.REVOLUTION_NUMBER}</h6>
                      <h6>INSTRUMENT_TYPE: {this.state.imageData.INSTRUMENT_TYPE}</h6>
                      <h6>INSTRUMENT_INDEX: {this.state.imageData.INSTRUMENT_INDEX}</h6>
                      <h6>MODE: {this.state.imageData.MODE}</h6>
                      <h6>ROW: {this.state.imageData.ROW}</h6>
                      <h6>PATH: {this.state.imageData.PATH}</h6>
                      <h6>SUN_ELEVATION: {this.state.imageData.SUN_ELEVATION}</h6>
                      <h6>SUN_AZIMUTH: {this.state.imageData.SUN_AZIMUTH}</h6>
                      <h6>CENTER_LAT: {this.state.imageData.CENTER_LAT}</h6>
                      <h6>CENTER_LON: {this.state.imageData.CENTER_LON}</h6>
                      <h6>NE:  Latitude {this.state.imageData.NE_LAT} Longitude {this.state.imageData.NE_LON}</h6>
                      <h6>NW:  Latitude {this.state.imageData.NW_LAT} Longitude {this.state.imageData.NW_LON}</h6>
                      <h6>SE:  Latitude {this.state.imageData.SE_LAT} Longitude {this.state.imageData.SE_LON}</h6>
                      <h6>SW:  Latitude {this.state.imageData.SW_LAT} Longitude {this.state.imageData.SW_LON}</h6> 
                  </Col>
                  <Col style={{height:'70vh',overflow: 'auto'}}>
                    <Row>
                      <Form.Select onChange={(e)=>{this.setState({modeimage_modal:e.target.value})}}  >

                          <option value={this.state.imageData.MODE+"1A"}>{this.state.imageData.MODE}1A</option>
                          <option value={this.state.imageData.MODE+"2A"}>{this.state.imageData.MODE}2A</option>
                      </Form.Select>  
                    </Row>
                    <Row >
                        {this.showImage()}
                    </Row>
                  </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={()=>this.openModal(this.state.imageData)}>Add to cart</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      
  }

    render(){
        return (
            <div >
                {this.showModalToAdd(this.state.itemaddcart)}
                {this.showData_image()}
                {this.warnning_image()}
                {this.warnning_addcart()}
                <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mission</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Revolution number</th>
                        <th>Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {
                          this.props.alldata.map((data)=>{
                            return(
                              <tr key={data.ID} onClick={()=>{this.openModalImageData(data)}}>
                                  <td>{data.ID}</td>
                                  <td>{data.MISSION}</td>
                                  <td>{data.DATE}</td>
                                  <td>{data.TIME}</td>
                                  <td>{data.REVOLUTION_NUMBER}</td>
                                  <td>{data.MODE}</td>
                              </tr>
                            )
                          })
                      }
                       
                      
                    </tbody>
                  </Table>
                {
                    // this.props.alldata.map((data)=>{
                    //     return(
                    //         <div id='bgselectimg' key={data.ID} onClick={()=>{this.openModalImageData(data)}} >
                                
                    //             <h6 >{data.ID+"_"+data.MISSION+"_"+data.REVOLUTION_NUMBER+"_"+data.DATE+"_"+data.TIME}</h6>
                    //             <div id='coldata'>
                    //                 {/* <div id='imgstyle'>
                    //                 </div> */}
                    //                 <div style={{flex:2}} >
                    //                     <h6>MISSION: {data.MISSION}</h6>
                    //                     <h6>Date: {data.DATE}</h6>
                    //                     <h6>Time: {data.TIME}</h6>
                    //                     <h6>Revolution: {data.REVOLUTION_NUMBER}</h6>
                    //                 </div>
                    //                 <div style={{flex:2}} >
                    //                     <h6>INSTRUMENT_TYPE: {data.INSTRUMENT_TYPE}</h6>
                    //                     <h6>INSTRUMENT_INDEX: {data.INSTRUMENT_INDEX}</h6>
                    //                     <h6>ROW: {data.ROW}</h6>
                    //                     <h6>PATH: {data.PATH}</h6>
                    //                 </div>                                    
                    //                 {/* <div id='coladdcartbutton'>
                    //                     <Button id='addcartbutton' onClick={()=>this.openModal(data)}>
                    //                         <Icon icon="ant-design:shopping-cart-outlined" style={{width:'30px',height:'30px'}} />
                    //                     </Button>
                    //                 </div> */}
                    //             </div>
                    //         </div>
                    //     )   
                    // })
                }
            </div>
      );
    }

    
  }
  const mapStateToProps = (state) => ({ 
    cart:state.Reducer.cart,
  });
  const mapDispatchToProps = (dispatch) => ({
    add_cart: (item) => dispatch(add_cart(item))
  });
  export default connect(mapStateToProps,mapDispatchToProps)(ImageSelect);

  