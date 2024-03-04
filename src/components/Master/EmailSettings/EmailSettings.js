import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { notification } from 'antd';
import Select from "react-select";


const EmailSettings = () => {
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false)
    const [ipaddress, setIpAddress] = useState('')
    const [id, setId] = useState(-1)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState()
    const [selectedOption, setSelectedOption] = useState("");
    const URL = process.env.REACT_APP_API_URL
    const companyId = localStorage.getItem("CRMCompanyId")
    const userid = localStorage.getItem('CRMUserId')
    const token = localStorage.getItem('CRMtoken')
    const userName = localStorage.getItem('CRMUsername')

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
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
        fetchIPAddress()
    }, [])


    const handleEdit = () => {
        setEdit(true)
    }
    const handleCancel = () => {
        getMailList()
        setEdit(false)
    }

    const getMailList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetMailList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            setData(res.data)
            setEmail(res.data.Email)
            setPassword(res.data.Password)
            setId(res.data.Id)
            setSelectedOption(res.data.MailServer)
        } catch (error) {
            console.log(error, 'err')
        }
    }
    useEffect(() => {
        getMailList()
    }, [])
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
    }, [email, password, selectedOption]);
    const DataSubmit = async () => {

        try {
            setLoading(true);
            if (id > 0) {
                const res = await axios.post(URL + '/api/Master/CreateMail', {
                    Flag: "U",
                    Mail: {
                        Id: id,
                        Email: email,
                        Password: password,
                        UserId: userid,
                        CompanyId: companyId,
                        UserName: userName,
                        IPAddress: ipaddress,
                        MailServer: selectedOption

                    }
                }
                    , {
                        headers: { Authorization: `bearer ${token}` },
                    })

                if (res.data.Success == true) {
                    setEdit(false)
                    getMailList()
                    setShowPassword(false)
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + '/api/Master/CreateMail', {
                    Flag: "A",
                    Mail: {

                        Email: email,
                        Password: password,
                        UserId: userid,
                        CompanyId: companyId,
                        UserName: userName,
                        IPAddress: ipaddress,
                        MailServer: selectedOption

                    }
                }
                    , {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    setEdit(false)
                    getMailList()
                    setShowPassword(false)
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            console.log(error, 'err')
        } finally {
            setLoading(false);
        }
    }
    const emailoptions = [
        { value: 'mail.yahoo.com', label: 'mail.yahoo.com' },
        { value: 'gmail.com', label: 'gmail.com' },
        { value: 'live.com', label: 'live.com' },
        // Add more options as needed
    ];
    return (
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    <i class="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <div className="header-title">
                    <h1>Email Settings</h1>
                </div>
            </section>
            <section className='content'>
                <div className="row">
                    {/* Form controls */}
                    <div className="col-sm-6">
                        <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                            <div className='card lobicard ' style={{ height: "400px" }}>
                                <div className="card-header">
                                    <div className="card-title custom_title">
                                        <h4>Add Email</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className='form-group'>
                                        <label>Type Your Email :</label>
                                        <div className='d-flex'>
                                            <Select
                                                className="w-100"
                                                options={emailoptions}
                                                value={emailoptions.find((option) => option.value == selectedOption)}
                                                onChange={(selectedOption) => {
                                                    setSelectedOption(selectedOption.value);
                                                }}
                                                placeholder="Select Server"
                                                isDisabled={edit == false ? true : false}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-input-padding'>
                                        <div className="form-group">
                                            <label>Enter Email :</label>
                                            <input type="text" className="form-control"
                                                value={email}
                                                disabled={edit == false ? true : false}
                                                placeholder="Enter Email Address"
                                                onChange={(event) => {
                                                    setEmail(event.target.value)
                                                    // if (errors.deptname) {
                                                    //     setErrors(prevErrors => ({ ...prevErrors, deptname: '' }));
                                                    // }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Enter Password :</label>
                                        <div className='password-main-show-hide'>
                                            <input type={showPassword ? "text" : "password"} className="form-control" disabled={edit == false ? true : false} placeholder="Enter Password" value={password} onChange={(event) => {
                                                setPassword(event.target.value)
                                            }} />
                                            {
                                                edit == true ? (
                                                    <button
                                                        className="psw-show-icon"
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                    </button>
                                                ) : null
                                            }

                                        </div>
                                    </div>
                                    <div className="reset-button mt-3">
                                        {
                                            edit == false ? (
                                                <button type="button" className="btn btn-primary  m-4" onClick={handleEdit}>Edit</button>
                                            )
                                                : (
                                                    <button type="button" className="btn btn-primary m-4"
                                                        onClick={DataSubmit}
                                                        disabled={loading}
                                                    > {loading ? 'Saving...' : 'Save [F9]'}</button>
                                                )
                                        }
                                        <button type="button" className="btn btn-danger m-1" onClick={handleCancel}>Cancel</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EmailSettings