import React, { useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../App';
import axios from "axios";


const Login = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { dispatch } = useContext(AuthContext)
    const required = value => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    This field is required!
                </div>
            );
        }
    };


    let history = useHistory();
    const onClickSection = (e) => {

        e.preventDefault()
        const API_URL = "https://localhost:44366/api/Users/authenticate";
        const config = { Name: username, Password: password };
        axios.post(API_URL, config)
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: "LOGIN",
                        payload: res.data
                    })
                    history.push("/")
                }
            })
            .catch(e => {
                if (e.response) {
                    setMessage("Username or Password incorect")
                } else if (e.request) {
                    setMessage("Error request to Server")
                } else {
                    setMessage(e.message)
                }
            })
    }


    return (
        <div className="hold-transition login-page">
            <div className="login-box">
                <div className="login-logo">
                    <a><b>Calling</b>System</a>
                </div>
                <div className="card">
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        <form onSubmit={onClickSection}>
                            <div className="input-group mb-3">
                                <input type="text"
                                    className="form-control"
                                    name="username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    validations={[required]} />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    validations={[required]} />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">

                                    {message && (

                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>

                                    )}

                                </div>
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Login
