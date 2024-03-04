import React, { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import axios from 'axios'
import moment from 'moment';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import Calender from '../workMaster/Calender'
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tag } from 'primereact/tag';
import Modal from 'react-bootstrap/Modal';
import TaskDash from '../TaskDashboard/TaskDash';
import '../../style/Style.css'
import TaskDashboardTable from '../TaskDashboard/TaskDashboardTable';
import ProjectModal from '../../ProjectModal';
import AssignByMe from '../TaskDashboard/AssignByMe';
import TaskChart from '../../Charts/TaskChart';
import TaskCompletedChart from '../../Charts/TaskCompletedChart';
import TaskReport from './TaskReport';
import TaskUserChart from '../../Charts/TaskUserChart';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'
import TaskForm from '../workMaster/TaskForm';
import { Tabs, Popover, Form, Input, Tooltip } from 'antd';
import { FiRefreshCw } from "react-icons/fi";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

const { TabPane } = Tabs;

function TaskNewForm(props) {
    const { fetchData, fetchCalenderData, fetchAssignByMeData, insertChartData, fetchCompleteTaskData, fetchReportData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <TaskForm onHide={props.onHide} fetchData={fetchData} fetchCalenderData={fetchCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData} />
        </Modal>
    );
}


function Projects(props) {
    const { projectS, statusinquery } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {statusinquery}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <InqueryDashboardTable InqueryData={InqueryData} /> */}
                <ProjectModal projectS={projectS} />
            </Modal.Body>
        </Modal>
    );
}

