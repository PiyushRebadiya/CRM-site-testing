import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { notification } from 'antd';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    projectName: Yup.string().required("Project Name is required"),
    status: Yup.string().required("Please select status"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const ProjectForm = ({ getProjectData, rowData, fetchData, onHide }) => {
    const [projectName, setProjectName] = React.useState('')
    const [masterData, setMasterData] = useState([]);
    const [ipaddress, setIpAddress] = useState('')
    const [status, setStatus] = React.useState('IPT')
    const [errors, setErrors] = useState({});
    const [projectId, setProjectId] = React.useState(-1)
    const [loading, setLoading] = useState(false);
    const [guid, setGuid] = useState("")

    const token = localStorage.getItem('CRMtoken')
    const companyId = localStorage.getItem("CRMCompanyId")
    const UserName = localStorage.getItem('CRMUsername')
    const UserId = localStorage.getItem('CRMUserId')
    const CustId = localStorage.getItem('CRMCustId')
    const URL = process.env.REACT_APP_API_URL
    // const currentDate = new Date();
    // const day = currentDate.getDate();
    // const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    // const year = currentDate.getFullYear();
    // const hours = currentDate.getHours();
    // const minutes = currentDate.getMinutes();
    // const second = currentDate.getSeconds();
    // const uuid = uuidv4();
    // const UUID = `${day}CC${month}-${uuid}-${CustId}`

    useEffect(() => {
        if (rowData) {
            setProjectName(rowData.ProjectName)
            setStatus(rowData.Status)
            setProjectId(rowData.Id)
        }
    }, [rowData])

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                projectName,
                status
            }, { abortEarly: false });
            setLoading(true);
            if (projectId >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateProject", {
                    Id: projectId,
                    ProjectName: projectName,
                    Status: status,
                    CompanyId: companyId,
                    UserId: UserId,
                    UserName: UserName,
                    IPAddress: ipaddress,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getProjectData) {

                        getProjectData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateProject", {
                    ProjectName: projectName,
                    Status: status,
                    CompanyId: companyId,
                    UserId: UserId,
                    UserName: UserName,
                    IPAddress: ipaddress,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getProjectData) {
                        getProjectData()
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
    }, [projectName, status, projectId]); // Add any other dependencies as needed

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
        fetchMasterData()
        fetchIPAddress()
    }, [])

    const options = masterData.filter((display) => display.Remark === "TaskStatus");
    const statusOptions = options.map((display) => ({
        value: display.MasterTag1,
        label: display.Description,
    }))

    // const statusOptions = masterData.reduce((options, display) => {
    //     if (display.Remark === "TaskStatus") {
    //         options.push({
    //             value: display.MasterTag1,
    //             label: display.Description,
    //         });
    //     }
    //     return options;
    // }, []);
    // Set the default selected option to the first option in statusOptions
    // const defaultStatus = statusOptions.length > 0 ? statusOptions[0] : null;
    // const [status, setStatus] = React.useState(defaultStatus);

    const handleStatusOptionChange = (selectedOption) => {
        setStatus(selectedOption.value);
        if (errors.status) {
            setErrors(prevErrors => ({ ...prevErrors, status: '' }));
        }
        // Access the label of the selected option
        const selectedLabel = selectedOption.label;
    };
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
                            <h1>Add Project</h1>
                            {/* <small>Project List</small> */}
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
                                        <label>Project Name :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" value={projectName} placeholder="Enter Project Name" onChange={(event) => {
                                            const input = event.target.value;
                                            const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                            setProjectName(firstCapital)
                                            if (errors.projectName) {
                                                setErrors(prevErrors => ({ ...prevErrors, projectName: '' }));
                                            }
                                        }} />
                                        {errors.projectName && <div className="error-message text-danger">{errors.projectName}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Status :<span className='text-danger'>*</span></label>
                                        {/* <Select
                                            options={statusOptions}
                                            defaultValue={defaultStatus}
                                            placeholder="Select Status"
                                            onChange={handleStatusOptionChange}
                                        /> */}
                                        <Select options={statusOptions}
                                            value={statusOptions.find((option) => option.value === status)}
                                            placeholder="Select Status"
                                            onChange={handleStatusOptionChange}
                                        />
                                        {errors.status && <div className="error-message text-danger">{errors.status}</div>}
                                    </div>
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

export default ProjectForm