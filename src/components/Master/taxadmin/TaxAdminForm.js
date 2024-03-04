import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import '../../style/Style.css'
import { notification } from 'antd';
import * as Yup from 'yup';
import CategoryMaster from '../categoryMaster/CategoryMaster';
import { FiMoreHorizontal } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from 'uuid';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    heading: Yup.string().required("Heading is required"),
    category: Yup.string().required("Please Select Category "),
    // Add validation schema for other fields,
});
// Form validation Schema end

function CategoryNew(props) {
    const { getCategoryData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <CategoryMaster getCategoryData={getCategoryData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
const TaxAdminForm = ({ getTaxadmindata, rowData, fetchData, onHide }) => {

    const [categoryModal, setICategoryModal] = React.useState(false);
    const [categorydata, setCategoryData] = useState([])
    const [heading, setHeading] = useState("")
    const [category, setCategory] = useState('')
    const [taxadminid, setTaxAdminId] = useState(-1)
    const [isactive, setIsActive] = useState(true)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [cguid, setCguid] = useState("")

    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const UserID = localStorage.getItem('CRMUserId')
    const Username = localStorage.getItem('CRMUsername')
    const CustId = localStorage.getItem('CRMCustId')
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-${uuid}-${CustId}`

    useEffect(() => {
        if (rowData) {
            setHeading(rowData.Heading)
            setCategory(rowData.CategoryId)
            setIsActive(rowData.IsActive)
            setTaxAdminId(rowData.Id)
            setCguid(rowData.Cguid)
        }
    }, [rowData])

    const getCategoryData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setCategoryData(res.data)
            if (!rowData) {
                setCategory(res.data[0].Id)
            }
            // console.log(res.data, "data")
        } catch (error) {
            console.log(error)
        }
    }

    const [ipaddress, setIpAddress] = useState('')
    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            // console.log(res.data.ip, "res-resresres")
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getCategoryData()
        fetchIPAddress()
    }, [])
    const categoryOptions = categorydata.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));
    // console.log(categoryOptions, "categoryOptions")

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                heading,
                category,
            }, { abortEarly: false });
            setLoading(true);
            if (taxadminid >= 0) {
                const res = await axios.post(URL + "/api/Master/Createtaxadmin", {
                    Id: taxadminid,
                    Heading: heading,
                    CategoryId: category,
                    IsActive: isactive,
                    CompanyID: CompanyId,
                    IPAddress: ipaddress,
                    UserName: Username,
                    UserId: UserID,
                    Cguid: cguid,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData();
                    // resetData();
                    onHide();
                    if (getTaxadmindata) {
                        getTaxadmindata()
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
            else {
                const res = await axios.post(URL + "/api/Master/Createtaxadmin", {
                    Heading: heading,
                    CategoryId: category,
                    IsActive: true,
                    CompanyID: CompanyId,
                    IPAddress: ipaddress,
                    UserName: Username,
                    UserId: UserID,
                    Cguid: UUID,
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData();
                    // resetData();
                    onHide();
                    if (getTaxadmindata) {
                        getTaxadmindata()
                    }
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
        if (categoryModal == false) {
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
    }, [taxadminid, heading, category,categoryModal]); 

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
                            <h1>Add Sub-Category</h1>
                            {/* <small>Sub-Category List</small> */}
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
                                        <label>Category :<span className='text-danger'>*</span></label>
                                        <div className='d-flex'>
                                            <Select
                                                className='w-100'
                                                options={categoryOptions}
                                                value={categoryOptions.find((option) => option.value == category)}
                                                isClearable={true}
                                                onChange={(selected) => {
                                                    setCategory(selected ? selected.value : '')
                                                    if (errors.category) {
                                                        setErrors(prevErrors => ({ ...prevErrors, category: '' }));
                                                    }
                                                }}
                                                placeholder="Select Category"
                                                key={category} // Force remount when accountType changes
                                            />
                                            <div className='more-btn-icon'>
                                                <FiMoreHorizontal onClick={() => setICategoryModal(true)} />
                                                <CategoryNew
                                                    show={categoryModal}
                                                    onHide={() => setICategoryModal(false)}
                                                    getCategoryData={getCategoryData}
                                                />
                                            </div>
                                        </div>
                                        {errors.category && <div className="error-message text-danger">{errors.category}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Heading :<span className='text-danger'>*</span></label>
                                        <input type="text" className="form-control " value={heading} placeholder="Enter Heading" onChange={(event) => {
                                            const input = event.target.value;
                                            const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                            setHeading(firstCapital)
                                            if (errors.heading) {
                                                setErrors(prevErrors => ({ ...prevErrors, heading: '' }));
                                            }
                                        }} />
                                        {errors.heading && <div className="error-message text-danger">{errors.heading}</div>}
                                    </div>
                                    <div>
                                        <label>Status</label><br />
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={isactive} onChange={() => { setIsActive(true) }} /> Active
                                        </label>
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={!isactive} onChange={() => { setIsActive(false) }} /> Inactive
                                        </label>
                                    </div>
                                    {/* <div className="form-check">
                                        <label>Status</label><br />
                                        <label className="radio-inline">
                                            <input type="radio" name="status" defaultValue={1} defaultChecked="checked" /> Active</label>
                                        <label className="radio-inline"><input type="radio" name="status" defaultValue={0} /> Inctive</label>
                                    </div> */}
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

export default TaxAdminForm