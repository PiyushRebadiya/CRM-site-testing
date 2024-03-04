import React, { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import axios from 'axios'
import moment from 'moment';
import './style/Style.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Calender from './Master/workMaster/Calender'
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Tag } from 'primereact/tag';
import ReminderDash from '../components/Master/ReminderDashboard/ReminderDash';
import TaskDash from '../components/Master/TaskDashboard/TaskDash'
import { MailOutlined } from '@ant-design/icons';
// import InquiryDash from './InquiryDash';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserActiveTable from './Master/MainDashboardComponnets/UserActiveTable';
import RunningTaskTable from './Master/MainDashboardComponnets/RunningTaskTable';
import ComplatedProjectTable from './Master/MainDashboardComponnets/CompletedProjectTable'
import TotalProjecttable from './Master/MainDashboardComponnets/TotalProjecttable';
function UserActive(props) {
    const { activeUser } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Active User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UserActiveTable activeUser={activeUser} />
            </Modal.Body>

        </Modal>
    );
}
function RunningTask(props) {
    const { runningtask } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Running Task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RunningTaskTable runningtask={runningtask} />
            </Modal.Body>
        </Modal>
    );
}

function ComplatedProject(props) {
    const { completedProject } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Completed Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ComplatedProjectTable completedProject={completedProject} />
            </Modal.Body>
        </Modal>
    );
}
function ProjectTotal(props) {
    const {totalProject} =props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Total Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <TotalProjecttable totalProject={totalProject}/>
            </Modal.Body>
        </Modal>
    );
}

const MainDashBoard = () => {
    const insertData = React.useRef(null);
    const [activeUser, setActiveUser] = React.useState("");
    const [totalProject, setTotalProject] = useState([]);
    const [runningTask, setRunningTask] = useState([]);
    const [partydata, setPartyData] = useState([])
    const [annivarsarydata, setAnniversaryData] = useState([])
    const [reminderdata, setReminderdata] = useState([])
    const [joining, setjoiningData] = useState([])
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')
    const userid = localStorage.getItem('CRMUserId')
    const [userShow, setUserShow] = React.useState(false);
    const [RunningShow, setRunningShow] = React.useState(false);
    const [complatedShow, setCompletdShow] = React.useState(false);
    const [totalProjectShow, setTotalProjectShow] = React.useState(false);
    const insertCalenderData = React.useRef(null);

    const userData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setActiveUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const projectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setTotalProject(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const completedProject = totalProject.filter((value) => value.Description === "Complete");

    const ReminderData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetReminderList?CompanyID=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setReminderdata(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    const taskData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? ' ' : ' '}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setRunningTask(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const runningtask = runningTask.filter((value) => value.TaskStatus === "InProgress");
    const pendingtask = runningTask.filter((value) => value.Description === "Pending");
    const completedtask = runningTask.filter((value) => value.Description === "Complete");
    // const VIPtask = runningTask.filter((value) => value.Priority === "VIP");
    const groupedTasks = {};

    runningtask.forEach((task) => {
        const projectName = task.ProjectName;
        if (!groupedTasks[projectName]) {
            groupedTasks[projectName] = [];
        }
        groupedTasks[projectName].push(task);
    });

    // const EmployeeList =async()=>{
    //     try {
    //         const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}`, {
    //           headers: { Authorization: `bearer ${token}` },
    //         });
    //         setEmpData(res.data);
    //         console.log(res.data, "empres")

    //       } catch (error) {
    //         // Handle error
    //       }
    // }

    useEffect(() => {
        taskData()
        projectData()
        userData()
        ReminderData()
    }, [])

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="header-icon">
                        <i className="fa fa-dashboard" />
                    </div>
                    <div className="header-title">
                        <h1> Dashboard</h1>
                        <small>Very detailed &amp; featured admin.</small>
                    </div>
                </section>
                {/* Main content */}
                <section className="content footer-section-form-padding ">
                    <div className="row">
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox1"   className="cardbox9"onClick={() => setUserShow(true)}>
                                <div className="statistic-box" >
                                    <i className="fa fa-user-plus fa-3x" />
                                    <div className="counter-number pull-right">
                                        <span className="count-number">{activeUser.length}</span>
                                        <span className="slight"><i className="fa fa-play fa-rotate-270"> </i>
                                        </span>
                                    </div>
                                    <h3> Active Users</h3>
                                </div>
                            </div>
                        </div>
                        <UserActive
                            show={userShow}
                            onHide={() => setUserShow(false)}
                            activeUser={activeUser}
                        />
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox2"    className="cardbox9"  onClick={() => setRunningShow(true)}>
                                <div className="statistic-box">
                                    <i className="fa fa-user-secret fa-3x" />
                                    <div className="counter-number pull-right">
                                        <span className="count-number">{runningtask.length}</span>
                                        <span className="slight"><i className="fa fa-play fa-rotate-270"> </i>
                                        </span>
                                    </div>
                                    <h3>Running Task</h3>
                                </div>
                            </div>
                        </div>
                        <RunningTask
                            show={RunningShow}
                            onHide={() => setRunningShow(false)}
                            runningtask={runningtask}
                        />
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox3"    className="cardbox9" onClick={() => setCompletdShow(true)}>
                                <div className="statistic-box">
                                    <i className="fa fa-money fa-3x" />
                                    <div className="counter-number pull-right">
                                        <span className="count-number">{completedProject.length}</span>
                                        <span className="slight"><i className="fa fa-play fa-rotate-270"> </i>
                                        </span>
                                    </div>
                                    <h3> Compeletd Projects</h3>
                                </div>
                            </div>
                        </div>
                        <ComplatedProject
                            show={complatedShow}
                            onHide={() => setCompletdShow(false)}
                            completedProject={completedProject}
                        />
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox4"    className="cardbox9" onClick={() => setTotalProjectShow(true)}>
                                <div className="statistic-box">
                                    <i className="fa fa-files-o fa-3x" />
                                    <div className="counter-number pull-right">
                                        <span className="count-number">{totalProject.length}</span>
                                        <span className="slight"><i className="fa fa-play fa-rotate-270"> </i>
                                        </span>
                                    </div>
                                    <h3> Total Projects</h3>
                                </div>
                            </div>
                        </div>
                        <ProjectTotal
                            show={totalProjectShow}
                            onHide={() => setTotalProjectShow(false)}
                            totalProject={totalProject}
                        />
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-12 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Reminders</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="Workslist">
                                        <div className="worklistdate">
                                            <ReminderDash />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Tasks</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="Workslist">
                                        <div className="worklistdate">

                                            <TaskDash insertData={insertData} taskData={taskData} fetchCalenderData={insertCalenderData.current} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Task Calender</h4>
                                    </div>
                                </div>
                                <Calender insertCalenderData={insertCalenderData} />
                            </div>
                        </div>
                        {/* <div className="col-lg-6 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Inquiries</h4>
                                    </div>
                                </div>
                                <InquiryDash />
                            </div>
                        </div> */}
                    </div>
                </section>
            </div >

        </div >
    )
}

export default MainDashBoard