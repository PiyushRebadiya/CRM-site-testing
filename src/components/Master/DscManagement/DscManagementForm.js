import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { notification } from 'antd';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
    // projectname: Yup.string().required("Please select Module name"),
    remark: Yup.string().required("Remark is required"),
});
const DscManagementForm = ({ rowData, fetchData, onHide }) => {
    const [partydata, setPartyData] = useState([])
    const [selectedparty, setSelectedParty] = useState(161)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false);
    const [ipaddress, setIpAddress] = useState('')

    const today = new Date()
    const formattedDatestart = moment(today).format('yyyy-MM-DD');
    const [startdate, setStartDate] = useState(formattedDatestart)
    const [enddate, setEndDate] = useState("")
    const [type, setType] = useState("DSC")
    const [remark, setRemark] = useState("")
    const [dscid, setDscId] = useState(-1)
    const [errors, setErrors] = useState({});
    const [emplist, setEmpList] = useState([])
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const CusId = localStorage.getItem('CRMCustId')
    const userId = localStorage.getItem('CRMUserId')
    const UserName = localStorage.getItem('CRMUsername')
    const URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        if (rowData) {
            setSelectedParty(rowData.PartyId)
            setName(rowData.Name)
            const fromstartDate = rowData.Startdate
            const formattedDatestart = moment(fromstartDate).format('yyyy-MM-DD');
            setStartDate(formattedDatestart)
            const fromendDate = rowData.Enddate
            const formattedDateend = moment(fromendDate).format('yyyy-MM-DD');
            setEndDate(formattedDateend)
            setType(rowData.Type)
            setRemark(rowData.Remark)
            setDscId(rowData.Id)
        }
    }, [rowData])

    useEffect(() => {
        const inputDate = startdate;
        const calculatedDate = new Date(inputDate);
        // calculatedDate.setDate(calculatedDate.getDate() +1  );
        calculatedDate.setFullYear(calculatedDate.getFullYear() + 1);
        const DateConvert = calculatedDate
        const day = DateConvert.getDate().toString().padStart(2, '0');
        const month = (DateConvert.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
        const year = DateConvert.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        if (!rowData) {
            setEndDate(formattedDate)
        }
    }, [startdate])
    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${CusId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPartyData(res.data)
            // console.log(res.data[0].PartyId,"res.data-----res.data")
            if (!rowData) {
                setSelectedParty(res.data[0].PartyId)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getEmplist = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${CusId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setEmpList(res.data)
        } catch (error) {
            console.log(error)
        }
    }
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
        getPartyData()
        getEmplist()
        fetchIPAddress()
    }, [])

    const Assignby = emplist.find((display) => display.UserName == UserName)
    const partyOption = partydata.map((display) => ({
        value: display.PartyId,
        label: display.PartyName
        // label: (
        //     <div>
        //         <div>{display.PartyName}<span style={{ fontSize: "10px", color: "grey" }}>{display.LegelName && (`(${display.LegelName})`)}</span></div>
        //     </div>
        // ),
    }));

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                remark,
            }, { abortEarly: false });
            setLoading(true);
            if (dscid > 0) {
                const res = await axios.post(URL + "/api/Master/CreateDSC", {
                    Flag: "U",
                    DSC: {
                        Id: dscid,
                        CompanyId: CompanyId,
                        PartyId: selectedparty,
                        // Name: name,
                        Startdate: startdate,
                        Enddate: enddate,
                        Type: type,
                        Remark: remark,
                        AssignBy: Assignby.Id,
                        IsActive: true,
                        UserID: userId,
                        IPAddress: ipaddress,
                        UserName:UserName
                    }

                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
                    onHide()
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateDSC", {
                    Flag: "A",
                    DSC: {
                        CompanyId: CompanyId,
                        PartyId: selectedparty,
                        // Name: name,
                        Startdate: startdate,
                        Enddate: enddate,
                        Type: type,
                        Remark: remark,
                        AssignBy: Assignby.Id,
                        IsActive: true,
                        UserID: userId,
                        EntryTime: new Date(),
                        IPAddress: ipaddress,
                        UserName:UserName
                    }

                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    fetchData()
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

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dscid, remark, selectedparty, enddate,type, startdate]); // Add any other dependencies as needed

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
                            <h1>DSC Management</h1>
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
                                        <label>Party Name :</label>
                                        <Select
                                            options={partyOption}
                                            isClearable={true}
                                            value={partyOption.find((option) => option.value == selectedparty)}
                                            placeholder="Select Party"
                                            onChange={(selectedparty) => { setSelectedParty(selectedparty ? selectedparty.value : '') }}
                                        />
                                    </div>
                                    {/* <div className="form-group">
                                        <label>Name : <span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" value={name} placeholder="Enter Name" onChange={(event) => {
                                            setName(event.target.value)
                                            if (errors.name) {
                                                setErrors(prevErrors => ({ ...prevErrors, name: '' }));
                                            }
                                        }} />
                                        {errors.name && (
                                            <div className="error-message text-danger">{errors.name}</div>
                                        )}
                                    </div> */}
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Issue Date:</label>
                                                <input type="date" className="form-control" value={startdate} onChange={(event) => {
                                                    setStartDate(event.target.value)
                                                }} />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Expiry Date : </label>
                                                <input type="date" className="form-control" value={enddate} onChange={(event) => { setEndDate(event.target.value) }} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">
                                        <label>Type :</label>
                                        <input type="text" className="form-control" placeholder="Enter Type" disabled value={type} onChange={(event) => { setType(event.target.value) }} />
                                    </div>
                                    <div className="form-group">
                                        <label>Remark :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control" placeholder="Enter Remark" value={remark} onChange={(event) => {
                                            setRemark(event.target.value)
                                            if (errors.remark) {
                                                setErrors(prevErrors => ({ ...prevErrors, remark: '' }));
                                            }
                                        }} />
                                        {errors.remark && (
                                            <div className="error-message text-danger">{errors.remark}</div>
                                        )}
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

export default DscManagementForm