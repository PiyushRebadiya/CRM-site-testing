import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { ConnectedOverlayScrollHandler } from 'primereact/utils';


const RegFirmInsert = () => {
    const [companyType, setCompanyType] = useState("");
    const [selectstate, setSelectState] = useState("")
    const [stateData, setStateData] = useState([])
    const [citydata, setCityData] = useState([])
    const [cityconvert, setCityConvert] = useState([])
    const [selectedcity, setSelectedCity] = useState("")
    const [pincodeData, setPincodeData] = useState([])
    const [pincodeconvert, setPincodeConvert] = useState([])
    const [firmname, setFirmName] = useState("")
    const [mobile1, setMobile1] = useState("")
    const [mobile2, setMobile2] = useState("")
    const [phone1, setPhone1] = useState("")
    const [phone2, setPhone2] = useState("")
    const [firmemail, setFirmEmail] = useState("")
    const [pincode, setPincode] = useState("")
    const [pan, setPan] = useState("")
    const [gst, setGst] = useState("")
    const [add1, setAdd1] = useState("")
    const [add2, setAdd2] = useState("")
    const [add3, setAdd3] = useState("")

    const [data, setData] = useState([])

    const [matchingUserId, setMatchingUserId] = useState(null);
    const custid = localStorage.getItem("CRMCustId")
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const URL = process.env.REACT_APP_API_URL;
    const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${custid}`;


    const companyTypeOptions = [
        { value: 'Individual', label: 'Individual' },
        { value: 'Firm', label: 'Firm' },
        { value: 'Pvt Ltd', label: 'Pvt Ltd' },
        { value: 'LLP', label: 'LLP' },
        { value: 'Others', label: 'Others' },
    ];


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
        fetchData();
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


    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/UsermstList`, {
            });

            setData(res.data);
            const matchingUser = res.data.find(user => user.CustId === custid);
            if (matchingUser) {
                setMatchingUserId(matchingUser.Id);                
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // console.log(matchingUserId,"matching")
    const DataSubmit = async () => {
        const res = await axios.post(URL + '/api/Master/CreateFirm',
            {
                UserId: matchingUserId,
                FirmName: firmname,
                FirmType: companyType,
                Email: firmemail,
                Mobile1: mobile1,
                Mobile2: mobile2,
                Phone1: phone1,
                Phone2: phone2,
                Add1: add1,
                Add2: add2,
                Add3: add3,
                CustId: custid,
                PAN: pan,
                GST: gst,
                IsActive: true,
                Phone1: phone1,
                Phone2: phone2,
                Mobile1: mobile1,
                Mobile2: mobile2,
                Guid: UUID,
                PincodeId: pincode,
                CityId: selectedcity,
                StateId: selectstate,
            },
        )
    }
    return (
        <div>
            <div className='firm-create-new-reg-main'>
                <div className='firm-insert-main'>
                    <Container>
                        <div className='form-border firm-new-input-section company-detail-reg mt-5'>
                            <div  className='reg-heading'>

                            <h4>Create Firm</h4>
                            </div>
<hr></hr>
                            <div className="mt-4">
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
                                                                className='form-control'
                                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                                name='companyName'
                                                                // value={formData.companyName}
                                                                onChange={(event) => { setFirmName(event.target.value) }}
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
                                                                // className={`${errors.companyEmail ? 'is-invalid' : ''}`}
                                                                value={companyTypeOptions.find((option) => option.value === companyType)}
                                                                placeholder="Select Company"
                                                                onChange={(selectedOption) => {
                                                                    setCompanyType(selectedOption.value); // Update regType in the component state                                                     
                                                                }}
                                                            />
                                                            {/* {errors.companyType && <div className="invalid-feedback">{errors.companyType}</div>} */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <label>Firm Email :</label>
                                                            <input type='email'
                                                                className='form-control'
                                                                placeholder='Enter Email'
                                                                onChange={(event) => { setFirmEmail(event.target.value) }} />
                                                            {/* {errors.companyEmail && <div className="invalid-feedback">{errors.companyEmail}</div>} */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Mobile 1:</label>
                                                            <input type='text'
                                                                className='form-control'
                                                                name='mobile1'
                                                                placeholder='Enter Mobile No.'
                                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  // Allow only numeric input
                                                                onChange={(event) => { setMobile1(event.target.value) }}
                                                                maxLength={10} />
                                                            {/* {errors.mobile1 && <div className="invalid-feedback">{errors.mobile1}</div>} */}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Phone 1:</label>
                                                            <input type='text'
                                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                                className='form-control'
                                                                name='phone1'
                                                                placeholder='Enter Phone No.'
                                                                // value={formData.phone1}
                                                                onChange={(event) => { setPhone1(event.target.value) }}
                                                                maxLength={11}
                                                            />
                                                            {/* {errors.phone1 && <div className="invalid-feedback">{errors.phone1}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Mobile 2:</label>
                                                            <input type='text'
                                                                className='form-control'
                                                                name='mobile1'
                                                                placeholder='Enter Mobile No.'
                                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}  // Allow only numeric input
                                                                onChange={(event) => { setMobile2(event.target.value) }}
                                                                maxLength={10} />
                                                            {/* {errors.mobile1 && <div className="invalid-feedback">{errors.mobile1}</div>} */}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Phone 2:</label>
                                                            <input type='text'
                                                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                                className='form-control'
                                                                name='phone1'
                                                                placeholder='Enter Phone No.'
                                                                onChange={(event) => { setPhone2(event.target.value) }}
                                                                maxLength={11}
                                                            />
                                                            {/* {errors.phone1 && <div className="invalid-feedback">{errors.phone1}</div>} */}
                                                        </div>
                                                    </Col>
                                                  
                                                </Row>
                                                <Row>
                                                    <Col lg={4}>
                                                        <div className="form-group">
                                                            <label>State :</label>
                                                            <Select
                                                                options={stateOption}
                                                                name='state'
                                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                                placeholder="Select State"
                                                                onChange={(selectedState) => {
                                                                    setSelectState(selectedState.value); // Update regType in the component state                                                       
                                                                }}
                                                                maxMenuHeight={200}
                                                            />
                                                            {/* {errors.state && <div className="invalid-feedback">{errors.state}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="form-group">
                                                            <label>City :</label>
                                                            <Select
                                                                options={cityoption}
                                                                name='city'
                                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                                placeholder="Select City"
                                                                onChange={(selectedCity) => {
                                                                    setSelectedCity(selectedCity.value)
                                                                }}
                                                                maxMenuHeight={200}
                                                            />
                                                            {/* {errors.city && <div className="invalid-feedback">{errors.city}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className="form-group">
                                                            <label>Pincode :</label>
                                                            <Select
                                                                options={pincodeOptions}
                                                                name='pincode'
                                                                // className='form-control'
                                                                // value={pincodeOptions.find((option) => option.value === pincode)}
                                                                placeholder="Select Pincode"
                                                                onChange={(selectedPincode) => {
                                                                    setPincode(selectedPincode.value)
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
                                                                className='form-control'
                                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                                name='PAN'
                                                                placeholder='Enter Pan'
                                                                onChange={(event) => { setPan(event.target.value) }}
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
                                                                className='form-control'
                                                                name='GSTRegNumber'
                                                                placeholder='Enter GST No.'
                                                                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                                                onChange={(event) => { setGst(event.target.value) }}
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
                                                                className='form-control'
                                                                onChange={(event) => { setAdd1(event.target.value) }}
                                                                placeholder='Enter Address' />
                                                            {/* {errors.address1 && <div className="invalid-feedback">{errors.address1}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Address 2:</label>
                                                            <input type='text'
                                                                className='form-control'
                                                                placeholder='Enter Address'
                                                                onChange={(event) => { setAdd2(event.target.value) }}
                                                            />
                                                            {/* {errors.address2 && <div className="invalid-feedback">{errors.address2}</div>} */}
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="form-group">
                                                            <label>Address 3:</label>
                                                            <input type='text'
                                                                className='form-control'
                                                                placeholder='Enter Address' />
                                                            {/* {errors.address2 && <div className="invalid-feedback">{errors.address2}</div>} */}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr className='mt-4'></hr>
                                                <div className='regester-main mb-3'>
                                                    <div className='pre-sub-btn'>
                                                        <button className="submit-btn-reg" onClick={DataSubmit}>Save</button>
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
            </div>
        </div>
    )
}

export default RegFirmInsert