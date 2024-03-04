import Select from 'react-select';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import { notification } from 'antd';

const PincodeMaster = ({ onHide, getPincode }) => {
    const URL = process.env.REACT_APP_API_URL
    // const [stateData, setStateData] = useState([])
    // const [selectstate, setSelectState] = useState(null)
    const [selectedcity, setSelectedCity] = useState(null)
    const [citydata, setCityData] = useState([])
    const [pincode, setPincode] = useState('')
    const [errors, setErrors] = useState({});
    const [AreaName, setAreaName] = useState("")

    const validationSchema = Yup.object().shape({
        selectedcity: Yup.string().required("City is required"),
        pincode: Yup.string().required(" Pincode is required"),
        AreaName: Yup.string().required(" AreaName is required"),
        // Add validation schema for other fields,
    });
    // const getStateData = async () => {
    //     try {
    //         const res = await axios.get(URL + '/api/Master/StateList')
    //         setStateData(res.data)
    //         console.log(res.data, "setStateDatasetStateDatasetStateData")
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // const stateOption = stateData.map((display) => ({
    //     value: display.StateID,
    //     label: display.StateName,
    // }));
    useEffect(() => {
        getCityData()
    }, [])

    const getCityData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/CityList')
            setCityData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const cityoption = citydata.map((display) => ({
        value: display.CityID,
        label: display.CityName,
    }));
    const handleSubmit = async () => {
        try {
            await validationSchema.validate({ selectedcity, pincode, AreaName }, { abortEarly: false });

            const res = await axios.post(`${URL}/api/Master/CreatePincode`, {

                Flag: 'A',
                Pincode: {
                    Code: pincode,
                    CityID: selectedcity,
                    AreaName: AreaName
                }
            });
            if (res.data.Success === true) {
                onHide(); // Close the modal or handle as needed
                getPincode()
                notification.success({
                    message: 'Pincode Added Successfully !!!',
                    placement: 'bottomRight', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
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
    };
    return (

        <div className='form-border' >
            {/* Content Header (Page header) */}
            <section className="content-header model-close-btn " style={{ width: "100%" }}>
                <div className='form-heading'>
                    <div className="header-icon">
                        <i className="fa fa-users" />
                    </div>
                    <div className="header-title">
                        <h1>Pincode</h1>
                        {/* <small>Add IFSC</small> */}
                    </div>
                </div>

                <div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

            </section>
            {/* Main content */}
            <div >
                {/* Form controls */}
                <div className="col-sm-12">
                    <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                        <Row>
                            {/* <Col lg={12}>
                                    <div className="form-group">
                                        <label>State :</label>
                                        <Select
                                            className='w-100'
                                            options={stateOption}
                                            value={selectstate ? stateOption.find((option) => option.value === selectstate) : null}
                                            placeholder="Select State"
                                            onChange={(selectedState) => {
                                                setSelectState(selectedState ? selectedState.value : '');
                                                setSelectedCity('');

                                            }}
                                        />
                                        {errors.selectstate && <div className="error-message text-danger">{errors.selectstate}</div>}
                                    </div>
                                </Col> */}
                            <Col lg={12}>
                                <div className="form-group">
                                    <label>City : <span className='text-danger'>*</span></label>
                                    <Select
                                        options={cityoption}
                                        value={selectedcity ? cityoption.find((option) => option.value === selectedcity) : null}
                                        placeholder="Select City"
                                        onChange={(selectedCity) => {
                                            setSelectedCity(selectedCity ? selectedCity.value : '');
                                            if (errors.selectedcity) {
                                                setErrors(prevErrors => ({ ...prevErrors, selectedcity: null }));
                                            }
                                        }}
                                    />
                                    {errors.selectedcity && <div className="error-message text-danger">{errors.selectedcity}</div>}
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="form-group">
                                    <label> Pincode: <span className='text-danger'>*</span></label>
                                    <input className="form-control" placeholder="Enter Pincode" value={pincode} onChange={(event) => {
                                        const input = event.target.value;
                                        const numericInput = input.replace(/\D/g, '');
                                        const limitedInput = numericInput.slice(0, 6);
                                        setPincode(limitedInput);
                                        if (errors.pincode) {
                                            setErrors(prevErrors => ({ ...prevErrors, pincode: '' }));
                                        }
                                    }}
                                    />
                                    {errors.pincode && <div className="error-message text-danger">{errors.pincode}</div>}

                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="form-group">
                                    <label> AreaName: <span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter AreaName"
                                        value={AreaName}
                                        onChange={(event) => {
                                            const input = event.target.value;
                                            const capitalLetters = input.toUpperCase();
                                            setAreaName(capitalLetters)
                                            if (errors.AreaName) {
                                                setErrors(prevErrors => ({ ...prevErrors, AreaName: '' }));
                                            }
                                        }}
                                    />
                                    {errors.AreaName && <div className="error-message text-danger">{errors.AreaName}</div>}

                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="reset-button ">
                                    <button
                                        className="btn btn-success m-2"
                                        onClick={handleSubmit}
                                    //  disabled={loading}
                                    >
                                        Save {/* {loading ? 'Saving...' : 'Save [F9]'} */}
                                    </button>
                                    <button
                                        className="btn btn-danger m-2"
                                        onClick={onHide}
                                    // disabled={loading}
                                    >
                                        Cancel [ESC]
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PincodeMaster