import React, { Component } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,Switch,useNavigate 
} from "react-router-dom";

import WorldMap from './allComponent/WorldMap';
import Cart from './allComponent/Cart';
import History from './allComponent/History';
import ErrorPage from './allComponent/ErrorPage';
import Login from './allComponent/Login';
import SelectCustomer from './allComponent/SelectCustomer';
import DetailOrder from './allComponent/DetailOrder';
import Register from './allComponent/Register';
import HistoryDetail from './allComponent/HistoryDetail';
import Splash from './allComponent/Splash';
class App extends Component {
  
  render(){
    return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Splash/>} />
              <Route path='/LOGIN' element={<Login/>} />
              <Route path='/SELECTORDER' element={<WorldMap />} />
              <Route path='/CART' element={<Cart />} />
              <Route path='/HISTORY' element={<History />} />
              <Route path='/SELECTCUSTOMER' element={<SelectCustomer />} />
              <Route path='/DETAILORDER' element={<DetailOrder />} />
              <Route path='/REGISTER' element={<Register />} />
              {/* <Route path='/EMPLOYEEMANAGE' element={<Admin_employee />} />
              <Route path='/EDITEMPLOYEE' element={<Admin_Editemployee />} />
              <Route path='/CUSTOMERMANAGE' element={<Admin_customer />} />
              <Route path='/EDITCUSTOMER' element={<Admin_Editcustomer />} /> */}
              <Route path='/HistoryDetail' element={<HistoryDetail />} />
              <Route path='*' element={<ErrorPage />} />
          </Routes>
      </BrowserRouter>
       // <WorldMap/>
    );
  }
  
}

export default App;
