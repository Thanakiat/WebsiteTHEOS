// import { LOGIN,ADD_CART,DELECT_ORDER,CLEAR_ORDER,CLEAR_USER,ADD_CUSTOMER_EMAIL,CLEAR_CUSTOMER_EMAIL,DELETE_CUSTOMER_EMAIL } from "./Type";

import { LOGIN,ADD_CART,DELECT_ORDER,CLEAR_ORDER,CLEAR_USER,ADD_CUSTOMER_EMAIL,CLEAR_CUSTOMER_EMAIL,DELETE_CUSTOMER_EMAIL,SET_CUSTOMER_DATA,CLEAR_CUSTOMER_DATA } from "./Type";

export const login=(item)=>(
    {
        type:LOGIN,
        username:item.username,
        email:item.email,
        firstname:item.firstname,
        lastname:item.lastname
        
    }
)

export const clear_user=()=>(
    {
        type:CLEAR_USER
    }
)
export const add_cart=(item)=>(
    {
        type:ADD_CART,
        item:item
        
    }
)

export const delete_order=(id)=>(
    {
        type:DELECT_ORDER,
        id:id
        
    }
)
export const clear_order=()=>(
    {
        type:CLEAR_ORDER
    }
)

export const add_customer_email=(item)=>(
    {
        type:ADD_CUSTOMER_EMAIL,
        item:item
        
    }
)
export const delete_customer_email=(id)=>(
    {
        type:DELETE_CUSTOMER_EMAIL,
        id:id
        
    }
)
export const clear_customer_email=()=>(
    {
        type:CLEAR_CUSTOMER_EMAIL
    }
)

export const set_customer_data=(item)=>(
    {
        type:SET_CUSTOMER_DATA,
        item:item
        
    }
)
export const clear_customer_data=()=>(
    {
        type:CLEAR_CUSTOMER_DATA
    }
)

