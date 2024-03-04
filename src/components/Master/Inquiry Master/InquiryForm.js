import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import moment from 'moment'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { notification } from 'antd';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import { FiMoreHorizontal } from 'react-icons/fi';
import CategoryMaster from '../categoryMaster/CategoryMaster';
import PartyMaster from '../PartyMaster/PartyMaster';
import ProjectMaster from "../projectMaster/ProjectMaster"
import { Drawer } from 'antd';
import { Button } from 'react-bootstrap';
import { GrPowerReset } from "react-icons/gr";
import { Space, Tooltip } from 'antd';

// Form validation Schema start
const validationSchema = Yup.object().shape({
    // projectname: Yup.string().required("Please select Module name"),
    TaskName: Yup.string().required("Inquiry Name is required"),
    assignBy: Yup.string().required("Please select by whom the Inquiry is assigned"),

    assignTo: Yup.string().min(1, "Please select whom you want to assign the Inquiry").required("Please select whom you want to assign the Inquiry"),
    priority: Yup.string().required("Please select Inquiry priority"),
    category: Yup.string().required("Please select Category"),
    // taxadmin: Yup.string().required("Please select Sub-Category"),
    // formdate: Yup.string().required("Please select Starting date of task"),
    todate: Yup.string().required("Please select Ending date of Inquiry"),
    taskStatus: Yup.string().required('Task status is required'),
    remark1: Yup.string().when('taskStatus', {
        is: (taskStatus) => taskStatus === 'Hold' || taskStatus === 'Cancel',
        then: () => Yup.string().required('Remark1 is required when task status is Hold or Cancel'),
        otherwise: () => Yup.string()
    }),
    party: Yup.string().required("Please select Party"),
    // Add validation schema for other fields,
});
// Form validation Schema end

