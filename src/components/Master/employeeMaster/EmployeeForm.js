import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import Tab from "react-bootstrap/Tab";
// import Tabs from 'react-bootstrap/Tabs';
import { Tabs, Badge } from "antd";
import { useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { FaCamera, FaPlus, FaUser } from "react-icons/fa";
import "../../style/Style.css";
import * as Yup from "yup";
import UserDefault from "./userprofile.png";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiSolidShow } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IfscMain from "../IFSC/IfscMaster";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import moment from "moment";
import { Drawer } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import PincodeMaster from "../PartyMaster/PincodeMaster";
import { addressFieldChange } from "../common/Address";
import { v4 as uuidv4 } from "uuid";
const { TabPane } = Tabs;

// Form validation Schema start
const PANRegex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const MobileNoRegex = /^\d{12}$/;
const GmailRegex = /@.*\./;
const validationSchema = Yup.object().shape({
  // imageFile: Yup.string().required("Select Profile Picture"),
  username: Yup.string().required("User Name is required"),
  password: Yup.string().required("Password is required"),
  // deptname: Yup.string().required("Select Department"),
  // positionname: Yup.string().required("Select Position"),
  // role: Yup.string().required("Please select Role Type"),
  // companyid: Yup.string().required("Please select Company Name"),
  // firmid: Yup.string().required("Please select Firm name"),
  firstname: Yup.string().required("First Name is required"),
  lastname: Yup.string().required("Last Name is required"),
  // dob: Yup.string().required("Please select Date of birth"),
  // doj: Yup.string().required("Please select Date of joining"),
  // gender: Yup.string().required("Please select Gender"),
  // mstatus: Yup.string().required("Please select Marital Status"),
  // add1: Yup.string().required("Address is required"),
  // add2: Yup.string().required("Address is required"),
  // add3: Yup.string().required("Address is required"),
  // selectstate: Yup.string().required("Please select State"),
  // selectedcity: Yup.string().required("Please select City"),
  // pincodeselected: Yup.number().required("Please select Pincode"),
  // IFSC: Yup.string().required("Please select IFSC Code"),
  // accno: Yup.number().required("Account Number is required"),
  // salaryType: Yup.string().required("Please select Salary Type"),
  // salary: Yup.number().required("Salary is required"),
  Pan: Yup.string()
    .nullable() // Allow null or empty value
    .test({
      name: "panFormat",
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
      name: "gmailFormet",
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
  // mobile1: Yup.string().required("Mobile Number is required").matches(MobileNoRegex, 'Invalid format!'),
  mobile1: Yup.string()
    .required("Mobile Number is required")
    .matches(MobileNoRegex, "Invalid format!"),
  // mobile2: Yup.string().required("Mobile Number is required").matches(MobileNoRegex, 'Invalid format!'),
  // mobile2: Yup.string()
  //     .nullable() // Allow null or empty value
  //     .test({
  //         name: 'mobileFormat',
  //         test: function (value) {
  //             // Access other field values using this.parent
  //             const isMobileNotEmpty = value && value.trim().length > 0;

  //             // Apply validation only if PAN is not empty
  //             if (isMobileNotEmpty) {
  //                 return MobileNoRegex.test(value);
  //             }

  //             // If PAN is empty, consider it as valid
  //             return true;
  //         },
  //         message: 'Invalid Number!',
  //     }),
  // Add validation schema for other fields,
});
// Form validation Schema end

function MoreRecord(props) {
  const { fetchIFSCData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Body>
        <IfscMain fetchIFSCData={fetchIFSCData} onHide={props.onHide} />
      </Modal.Body>
    </Modal>
  );
}

// function MoreRecord(props) {
//     const { fetchIFSCData, onClose } = props
//     const errorData = React.useRef(null);
//     return (
//         <Drawer
//             {...props}
//             title="Add Employee"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="62vw"
//         >
//             <Modal.Body>
//                 <IfscMain fetchIFSCData={fetchIFSCData} onHide={props.onHide} errorData={errorData}/>
//             </Modal.Body>
//         </Drawer>
//     );
// }

function EmployeeForm({ onHide, fetchData, rowData }) {
  // function EmployeeForm({ onHide, fetchData, rowData, errorData, reset_Data }) {

  // React.useEffect(() => {
  //     if (errorData) {
  //         errorData.current = resetErrors
  //     }
  // }, [])
  // React.useEffect(() => {
  //     if (reset_Data) {
  //         reset_Data.current = resetData
  //     }
  // }, [])

  // const [companyid, setCompanyid] = useState("")
  // const [companyName, setCompanyName] = useState("")
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
    );
  }
  const [pincodeModal, setpincodeModal] = useState(false);
  const [moreShow, setMoreShow] = React.useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile1, setMobile1] = useState(null);
  const [mobile2, setMobile2] = useState("");
  const [email, setEmail] = useState("");
  const toDayDate = new Date();
  const [dob, setDob] = useState("");
  const [doj, setDoj] = useState("");
  const [gender, setGender] = useState("M");
  const [mstatus, setMstatus] = useState("Single");
  const [add1, setAdd1] = useState("");
  const [add2, setAdd2] = useState("");
  const [add3, setAdd3] = useState("");
  const [accno, setAccno] = useState("");
  const [salaryType, setSalaryType] = useState("Days");
  const [salary, setSalary] = useState("");
  const [Pan, setPan] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [deptname, setDeptName] = useState("");
  const [positionname, setPositionName] = useState("");
  const [role, setRole] = useState("User");
  const [departmentdata, setDepartmentData] = useState([]);
  const [posiotiondata, setPosiotionData] = useState([]);
  const [IFSCData, setIFSCData] = useState([]);
  const [companydata, setComapnyData] = useState([]);
  const [id, setId] = useState(-1);
  const [selectstate, setSelectState] = useState("");
  const [stateData, setStateData] = useState([]);
  const [citydata, setCityData] = useState([]);
  const [cityconvert, setCityConvert] = useState([]);
  const [selectedcity, setSelectedCity] = useState("");
  const [pincodeData, setPincodeData] = useState([]);
  const [pincodeconvert, setPincodeConvert] = useState([]);
  const [pincodeselected, setPincodeSelected] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [imageShow, setImageShow] = React.useState(false);
  const [roleData, setRoleData] = useState([]);
  const [isactive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [errordisplay, setErrorDisplay] = useState("");
  const [guid, setGuid] = useState("");
  const companyId = localStorage.getItem("CRMCompanyId");
  // const [imageshow,setImageShow]=useState(false)
  const token = localStorage.getItem("CRMtoken");
  const custId = localStorage.getItem("CRMCustId");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = React.useState("");
  const [ipaddress, setIpAddress] = useState("");
  const URL = process.env.REACT_APP_API_URL;
  const CGUID = localStorage.getItem("CRMCGUID");
  const defaultImageURL = UserDefault;

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const uuid = uuidv4();
  const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${custId}`;

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
    document.getElementById("imageInput").click();
  };
  const handleImageshow = () => {
    setImageShow(true);
  };

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

  // const resetErrors = () => {
  //     setErrors({});
  // };

  // const resetData = () => {
  //     setUsername("");
  //     setPassword("");
  //     setFirstname("");
  //     setLastname("");
  //     setMobile1("")
  //     setMobile2("")
  //     setEmail("");
  //     setDob("");
  //     setDoj("");
  //     setGender("");
  //     setMstatus("");
  //     setAdd1("");
  //     setAdd2("");
  //     setAdd3("");
  //     setPincodeSelected("");
  //     setSelectedCity("");
  //     setSelectState("");
  //     setAccno("");
  //     setSalaryType("");
  //     setSalary("");
  //     setPan("");
  //     setIFSC("");
  //     setBankName("");
  //     setBranchName("");
  //     setDeptName("");
  //     setPositionName("");
  //     setRole("");
  //     setIsActive(true);
  // }

  useEffect(() => {
    if (rowData) {
      setImagePreview(URL + `/UploadFiles/Emp/${rowData.Img}`);
      setUsername(rowData.UserName == null ? "" : rowData.UserName);
      setPassword(rowData.Password == null ? "" : rowData.Password);
      setFirstname(rowData.FirstName == null ? "" : rowData.FirstName);
      setLastname(rowData.LastName == null ? "" : rowData.LastName);
      setMobile1(rowData.Mobile1 == null ? "" : rowData.Mobile1);
      setMobile2(rowData.Mobile2 == null ? "" : rowData.Mobile2);
      setEmail(rowData.Email == null ? "" : rowData.Email);
      const DOBDate = rowData.DOB;
      const DOJDate = rowData.DOJ;
      const formattedDatefrom = moment(DOBDate).format("yyyy-MM-DD");
      const formattedDojfrom = moment(DOJDate).format("yyyy-MM-DD");
      // setDob(rowData.DOB == null ? '' : formattedDatefrom)
      setDob(rowData.DOB == null || rowData.DOB == "" ? "" : formattedDatefrom);
      // setDoj(rowData.DOJ == null ? '' : formattedDojfrom)
      setDoj(rowData.DOJ == null || rowData.DOJ == "" ? "" : formattedDojfrom);
      setGender(
        rowData.Gender == null || rowData.Gender == "" ? "M" : rowData.Gender
      );
      // setGender(rowData.Gender)
      setMstatus(
        rowData.MaritalStatus == null || rowData.MaritalStatus == ""
          ? "Single"
          : rowData.MaritalStatus
      );
      setAdd1(rowData.Add1 == null ? "" : rowData.Add1);
      setAdd2(rowData.Add2 == null ? "" : rowData.Add2);
      setAdd3(rowData.Add3 == null ? "" : rowData.Add3);
      setPincodeSelected(rowData.PincodeId == null ? "" : rowData.PincodeId);
      setSelectedCity(rowData.CityId == null ? "" : rowData.CityId);
      setSelectState(rowData.StateId == null ? "" : rowData.StateId);
      // setPincodeSelected(0)
      // setSelectedCity(0)
      // setSelectState(0)
      setAccno(rowData.AccNo == null ? "" : rowData.AccNo);
      setSalaryType(
        rowData.SalaryType == null || rowData.SalaryType == ""
          ? "Days"
          : rowData.SalaryType
      );
      setSalary(rowData.SalaryAmount == null ? "" : rowData.SalaryAmount);
      setPan(rowData.PAN == null ? "" : rowData.PAN);
      setIFSC(rowData.IFSC == null ? "" : rowData.IFSC);
      setBankName(rowData.BankName == null ? "" : rowData.BankName);
      setBranchName(rowData.BranchName == null ? "" : rowData.BranchName);
      setDeptName(rowData.DepartmentId == null ? "" : rowData.DepartmentId);
      setPositionName(rowData.PositionId == null ? "" : rowData.PositionId);
      setRole(rowData.Role == null ? "" : rowData.Role);
      // setCompany(rowData.CompanyId)
      setId(rowData.Id);
      setIsActive(rowData.IsActive);
      EditPincode(rowData.StateId, rowData.CityId);
      setAccountType(rowData.AccType);
      setGuid(rowData.Cguid);
    }
  }, [rowData]);
  const EditPincode = async (StateId, CityId) => {
    let citydata;
    let pincodedata;
    try {
      const res = await axios.get(URL + "/api/Master/CityList");
      // console.log(res.data,"response")
      citydata = res.data;
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await axios.get(URL + "/api/Master/PincodeList");
      pincodedata = res.data;
    } catch (error) {
      console.log(error);
    }
    const cityconvert = citydata.filter(
      (display) => display.StateID == StateId
    );
    setCityConvert(cityconvert);

    const pincodeconvert = pincodedata.filter(
      (display) => display.CityID == CityId
    );
    setPincodeConvert(pincodeconvert);
  };

  const getDepartmentData = async () => {
    try {
      const res = await axios.get(
        URL +
          `/api/Master/DepartmentList/?CustId=${custId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setDepartmentData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const DepartMentrecord = departmentdata.map((display) => ({
    value: display.Id,
    label: display.DepartmentName,
  }));
  const getPositionData = async () => {
    try {
      const res = await axios.get(
        URL +
          `/api/Master/PositionList?CustId=${custId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setPosiotionData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const PositionFilter = posiotiondata.filter(
    (display) => display.DepartmentId == deptname
  );
  const Positionrecord = PositionFilter.map((display) => ({
    value: display.Id,
    label: display.PositionName,
  }));
  const getCompanyData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/CompanyList?CustId=${custId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setComapnyData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const Companyrecord = companydata.map((display) => ({
    value: display.CompanyId,
    label: display.CompanyName,
  }));

  const fetchIFSCData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/IFSCList?CustId=${custId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setIFSCData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDepartmentData();
    getPositionData();
    fetchIFSCData();
    getCompanyData();
  }, []);
  const ifscOptions = IFSCData.map((display) => ({
    value: display.IFSC,
    label: display.IFSC,
  }));
  const fetchRoleData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/RoleList?CustId=${custId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setRoleData(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchRoleData();
  }, []);
  const roleOptions = roleData.map((display) => ({
    value: display.Role,
    label: display.Role,
  }));
  // const companyTypeOptions = [
  //     { value: 'SubAdmin', label: 'SubAdmin' },
  //     { value: 'User', label: 'User' },
  //     { value: 'Accounts', label: 'Accounts' },
  //     { value: 'HR', label: 'HR' },
  //     { value: 'Manger', label: 'Manger' },
  // ];
  const MstatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorsed", label: "Divorsed" },
    { value: "Comitted", label: "Comitted" },
  ];
  const GenderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "T", label: "Transgender" },
  ];
  const SalaryOptions = [
    { value: "Days", label: "Day Base" },
    { value: "Hours", label: "Hour Base" },
    { value: "Monthly", label: "Monthly" },
  ];
  const handleIFSCChange = (selectedIfsc) => {
    const selectedIfscID = selectedIfsc ? selectedIfsc.value : "";
    setIFSC(selectedIfscID);
    const selectIfsc = IFSCData.find(
      (display) => display.IFSC == selectedIfscID
    );
    if (selectIfsc) {
      setBankName(selectIfsc.BankName);
      setBranchName(selectIfsc.BranchName);
    } else {
      setBankName("");
      setBranchName("");
      setAccno("");
      setAccountType(null);
    }
    if (errors.IFSC) {
      setErrors((prevErrors) => ({ ...prevErrors, IFSC: null }));
    }
  };

  const fetchMasterData = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/mst_Master", {
        headers: { Authorization: `bearer ${token}` },
      });
      setMasterData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPincode = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/PincodeList", {});
      setPincodeData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getStateData = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/StateList");
      setStateData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCityData = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/CityList");
      setCityData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchIPAddress = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json", {});
      setIpAddress(res.data.ip);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getPincode();
    getStateData();
    getCityData();
    fetchMasterData();
    fetchIPAddress();
  }, []);
  const stateOption = stateData.map((display) => ({
    value: display.StateID,
    label: display.StateName,
  }));
  useEffect(() => {
    if (selectstate) {
      const cityconvert = citydata.filter(
        (display) => display.StateID == selectstate
      );
      setCityConvert(cityconvert);
    }
  }, [selectstate]);

  useEffect(() => {
    if (selectedcity) {
      const pincodeconvert = pincodeData.filter(
        (display) => display.CityID == selectedcity
      );
      setPincodeConvert(pincodeconvert);
    }
  }, [selectedcity]);
  const cityoption = cityconvert.map((display) => ({
    value: display.CityID,
    label: display.CityName,
  }));
  const pincodeOptions = pincodeconvert.map((display) => ({
    value: display.PinCodeID,
    label: display.Code,
  }));

  const options = masterData.filter(
    (display) => display.Remark === "Bank Account"
  );
  const accountTypeOptions = options.map((display) => ({
    value: display.MasterTag1,
    label: display.Description,
  }));

  const DataSubmit = async () => {
    try {
      await validationSchema.validate(
        {
          // imageFile,
          // companyid,
          firstname,
          lastname,
          mobile1,
          // mobile2,
          // add1,
          // add2,
          // add3,
          // dob,
          // doj,
          // selectedcity,
          // pincodeselected,
          // selectstate,
          email,
          // gender,
          Pan,
          // mstatus,
          // deptname,
          // positionname,
          // role,
          IFSC,
          // bankName,
          // accno,
          // salaryType,
          // salary,
          username,
          password,
        },
        { abortEarly: false }
      );
      setLoading(true);
      const formData = new FormData();
      if (imageFile != null) {
        formData.append("Image", imageFile);
      }
      if (id > 0) {
        formData.append("Id", id);
        formData.append("Flag", "U");
      } else {
        formData.append("Flag", "A");
      }
      formData.append("CompanyId", companyId);
      formData.append("FirstName", firstname);
      formData.append("LastName", lastname);
      formData.append("Mobile1", mobile1);
      formData.append("Mobile2", mobile2);
      formData.append("Add1", addressFieldChange(add1.trim()));
      formData.append("Add2", addressFieldChange(add2.trim()));
      formData.append("Add3", addressFieldChange(add3.trim()));
      formData.append("DOB", dob);
      formData.append("DOJ", doj);
      formData.append("PincodeId", pincodeselected);
      formData.append("CityId", selectedcity);
      formData.append("StateId", selectstate);
      formData.append("Email", email);
      formData.append("Gender", gender);
      formData.append("PAN", Pan);
      formData.append("MaritalStatus", mstatus);
      formData.append("DepartmentId", deptname);
      formData.append("PositionId", positionname);
      formData.append("Role", role);
      formData.append("IFSC", IFSC);
      formData.append("BankName", bankName);
      formData.append("BranchName", branchName);
      formData.append("AccNo", accno);
      formData.append("AccType", accountType);
      formData.append("SalaryType", salaryType);
      formData.append("SalaryAmount", salary);
      formData.append("CustId", custId);
      formData.append("UserName", username);
      formData.append("Password", password);
      formData.append("IsActive", isactive);
      formData.append("IPAddress", ipaddress);
      formData.append("Cguid", id > 0 ? guid : UUID);

      if (id > 0) {
        const res = await axios.post(URL + "/api/Master/UpdateEmp", formData, {
          headers: { Authorization: `bearer ${token}` },
        });
        if (res.data.Success == true) {
          fetchData();
          // resetData();
          onHide();
          notification.success({
            message: "Data Modify Successfully !!!",
            placement: "bottomRight",
            duration: 1,
          });
        }
      } else {
        const res = await axios.post(URL + "/api/Master/CreateEmp", formData, {
          headers: { Authorization: `bearer ${token}` },
        });
        if (res.data.Success == true) {
          fetchData();
          // resetData();
          onHide();
          notification.success({
            message: "Data Added Successfully !!!",
            placement: "bottomRight",
            duration: 1,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorDisplay(error.response.data.Message);
      }
      const validationErrors = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moreShow == false) {
      const handleKeyDown = (event) => {
        if (event.key === "F9") {
          event.preventDefault();
          DataSubmit();
        }
      };

      // Add event listener when the component mounts
      window.addEventListener("keydown", handleKeyDown);

      // Remove event listener when the component unmounts
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    id,
    deptname,
    positionname,
    isactive,
    role,
    lastname,
    dob,
    doj,
    gender,
    mstatus,
    salaryType,
    salary,
    Pan,
    firstname,
    mobile1,
    add1,
    add2,
    add3,
    mobile1,
    mobile2,
    email,
    selectstate,
    selectedcity,
    pincodeselected,
    IFSC,
    username,
    password,
    accno,
    accountType,
    imagePreview,
    moreShow,
  ]);

  function capitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="container">
      <div className="main-body">
        {/* <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Employee</h1>
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section> */}
        <div className="row gutters-sm mt-3">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center">
                  <div className="profile-pic-container">
                    <div className="profile-pic">
                      <img
                        src={imagePreview || defaultImageURL}
                        alt="Profile"
                        className="rounded-circle"
                      />
                      <div className="profile-pic-overlay">
                        {imagePreview ? (
                          <span>
                            <FaCamera size={20} onClick={handleUploadClick} />{" "}
                            <BiSolidShow size={20} onClick={handleImageshow} />{" "}
                          </span>
                        ) : (
                          <span>
                            <FaPlus size={20} onClick={handleUploadClick} />
                          </span>
                        )}
                      </div>
                      <ImageShow
                        show={imageShow}
                        onHide={() => setImageShow(false)}
                      />
                    </div>
                  </div>

                  {/* Hidden Image input */}
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {/* {errors.imageFile && <div className="error-message text-danger">{errors.imageFile}</div>} */}
                  <div className="mt-3 text-center">
                    <h4>{firstname + " " + lastname}</h4>
                    {rowData ? (
                      <p className="text-secondary mb-1">
                        {rowData.PositionName}
                      </p>
                    ) : (
                      <p className="text-secondary mb-1">Position</p>
                    )}
                  </div>
                  <div>
                    <hr className="my-4" />
                    <div className="form-group">
                      <Row>
                        <Col>
                          <div className="form-group">
                            <label>
                              User Name :<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter User Name"
                              value={username}
                              onChange={(event) => {
                                const input = event.target.value;
                                const firstCapital =
                                  input.charAt(0).toUpperCase() +
                                  input.slice(1);
                                const limitedInput = firstCapital.slice(0, 10);
                                setUsername(limitedInput);
                                setErrorDisplay("");
                                if (errors.username) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    username: "",
                                  }));
                                }
                              }}
                            />
                            {errors.username && (
                              <div className="error-message text-danger">
                                {errors.username}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div className="form-group">
                            <label>
                              Password :<span className="text-danger">*</span>
                            </label>
                            <div className="password-main-show-hide">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const limitedInput = input.slice(0, 10);
                                  setPassword(limitedInput);
                                  if (errors.password) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      password: "",
                                    }));
                                  }
                                }}
                              />
                              <button
                                className="psw-show-icon"
                                type="button"
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <AiOutlineEyeInvisible />
                                ) : (
                                  <AiOutlineEye />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <div className="error-message text-danger">
                                {errors.password}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="form-group">
                            {/* <label>Department Name :<span className='text-danger'>*</span></label> */}
                            <label>Department :</label>
                            <Select
                              className="w-100"
                              options={DepartMentrecord}
                              isClearable={true}
                              value={DepartMentrecord.find(
                                (option) => option.value == deptname
                              )}
                              onChange={(selected) => {
                                setDeptName(selected ? selected.value : "");
                                setPositionName("");
                                // if (errors.deptname) {
                                //     setErrors(prevErrors => ({ ...prevErrors, deptname: '' }));
                                // }
                              }}
                              placeholder="Department"
                            />
                            {/* {errors.deptname && <div className="error-message text-danger">{errors.deptname}</div>} */}
                          </div>
                        </Col>
                        <Col>
                          <div className="form-group">
                            {/* <label>Position :<span className='text-danger'>*</span></label> */}
                            <label>Designation :</label>
                            <Select
                              className="w-100"
                              // isDisabled={deptname ? false : true}
                              options={Positionrecord}
                              value={Positionrecord.find(
                                (option) => option.value == positionname
                              )}
                              isClearable={true}
                              onChange={(selected) => {
                                setPositionName(selected ? selected.value : "");
                                // if (errors.positionname) {
                                //     setErrors(prevErrors => ({ ...prevErrors, positionname: null }));
                                // }
                              }}
                              placeholder="Designation"
                            />
                            {/* {errors.positionname && <div className="error-message text-danger">{errors.positionname}</div>} */}
                          </div>
                        </Col>
                      </Row>
                      {rowData && rowData.Role == "Admin" ? null : (
                        <>
                          <Row>
                            <Col>
                              <div className="form-group">
                                {/* <label>Role :<span className='text-danger'>*</span></label> */}
                                <label>Role :</label>
                                <Select
                                  className="w-100"
                                  options={roleOptions}
                                  value={roleOptions.find(
                                    (option) => option.value == role
                                  )}
                                  onChange={(selected) => {
                                    setRole(selected.value);
                                    // if (errors.role) {
                                    //     setErrors(prevErrors => ({ ...prevErrors, role: null }));
                                    // }
                                  }}
                                  placeholder="Select Role"
                                />
                                {/* {errors.role && <div className="error-message text-danger">{errors.role}</div>} */}
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <div>
                                  <label>Status</label>
                                  <br />
                                  <label className="radio-inline">
                                    <input
                                      type="radio"
                                      name="statusdepartment"
                                      checked={isactive === true}
                                      onChange={() => {
                                        setIsActive(true);
                                      }}
                                    />{" "}
                                    Active
                                  </label>
                                  <label className="radio-inline">
                                    <input
                                      type="radio"
                                      name="statusdepartment"
                                      checked={isactive === false}
                                      onChange={() => {
                                        setIsActive(false);
                                      }}
                                    />{" "}
                                    Inactive
                                  </label>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="col-sm-12">
                <Tabs defaultActiveKey="home" transition={true}>
                  <TabPane
                    key="home"
                    tab={
                      <div>
                        <span
                          className={
                            errors.firstname
                              ? "text-danger"
                              : "" || errors.lastname
                              ? "text-danger"
                              : ""
                          }
                        >
                          Personal Details
                        </span>{" "}
                        {errors.firstname && errors.lastname && (
                          <Badge dot style={{ backgroundColor: "red" }} />
                        )}
                      </div>
                    }
                  >
                    <div className="form-group">
                      <Row>
                        <Col lg={6} md={12}>
                          <div className="form-group">
                            <label>
                              First Name :<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={firstname}
                              onChange={(event) => {
                                const input = event.target.value;
                                const firstCapital =
                                  input.charAt(0).toUpperCase() +
                                  input.slice(1);
                                const limitedInput = firstCapital.slice(0, 18);
                                setFirstname(limitedInput);
                                if (errors.firstname) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    firstname: "",
                                  }));
                                }
                              }}
                              placeholder="Enter First Name"
                            />
                            {errors.firstname && (
                              <div className="error-message text-danger">
                                {errors.firstname}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={6} md={12}>
                          <div className="form-group">
                            <label>
                              Last Name :<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={lastname}
                              onChange={(event) => {
                                const input = event.target.value;
                                const firstCapital =
                                  input.charAt(0).toUpperCase() +
                                  input.slice(1);
                                const limitedInput = firstCapital.slice(0, 18);
                                setLastname(limitedInput);
                                if (errors.lastname) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    lastname: "",
                                  }));
                                }
                              }}
                              placeholder="Enter Last Name"
                            />
                            {errors.lastname && (
                              <div className="error-message text-danger">
                                {errors.lastname}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <Row>
                      <Col lg={6}>
                        <div className="form-group">
                          {/* <label>Date of Birth :<span className='text-danger'>*</span></label> */}
                          <label>Date of Birth :</label>
                          <input
                            type="date"
                            className="form-control"
                            value={dob}
                            onChange={(event) => {
                              setDob(event.target.value);
                              // if (errors.dob) {
                              //     setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
                              // }
                            }}
                            placeholder="Enter Email"
                          />
                          {/* {errors.dob && <div className="error-message text-danger">{errors.dob}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          {/* <label>Date of Joining :<span className='text-danger'>*</span></label> */}
                          <label>Date of Joining :</label>
                          <input
                            type="date"
                            className="form-control"
                            value={doj}
                            onChange={(event) => {
                              setDoj(event.target.value);
                              // if (errors.doj) {
                              //     setErrors(prevErrors => ({ ...prevErrors, doj: '' }));
                              // }
                            }}
                            placeholder="Enter Email"
                          />
                          {/* {errors.doj && <div className="error-message text-danger">{errors.doj}</div>} */}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          {/* <label>Gender :<span className='text-danger'>*</span></label> */}
                          <label>Gender :</label>
                          <Select
                            className="w-100"
                            options={GenderOptions}
                            value={GenderOptions.find(
                              (option) => option.value == gender
                            )}
                            onChange={(selected) => {
                              setGender(selected.value);
                              // if (errors.gender) {
                              //     setErrors(prevErrors => ({ ...prevErrors, gender: null }));
                              // }
                            }}
                            placeholder="Select Gender"
                          />
                          {/* {errors.gender && <div className="error-message text-danger">{errors.gender}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          {/* <label>Marital Status :<span className='text-danger'>*</span></label> */}
                          <label>Marital Status :</label>
                          <Select
                            className="w-100"
                            options={MstatusOptions}
                            value={MstatusOptions.find(
                              (option) => option.value == mstatus
                            )}
                            onChange={(selected) => {
                              setMstatus(selected.value);
                              // if (errors.mstatus) {
                              //     setErrors(prevErrors => ({ ...prevErrors, mstatus: null }));
                              // }
                            }}
                            placeholder="Select Marital Status"
                          />
                          {/* {errors.mstatus && <div className="error-message text-danger">{errors.mstatus}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          {/* <label>Salary Type :<span className='text-danger'>*</span></label> */}
                          <label>Salary Type :</label>
                          <Select
                            className="w-100"
                            options={SalaryOptions}
                            value={SalaryOptions.find(
                              (option) => option.value == salaryType
                            )}
                            onChange={(selected) => {
                              setSalaryType(selected.value);
                              // if (errors.salaryType) {
                              //     setErrors(prevErrors => ({ ...prevErrors, salaryType: null }));
                              // }
                            }}
                            placeholder="Select SalaryType"
                          />
                          {/* {errors.salaryType && <div className="error-message text-danger">{errors.salaryType}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          {/* <label>Salary :<span className='text-danger'>*</span></label> */}
                          <label>Salary :</label>
                          <input
                            type="text"
                            className="form-control"
                            value={salary}
                            onChange={(event) => {
                              const input = event.target.value;
                              const numericInput = input.replace(/\D/g, "");
                              const limitedInput = numericInput.slice(0, 10);
                              setSalary(limitedInput);
                              // if (errors.salary) {
                              //     setErrors(prevErrors => ({ ...prevErrors, salary: null }));
                              // }
                            }}
                            placeholder="Enter Salary"
                          />
                          {/* {errors.salary && <div className="error-message text-danger">{errors.salary}</div>} */}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <div className="form-group">
                        <label>PAN No. :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={Pan}
                          onChange={(event) => {
                            const input = event.target.value;
                            const filteredInput = input
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, ""); // Allow only capital letters and numbers
                            const limitedInput = filteredInput.slice(0, 10);
                            setPan(limitedInput);
                            if (errors.Pan) {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                Pan: "",
                              }));
                            }
                          }}
                          placeholder="Enter PAN No."
                        />
                        {errors.Pan && (
                          <div className="error-message text-danger">
                            {errors.Pan}
                          </div>
                        )}
                      </div>
                    </Row>
                  </TabPane>
                  {/* <TabPane key="Contact" tab={<div>
                                        <span className={errors.mobile1 ? 'text-danger' : '' || errors.email ? 'text-danger' : ''}>Contact Details</span>{' '}
                                        {errors.mobile1 && errors.email && (
                                            <Badge dot style={{ backgroundColor: 'red' }} />
                                        )}
                                    </div>} > */}
                  <TabPane
                    key="Contact"
                    tab={
                      <div>
                        <span
                          className={
                            (errors.mobile1 ? "text-danger" : "") ||
                            (errors.mobile1 ? "text-danger" : "")
                          }
                        >
                          Contact Details
                        </span>{" "}
                        {(errors.email || errors.mobile1) && (
                          <Badge dot style={{ backgroundColor: "red" }} />
                        )}
                      </div>
                    }
                  >
                    <div className="form-group">
                      {/* <label>Address1 :<span className='text-danger'>*</span></label> */}
                      <label>Address1 :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={add1}
                        onChange={(event) => {
                          const input = event.target.value;
                          // const formattedValue = capitalizeEachWord(input);
                          setAdd1(input);
                          // if (errors.add1) {
                          //     setErrors(prevErrors => ({ ...prevErrors, add1: '' }));
                          // }
                        }}
                        placeholder="Enter Address1"
                      />
                      {/* {errors.add1 && <div className="error-message text-danger">{errors.add1}</div>} */}
                    </div>
                    <Row>
                      <Col lg={6}>
                        <div className="form-group">
                          {/* <label>Address2 :<span className='text-danger'>*</span></label> */}
                          <label>Address2 :</label>
                          <input
                            type="text"
                            className="form-control"
                            value={add2}
                            onChange={(event) => {
                              const input = event.target.value;
                              // const formattedValue = capitalizeEachWord(input);
                              setAdd2(input);

                              // Code for cursor issue
                              // const input = e.target;
                              // const start = input.selectionStart;
                              // const end = input.selectionEnd;
                              // const inputValue = input.value.toLowerCase();
                              // input.value = inputValue;
                              // input.setSelectionRange(start, end);
                            }}
                            placeholder="Enter Address2"
                          />
                          {/* {errors.add2 && <div className="error-message text-danger">{errors.add2}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          {/* <label>Address3 :<span className='text-danger'>*</span></label> */}
                          <label>Address3 :</label>
                          <input
                            type="text"
                            className="form-control"
                            value={add3}
                            onChange={(event) => {
                              const input = event.target.value;
                              // const formattedValue = capitalizeEachWord(input);
                              setAdd3(input);
                              // if (errors.add3) {
                              //     setErrors(prevErrors => ({ ...prevErrors, add3: '' }));
                              // }
                            }}
                            placeholder="Enter Address3"
                          />
                          {/* {errors.add3 && <div className="error-message text-danger">{errors.add3}</div>} */}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label>
                            Mobile 1 :<span className="text-danger">*</span>
                          </label>
                          {/* <input type="text" className="form-control"
                                                        value={mobile1} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const numericInput = input.replace(/\D/g, '');
                                                            const limitedInput = numericInput.slice(0, 10);
                                                            setMobile1(limitedInput);
                                                            if (errors.mobile1) {
                                                                setErrors(prevErrors => ({ ...prevErrors, mobile1: null }));
                                                            }
                                                        }} placeholder="Enter Mobile1" /> */}
                          <PhoneInput
                            country={"in"}
                            enableSearch={true}
                            value={mobile1}
                            onChange={(value) => {
                              setMobile1(value);
                              if (errors.mobile1) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  mobile1: null,
                                }));
                              }
                            }}
                          />
                          {errors.mobile1 && (
                            <div className="error-message text-danger">
                              {errors.mobile1}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12}>
                        <div className="form-group">
                          <label>Mobile 2 :</label>
                          {/* <input type="text" className="form-control"
                                                        value={mobile2} onChange={(event) => {
                                                            const input = event.target.value;
                                                            const numericInput = input.replace(/\D/g, '');
                                                            const limitedInput = numericInput.slice(0, 10);
                                                            setMobile2(limitedInput);
                                                            if (errors.mobile2) {
                                                                setErrors(prevErrors => ({ ...prevErrors, mobile2: null }));
                                                            }
                                                        }} placeholder="Enter Mobile2" /> */}
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
                          {/* {errors.mobile2 && <div className="error-message text-danger">{errors.mobile2}</div>} */}
                        </div>
                      </Col>
                      <Col lg={12} md={12}>
                        <div className="form-group">
                          {/* <label>Email :<span className='text-danger'>*</span></label> */}
                          <label>Email :</label>
                          <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(event) => {
                              const input = event.target.value;
                              const lowerCase = input.toLowerCase();
                              const limitedInput = lowerCase.slice(0, 50);
                              setEmail(limitedInput);
                              if (errors.email) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  email: "",
                                }));
                              }
                            }}
                            placeholder="Enter Email"
                          />
                          {errors.email && (
                            <div className="error-message text-danger">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4}>
                        <div className="form-group">
                          {/* <label>State :<span className='text-danger'>*</span></label> */}
                          <label>State :</label>
                          <Select
                            options={stateOption}
                            // value={stateOption.find((option) => option.value == selectstate)}
                            isClearable={true}
                            value={
                              selectstate
                                ? stateOption.find(
                                    (option) => option.value == selectstate
                                  )
                                : null
                            }
                            placeholder="Select State"
                            onChange={(selectedState) => {
                              setSelectState(
                                selectedState ? selectedState.value : ""
                              );
                              setSelectedCity(""); // Update regType in the component state
                              setPincodeSelected("");
                              setPincodeConvert([]);
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
                            value={
                              selectedcity
                                ? cityoption.find(
                                    (option) => option.value == selectedcity
                                  )
                                : null
                            }
                            placeholder="Select City"
                            onChange={(selectedCity) => {
                              setSelectedCity(
                                selectedCity ? selectedCity.value : ""
                              );
                              setPincodeSelected("");
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
                          <div className="d-flex">
                            <Select
                              className="w-100"
                              options={pincodeOptions}
                              // isDisabled={selectedcity ? false : true}
                              // value={pincodeOptions.find((option) => option.value == pincodeselected)}
                              value={
                                pincodeselected
                                  ? pincodeOptions.find(
                                      (option) =>
                                        option.value == pincodeselected
                                    )
                                  : null
                              }
                              placeholder="Select Pincode"
                              isClearable={true}
                              onChange={(selectedPincode) => {
                                setPincodeSelected(
                                  selectedPincode ? selectedPincode.value : ""
                                );
                                // if (errors.pincodeselected) {
                                //     setErrors(prevErrors => ({ ...prevErrors, pincodeselected: null }));
                                // }
                              }}
                              maxMenuHeight={200}
                            />
                            <div className="more-btn-icon">
                              <FiMoreHorizontal
                                onClick={() => setpincodeModal(true)}
                              />
                              <PincodeNew
                                show={pincodeModal}
                                onHide={() => setpincodeModal(false)}
                                getPincode={getPincode}
                              />
                            </div>
                          </div>

                          {/* {errors.pincodeselected && <div className="error-message text-danger">{errors.pincodeselected}</div>} */}
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane key="Bank" tab="Bank Details">
                    <Row>
                      <Col lg={12}>
                        <div className="form-group">
                          <label>IFSC Code :</label>
                          <div className="dropdownadd-record  ">
                            <Select
                              className="w-100"
                              options={ifscOptions}
                              value={ifscOptions.find(
                                (option) => option.value == IFSC
                              )}
                              isClearable={true}
                              onChange={handleIFSCChange}
                              placeholder="Choose IFSC Code"
                              key={IFSC}
                            />
                            <div className="more-btn-icon ">
                              <FiMoreHorizontal
                                onClick={() => setMoreShow(true)}
                              />
                              <MoreRecord
                                show={moreShow}
                                onHide={() => setMoreShow(false)}
                                fetchIFSCData={fetchIFSCData}
                              />
                              {/* <MoreRecord
                                                                visible={moreShow}
                                                                onHide={() => setMoreShow(false)}
                                                                fetchIFSCData={fetchIFSCData}
                                                            /> */}
                            </div>
                          </div>
                        </div>
                        {/* {errors.IFSC && <div className="error-message text-danger">{errors.IFSC}</div>} */}
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={bankName}
                            placeholder="Enter Bank Name"
                            disabled
                          />
                          {/* {errors.selectedfirm && <div className="error-message text-danger">{errors.selectedfirm}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Branch Name</label>
                          <input
                            type="text"
                            className="form-control w-100"
                            value={branchName}
                            placeholder="Enter Branch Name"
                            disabled
                          />
                          {/* {errors.selectedfirm && <div className="error-message text-danger">{errors.selectedfirm}</div>} */}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <div className="form-group">
                          {/* <label>Account No. :<span className='text-danger'>*</span></label> */}
                          <label>Account No. :</label>
                          <input
                            type="text"
                            className="form-control"
                            value={accno}
                            onChange={(event) => {
                              const input = event.target.value;
                              const numericInput = input.replace(/\D/g, "");
                              const limitedInput = numericInput.slice(0, 16);
                              setAccno(limitedInput);
                              // if (errors.accno) {
                              //     setErrors(prevErrors => ({ ...prevErrors, accno: null }));
                              // }
                            }}
                            placeholder="Enter Account No."
                          />
                          {/* {errors.accno && <div className="error-message text-danger">{errors.accno}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Account Type : </label>
                          <Select
                            className="w-100"
                            options={accountTypeOptions}
                            value={accountTypeOptions.find(
                              (option) => option.value == accountType
                            )}
                            isClearable={true}
                            onChange={(selected) => {
                              setAccountType(selected ? selected.value : "");
                              if (errors.accountType) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  accountType: "",
                                }));
                              }
                            }}
                            placeholder="Choose Account Type"
                            key={accountType} // Force remount when accountType changes
                          />
                          {errors.accountType && (
                            <div className="error-message text-danger">
                              {errors.accountType}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        {errordisplay ? (
          <span className="text-danger">{errordisplay}</span>
        ) : null}
        <hr />

        <div className="reset-button ">
          <button
            className="btn btn-success m-2"
            onClick={DataSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save [F9]"}
          </button>
          <button
            className="btn btn-danger m-2"
            onClick={onHide}
            disabled={loading}
          >
            Cancel [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;
