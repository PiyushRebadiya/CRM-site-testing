import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import { notification } from 'antd';
import moment from 'moment';
import PartyMaster from '../PartyMaster/PartyMaster';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useLocation } from 'react-router-dom'
import { Drawer } from 'antd';
import * as Yup from 'yup';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const validationSchema = Yup.object().shape({
    reminderName: Yup.string().required("Please enter Reminder Name"),

    // Add validation schema for other fields,
});
function PartyNew(props) {
    const { getPartyData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <PartyMaster getPartyData={getPartyData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
// function PartyNew(props) {
//     const { getPartyData, onClose } = props;
//     return (
//         <Drawer
//         {...props}
//         title="Add IFSC"
//         placement="right"
//         onClose={onClose}
//         visible={props.visible}
//         width="67vw"
//         >
//             {/* <Modal.Body> */}
//             <PartyMaster getPartyData={getPartyData} onHide={props.onHide} />
//             {/* </Modal.Body> */}
//         </Drawer>
//     );
// }

function ReminderForm({ onHide, fetchData, rowData, fetchCalender }) {
    const location = useLocation()
    const [partyList, setPartyList] = React.useState(false);
    const [reminderName, setReminderName] = useState("")
    const today = new Date()
    const formattedRemindDate = moment(today).format('YYYY-MM-DD HH:mm');
    const [reminderDate, setReminderDate] = useState(formattedRemindDate)
    const [partydata, setpartydata] = useState([])
    const [partyName, setpartyName] = useState("")
    const [reminderdata, setReminderdata] = useState([])
    const [remindertype, setReminderType] = useState("")
    const [errors, setErrors] = useState({});
    const [id, setId] = useState(-1)
    const [loading, setLoading] = useState(false);
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const userid = localStorage.getItem('CRMUserId')
    const companyid = localStorage.getItem('CRMCompanyId')
    const custId = localStorage.getItem("CRMCustId")
    const username = localStorage.getItem("CRMUsername")
    const [comapnyIDU, setCompanyIDU] = useState(companyid)
    const [status, setStatus] = useState('true')
    const [ipaddress, setIpAddress] = useState('')


    const [selectedDateTime, setSelectedDateTime] = useState('');

    const handleDateTimeChange = (event) => {
        setReminderDate(event.target.value);
    };

    // const handleDateChange = (date, dateString) => {
    //     setReminderDate(dateString);  // dateString contains the formatted date and time
    //     console.log(dateString, 'date');
    // };

    useEffect(() => {
        if (rowData) {
            setReminderName(rowData.ReminderName)
            const remindDate = rowData.ReminderDate
            const formattedRemindDate = moment(remindDate).format('YYYY-MM-DD HH:mm:00');
            // console.log(formattedRemindDate, 'formated')
            setReminderDate(formattedRemindDate)
            setpartyName(rowData.PartyId)
            setReminderType(rowData.ReminderType)
            setCompanyIDU(rowData.CompanyID)
            setId(rowData.ReminderId)
            setStatus(rowData.IsActive.toString())
        }
    }, [rowData])
    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            // console.log(res.data.ip, "res-resresres")
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        fetchIPAddress()
    },[])
    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${custId}&CompanyId=${companyid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setpartydata(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const partyOptions = partydata.map((display) => ({
        value: display.PartyId,
        label:display.PartyName
    }));
    const statusoption = [
        { label: 'Pending', value: "true" },
        { label: 'Complete', value: "false"},
    ];

    const getmstData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/mst_Master`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setReminderdata(res.data)
            // console.log(res.data, 'remindertype')
        } catch (error) {
            console.log(error)
        }
    }
    const reminderfilterdata = reminderdata.filter((item) => item.Remark == "ReminderType")
    const reminderOptions = reminderfilterdata.map((display) => ({
        value: display.Description,
        label: display.Description,
    }));
    useEffect(() => {
        getPartyData()
        getmstData()
    }, [])
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                reminderName,
            }, { abortEarly: false });
            setLoading(true);
            if (id >= 0) {
                const res = await axios.post(URL + "/api/Master/CreateReminder", {
                    Flag: "U",
                    Reminder: {
                        ReminderId: id,
                        ReminderName: reminderName,
                        PartyId: partyName,
                        CompanyID: comapnyIDU,
                        ReminderDate: reminderDate,
                        ReminderType: remindertype,
                        IsActive: status,
                        IsExtend: false,
                        AutoClose: false,
                        IPAddress: null,
                        UserID: userid,
                        UserName: null,
                        ServerName: null,
                        EntryTime: new Date(),
                        IPAddress:ipaddress,
                        UserName:username
                        //   ReferenceId:1
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
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
                const res = await axios.post(URL + "/api/Master/CreateReminder", {
                    Flag: "A",
                    Reminder: {
                        ReminderName: reminderName,
                        PartyId: partyName,
                        CompanyID: comapnyIDU,
                        ReminderDate: reminderDate,
                        ReminderType: remindertype,
                        IsExtend: false,
                        IsActive: status,
                        AutoClose: true,
                        IPAddress: null,
                        UserID: userid,
                        UserName: null,
                        ServerName: null,
                        EntryTime: new Date(),
                        IPAddress:ipaddress,
                        UserName:username
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                if (res.data.Success == true) {
                    fetchData("Reminder Date")
                    onHide()
                    if (fetchCalender) {
                        fetchCalender()
                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            console.log(error, "error")
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
        if (partyList == false) {
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
        }
    }, [partyList, id, reminderName, partyName, status, reminderDate, remindertype]); // Add any other dependencies as needed


    return (
        <div>
            <div className='form-border'>
                {/* Content Header (Page header) */}
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            {/* <i className="fa fa-users" /> */}
                            <i class="fa fa-bell-o"></i>
                        </div>
                        <div className="header-title">
                            <h1>Reminders</h1>
                            {/* <small>Add Reminder</small> */}
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
                {/* Main content */}
                {/* Form controls */}
                <div className="col-sm-12">
                    <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                        <Row>
                            <Col lg={12}>
                                <div className="form-group">
                                    <label>Party Name :</label>
                                    <div className='d-flex'>
                                        <Select
                                            className='w-100'
                                            options={partyOptions}
                                            isClearable={true}
                                            value={partyOptions.find((option) => option.value == partyName)}
                                            onChange={(selected) => {
                                                setpartyName(selected ? selected.value : "")
                                            }}
                                            placeholder="Select Party"
                                        />
                                        <div className='more-btn-icon'>
                                            <FiMoreHorizontal onClick={() => setPartyList(true)} />
                                            <PartyNew
                                                show={partyList}
                                                onHide={() => setPartyList(false)}
                                                getPartyData={getPartyData}
                                            />
                                            {/* <PartyNew
                                                visible={partyList}
                                                onHide={() => setPartyList(false)}
                                                getPartyData={getPartyData}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className="form-group">
                                    <label>Reminder Name :<span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control"
                                        value={reminderName}
                                        placeholder="Enter Reminder Name"
                                        onChange={(event) => {
                                            // const inputValue = event.target.value;
                                            // const capitalizedValue =
                                            //     inputValue.toUpperCase();

                                            setReminderName(event.target.value);
                                            if (errors.reminderName) {
                                                setErrors(prevErrors => ({ ...prevErrors, reminderName: '' }));
                                            }
                                        }}
                                    />
                                    {errors.reminderName && <div className="error-message text-danger">{errors.reminderName}</div>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <div className="form-group">
                                    <label>Reminder Date :</label>
                                    {/* <DatePicker
                                        showTime
                                        placeholder="Select Date"
                                        onChange={handleDateChange}
                                        style={{ width: '100%', padding: "7px 13px" }}
                                        // value={reminderDate}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                    /> */}
                                    <input
                                        className="form-control"
                                        type="datetime-local"
                                        id="datetime"
                                        name="datetime"
                                    value={reminderDate}
                                    onChange={handleDateTimeChange}
                                    />
                                </div>
                            </Col>
                            {/* <Col lg={12}>
                                <div className="form-group">
                                    <label>Remark1: </label>
                                    <textarea className="form-control" rows="3"
                                        placeholder="Enter Remark1" value={remark1}
                                        onChange={(event) => { setRemark1(event.target.value) }}

                                    />
                                    <div className="form-group mt-2">
                                        <label>Remark2:</label>
                                        <textarea className="form-control" rows="3"
                                            placeholder="Enter Remark2" value={remark2}
                                            onChange={(event) => { setRemark2(event.target.value) }}
                                        />
                                    </div>
                                </div>
                            </Col> */}
                            <Col lg={6}>
                                {/* {
                                    location.pathname == '/reminder' ? (
                                        <div className="form-group">
                                            <label>Reminder Type: </label>
                                            <Select
                                                className='w-100'
                                                options={reminderOptions}
                                                value={reminderOptions.find((option) => option.value == remindertype)}
                                                onChange={(selected) => {
                                                    setReminderType(selected.value)
                                                }}
                                                placeholder="Select Reminder Type"
                                            />
                                        </div>
                                    ) : null
                                } */}
                                <div className="form-group">
                                    <label>Reminder Type: </label>
                                    <Select
                                        className='w-100'
                                        options={reminderOptions}
                                        isClearable={true}
                                        value={reminderOptions.find((option) => option.value == remindertype)}
                                        onChange={(selected) => {
                                            setReminderType(selected ? selected.value : "")
                                        }}
                                        placeholder="Select Reminder Type"
                                    />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="form-group">
                                    <label>Status:</label>
                                    <Select
                                        className='w-100'
                                        // isClearable={true}
                                        options={statusoption}
                                        // value={statusoption.find((option) => option.value == status)}
                                        value={status ? statusoption.find((option) => option.value === status) : null}
                                        onChange={(selected) => {
                                            setStatus(selected ? selected.value : '')
                                        }}
                                        placeholder="Enter Status"
                                    />
                                </div>
                            </Col>
                        </Row>
                        {/* <Col lg={6}>
                                <div className="form-group">
                                    <label>Reminder Date :</label>
                                    <input type="date" className="form-control"
                                        value={reminderDate}
                                        placeholder="Enter Date"
                                        onChange={(event) => {
                                            setReminderDate(event.target.value)
                                        }}
                                    />
                                </div>
                            </Col> */}


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
            {/* /.content */}
        </div >
    )
}

export default ReminderForm