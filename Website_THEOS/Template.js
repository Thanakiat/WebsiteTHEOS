
//function template
// function App() {
  

//   return (
//     <div>
     
//     </div>
    
//   );
// }

// export default App;


import React, { Component } from 'react';
import { connect } from 'react-redux';

class SelectCustomer extends Component {
    constructor(props){
        super(props)
        
        this.state={
          
        }
      }

    

    render(){
        return (
            
            <div>

            </div>
          );
    }
    
  }
const mapStateToProps = (state) => ({ 
    user:state.Reducer.user,
});
const mapDispatchToProps = (dispatch) => ({
    
});




export default connect(mapStateToProps,mapDispatchToProps)(SelectCustomer);