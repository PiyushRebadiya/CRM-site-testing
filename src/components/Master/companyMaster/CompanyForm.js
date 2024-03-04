import React from 'react'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { FiMoreHorizontal } from 'react-icons/fi';
import { addressFieldChange } from '../common/Address'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Select from 'react-select';
import { notification } from 'antd';
import { async } from 'q';
import * as Yup from 'yup';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import PincodeMaster from '../PartyMaster/PincodeMaster'
import { v4 as uuidv4 } from 'uuid';
import { useContext } from 'react';
import CompanyListContext from '../../context/filteredCompanyList';

// Form validation Schema start
const PANRegex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const GSTINRegex = /^([0-9]){2}([A-Z]){5}([0-9]){4}([A-Z]){1}([1-9A-Z]){1}([A-Z]){1}[0-9A-Z]{1}$/;
const MobileNoRegex = /^\d{12}$/;
const GmailRegex = /@.*\./;
const PhoneNumberRegex = /^\d{4}-\d{6}$|^\d{5}-\d{6}$/;
// const GmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const validationSchema = Yup.object().shape({
    // selectedfirm: Yup.string().required("Please select Firm name"),
    companyname: Yup.string().required("Company Name is required"),
    // pan: Yup.string().required("PAN Number is required").matches(PANRegex, 'Invalid format! Valid format "ABCDE1234A"'),
    // pan: Yup.string().nullable() // Allow null or empty value
    //     .matches(PANRegex, 'Invalid format! Valid format "ABCDE1234A"'),
    pan: Yup.string()
        .nullable() // Allow null or empty value
        .test({
            name: 'panFormat',
            test: function (value) {
                // Access other field values using this.parent
                const isPanNotEmpty = value && value.trim().length > 0;

                // Apply validation only if PAN is not empty
                if (isPanNotEmpty) {
                    return PANRegex.test(value);
                }

                // If PAN is empty, consider it as valid
                return true;
            },
            message: 'Invalid format! Valid format "ABCDE1234A"',
        }),
    email: Yup.string()
        .nullable() // Allow null or empty value
        .test({
            name: 'gmailFormet',
            test: function (value) {
                // Access other field values using this.parent
                const isGmailNotEmpty = value && value.trim().length > 0;

                // Apply validation only if Email is not empty
                if (isGmailNotEmpty) {
                    return GmailRegex.test(value);
                }

                // If Email is empty, consider it as valid
                return true;
            },
            message: `Enter Valid Email`,
        }),
    // assignTo: Yup.array().required("Please select who you want to assign the task"),
    // gst: Yup.string().required("GST Number is required").matches(GSTINRegex, 'Invalid format! Valid format "12ABCDE3456F7ZG"'),
    // gst: Yup.string().nullable() // Allow null or empty value
    //     .matches(GSTINRegex, 'Invalid format! Valid format "12ABCDE3456F7ZG"'),
    gst: Yup.string()
        .nullable() // Allow null or empty value
        .test({
            name: 'gstFormat',
            test: function (value) {
                // Access other field values using this.parent
                const isGstNotEmpty = value && value.trim().length > 0;

                // Apply validation only if PAN is not empty
                if (isGstNotEmpty) {
                    return GSTINRegex.test(value);
                }

                // If PAN is empty, consider it as valid
                return true;
            },
            message: 'Invalid format! Valid format "12ABCDE3456F7ZG"',
        }),
    // selectstate: Yup.string().required("Please select State"),
    // selectedcity: Yup.string().required("Please select City"),
    // pincodeselected: Yup.number().required("Please select Pincode"),
    // email: Yup.string().required("Email is required"),

    // mobile1: Yup.string()
    //     .nullable() // Allow null or empty value
    //     .required("Mobile No is required")
    //     .test({
    //         name: 'mobile1Format',
    //         test: function (value) {
    //             // Access other field values using this.parent
    //             const isMobile1NotEmpty = value && value.trim().length > 0;

    //             // Apply validation only if PAN is not empty
    //             if (isMobile1NotEmpty) {
    //                 return MobileNoRegex.test(value);
    //             }
    //             return true;
    //         },
    //         message: 'Invalid Number!',
    //     }),
    //  mobile2: Yup.string()
    //     .nullable() // Allow null or empty value
    //     .test({
    //         name: 'mobile1Format',
    //         test: function (value) {
    //             // Access other field values using this.parent
    //             const isMobile1NotEmpty = value && value.trim().length > 0;

    //             // Apply validation only if PAN is not empty
    //             if (isMobile1NotEmpty) {
    //                 return MobileNoRegex.test(value);
    //             }
    //             return true;
    //         },
    //         message: 'Invalid Number!',
    //     }),
    mobile1: Yup.string().required("Mobile No is required"),
    // mobile1: Yup.string()
    //     .matches(/^\+91\d{10}$/, 'Mobile number must be in the format +919XXXXXXXXX')
    //     .nullable()
    //     .required('Mobile number is required'),
    // mobile2: Yup.string()
    //     .nullable() // Allow null or empty value
    //     .test({
    //         name: 'mobile2Format',
    //         test: function (value) {
    //             // Access other field values using this.parent
    //             const isMobile2NotEmpty = value && value.trim().length > 0;

    //             // Apply validation only if PAN is not empty
    //             if (isMobile2NotEmpty) {
    //                 return Mobile2NoRegex.test(value);
    //             }

    //             // If PAN is empty, consider it as valid
    //             return true;
    //         },
    //         message: 'Invalid Number!',
    //     }),
    // add1: Yup.string().required("Address is required"),
    // add2: Yup.string().required("Address is required"),
    // add3: Yup.string().required("Address is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const CompanyForm = ({ onHide, rowData, fetchData }) => {
    const [isactive, setIsActive] = useState(true)
    const [selectstate, setSelectState] = useState(null)
    const [stateData, setStateData] = useState([])
    const [citydata, setCityData] = useState([])
    const [cityconvert, setCityConvert] = useState([])
    const [selectedcity, setSelectedCity] = useState(null)
    const [pincodeData, setPincodeData] = useState([])
    const [pincodeconvert, setPincodeConvert] = useState([])
    const [getfirmdata, setGetFirmData] = useState([])
    const [selectedfirm, setSelectedFirm] = useState("")
    const [pincodeselected, setPincodeSelected] = useState(null)
    const [companyid, setCompanyId] = useState(-1)
    const [companyname, setCompanyName] = useState("")
    const [pan, setPan] = useState(null)
    const [gst, setGst] = useState(null)
    const [email, setemail] = useState("")
    const [mobile1, setMobile1] = useState(null)
    const [mobile2, setMobile2] = useState(null)
    const [add1, setAdd1] = useState("")
    const [add2, setAdd2] = useState("")
    const [add3, setAdd3] = useState("")
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('CRMtoken')
    const userId = localStorage.getItem("CRMUserId")
    const custId = localStorage.getItem("CRMCustId")
    const userName = localStorage.getItem("CRMUsername")
    const CRMCguid = localStorage.getItem("CRMCGUID")
    const URL = process.env.REACT_APP_API_URL
    const [editcityfilter, setEditecityFilter] = useState([])
    const [gstEdit, setGstEdit] = useState(true)
    const [loading, setLoading] = useState(false);
    const [pincodeModal, setpincodeModal] = useState(false);
    const [guid, setGuid] = useState("")

    const { filteredCompanyList, setFilteredCompanyList } = useContext(CompanyListContext);
    // const [value, setValue] = useState()
    useEffect(() => {
        if (rowData) {
            setCompanyName(rowData.CompanyName)
            setPan(rowData.PAN)
            setGst(rowData.GST)
            setemail(rowData.Email)
            setPincodeSelected(rowData.PincodeId)
            setSelectedCity(rowData.CityId)
            setSelectState(rowData.StateId)
            setMobile1(rowData.Mobile1)
            setMobile2(rowData.Mobile2)
            setAdd1(rowData.Add1)
            setAdd2(rowData.Add2)
            setAdd3(rowData.Add3)
            setCompanyId(rowData.CompanyId)
            setIsActive(rowData.IsActive)
            setSelectedFirm(rowData.FirmId)
            setGuid(rowData.Guid)
            EditPincode(rowData.StateId, rowData.CityId)
            setGstEdit(false)
        }
    }, [rowData])


    function PincodeNew(props) {
        const { getPincode } = props;
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <PincodeMaster getPincode={getPincode} onHide={props.onHide} />
            </Modal>
        )
    }

    const EditPincode = async (StateId, CityId) => {

        // let state
        let citydata
        let pincodedata
        // try {
        //     const res = await axios.get(URL + '/api/Master/StateList')
        //     state = res.data
        // } catch (error) {
        //     console.log(error)
        // }

        // const fillterStateCode = state.find((item) => item.StateID == selectstate)
        // setGst(fillterStateCode.StateCode + pan)
        try {
            const res = await axios.get(URL + '/api/Master/CityList')
            // console.log(res.data,"response")
            citydata = res.data
        } catch (error) {
            console.log(error)
        }

        try {
            const res = await axios.get(URL + '/api/Master/PincodeList')
            // console.log(res.data,"responsepincodefffff")
            pincodedata = res.data
        } catch (error) {
            console.log(error)
        }
        const cityconvert = citydata.filter((display) => display.StateID == StateId)
        setCityConvert(cityconvert)

        const pincodeconvert = pincodedata.filter((display) => display.CityID == CityId)
        setPincodeConvert(pincodeconvert)
    }
    const getPincode = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/PincodeList', {
            })
            setPincodeData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getStateData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/StateList')
            setStateData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getCityData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/CityList')
            setCityData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getFirmListData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/AdminFirmList?CustId=${custId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetFirmData(res.data)
        } catch (error) {

        }
    }

    const getCompanyList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CompanyList?CustId=${custId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
           
            setFilteredCompanyList(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    // IP-Address
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
        getPincode()
        getStateData()
        getCityData()
        getFirmListData()
        fetchIPAddress()
    }, [])
    const stateOption = stateData.map((display) => ({
        value: display.StateID,
        label: display.StateName,
    }));

    const firmoption = getfirmdata.map((display) => ({
        value: display.FirmId,
        label: display.FirmName,
    }));
    useEffect(() => {
        if (selectstate) {
            const cityconvert = citydata.filter((display) => display.StateID == selectstate)
            setCityConvert(cityconvert)
        }
    }, [selectstate])

    useEffect(() => {
        if (selectedcity) {
            const pincodeconvert = pincodeData.filter((display) => display.CityID == selectedcity)
            setPincodeConvert(pincodeconvert)
        }
    }, [selectedcity])
    const cityoption = cityconvert.map((display) => ({
        value: display.CityID,
        label: display.CityName,
    }));
    const pincodeOptions = pincodeconvert.map((display) => ({
        value: display.PinCodeID,
        label: display.Code,
    }));

    useEffect(() => {
        if (selectstate) {
            if (gstEdit == true) {
                const fillterStateCode = stateData.find((item) => item.StateID == selectstate)
                setGst(fillterStateCode.StateCode)
            }
        }
    }, [selectstate])

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${custId}`;

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                // selectedfirm,
                companyname,
                pan,
                gst,
                email,
                // selectstate,
                // selectedcity,
                // pincodeselected,
                mobile1,
                mobile2,
                // add1,
                // add2,
                // add3,
            }, { abortEarly: false });
            setLoading(true);
            if (companyid > 0) {
                const res = await axios.post(URL + "/api/Master/CreateCompany", {
                    Flag: "U",
                    companys: {
                        CompanyId: companyid,
                        UserId: userId,
                        UserName: userName,
                        CompanyName: companyname,
                        Add1: addressFieldChange(add1.trim()),
                        Add2: addressFieldChange(add2.trim()),
                        Add3: addressFieldChange(add3.trim()),
                        PincodeId: pincodeselected,
                        CityId: selectedcity,
                        StateId: selectstate,
                        Mobile1: mobile1,
                        Mobile2: mobile2,
                        Email: email,
                        PAN: pan,
                        GST: gst,
                        IsActive: isactive,
                        CustId: custId,
                        IPAddress: ipaddress,
                        Cguid: CRMCguid,
                        Guid: guid
                    }
                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
                    getCompanyList()
                    onHide()
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateCompany", {
                    Flag: "A",
                    companys: {
                        UserId: userId,
                        UserName: userName,
                        CompanyName: companyname,
                        Add1: addressFieldChange(add1.trim()),
                        Add2: addressFieldChange(add2.trim()),
                        Add3: addressFieldChange(add3.trim()),
                        PincodeId: pincodeselected,
                        CityId: selectedcity,
                        StateId: selectstate,
                        Mobile1: mobile1,
                        Mobile2: mobile2,
                        Email: email,
                        PAN: pan,
                        GST: gst,
                        IsActive: true,
                        CustId: custId,
                        IPAddress: ipaddress,
                        Cguid: CRMCguid,
                        Guid: UUID,
                    }
                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
                    getCompanyList()
                    onHide()
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
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [companyid, companyname, selectstate, selectedcity, pincodeselected, pan, gst, email, mobile1, mobile2, add1, add2, add3, isactive]);

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

    function capitalizeEachWord(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        <div>
            <div className="form-border">
                {/* Content Header (Page header) */}
                {/* <section className="content-header model-close-btn" style={{ width: "100%" }}>
                        <div className='form-heading'>
                            <div className="header-icon">
                                <i className="fa fa-users" />
                            </div>
                            <div className="header-title">
                                <h1>Add Company</h1>
                            </div>
                        </div>
                        <div className='close-btn'>
                            <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </section> */}
                {/* Main content */}
                <div className="mt-2">
                    <div className="row">
                        {/* Form controls */}
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Company Name :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" value={companyname} onChange={(event) => {
                                            const input = event.target.value;
                                            // const capitalValue = input.toUpperCase();
                                            const limitedInput = input.slice(0, 60);
                                            setCompanyName(limitedInput);
                                            if (errors.companyname) {
                                                setErrors(prevErrors => ({ ...prevErrors, companyname: '' }));
                                            }
                                        }} placeholder="Enter Company Name" />
                                        {errors.companyname && <div className="error-message text-danger">{errors.companyname}</div>}
                                    </div>
                                    <Row>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                {/* <label>State : <span className='text-danger'>*</span></label> */}
                                                <label>State :</label>
                                                <Select
                                                    options={stateOption}
                                                    // value={stateOption.find((option) => option.value == selectstate)}
                                                    isClearable={true}
                                                    value={selectstate ? stateOption.find((option) => option.value === selectstate) : null}
                                                    placeholder="Select State"
                                                    onChange={(selectedState) => {
                                                        setSelectState(selectedState ? selectedState.value : '');
                                                        setSelectedCity(''); // Update regType in the component state
                                                        setPincodeSelected('')
                                                        setGstEdit(true)
                                                        // if (errors.selectstate) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, selectstate: null }));
                                                        // }
                                                    }}
                                                />
                                                {/* {errors.selectstate && <div className="error-message text-danger">{errors.selectstate}</div>} */}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                {/* <label>City :<span className='text-danger'>*</span></label> */}
                                                <label>City :</label>
                                                <Select
                                                    options={cityoption}
                                                    // isDisabled={selectstate ? false : true}
                                                    // value={cityoption.find((option) => option.value == selectedcity)}
                                                    isClearable={true}
                                                    value={selectedcity ? cityoption.find((option) => option.value === selectedcity) : null}
                                                    placeholder="Select City"
                                                    onChange={(selectedCity) => {
                                                        setSelectedCity(selectedCity ? selectedCity.value : '');
                                                        setPincodeSelected('')
                                                        // if (errors.selectedcity) {
                                                        //     setErrors(prevErrors => ({ ...prevErrors, selectedcity: null }));
                                                        // }
                                                    }}
                                                />
                                                {/* {errors.selectedcity && <div className="error-message text-danger">{errors.selectedcity}</div>} */}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form-group">
                                                {/* <label>Pincode :<span className='text-danger'>*</span></label> */}
                                                <label>Pincode :</label>
                                                <div className='d-flex ' >
                                                    <Select
                                                        options={pincodeOptions}
                                                        className='w-100'

                                                        // isDisabled={selectedcity ? false : true}
                                                        // value={pincodeOptions.find((option) => option.value == pincodeselected)}
                                                        isClearable={true}
                                                        value={pincodeselected ? pincodeOptions.find((option) => option.value === pincodeselected) : null}
                                                        placeholder="Select Pincode"
                                                        onChange={(selectedPincode) => {
                                                            setPincodeSelected(selectedPincode ? selectedPincode.value : '');
                                                            // if (errors.pincodeselected) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, pincodeselected: null }));
                                                            // }
                                                        }}
                                                        maxMenuHeight={200}
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setpincodeModal(true)} />
                                                        <PincodeNew
                                                            show={pincodeModal}
                                                            onHide={() => setpincodeModal(false)}
                                                            getPincode={getPincode}
                                                        />
                                                    </div>
                                                    {/* {errors.pincodeselected && <div className="error-message text-danger">{errors.pincodeselected}</div>} */}
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col lg={6} md={12}>
                                            <div className="form-group">
                                                {/* <label>GST :<span className='text-danger'>*</span></label> */}
                                                <label>GST :</label>
                                                <input type="text" className="form-control" value={gst} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const convertInput = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                    const limitedInput = convertInput.slice(0, 15);
                                                    setGst(limitedInput);
                                                    const extractedPanValue = limitedInput.slice(2, 12);
                                                    setPan(extractedPanValue)

                                                    if (errors.gst) {
                                                        setErrors(prevErrors => ({ ...prevErrors, gst: null }));
                                                    }
                                                }} placeholder="Enter GST " />
                                                {errors.gst && <div className="error-message text-danger">{errors.gst}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={12}>
                                            <div className="form-group">
                                                <label>PAN :</label>
                                                {/* <label>PAN :</label> */}
                                                <input type="text" className="form-control" value={pan} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const filteredInput = input.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Allow only capital letters and numbers
                                                    const limitedInput = filteredInput.slice(0, 10);
                                                    setPan(limitedInput);
                                                    setGstEdit(true)
                                                    if (errors.pan) {
                                                        setErrors(prevErrors => ({ ...prevErrors, pan: null }));
                                                    }
                                                }} placeholder="Enter PAN " />
                                                {errors.pan && <div className="error-message text-danger">{errors.pan}</div>}
                                            </div>
                                        </Col>

                                    </Row>
                                    <div className="form-group">
                                        {/* <label>Email :<span className='text-danger'>*</span></label> */}
                                        <label>Email :</label>
                                        <input type="text" className="form-control" value={email} onChange={(event) => {
                                            const input = event.target.value;
                                            const lowerCase = input.toLowerCase();
                                            const limitedInput = lowerCase.slice(0, 50);
                                            setemail(limitedInput)
                                            if (errors.email) {
                                                setErrors(prevErrors => ({ ...prevErrors, email: null }));
                                            }
                                        }} placeholder="Enter Email" />
                                        {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                                    </div>

                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Mobile1 :<span className='text-danger'>*</span></label>
                                                {/* <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile1} onChange={(event) => {
                                                        const input = event.target.value;
                                                        const numericInput = input.replace(/\D/g, '');
                                                        const limitedInput = numericInput.slice(0, 10);
                                                        setMobile1(limitedInput);
                                                        if (errors.mobile1) {
                                                            setErrors(prevErrors => ({ ...prevErrors, mobile1: null }));
                                                        }
                                                    }} /> */}
                                                <PhoneInput
                                                    country={"in"}
                                                    enableSearch={true}
                                                    value={mobile1}
                                                    onChange={(value) => {
                                                        setMobile1(value);
                                                        if (errors.mobile1) {
                                                            setErrors((prevErrors) => ({ ...prevErrors, mobile1: null }));
                                                        }
                                                    }}
                                                />
                                                {errors.mobile1 && <div className="error-message text-danger">{errors.mobile1}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Mobile2 :</label>
                                                {/* <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile2} onChange={(event) => {
                                                        const input = event.target.value;
                                                        const numericInput = input.replace(/\D/g, '');
                                                        const limitedInput = numericInput.slice(0, 10);
                                                        setMobile2(limitedInput);
                                                        if (errors.mobile2) {
                                                            setErrors(prevErrors => ({ ...prevErrors, mobile2: null }));
                                                        }
                                                    }} /> */}
                                                <PhoneInput
                                                    country={"in"}
                                                    enableSearch={true}
                                                    value={mobile2}
                                                    onChange={(value) => {
                                                        setMobile2(value);
                                                        // if (errors.mobile2) {
                                                        //     setErrors((prevErrors) => ({ ...prevErrors, mobile2: null }));
                                                        // }
                                                    }}
                                                />
                                                {errors.mobile2 && <div className="error-message text-danger">{errors.mobile2}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">
                                        {/* <label>Address1 :<span className='text-danger'>*</span></label> */}
                                        <label>Address1 :</label>
                                        <input type="text" className="form-control" placeholder="Enter Address1" value={add1} onChange={(event) => {
                                            const input = event.target.value;
                                            const formattedValue = capitalizeEachWord(input);
                                            setAdd1(formattedValue);
                                            // if (errors.add1) {
                                            //     setErrors(prevErrors => ({ ...prevErrors, add1: null }));
                                            // }
                                        }} />
                                        {/* {errors.add1 && <div className="error-message text-danger">{errors.add1}</div>} */}
                                    </div>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                {/* <label>Address2 :<span className='text-danger'>*</span></label> */}
                                                <label>Address2 :</label>
                                                <input type="text" className="form-control" placeholder="Enter Address2" value={add2} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const formattedValue = capitalizeEachWord(input);
                                                    setAdd2(formattedValue)
                                                    // if (errors.add2) {
                                                    //     setErrors(prevErrors => ({ ...prevErrors, add2: null }));
                                                    // }
                                                }} />
                                                {/* {errors.add2 && <div className="error-message text-danger">{errors.add2}</div>} */}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                {/* <label>Address3 :<span className='text-danger'>*</span></label> */}
                                                <label>Address3 :</label>
                                                <input type="text" className="form-control" placeholder="Enter Address3" value={add3} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const formattedValue = capitalizeEachWord(input);
                                                    setAdd3(formattedValue)
                                                    // if (errors.add3) {
                                                    //     setErrors(prevErrors => ({ ...prevErrors, add3: null }));
                                                    // }
                                                }} />
                                                {/* {errors.add3 && <div className="error-message text-danger">{errors.add3}</div>} */}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div>
                                        <label>Status : </label><br />
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                        <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Deactive</label>
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

export default CompanyForm