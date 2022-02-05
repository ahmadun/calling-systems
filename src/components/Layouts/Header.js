import React, { Component, useContext, useEffect,useState } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App'
import { useHistory } from 'react-router-dom'

const Header = () => {

  const { state, dispatch } = useContext(AuthContext)



  

  let history = useHistory();
  const onClickLogout = () => {
    dispatch({
      type: "LOGOUT"
    })
    history.push("/login")

  }



  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link" data-widget="pushmenu"><i className="fas fa-bars"/></div>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to={{
              pathname: '/'
            }}> <div className="nav-link">HOME</div></Link>

          </li>
        </ul>
        <ul className="navbar-nav ml-auto">

      
          <li className="nav-item">
            <div className="nav-link" data-widget="control-sidebar" data-slide="true">
              <button className='btn' onClick={onClickLogout}>Log Out</button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
export default Header