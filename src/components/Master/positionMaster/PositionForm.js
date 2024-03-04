import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { notification } from 'antd';
import * as Yup from 'yup';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    deptname: Yup.string().required("Department name is required"),
    positioname: Yup.string().required("Position Name is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const PositionForm = ({ getPositionData, fetchData, rowData, projectdata }) => {

    const [deptname, setDeptName] = useState(150)
    const [positioname, setPositionName] = useState("")
    const [isactive, setIsActive] = useState(true)
    const [positionid, setPositionId] = useState(-1)
    const [savebtn, setSaveBtn] = useState(true)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const cusId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')

    const resetData = () => {
        setDeptName(150);
    }

    useEffect(() => {
        if (rowData) {
            setPositionName(rowData.PositionName)
            setDeptName(rowData.DepartmentId)
            setIsActive(rowData.IsActive)
            setPositionId(rowData.Id)
            setSaveBtn(false)
        }
        else {
            resetData(); // Ensure data is reset when rowData is not provided
        }
    }, [rowData])
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                positioname,
                deptname,
            }, { abortEarly: false });
            setLoading(true);
            if (positionid >= 0) {
                const res = await axios.post(URL + "/api/Master/Createposition", {
                    Id: positionid,
                    PositionName: positioname,
                    DepartmentId: deptname,
                    CustId: cusId,
                    IsActive: isactive,
                    CompanyId: CompanyId

                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    setDeptName("")
                    setPositionName("")
                    setPositionId(-1)
                    setIsActive(null)
                    setSaveBtn(true)
                    fetchData()
                    resetData();
                    if (getPositionData) {
                        getPositionData();
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/Createposition", {
                    PositionName: positioname,
                    DepartmentId: deptname,
                    CustId: cusId,
                    IsActive: true,
                    CompanyId: CompanyId
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    setDeptName("")
                    setPositionName("")
                    setPositionId(-1)
                    fetchData()
                    resetData();
                    if (getPositionData) {
                        getPositionData();
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
        }finally {
            setLoading(false);
        }
    }

    // const getProjectData = async () => {
    //     try {
    //         const res = await axios.get(URL + `/api/Master/DepartmentList?CustId=${cusId}&CompanyId=${CompanyId}`, {
    //             headers: { Authorization: `bearer ${token}` }
    //         })
    //         setProjectData(res.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // useEffect(() => {
    //     getProjectData()
    // }, [])
    const projectrecord = projectdata.map((display) => ({
        value: display.Id,
        label: display.DepartmentName,
    }));

    function capitalizeEachWord(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <div>
            <div>
                <div className='form-border'>
                    {/* Main content */}
                    <div className="">
                        <div className="row">
                            {/* Form controls */}
                            <div className="col-sm-12">
                                <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                    <div className='card lobicard ' style={{ height: "350px" }}>
                                        <div className="card-header">
                                            <div className="card-title custom_title">
                                                <h4>Add Designation</h4>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className='form-input-padding'>
                                                <div className="form-group">
                                                    <label>Department Name :<span className='text-danger'>*</span></label>
                                                    <Select
                                                        className='w-100'
                                                        options={projectrecord}
                                                        value={projectrecord.find((option) => option.value == deptname)}
                                                        isClearable={true}
                                                        onChange={(selected) => {
                                                            setDeptName(selected ? selected.value :'')
                                                            if (errors.deptname) {
                                                                setErrors(prevErrors => ({ ...prevErrors, deptname: '' }));
                                                            }
                                                        }}
                                                        placeholder="Select Department"
                                                        key={deptname}
                                                    />
                                                    {errors.deptname && <div className="error-message text-danger">{errors.deptname}</div>}
                                                </div>
                                                <div className="form-group">
                                                    <label>Designation name :<span className='text-danger'>*</span></label>
                                                    <input type="text" className="form-control " value={positioname} placeholder=" Designation " onChange={(event) => {
                                                        const input = event.target.value;
                                                        const formattedValue = capitalizeEachWord(input);
                                                        setPositionName(formattedValue)
                                                        if (errors.positioname) {
                                                            setErrors(prevErrors => ({ ...prevErrors, positioname: '' }));
                                                        }
                                                    }} />
                                                    {errors.positioname && <div className="error-message text-danger">{errors.positioname}</div>}
                                                </div>
                                            </div>
                                            <div>
                                                <label>Status</label><br />
                                                <label className="radio-inline">
                                                    <input type="radio" name="status" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                                <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Inactive</label>
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
        </div>
    )
}

export default PositionForm