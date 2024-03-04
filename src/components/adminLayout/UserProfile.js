import React, { useEffect, useState } from 'react'
import './userprofile.css'
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Select from 'react-select';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import { FaCamera, FaPlus } from 'react-icons/fa';
import UserDefault from '../Master/employeeMaster/userprofile.png'
import { BiSolidShow } from 'react-icons/bi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import * as Yup from 'yup';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

// const MobileNoRegex = /^([0-9]){10}$/;

const validationSchema = Yup.object().shape({
  // Empmobile1: Yup.string()
  //   .nullable() // Allow null or empty value
  //   .test({
  //     name: 'mobile1Format',
  //     test: function (value) {
  //       // Access other field values using this.parent
  //       const isMobile1NotEmpty = value && value.trim().length > 0;

  //       // Apply validation only if PAN is not empty
  //       if (isMobile1NotEmpty) {
  //         return MobileNoRegex.test(value);
  //       }

  //       // If PAN is empty, consider it as valid
  //       return true;
  //     },
  //     message: 'Invalid Number!',
  //   }),
  // Empmobile1: Yup.string().required("Mobile No is required"),
  // Empmobile2: Yup.string()
  //   .nullable() // Allow null or empty value
  //   .test({
  //     name: 'mobile2Format',
  //     test: function (value) {
  //       // Access other field values using this.parent
  //       const isMobile2NotEmpty = value && value.trim().length > 0;

  //       // Apply validation only if PAN is not empty
  //       if (isMobile2NotEmpty) {
  //         return MobileNoRegex.test(value);
  //       }

  //       // If PAN is empty, consider it as valid
  //       return true;
  //     },
  //     message: 'Invalid Number!',
  //   }),
  // add1: Yup.string().required("Address is required"),
  // add2: Yup.string().required("Address is required"),
  // add3: Yup.string().required("Address is required"),
  // Add validation schema for other fields,
  // IFSC: Yup.string().required("Please select IFSC Code"),
  // accountNo: Yup.string().required("Please select Account Number"),
  // accountType: Yup.string().required("Please select Account Type"),
});
const UserProfile = () => {
  const [userdata, setUserData] = useState([])
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const userName = localStorage.getItem("CRMUsername")
  const token = localStorage.getItem("CRMtoken")
  const CustId = localStorage.getItem("CRMCustId")
  const [edit, setEdit] = useState(false)
  const [profileData, setProfileData] = useState(false);
  const [number, setNumber] = useState("")
  const [number2, setNumber2] = useState("")
  // const [name, setName] = useState("")
  const [id, setId] = useState(null)
  const [email, setEmail] = useState(null)
  const URL = process.env.REACT_APP_API_URL
  const history = useHistory()
  const Role = localStorage.getItem('CRMRole')
  const [regid, setRegId] = useState("")
  const [packageid, setPackageId] = useState("")
  const [crm, setCrm] = useState("")
  const [officeman, setofficeman] = useState("")
  const [hrm, setHrm] = useState("")
  const [custid, setCustId] = useState("")
  const [role, setRole] = useState("")
  const [isactive, setIsActive] = useState(true)
  const [fname, setFname] = useState("")
  const [lname, setlname] = useState("")
  const [licDate, setLicDate] = useState("")
  // Employee
  const [employeename, setEmployeename] = useState("")
  const [emppassword, setEmpPassword] = useState("")
  const [Empfirstname, setEmpFirstname] = useState("")
  const [Emplastname, setEmpLastname] = useState("")
  const [Empmobile1, setEmpMobile1] = useState(null)
  const [Empmobile2, setEmpMobile2] = useState(null)
  const [EmpEmail, setEmpEmail] = useState("")
  const [Empdob, setEmpDob] = useState("")
  const [Empdoj, setEmpDoj] = useState("")
  const [gender, setGender] = useState("")
  const [mstatus, setMstatus] = useState("")
  const [add1, setAdd1] = useState("")
  const [add2, setAdd2] = useState("")
  const [add3, setAdd3] = useState("")
  const [accno, setAccno] = useState(null)
  const [salaryType, setSalaryType] = useState(null)
  const [salary, setSalary] = useState(null)
  const [Pan, setPan] = useState(null)
  const [IFSC, setIFSC] = useState(null)
  const [bankName, setBankName] = useState("")
  const [branchName, setBranchName] = useState("")
  const [deptname, setDeptName] = useState(null)
  const [positionname, setPositionName] = useState(null)
  const [positionid, setPositionid] = useState("")
  const [depid, setdepid] = useState("")
  const [companyid, setCompanyid] = useState(null)
  const [firmid, setFirmid] = useState(null)
  const [selectstate, setSelectState] = useState(null)
  const [selectedcity, setSelectedCity] = useState("")
  const [pincodeselected, setPincodeSelected] = useState(null)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageShow, setImageShow] = React.useState(false);
  // const [roleData, setRoleData] = useState([])
  const [userrole, setUserRole] = useState("")
  const [userId, setUserId] = useState("")
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const [showPassword, setShowPassword] = useState(false);
  const [ipaddress, setIpAddress] = useState('')
  const CGUID = localStorage.getItem('CRMCGUID')
  const [loading, setLoading] = useState(false);

  const [regname, setRegName] = useState('')


  const defaultImageURL = UserDefault;


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        event.preventDefault();
        handleSave()
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userId, profileData, packageid, crm, officeman, hrm, custid, fname, lname, number, email, userName, password, userrole, isactive, ipaddress, id, imageFile, companyid, Empfirstname, Emplastname, Empmobile1, Empmobile2, add1, add2, add3, Empdob, Empdoj, pincodeselected, selectedcity, selectstate, EmpEmail, gender, Pan, mstatus, depid, positionid, role, IFSC, bankName, branchName, accno, salaryType, salary, employeename, emppassword, imageFile]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Show preview of the image
    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(file);
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(defaultImageURL);
    }
    // if (errors.imageFile) {
    //     setErrors(prevErrors => ({ ...prevErrors, imageFile: '' }));
    // }
  };

  const handleUploadClick = () => {
    document.getElementById('imageInput').click();
  };
  const handleImageshow = () => {
    setImageShow(true)
  }

  function ImageShow(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          {/* <Modal.Title id="contained-modal-title-vcenter">
                    Image Preview
                </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    );
  }
  const getUserList = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/UsermstList`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setUserData(res.data);
    } catch (error) {
      // Handle error
    }
  }
  const getEmployeelist = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${CustId}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setUserData(res.data);
    } catch (error) {
    }
  }
  useEffect(() => {
    if (Role == 'Admin') {
      getUserList()
    }
    else {
      getEmployeelist()
      fetchIPAddress()
    }
  }, [])
  useEffect(() => {
    if (userdata.length > 0 && userName) {

      if (Role == "Admin") {
        const foundUser = userdata.find((display) => display.Username === userName);
        setRegName(foundUser.Name)
        setProfileData(true);
        setUserId(foundUser.Id)
        setRegId(foundUser.RegTypeId)
        setPackageId(foundUser.PackageId)
        setCrm(foundUser.CRM)
        setofficeman(foundUser.Officeman)
        setHrm(foundUser.HRM)
        setCustId(foundUser.CustId)
        setFname(foundUser.FirstName)
        setlname(foundUser.LastName)
        setNumber(foundUser.Mobile)
        setNumber2(foundUser.Mobile2)
        setEmail(foundUser.Email)
        setUserName(foundUser.Username)
        setPassword(foundUser.Password)
        setUserRole(foundUser.Role)
        setLicDate(foundUser.LicenseDate)
      }
      else {
        const foundUser = userdata.find((display) => display.UserName === userName);
        setProfileData(true);
        // setNumber(foundUser.Mobile1)
        // setNumber2(foundUser.Mobile2)
        // setPassword(foundUser.Password)
        // setId(foundUser.Id)
        // setFname(foundUser.FirstName)
        // setlname(foundUser.LastName)
        setImagePreview(URL + `/UploadFiles/Emp/${foundUser.Img}`)
        setEmployeename(foundUser.UserName == null ? '' : foundUser.UserName)
        setEmpPassword(foundUser.Password == null ? '' : foundUser.Password)
        setEmpFirstname(foundUser.FirstName == null ? '' : foundUser.FirstName)
        setEmpLastname(foundUser.LastName == null ? '' : foundUser.LastName)
        setEmpMobile1(foundUser.Mobile1 == null ? '' : foundUser.Mobile1)
        setEmpMobile2(foundUser.Mobile2 == null ? '' : foundUser.Mobile2)
        setEmpEmail(foundUser.Email == null ? '' : foundUser.Email)
        setEmpDob(foundUser.DOB == null ? '' : foundUser.DOB)
        setEmpDoj(foundUser.DOJ == null ? '' : foundUser.DOJ)
        setGender(foundUser.Gender == null ? '' : foundUser.Gender)
        setMstatus(foundUser.MaritalStatus == null ? '' : foundUser.MaritalStatus)
        setAdd1(foundUser.Add1 == null ? '' : foundUser.Add1)
        setAdd2(foundUser.Add2 == null ? '' : foundUser.Add2)
        setAdd3(foundUser.Add3 == null ? '' : foundUser.Add3)
        setPincodeSelected(foundUser.PincodeId == null ? '' : foundUser.PincodeId)
        setSelectedCity(foundUser.CityId == null ? '' : foundUser.CityId)
        setSelectState(foundUser.StateId == null ? '' : foundUser.StateId)
        setAccno(foundUser.AccNo == null ? '' : foundUser.AccNo)
        setSalaryType(foundUser.SalaryType == null ? '' : foundUser.SalaryType)
        setSalary(foundUser.SalaryAmount == null ? '' : foundUser.SalaryAmount)
        setPan(foundUser.PAN == null ? '' : foundUser.PAN)
        setIFSC(foundUser.IFSC == null ? '' : foundUser.IFSC)
        setBankName(foundUser.BankName == null ? '' : foundUser.BankName)
        setBranchName(foundUser.BranchName == null ? '' : foundUser.BranchName)
        setDeptName(foundUser.DepartmentName == null ? '' : foundUser.DepartmentName)
        setdepid(foundUser.DepartmentId == null ? '' : foundUser.DepartmentId)
        setPositionName(foundUser.PositionName == null ? '' : foundUser.PositionName)
        setPositionid(foundUser.PositionId == null ? '' : foundUser.PositionId)
        setRole(foundUser.Role == null ? '' : foundUser.Role)
        setCompanyid(foundUser.CompanyId)
        setFirmid(foundUser.FirmId)
        setId(foundUser.Id)
        // EditPincode(foundUser.StateId, foundUser.CityId)
      }

    } else {
      setProfileData(false);
    }
  }, [userdata, userName]);
  const fetchIPAddress = async () => {
    try {
      const res = await axios.get('https://api.ipify.org/?format=json', {
      });
      setIpAddress(res.data.ip)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const handleEdit = () => {
    setEdit(true)
  }
  const handleCancel = () => {
    history.push('/taskdashboard')
  }
  const handleSave = async () => {
    setShowPassword(false);

    try {
      await validationSchema.validate({
        // Empmobile1,
        // Empmobile2,
      }, { abortEarly: false });
      setLoading(true);
      if (Role == "Admin") {
        setEdit(false)
        const res = await axios.post(URL + "/api/Master/CreateUser",
          {
            Flag: "U",
            tokens: {
              Id: userId,
              RegTypeId: regid,
              PackageId: packageid,
              CRM: crm,
              Officeman: officeman,
              HRM: hrm,
              CustId: custid,
              FirstName: fname,
              LastName: lname,
              Mobile: number,
              Email: email,
              Username: userName,
              Password: password,
              Role: userrole,
              IsActive: isactive,
              isDefault: true,
              Cguid: CGUID,
              IPAddress: ipaddress,
              LicenseDate: licDate
            }
          },
          {
            headers: { Authorization: `bearer ${token}` },
          })
        if (res.data.Sucess == true) {
          // getUserList()
          notification.success({
            message: 'Updated Successfully',
            placement: 'top',
            duration: 1,
            onClose: () => history.push('/taskdashboard'),
          });
        }
      }
      else {
        setEdit(false)
        const foundUser = new FormData();
        foundUser.append('Id', id)
        foundUser.append('Image', imageFile)
        foundUser.append('CompanyId', companyid);
        foundUser.append('FirmId', firmid);
        foundUser.append('FirstName', Empfirstname);
        foundUser.append('LastName', Emplastname);
        foundUser.append('Mobile1', Empmobile1);
        foundUser.append('Mobile2', Empmobile2);
        foundUser.append('Add1', add1);
        foundUser.append('Add2', add2);
        foundUser.append('Add3', add3);
        foundUser.append('DOB', Empdob);
        foundUser.append('DOJ', Empdoj);
        foundUser.append('PincodeId', pincodeselected);
        foundUser.append('CityId', selectedcity);
        foundUser.append('StateId', selectstate);
        foundUser.append('Email', EmpEmail);
        foundUser.append('Gender', gender);
        foundUser.append('PAN', Pan);
        foundUser.append('MaritalStatus', mstatus);
        foundUser.append('DepartmentId', depid);
        foundUser.append('PositionId', positionid);
        foundUser.append('Role', role);
        foundUser.append('IFSC', IFSC);
        foundUser.append('BankName', bankName);
        foundUser.append('BranchName', branchName);
        foundUser.append('AccNo', accno);
        foundUser.append('SalaryType', salaryType);
        foundUser.append('SalaryAmount', salary);
        foundUser.append('CustId', CustId);
        foundUser.append('UserName', employeename);
        foundUser.append('Password', emppassword);
        foundUser.append('IsActive', true);
        foundUser.append('IPAddress', ipaddress);
        foundUser.append('Cguid', CGUID);
        foundUser.append('Flag', "U")
        const res = await axios.post(URL + '/api/Master/UpdateEmp', foundUser, {
          headers: { Authorization: `bearer ${token}` }
        });
        if (res.data.Success == true) {
          // getUserList()
          notification.success({
            message: 'Updated Successfully',
            placement: 'top',
            duration: 1,
            onClose: () => history.push('/taskdashboard'),
          });
        }
      }
    } catch (error) {
      // const validationErrors = {};
      // if (error.inner && Array.isArray(error.inner)) {
      //   error.inner.forEach(err => {
      //     validationErrors[err.path] = err.message;
      //   });
      // }
      // setErrors(validationErrors);

    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className='content-wrapper'>
      <div className="container  flex-grow-1 container-p-y">
        <h4 className="font-weight-bold py-3 mb-4">
          Profile
        </h4>
        <div className=" ">
          <div className="row no-gutters row-bordered row-border-light">
            <div className={Role == "Admin" ? 'col-lg-6 card' : 'col-lg-12 card'}>
              <div className="tab-content ">
                <div className="tab-pane user-profile-style fade active show" id="account-general">
                  {
                    Role == "Admin" ? (
                      <div>
                        <div className="card-body media align-items-center ">
                          {profileData == true ? (
                            <div className='username'>
                              <h5 >{'Hi.. ,' + fname + ' ' + lname}</h5>
                            </div>

                          ) : (
                            null
                          )}
                          {/* <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt className="d-block ui-w-80" /> */}
                        </div>
                        <hr className="border-light  m-0" />
                        <div className="card-body profile-body">
                          <div>
                            <div className="form-group">
                              <label className="form-label">First Name</label>
                              <input type="text" className="form-control mb-1" defaultValue={fname} onChange={(event) => { setFname(event.target.value) }} disabled={edit == false ? true : false} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Last Name</label>
                              <input type="text" className="form-control mb-1" defaultValue={lname} onChange={(event) => { setlname(event.target.value) }} disabled={edit == false ? true : false} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Username :</label>
                              <input type="text" className="form-control mb-1" defaultValue={username} disabled />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Mobile :</label>
                              {/* <input type="text" className="form-control" defaultValue={number} onChange={(event) => { setNumber(event.target.value) }} disabled={edit == false ? true : false} /> */}
                              <PhoneInput
                                country={"in"}
                                disabled={edit == false ? true : false}
                                enableSearch={true}
                                value={number}
                                onChange={(value) => {
                                  setNumber(value);
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Password :</label>
                              {/* <input type="password" className="form-control mb-1" defaultValue={password} onChange={(event) => { setPassword(event.target.value) }} disabled={edit == false ? true : false} /> */}
                              <div className='password-main-show-hide'>
                                <input type={showPassword ? "text" : "password"} className="form-control" disabled={edit == false ? true : false} placeholder="Enter Password" defaultValue={password} onChange={(event) => {
                                  const input = event.target.value;
                                  const limitedInput = input.slice(0, 10);
                                  // const firstCapital = limitedInput.charAt(0).toUpperCase() + input.slice(1);
                                  setPassword(limitedInput)
                                  if (errors.password) {
                                    setErrors(prevErrors => ({ ...prevErrors, password: '' }));
                                  }
                                }} />
                                {
                                  edit == true ? (
                                    <button
                                      className="psw-show-icon"
                                      type="button"
                                      onClick={togglePasswordVisibility}
                                    >
                                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </button>
                                  ) : null
                                }

                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Email :</label>
                              <input type="text" className="form-control mb-1" defaultValue={email} onChange={(event) => { setEmail(event.target.value) }} disabled={edit == false ? true : false} />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Reg.Type :</label>
                              <input type="text" className="form-control mb-1" defaultValue={regname} disabled />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="container">
                        <div className="main-body">

                          <div className="row gutters-sm mt-5">
                            <div className="col-md-4 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <div className="d-flex flex-column align-items-center">
                                    <div className="profile-pic-container">
                                      <div className="profile-pic">
                                        <img src={imagePreview || defaultImageURL} alt="Profile" className="rounded-circle" />
                                        {
                                          edit == true ? (
                                            <div className="profile-pic-overlay">
                                              {imagePreview ? <span><FaCamera size={20} onClick={handleUploadClick} /> <BiSolidShow size={20} onClick={handleImageshow} /> </span> : <span><FaPlus size={20} onClick={handleUploadClick} /></span>}
                                            </div>
                                          ) : (<div className="profile-pic-overlay">
                                            <BiSolidShow size={20} onClick={handleImageshow} />
                                          </div>)
                                        }

                                        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                        <ImageShow
                                          show={imageShow}
                                          onHide={() => setImageShow(false)}
                                        />
                                      </div>
                                    </div>


                                    <div className="mt-3 text-center">

                                      <h4>{Empfirstname + " " + Emplastname}</h4>
                                      {/* {foundUser ? (
                                                        // <p className="text-secondary mb-1">{foundUser.PositionName}</p>
                                                    ) : (
                                                      )} */}
                                      <p className="text-secondary mb-1">{positionname}</p>

                                    </div>
                                    <div>
                                      <hr className="my-4" />
                                      <div className="form-group">
                                        <Row>
                                          <Col>
                                            <div className="form-group">
                                              <label>User Name :</label>
                                              <input type="text" className="form-control"
                                                placeholder="Enter User Name"
                                                defaultValue={employeename} disabled
                                              // value={username} onChange={(event) => {
                                              //     const input = event.target.value;
                                              //     const limitedInput = input.slice(0, 10);
                                              //     setUsername(limitedInput);
                                              //     if (errors.username) {
                                              //         setErrors(prevErrors => ({ ...prevErrors, username: '' }));
                                              //     }
                                              // }}
                                              />
                                              {/* {errors.username && <div className="error-message text-danger">{errors.username}</div>} */}
                                            </div>
                                          </Col>
                                          <Col>
                                            <div className="form-group">
                                              <label>Password :</label>
                                              <input type="text" className="form-control"
                                                defaultValue={emppassword} onChange={(event) => { setEmpPassword(event.target.value) }} disabled={true}
                                                placeholder="Enter Password"
                                              // value={password}
                                              // onChange={(event) => {
                                              //     const input = event.target.value;
                                              //     const limitedInput = input.slice(0, 10);
                                              //     setPassword(limitedInput)
                                              //     if (errors.password) {
                                              //         setErrors(prevErrors => ({ ...prevErrors, password: '' }));
                                              //     }
                                              // }}
                                              />
                                              {/* {errors.password && <div className="error-message text-danger">{errors.password}</div>} */}
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <div className="form-group">
                                              <label>Department Name :</label>
                                              <input type="text" className="form-control"
                                                defaultValue={deptname}
                                                disabled />
                                              {/* {errors.deptname && <div className="error-message text-danger">{errors.deptname}</div>} */}
                                            </div>
                                          </Col>
                                          <Col>
                                            <div className="form-group">
                                              <label>Position :</label>
                                              <input type="text" className="form-control"
                                                defaultValue={positionname}
                                                disabled />
                                              {/* {errors.positionname && <div className="error-message text-danger">{errors.positionname}</div>} */}
                                            </div>
                                          </Col>
                                        </Row>
                                        <Row>
                                          {/* <Col>
                                        <div className="form-group">
                                          <label>Role</label>
                                          <input type="text" className="form-control"
                                            defaultValue={Role} 
                                            disabled/>
                                        </div>
                                      </Col> */}
                                        </Row>

                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="card mb-3">
                                <div className="col-sm-12">
                                  <Tabs className='mt-2'>
                                    <Tab eventKey="home" title="Personal Details" >
                                      <div className="form-group">
                                        <Row>
                                          <Col lg={6} md={12}>
                                            <div className="form-group">
                                              <label>First Name :</label>
                                              <input type="text" className="form-control"
                                                defaultValue={Empfirstname} onChange={(event) => { setEmpFirstname(event.target.value) }} disabled={edit == false ? true : false}
                                                // value={firstname} onChange={(event) => {
                                                //     setFirstname(event.target.value);
                                                //     if (errors.firstname) {
                                                //         setErrors(prevErrors => ({ ...prevErrors, firstname: '' }));
                                                //     }
                                                // }}
                                                placeholder="Enter First Name" />
                                              {/* {errors.firstname && <div className="error-message text-danger">{errors.firstname}</div>} */}
                                            </div>
                                          </Col>
                                          <Col lg={6} md={12}>
                                            <div className="form-group">
                                              <label>Last Name :</label>
                                              <input type="text" className="form-control"
                                                defaultValue={Emplastname} onChange={(event) => { setEmpLastname(event.target.value) }} disabled={edit == false ? true : false}
                                                // value={lastname} onChange={(event) => {
                                                //     setLastname(event.target.value);
                                                //     if (errors.lastname) {
                                                //         setErrors(prevErrors => ({ ...prevErrors, lastname: '' }));
                                                //     }
                                                // }}
                                                placeholder="Enter Last Name" />
                                              {/* {errors.lastname && <div className="error-message text-danger">{errors.lastname}</div>} */}
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                      <Row>
                                        <Col lg={6} md={12}>
                                          <div className="form-group">
                                            <label>Mobile1 :</label>
                                            {/* <input type="text" className="form-control"
                                              value={Empmobile1}
                                              //  onChange={(event) => { setEmpMobile1(event.target.value) }}
                                              disabled={edit == false ? true : false}
                                              // value={mobile1} 
                                              onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = numericInput.slice(0, 10);
                                                setEmpMobile1(limitedInput);
                                                if (errors.Empmobile1) {
                                                  setErrors(prevErrors => ({ ...prevErrors, Empmobile1: null }));
                                                }
                                              }}
                                              placeholder="Enter Mobile" /> */}
                                            <PhoneInput
                                              country={"in"}
                                              enableSearch={true}
                                              value={Empmobile1}
                                              disabled={edit == false ? true : false}
                                              onChange={(value) => {
                                                setEmpMobile1(value);
                                                // if (errors.Empmobile1) {
                                                //   setErrors(prevErrors => ({ ...prevErrors, Empmobile1: null }));
                                                // }
                                              }}
                                            />
                                            {/* {errors.Empmobile1 && <div className="error-message text-danger">{errors.Empmobile1}</div>} */}
                                          </div>
                                        </Col>
                                        <Col lg={6} md={12}>
                                          <div className="form-group">
                                            <label>Mobile2 :</label>
                                            {/* <input type="text" className="form-control"
                                              value={Empmobile2}
                                              // onChange={(event) => { setEmpMobile2(event.target.value) }}
                                              disabled={edit == false ? true : false}
                                              onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = numericInput.slice(0, 10);
                                                setEmpMobile2(limitedInput);
                                                if (errors.Empmobile2) {
                                                  setErrors(prevErrors => ({ ...prevErrors, Empmobile2: null }));
                                                }
                                              }}
                                              placeholder="Enter Mobile" /> */}
                                            <PhoneInput
                                              country={"in"}
                                              disabled={edit == false ? true : false}
                                              enableSearch={true}
                                              value={Empmobile2}
                                              onChange={(value) => {
                                                setEmpMobile2(value);
                                              }}
                                            />
                                            {/* {errors.Empmobile2 && <div className="error-message text-danger">{errors.Empmobile2}</div>} */}
                                          </div>
                                        </Col>
                                      </Row>
                                      <div className="form-group">
                                        <label>Email :</label>
                                        <input type="text" className="form-control"
                                          defaultValue={EmpEmail} onChange={(event) => { setEmpEmail(event.target.value) }} disabled={edit == false ? true : false}
                                          // value={email} onChange={(event) => {
                                          //     setEmail(event.target.value);
                                          //     if (errors.email) {
                                          //         setErrors(prevErrors => ({ ...prevErrors, email: '' }));
                                          //     }
                                          // }} 
                                          placeholder="Enter Email" />
                                        {/* {errors.email && <div className="error-message text-danger">{errors.email}</div>} */}
                                      </div>
                                      <Row>
                                        <Col lg={6}>
                                          <div className="form-group">
                                            <label>Date of Birth :</label>
                                            <input type="date" className="form-control"
                                              defaultValue={Empdob} onChange={(event) => { setEmpDob(event.target.value) }} disabled={edit == false ? true : false}
                                              // value={dob} onChange={(event) => {
                                              //     setDob(event.target.value);
                                              //     if (errors.dob) {
                                              //         setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
                                              //     }
                                              // }}
                                              placeholder="Enter Email" />
                                            {/* {errors.dob && <div className="error-message text-danger">{errors.dob}</div>} */}
                                          </div>

                                        </Col>
                                        <Col lg={6}>
                                          <div className="form-group">
                                            <label>Date of Joining :</label>
                                            <input type="date" className="form-control"
                                              defaultValue={Empdoj} onChange={(event) => { setEmpDoj(event.target.value) }} disabled={edit == false ? true : false}
                                              // value={doj} onChange={(event) => {
                                              //     setDoj(event.target.value);
                                              //     if (errors.doj) {
                                              //         setErrors(prevErrors => ({ ...prevErrors, doj: '' }));
                                              //     }
                                              // }}
                                              placeholder="Enter Email" />
                                            {/* {errors.doj && <div className="error-message text-danger">{errors.doj}</div>} */}
                                          </div>
                                        </Col>

                                      </Row>
                                    </Tab>
                                  </Tabs>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </div>
                    )
                  }
                  <div className="reset-button">
                    {
                      edit == false ? (
                        <button type="button" className="btn btn-primary  m-4" onClick={handleEdit}>Edit</button>
                      )
                        : (
                          <button type="button" className="btn btn-primary m-4" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save [F9]'}</button>
                        )
                    }
                    <button type="button" className="btn btn-danger m-1" onClick={handleCancel} disabled={loading}>Cancel</button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserProfile
