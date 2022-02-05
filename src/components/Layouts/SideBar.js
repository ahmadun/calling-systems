import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../App'

const SideBar = () => {

  const [nik, setNik] = useState("");
  const { state } = useContext(AuthContext)


  useEffect(() => {

    setNik(state.nik)
    
   
    if(state.nik==null){
      const data=JSON.parse(localStorage.getItem('user'));   
      setNik(data.nik)    
    }
   


  }, [])

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div className="brand-link">
          <img src="dist/img/pngsbi.png" alt="SBI" className="brand-image" />
          <span className="brand-text font-weight-light">SBI Calling System</span>
        </div>
        <div className="sidebar">
          <nav className="mt-2">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <a href="#" className="d-block">{nik}</a>
              </div>
            </div>


            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-header">MENU</li>
              <li className="nav-item">

                <Link to="/section"><div className="nav-link" style={{ color: 'white' }}>
                  <i className="nav-icon fas fa-th" />
                  <p>Trouble Monitoring</p>
                </div></Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div >
  )
}


export default SideBar