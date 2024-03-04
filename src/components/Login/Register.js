import React, { useState, useEffect } from 'react';
// import Stepper from 'react-stepper-horizontal';
import Package from './Package';
import CompanyDetails from './CompanyDetails';
import ContactDetail from './ContactDetail';
import { useHistory, Link } from 'react-router-dom'
import { notification } from 'antd';
import { Steps } from 'primereact/steps';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

function Register() {
    const [activeStep, setActiveStep] = useState(0);
    const totalSteps = 2;
    const uuid = uuidv4();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState([])
    const history = useHistory()
    let username;
    let password;
    let mobileNo;
    const URL = process.env.REACT_APP_API_URL;
    const MasterOtpGenerate = moment().format("DD") + moment().format('MM') + moment().format('YY')
    const reversedNumber = MasterOtpGenerate.split('').reverse().join('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        regType: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        companyName: '',
        CRM: '',
        office: '',
        HRM: '',
        address1: '',
    });

    // const [formData1, setFormData1] = useState([
    //     {
    //         companyName: "",
    //         address1: ""
    //     }
    // ])

    useEffect(() => {
        const token = localStorage.getItem('CRMtoken')
        if (token) {
            history.push('/taskdashboard')
        }
        else {
            history.push('/register')
        }
    }, [])

    const handlePrev = () => {
        setActiveStep(activeStep - 1);
    };
    const isLastStep = activeStep === totalSteps - 1;
    const steps = [
        { label: 'Fill up your Details' },
        { label: 'Select Your Package' },
        // { label: 'Company Details' },
    ];
    const [randm, setRanDm] = useState("")
    const [mobileinp, setMobileInp] = useState("")

    const handleData = (randomNum, mobileInput) => {
        setRanDm(randomNum)
        setMobileInp(mobileInput)
        if (randomNum == mobileInput || mobileInput == reversedNumber) {
            setIsDisable(true)
            notification.success({
                message: 'Verification  Successfully !!!',
                placement: 'top', // You can adjust the placement
                duration: 2, // Adjust the duration as needed
            });
        } else if (randomNum != mobileInput) {
            setIsDisable(false)
            notification.error({
                message: 'Incorrect verification code!!!',
                placement: 'top', // You can adjust the placement
                duration: 1, // Adjust the duration as needed
            });
        }
    }

    const [isdisable, setIsDisable] = useState(false)
    const [mobileOtp, setMobileotp] = useState("")
    const [inputMatch, setInPutMatch] = useState("")
    const handleDisable = (varify) => {
        setIsDisable(varify)
    }
    const handleotp = (mobileOtp) => {
        setMobileotp(mobileOtp)
    }
    const handleinputOtp = (inputOtp) => {
        setInPutMatch(inputOtp)

    }
    const getStepContent = (step) => {

        switch (step) {
            case 0:
                return <Package formData={formData} setFormData={setFormData} errors={errors}
                    validateForm={validateForm} />;
            case 1:
                return <ContactDetail formData={formData} setFormData={setFormData} errors={errors}
                    validateForm={validateForm} onData={handleData} onDisable={handleDisable} mobileOtp={handleotp} inputOtp={handleinputOtp} />;

            // case 2:
            //     return <CompanyDetails formData={formData} setFormData={setFormData} errors={errors}
            //         validateForm={validateForm} />;

            default:
                return 'Unknown step';
        }
    };


    const validateForm = () => {
        const newErrors = {};

        // User Details: 
        if (!formData.regType) {
            newErrors.regType = 'Reg Type is required';
        }
        if (!formData.firstName) {
            newErrors.firstName = 'First Name is required';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last Name is required';
        }
        if (!formData.companyName) {
            newErrors.companyName = 'Company Name is required';
        }
        if (!formData.username) {
            newErrors.username = 'Username is required';
        }
        if (!formData.address1) {
            newErrors.address1 = 'Address is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        if (!formData.mobile) {
            newErrors.mobile = 'mobile No is required';
        }
        setErrors(newErrors);

        // Return whether the form is valid (no errors)
        return Object.keys(newErrors).length === 0;

    }


    const generateRandomCharacter = (characters) => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    };
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const section1 = Array.from({ length: 8 }, () => generateRandomCharacter(characters));
    const section2 = Array.from({ length: 8 }, () => generateRandomCharacter(characters));
    const section3 = Array.from({ length: 8 }, () => generateRandomCharacter(characters));
    const guid = `${section1.join('')}-${section2.join('')}-${section3.join('')}`;


    const generateRandomNumbers = (length) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    };
    const custidGEN = (formData.firstName.substring(0, 3)).toUpperCase() + generateRandomNumbers(3);
    let custid = custidGEN


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

    useEffect(() => {
        fetchIPAddress();
    }, []);

    const handleuserData = async () => {
        try {
            const res = await axios.post(URL + '/api/Master/CreateUser',
                {
                    Flag: "A",
                    tokens: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        // Name: formData.adminName,
                        Email: formData.email,
                        Mobile: formData.mobile,
                        RegTypeId: formData.regType,
                        Username: formData.username,
                        Password: formData.password,
                        CustId: custid,
                        Role: "Admin",
                        IsActive: true,
                        CRM: formData.CRM,
                        officeman: formData.office,
                        HRM: formData.HRM,
                        IsDefault: true,
                        IPAddress: ipaddress
                    },

                    companylist: [{
                        // CompanyId: formData.company,
                        CompanyName: formData.companyName,
                        Email: formData.email,
                        Guid: guid,
                        IsActive: true,
                        Add1: formData.address1,
                        Mobile1: formData.mobile,
                        CustId: custid,
                    }]
                    // companylist: formData1,
                }
            )

            if (res.data.Sucess === true) {
                localStorage.setItem('CRMCGUID', res.data.Cguid)
                username = res.data.tokens.Username;
                password = res.data.tokens.Password;
                mobileNo = res.data.tokens.Mobile;
                notification.success({
                    message: 'Register Successfully.... !!!',
                    placement: 'top', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
                userLogin()
            }
        }
        catch (error) {
            if (error.response.data.Message == 'UserName Already Exist !!!!') {
                notification.error({
                    message: 'Please Enter another Username!!!',
                    placement: 'top', // You can adjust the placement
                    duration: 3, // Adjust the duration as needed
                });
            }
        }

    }

    const userLogin = async () => {
        try {
            const res = await axios.post(URL + '/api/Token/Login', {
                Username: username,
                Password: password,
                // Mobile:mobileNo
            })
            if (res.data.success === true) {
                localStorage.setItem("CRMUsername", res.data.Username)
                localStorage.setItem("CRMtoken", res.data.token)
                localStorage.setItem("CRMUserId", res.data.Id)
                localStorage.setItem("CRMCustId", res.data.CustId)
                localStorage.setItem("CRMRole", res.data.Role)
                return history.push('/taskdashboard')
            } else {
                // Handle incorrect username or password here
                notification.error({
                    message: 'No User Found !!!',
                    placement: 'top', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleNext = () => {

        // if (validateForm(activeStep)) {
        //     if (activeStep === 1) {
        //         // handleuserData();
        //     }
        //     setActiveStep(activeStep + 1);
        // }
        setActiveStep(activeStep + 1);
    };
    const handleSubmit = async () => {

        if (validateForm(activeStep)) {
            if (activeStep === 1) {
                if (mobileOtp.length == 6 && inputMatch == mobileOtp || mobileOtp.length == 6 && mobileOtp == reversedNumber) {
                    if (isdisable == true) {
                        let swalLoading = Swal.fire({
                            title: 'Please wait, while We Create Your Profile!!',
                            html: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"  viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#3AC977" stroke-width="4"><animate attributeName="r" from="20" to="0" dur="1s" begin="0s" repeatCount="indefinite" /></circle></svg>',
                            allowOutsideClick: false,
                            showConfirmButton: false, // hide the Confirm button
                            showCancelButton: false, // hide the Cancel button
                            onBeforeOpen: () => {
                                Swal.showLoading();
                            },
                        });
                        try {
                            const res = await axios.post(URL + `/api/Master/CreateDb?CustId=${custid}`)
                            if (res.data.Success == true) {
                                Swal.close();
                                handleuserData();
                                localStorage.setItem('CRMCustId', custid)
                            }
                        } catch (error) {
                            Swal.close();
                            Swal.fire({
                                title: 'Please Try Again Later !!',
                                html: true,
                                icon: 'error',
                                timer: 3000,
                                timerProgressBar: true,
                                showConfirmButton: true,
                            });
                        }
                    } else {
                        notification.error({
                            message: 'Please Mobile No. Verification!!!',
                            placement: 'bottomRight', // You can adjust the placement
                            duration: 2, // Adjust the duration as needed
                        });
                    }
                } else {
                    notification.error({
                        message: 'Enter Verification Code!!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 2, // Adjust the duration as needed
                    });
                }

            }

            // history.push('/firmmaster');
            //  notification.success({
            //      message: 'Registration Successfully !!!',
            //      placement: 'top', // You can adjust the placement
            //      duration: 1, // Adjust the duration as needed
            //  });
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
        }

    };
    
    const showAlert = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                history.push('/login')
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Swal.fire('Cancelled', 'No changes have been made.', 'error');
            }
        });
    };

    return (
        <div className='main-registration'>
            <Container>
                <div className='regester-section'>
                    <div className="login-wrapper">
                        {/* ... Your existing code ... */}
                        <div className="container-center lg">
                            <div className="login-area">
                                <div className=" panel-custom">
                                    <div className="card-body register-input-section">
                                        <div className='reg-heading'>
                                            <h4>Registration</h4>
                                        </div>
                                        {/* <Stepper steps={steps} activeStep={activeStep} /> */}
                                        {/* <Steps model={steps} activeIndex={activeStep} className=' step-heading p-4' /> */}
                                        {getStepContent(activeStep)}
                                        <div className='regester-main'>
                                            <div className='pre-sub-btn'>
                                                {
                                                    activeStep == 0 || activeStep === 2 ? null : <button onClick={handlePrev} className="submit-btn-reg ">
                                                        Previous
                                                    </button>
                                                }

                                                {isLastStep ? (
                                                    <button className="submit-btn-reg" onClick={handleSubmit}>Save</button>
                                                ) : (
                                                    <button className="submit-btn-reg" onClick={handleNext}>Next</button>
                                                )}
                                            </div>
                                            <div className='aleready-account-section'>
                                                <a onClick={showAlert} className='account-link mr-2'>already have account?</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Register;