function InqueryDetails(props) {
    const { InqueryData, statusinquery } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        // keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {statusinquery}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <InqueryDashboardTable InqueryData={InqueryData} /> */}
                <TaskDashboardTable InqueryData={InqueryData} />
            </Modal.Body>
        </Modal>
    );
}
function Filter(props) {
    const { InqueryData, statusinquery } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {statusinquery}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <InqueryDashboardTable InqueryData={InqueryData} /> */}
                <TaskDashboardTable InqueryData={InqueryData} />
            </Modal.Body>
        </Modal>
    );
}
const Dashboard = () => {
    const TaskApi = React.useRef(null)
    const insertData = React.useRef(null);
    const insertChartData = React.useRef(null);
    const resetData = React.useRef(null);
    const resetUserData = React.useRef(null);


    React.useEffect(() => {
        insertData.current = TaskData
    }, [])

    const [activeUser, setActiveUser] = React.useState([]);
    const [totalProject, setTotalProject] = useState([]);
    const [runningTask, setRunningTask] = useState([]);
    const [complated, setComplated] = React.useState(false);
    const insertCalenderData = React.useRef(null);
    const [inqueryData, setInqueryData] = useState([])
    const [statusinquery, setStatusInquery] = useState("")

    const [projectmodal, setProjectModal] = React.useState(false)
    const [projectS, setProjectS] = useState([])
    const [filter, setFilter] = useState(false)
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const Role = localStorage.getItem('CRMRole')
    const userid = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL

    // filter
    const fromDate = new Date()
    const formattedfrom = moment(fromDate).format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(formattedfrom)
    const formattedto = moment(fromDate).format('YYYY-MM-DD');
    const [todate, setTodate] = useState(formattedfrom)
    const [selectedUser, setSelectedUser] = useState('')
    const [projectname, setProjectname] = useState(0)
    const [category, setCategory] = useState(0)
    const [taxadmin, setTaxadmin] = useState(0)


    const [getprojectdata, setGetProjectData] = useState([])
    const [getcategorydata, setGetcategorydata] = useState([])
    const [gettaxadmindata, setGettaxadmindata] = useState([])
    const [partyData, setPartyData] = useState([])
    const [party, setParty] = useState(0)
    const [taskStatus, setTaskStatus] = useState('')
    const [filterData, setFilterData] = useState([])
    const [AssignByMeFilterData, setAssignByMeFilterData] = useState([])
    const [masterData, setMasterData] = useState([]);

    const [taskchartdata, setTaskchartData] = useState([])
    const [taskcompletedata, setTaskcompletedata] = useState([])
    const [report, setReport] = useState([])
    const [userReport, setuserReport] = useState([])
    const [assignByMEChart, setAssignByMEChart] = useState([])
    const [userfilterData, setuserfilterData] = useState([])
    // new form
    const [tasknew, setTaskNew] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };


    const handleRangePickerChange = (dates, dateStrings) => {
        // Check if dates is null or undefined
        if (!dates || dates.length === 0) {
            // Handle the case when nothing is selected
            setSelectedDates('');
        } else {
            // Handle the case when a date range is selected
            setSelectedDates(dateStrings);
        }
    };

    const handleClose = () => setFilter(false);
    const handleShow = () => setFilter(true);

    const resetRecord = () => {
        setFromDate(formattedfrom)
        setTodate(formattedfrom)
        setParty(0)
        setTaxadmin(0)
        setProjectname(0)
        setCategory(0)
        setSelectedUser('')
        setTaskStatus('')
        AssignByMeTaskData()
        TaskData()
        // handleClose()
        if (Role != 'Admin') {
            // resetUserData.current()
        }
    }

    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyList?CustId=${custId}&CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setPartyData(res.data);
            // console.log(res.data, "partyDAta");
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {
        if (filter == true) {
            getPartyData()
        }
    }, [filter])

    const partyOptions = partyData.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
        // label: (
        //     <div>
        //         <div>{display.PartyName}<span style={{ fontSize: "10px", color: "grey" }}>{display.LegelName && (`(${display.LegelName})`)}</span></div>
        //     </div>
        // ),
    }));

    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetProjectData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const projectOptions = getprojectdata.map((display) => ({
        value: display.Id,
        label: display.ProjectName,
    }));
    const getCategoryData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            // console.log(res,"res")
            setGetcategorydata(res.data);
            // console.log(res.data, "categoryDAta");
        } catch (error) {
            // Handle error
        }
    };

    const categoryOptions = getcategorydata.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));
    const getTaxadmindata = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setGettaxadmindata(res.data);
            // console.log(res.data, "sub-categoryDAta");
        } catch (error) {
            // Handle error
        }
    };

    const taxadminOptions = gettaxadmindata.map((display) => ({
        value: display.Id,
        label: display.Heading,
    }));
    useEffect(() => {
        if (filter == true) {
            getProjectData()
            getCategoryData()
            getTaxadmindata()
        }
    }, [filter])

    const fetchMasterData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            })
            setMasterData(res.data)
            // console.log(res.data, "mastrdata")

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMasterData()
    }, [])
    const taskoptions = masterData.filter((display) => display.Remark === "TaskStatus");
    const TaskOptions = taskoptions.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))

    const UserFilter = async () => {
        try {
            // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task`, {
            const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=${userid}&AssignTo=${selectedUser}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeFilterData(res.data)
            // console.log(res,'USerdataSubmit')
            if (res.status == 200) {
                handleClose()
            }

        } catch (error) {
            console.log(error)
        }

    }
    const DataSubmit = async () => {
        try {
            // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task`, {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${selectedUser}`, {
                const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${selectedUser}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                // console.log(res,'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }
            else {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=${userid}&AssignTo=${selectedUser}`, {
                const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${userid}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                // setAssignByMeFilterData(res.data)
                UserFilter()
                // console.log(res, 'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }
            // UserAssignByMEFilter()

        } catch (error) {
            console.log(error)
        }
    }
    const TaskData = async () => {
        try {
            // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task`, {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=&endDate=&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? ' ' : ' '}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                fetchReportData()
                fetchUserReportData()
                // console.log(res.data, 'taskData')
                // console.log(res,'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }
            else {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=&endDate=&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${userid}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                fetchReportData()
                fetchUserReportData()
                // console.log(res.data, 'taskDataUser')
                // UserFilter()
                // console.log(res,'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    const AssignByMeTaskData = async () => {
        try {
            // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=&endDate=&CompanyId=${companyId}&Type=Task&AssignBy=${userid}&AssignTo=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeFilterData(res.data)
            fetchUserReportData()
            // console.log(res,'dataSubmit')
            if (res.status == 200) {
                handleClose()
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        TaskData()
        if(Role!='Admin'){
            AssignByMeTaskData()
        }
    }, [])
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
    const userlist = activeUser.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName
    }))
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

    // const taskData = async () => {
    //     try {

    //         // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task`, {
    //         //     headers: { Authorization: `bearer ${token}` }
    //         // })
    //         // setRunningTask(res.data)
    //         // console.log(res.data, 'running')
    //         if (Role == "Admin") {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setRunningTask(res.data)
    //         } else {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setRunningTask(res.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const runningtask = filterData.filter((value) => value.TaskStatus === "InProgress");
    const pendingtask = filterData.filter((value) => value.TaskStatus === "Pending");
    const completedtask = filterData.filter((value) => value.TaskStatus === "Complete");
    // const VIPtask = runningTask.filter((value) => value.Priority === "VIP");
    const groupedTasks = {};

    filterData.forEach((task) => {
        const projectName = task.ProjectName;
        if (!groupedTasks[projectName]) {
            groupedTasks[projectName] = [];
        }
        groupedTasks[projectName].push(task);
    });

    useEffect(() => {
        // taskData()
        userData()
        // projectData()
    }, [])

    const handleData = (data) => {
        setRunningTask(data)
    }
    // const handleInqueryData = (inquiryData, inquiryType) => {
    //     setComplated(true)
    //     setInqueryData(inquiryData)
    //     setStatusInquery(inquiryType)
    // }
    const handleProjectData = (projectS, inquiryType) => {
        setProjectModal(true)
        setProjectS(projectS)
        setStatusInquery(inquiryType)
    }
    const fetchData = async () => {
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                // console.log(res, "responseCOM")
                setTaskchartData(res.data)
            }
            else {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setTaskchartData(res.data)
            }
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCompleteTaskData = async () => {
        try {

            if (Role == 'Admin') {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                    // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setTaskcompletedata(res.data)
                // console.log(res.data, 'setc')
            }
            else {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
                    // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setTaskcompletedata(res.data)
            }
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAssignByChart = async () => {
        try {

            // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // console.log(res.data, "assignByMechart")
            setAssignByMEChart(res.data)
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // fetchAssignByChart()
    }, [])
    const fetchReportData = async () => {
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/TaskSummary?Type=Task&CompanyId=${companyId}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setReport(res.data)
            }
            else {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/TaskSummaryUser?CompanyId=${companyId}&Type=Task&AssignTo=${userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setReport(res.data)
            }
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };
    const fetchUserReportData = async () => {
        try {


            // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
            const res = await axios.get(URL + `/api/Master/TaskSummaryAssignByme?CompanyId=${companyId}&Type=Task&AssignBy=${userid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setuserReport(res.data)
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // fetchData();
        // fetchCompleteTaskData()
        fetchReportData()
        fetchUserReportData()
    }, []);

    const RunautoTask = () =>{
        try {
            const res = axios.get(URL + '/api/Master/RunAutoTask')          
        } catch (error) {
            console.log(error)
        }
    }
    const handleRefreshPages = () => {
        window.location.reload(true)
        RunautoTask()
    }

    const content = (
        <div>
            <p><i class="fa fa-circle" style={{ color: '#54B435' }} aria-hidden="true"></i> - Completed</p>
            <p><i class="fa fa-circle" style={{ color: '#FF9800' }} aria-hidden="true"></i> - Pending</p>
            <p><i class="fa fa-circle" style={{ color: '#0174BE' }} aria-hidden="true"></i> - InProgress</p>
            <p><i class="fa fa-circle" style={{ color: '#720455' }} aria-hidden="true"></i> - Hold</p>
            <p><i class="fa fa-circle" style={{ color: '#f5222d' }} aria-hidden="true"></i> - Cancel</p>
        </div>
    );
    return (
        <div>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="header-icon">
                        <i class="fa fa-tasks" style={{ fontSize: "40px", marginTop: "6px" }}> </i>
                    </div>
                    <div className='headeradjust'>
                        <div className="header-title">
                            <h1>Task Dashboard</h1>
                            {/* <small>Task details</small> */}
                        </div>
                        {/* <Button className="btn btn-add rounded-2" onClick={() => setTaskNew(true)}>
                            Add Task <i class="fa fa-plus" aria-hidden="true"></i>
                        </Button> */}

                        <TaskNewForm
                            show={tasknew}
                            onHide={() => setTaskNew(false)}
                            fetchData={insertData.current}
                        // fetchCalenderData={fetchCalenderData}
                        // fetchAssignByMeData={fetchAssignByMeData}
                        // insertChartData={insertChartData}
                        // fetchCompleteTaskData={fetchCompleteTaskData}
                        // fetchReportData={fetchReportData}
                        />

                        <div className='d-flex'>
                            <Tooltip title='Refresh'>
                                <div className='refresh-icon' onClick={handleRefreshPages}>
                                    <FiRefreshCw size={20} />
                                </div>
                            </Tooltip>

                            <Tooltip title='Filter'>
                                <FaFilter size={25} onClick={handleShow} style={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                        <Modal
                            show={filter}
                            onHide={handleClose}
                            centered
                            size='lg'
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Filter</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col lg={6}>
                                        <div className='filter-form date-section-main w-100 p-1'>
                                            <div className='date-lable left'>
                                                <label>From Date :</label>
                                            </div>
                                            <div className='w-100'>
                                                <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main w-100 p-1'>
                                            <div className='date-lable left'>
                                                <label>To Date :</label>
                                            </div>
                                            <div className='w-100'>
                                                <input type='date' className='form-control w-100' min={fromdate} value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main w-100 mt-4'>
                                            <div className='date-lable'>
                                                <label>Party :</label>
                                            </div>
                                            <div className='w-100 p-1'>
                                                <Select
                                                    className=''
                                                    options={partyOptions}
                                                    value={partyOptions.find((option) => option.value == party)}
                                                    onChange={(selected) => {
                                                        setParty(selected.value)
                                                        // if (errors.party) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                        // }
                                                    }}
                                                    placeholder="Select Party"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className=' filter-label date-section-main w-100 mt-4'>
                                            <div className='date-lable'>
                                                <label>Project :</label>
                                            </div>
                                            <div className='w-100 p-1'>
                                                <Select
                                                    className=''
                                                    options={projectOptions}
                                                    value={projectOptions.find((option) => option.value == projectname)}
                                                    onChange={(selected) => {
                                                        setProjectname(selected.value)
                                                        // if (errors.party) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                        // }
                                                    }}
                                                    placeholder="Select Project"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main p-1 mt-4'>
                                            <div className='date-lable d-flex'>
                                                <label>Task Status :</label>
                                            </div>
                                            <div className='w-100'>
                                                <Select
                                                    className='w-100'
                                                    options={TaskOptions}
                                                    // isClearable
                                                    value={TaskOptions.find((option) => option.value == taskStatus)}
                                                    onChange={(selected) => {
                                                        setTaskStatus(selected.value)
                                                        // if (errors.party) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                        // }
                                                    }}
                                                    placeholder="Select Status"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main p-1 mt-4'>
                                            <div className='date-lable d-flex'>
                                                <label>Assign To :</label>
                                            </div>
                                            <Select
                                                className='w-100'
                                                options={userlist}
                                                value={userlist.find((option) => option.value == selectedUser)}
                                                onChange={(selected) => {
                                                    setSelectedUser(selected.value)
                                                }}
                                                placeholder="Select User"
                                            />
                                        </div>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main p-1 mt-4'>
                                            <div className='date-lable d-flex'>
                                                <label>Category :</label>
                                            </div>
                                            <div className='w-100'>
                                                <Select
                                                    className='w-100'
                                                    options={categoryOptions}
                                                    value={categoryOptions.find((option) => option.value == category)}
                                                    onChange={(selected) => {
                                                        setCategory(selected.value)
                                                        // if (errors.party) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                        // }
                                                    }}
                                                    placeholder="Select Category"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className='filter-label date-section-main p-1 mt-4'>
                                            <div className='date-lable d-flex w-50'>
                                                <label>Sub Category :</label>
                                            </div>
                                            <Select
                                                className='w-100'
                                                options={taxadminOptions}
                                                value={taxadminOptions.find((option) => option.value == taxadmin)}
                                                onChange={(selected) => {
                                                    setTaxadmin(selected.value)
                                                }}
                                                placeholder="Select Sub Category"
                                            />
                                        </div>

                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className='ms-2' onClick={resetRecord}>
                                    Reset
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={DataSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        {/* <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i> */}
                        {/* <Popover
                            content={filterPop}
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <Button type="primary"> <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i></Button>
                        </Popover> */}
                    </div>
                </section>
                <section className="content footer-section-form-padding p-4 ">
                    <div className="row">

                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox4" className='cardbox6'>
                                <div className="statistic-box">
                                    <i className="fa fa-pencil-square-o fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{filterData.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>All Task</h3>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox1" className='cardbox7'>
                                <div className="statistic-box">
                                    <i class="fa fa-pause-circle fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{pendingtask.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>Pending Task</h3>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox2" className='cardbox8' >
                                <div className="statistic-box">
                                    <i class="fa fa-crosshairs fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{runningtask.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>Running Task</h3>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox3" className='cardbox5'>
                                {/* <div id="cardbox3" className='cardbox5' onClick={() => handleProjectData(completedProject, "Completed Project")}> */}
                                <div className="statistic-box">
                                    <i class="fa fa-trophy fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{completedtask.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3> Completed Task</h3>
                                </div>
                            </div>
                            {/* <Projects
                                show={projectmodal}
                                onHide={() => setProjectModal(false)}
                                projectS={projectS}
                                statusinquery={statusinquery}
                            /> */}
                            <InqueryDetails
                                show={complated}
                                onHide={() => setComplated(false)}
                                InqueryData={inqueryData}
                                statusinquery={statusinquery}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Task List</h4>
                                    </div>
                                </div>
                                <div className="Workslist p-2">
                                    {
                                        Role == 'Admin' ? (
                                            <TaskDash resetData={resetData} filterData={filterData} insertData={insertData} fetchCalenderData={insertCalenderData.current} ondata={handleData} insertChartData={fetchData} fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData} TaskData={TaskData} />

                                        ) : <div className="worklistdate">
                                            <Tabs defaultActiveKey="home"
                                                transition={true}
                                            >
                                                <TabPane tab="My Task" key="My Task">
                                                    <TaskDash resetData={resetData} filterData={filterData} insertData={insertData} fetchCalenderData={insertCalenderData.current} ondata={handleData} insertChartData={fetchData} fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData} TaskData={TaskData} />
                                                </TabPane>

                                                <TabPane tab="Assign BY ME" key="AssignByme">
                                                    <div className="worklistdate">
                                                        <AssignByMe resetUserData={resetUserData} filterData={AssignByMeFilterData} insertData={insertData} fetchCalenderData={insertCalenderData.current} ondata={handleData} fetchReportData={fetchUserReportData} insertChartData={fetchData} fetchCompleteTaskData={fetchCompleteTaskData}
                                                            fetchAssignByChart={fetchAssignByChart} AssignByMeTaskData={AssignByMeTaskData} TaskData={TaskData}
                                                        />
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                        </div>

                                    }

                                </div>
                            </div>
                        </div>
                        {/* <div className='row'>
                            <div className="col-lg-8 pinpin">
                                <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                    <div className="card-header">
                                        <div className="card-title custom_title">
                                            <h4>Task Calender</h4>
                                        </div>
                                    </div>
                                    <Calender insertCalenderData={insertCalenderData} />
                                </div>
                            </div>
                            <div className="col-lg-4 pinpin">
                                <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                    <div className="card-header">
                                        <div className="card-title custom_title">
                                            <h4>Task Chart</h4>
                                        </div>
                                    </div>
                                    <Tabs
                                        defaultActiveKey="1"
                                        id="noanim-tab-example"
                                        className="mt-3"
                                    >
                                        <Tab eventKey="1" title="All Task">
                                            <TaskChart
                                                taskchartdata={taskchartdata}
                                            />
                                        </Tab>
                                        <Tab eventKey="2" title="Completed Task">
                                            <TaskCompletedChart
                                                taskcompletedata={taskcompletedata}
                                            />
                                        </Tab>

                                    </Tabs>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className='row'>
                        {/* {
                                Role=='Admin' ? (
                                    <div className="col-lg-12 pinpin">
                                    <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                        <div className="card-header">
                                            <div className="card-title custom_title">
                                                <h4>Task Report</h4>
                                            </div>
                                        </div>
                                        <TaskReport taskchartdata={taskchartdata} taskcompletedata={taskcompletedata} report={report}/>
                                    </div>
                                </div> 
                                ):null
                            } */}
                        <div className="col-lg-7 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true"
                            // style={{height: "726px"}}
                            >
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Task Report</h4>
                                    </div>
                                </div>
                                {
                                    Role == 'Admin' ? (
                                        <TaskReport taskchartdata={taskchartdata} taskcompletedata={taskcompletedata} report={report} />
                                    ) :
                                        <div className='p-2'>
                                            <Tabs defaultActiveKey="44"
                                                transition={false}
                                            >
                                                <TabPane tab='My Report' key='My'>
                                                    <TaskReport taskchartdata={taskchartdata} taskcompletedata={taskcompletedata} report={report} />
                                                </TabPane>
                                                <TabPane tab='Assign BY ME Report' key='AssignByMe'>
                                                    <TaskReport taskchartdata={taskchartdata} taskcompletedata={taskcompletedata} report={userReport} />
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="col-lg-5 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Task Chart</h4>
                                    </div>
                                </div>
                                {
                                    Role != 'Admin' ? (
                                        <Tabs
                                            defaultActiveKey="54"
                                            className="mt-3"
                                            centered

                                        >
                                            <TabPane tab='My Tasks' key='mychart'>
                                                <TaskUserChart taskchartdata={filterData} />
                                            </TabPane>
                                            <TabPane tab='Assign BY ME Tasks' key='assignbyme'>
                                                <Tabs defaultActiveKey="55"
                                                    centered>
                                                    <TabPane tab="All Tasks" key="AllUserCharts">
                                                        {/* <TaskChart
                                                            taskchartdata={assignByMEChart}
                                                        /> */}
                                                        <TaskChart
                                                            taskchartdata={AssignByMeFilterData}
                                                        />
                                                    </TabPane>
                                                    <TabPane tab="Completed Tasks" key="Completed TaskUser">
                                                        <TaskCompletedChart
                                                            taskcompletedata={AssignByMeFilterData}
                                                        />
                                                    </TabPane>
                                                </Tabs>
                                            </TabPane>
                                        </Tabs>
                                    ) :
                                        <Tabs
                                            defaultActiveKey="1"
                                            className="mt-3"
                                            centered
                                            transition={false}
                                        >
                                            <TabPane tab="All Tasks" key="All Task">
                                                <TaskChart
                                                    taskchartdata={filterData}
                                                />
                                            </TabPane>
                                            <TabPane tab="All Completed Task" key="Completed Task">
                                                {/* <TaskCompletedChart
                                                    taskcompletedata={taskcompletedata}
                                                /> */}
                                                <TaskCompletedChart
                                                    taskcompletedata={filterData}
                                                />
                                            </TabPane>

                                        </Tabs>
                                }
                            </div>
                        </div>
                        <div className="col-lg-12 pinpin reminder-legend">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title w-100">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <h4>Task Calender</h4>
                                            </div>
                                            <div className='' style={{ cursor: 'pointer' }}>
                                                <Popover content={content} placement="left" trigger="hover" >
                                                    <BsInfoCircleFill  className='inform-legends' size={20}/>
                                                </Popover>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <Calender insertCalenderData={insertCalenderData} />
                            </div>
                        </div>

                    </div>
                </section>
            </div >

        </div >
    )
}

export default Dashboard