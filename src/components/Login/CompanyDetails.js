import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import axios from 'axios';

function CompanyDetails({ formData, setFormData, errors }) {
    const [companyType, setCompanyType] = useState("");
    const [selectstate, setSelectState] = useState("")
    const [stateData, setStateData] = useState([])
    const [citydata, setCityData] = useState([])
    const [cityconvert, setCityConvert] = useState([])
    const [selectedcity, setSelectedCity] = useState("")
    const [pincodeData, setPincodeData] = useState([])
    const [pincodeconvert, setPincodeConvert] = useState([])
    const URL = process.env.REACT_APP_API_URL;


    const companyTypeOptions = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Firm', label: 'Firm' },
        { value: 'Pvt Ltd', label: 'Pvt Ltd' },
        { value: 'LLP', label: 'LLP' },
        { value: 'Others', label: 'Others' },
    ];


    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'companyType') {
            // Update regType directly in formData
            setFormData((prevData) => ({
                ...prevData,
                companyType: value
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    }
    useEffect(() => {
        // Set regType whenever it changes
        setFormData((prevData) => ({
            ...prevData,
            companyType: companyType
        }));
    }, [companyType, setFormData]);

    const getPincode = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/PincodeList', {
            })
            setPincodeData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getSatateData = async () => {
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
        getSatateData()
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
    return (

        <div className='form-border company-detail-reg'>
            <div className="">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                            <div>

                                <Row>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Firm Name :</label>
                                            <input
                                                type="text"
                                                placeholder='Enter Firm Name'
                                                className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                name='companyName'
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                            />
                                            {/* {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={6} >
                                        <div className="form-group">
                                            <label>Type of status :</label>
                                            <Select
                                                options={companyTypeOptions}
                                                name='companyType'
                                                className={`${errors.companyEmail ? 'is-invalid' : ''}`}
                                                value={companyTypeOptions.find((option) => option.value === companyType)}
                                                placeholder="Select Company"
                                                onChange={(selectedOption) => {
                                                    setCompanyType(selectedOption.value); // Update regType in the component state
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        companyType: selectedOption.value  // Update regType in the form data
                                                    }));
                                                }}
                                            />
                                              {/* {errors.companyType && <div className="invalid-feedback">{errors.companyType}</div>} */}
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>Firm Email :</label>
                                            <input type='email'
                                                className={`form-control ${errors.companyEmail ? 'is-invalid' : ''}`}
                                                name='companyEmail'
                                                value={formData.companyEmail}
                                                onChange={handleInputChange} />
                                            {errors.companyEmail && <div className="invalid-feedback">{errors.companyEmail}</div>}
                                        </div>
                                    </Col>
                                </Row> */}
                                <Row>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Mobile 1:</label>
                                            <input type='text'
                                                className={`form-control ${errors.mobile1 ? 'is-invalid' : ''}`}
                                                name='mobile1'
                                                placeholder='Enter Mobile No.'
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  // Allow only numeric input
                                                value={formData.mobile1}
                                                onChange={handleInputChange}
                                                maxLength={10} />
                                            {/* {errors.mobile1 && <div className="invalid-feedback">{errors.mobile1}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Phone 1:</label>
                                            <input type='text'
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                className={`form-control ${errors.phone1 ? 'is-invalid' : ''}`}
                                                name='phone1'
                                                placeholder='Enter Phone No.'
                                                value={formData.phone1}
                                                onChange={handleInputChange}
                                                maxLength={11}
                                            />
                                            {/* {errors.phone1 && <div className="invalid-feedback">{errors.phone1}</div>} */}
                                        </div>
                                    </Col>
                                </Row>
                              
                                <Row>
                                    {/* <Col>
                                        <div className="form-group">
                                            <label>Address 3:</label>
                                            <input type='text'
                                                className={`form-control ${errors.address3 ? 'is-invalid' : ''}`}
                                                name='address3'
                                                placeholder='Enter Address'
                                                value={formData.address3}
                                                onChange={handleInputChange} />
                                            {errors.address3 && <div className="invalid-feedback">{errors.address3}</div>}
                                        </div>
                                    </Col> */}
                                    <Col>
                                        <div className="form-group">
                                            <label>Firm Email :</label>
                                            <input type='email'
                                                className={`form-control ${errors.companyEmail ? 'is-invalid' : ''}`}
                                                name='companyEmail'
                                                placeholder='Enter Email'
                                                value={formData.companyEmail}
                                                onChange={handleInputChange} />
                                            {/* {errors.companyEmail && <div className="invalid-feedback">{errors.companyEmail}</div>} */}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={4}>
                                        <div className="form-group">
                                            <label>State :</label>
                                            {/* <input
                                                type="text"
                                                className="form-control"
                                                name='state'
                                                value={formData.state}
                                                onChange={handleInputChange}
                                            /> */}
                                            <Select
                                                options={stateOption}
                                                name='state'
                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                placeholder="Select State"
                                                // className={'form-group' `${errors.state ? 'is-invalid' : ''}`}
                                                onChange={(selectedState) => {
                                                    setSelectState(selectedState.value); // Update regType in the component state
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        state: selectedState.value  // Update regType in the form data
                                                    }));
                                                }}
                                                maxMenuHeight={200}
                                            />
                                              {/* {errors.state && <div className="invalid-feedback">{errors.state}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className="form-group">
                                            <label>City :</label>
                                            {/* <input
                                                type="text"
                                                className="form-control"
                                                name='city'
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            /> */}
                                            <Select
                                                options={cityoption}
                                                name='city'
                                                className={`${errors.city ? 'is-invalid' : ''}`}
                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                placeholder="Select City"
                                                onChange={(selectedCity) => {
                                                    setSelectedCity(selectedCity.value)
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        city: selectedCity.value
                                                    }));
                                                }}
                                                maxMenuHeight={200}
                                            />
                                              {/* {errors.city && <div className="invalid-feedback">{errors.city}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className="form-group">
                                            <label>Pincode :</label>
                                            {/* <input
                                                type="text"
                                                className="form-control"
                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  // Allow only numeric input
                                                name='pincode'
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                maxLength={6}
                                            /> */}
                                            <Select
                                                options={pincodeOptions}
                                                name='pincode'
                                                className={`${errors.pincode ? 'is-invalid' : ''}`}
                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                placeholder="Select Pincode"
                                                onChange={(selectedPincode) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        pincode: selectedPincode.value
                                                    }));
                                                }}
                                                maxMenuHeight={200}
                                            />
                                                {/* {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>} */}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Pan Number :</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.PAN ? 'is-invalid' : ''}`}
                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                name='PAN'
                                                placeholder='Enter Pan'
                                                value={formData.PAN}
                                                onChange={handleInputChange}
                                                maxLength={10}
                                            />
                                            {/* {errors.PAN && <div className="invalid-feedback">{errors.PAN}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>GST Number :</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.GSTRegNumber ? 'is-invalid' : ''}`}
                                                name='GSTRegNumber'
                                                placeholder='Enter GST No.'
                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                value={formData.GSTRegNumber}
                                                onChange={handleInputChange}
                                                maxLength={15}
                                            />
                                            {/* {errors.GSTRegNumber && <div className="invalid-feedback">{errors.GSTRegNumber}</div>} */}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Address :</label>
                                            <input type='text'
                                                className={`form-control ${errors.address1 ? 'is-invalid' : ''}`}
                                                name='address1'
                                                placeholder='Enter Address'
                                                value={formData.address}
                                                onChange={handleInputChange} />
                                            {/* {errors.address1 && <div className="invalid-feedback">{errors.address1}</div>} */}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="form-group">
                                            <label>Address 2:</label>
                                            <input type='text'
                                                className={`form-control ${errors.address2 ? 'is-invalid' : ''}`}
                                                name='address2'
                                                placeholder='Enter Address'
                                                value={formData.address2}
                                                onChange={handleInputChange} />
                                            {/* {errors.address2 && <div className="invalid-feedback">{errors.address2}</div>} */}
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetails;
