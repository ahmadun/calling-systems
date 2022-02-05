import React, { useEffect, Component, useContext } from 'react'
import Monitoring from '../Pages/Monitoring'
import Section from '../Pages/Section'
import { AuthContext } from '../../App'
import { useHistory } from 'react-router-dom'
import AuthService from "../../services/auth.service";

function Dashboard() {

    const { state, dispatch } = useContext(AuthContext)

    let history = useHistory();



    let data = window.performance.getEntriesByType("navigation")[0].type;
    if (data === 'reload') {     
         AuthService.checkToken().then(
            (response) => {

                if(response.status==401){
                    history.push("/login")
                }
            },
            error => {
            
            }
        );

    } else {
        if (!state.isAuthenticated) {
            history.push("/login")
        }
    }



    return (

        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                </div>
            </section>
        </div>



    )

}

export default Dashboard