import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import moment from 'moment'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { notification } from 'antd';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-bootstrap/Modal';
import { FiMoreHorizontal } from 'react-icons/fi';
import CategoryMaster from '../categoryMaster/CategoryMaster';
import TaxAdminMaster from '../taxadmin/TaxAdminMaster';
import PartyMaster from '../PartyMaster/PartyMaster';
import ProjectMaster from '../projectMaster/ProjectMaster'
// Form validation Schema start
const validationSchema = Yup.object().shape({
    projectname: Yup.string().required("Please Select Project Name"),
    category: Yup.string().required("Please Select Category"),
    taxadmin: Yup.string().required("Please Select Sub-Category"),
    taskName: Yup.string().required("Task Name Is Required."),
    assignBy: Yup.string().required("Please select by whom the task is assigned"),
    assignTo: Yup.string().required("Please Enter Whom You Want To Assign The Task"),
    // Add validation schema for other fields,
});
// Form validation Schema end

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

function SubCategoryNew(props) {
    const { getTaxadmindata } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <TaxAdminMaster getTaxadmindata={getTaxadmindata} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
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

function AutoTaskForm({ onHide, rowData, fetchData, fetchCalenderData, fetchAssignByMeData, insertChartData, fetchCompleteTaskData, fetchReportData }) {

    const [categoryModal, setCategoryModal] = useState(false)
    const [subCategoryModal, setsubCategoryModal] = useState(false)
    const [partyModal, setPartyModal] = useState(false)
    const [projectModal, setProjectModal] = useState(false)
    const [projectname, setProjectname] = useState()
    const [partyData, setPartyData] = useState([])
    const toDayDate = new Date()
    const formattedDateToDay = moment(toDayDate).format('yyyy-MM-DD');
    const [date, setDate] = useState(formattedDateToDay)
    const [party, setParty] = useState(161)
    const [autoreferenceID, setAutoReferenceId] = useState("")
    const [timePeriod, setTimePeriod] = useState("Daily")
    const [category, setCategory] = useState()
    const [taxadmin, setTaxadmin] = useState()
    const [getprojectdata, setGetProjectData] = useState([])
    const [getuserdata, setGetuserData] = useState([])
    const [assignTo, setAssignTo] = useState("")
    const [assignBy, setAssignBy] = useState("")
    const [getcategorydata, setGetcategorydata] = useState([])
    const [gettaxadmindata, setGettaxadmindata] = useState([])
    const [masterData, setMasterData] = useState([]);
    const [errors, setErrors] = useState({});
    const [autotaskid, setAutoTaskId] = useState(-1)
    const [taskName, setTaskName] = useState("")
    const [loading, setLoading] = useState(false);
    const [responsible, setResponsible] = useState(formattedDateToDay);
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
    const [checkRemarks, setCheckRemarks] = useState(false);

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC-${uuid}-${custId}`;

    let ProjectID;
    let firstUserSelected;

    useEffect(() => {
        if (rowData) {
            setAutoTaskId(rowData.Id)
            setProjectname(rowData.ProjectId)
            setCategory(rowData.CategoryId)
            setTaxadmin(rowData.SubCategoryId)
            const DATE = rowData.Date
            const formattedDatefrom = moment(DATE).format('yyyy-MM-DD');
            setDate(formattedDatefrom)
            setTimePeriod(rowData.TimePeriod)
            setTaskName(rowData.TaskName)
            setAutoReferenceId(rowData.AutoReference)
            setAssignBy(rowData.AssignBy)
            setAssignTo(rowData.AssignTo)
            setCguid(rowData.Cguid)
            setResponsible(moment(rowData.ResponsibleDate).format("yyyy-MM-DD"));
        }
    }, [rowData])

    const generateRandomNumbers = (length) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    };
    const reference = 'AT' + generateRandomNumbers(5);
    let referenceID = reference;
    // console.log(referenceID, "referenceID");

    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetProjectData(res.data)
            // console.log(res.data, "project")
            ProjectID = res.data[0].Id;
            // console.log(ProjectID, "ProjectID")
            if (!rowData) {

                setProjectname(ProjectID)
            }
            // console.log(ProjectID, "ID")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getProjectData();
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
            // console.log(res.data, "categoryDAta");
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
            // console.log(res.data, "sub-categoryDAta");
        } catch (error) {
            // Handle error
        }
    };

    const getUserData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetuserData(res.data)
            firstUserSelected = res.data[0].Id;
            // console.log(firstUserSelected, "firstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelected")
            if (!rowData) {
                setAssignBy(firstUserSelected)
            }
            // console.log(firstUserSelected, "assignBy")
        } catch (error) {
            console.log(error)
        }
    }

    const [ipaddress, setIpAddress] = useState('')
    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCategoryChange = (selected) => {
        setCategory(selected ? selected.value : "");
        setTaxadmin("");
        // setIsSubCategorySelected(false); // Allow changes to Sub-Category
        if (errors.category) {
            setErrors((prevErrors) => ({ ...prevErrors, category: '' }));
        }
    };

    const handleSubCategoryChange = (selected) => {
        setTaxadmin(selected ? selected.value : "");
        setIsSubCategorySelected(true); // Sub-Category is now selected
        if (errors.taxadmin) {
            setErrors((prevErrors) => ({ ...prevErrors, taxadmin: '' }));
        }
    };

    // Update taxadminOptions based on the selected category

    const categoryFilter = getcategorydata.filter((display) => display.ProjectID == projectname || display.ProjectID == 0);
    const activeCategory = categoryFilter.filter((display) => display.IsActive === true);
    const categoryOptions = activeCategory.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));
    const subfilter = gettaxadmindata.filter((display) => display.CategoryId === category);
    const activeSubCategory = subfilter.filter((display) => display.IsActive === true);
    const taxadminOptions = activeSubCategory.map((display) => ({
        value: display.Id,
        label: display.Heading,
    }));
    // const getPartyData = async () => {
    //     try {
    //         const res = await axios.get(URL + `/api/Master/PartyList?CustId=${custId}&CompanyId=${CompnyId}`, {
    //             headers: { Authorization: `bearer ${token}` },
    //         });
    //         setPartyData(res.data);
    //         // console.log(res.data, "partyDAta");
    //     } catch (error) {
    //         // Handle error
    //     }
    // };
    // const filterParty = partyData.filter((display) => display.CategoryId === category);
    // const arrayOfIds = filterParty.map((obj) => obj.PartyId);

    // console.log(filterParty, "filterParty")
    // console.log(arrayOfIds, "arrayOfIds")
    // const partyOptions = filterParty.map((display) => ({
    //     value: display.PartyId,
    //     label: display.PartyName,
    // }));
    // console.log(partyOptions, "partyOptions")


    const periodOptions = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Semiannually', label: 'Semiannually' },
        { value: 'Annually', label: 'Annually' },
    ];

    // const getassigndata = async () => {
    //     try {
    //         const res = await axios.get(URL + `/api/Master/UsermstList`, {
    //             headers: { Authorization: `bearer ${token}` }
    //         })
    //         setGetAssignuserData(res.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // const getUserData = async () => {
    //     try {
    //         const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompnyId}`, {
    //             headers: { Authorization: `bearer ${token}` }
    //         })
    //         setGetuserData(res.data)
    //         console.log(res.data, "userlist")
    //         firstUserSelected = res.data[0].Id;
    //         // console.log(firstUserSelected, "firstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelectedfirstUserSelected")
    //         setAssignBy(firstUserSelected, "assignBy")
    //         // console.log(firstUserSelected, "assignBy")
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // useEffect(()=>{
    //     localStorage.setItem('CRMUserList',[...userIds,userid])
    // },[])
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
        getUserData();
        fetchIPAddress();
        getTaxadmindata();
        // getPartyData();
        getCategoryData();
        // getProjectData()
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
    getuserdata.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
    const userOptions = getuserdata.map((display) => ({
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

    }))
    // console.log(assignoption, "assignoption")

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                projectname,
                category,
                taxadmin,
                taskName,
                assignBy,
                assignTo
            }, { abortEarly: false });
            setLoading(true);
            if (autotaskid >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateAutoTask1", {
                    Flag: 'U',
                    AutoTask: {
                        Id: autotaskid,
                        CompanyID: CompnyId,
                        CustId: custId,
                        TaskName: taskName,
                        UserId: userid,
                        ProjectId: projectname,
                        CategoryId: category,
                        SubCategoryId: taxadmin,
                        Date: date,
                        IsActive: true,
                        TimePeriod: timePeriod,
                        Cguid: cguid,
                        AssignBy: assignBy,
                        AssignTo: assignTo,
                        Type: "Auto",
                        AutoReference: autoreferenceID,
                        IPAddress: ipaddress,
                        UserName: userName,
                        ResponsibleDate: responsible
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (fetchCalenderData) {
                        fetchCalenderData()
                    }
                    if (fetchAssignByMeData) {
                        fetchAssignByMeData()
                    }
                    if (insertChartData) {
                        insertChartData()
                    }
                    if (fetchCompleteTaskData) {
                        fetchCompleteTaskData()
                    }
                    if (fetchReportData) {
                        fetchReportData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateAutoTask1", {
                    Flag: "A",
                    AutoTask: {
                        CompanyID: CompnyId,
                        CustId: custId,
                        TaskName: taskName,
                        UserId: userid,
                        ProjectId: projectname,
                        CategoryId: category,
                        SubCategoryId: taxadmin,
                        Date: date,
                        IsActive: true,
                        TimePeriod: timePeriod,
                        Cguid: UUID,
                        AssignBy: (role == 'Admin' ? assignBy : userid),
                        AssignTo: assignTo,
                        Type: "Auto",
                        AutoReference: referenceID,
                        UserName: userName,
                        ResponsibleDate: responsible
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (fetchCalenderData) {
                        fetchCalenderData()
                    }
                    if (fetchAssignByMeData) {
                        fetchAssignByMeData()
                    }
                    if (insertChartData) {
                        insertChartData()
                    }
                    if (fetchCompleteTaskData) {
                        fetchCompleteTaskData()
                    }
                    if (fetchReportData) {
                        fetchReportData()
                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            console.log(error, "error")
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
        if (projectModal == false && categoryModal == false && subCategoryModal == false) {
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
    }, [projectModal, categoryModal, subCategoryModal, autotaskid, projectname, category, taxadmin, taskName, assignTo, assignBy, date, timePeriod]); // Add any other dependencies as needed

    // console.log('loggedInUserId:', userid);
    // console.log('loggedInUserName:', userName);
    const loggedInUser = {
        value: userName,  // Replace with the actual user ID
        label: userName,  // Replace with the user's name or identifier
    };
    const userOptions1 = [loggedInUser];

    // const HandlePriorityChange = (selectoption) => {
    //     setPriority(selectoption.value);
    //     if (errors.priority) {
    //         setErrors(prevErrors => ({ ...prevErrors, priority: '' }));
    //     }
    // }

    // const HandleTaskStatusChange = (selectoption) => {
    //     setTaskStatus(selectoption.value);
    //     if (errors.taskStatus) {
    //         setErrors(prevErrors => ({ ...prevErrors, taskStatus: '' }));
    //     }
    // }
    // function CustomOption({ innerProps, label }) {
    //     return <div {...innerProps}>{label}</div>;
    // }
    const handleSelect = (selectoption) => {
        setAssignTo(selectoption.value)
        if (errors.assignTo) {
            setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
        }
    }
    // const handleAssignBySelect = (selected) => {
    //     setAssignBy(selected.map((option) => option.value))
    //     const assigntask = selected.map((option) => option.value).join(',')
    //     setAssignBy(assigntask)
    //     // if (errors.assignTo) {
    //     //     setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
    //     // }
    // }

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
                            <h1>Task Scheduler</h1>
                            {/* <small>Task List</small> */}
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
                                        <Col>
                                            <div className="form-group">
                                                <label>Project Name :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={projectOptions}
                                                        value={projectname ? projectOptions.find((option) => option.value == projectname) : null}
                                                        onChange={(selected) => {
                                                            setProjectname(selected ? selected.value : '')
                                                            setTaxadmin('')
                                                            setCategory('')
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
                                                {errors.projectname && <div className="error-message text-danger">{errors.projectname}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Category Name :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className="w-100"
                                                        options={categoryOptions}
                                                        value={category ? categoryOptions.find((option) => option.value == category) : ""}
                                                        onChange={handleCategoryChange}
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
                                                    </div>
                                                </div>
                                                {errors.category && (
                                                    <div className="error-message text-danger">{errors.category}</div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Sub-Category Name :<span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className="w-100"
                                                        options={taxadminOptions}
                                                        value={taxadmin ? taxadminOptions.find((option) => option.value === taxadmin) : ""}
                                                        onChange={handleSubCategoryChange}
                                                        placeholder="Select Sub-Category"
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setsubCategoryModal(true)} />
                                                        <SubCategoryNew
                                                            show={subCategoryModal}
                                                            onHide={() => setsubCategoryModal(false)}
                                                            getTaxadmindata={getTaxadmindata}
                                                        />
                                                    </div>
                                                </div>
                                                {errors.taxadmin && (
                                                    <div className="error-message text-danger">{errors.taxadmin}</div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label>Task Name :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control" value={taskName} placeholder="Enter Task Name" onChange={(event) => {
                                                    setTaskName(event.target.value)
                                                    if (errors.taskName) {
                                                        setErrors(prevErrors => ({ ...prevErrors, taskName: '' }));
                                                    }
                                                }} />
                                                {errors.taskName && <div className="error-message text-danger">{errors.taskName}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {/* <Col> */}
                                        <div className='form-group'>
                                            {role == 'Admin' ? (

                                                <label>Assign By :<span className='text-danger'>*</span></label>
                                            ) : null}
                                            {role === 'Admin' ? (
                                                <Select
                                                    className='w-100'
                                                    options={userOptions}
                                                    // isDisabled={rowData ? true : false}
                                                    // value={assignoption.find((option) => option.value === assignBy)}
                                                    // value={userOptions.find((option) => option.value == assignBy)}
                                                    value={assignBy ? userOptions.find((option) => option.value == assignBy) : null}
                                                    isSearchable={true}
                                                    onChange={(selected) => {
                                                        setAssignBy(selected.value);
                                                        if (errors.assignBy) {
                                                            setErrors(prevErrors => ({ ...prevErrors, assignBy: '' }));
                                                        }
                                                    }}
                                                    placeholder="Select Assign By"
                                                />
                                            ) : (
                                                null
                                            )}

                                            {errors.assignBy && <div className="error-message text-danger">{errors.assignBy}</div>}
                                        </div>
                                        {/* </Col> */}
                                        <Col>
                                            <div className="form-group">
                                                <label>Assign To :<span className='text-danger'>*</span></label>
                                                <Select
                                                    className='w-100'
                                                    options={userOptions}
                                                    value={userOptions.find((option) => option.value == assignTo)}
                                                    // isSearchable={true}
                                                    onChange={handleSelect}
                                                    placeholder="Select Assign To"
                                                />
                                                {errors.assignTo && <div className="error-message text-danger">{errors.assignTo}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                <label>Start Date :</label>
                                                <input type='date' className='form-control' value={date} onChange={(event) => {
                                                    setDate(event.target.value)
                                                    // if (errors.formdate) {
                                                    //     setErrors(prevErrors => ({ ...prevErrors, formdate: '' }));
                                                    // }
                                                }} />
                                                {/* {errors.formdate && <div className="error-message text-danger">{errors.formdate}</div>} */}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                <label>Time Period :</label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={periodOptions}
                                                        // value={partyOptions.find((option) => option.value == party)}
                                                        value={periodOptions.find((option) => option.value == timePeriod)}
                                                        onChange={(selected) => {
                                                            setTimePeriod(selected.value);
                                                            // if (errors.salaryType) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, salaryType: null }));
                                                            // }
                                                        }}
                                                    />
                                                </div>
                                                {errors.party && <div className="error-message text-danger">{errors.party}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                        <div className="form-group">
                                            <label>Responsible Date :</label>
                                            <input
                                            type="date"
                                            className="form-control"
                                            value={responsible}
                                            onChange={(event) => {
                                                setResponsible(event.target.value);
                                            }}
                                            />
                                        </div>
                                        </Col>
                                    </Row>
                                    <div className="reset-button ">
                                        <button className="btn btn-success m-2" onClick={DataSubmit} disabled={loading}>
                                            {loading ? 'Saving...' : 'Save [F9]'}
                                        </button>
                                        <button className="btn btn-danger m-2" onClick={onHide} disabled={loading}>
                                            Cancel [ESC]
                                        </button>
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

export default AutoTaskForm