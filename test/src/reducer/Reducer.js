import { LOGIN,ADD_CART,DELECT_ORDER,CLEAR_ORDER,CLEAR_USER,ADD_CUSTOMER_EMAIL,CLEAR_CUSTOMER_EMAIL,DELETE_CUSTOMER_EMAIL,SET_CUSTOMER_DATA,CLEAR_CUSTOMER_DATA } from "../action/Type";

const intialState = {
    user:{
        username:'',
        email:'',
        firstname:'',
        lastname:''
    },
    cart:[],
    customer_email:[],
    customer:{
        // id:'',
        // name:'',
        // email:'',
        // FTP:'',
        // username:'',
        // password:'',
        // description:''
    }
}
const Reducer =(state = intialState,action)=>{
    switch(action.type){
        case LOGIN:
            
            return{
                ...state,user:{
                    username:action.username,
                    email:action.email,
                    firstname:action.firstname,
                    lastname:action.lastname
                }
            }
        case CLEAR_USER:
            return{
                ...state,user:{
                    username:'',
                    email:'',
                    firstname:'',
                    lastname:''
                }
            }
        case DELECT_ORDER:
            
            return{
                ...state,cart:state.cart.filter((item)=>item.id !== action.id)
            }
        case CLEAR_ORDER:
            return{
                ...state,cart:[]
            }
        case ADD_CART:
            const datenow = new Date();
            console.log('add order')
            return{
                ...state,cart:[...state.cart,{
                    id:action.item.ID,
                    CENTER_LAT: action.item.CENTER_LAT,
                    CENTER_LON: action.item.CENTER_LON,
                    DATE: action.item.DATE,
                    INSTRUMENT_INDEX: action.item.INSTRUMENT_INDEX,
                    INSTRUMENT_TYPE: action.item.INSTRUMENT_TYPE,
                    MISSION: action.item.MISSION,
                    MODE: action.item.MODE,
                    NE_LAT: action.item.NE_LAT,
                    NE_LON: action.item.NE_LON,
                    NW_LAT: action.item.NW_LAT,
                    NW_LON: action.item.NW_LON,
                    PATH: action.item.PATH,
                    REVOLUTION_NUMBER: action.item.REVOLUTION_NUMBER,
                    ROW: action.item.ROW,
                    SE_LAT: action.item.SE_LAT,
                    SE_LON: action.item.SE_LON,
                    SUN_AZIMUTH: action.item.SUN_AZIMUTH,
                    SUN_ELEVATION: action.item.SUN_ELEVATION,
                    SW_LAT: action.item.SW_LAT,
                    SW_LON:action.item.SW_LON,
                    TIME: action.item.TIME,
                    LEVEL : action.item.LEVEL,
                    IMAGE_ID :  action.item.IMAGE_ID,
                    PRODUCT_IMAGE :  action.item.PRODUCT_IMAGE
                }]
            }
        case ADD_CUSTOMER_EMAIL:
            return{
                ...state,customer_email:action.item
            }
        case DELETE_CUSTOMER_EMAIL:
            
            return{
                ...state,customer_email:state.customer_email.filter((item)=>item !== action.item)
            }
        case CLEAR_CUSTOMER_EMAIL:
            return{
                ...state,customer_email:[]
            }
        case SET_CUSTOMER_DATA:
            return{
                ...state,customer:action.item
            }

        case CLEAR_CUSTOMER_DATA:
            return{
                ...state,customer:{}
            }
        
        default:
            return state;
            
    }

}

export default Reducer;