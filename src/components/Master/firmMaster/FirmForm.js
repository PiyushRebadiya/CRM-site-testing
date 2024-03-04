import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { notification } from 'antd';
import * as Yup from 'yup';

// Form validation Schema start
const PANRegex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const GSTINRegex = /^([0-9]){2}([A-Z]){5}([0-9]){4}([A-Z]){1}([1-9A-Z]){1}Z[0-9A-Z]{1}$/;
const MobileNoRegex = /^\d{10}$/;
const validationSchema = Yup.object().shape({
    firmname: Yup.string().required("Please select Firm name"),
    firmselected: Yup.string().required("Please select Firm Type"),
    pan: Yup.string().required("PAN Number is required").matches(PANRegex, 'Invalid format! Valid format "ABCDE1234A"'),
    // assignTo: Yup.array().required("Please select who you want to assign the task"),
    gst: Yup.string().required("GST Number is required").matches(GSTINRegex, 'Invalid format! Valid format "12ABCDE3456F7ZG"'),
    email: Yup.string().required("Email is required"),
    selectstate: Yup.string().required("Please select State"),
    selectedcity: Yup.string().required("Please select City"),
    pincodeselected: Yup.number().required("Please select Pincode"),
    mobile1: Yup.string().required("Mobile Number is required").matches(MobileNoRegex, 'Invalid format!'),
    // mobile2: Yup.string().required("Alternative Mobile Number is required").matches(MobileNoRegex, 'Invalid format!'),
    add1: Yup.string().required("Address is required"),
    add2: Yup.string().required("Address is required"),
    add3: Yup.string().required("Address is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

const FirmForm = ({ onHide, rowData, fetchData }) => {

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
    const [firmselected, setfirmSelected] = useState("")
    const [pincodeselected, setPincodeSelected] = useState(null)
    const [firmid, setFirmId] = useState(-1)
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
    const URL = process.env.REACT_APP_API_URL
    const [firmname, setFirmName] = useState("")
    useEffect(() => {
        if (rowData) {
            setFirmName(rowData.FirmName)
            setfirmSelected(rowData.FirmType)
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
            setFirmId(rowData.FirmId)
            setIsActive(rowData.IsActive)
            setSelectedFirm(rowData.FirmId)
            EditPincode(rowData.StateId, rowData.CityId)
        }
    }, [rowData])

    const EditPincode = async (StateId, CityId) => {
        let citydata
        let pincodedata
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
    useEffect(() => {
        getPincode()
        getStateData()
        getCityData()
    }, [])
    const stateOption = stateData.map((display) => ({
        value: display.StateID,
        label: display.StateName,
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
    const firmTypeOptions = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Firm', label: 'Firm' },
        { value: 'Pvt Ltd', label: 'Pvt Ltd' },
        { value: 'LLP', label: 'LLP' },
        { value: 'Others', label: 'Others' },
    ];

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                firmname,
                firmselected,
                pan,
                gst,
                email,
                selectstate,
                selectedcity,
                pincodeselected,
                mobile1,
                // mobile2,
                add1,
                add2,
                add3,
            }, { abortEarly: false });
            if (firmid > 0) {
                const res = await axios.post(URL + "/api/Master/CreateFirm", {
                    FirmId: firmid,
                    UserId: userId,
                    CustId: custId,
                    FirmName: firmname,
                    FirmType: firmselected,
                    PAN: pan,
                    GST: gst,
                    Email: email,
                    PincodeId: pincodeselected,
                    CityId: selectedcity,
                    StateId: selectstate,
                    Mobile1: mobile1,
                    Mobile2: mobile2,
                    Add1: add1,
                    Add2: add2,
                    Add3: add3,
                    IsActive: true,

                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'top', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateFirm", {
                    UserId: userId,
                    CustId: custId,
                    FirmName: firmname,
                    FirmType: firmselected,
                    PAN: pan,
                    GST: gst,
                    Email: email,
                    PincodeId: pincodeselected,
                    CityId: selectedcity,
                    StateId: selectstate,
                    Mobile1: mobile1,
                    Mobile2: mobile2,
                    Add1: add1,
                    Add2: add2,
                    Add3: add3,
                    IsActive: true,

                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'top', // You can adjust the placement
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
        }
    }

    function capitalizeEachWord(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        <div>
            <div>
                <div>
                    <div className="form-border">
                        {/* Content Header (Page header) */}
                        <section className="content-header model-close-btn" style={{ width: "100%" }}>
                            <div className='form-heading'>
                                <div className="header-icon">
                                    <i className="fa fa-users" />
                                </div>
                                <div className="header-title">
                                    <h1>Add Firm</h1>
                                    {/* <small>Category list</small> */}
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
                                    <div className="lobicard all_btn_card" id="lobicard-custom-control1">

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Firm Name :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control" placeholder="Enter Firm Name" value={firmname} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const capitalLetters = input.toUpperCase();
                                                    setFirmName(capitalLetters)
                                                    if (errors.firmname) {
                                                        setErrors(prevErrors => ({ ...prevErrors, firmname: '' }));
                                                    }
                                                }} />
                                                {errors.firmname && <div className="error-message text-danger">{errors.firmname}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label>Firm Type :<span className='text-danger'>*</span></label>
                                                <Select
                                                    options={firmTypeOptions}
                                                    name='companyType'
                                                    value={firmTypeOptions.find((option) => option.value == firmselected)}
                                                    placeholder="Select Firm"
                                                    onChange={(selectedFirm) => {
                                                        setfirmSelected(selectedFirm.value);
                                                        if (errors.firmselected) {
                                                            setErrors(prevErrors => ({ ...prevErrors, firmselected: '' }));
                                                        }
                                                    }}
                                                />
                                                {errors.firmselected && <div className="error-message text-danger">{errors.firmselected}</div>}
                                            </div>
                                            <Row>
                                                <Col lg={4}>
                                                    <div className="form-group">
                                                        <label>State :<span className='text-danger'>*</span></label>
                                                        <Select
                                                            options={stateOption}
                                                            value={stateOption.find((option) => option.value == selectstate)}
                                                            placeholder="Select State"
                                                            onChange={(selectedState) => {
                                                                setSelectState(selectedState.value); // Update regType in the component state
                                                                if (errors.selectstate) {
                                                                    setErrors(prevErrors => ({ ...prevErrors, selectstate: null }));
                                                                }
                                                            }}
                                                        />
                                                        {errors.selectstate && <div className="error-message text-danger">{errors.selectstate}</div>}
                                                    </div>

                                                </Col>
                                                <Col lg={4}>
                                                    <div className="form-group">
                                                        <label>City :<span className='text-danger'>*</span></label>
                                                        <Select
                                                            options={cityoption}
                                                            value={cityoption.find((option) => option.value == selectedcity)}
                                                            placeholder="Select City"
                                                            onChange={(selectedCity) => {
                                                                setSelectedCity(selectedCity.value);
                                                                if (errors.selectedcity) {
                                                                    setErrors(prevErrors => ({ ...prevErrors, selectedcity: null }));
                                                                }
                                                            }}

                                                        />
                                                        {errors.selectedcity && <div className="error-message text-danger">{errors.selectedcity}</div>}
                                                    </div>
                                                </Col>
                                                <Col lg={4}>
                                                    <div className="form-group">
                                                        <label>Pincode :<span className='text-danger'>*</span></label>
                                                        <Select
                                                            options={pincodeOptions}
                                                            value={pincodeOptions.find((option) => option.value == pincodeselected)}
                                                            placeholder="Select Pincode"
                                                            onChange={(selectedPincode) => {
                                                                setPincodeSelected(selectedPincode.value);
                                                                if (errors.pincodeselected) {
                                                                    setErrors(prevErrors => ({ ...prevErrors, pincodeselected: null }));
                                                                }
                                                            }}
                                                            maxMenuHeight={200}
                                                        />
                                                        {errors.pincodeselected && <div className="error-message text-danger">{errors.pincodeselected}</div>}
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col lg={6} md={12}>
                                                    <div className="form-group">
                                                        <label>PAN :<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" value={pan} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const filteredInput = input.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Allow only capital letters and numbers
                                                            const limitedInput = filteredInput.slice(0, 10);
                                                            setPan(limitedInput);
                                                            if (errors.pan) {
                                                                setErrors(prevErrors => ({ ...prevErrors, pan: null }));
                                                            }
                                                        }} placeholder="Enter PAN " />
                                                        {errors.pan && <div className="error-message text-danger">{errors.pan}</div>}
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <div className="form-group">
                                                        <label>GST :<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" value={gst} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const convertInput = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                            const limitedInput = convertInput.slice(0, 15);
                                                            setGst(limitedInput);
                                                            if (errors.gst) {
                                                                setErrors(prevErrors => ({ ...prevErrors, gst: null }));
                                                            }
                                                        }} placeholder="Enter GST " />
                                                        {errors.gst && <div className="error-message text-danger">{errors.gst}</div>}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="form-group">
                                                <label>Email :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control" value={email} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const limitedInput = input.slice(0, 25);
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
                                                        <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile1} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const numericInput = input.replace(/\D/g, '');
                                                            const limitedInput = numericInput.slice(0, 10);
                                                            setMobile1(limitedInput);
                                                            if (errors.mobile1) {
                                                                setErrors(prevErrors => ({ ...prevErrors, mobile1: null }));
                                                            }
                                                        }} />
                                                        {errors.mobile1 && <div className="error-message text-danger">{errors.mobile1}</div>}
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="form-group">
                                                        <label>Mobile2</label>
                                                        <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile2} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const numericInput = input.replace(/\D/g, '');
                                                            const limitedInput = numericInput.slice(0, 10);
                                                            setMobile2(limitedInput);
                                                            // if (errors.mobile2) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, mobile2: null }));
                                                            // }
                                                        }} />
                                                        {/* {errors.mobile2 && <div className="error-message text-danger">{errors.mobile2}</div>} */}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="form-group">
                                                <label>Address1 :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control" placeholder="Enter Address1" value={add1} onChange={(event) => {
                                                     const input = event.target.value;
                                                     const formattedValue = capitalizeEachWord(input);
                                                     setAdd1(formattedValue);
                                                    if (errors.add1) {
                                                        setErrors(prevErrors => ({ ...prevErrors, add1: null }));
                                                    }
                                                }} />
                                                {errors.add1 && <div className="error-message text-danger">{errors.add1}</div>}
                                            </div>
                                            <Row>
                                                <Col lg={6}>
                                                    <div className="form-group">
                                                        <label>Address2 :<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" placeholder="Enter Address2" value={add2} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const formattedValue = capitalizeEachWord(input);
                                                            setAdd2(formattedValue);
                                                            if (errors.add2) {
                                                                setErrors(prevErrors => ({ ...prevErrors, add2: null }));
                                                            }
                                                        }} />
                                                        {errors.add2 && <div className="error-message text-danger">{errors.add2}</div>}
                                                    </div>
                                                </Col>
                                                <Col lg={6}>
                                                    <div className="form-group">
                                                        <label>Address3 :<span className='text-danger'>*</span></label>
                                                        <input type="text" className="form-control" placeholder="Enter Address2" value={add3} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const formattedValue = capitalizeEachWord(input);
                                                            setAdd3(formattedValue);
                                                            if (errors.add3) {
                                                                setErrors(prevErrors => ({ ...prevErrors, add3: null }));
                                                            }
                                                        }} />
                                                        {errors.add3 && <div className="error-message text-danger">{errors.add3}</div>}
                                                    </div>
                                                </Col>
                                            </Row>


                                            <div>
                                                <label>Status</label><br />
                                                <label className="radio-inline">
                                                    <input type="radio" name="status" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                                <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Deactive</label>
                                            </div>
                                            <div className="reset-button">
                                                <button className="btn btn-danger m-2" onClick={onHide}>Cancel</button>
                                                <button className="btn btn-success m-2" onClick={DataSubmit}> Save</button>
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
        </div>
    )
}

export default FirmForm