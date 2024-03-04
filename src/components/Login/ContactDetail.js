import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios'
import PhoneInput from "react-phone-input-2";
import { notification } from 'antd';


function ContactDetail({ formData, setFormData, formData1, setFormData1, errors, onData, onDisable, mobileOtp, inputOtp }) {
    const [regType, setRegType] = useState("2")
    const [regtypptionListoptionlist, setRegTypeOptionList] = useState([])
    const [showPassword, setShowPassword] = useState(false);

    // const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL

    const handleInputChange = (event) => {

        const { name, value } = event.target;

        // Capitalize the first letter only for fields other than 'email' and 'password'
        const capitalizedValue =
            (name !== 'email' && name !== 'password' && name !== 'address1')
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : value;

        if (name === 'regType') {
            // Update regType directly in formData
            setFormData((prevData) => ({
                ...prevData,
                regType: value
            }));
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: capitalizedValue
            }));
        }
    };
    const handleInputChange1 = (event) => {
        const { name, value } = event.target;

        // Capitalize the first letter only for fields other than 'email' and 'password'
        const capitalizedValue =
            (name !== 'email' && name !== 'password')
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : value;

        setFormData1((prevData) => ({
            ...prevData,
            [name]: capitalizedValue
        }));
    };

    useEffect(() => {
        // Set regType whenever it changes
        setFormData((prevData) => ({
            ...prevData,
            regType: regType
        }));
    }, [regType, setFormData]);

    const fetchRegTypeData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TypeList`)
            setRegTypeOptionList(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchRegTypeData()
    }, [])

    const regTypeOptions = regtypptionListoptionlist.map((display) => ({
        value: display.Id,
        label: display.Name,
    }));


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [varify, setverify] = useState(false)
    const [mobileVarification, setMobileVarification] = useState("")
    const [mobileInput, setMobileInput] = useState("")
    const [randomNum, setRandomNum] = useState("")
    const varificationMobile = async (RandomNumber) => {
        try {
            const apiUrl = 'https://api.smsbrain.in/1.2/appsms/send.php';
            const user = 'monaapp.t';
            const passwd = 'monaapp123';
            const senderId = 'MONAPP';
            const recipients = mobileVarification;
            const message = `YourOTP%20is${RandomNumber}for%20Monarch%20MyTaxReport%20Application.%20-%20MONARCH`;
            try {
                const response = await fetch(apiUrl + `?user=${user}&passwd=${passwd}&senderId=${senderId}&recipients=${recipients}&message=${message}`, {
                    method: 'GET',
                    mode: 'no-cors',
                    // headers: {
                    //     "access-control-allow-origin": "*",
                    //     "Content-type": "application/json; charset=UTF-8"
                    // }
                });
                if (response) {
                  
                    notification.success({
                        message: 'OTP Sent Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                } else {
                    
                    notification.error({
                        message: 'Network issue !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            } catch (error) {
                console.error('Error sending SMS:', error);
            }
        } catch (error) {
            console.log(error, "error")
        }
        onDisable(true)
        setverify(true)
    }

    const handleVerify = () => {

        const min = 100000; // Minimum 6-digit number
        const max = 999999; // Maximum 6-digit number
        const RandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        setRandomNum(RandomNumber)
        inputOtp(RandomNumber)
        varificationMobile(RandomNumber)

    }

    const handleOTPsubmit = () => {
        onData(randomNum, mobileInput)
    }

    return (
        <div className="">
            <div className="row">
                <div className="col-sm-12">
                    <div className='reg-heading'>
                        <h4>Fill up Your Details</h4>
                    </div>
                    <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                        <div className="col-sm-12">
                            <Row>
                                <Col lg={12}>
                                    <div className="form-group">
                                        <label>Registration Firm Type<span className='text-danger'>*</span></label>
                                        <Select
                                            options={regTypeOptions}
                                            value={regTypeOptions?.filter((option) =>
                                                option.value == regType
                                            )}
                                            onChange={(selectedOption) => {
                                                setRegType(selectedOption.value); // Update regType in the component state
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    regType: selectedOption.value  // Update regType in the form data
                                                }));
                                            }}
                                            placeholder="Select Reg.Type"
                                            key={regType}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label>First Name<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            inputMode='text'
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            // className="form-control"
                                            placeholder="Enter Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            maxLength={15}  // Add this line to set the maximum length
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label>Last Name<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            inputMode='text'
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            placeholder="Enter Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            maxLength={20}  // Add this line to set the maximum length
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <div className="form-group">
                                        <label>Company Name<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            inputMode='text'
                                            className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                            placeholder="Enter Company Name"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            maxLength={100}  // Add this line to set the maximum length
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <div className="form-group">
                                        <label>Address<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            inputMode='text'
                                            className={`form-control ${errors.address1 ? 'is-invalid' : ''}`}
                                            placeholder="Enter Address"
                                            name="address1"
                                            value={formData.address1}
                                            onChange={handleInputChange}
                                        // maxLength={10}  // Add this line to set the maximum length
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label>Email<span className='text-danger'>*</span></label>
                                        <input
                                            type="email"
                                            inputMode='email'
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="Enter Email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            maxLength={80}  // Add this line to set the maximum length
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label>Mobile<span className='text-danger'>*</span></label>
                                        <div className='d-flex align-items-center'>
                                            <PhoneInput
                                                country={"in"}
                                                enableSearch={true}
                                                name="mobile"
                                                onChange={(value) => {
                                                    setMobileVarification(value.slice(2))
                                                    onDisable(varify)
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        mobile: value
                                                    }));
                                                }}
                                            />
                                            <label className='mobile-verification' onClick={handleVerify}>Verify</label>
                                        </div>

                                    </div>
                                </Col>
                                {
                                    varify && (
                                        <Col lg={12}>
                                            <div className="form-group">
                                                <label>Enter OTP :</label>
                                                <div className='d-flex'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter OTP "
                                                        value={mobileInput}
                                                        onChange={(event) => {
                                                            const input = event.target.value;
                                                            const numericInput = input.replace(/\D/g, "");
                                                            const limitedInput = numericInput.slice(0, 6);
                                                            setMobileInput(limitedInput);
                                                            mobileOtp(limitedInput)
                                                        }}
                                                    />
                                                    <button className='btn btn-success ml-3' onClick={handleOTPsubmit}>Submit</button>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label>Username<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            placeholder="Enter Username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            maxLength={15}  // Add this line to set the maximum length
                                        />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="form-group w-100">
                                        <label>Password<span className='text-danger'>*</span></label>
                                        <div className='d-flex'>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control w-100 ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Enter Password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                maxLength={12}  // Add this line to set the maximum length
                                            />
                                            <div className="input-group-append ml-2">
                                                <button
                                                    className="psw-show-icon"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ContactDetail