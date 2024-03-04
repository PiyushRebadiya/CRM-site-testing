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

const validationSchema = Yup.object().shape({
    projectname: Yup.string().required("Please select Module name"),
    TaskName: Yup.string().required("Task Name is required"),
    assignBy: Yup.string().required("Please select by whome task is assign"),
    // assignTo: Yup.array().required("Please select who you want to assign the task"),
    priority: Yup.string().required("Please select task priority"),
    category: Yup.string().required("Please select Category"),
    taxadmin: Yup.string().required("Please select Sub-Category"),
    // formdate: Yup.string().required("Please select Starting date of task"),
    todate: Yup.string().required("Please select Ending date of task"),
    taskStatus: Yup.string().required("Please select task status"),
    // party: Yup.string().required("Please select Party"),
    // Add validation schema for other fields,
});


function TaskDashForm({ onHide, rowData, fetchData, fetchCalenderData,fetchAssignByMeData,user,taskData,insertChartData,fetchCompleteTaskData,fetchReportData, }) {
    const [categoryModal, setCategoryModal] = useState(false)
    const [subCategoryModal, setsubCategoryModal] = useState(false)
    const [partyModal, setPartyModal] = useState(false)
    const [projectname, setProjectname] = useState("")
    const [TaskName, setTaskName] = useState("")
    const [partyData, setPartyData] = useState([])
    const [party, setParty] = useState(null)
    const [assignBy, setAssignBy] = useState([])
    const [assignTo, setAssignTo] = useState([])
    const [priority, setPriority] = useState("")
    const [taskStatus, setTaskStatus] = useState("")
    const [category, setCategory] = useState("")
    const [taxadmin, setTaxadmin] = useState("")
    const [getprojectdata, setGetProjectData] = useState([])
    const [getuserdata, setGetuserData] = useState([])
    const [getcategorydata, setGetcategorydata] = useState([])
    const [gettaxadmindata, setGettaxadmindata] = useState([])
    const [masterData, setMasterData] = useState([]);
    const [errors, setErrors] = useState({});
    const [remark1, setRemark1] = useState("");
    const [remark2, setRemark2] = useState("");
    const [remark3, setRemark3] = useState("");
    const toDayDate = new Date()
    const formattedDateToDay = moment(toDayDate).format('yyyy-MM-DD');
    const [formdate, setFormDate] = useState(formattedDateToDay);
    const formattedDateToDate = moment(toDayDate).format('yyyy-MM-DD');
    const [todate, setToDate] = useState(formattedDateToDate);
    const [taskid, setTaskId] = useState(-1)
    const [userasign, setUserAsign] = useState("")
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const custId = localStorage.getItem('CRMCustId')
    const userid = localStorage.getItem('CRMUserId')
    const userName = localStorage.getItem('CRMUsername')
    const CompnyId = localStorage.getItem('CRMCompanyId')
    const role = localStorage.getItem('CRMRole')
    const [isSubCategorySelected, setIsSubCategorySelected] = useState(false);
    const [getassignuserdata, setGetAssignuserData] = useState([])
    const [cguid, setCguid] = useState("")
    useEffect(() => {
        if (rowData) {
            // var array = [rowData.AssignTo]
            // console.log(array,'aaaaa')
            setAssignTo(rowData.AssignTo)
            setProjectname(rowData.ProjectId)
            setParty(rowData.PartyId)
            setTaskName(rowData.TaskName)
            setAssignBy(rowData.AssignBy)
            setPriority(rowData.Priority)
            setTaskStatus(rowData.TaskStatus)
            setCategory(rowData.CategoryId)
            setTaxadmin(rowData.TaxadminId)
            const fromDayDate = rowData.FromDate
            const formattedDatefrom = moment(fromDayDate).format('yyyy-MM-DD');
            setFormDate(formattedDatefrom)
            const toDayDate = rowData.ToDate
            const formattedDatetodate = moment(toDayDate).format('yyyy-MM-DD');
            setToDate(formattedDatetodate)
            setRemark1(rowData.Remark1)
            setRemark2(rowData.Remark2)
            setRemark3(rowData.Remark3)
            setTaskId(rowData.Id)
            setCguid(rowData.Cguid)
        }
    }, [rowData])

    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompnyId}`, {
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
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setGetcategorydata(res.data);
            // console.log(res, "catrespose")
        } catch (error) {
            // Handle error
        }
    };

    const getTaxadmindata = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setGettaxadmindata(res.data);
            // console.log(res, "taxrespose")
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

    const handleSubCategoryChange = (selected) => {
        setTaxadmin(selected.value);
        setIsSubCategorySelected(true); // Sub-Category is now selected
        if (errors.taxadmin) {
            setErrors((prevErrors) => ({ ...prevErrors, taxadmin: '' }));
        }
    };

    // Update taxadminOptions based on the selected category
    const subfilter = gettaxadmindata.filter((display) => display.CategoryId === category);
    const taxadminOptions = subfilter.map((display) => ({
        value: display.Id,
        label: display.Heading,
    }));

    const categoryOptions = getcategorydata.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
        isDisabled: isSubCategorySelected, // Disable if Sub-Category is selected
        isSelected: display.Id === category,
    }));
    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyList?CustId=${custId}&CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setPartyData(res.data);
            // console.log(res, "taxrespose")
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {

    }, []);


    const partyOptions = partyData.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));

    const getassigndata = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/UsermstList`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetAssignuserData(res.data)
            // console.log(res.data, "userdata")
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

    useEffect(() => {
        getUserData()
        getassigndata()
        getTaxadmindata();
        getPartyData();
        getCategoryData();
        getProjectData()
        fetchMasterData()
    }, [])

    const options = masterData.filter((display) => display.Remark === "Priority");
    const PriorityOptions = options.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    const taskoptions = masterData.filter((display) => display.Remark === "TaskStatus");
    const TaskOptions = taskoptions.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))

    const subAfilter = getassignuserdata.filter((display) => display.CustId === custId);
        const assignoption = subAfilter.map((display) => ({
        value: display.Id,
        label: (<div style={{ display: 'flex', alignItems: 'center' }}>
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
        </div>)
    }))
    // const filteredAssignOption = assignoption.filter(option => option.CustId === custId);
    const userOptions = getuserdata.map((display) => ({
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

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                projectname,
                TaskName,
                category,
                taxadmin,
                taskStatus,
                assignBy,
                // assignTo,
                priority,
                todate,
                // party
            }, { abortEarly: false });
            if (taskid >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateTask", {
                    Flag: 'U',
                    task: {
                        Id: taskid,
                        Cguid: cguid,
                        ProjectId: projectname,
                        TaskName: TaskName,
                        UserId: userid,
                        CategoryId: category,
                        PartyId: party,
                        TaxadminId: taxadmin,
                        TaskStatus: taskStatus,
                        AssignBy: assignBy,
                        AssignTo: assignTo,
                        Priority: priority,
                        FromDate: formdate,
                        ToDate: todate,
                        CustId: custId,
                        Type: "Task",
                        CompanyID: CompnyId,
                        Remark1: remark1,
                        Remark2: remark2,
                        Remark3: remark3,
                        UserId: userid,
                    }

                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if(fetchCalenderData)
                    {                        
                        fetchCalenderData()
                    }
                    if(fetchAssignByMeData)
                    {
                        fetchAssignByMeData()
                    }
                    if(taskData){
                        taskData()
                    }
                    if(insertChartData){
                        insertChartData()
                    }
                    if(fetchCompleteTaskData){
                        fetchCompleteTaskData()
                    }
                    if(fetchReportData){
                        fetchReportData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'top', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateTask", {
                    Flag: "A",
                    task: {
                        ProjectId: projectname,
                        TaskName: TaskName,
                        UserId: userid,
                        CategoryId: category,
                        PartyId: party,
                        TaxadminId: taxadmin,
                        TaskStatus: taskStatus,
                        AssignBy: assignBy,
                        AssignTo: assignTo,
                        Priority: priority,
                        FromDate: formdate,
                        ToDate: todate,
                        CustId: custId,
                        Type: "Task",
                        CompanyID: CompnyId,
                        Remark1: remark1,
                        Remark2: remark2,
                        Remark3: remark3,
                        UserId: userid,
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if(fetchCalenderData)
                    {                        
                        fetchCalenderData()
                    }
                    if(fetchAssignByMeData)
                    {
                        fetchAssignByMeData()
                    }
                    if(taskData){
                        taskData()
                    }
                    if(insertChartData){
                        insertChartData()
                    }
                    if(fetchCompleteTaskData){
                        fetchCompleteTaskData()
                    }
                    if(fetchReportData){
                        fetchReportData()
                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'top', // You can adjust the placement
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
        }
    }
    // console.log('loggedInUserId:', userid);
    // console.log('loggedInUserName:', userName);
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
        // if (errors.assignTo) {
        //     setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
        // }
    }

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
                            <h1>Edit Task</h1>
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
                                    <div className="form-group">
                                        <label>Project Name :</label>
                                        <Select
                                            className='w-100'
                                            options={projectOptions}
                                           
                                            value={projectOptions.find((option) => option.value == projectname)}
                                            onChange={(selected) => {
                                                setProjectname(selected.value)
                                                if (errors.projectname) {
                                                    setErrors(prevErrors => ({ ...prevErrors, projectname: '' }));
                                                }
                                            }}
                                            placeholder="Select Project"
                                        />
                                        {errors.projectname && <div className="error-message text-danger">{errors.projectname}</div>}
                                    </div>

                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Party :</label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={partyOptions}
                                                        value={partyOptions.find((option) => option.value == party)}
                                                        isDisabled={user == true ? true : false}
                                                        onChange={(selected) => {
                                                            setParty(selected.value)
                                                            // if (errors.party) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                            // }
                                                        }}
                                                        placeholder="Select Party"
                                                    />
                                                </div>
                                                {/* {errors.party && <div className="error-message text-danger">{errors.party}</div>} */}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">
                                        <label>Task Name :</label>
                                        <input type="text" className="form-control" value={TaskName} placeholder="Enter Task Name" onChange={(event) => {
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
                                                    setRemark1(event.target.value);
                                                }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Remark-2</label>
                                                <textarea className="form-control" rows="2" placeholder="Enter Remark" value={remark2} onChange={(event) => {
                                                    setRemark2(event.target.value);
                                                }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label>Remark-3</label>
                                                <textarea className="form-control" rows="2" placeholder="Enter Remark" value={remark3} onChange={(event) => {
                                                    setRemark3(event.target.value);
                                                }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                            <label>Assign By :<span className='text-danger'>*</span></label>
                                        {role === 'Admin' ? (
                                            <Select
                                                className='w-100'
                                                options={userOptions}
                                                // isDisabled={rowData ? true : false}
                                                isDisabled
                                                // value={assignoption.find((option) => option.value === assignBy)}
                                                value={userOptions.find((option) => option.value == assignBy)}
                                                onChange={(selected) => {
                                                    setAssignBy(selected.value);
                                                    if (errors.assignBy) {
                                                        setErrors(prevErrors => ({ ...prevErrors, assignBy: '' }));
                                                    }
                                                }}
                                                placeholder="Select Assign By"
                                            />
                                        ) : (
                                            <Select
                                                className='w-100'
                                                options={assignoption}
                                                value={ user == true ? userOptions.find((option) => option.value == assignBy) : assignoption.find((option) => option.value == assignBy)}
                                                isDisabled={user == true ? true :false}
                                                onChange={(selected) => {
                                                    setAssignBy(selected.value);
                                                    if (errors.assignBy) {
                                                        setErrors(prevErrors => ({ ...prevErrors, assignBy: '' }));
                                                    }
                                                }}
                                                placeholder="Select Assign By"

                                            />
                                        )}

                                                {errors.assignBy && <div className="error-message text-danger">{errors.assignBy}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Assign To:</label>
                                                <Select
                                                    className='w-100'
                                                    isMulti                                              
                                                    options={userOptions}
                                                    value={userOptions.filter(option => assignTo.includes(option.value))} // Filter and select options that are present in assignTo array                             
                                                    onChange={handleSelect}
                                                    placeholder="Select Receiver"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Start Date :</label>
                                                <input type='date' className='form-control' disabled value={formdate} onChange={(event) => {
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
                                                <input type='date' className='form-control' disabled value={todate} onChange={(event) => {
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
                                                <label>Priority :</label>
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
                                                <label>Task Status :</label>
                                                <Select
                                                    className='w-100'
                                                    options={TaskOptions}
                                                    value={TaskOptions.find((option) => option.value === taskStatus)}
                                                    onChange={HandleTaskStatusChange}
                                                    placeholder="Select Status"
                                                // defaultValue={TaskOptions[1]}
                                                />
                                                {errors.taskStatus && <div className="error-message text-danger">{errors.taskStatus}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="reset-button">
                                        <button className="btn btn-danger m-2" onClick={onHide}> Cancel</button>
                                        <button className="btn btn-success m-2" onClick={DataSubmit}> Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /.content */}
            </div>
        </div >
    )
}

export default TaskDashForm