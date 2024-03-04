import React, { useEffect, useId, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import axios from 'axios'
import moment from 'moment';
import '../../style/Style.css'
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import Calender from '../workMaster/Calender'
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tag } from 'primereact/tag';
import InquiryDash from './InquiryDash';
import InquiryCalender from './InquiryCalender';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InqueryDashboardTable from './InqueryDashboardTable';
import AssignByMeInquiry from '../InquiryDashboard/AssignByMeInquiry';
import InquriryChart from '../../Charts/InquriryChart';
import InquriryCompltedChart from '../../Charts/InquiryCompltedChart';
import InquiryReport from './InquiryReport';
import InquiryUserChart from '../../Charts/InquiryUserChart';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'
import InquiryForm from '../Inquiry Master/InquiryForm';
import { Tabs, Popover, Form, Input, DatePicker, Tooltip, Space } from 'antd';
import { BsInfoCircleFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;


function InquiryNewForm(props) {
    const { fetchData, insertCalenderData, fetchAssignByMeData, insertChartData, fetchCompleteData, fetchReportData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <InquiryForm onHide={props.onHide} fetchData={fetchData} insertCalenderData={insertCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} />
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
                <InqueryDashboardTable InqueryData={InqueryData} />
            </Modal.Body>
        </Modal>
    );
}
function DashboardInquiry() {
    const insertData = React.useRef(null);
    const resetUserData = React.useRef(null);

    const [activeUser, setActiveUser] = React.useState([]);
    const [totalProject, setTotalProject] = useState([]);
    const [inquiryData, setInquiryData] = useState([]);
    const insertCalenderData = React.useRef(null);
    const insertChartData = React.useRef(null);
    const [inquirynew, setInquiryNew] = useState(false);
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const URL = process.env.REACT_APP_API_URL
    const userid = localStorage.getItem('CRMUserId')
    const [complated, setComplated] = React.useState(false);
    const [inqueryData, setInqueryData] = useState([])
    const [chartinqurydata, setChartinquryData] = useState([])
    const [completeinquiry, setCompleteinquiry] = useState([])
    const [report, setReport] = useState([])
    const [userReport, setuserReport] = useState([])
    const [statusinquery, setStatusInquery] = useState("")
    const [assignByMEChart, setAssignByMEChart] = useState([])
    const [userfilterData, setuserfilterData] = useState([])
    const [AssignByMeFilterData, setAssignByMeFilterData] = useState([])

    const Role = localStorage.getItem('CRMRole')

    // filter
    const [filter, setFilter] = useState(false)
    const fromDate = new Date()
    const formattedfrom = moment(fromDate).format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(formattedfrom)
    const formattedto = moment(fromDate).format('YYYY-MM-DD');
    const [todate, setTodate] = useState(formattedto)
    const [partyData, setPartyData] = useState([])
    const [party, setParty] = useState(0)
    const [taskStatus, setTaskStatus] = useState('')
    const [filterData, setFilterData] = useState([])
    const [masterData, setMasterData] = useState([]);
    const [selectedUser, setSelectedUser] = useState('')
    const resetData = React.useRef(null);
    const [open, setOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [projectname, setProjectname] = useState(0)
    const [category, setCategory] = useState(0)
    const [taxadmin, setTaxadmin] = useState(0)


    const [getprojectdata, setGetProjectData] = useState([])
    const [getcategorydata, setGetcategorydata] = useState([])
    const [gettaxadmindata, setGettaxadmindata] = useState([])

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };


    const handleClose = () => setFilter(false);
    const handleShow = () => setFilter(true);


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
        if(filter== true){
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
    const taskoptionsfilter = taskoptions.filter((remove)=>remove.Description != 'Hold' && remove.Description != 'Cancel')
    // console.log(taskoptionsfilter,'taskoptionsfilter')

    const TaskOptions = taskoptionsfilter.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    // const DataSubmit = async () => {
    //     try {
    //         // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=&AssignTo=${selectedUser}`, {
    //         //     headers: { Authorization: `bearer ${token}` }
    //         // })
    //         // setFilterData(res.data)
    //         // console.log(res.data, 'dataSubmit')
    //         // if (res.status == 200) {
    //         //     handleClose()
    //         // }
    //         if (Role == 'Admin') {
    //             const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=&AssignTo=${selectedUser}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setFilterData(res.data)
    //             // console.log(res,'dataSubmit')
    //             if (res.status == 200) {
    //                 handleClose()
    //             }
    //         }
    //         else {
    //             const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=${userid}&AssignTo=${selectedUser}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setFilterData(res.data)
    //             console.log(res, 'dataSubmit')
    //             if (res.status == 200) {
    //                 handleClose()
    //             }
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
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
    useEffect(() => {
    }, [])
    const projectOptions = getprojectdata.map((display) => ({
        value: display.Id,
        label: display.ProjectName,
    }));
    const getCategoryData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            // console.log(res, "res")
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
        getProjectData()
        getCategoryData()
        getTaxadmindata()
    }, [])

    const UserFilter = async () => {
        try {
            // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task`, {
            const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=&AssignTo=${userid}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeFilterData(res.data)
            // console.log(res,'UserdataSubmit')
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
                const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=&AssignTo=${selectedUser}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                // console.log(res, 'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }
            else {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Task&AssignBy=${userid}&AssignTo=${selectedUser}`, {
                const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=${fromdate}&endDate=${todate}&CompanyId=${companyId}&Type=Deal&AssignBy=${userid}&AssignTo=${selectedUser}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                UserFilter()
                // console.log(res,'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    // const resetRecord = () => {
    //     resetData.current()
    //     InqueryMainData()
    //     AssignByMeTaskData()
    //     if(Role!='Admin'){
    //         // resetUserData.current()
    //     }
    //     handleClose()
    // }
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
        InqueryMainData()
        // handleClose()
        if (Role != 'Admin') {
            // resetUserData.current()
        }
    }
    const InqueryMainData = async()=>{
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=&startdate=&endDate=&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? ' ' : ' '}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                fetchReportData()
                fetchUserReportData()
                // console.log(res.data, 'InquiryData')
                // console.log(res,'dataSubmit')
                if (res.status == 200) {
                    handleClose()
                }
            }
            else {
                // const res = await axios.get(URL + `/api/Master/DashboardTaskList?PartyId=${party}&TaskStatus=${taskStatus}&startdate=&endDate=&CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=${userid}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setFilterData(res.data)
                fetchReportData()
                fetchUserReportData()
                // console.log(res.data, 'InquiryData')
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
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeFilterData(res.data)
            fetchUserReportData()
            // console.log(res.data, 'taskData')
            // console.log(res,'dataSubmit')
            if (res.status == 200) {
                handleClose()
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        InqueryMainData()
        AssignByMeTaskData()
    }, [])
   
    const userData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setActiveUser(res.data)
            // console.log(res.data, 'listtt')
        } catch (error) {
            console.log(error)
        }
    }
    const userlist = activeUser.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName
    }))

    const completedProject = totalProject.filter((value) => value.Status === "Pending");

    const inquiry_Data = async () => {
        try {
            if (Role == "Admin") {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setInquiryData(res.data)
            } else {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setInquiryData(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const runninginquiry = filterData.filter((value) => value.TaskStatus === "InProgress");
    const pendinginquiry = filterData.filter((value) => value.TaskStatus === "Pending");
    const completedinquiry = filterData.filter((value) => value.TaskStatus === "Complete");

    const groupedInquiry = {};

    runninginquiry.forEach((inquiry) => {
        const projectName = inquiry.ProjectName;
        if (!groupedInquiry[projectName]) {
            groupedInquiry[projectName] = [];
        }
        groupedInquiry[projectName].push(inquiry);
    });

    useEffect(() => {
        // inquiry_Data()
        userData()
    }, [])

    // const handleInqueryData = (inquiryData, inquiryType) => {
    //     setComplated(true)
    //     setInqueryData(inquiryData)
    //     setStatusInquery(inquiryType)
    // }
    const handleData = (data) => {
        setInquiryData(data)
    }

    // All Inquiry
    const fetchData = async () => {
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                // console.log(res, "response")
                setChartinquryData(res.data)

            }
            else {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setChartinquryData(res.data)
                // console.log('responseUser',res.data)
            }
            // setInquiryData(res.data);
            // console.log(res.data, 'datasforcharts');
        } catch (error) {
            console.log(error);
        }
    };
    // Completed Inquiry
    const fetchCompleteData = async () => {
        try {
            if (Role == 'Admin') {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                    // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setCompleteinquiry(res.data)
            }
            else {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
                    // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setCompleteinquiry(res.data)
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAssignByChart = async () => {
        try {

            // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
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
    // Summery Report
    const fetchReportData = async () => {
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/TaskSummary?Type=Deal&CompanyId=${companyId}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setReport(res.data)
            }
            else {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/TaskSummaryUser?CompanyId=${companyId}&Type=Deal&AssignTo=${userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setReport(res.data)
            }

        } catch (error) {
            console.log(error);
        }
    };
    const fetchUserReportData = async () => {
        try {


            // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
            const res = await axios.get(URL + `/api/Master/TaskSummaryAssignByme?CompanyId=${companyId}&Type=Deal&AssignBy=${userid}`, {
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
        // fetchCompleteData()
        fetchReportData()
        fetchUserReportData()
    }, []);
    // const filterPop = () => {
    //     return (
    //         <div>
    //             <Form
    //                 name="basic"
    //                 labelCol={{
    //                     span: 6,
    //                 }}
    //                 wrapperCol={{
    //                     span: 16,
    //                     offset:4
    //                 }}
    //                 style={{
    //                     maxWidth: 600,
    //                 }}
    //             >

    //                 <Form.Item name="range-picker" className='mt-4' label="Select Date" >
    //                     <RangePicker onChange={handleRangePickerChange} />
    //                 </Form.Item>

    //                 <Form.Item
    //                     label="Select Party"
    //                     name="Select Party"
    //                 >
    //                     <Select
    //                         className='w-100'
    //                         options={partyOptions}
    //                         value={partyOptions.find((option) => option.value == party)}
    //                         onChange={(selected) => {
    //                             setParty(selected.value)
    //                             // if (errors.party) {
    //                             //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
    //                             // }
    //                         }}
    //                         placeholder="Select Party"
    //                     />
    //                 </Form.Item>
    //                 <Form.Item
    //                     label="Select Status"
    //                     name="Select Status"
    //                 >
    //                     <Select
    //                         className='w-100'
    //                         options={TaskOptions}
    //                         value={TaskOptions.find((option) => option.value == taskStatus)}
    //                         onChange={(selected) => {
    //                             setTaskStatus(selected.value)
    //                             // if (errors.party) {
    //                             //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
    //                             // }
    //                         }}
    //                         placeholder="Select Status"
    //                     />
    //                 </Form.Item>
    //                 <Form.Item
    //                     label="Assign To"
    //                     name="Select Assign To"
    //                     className='mt-4'
    //                 >
    //                     <Select
    //                         className='w-100'
    //                         options={userlist}
    //                         value={userlist.find((option) => option.value == selectedUser)}
    //                         onChange={(selected) => {
    //                             setSelectedUser(selected.value)
    //                         }}
    //                         placeholder="Select User"
    //                     />
    //                 </Form.Item>
    //                 <Form.Item
    //                     wrapperCol={{
    //                         xs: {
    //                             span: 24,
    //                             offset: 0,
    //                         },
    //                         sm: {
    //                             span: 16,
    //                             offset: 8,
    //                         },
    //                     }}
    //                 >
    //                     <Button className='ms-2' onClick={resetRecord}>
    //                         Reset
    //                     </Button>
    //                     <Button variant="primary" className='m-4' onClick={DataSubmit}>
    //                         Submit
    //                     </Button>
    //                 </Form.Item>
    //             </Form>
    //         </div>
    //     )
    // }
    const content = (
        <div>
           <p><i class="fa fa-circle" style={{color:'#54B435'}} aria-hidden="true"></i> - Completed</p>
           <p><i class="fa fa-circle" style={{color:'#FF9800'}} aria-hidden="true"></i> - Pending</p>
           <p><i class="fa fa-circle" style={{color:'#0174BE'}} aria-hidden="true"></i> - InProgress</p>
           <p><i class="fa fa-circle" style={{color:'#720455'}} aria-hidden="true"></i> - Hold</p>
           <p><i class="fa fa-circle" style={{color:'#f5222d'}} aria-hidden="true"></i> - Cancel</p>
        </div>
    );
    return (
        <div>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="header-icon">
                        <i class="fa fa-search" style={{ fontSize: "30px", marginTop: "10px", marginLeft: "20px" }}></i>
                    </div>

                    <div className='headeradjust'>
                        <div className="header-title">
                            <h1>Inquiry Dashboard</h1>
                            {/* <small>Task details</small> */}
                        </div>
                        {/* <Button className="btn btn-add rounded-2" onClick={() => setInquiryNew(true)}>
                                Add Inquiry <i class="fa fa-plus" aria-hidden="true"></i>
                            </Button> */}

                        <InquiryNewForm
                            show={inquirynew}
                            onHide={() => setInquiryNew(false)}
                            fetchData={insertData.current}
                            insertCalenderData={insertCalenderData}
                            // fetchAssignByMeData={fetchAssignByMeData}
                            insertChartData={insertChartData}
                            fetchCompleteData={fetchCompleteData}
                            fetchReportData={fetchReportData}
                        />
                          <Tooltip title='Filter'>
                                {/* <i class="fa fa-filter fa-2x"  style={{cursor:'pointer'}}></i> */}
                                <FaFilter size={25} onClick={handleShow} style={{cursor:'pointer'}}/>
                          </Tooltip>
                    
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
                                                <input type='date' className='form-control w-100' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
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
                                                    isClearable
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
                <section className='content footer-section-form-padding p-4'>
                    <div className="row">
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox4" className='cardbox4
                             square-box'>
                                <div className="statistic-box">
                                    <i className="fa fa-pencil-square-o fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{filterData.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>All Inquiry</h3>
                                </div>
                            </div>
                        </div>

                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox1" className='cardbox4
                             square-box' >
                                <div className="statistic-box">
                                    <i class="fa fa-pause-circle fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{pendinginquiry.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>Pending Inquiry</h3>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox2" className='cardbox4
                             square-box'>
                                <div className="statistic-box">
                                    <i class="fa fa-crosshairs fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{runninginquiry.length}</span>
                                        <span className="slight">
                                        </span>
                                    </div>
                                    <h3>Running Inquiry</h3>
                                </div>
                            </div>
                        </div>
                        <div className=" col-sm-6 col-md-6 col-lg-3">
                            <div id="cardbox3" className='cardbox4
                             square-box'>
                                <div className="statistic-box">
                                    <i class="fa fa-trophy fa-3x" aria-hidden="true"></i>
                                    <div className="counter-number pull-right">
                                        <span className="count-number fs-1">{completedinquiry.length}</span>
                                        <span className="slight"> </span>
                                    </div>
                                    <h3> Completed Inquiry</h3>
                                </div>
                            </div>
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
                                        <h4>Inquiry List</h4>
                                    </div>
                                </div>
                                {
                                    Role == 'Admin' ? (
                                        <InquiryDash resetData={resetData} filterData={filterData} insertData={insertData} ondata={handleData} insertCalenderData={insertCalenderData.current} insertChartData={fetchData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} InqueryMainData={InqueryMainData}/>
                                    ) :
                                        <div className="worklistdate p-2">
                                            <Tabs defaultActiveKey="home"
                                                transition={true}>
                                                <TabPane tab='My Inquiry' key='muinq'>
                                                    <InquiryDash resetData={resetData} filterData={filterData} insertData={insertData} ondata={handleData} insertCalenderData={insertCalenderData.current} insertChartData={fetchData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} InqueryMainData={InqueryMainData} />
                                                </TabPane>
                                                <TabPane tab='Assign BY ME' key='assigninc'>
                                                    <AssignByMeInquiry resetUserData={resetUserData} filterData={AssignByMeFilterData} insertData={insertData} ondata={handleData} insertCalenderData={insertCalenderData.current} insertChartData={fetchData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchUserReportData} fetchAssignByChart={fetchAssignByChart} InqueryMainData={InqueryMainData} AssignByMeTaskData={AssignByMeTaskData} />
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                }
                                {/* <Tabs
                                    defaultActiveKey="1"
                                    id="noanim-tab-example"
                                    className="mt-3"
                                >
                                    <Tab eventKey="1" title="My Inquiry">
                                        <div className="card-body">
                                            <div className="Workslist">
                                                <div className="worklistdate">
                                                    <InquiryDash resetData={resetData} filterData={filterData} insertData={insertData} ondata={handleData} insertCalenderData={insertCalenderData.current} insertChartData={fetchData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} />
                                                </div>
                                            </div>
                                        </div>
                                    </Tab>
                                    {
                                        Role != "Admin" ? (<Tab eventKey='2' title='AssignByMe Inquiry' className="mt-3">
                                            <AssignByMeInquiry insertData={insertData} ondata={handleData} insertCalenderData={insertCalenderData.current} insertChartData={fetchData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} />
                                        </Tab>) : null
                                    }

                                </Tabs> */}

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {/* {
                            Role == 'Admin' ? (
                                <div className="col-lg-12 pinpin">
                                <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                    <div className="card-header">
                                        <div className="card-title custom_title">
                                            <h4>Inquiry Report</h4>
                                        </div>
                                    </div>
                                    <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={report}/>
                                </div>
                            </div>
                            ): null
                        }                */}
                        <div className="col-lg-7 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true" 
                            // style={{height: "724px"}}
                            >
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Inquiry Report</h4>
                                    </div>
                                </div>
                                {/* <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={report} /> */}
                                {
                                    Role == 'Admin' ? (
                                        <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={report} />

                                    ) :

                                        <div className='p-2'>
                                            <Tabs defaultActiveKey="44"
                                                transition={false}
                                            >
                                                <TabPane tab='My Report' key='My'>
                                                    <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={report} />
                                                </TabPane>
                                                <TabPane tab='Assign BY ME Report' key='AssignByMe'>
                                                    <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={userReport} />
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    // <Tabs>
                                    //     <Tab eventKey='Myreport' title='My Task'>
                                    //         <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={report} />
                                    //     </Tab>
                                    //     <Tab eventKey='userreport' title='Assign By Me'>
                                    //         <InquiryReport chartinqurydata={chartinqurydata} completeinquiry={completeinquiry} report={userReport} />
                                    //     </Tab>
                                    // </Tabs>
                                }

                            </div>
                        </div>
                        <div className="col-lg-5 pinpin">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Inquiry Chart</h4>
                                    </div>
                                </div>
                                {
                                    Role != 'Admin' ? (
                                        <Tabs
                                            defaultActiveKey="54"
                                            className="mt-3"
                                            centered
                                        >
                                            <TabPane tab='My Inquiry' key='mychart'>
                                                <InquiryUserChart chartinqurydata={filterData} />
                                            </TabPane>
                                            <TabPane tab='Assign BY ME Inquiry' key='assignbyme'>
                                                <Tabs efaultActiveKey="55"
                                                    centered>
                                                    <TabPane tab="All Inquiry" key="AllUserCharts">
                                                        <InquriryChart chartinqurydata={AssignByMeFilterData} />
                                                    </TabPane>
                                                    <TabPane tab="Completed Inquiry" key="Completed TaskUser">
                                                        <InquriryCompltedChart completeinquiry={AssignByMeFilterData} />
                                                    </TabPane>
                                                </Tabs>
                                            </TabPane>
                                        </Tabs>

                                        // <Tabs>
                                        //     <Tab eventKey='Mytask' title='My Task'>
                                        //         <InquiryUserChart chartinqurydata={chartinqurydata} />
                                        //     </Tab>
                                        //     <Tab eventKey='assignbyme' title='AssignByMe'>
                                        //         <Tabs
                                        //             defaultActiveKey="1"
                                        //             id="noanim-tab-example"
                                        //             className="mt-3"
                                        //         >
                                        //             <Tab eventKey="1" title="All Inquiry">
                                        //                 <InquriryChart chartinqurydata={assignByMEChart} />
                                        //             </Tab>
                                        //             <Tab eventKey="2" title="Completed Inquiry">
                                        //                 <InquriryChart chartinqurydata={assignByMEChart} />
                                        //             </Tab>
                                        //         </Tabs>
                                        //     </Tab>
                                        // </Tabs>
                                    ) :
                                        <Tabs
                                            defaultActiveKey="1"
                                            id="noanim-tab-example"
                                            className="mt-3"
                                            centered
                                        >
                                            <TabPane tab="All Inquiry" title="All Task">
                                                <InquriryChart chartinqurydata={filterData} />
                                            </TabPane>
                                            <TabPane tab="All Completed Inquiry" key="Completed Task">
                                                <InquriryCompltedChart completeinquiry={filterData} />
                                            </TabPane>

                                        </Tabs>
                                    // <Tabs
                                    //     defaultActiveKey="1"
                                    //     id="noanim-tab-example"
                                    //     className="mt-3"
                                    // >
                                    //     <Tab eventKey="1" title="All Inquiry">
                                    //         <InquriryChart chartinqurydata={chartinqurydata} />
                                    //     </Tab>
                                    //     <Tab eventKey="2" title="Completed Inquiry">
                                    //         <InquriryCompltedChart completeinquiry={completeinquiry} />
                                    //     </Tab>
                                    // </Tabs>
                                }
                            </div>
                        </div>
                        <div className="col-lg-12 pinpin reminder-legend">
                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                            <div className="card-header">
                                <div className="card-title custom_title w-100">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4>Inquiry Calender</h4>
                                    </div>
                                    <div className='' style={{ cursor: 'pointer' }}>
                                        <Popover content={content} placement="left" trigger="hover">
                                            <BsInfoCircleFill  className='inform-legends' size={20}/>
                                        </Popover>
                                    </div>
                                </div>

                            </div>
                                </div>
                                <InquiryCalender insertCalenderData={insertCalenderData} />
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div >
    )
}

export default DashboardInquiry