function CategoryNew(props) {
    const { getCategoryData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <CategoryMaster getCategoryData={getCategoryData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}

function ProjectNew(props) {
    const { getProjectData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <ProjectMaster getProjectData={getProjectData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}



// function CategoryNew(props) {
//     const { getCategoryData, onClose } = props;
//     const errorData = React.useRef(null);
//     return (
//         <Drawer
//             {...props}
//             title="Add Category"
//             placement="right"
//             // onClose={() => {
//             //     // Call resetErrors when the drawer is closed
//             //     onClose();
//             // }}
//             visible={props.visible}
//             width="62vw"
//         >
//             {/* <Modal.Body> */}
//             <CategoryMaster getCategoryData={getCategoryData} onHide={props.onHide} errorData={errorData}/>
//             {/* </Modal.Body> */}
//         </Drawer>
//     );
// }

function PartyNew(props) {
    const { getPartyData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <PartyMaster getPartyData={getPartyData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
// function PartyNew(props) {
//     const { getPartyData, onClose } = props;
//     const errorData = React.useRef(null);
//     return (
//         <Drawer
//         {...props}
//         title="Add Party"
//         placement="right"
//         // onClose={() => {
//         //     // Call resetErrors when the drawer is closed
//         //     onClose();
//         // }}
//         visible={props.visible}
//         width="75vw"
//         >
//             {/* <Modal.Body> */}
//             <PartyMaster getPartyData={getPartyData} onHide={props.onHide} errorData={errorData}/>
//             {/* </Modal.Body> */}
//         </Drawer>
//     );
// }

const InquiryForm = ({ onHide, rowData, fetchData, insertCalenderData, fetchAssignByMeData, user, insertChartData, fetchCompleteData, fetchReportData, fetchAssignByChart, InqueryMainData, AssignByMeTaskData }) => {

    // const InquiryForm = ({ onHide, rowData, fetchData, insertCalenderData, fetchAssignByMeData, errorData, reset_Data }) => {

    // React.useEffect(() => {
    //     if (errorData) {
    //         errorData.current = resetErrors
    //     }
    // }, [])
    // React.useEffect(() => {
    //     if (reset_Data) {
    //         reset_Data.current = resetData
    //     }
    // }, [])

    const [inquiryID, setInquiryID] = useState(-1)
    const [partyModal, setPartyModal] = useState(false)
    const [categoryModal, setCategoryModal] = useState(false)
    const [TaskName, setTaskName] = useState("")
    const [assignBy, setAssignBy] = useState("")
    const [assignTo, setAssignTo] = useState("")
    const [priority, setPriority] = useState("High")
    const [taskStatus, setTaskStatus] = useState("Pending")
    const [category, setCategory] = useState('')
    const [getuserdata, setGetuserData] = useState([])
    const [getcategorydata, setGetcategorydata] = useState([])
    const [masterData, setMasterData] = useState([]);
    const [errors, setErrors] = useState({});
    const [remark1, setRemark1] = useState("");
    const [remark2, setRemark2] = useState("");
    const [remark3, setRemark3] = useState("");
    const [ipaddress, setIpAddress] = useState('')
    const toDayDate = new Date()
    const formattedDateToDay = moment(toDayDate).format('yyyy-MM-DD');
    const [formdate, setFormDate] = useState(formattedDateToDay);
    const formattedDateToDate = moment(toDayDate).format('yyyy-MM-DD');
    const [todate, setToDate] = useState(formattedDateToDate);
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const custId = localStorage.getItem('CRMCustId')
    const userid = localStorage.getItem('CRMUserId')
    const userName = localStorage.getItem('CRMUsername')
    const CompnyId = localStorage.getItem('CRMCompanyId')
    const role = localStorage.getItem('CRMRole')
    const [isSubCategorySelected, setIsSubCategorySelected] = useState(false);
    const [getassignuserdata, setGetAssignuserData] = useState([])
    const [partyData, setPartyData] = useState([])
    const [party, setParty] = useState("")
    const [cguid, setCguid] = useState("")
    const [ticketno, setTicketNo] = useState("")
    const [Prefix, setPrefix] = useState("I")
    const [loading, setLoading] = useState(false);
    const [projectlist, setProjectList] = useState([])
    const [selectedproject, setSelectedProject] = useState("")
    const [projectModal, setProjectModal] = useState(false)
    let firstUserSelected;
    let PartyID;
    // const resetErrors = () => {
    //     setErrors({});
    // };

    const resetData = () => {
        setParty("");
        setTaskName("");
        setAssignBy("");
        setAssignTo("");
        setPriority("");
        setTaskStatus("");
        setCategory("");
        setFormDate(formattedDateToDay);
        setToDate(formattedDateToDate);
        setRemark1("");
        setRemark2("");
        setRemark3("");
        // setRemark1(null);
    }

    useEffect(() => {
        if (rowData) {
            setCguid(rowData.Cguid)
            // setProjectname(rowData.ProjectId)
            setParty(rowData.PartyId)
            setTaskName(rowData.TaskName)
            setAssignBy(rowData.AssignBy)
            setAssignTo(rowData.AssignTo)
            setPriority(rowData.Priority)
            setTaskStatus(rowData.TaskStatus)
            setCategory(rowData.CategoryId)
            // setTaxadmin(rowData.TaxadminId)
            const fromDayDate = rowData.FromDate
            const formattedDatefrom = moment(fromDayDate).format('yyyy-MM-DD');
            setFormDate(formattedDatefrom)
            const toDayDate = rowData.ToDate
            const formattedDatetodate = moment(toDayDate).format('yyyy-MM-DD');
            setToDate(formattedDatetodate)
            setRemark1(rowData.Remark1)
            setRemark2(rowData.Remark2)
            setRemark3(rowData.Remark3)
            setInquiryID(rowData.Id)
            setTicketNo(rowData.TicketNo)
            setPrefix(rowData.Prefix)
            setSelectedProject(rowData.ProjectId)

        }
    }, [rowData])

    const getCategoryData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setGetcategorydata(res.data);
        } catch (error) {
            // Handle error
        }
    };

    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${custId}&CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setPartyData(res.data);
            PartyID = res.data[0].PartyId
            if (!rowData) {
                setParty(PartyID)
            }
        } catch (error) {
            // Handle error
        }
    };

    const handleCategoryChange = (selected) => {
        setCategory(selected.value);
        setIsSubCategorySelected(false); // Allow changes to Sub-Category
        if (errors.category) {
            setErrors((prevErrors) => ({ ...prevErrors, category: '' }));
        }
    };

    const categoryFilter = getcategorydata.filter((display) => display.ProjectID == selectedproject || display.ProjectID == 0);
    const activeCategory = categoryFilter.filter((display) => display.IsActive === true);
    const categoryOptions = activeCategory.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));

    // const categoryOptions = getcategorydata.map((display) => ({
    //     value: display.Id,
    //     label: display.CategoryName,
    // }));

    const getassigndata = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/UsermstList`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetAssignuserData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getUserData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetuserData(res.data)
            firstUserSelected = res.data[0].Id;
            if (!rowData) {
                setAssignBy(firstUserSelected, "assignBy")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchMasterData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            })
            setMasterData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setProjectList(res.data)
            if (!rowData) {
                setSelectedProject(res.data[0].Id)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getTicketNo = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetTaskAddonList?CompanyID=${CompnyId}&Type=Deal`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setTicketNo(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    useEffect(() => {
        getUserData()
        getassigndata()
        getPartyData();
        getCategoryData();
        getProjectData()
        fetchMasterData()
        fetchIPAddress()
        if (!rowData) {
            getTicketNo()
        }
    }, [])

    const projectOption = projectlist.map((display) => ({
        value: display.Id,
        label: display.ProjectName,
    }))

    const options = masterData.filter((display) => display.Remark === "Priority");
    const PriorityOptions = options.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))

    const partyOptions = partyData.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));

    const taskoptions = masterData.filter((display) => display.Remark === "TaskStatus");
    const TaskOptions = taskoptions.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    const defaultTaskStatusOption = taskoptions.filter(option => option.Description === "InProgress");

    getuserdata.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
    const activeUser = getuserdata.filter((display) => display.IsActive === true);
    const userOptions = activeUser.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName
    }));

    const assignByOptions = getuserdata.map((display) => ({
        value: display.Id,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    className="avatar"
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        // backgroundColor: getRandomColor(), // Generate a random background color
                        backgroundColor: 'gray',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                    }}
                >
                    {display.FirstName.charAt(0).toUpperCase()}
                </div>
                {display.FirstName + ' ' + display.LastName}
            </div>
        ),
    }));

    const userFilter = getuserdata.filter((display) => display.UserName == userName);

    const assignoption = userFilter.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName
        // label: (<div style={{ display: 'flex', alignItems: 'center' }}>
        //     <div
        //         className="avatar"
        //         style={{
        //             width: '30px',
        //             height: '30px',
        //             borderRadius: '50%',
        //             // backgroundColor: getRandomColor(), // Generate a random background color
        //             backgroundColor: 'gray',
        //             color: 'white',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //             marginRight: '10px',
        //         }}
        //     >
        //         {display.FirstName.charAt(0).toUpperCase()}
        //     </div>
        //     {display.FirstName + ' ' + display.LastName}
        // </div>)
    }))

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                TaskName,
                category,
                taskStatus,
                assignBy,
                assignTo,
                priority,
                remark1,
                todate,
                party
            }, { abortEarly: false });
            setLoading(true);
            if (inquiryID >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateTask", {
                    Flag: "U",
                    "task": {
                        // Id: inquiryID,
                        Cguid: cguid,
                        TaskName: TaskName,
                        UserId: userid,
                        PartyId: party,
                        CompanyId: CompnyId,
                        TaskStatus: taskStatus,
                        CategoryId: category,
                        Type: "Deal",
                        // AssignBy: (role == 'Admin' ? assignBy : userid),
                        AssignBy: assignBy,
                        AssignTo: assignTo,
                        FromDate: formdate,
                        ToDate: todate,
                        Remark1: remark1,
                        Remark2: remark2,
                        Remark3: remark3,
                        Priority: priority,
                        CustId: custId,
                        ProjectId: selectedproject,
                        Prefix: Prefix,
                        TicketNo: ticketno,
                        IPAddress: ipaddress,
                        UserName: userName
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    // fetchData()
                    fetchData();
                    // resetData();
                    onHide();
                    if (insertCalenderData) {
                        insertCalenderData()
                    }
                    if (fetchAssignByMeData) {
                        fetchAssignByMeData()
                    }
                    if (insertChartData) {
                        insertChartData()
                    }
                    if (fetchCompleteData) {
                        fetchCompleteData()
                    }
                    if (fetchReportData) {
                        fetchReportData()
                    }
                    if (fetchAssignByChart) {
                        fetchAssignByChart()
                    }
                    if (fetchCompleteData) {
                        fetchCompleteData()
                    }
                    if (InqueryMainData) {
                        InqueryMainData()
                    }
                    if (AssignByMeTaskData) {
                        AssignByMeTaskData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateTask", {
                    Flag: "A",
                    "task": {
                        TaskName: TaskName,
                        UserId: userid,
                        PartyId: party,
                        CompanyId: CompnyId,
                        TaskStatus: taskStatus,
                        CategoryId: category,
                        Type: "Deal",
                        AssignBy: (role == 'Admin' ? assignBy : userid),
                        AssignTo: assignTo,
                        FromDate: formdate,
                        ToDate: todate,
                        Remark1: remark1,
                        Remark2: remark2,
                        Remark3: remark3,
                        Priority: priority,
                        CustId: custId,
                        ProjectId: selectedproject,
                        Prefix: Prefix,
                        TicketNo: ticketno,
                        IPAddress: ipaddress,
                        UserName: userName
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData();
                    // resetData();
                    onHide();
                    if (insertCalenderData) {
                        insertCalenderData()
                    }
                    if (fetchAssignByMeData) {
                        fetchAssignByMeData()
                    }
                    if (insertChartData) {
                        insertChartData()
                    }
                    if (fetchCompleteData) {
                        fetchCompleteData()
                    }
                    if (fetchReportData) {
                        fetchReportData()
                    }
                    if (fetchAssignByChart) {
                        fetchAssignByChart()
                    }
                    if (fetchCompleteData) {
                        fetchCompleteData()
                    }
                    if (InqueryMainData) {
                        InqueryMainData()
                    }
                    if (AssignByMeTaskData) {
                        AssignByMeTaskData()
                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            const validationErrors = {};
            if (error.inner && Array.isArray(error.inner)) {
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectModal == false && categoryModal == false && partyModal == false) {
            const handleKeyDown = (event) => {
                if (event.key === 'F9') {
                    event.preventDefault();
                    DataSubmit();
                }
            };

            // Add event listener when the component mounts
            window.addEventListener('keydown', handleKeyDown);

            // Remove event listener when the component unmounts
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [projectModal, categoryModal, partyModal, inquiryID, TaskName, category, taskStatus, assignBy, priority, assignTo, formdate, todate, selectedproject, party, TaskName, remark1, remark2, remark3, ticketno]); // Add any other dependencies as needed


    const loggedInUser = {
        value: userName,  // Replace with the actual user ID
        label: userName,  // Replace with the user's name or identifier
    };
    const userOptions1 = [loggedInUser];

    const HandlePriorityChange = (selectoption) => {
        setPriority(selectoption.value);
        if (errors.priority) {
            setErrors(prevErrors => ({ ...prevErrors, priority: '' }));
        }
    }

    const HandleTaskStatusChange = (selectoption) => {
        setTaskStatus(selectoption.value);
        if (errors.taskStatus) {
            setErrors(prevErrors => ({ ...prevErrors, taskStatus: '' }));
        }
    }
    function CustomOption({ innerProps, label }) {
        return <div {...innerProps}>{label}</div>;
    }
    const handleSelect = (selected) => {
        setAssignTo(selected.map((option) => option.value))
        const assigntask = selected.map((option) => option.value).join(',')
        setAssignTo(assigntask)
        if (errors.assignTo) {
            setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
        }
    }
    const handleAssignBySelect = (selected) => {
        setAssignBy(selected.map((option) => option.value))
        const assigntask = selected.map((option) => option.value).join(',')
        setAssignBy(assigntask)
        // if (errors.assignTo) {
        //     setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
        // }
    }
    
    useEffect(() => {
        let firstDate = moment(formdate);
        let secondDate = moment(todate);
        if (!(firstDate <= secondDate)) {
          setToDate(formdate);
        } 
    },[formdate])
    return (
        <div>
            <div className='form-border'>
                {/* Content Header (Page header) */}
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Add Inquiry</h1>
                            {/* <small>Inquiry List</small> */}
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
                {/* Main content */}
                <div className="">
                    <div className="row">
                        {/* Form controls */}
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className="col-sm-12">
                                    <Row>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                <label>Ticket No:</label>
                                                <input type="text" disabled className="form-control" value={Prefix + ticketno} />
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                <label>Project Name :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className="w-100"
                                                        options={projectOption}
                                                        value={selectedproject ? projectOption.find((option) => option.value === selectedproject) : null}
                                                        onChange={(selectedProject) => {
                                                            setSelectedProject(selectedProject ? selectedProject.value : '');
                                                            setCategory('');
                                                            if (errors.projectname) {
                                                                setErrors(prevErrors => ({ ...prevErrors, projectname: '' }));
                                                            }
                                                        }}
                                                        placeholder="Select Project"
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setProjectModal(true)} />
                                                        <ProjectNew
                                                            show={projectModal}
                                                            onHide={() => setProjectModal(false)}
                                                            getProjectData={getProjectData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                <label>Category Name :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className="w-100"
                                                        options={categoryOptions}
                                                        // value={categoryOptions.find((option) => option.value === category)}
                                                        value={category ? categoryOptions.find((option) => option.value === category) : null}
                                                        // onChange={handleCategoryChange}
                                                        onChange={(selected) => {
                                                            setCategory(selected ? selected.value : '');
                                                            // setIsSubCategorySelected(false); // Allow changes to Sub-Category
                                                            if (errors.category) {
                                                                setErrors((prevErrors) => ({ ...prevErrors, category: '' }));
                                                            }
                                                        }}
                                                        placeholder="Select Category"
                                                    // isDisabled={isSubCategorySelected} // Disable if Sub-Category is selected
                                                    />

                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setCategoryModal(true)} />
                                                        <CategoryNew
                                                            show={categoryModal}
                                                            onHide={() => setCategoryModal(false)}
                                                            getCategoryData={getCategoryData}
                                                        />
                                                        {/* <CategoryNew
                                                            visible={categoryModal}
                                                            onHide={() => setCategoryModal(false)}
                                                            getCategoryData={getCategoryData}
                                                        /> */}
                                                    </div>
                                                </div>
                                                {errors.category && (
                                                    <div className="error-message text-danger">{errors.category}</div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Party :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={partyOptions}
                                                        value={partyOptions.find((option) => option.value == party)}
                                                        onChange={(selected) => {
                                                            setParty(selected.value)
                                                            if (errors.party) {
                                                                setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                            }
                                                        }}
                                                        placeholder="Select Party"
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setPartyModal(true)} />
                                                        <PartyNew
                                                            show={partyModal}
                                                            onHide={() => setPartyModal(false)}
                                                            getPartyData={getPartyData}
                                                        />
                                                        {/* <PartyNew
                                                            visible={partyModal}
                                                            onHide={() => setPartyModal(false)}
                                                            getPartyData={getPartyData}
                                                        /> */}
                                                    </div>
                                                </div>
                                                {errors.party && <div className="error-message text-danger">{errors.party}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">
                                        <label>Inquiry Name :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" value={TaskName} placeholder="Enter Inquiry Name" onChange={(event) => {
                                            // const input = event.target.value;
                                            // const capitalLetters = input.toUpperCase();
                                            setTaskName(event.target.value)
                                            if (errors.TaskName) {
                                                setErrors(prevErrors => ({ ...prevErrors, TaskName: '' }));
                                            }
                                        }} />
                                        {errors.TaskName && <div className="error-message text-danger">{errors.TaskName}</div>}
                                    </div>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Remark-1</label>
                                                <textarea className="form-control" rows="2" placeholder="Enter Remark" value={remark1} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const capitalLetters = input.toUpperCase();
                                                    setRemark1(capitalLetters);
                                                    if (errors.remark1) {
                                                        setErrors((prevErrors) => ({ ...prevErrors, remark1: '' }));
                                                    }
                                                }}
                                                />
                                                {errors.remark1 && <div className="error-message text-danger">{errors.remark1}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Remark-2</label>
                                                <textarea className="form-control" rows="2" placeholder="Enter Remark" value={remark2} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const capitalLetters = input.toUpperCase();
                                                    setRemark2(capitalLetters);
                                                }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label>Remark-3</label>
                                                <textarea className="form-control" rows="2" placeholder="Enter Remark" value={remark3} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const capitalLetters = input.toUpperCase();
                                                    setRemark3(capitalLetters);
                                                }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">

                                        {role == 'Admin' ? (

                                            <label>Assign By :<span className='text-danger'>*</span></label>
                                        ) : null}
                                        {role === 'Admin' ? (
                                            <Select
                                                className='w-100'
                                                options={userOptions}
                                                // isDisabled={rowData ? true : false}
                                                // value={assignoption.find((option) => option.value === assignBy)}
                                                value={userOptions.find((option) => option.value == assignBy)}
                                                isSearchable={true}
                                                onChange={(selected) => {
                                                    setAssignBy(selected.value);
                                                    if (errors.assignBy) {
                                                        setErrors(prevErrors => ({ ...prevErrors, assignBy: '' }));
                                                    }
                                                }}
                                                placeholder="Select Assign By"
                                            />
                                        ) : (null
                                            // <Select
                                            //     className='w-100'
                                            //     options={assignoption}
                                            //     value={assignoption.find((option) => option.value == assignBy)}
                                            //     onChange={(selected) => {
                                            //         setAssignBy(selected.value);
                                            //         if (errors.assignBy) {
                                            //             setErrors(prevErrors => ({ ...prevErrors, assignBy: '' }));
                                            //         }
                                            //     }}
                                            //     placeholder="Select Assign By"

                                            // />
                                        )}

                                        {errors.assignBy && <div className="error-message text-danger">{errors.assignBy}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Assign To :<span className='text-danger'>*</span></label>
                                        <Select
                                            className='w-100'
                                            isMulti
                                            options={userOptions}
                                            value={userOptions.filter(option => assignTo.includes(option.value))} // Filter and select options that are present in assignTo array                             
                                            onChange={handleSelect}
                                            placeholder="Assign To"
                                        />
                                        {errors.assignTo && <div className="error-message text-danger">{errors.assignTo}</div>}
                                    </div>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Start Date :</label>
                                                <input type='date' className='form-control' value={formdate} onChange={(event) => {
                                                    setFormDate(event.target.value)
                                                    // if (errors.formdate) {
                                                    //     setErrors(prevErrors => ({ ...prevErrors, formdate: '' }));
                                                    // }
                                                }} />
                                                {/* {errors.formdate && <div className="error-message text-danger">{errors.formdate}</div>} */}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Due Date :</label>
                                                <input type='date' className='form-control' min={formdate} value={todate} onChange={(event) => {
                                                    setToDate(event.target.value)
                                                    if (errors.todate) {
                                                        setErrors(prevErrors => ({ ...prevErrors, todate: '' }));
                                                    }
                                                }} />
                                                {errors.todate && <div className="error-message text-danger">{errors.todate}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Priority :<span className='text-danger'>*</span></label>
                                                <Select
                                                    className='w-100'
                                                    options={PriorityOptions}
                                                    value={PriorityOptions.find((option) => option.value === priority)}
                                                    onChange={HandlePriorityChange}
                                                    placeholder="Select Priority"
                                                />
                                                {errors.priority && <div className="error-message text-danger">{errors.priority}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Task Status :<span className='text-danger'>*</span></label>
                                                <Select
                                                    className='w-100'
                                                    options={TaskOptions}
                                                    value={TaskOptions.find((option) => option.value === taskStatus)}
                                                    onChange={HandleTaskStatusChange}
                                                    placeholder="Select Status"
                                                    defaultValue={defaultTaskStatusOption.MasterTag1}
                                                />
                                                {errors.taskStatus && <div className="error-message text-danger">{errors.taskStatus}</div>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className='buttons-reset'>
                                        <div className="reset-button ">
                                            <button className="btn btn-success m-2" onClick={DataSubmit} disabled={loading}>
                                                {loading ? 'Saving...' : 'Save [F9]'}
                                            </button>
                                            <button className="btn btn-danger m-2" onClick={onHide} disabled={loading}>
                                                Cancel [ESC]
                                            </button>
                                        </div>
                                        <div>
                                            <Button variant='light' className='border border-rounded' onClick={resetData}>
                                                <GrPowerReset />
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /.content */}
            </div>
        </div>
    )
}

export default InquiryForm