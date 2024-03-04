import React, { useState, useEffect } from 'react'
import { notification } from 'antd';
import axios from 'axios';
import * as Yup from 'yup';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    role: Yup.string().required("Role Name is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const RoleForm = ({ getRoleData, rowData, fetchData, onHide }) => {
    const [RoleId, setRoleId] = useState(-1)
    const [role, setRole] = useState("")
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const custId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')

    useEffect(() => {
        if (rowData) {
            setRole(rowData.Role)
            setRoleId(rowData.RoleId)
        }
    }, [rowData])

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                role,
            }, { abortEarly: false });
            setLoading(true);
            if (RoleId >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateRole", {
                    RoleId: RoleId,
                    Role: role,
                    IsActive: true,
                    CustId: custId,
                    CompanyID: CompanyId,

                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getRoleData) {
                        getRoleData();
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateRole", {

                    Role: role,
                    IsActive: true,
                    CustId: custId,
                    CompanyID: CompanyId,

                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    if (getRoleData) {
                        getRoleData();
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
    }, [RoleId, role]); // Add any other dependencies as needed

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
                            <h1>Role</h1>
                            {/* <small>Add Role</small> */}
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
                {/* Main content */}
                <div className="mt-3">
                    <div className="row">
                        {/* Form controls */}
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Role Name :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control"
                                            value={role}
                                            placeholder="Enter Role Name"
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                                setRole(firstCapital)
                                                if (errors.role) {
                                                    setErrors(prevErrors => ({ ...prevErrors, role: '' }));
                                                }
                                            }}
                                        />
                                        {errors.role && <div className="error-message text-danger">{errors.role}</div>}
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

export default RoleForm