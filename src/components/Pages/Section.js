import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom'
import authHeader from '../../services/auth-header';
import { AuthContext } from '../../App'


const Section = () => {

    const [comments, setComments] = useState([]);
    const [selectsect, setSelectsect] = useState(["0", "0"])
    let sectionlist = comments;

    const handleAddrTypeChange = (e) => {
        setSelectsect([e.target.value, e.target.selectedOptions[0].text])
    }


    const { state } = useContext(AuthContext)





    let history = useHistory();
    const onClickSection = () => {

        if (selectsect[0] === "0") {
            return
        }
        else {

            history.push({
                pathname: '/monitoring',
                state: selectsect
            });
        }

    }


    useEffect(() => {

        let data = window.performance.getEntriesByType("navigation")[0].type;
        if (data === 'reload') {

        } else {
            if (!state.isAuthenticated) {
                history.push("/login")
            }
        }

        axios.get('https://localhost:44366/api/Sections', { headers: authHeader() })
            .then((response) => {
                const allnotes = response.data;
                setComments(allnotes);
            })
            .catch(error => console.error(`Error:${error}`));


    }, [])

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Section</h1>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item active">Section</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card card-primary">
                                <div className="card-header">
                                    <h3 className="card-title">Select Section</h3>
                                </div>
                                <form>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Section</label>
                                            <select className="form-control" onChange={e => handleAddrTypeChange(e)}>
                                                <option value="0">Select Section</option>
                                                {sectionlist.map((comment, index) => (
                                                    <option key={comment.id} value={comment.id}>{comment.name}</option>
                                                ))}

                                            </select>
                                        </div>

                                    </div>
                                    <div className="card-footer">

                                        <button type="button" onClick={onClickSection} className="btn btn-primary">Open</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default Section
