import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { notification } from 'antd';
import { wait } from '@testing-library/user-event/dist/utils';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import { FiMoreHorizontal } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import DepartmentMaster from '../departmentMaster/DepartmentMaster';
import PositionMaster from '../positionMaster/PositionMaster';
import RoleMaster from '../Role/RoleMaster';
import PhoneInput from "react-phone-input-2";
import { v4 as uuidv4 } from 'uuid';
import "react-phone-input-2/lib/bootstrap.css";
// Form validation Schema start
const MobileNoRegex = /^\d{12}$/;
const GmailRegex = /@.*\./;
const validationSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    mobile: Yup.string().required("Mobile Number is required").matches(MobileNoRegex, 'Invalid format!'),
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
    // department: Yup.string().required("Please select Department"),
    // position: Yup.string().required("Please select position"),
    userName: Yup.string().required("User Name is required"),
    password: Yup.string().required("Password is required"),
    // selectrole: Yup.string().required("Please select Role"),
    // Add validation schema for other fields,
});
// Form validation Schema end

function DepartmentNew(props) {
    const { getDepartmentData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <DepartmentMaster getDepartmentData={getDepartmentData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
function PositionNew(props) {
    const { getPositionData, projectdata } = props;

    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <PositionMaster getPositionData={getPositionData} onHide={props.onHide} projectdata={projectdata} />
            {/* </Modal.Body> */}
        </Modal>
    );
}
function RoleNew(props) {
    const { getRoleData } = props;

    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <RoleMaster getRoleData={getRoleData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}

function UserForm({ rowData, fetchData, onHide, username }) {
    const [departmentModal, setDepartmentModal] = useState(false)
    const [positionModal, setPositionModal] = useState(false)
    const [roleModal, setRoleModal] = useState(false)
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState(-1)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState("")
    const [department, setDepartment] = useState(150)
    const [position, setPosition] = useState(195)
    const [departmentdata, setDepartmentdata] = useState([])
    const [positiondata, setPositiondata] = useState([])
    const [userlist, setuserlist] = useState([])
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [rolelist, setRoleList] = useState([])
    const [selectrole, setSelectedRole] = useState("User")
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // const [users, setusers] = useState([])
    const [usernameError, setUsernameError] = useState('');
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const customerId = localStorage.getItem("CRMCustId")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const userRole = localStorage.getItem('CRMRole')
    const CGUID = localStorage.getItem('CRMCGUID')

    const [img, setImg] = useState("")
    const [mobile2, setMobile2] = useState("")
    const [add1, setAdd1] = useState("")
    const [add2, setAdd2] = useState("")
    const [add3, setAdd3] = useState("")
    const [pincodeid, setPincodeId] = useState("")
    const [cityid, setCityId] = useState("")
    const [stateid, setStateId] = useState("")
    const [dob, setDob] = useState("")
    const [doj, setDoj] = useState("")
    const [gender, setGender] = useState("")
    const [pan, setPan] = useState("")
    const [mstatus, setMstatus] = useState("")
    const [ifsc, setIfsc] = useState("")
    const [bankname, setBankName] = useState("")
    const [branchName, setBranchName] = useState("")
    const [acno, setAcNo] = useState("")
    const [acctype, setAccType] = useState("")
    const [salary, setSalary] = useState("")
    const [salaryamt, setSalaryAmt] = useState("")
    const [isactive, setIsActive] = useState(true)
    const [errordisplay, setErrorDisplay] = useState("")
    const [guid, setGuid] = useState("")

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${customerId}`

    useEffect(() => {
        if (rowData) {
            setEmail(rowData.Email)
            setMobile(rowData.Mobile1)
            setUserName(rowData.UserName)
            setPassword(rowData.Password)
            setUserId(rowData.Id)
            setSelectedRole(rowData.Role)
            setFname(rowData.FirstName)
            setLname(rowData.LastName)
            setDepartment(rowData.DepartmentId)
            setPosition(rowData.PositionId)
            setImg(rowData.Img)
            setMobile2(rowData.Mobile2)
            setAdd1(rowData.Add1)
            setAdd2(rowData.Add2)
            setAdd3(rowData.Add3)
            setPincodeId(rowData.PincodeId)
            setCityId(rowData.CityId)
            setStateId(rowData.StateId)
            setDob(rowData.DOB)
            setDoj(rowData.DOJ)
            setGender(rowData.Gender)
            setPan(rowData.PAN)
            setMstatus(rowData.MaritalStatus)
            setIfsc(rowData.IFSC)
            setBankName(rowData.BankName)
            setBranchName(rowData.BranchName)
            setAcNo(rowData.AccNo)
            setAccType(rowData.AccType)
            setSalary(rowData.SalaryType)
            setSalaryAmt(rowData.SalaryAmount)
            setIsActive(rowData.IsActive)
            setGuid(rowData.Cguid)
        }
    }, [rowData])
    useEffect(() => {
        if (username) {
            setuserlist(username)
        }
    }, [username])

    const user = userlist.map((item) => item.Username);
    const getDepartmentData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/DepartmentList?CustId=${customerId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setDepartmentdata(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getPositionData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PositionList?CustId=${customerId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPositiondata(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getRoleData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/RoleList?CustId=${customerId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setRoleList(res.data)
        } catch (error) {
            console.log(error)
        }
    }

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
        getPositionData()
        getDepartmentData()
        getRoleData()
        fetchIPAddress()
    }, [])

    const departmentOptions = departmentdata.map((display) => ({
        value: display.Id,
        label: display.DepartmentName,
    }));
    const positonfilter = positiondata.filter((display) => display.DepartmentId == department)
    const postionoptions = positonfilter.map((display) => ({
        value: display.Id,
        label: display.PositionName,
    }));

    const roleOption = rolelist.map((display) => ({
        value: display.Role,
        label: display.Role
    }));
    useEffect(() => {
        setUsernameError(''); // Clear the username error when the username changes
    }, [userName]);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const DataSubmit = async () => {
        if (user.includes(userName)) {
            setUsernameError('Username already exists. Please choose a different username.');
            return; // Don't proceed with API request
        }
        try {
            await validationSchema.validate({
                fname,
                lname,
                mobile,
                email,
                // position,
                userName,
                password,
                // selectrole
            }, { abortEarly: false });
            setLoading(true);
            const formData = new FormData();
            if (userId > 0) {
                formData.append('Id', userId)
                formData.append('Flag', "U")
            } else {
                formData.append('Flag', "A")
            }
            // formData.append('CompanyId', CompanyId);
            // formData.append('FirstName', fname);
            // formData.append('LastName', lname);
            // formData.append('Mobile1', mobile);
            // formData.append('DepartmentId', department);
            // formData.append('PositionId', position);
            // formData.append('Role', selectrole);
            // formData.append('CustId', customerId);
            // formData.append('UserName', userName);
            // formData.append('Password', password);
            // formData.append('Email', email);
            formData.append('Image', img);
            formData.append('CompanyId', CompanyId);
            formData.append('FirstName', fname);
            formData.append('LastName', lname);
            formData.append('Mobile1', mobile);
            formData.append('Mobile2', mobile2);
            formData.append('Add1', add1);
            formData.append('Add2', add2);
            formData.append('Add3', add3);
            formData.append('DOB', dob);
            formData.append('DOJ', doj);
            formData.append('PincodeId', pincodeid);
            formData.append('CityId', cityid);
            formData.append('StateId', stateid);
            formData.append('Email', email);
            formData.append('Gender', gender);
            formData.append('PAN', pan);
            formData.append('MaritalStatus', mstatus);
            formData.append('DepartmentId', department);
            formData.append('PositionId', position);
            formData.append('Role', selectrole);
            formData.append('IFSC', ifsc);
            formData.append('BankName', bankname);
            formData.append('BranchName', branchName);
            formData.append('AccNo', acno);
            formData.append('AccType', acctype);
            formData.append('SalaryType', salary);
            formData.append('SalaryAmount', salaryamt);
            formData.append('CustId', customerId);
            formData.append('UserName', userName);
            formData.append('Password', password);
            formData.append('IsActive', isactive);
            formData.append('IPAddress', ipaddress);
            formData.append('Cguid', userId>0 ? guid : UUID);

            if (userId >= 0) {
                const res = await axios.post(URL + "/api/Master/UpdateEmp", formData,
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
                const res = await axios.post(URL + '/api/Master/CreateEmp', formData, {
                    headers: { Authorization: `bearer ${token}` },
                });
                // After successfully creating a user, add the new username to the userlist
                // setuserlist([...userlist, userName]);
                // Clear the username error if it was previously set
                // setUsernameError('');
                // console.log(res, "res")
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
            if (error.response) {
                setErrorDisplay(error.response.data.Message)
            }
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
        if (roleModal == false) {
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
    }, [fname, selectrole, userId, lname, email, mobile, userName, password, department, position, isactive, roleModal]);

    return (
        <div>
            <div className="form-border">
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Add User</h1>
                            {/* <small>User List</small> */}
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
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className="col-sm-12">
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>First Name :<span className='text-danger'>*</span></label>
                                                <input type="text" inputMode='text' className="form-control" placeholder="Enter First Name" value={fname} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                                    setFname(firstCapital)
                                                    if (errors.fname) {
                                                        setErrors(prevErrors => ({ ...prevErrors, fname: '' }));
                                                    }
                                                }} />
                                                {errors.fname && <div className="error-message text-danger">{errors.fname}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Last Name :<span className='text-danger'>*</span></label>
                                                <input type="text" inputMode='text' className="form-control" placeholder="Enter Last Name" value={lname} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                                    setLname(firstCapital)
                                                    if (errors.lname) {
                                                        setErrors(prevErrors => ({ ...prevErrors, lname: '' }));
                                                    }
                                                }} />
                                                {errors.lname && <div className="error-message text-danger">{errors.lname}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="form-group">
                                                <label>Email :</label>
                                                <input type="email" inputMode='email' className="form-control" placeholder="Enter Email" value={email}
                                                    onChange={(event) => {
                                                        const input = event.target.value
                                                        const lowerCase = input.toLowerCase();
                                                        const limitInput = lowerCase.slice(0, 50);
                                                        setEmail(limitInput)
                                                        if (errors.email) {
                                                            setErrors(prevErrors => ({ ...prevErrors, email: '' }));
                                                        }
                                                    }}
                                                />
                                                {errors.email && <div className="error-message text-danger">{errors.email}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                {/* <label>Mobile :<span className='text-danger'>*</span></label> */}
                                                <label>Mobile : <span className='text-danger'>*</span></label>
                                                {/* <input type="text" inputMode='tel' className="form-control" placeholder="Enter Mobile" value={mobile} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const numericInput = input.replace(/\D/g, '');
                                                    const limitedInput = numericInput.slice(0, 10);
                                                    setMobile(limitedInput);
                                                    if (errors.mobile) {
                                                        setErrors(prevErrors => ({ ...prevErrors, mobile: '' }));
                                                    }
                                                }}
                                                /> */}
                                                <PhoneInput
                                                    country={"in"}
                                                    enableSearch={true}
                                                    value={mobile}
                                                    onChange={(value) => {
                                                        setMobile(value);
                                                        if (errors.mobile) {
                                                            setErrors((prevErrors) => ({ ...prevErrors, mobile: null }));
                                                        }
                                                    }}
                                                />
                                                {errors.mobile && <div className="error-message text-danger">{errors.mobile}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                {/* <label>Department :<span className='text-danger'>*</span></label> */}
                                                <label>Department :</label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={departmentOptions}
                                                        isClearable={true}
                                                        value={departmentOptions.find((option) => option.value == department)}
                                                        onChange={(selected) => {
                                                            setDepartment(selected ? selected.value : '')
                                                            // if (errors.department) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, department: '' }));
                                                            // }
                                                        }}
                                                        placeholder="Enter Departent"
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setDepartmentModal(true)} />
                                                        <DepartmentNew
                                                            show={departmentModal}
                                                            onHide={() => setDepartmentModal(false)}
                                                            getDepartmentData={getDepartmentData}


                                                        />
                                                    </div>
                                                </div>
                                                {/* {errors.department && <div className="error-message text-danger">{errors.department}</div>} */}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col lg={12}>
                                            <div className="form-group">
                                                {/* <label>Position :<span className='text-danger'>*</span></label> */}
                                                <label>Designation :</label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        // isDisabled={department ? false : true}
                                                        options={postionoptions}
                                                        isClearable={true}
                                                        value={postionoptions.find((option) => option.value == position)}
                                                        onChange={(selected) => {
                                                            setPosition(selected ? selected.value : '')
                                                            // if (errors.position) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, position: '' }));
                                                            // }
                                                        }}
                                                        placeholder="Enter Position"
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setPositionModal(true)} />
                                                        <PositionNew
                                                            show={positionModal}
                                                            onHide={() => setPositionModal(false)}
                                                            getPositionData={getPositionData}
                                                            projectdata={departmentdata}
                                                        />
                                                    </div>
                                                </div>
                                                {/* {errors.position && <div className="error-message text-danger">{errors.position}</div>} */}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Username :<span className='text-danger'>*</span></label>
                                                <input type="text" className="form-control" placeholder="Enter Username" value={userName} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                                                    const limitedInput = firstCapital.slice(0, 10);
                                                    setUserName(limitedInput)
                                                    setErrorDisplay("")
                                                    if (errors.userName) {
                                                        setErrors(prevErrors => ({ ...prevErrors, userName: '' }));
                                                    }
                                                }} />
                                                {errors.userName && <div className="error-message text-danger">{errors.userName}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Password :<span className='text-danger'>*</span></label>
                                                <div className='password-main-show-hide'>
                                                    <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter Password" value={password} onChange={(event) => {
                                                        const input = event.target.value;
                                                        const limitedInput = input.slice(0, 10);
                                                        // const firstCapital = limitedInput.charAt(0).toUpperCase() + input.slice(1);
                                                        setPassword(limitedInput)
                                                        if (errors.password) {
                                                            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
                                                        }
                                                    }} />
                                                    <button
                                                        className="psw-show-icon"
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                    </button>
                                                </div>
                                                {errors.password && <div className="error-message text-danger">{errors.password}</div>}
                                            </div>
                                        </Col>
                                    </Row>

                                    {rowData && rowData.Role == "Admin" ? (null) : (
                                        <>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="form-group">
                                                        <label>Role :</label>
                                                        <div className='d-flex'>
                                                            <Select
                                                                className='w-100'
                                                                options={roleOption}
                                                                value={roleOption.find((option) => option.value == selectrole)}
                                                                onChange={(selected) => {
                                                                    setSelectedRole(selected.value)
                                                                    // if (errors.selectrole) {
                                                                    //     setErrors(prevErrors => ({ ...prevErrors, selectrole: '' }));
                                                                    // }
                                                                }}
                                                                placeholder="Enter Role"
                                                            />
                                                            <div className='more-btn-icon'>
                                                                <FiMoreHorizontal onClick={() => setRoleModal(true)} />
                                                                <RoleNew
                                                                    show={roleModal}
                                                                    onHide={() => setRoleModal(false)}
                                                                    getRoleData={getRoleData}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* {errors.selectrole && <div className="error-message text-danger">{errors.selectrole}</div>} */}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="form-group">
                                                        <div>
                                                            <label>Status :</label><br />
                                                            <label className="radio-inline">
                                                                <input
                                                                    type="radio"
                                                                    name="statusdepartment"
                                                                    checked={isactive === true}
                                                                    onChange={() => { setIsActive(true) }}
                                                                /> Active
                                                            </label>
                                                            <label className="radio-inline">
                                                                <input
                                                                    type="radio"
                                                                    name="statusdepartment"
                                                                    checked={isactive === false}
                                                                    onChange={() => { setIsActive(false) }}
                                                                /> Inactive
                                                            </label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                    }

                                    {
                                        errordisplay ? (
                                            <span className='text-danger'>{errordisplay}</span>
                                        ) : null
                                    }
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
            </div>
        </div >
    )
}

export default UserForm