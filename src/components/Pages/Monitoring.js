
import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import TableHeader from '../DataTable/TableHeader';
import PaginationComponent from '../DataTable/PaginationComponent ';
import Search from '../DataTable/Search';
import axios from "axios";
import * as moment from 'moment'
import Moment from "react-moment";
import io from "socket.io-client";
import { useLocation, useHistory } from "react-router-dom";
import snd from '../../static/sounds.mp3';
import { HubConnectionBuilder } from '@microsoft/signalr';
import authHeader from '../../services/auth-header';
import { AuthContext } from '../../App'
import AuthService from "../../services/auth.service";
import { Button, Modal } from 'react-bootstrap';




const Monitoring = () => {
    const [comments, setComments] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [waktuMail, setWaktuMail] = useState("");
    let location = useLocation();
    const interval = useRef();
    const [mounted, setMounted] = useState(true);
    let audio = useRef();
    const [connection, setConnection] = useState(null);
    const { state } = useContext(AuthContext);
    const ITEMS_PER_PAGE = 50;




    const headers = [
        { name: "No#", sortable: false },
        { name: "Name", field: "name", sortable: true },
        { name: "Problem", field: "problemDesc", sortable: true },
        { name: "Location", field: "location", sortable: false },
        { name: "Area", field: "area", sortable: false },
        { name: "Call By", field: "callby", sortable: false },
        { name: "Call Time", field: "startTime", sortable: false },
        { name: "Downtime", sortable: false },
        { name: "Status", field: "flag", sortable: false },
        { name: "Proses", sortable: false },

    ];




    let history = useHistory();


    function loadData() {
        axios.get(`https://localhost:44366/api/Troubles/id?id=${location.state[0]}`, { headers: authHeader() })
            .then((response) => {
                const allnotes = response.data;
                setComments(allnotes);

            })
            .catch(error => console.error(`Error:${error}`));
    }


    useEffect(() => {


        let data = window.performance.getEntriesByType("navigation")[0].type;
        if (data === 'reload') {
            AuthService.checkToken().then(
                (response) => {

                    if (response.status == 401) {
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


        loadData()
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44366/hubs')
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);



        audio.current = new Audio(snd)


        interval.current = setInterval(() => {
            setWaktuMail(new Date());
        }, 1000)


        return () => {
            clearInterval(interval.current);
            interval.current = null;
            audio.current.pause();
        };


    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    connection.on('ReceiveMessage', message => {
                        let cal = message;
                        if (cal.substr(0, 3) === location.state[0]) {
                            loadData();
                            if (cal.substr(3, 3) === "1") {
                                audio.current.play();
                            }
                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }

    }, [connection]);


    const commentsData = useMemo(() => {
        let computedComments = comments;

        if (search) {
            computedComments = computedComments.filter(
                (comment) =>
                    comment.ProblemDesc.toLowerCase().includes(search.toLowerCase()) ||
                    comment.location.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedComments = computedComments.sort(
                (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        return computedComments.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [comments, currentPage, search, sorting]);

    const rowColor = (flag) => {
        if (flag === 0) {
            return <span className="badge bg-danger" style={{ paddingLeft: 22, paddingRight: 22, paddingTop: 10, paddingBottom: 10 }}>Pending</span>
        } else if (flag === 1) {
            return <span className="badge bg-warning" style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }}>Confirmed</span>
        }
    }

    const [show, setShow] = useState(false);
    const [idprob, setIdprob] = useState(0);
    const [flag, setFlag] = useState(0);
    const [dataconfirm, setDataconfirm] = useState("");

    const handleConfirm = () => {
        const API_URL = `https://localhost:44366/api/Troubles?id=${idprob}&flag=${flag}`;
        axios.post(API_URL)
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    setShow(false);
                    connection.send("SendMessage", location.state[0] + "0", "")
                        .then(() => "");
                }
            })
            .catch(e => {

            })

    }

    const handleClose = () => setShow(false)
    const handleShow = (desc, id, flag) => {
        setShow(true)
        setDataconfirm(desc)
        setIdprob(id)
        setFlag(flag)
    }

    const bodyModal = () => {

    }



    const sendMail = (start, nows, id, mail) => {

        var then = moment(start).format('DD/MM/YYYY HH:mm:ss');
        var now = moment(nows).format('DD/MM/YYYY HH:mm:ss');
        var dwn = moment.duration(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))).format("DD HH:mm:ss");


        if (mail == null) {

            var sp = dwn.replace(':', '').replace(':', '').replace(' ', '');
            if (sp > 20) {

                // axios.get(`http://sbilocal:8082/api/Email/${id}/1`,{ headers: authHeader() })
                //     .then((response) => {
                //         loadData();

                //     })
                //     .catch(error => console.error(`Error:${error}`));


            }

        }
        else if (mail == 3) {
            var mn = dwn.replace(':', '').replace(':', '').replace(' ', '');
            if (mn > 30) {

                // axios.get(`http://sbilocal:8082/api/Email/${id}/2`,{ headers: authHeader() })
                //     .then((response) => {
                //         loadData();
                //     })
                //     .catch(error => console.error(`Error:${error}`));
            }
        }

        return dwn;

    }

    return (
        <>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">{location.state[1]}</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">Home</li>
                                    <li className="breadcrumb-item active">Monitoring</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Trouble Calling</h3>

                                        <div className="card-tools">

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Search
                                                        onSearch={(value) => {
                                                            setSearch(value);
                                                            setCurrentPage(1);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body table-responsive p-0">
                                        <table className="table table-hover text-nowrap">
                                            <TableHeader
                                                headers={headers}
                                                onSorting={(field, order) => setSorting({ field, order })}
                                            />
                                            <tbody>
                                                {commentsData.map((comment, index) => (
                                                    <tr key={comment.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{comment.name}</td>
                                                        <td>{comment.problemDesc}</td>
                                                        <td>{comment.location}</td>
                                                        <td>{comment.area}</td>
                                                        <td>{comment.callby}</td>
                                                        <td>{comment.startTime}</td>

                                                        <td>
                                                            <span className="badge bg-success" style={{ padding: 10, fontSize: 15 }}>{sendMail(comment.startTime, waktuMail, comment.id, comment.flagmail)}</span>
                                                        </td>
                                                        <td>
                                                            {rowColor(comment.flag)}
                                                        </td>

                                                        <td>
                                                            <button className="btn btn-info" onClick={() => handleShow(comment.problemDesc, comment.id, comment.flag)}>Confirm</button>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <PaginationComponent
                                            total={totalItems}
                                            itemsPerPage={ITEMS_PER_PAGE}
                                            currentPage={currentPage}
                                            onPageChange={(page) => setCurrentPage(page)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <p>Are you sure want to Confirm this trouble?</p>
                        <p><b>Trouble : </b>{dataconfirm}</p> */}

                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Horizontal Form</h3>
                            </div>
                            {/* /.card-header */}
                            {/* form start */}
                            <form className="form-horizontal">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <label htmlFor="inputEmail3" className="col-sm-4 col-form-label">Area</label>
                                        <div className="col-sm-8">
                                            <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword3" className="col-sm-4 col-form-label">Trouble</label>
                                        <div className="col-sm-8">
                                            <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                        </div>
                                    </div>

                                </div>
                                {/* /.card-body */}
                                <div className="card-footer">
                                    <form>
                                        <div className="card-body">
                                            <div className="form-group">
                                                <label>Trouble Solving</label>
                                                <div className="row">
                                                 <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                                 <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Trouble Solving</label>
                                                <textarea type="text" className="form-control" />
                                            </div>


                                        </div>

                                    </form>

                                </div>

                            </form>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleConfirm}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>




            </div>


        </>
    );
};

export default Monitoring;