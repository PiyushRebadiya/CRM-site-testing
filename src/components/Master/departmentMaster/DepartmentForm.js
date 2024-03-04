import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { notification } from 'antd';
import * as Yup from 'yup';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    deptname: Yup.string().required("Department Name is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const DepartmentForm = ({ getDepartmentData, fetchData, rowData, getProjectData }) => {
    const [deptname, setDeptName] = useState("")
    const [isactive, setIsActive] = useState(true)
    const [deptid, setDeptId] = useState(-1)
    const [savebtn, setSaveBtn] = useState(true)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const cusId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')

    useEffect(() => {
        if (rowData) {
            setDeptName(rowData.DepartmentName)
            setIsActive(rowData.IsActive)
            setDeptId(rowData.Id)
            setSaveBtn(false)
        }
    }, [rowData])
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                deptname,
            }, { abortEarly: false });
            setLoading(true);
            if (deptid >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateDepartment", {
                    Id: deptid,
                    DepartmentName: deptname,
                    CustId: cusId,
                    CompanyId: CompanyId,
                    IsActive: isactive
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    setDeptName("")
                    setDeptId(-1)
                    setIsActive(null)
                    setSaveBtn(true)
                    fetchData()
                    if (getProjectData) {
                        getProjectData()
                    }
                    if (getDepartmentData) {
                        getDepartmentData()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateDepartment", {
                    DepartmentName: deptname,
                    CustId: cusId,
                    IsActive: true,
                    CompanyId: CompanyId
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    setDeptName("")
                    setDeptId(-1)
                    fetchData()
                    if (getProjectData) {
                        getProjectData()
                    }
                    if (getDepartmentData) {
                        getDepartmentData()
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

    return (
        <div>

            <div className='form-border'>
                {/* Main content */}
                <div className="">
                    <div className="row">
                        {/* Form controls */}
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className='card lobicard ' style={{ height: "307px" }}>
                                    <div className="card-header">
                                        <div className="card-title custom_title">
                                            <h4>Add Department</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className='form-input-padding'>
                                            <div className="form-group">
                                                <label>Department Name :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control " value={deptname} placeholder="Enter Department Name" onChange={(event) => {
                                                    const input = event.target.value;
                                                    const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                                    setDeptName(firstCapital)
                                                    if (errors.deptname) {
                                                        setErrors(prevErrors => ({ ...prevErrors, deptname: '' }));
                                                    }
                                                }} />
                                                {errors.deptname && <div className="error-message text-danger">{errors.deptname}</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <label>Status</label><br />
                                            <label className="radio-inline">
                                                <input type="radio" name="statusdepartment" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                            <label className="radio-inline"><input type="radio" name="statusdepartment" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Inactive</label>
                                        </div>
                                        <div className="reset-button">
                                            {
                                                savebtn == true ? (
                                                    <button className="btn btn-primary m-2" onClick={DataSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                                                ) : (
                                                    <button className="btn btn-primary m-2" onClick={DataSubmit} disabled={loading}>{loading ? 'Update...' : 'Update'}</button>
                                                )
                                            }
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

export default DepartmentForm