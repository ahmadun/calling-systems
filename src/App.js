import React, { useReducer, createContext, Component } from 'react';
import Header from './components/Layouts/Header';
import SideBar from './components/Layouts/SideBar';
import Footer from './components/Layouts/Footer';
import Dashboard from './components/Layouts/Dashboard';


import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom";
import Login from './components/Pages/Login';
import Section from './components/Pages/Section';
import Monitoring from './components/Pages/Monitoring';


export const AuthContext = createContext()

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  nik:null
}


const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload))
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.username,
        token: action.payload.token,
        nik:action.payload.nik,
      }
    case "LOGOUT":
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        nik:null
      }


    default:
      return state
  }
}



function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (

    <BrowserRouter>
      <Switch>
        <AuthContext.Provider value={{
          state,
          dispatch
        }}>
          <div className="wrapper">
          <Route exact path="/">
            <Header />
            <SideBar />
            <Dashboard />
            <Footer />
          </Route>
          <Route path="/monitoring">
            <Header />
            <SideBar />
            <Monitoring />
            <Footer />
          </Route>
          <Route path="/section">
            <Header />
            <SideBar />
            <Section />
            <Footer />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          </div>

        </AuthContext.Provider>
      </Switch>
    </BrowserRouter>


    // <div className="wrapper">
    //   <Router>

    //     <Switch>
    //       <Route exact path="/">
    //         <Header />
    //         <SideBar />
    //         <Dashboard />
    //         <Footer />
    //       </Route>
    //       <Route path="/monitoring">
    //         <Header />
    //         <SideBar />
    //         <Monitoring />
    //         <Footer />
    //       </Route>
    //       <Route path="/section">
    //         <Header />
    //         <SideBar />
    //         <Section />
    //         <Footer />
    //       </Route>
    //       <Route path="/login">
    //         <Login />
    //       </Route>
    //     </Switch>
    //   </Router>
    // </div>
  );
}
// }


export default App;
