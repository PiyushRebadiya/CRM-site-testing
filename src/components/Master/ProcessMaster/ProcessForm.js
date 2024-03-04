import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { notification } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    selectedsubCategory: Yup.string().required("Sub-Category Name is required"),
    processname: Yup.string().required("Process Name is required"),
});

const ProcessForm = ({ onHide, rowData, fetchData, getProcessData }) => {

    const [subcategorylist, setSubCategoryList] = useState([])
    const [selectedsubCategory, setSelectedSubCategory] = useState("")
    const [processname, setProcessName] = useState("")
    const [isactive, setIsActive] = useState(true)
    const [processid, setProcessId] = useState(-1)
    const [guid, setGuid] = useState("")
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const companyId = localStorage.getItem("CRMCompanyId")
    const CustId = localStorage.getItem('CRMCustId')
    const userName = localStorage.getItem('CRMUsername')
    const userId = localStorage.getItem('CRMUserId')
    const [processerror, setProcessError] = useState('')
    const [ipaddress, setIpAddress] = useState('')

    useEffect(() => {
        if (rowData) {
            setSelectedSubCategory(rowData.SubCategoryID)
            setProcessName(rowData.ProcessName)
            setIsActive(rowData.IsActive)
            setProcessId(rowData.Id)
            setGuid(rowData.Cguid)
        }
    }, [rowData])

    const getSubcategoryList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSubCategoryList(res.data)
            const SubCategory = res.data[0].Id
            if (!rowData) {
                setSelectedSubCategory(SubCategory)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const ProcessOption = subcategorylist.map((display) => ({
        value: display.Id,
        label: display.Heading,
    }));

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
        getSubcategoryList()
        fetchIPAddress()
    }, [])

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-${uuid}-${CustId}`
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                selectedsubCategory,
                processname
            }, { abortEarly: false });
            setLoading(true);
            if (processid >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateProcess", {
                    Id: processid,
                    SubCategoryID: selectedsubCategory,
                    ProcessName: processname,
                    CompanyID: companyId,
                    IsActive: isactive,
                    Cguid: guid,
                    UserId: userId,
                    UserName: userName,
                    IPAddress: ipaddress,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getProcessData) {
                        getProcessData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateProcess", {
                    SubCategoryID: selectedsubCategory,
                    ProcessName: processname,
                    CompanyID: companyId,
                    IsActive: true,
                    Cguid: UUID,
                    UserId: userId,
                    UserName: userName,
                    IPAddress: ipaddress,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getProcessData) {
                        getProcessData()
                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            if (error.response) {
                setProcessError(error.response.data.Message)
            }
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
    }, [processid, selectedsubCategory, processname]); // Add any other dependencies as needed

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
                            <h1> Add Process</h1>
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
                                        <label>Sub-Category Name :<span className='text-danger'>*</span></label>
                                        <Select
                                            options={ProcessOption}
                                            placeholder="Select Sub-Category"
                                            isClearable={true}
                                            value={ProcessOption.find((option) => option.value == selectedsubCategory)}
                                            onChange={(selected) => {
                                                setSelectedSubCategory(selected ? selected.value : '')
                                                if (errors.selectedsubCategory) {
                                                    setErrors(prevErrors => ({ ...prevErrors, selectedsubCategory: '' }));
                                                }
                                            }}
                                        />
                                        {errors.selectedsubCategory && <div className="error-message text-danger">{errors.selectedsubCategory}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Process Name :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" value={processname} placeholder="Enter Process Name" onChange={(event) => {
                                            const input = event.target.value;
                                            const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                            setProcessName(firstCapital)
                                            setProcessError('')
                                            if (errors.processname) {
                                                setErrors(prevErrors => ({ ...prevErrors, processname: '' }));
                                            }
                                        }} />
                                        {processerror ? (
                                            <span className='text-danger'>{processerror}</span>
                                        ) : null}
                                        {errors.processname && <div className="error-message text-danger">{errors.processname}</div>}

                                    </div>
                                    <div>
                                        <label>Status</label><br />
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={isactive} onChange={() => { setIsActive(true) }} /> Active
                                        </label>
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={!isactive} onChange={() => { setIsActive(false) }} /> Inactive
                                        </label>
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

export default ProcessForm