import React, { useState, useEffect } from 'react'
import { notification } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    Ifsc: Yup.string().required("IFSC code is required"),
    bankname: Yup.string().required("Bank Name is required"),
    branchname: Yup.string().required("Branch Name is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

function IfscForm({ fetchIFSCData, rowData, fetchData, onHide, errorData, reset_Data }) {

    React.useEffect(() => {
        if (errorData) {
            errorData.current = resetErrors
        }
    }, [])
    React.useEffect(() => {
        if (reset_Data) {
            reset_Data.current = resetData
        }
    }, [])

    const [bankname, setBankname] = useState("")
    const [branchname, setBranchname] = useState("")
    const [Ifsc, setIfsc] = useState("")
    const [IfscId, setIfscId] = useState(-1)
    const [errors, setErrors] = useState({});
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const custId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const UserID = localStorage.getItem('CRMUserId')
    const Username = localStorage.getItem('CRMUsername')
    const [loading, setLoading] = useState(false);
    const [guid, setGuid] = useState("");
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${custId}`;

    const resetErrors = () => {
        setErrors({});
    };

    const resetData = () => {
        setIfsc("");
        setBankname("");
        setBranchname("");
    }

    useEffect(() => {
        if (rowData) {
            // console.log(rowData, "rowdata123243")
            setBankname(rowData.BankName)
            setBranchname(rowData.BranchName)
            setIfsc(rowData.IFSC)
            setIfscId(rowData.IFSCID)
            setGuid(rowData.Cguid)
        } else {
            resetData(); // Ensure data is reset when rowData is not provided
        }
    }, [rowData])

    const [ipaddress, setIpAddress] = useState('')
    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            // console.log(res.data.ip, "res-resresres")
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchIPAddress()
    }, [])

    // console.log(guid, "guid")
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                Ifsc,
                bankname,
                branchname
            }, { abortEarly: false });
            setLoading(true);
            if (IfscId >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateIFSC", {
                    Flag: "U",
                    IFSCCode: {
                        BankName: bankname,
                        BranchName: branchname,
                        IFSC: Ifsc,
                        IFSCID: IfscId,
                        CustId: custId,
                        CGuid: guid,
                        CompanyID: CompanyId,
                        IPAddress : ipaddress,
                        UserName : Username,
                        UserId : UserID,
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData();
                    resetData();
                    onHide();
                    if (fetchIFSCData) {
                        fetchIFSCData();
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateIFSC", {
                    Flag: "A",
                    IFSCCode: {
                        BankName: bankname,
                        BranchName: branchname,
                        IFSC: Ifsc,
                        CustId: custId,
                        CGuid: UUID,
                        CompanyID: CompanyId,
                        IPAddress : ipaddress,
                        UserName : Username,
                        UserId : UserID,
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData();
                    resetData();
                    onHide();
                    if (fetchIFSCData) {
                        fetchIFSCData();
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
    }, [IfscId, Ifsc, bankname, branchname]); // Add any other dependencies as needed

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onHide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onHide]);

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
                            <h1>IFSC</h1>
                            {/* <small>Add IFSC</small> */}
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
                                        <label>Bank Name : <span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control"
                                            value={bankname}
                                            placeholder="Enter Bank Name"
                                            onChange={(event) => {
                                                const inputValue = event.target.value;
                                                const capitalizedValue =
                                                    inputValue.toUpperCase();

                                                setBankname(capitalizedValue);
                                                if (errors.bankname) {
                                                    setErrors(prevErrors => ({ ...prevErrors, bankname: '' }));
                                                }
                                            }}
                                        />
                                        {errors.bankname && <div className="error-message text-danger">{errors.bankname}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Branch Name : <span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control"
                                            value={branchname}
                                            placeholder="Enter Branch Name"
                                            onChange={(event) => {
                                                const inputValue = event.target.value;
                                                const capitalizedValue =
                                                    inputValue.toUpperCase();

                                                setBranchname(capitalizedValue);
                                                if (errors.branchname) {
                                                    setErrors(prevErrors => ({ ...prevErrors, branchname: '' }));
                                                }
                                            }}
                                        />
                                        {errors.branchname && <div className="error-message text-danger">{errors.branchname}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>IFSC Code : <span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control"
                                            value={Ifsc}
                                            placeholder="Enter Ifsc Code"
                                            // onChange={(event) => { setIfsc(event.target.value) }} 
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const alphanumericInput = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                                const limitedInput = alphanumericInput.slice(0, 11);
                                                setIfsc(limitedInput);
                                                if (errors.Ifsc) {
                                                    setErrors(prevErrors => ({ ...prevErrors, Ifsc: '' }));
                                                }
                                            }}
                                        />
                                        {errors.Ifsc && <div className="error-message text-danger">{errors.Ifsc}</div>}
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

export default IfscForm