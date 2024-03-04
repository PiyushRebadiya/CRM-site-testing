import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { notification } from 'antd';
import CrmLogo from '../../img/crm.png';

const ContactForm = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [message, setMessage] = useState("")
    const [pincode, setPincode] = useState("")
    const [areaname, setAreaName] = useState("")
    const [cityname, setCityName] = useState("")
    const [nameValid, setNameValid] = useState(true);
    const [mobileValid, setMobileValid] = useState(true);
    const [messageValid, setMessageValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [mobileErrorMessage, setMobileErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const URL = process.env.REACT_APP_API_URL

    const validateMobile = (input) => {
        const numericInput = input.replace(/\D/g, '');
        return numericInput.length === 10;
    };

    const validateEmail = (input) => {
        // You can use a simple regex for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    const getEmailsend = async (email, name) => {
        try {
            const res = await axios.post(URL + `/api/Master/SendContactusMail?Cguid=${name}&Transmode=ContactUs&CEmail=${email}`)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (name && mobile && message) {
                const res = await axios.post(URL + '/api/Master/ContactUs', {
                    Name: name,
                    Email: email,
                    Mobile: mobile,
                    Message: message,
                    AreaName: areaname,
                    City: cityname,
                    Pincode: pincode
                })
                if (res.data.Success == true) {
                    if (email) {
                        getEmailsend(email, name)
                    }
                    setMessage('')
                    setMobile('')
                    setEmail('')
                    setName('')
                    setPincode('')
                    setAreaName('')
                    setCityName('')

                    notification.success({
                        message: 'Thank You We Will Contact You Soon !!',
                        placement: 'bottomRight',
                        duration: 3,
                    });
                }
            } else {
                // notification.error({
                //     message: 'Please fill up Name,Mobile No and  Message!!',
                //     placement: 'bottomRight',
                //     duration: 2,
                // });
                setNameValid(!!name);
                setMobileValid(validateMobile(mobile));
                setMessageValid(!!message);

                if (!mobile) {
                    setMobileErrorMessage('Mobile number is required');
                } else if (!validateMobile(mobile)) {
                    setMobileErrorMessage('Invalid mobile number (10 digits required)');
                } else {
                    setMobileErrorMessage('');
                }

                // Validate the email field separately
                if (email && !validateEmail(email)) {
                    setEmailValid(false);
                    setEmailErrorMessage('Invalid email address');
                } else {
                    setEmailValid(true);
                    setEmailErrorMessage('');
                }
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <header id="header" className="header d-flex align-items-center">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <a href="#" className="logo d-flex align-items-center">
                        <img src={CrmLogo} alt="" />
                        {/* <img src={ChirstmasLogo}/> */}
                    </a>
                </div>
            </header>{/* End Header */}
            <section id="contact" className="contact contact-form">
                <div className="container" data-aos="fade-up">
                    <div className="section-header">
                        <h2>Contact Us</h2>
                        <p>Connect with TAXCRM your gateway to personalized financial solutions. Our dedicated team is here to assist you on your journey to financial success.</p>
                    </div>
                    <div className="row gx-lg-0 gy-4">
                        <div className="col-lg-8">
                            <div
                                className='php-email-form border'
                                style={{
                                    border: !nameValid || !mobileValid || !messageValid ? '1px solid red' : '1px solid #ced4da',
                                }}
                            >
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <input type="text" name="name" value={name} className='form-control' style={{
                                            border: !nameValid ? '1px solid red' : '1px solid #ced4da',
                                        }} id="name" onChange={(event) => {
                                            const input = event.target.value;
                                            const limitedInput = input.slice(0, 45);
                                            setName(limitedInput)
                                            setNameValid(true);
                                        }} placeholder="Enter Name" required />
                                        {!nameValid && <div style={{ color: 'red' }}>Name is required</div>}
                                    </div>
                                    <div className="col-md-6 form-group mt-3 mt-md-0">
                                        <input type="email"
                                            className="form-control"
                                            style={{
                                                border: !emailValid ? '1px solid red' : '1px solid #ced4da',
                                            }}
                                            value={email}
                                            name="email"
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const limitedInput = input.slice(0, 45);
                                                setEmail(limitedInput)
                                                setEmailValid(true)
                                            }}
                                            id="email"
                                            placeholder="Enter Email"
                                            required />
                                        {!emailValid && <div style={{ color: 'red' }}>{emailErrorMessage}</div>}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className=" col-md-6 form-group mt-3">
                                        <input type="text" className='form-control' style={{
                                            border: !mobileValid ? '1px solid red' : '1px solid #ced4da',
                                        }} name="subject" id="subject" value={mobile} onChange={(event) => {
                                            const input = event.target.value;
                                            const numericInput = input.replace(/\D/g, '');
                                            const limitedInput = numericInput.slice(0, 10);
                                            setMobile(limitedInput)
                                            setMobileValid(true);
                                            setMobileErrorMessage('');
                                        }}

                                            placeholder="Enter Mobile No." required />
                                        {!mobileValid && <div style={{ color: 'red' }}>{mobileErrorMessage || 'Mobile No. is required'}</div>}
                                    </div>
                                    <div className=" col-md-6 form-group mt-3">
                                        <input className="form-control" text="number" placeholder="Enter Pincode" required
                                            value={pincode} onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = numericInput.slice(0, 6);
                                                setPincode(limitedInput);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className=" col-md-6 form-group mt-3">
                                        <input type="text" className="form-control" name="AreaName" id="AreaName" value={areaname}
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const limitedInput = input.slice(0, 45);
                                                setAreaName(limitedInput)
                                            }}

                                            placeholder="Enter AreaName" required />
                                    </div>
                                    <div className=" col-md-6 form-group mt-3">
                                        <input className="form-control" text="text" placeholder="Enter City Name" required
                                            value={cityname}
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const limitedInput = input.slice(0, 45);
                                                setCityName(limitedInput)
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <textarea className='form-control' style={{
                                        border: !messageValid ? '1px solid red' : '1px solid #ced4da',
                                    }} name="message" rows={7} value={message} placeholder="Enter Message" onChange={(event) => {
                                        setMessage(event.target.value)
                                        setMessageValid(true);
                                    }} required defaultValue={""} />
                                    {!messageValid && <div style={{ color: 'red' }}>Message is required</div>}
                                </div>
                                <div className="text-center"><button type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}> {loading ? 'Saving...' : 'Save'}</button></div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="info-container d-flex flex-column align-items-center justify-content-center">
                                <div className="info-item d-flex">
                                    <a href='https://maps.app.goo.gl/4HMv962FjNBPsri19'><i className="bi bi-geo-alt flex-shrink-0" /></a>
                                    <div>
                                        <h4>Location:</h4>
                                        <p>601-602, 6th Floor,Shubh Square, opp.Venus Hospital, Lal Darwaja,Surat-395003. (Gujarat)</p>
                                    </div>
                                </div>
                                <div className="info-item d-flex">
                                    <i className="bi bi-envelope flex-shrink-0" />
                                    <div>
                                        <h4>Email:</h4>
                                        <p>helpsurat@helpsurat.com</p>
                                    </div>
                                </div>
                                <div className="info-item d-flex">
                                    <i className="bi bi-phone flex-shrink-0" />
                                    <div>
                                        <h4>Call:</h4>
                                        <p>+91 95100 56789 (IVR 20 lines)</p>
                                    </div>
                                </div>
                                <div className="info-item d-flex">
                                    <i className="bi bi-clock flex-shrink-0" />
                                    <div>
                                        <h4>Open Hours:</h4>
                                        <p>Mon-Sat: 10:00 AM - 8:00 PM</p>
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

export default ContactForm