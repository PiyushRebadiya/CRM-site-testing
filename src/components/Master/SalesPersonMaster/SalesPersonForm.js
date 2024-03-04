import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import Select from "react-select";
import { notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import IfscMaster from "../IFSC/IfscMaster";
import { FiMoreHorizontal } from "react-icons/fi";
import { Tabs, Badge } from "antd";
import { Drawer } from "antd";
import "../../style/Style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import PincodeMaster from "./PincodeMaster";
const { TabPane } = Tabs;

function IfscCodeNew(props) {
  const { fetchIFSCData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {/* <Modal.Body> */}
      <IfscMaster fetchIFSCData={fetchIFSCData} onHide={props.onHide} />
      {/* </Modal.Body> */}
    </Modal>
  );
}
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
// function IfscCodeNew(props) {
//     const { fetchIFSCData, onClose } = props;
//     const errorData = React.useRef(null);
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width={1200}
//         >
//             {/* <Modal.Body> */}
//             <IfscMaster fetchIFSCData={fetchIFSCData} onHide={props.onHide} errorData={errorData}/>
//             {/* </Modal.Body> */}
//         </Drawer>
//     );
// }

// Form validation Schema start
const PANRegex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
const TANRegex = /^([A-Z]){4}([0-9]){5}([A-Z]){1}$/;
const GSTINRegex =
  /^([0-9]){2}([A-Z]){5}([0-9]){4}([A-Z]){1}([1-9A-Z]){1}([A-Z]){1}[0-9A-Z]{1}$/;
const MobileNoRegex = /^([0-9]){12}$/;
const AadharNoRegex = /^\d{12}$/;
const GmailRegex = /@.*\./;
const validationSchema = Yup.object().shape({
  partyname: Yup.string().required("Sales Person Name  is required"),
  // companyName: Yup.string().required("Please select Company"),
  // selectstate: Yup.string().required("Please select State"),
  // selectedcity: Yup.string().required("Please select City"),
  // pincodeselected: Yup.number().required("Please select Pincode"),
  // pan: Yup.string().required("PAN Number is required").matches(PANRegex, 'Invalid format! Valid format "ABCDE1234A"'),
  pan: Yup.string()
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
  // tan: Yup.string().required("TAN Number is required").matches(TANRegex, 'Invalid format! Valid format "ABCD12345A"'),
  tan: Yup.string()
    .nullable() // Allow null or empty value
    .test({
      name: "tanFormat",
      test: function (value) {
        // Access other field values using this.parent
        const isTanNotEmpty = value && value.trim().length > 0;

        // Apply validation only if PAN is not empty
        if (isTanNotEmpty) {
          return TANRegex.test(value);
        }

        // If PAN is empty, consider it as valid
        return true;
      },
      message: 'Invalid format! Valid format "ABCD12345A"',
    }),
  // assignTo: Yup.array().required("Please select who you want to assign the task"),
  gst: Yup.string()
    .nullable() // Allow null or empty value
    .test({
      name: "gstFormat",
      test: function (value) {
        // Access other field values using this.parent
        const isGstNotEmpty = value && value.trim().length > 0;

        // Apply validation only if PAN is not empty
        if (isGstNotEmpty) {
          return GSTINRegex.test(value);
        }

        // If PAN is empty, consider it as valid
        return true;
      },
      message: 'Invalid format! Valid format "12ABCDE3456F7ZG"',
    }),
  // aadhar: Yup.string().required("Aadhar Number is required").matches(AadharNoRegex, 'Invalid format! Valid format "123456789123"'),
  aadhar: Yup.string()
    .nullable() // Allow null or empty value
    .test({
      name: "aadharFormat",
      test: function (value) {
        // Access other field values using this.parent
        const isAadharNotEmpty = value && value.trim().length > 0;

        // Apply validation only if PAN is not empty
        if (isAadharNotEmpty) {
          return AadharNoRegex.test(value);
        }

        // If PAN is empty, consider it as valid
        return true;
      },
      message: 'Invalid format! Valid format "123456789123"',
    }),
  // phone1: Yup.string().required("Phone Number is required"),
  // mobile1: Yup.string()
  //     .nullable() // Allow null or empty value
  //     .test({
  //         name: 'mobile1Format',
  //         test: function (value) {
  //             // Access other field values using this.parent
  //             const isMobile1NotEmpty = value && value.trim().length > 0;

  //             // Apply validation only if PAN is not empty
  //             if (isMobile1NotEmpty) {
  //                 return MobileNoRegex.test(value);
  //             }

  //             // If PAN is empty, consider it as valid
  //             return true;
  //         },
  //         message: 'Invalid Number!',
  //     }),
  // mobile2: Yup.string()
  //     .nullable() // Allow null or empty value
  //     .test({
  //         name: 'mobile2Format',
  //         test: function (value) {
  //             // Access other field values using this.parent
  //             const isMobile2NotEmpty = value && value.trim().length > 0;

  //             // Apply validation only if mobile is not empty
  //             if (isMobile2NotEmpty) {
  //                 return MobileNoRegex.test(value);
  //             }

  //             // If mobile is empty, consider it as valid
  //             return true;
  //         },
  //         message: 'Invalid Number!',
  //     }),
  mobile1: Yup.string()
    .required("Mobile Number is required")
    .matches(MobileNoRegex, "Invalid format!"),
  // mobile2: Yup.string().required("Mobile No is required"),
  // add1: Yup.string().required("Address is required"),
  // add2: Yup.string().required("Address is required"),
  // add3: Yup.string().required("Address is required"),
  // Add validation schema for other fields,
  // IFSC: Yup.string().required("Please select IFSC Code"),
  // accountNo: Yup.string().required("Please select Account Number"),
  // accountType: Yup.string().required("Please select Account Type"),
});
// Form validation Schema end

const PartyForm = ({ getSalesPersonData, onHide, rowData, fetchData }) => {
  // const PartyForm = ({ getSalesPersonData, onHide, rowData, fetchData, errorData, reset_Data }) => {

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
  const [pincodefetchData, setpincodefetchData] = useState("");
  const [pincodeModal, setpincodeModal] = useState(false);
  const [partyid, setPartyId] = useState(-1);
  const [partyname, setPartyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [isactive, setIsActive] = useState(true);
  const [selectstate, setSelectState] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [citydata, setCityData] = useState([]);
  const [cityconvert, setCityConvert] = useState([]);
  const [selectedcity, setSelectedCity] = useState(null);
  const [pincodeData, setPincodeData] = useState([]);
  const [pincodeconvert, setPincodeConvert] = useState([]);
  const [getfirmdata, setGetFirmData] = useState([]);
  const [gstEdit, setGstEdit] = useState(true);
  const [selectedfirm, setSelectedFirm] = useState("");
  const [pincodeselected, setPincodeSelected] = useState(null);
  const [categorylist, setCategoryList] = useState([]);
  const [categoryname, setCategoryName] = useState();
  const [pan, setPan] = useState("");
  const [tan, setTan] = useState("");
  const [gst, setGst] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [email, setemail] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [add1, setAdd1] = useState("");
  const [add2, setAdd2] = useState("");
  const [add3, setAdd3] = useState("");
  const [ifsccode, setIfscCode] = React.useState(false);
  const [IFSC, setIFSC] = useState(null);
  const [IFSCData, setIFSCData] = useState([]);
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const toDayDate = new Date();
  const formattedDateToDay = moment(toDayDate).format("yyyy-MM-DD");
  const [dob, setDob] = useState("");
  const [annivarsaryDate, setAnnivaryDate] = useState("");
  const [doj, setDoj] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountType, setAccountType] = React.useState(null);
  const [errors, setErrors] = useState({});
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [itFileNo, setItFileNo] = useState("");
  const [gstFileNo, setGSTFileNo] = useState("");
  const [otherFileNo, setOtherFileNo] = useState("");
  const [CINNo, setCINNo] = useState("");
  const [companyStatus, setCompanyStatus] = useState("");
  const [residentStatus, setResidentStatus] = useState("");
  const [gstFillingStatus, setGSTFillingStatus] = useState("");
  const [gstID, setGSTID] = useState("");
  const [gstPassword, setGSTPassword] = useState("");
  const [incomeTaxID, setIncomeTaxID] = useState("");
  const [incomeTaxPassword, setIncomeTaxPassword] = useState("");
  const [userID, setUserID] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const token = localStorage.getItem("CRMtoken");
  const userId = localStorage.getItem("CRMUserId");
  const custId = localStorage.getItem("CRMCustId");
  const compnayid = localStorage.getItem("CRMCompanyId");
  const userName = localStorage.getItem("CRMUsername");
  const URL = process.env.REACT_APP_API_URL;

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const uuid = uuidv4();
  const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${custId}`;

  // const resetErrors = () => {
  //     setErrors({});
  // };

  // const resetData = () => {
  //     setPartyName("");
  //     setLegalName("");
  //     setemail("");
  //     setDob("");
  //     setDoj("");
  //     setAnnivaryDate("");
  //     setMobile1("");
  //     setMobile2("");
  //     setSelectState(null);
  //     setSelectedCity(null);
  //     setPincodeSelected(null);
  //     setAadhar("");
  //     setGst("");
  //     setTan("");
  //     setPan("");
  //     setAdd1("");
  //     setAdd2("");
  //     setAdd3("");
  //     setIFSC(null);
  //     setBankName("")
  //     setBranchName("");
  //     setAccountNo("");
  //     setAccountType(null);
  //     // setErrors({});
  // }

  useEffect(() => {
    if (rowData) {
      setPartyId(rowData.SalespersonId);
      setCompanyName(rowData.CompanyId);
      setPartyName(rowData.SalesPersonName);
      setLegalName(rowData.LegelName);
      const DOBDate = rowData.DOB;
      const AnnivarsaryDateFormat = rowData.AnnivarsaryDate;
      const DOJDate = rowData.DOJ;
      const formattedDatefrom = moment(DOBDate).format("yyyy-MM-DD");
      const formattedDojfrom = moment(DOJDate).format("yyyy-MM-DD");
      const formattedAnniversyformat = moment(AnnivarsaryDateFormat).format(
        "yyyy-MM-DD"
      );
      setDob(formattedDatefrom);
      setAnnivaryDate(formattedAnniversyformat);
      setDoj(formattedDojfrom);
      setAdd1(rowData.Add1);
      setAdd2(rowData.Add2);
      setAdd3(rowData.Add3);
      setPincodeSelected(rowData.PincodeId);
      setSelectedCity(rowData.CityId);
      setSelectState(rowData.StateId);
      // setPhone1(rowData.Phone1)
      // setPhone2(rowData.Phone2)
      setMobile1(rowData.Mobile1);
      setMobile2(rowData.Mobile2);
      setemail(rowData.Email);
      setPan(rowData.PAN);
      setTan(rowData.TAN);
      setGst(rowData.GST);
      setAadhar(rowData.Aadhar);
      setIFSC(rowData.IFSC);
      setBankName(rowData.BankName);
      setBranchName(rowData.BranchName);
      setAccountNo(rowData.AccNo);
      setAccountType(rowData.AccType);
      setCategoryName(rowData.CategoryId);
      setIsActive(rowData.IsActive);

      EditPincode(rowData.StateId, rowData.CityId);
      setGstEdit(false);
    }
    // else {
    //     resetData(); // Ensure data is reset when rowData is not provided
    // }
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
      // console.log(res.data,"responsepincodefffff")
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
  const getCompanyData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/CompanyList?CustId=${custId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setCompanyData(res.data);
    } catch (error) {}
  };
  const fetchIFSCData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/IFSCList?CustId=${custId}&CompanyId=${compnayid}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setIFSCData(res.data);
    } catch (error) {
      console.log(error);
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

  const getCategoryList = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/CategoryList?CompanyID=${compnayid}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setCategoryList(res.data);
      // if (!rowData) {
      //     setCategoryName(res.data[0].Id)
      // }
      // console.log(res,"category-Api-caled")
    } catch (error) {
      console.log(error);
    }
  };

  const [ipaddress, setIpAddress] = useState("");
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
    getCompanyData();
    fetchIFSCData();
    fetchMasterData();
    getCategoryList();
    fetchIPAddress();
  }, []);
  const options = masterData.filter(
    (display) => display.Remark === "Bank Account"
  );
  const company_Status = masterData.filter(
    (display) => display.Remark === "CompanyStatus"
  );
  const companyStatusOptions = company_Status.map((display) => ({
    value: display.MasterTag1,
    label: display.Description,
  }));
  const accountTypeOptions = options.map((display) => ({
    value: display.MasterTag1,
    label: display.Description,
  }));
  const stateOption = stateData.map((display) => ({
    value: display.StateID,
    label: display.StateName,
  }));
  const companyoption = companyData.map((display) => ({
    value: display.CompanyId,
    label: display.CompanyName,
  }));
  const ifscOptions = IFSCData.map((display) => ({
    value: display.IFSC,
    label: display.IFSC,
  }));
  const categoryoption = categorylist.map((display) => ({
    value: display.Id,
    label: display.CategoryName,
  }));
  // console.log(categoryoption, "categoryoption")
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

  const handleIFSCChange = (selectedIfsc) => {
    // console.log(selectedIfsc, "selectedIfsc")
    const selectedIfscID = selectedIfsc ? selectedIfsc.value : "";
    // const selectedIfscID = (selectedIfsc.value)
    setIFSC(selectedIfscID);
    const selectIfsc = IFSCData.find(
      (display) => display.IFSC == selectedIfscID
    );
    // console.log(selectIfsc, "selectedRowData")
    if (selectIfsc) {
      setBankName(selectIfsc.BankName);
      setBranchName(selectIfsc.BranchName);
    } else {
      setBankName("");
      setBranchName("");
      setAccountNo("");
      setAccountType(null);
    }
    // if (errors.IFSC) {
    //     setErrors(prevErrors => ({ ...prevErrors, IFSC: '' }));
    // }
  };
  const DataSubmit = async () => {
    try {
      await validationSchema.validate(
        {
          // companyName,
          partyname,
          // selectstate,
          // selectedcity,
          // pincodeselected,
          pan,
          tan,
          gst,
          aadhar,
          email,
          // phone1,
          mobile1,
          // mobile2,
          // add1,
          // IFSC,
          // accountNo,
          // accountType,
        },
        { abortEarly: false }
      );
      setLoading(true);
      if (partyid >= 0) {
        const res = await axios.post(
          URL + "/api/Master/Createsalesperson",
          {
            SalespersonId: partyid,
            UserId: userId,
            CustId: custId,
            SalesPersonName: partyname,
            DOB: dob,
            AnnivarsaryDate: annivarsaryDate,
            DOJ: doj,
            Add1: add1,
            Add2: add2,
            Add3: add3,
            PincodeId: pincodeselected,
            CityId: selectedcity,
            StateId: selectstate,
            // Phone1: phone1,
            // Phone2: phone2,
            Mobile1: mobile1,
            Mobile2: mobile2,
            Email: email,
            PAN: pan,
            TAN: tan,
            GST: gst,
            Aadhar: aadhar,
            BankName: bankName,
            BranchName: branchName,
            IFSC: IFSC,
            AccNo: accountNo,
            AccType: accountType,
            LastModified: new Date(),
            IsGovOrg: true,
            LegelName: legalName,
            IsTaxDeductor: true,
            IsActive: isactive,
            Guid: UUID,
            CompanyId: compnayid,
            CategoryId: categoryname,
            IPAddress: ipaddress,
            UserName: userName,
            GSTId: gstID,
            GSTPassword: gstPassword,
            IncomTaxId: incomeTaxID,
            IncomTaxPassword: incomeTaxPassword,
            ITFileNo: itFileNo,
            GSTFileNo: gstFileNo,
            OtherFileNo: otherFileNo,
            CompanyCINNo: CINNo,
            CompanyStatus: companyStatus,
            GSTFillingStatus: gstFillingStatus,
            TraceId: userID,
            TracePassword: userPassword,
            ResidentStatus: residentStatus,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        // After successfully creating a user, add the new username to the userlist
        // setuserlist([...userlist, userName]);
        // Clear the username error if it was previously set
        // setUsernameError('');

        if (res.data.Success == true) {
          fetchData();
          // resetData();
          onHide();
          if (getSalesPersonData) {
            getSalesPersonData();
          }
          notification.success({
            message: "Data Modified Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      } else {
        const res = await axios.post(
          URL + "/api/Master/Createsalesperson",
          {
            UserId: userId,
            CustId: custId,
            SalesPersonName: partyname,
            DOB: dob,
            AnnivarsaryDate: annivarsaryDate,
            DOJ: doj,
            Add1: add1,
            Add2: add2,
            Add3: add3,
            PincodeId: pincodeselected,
            CityId: selectedcity,
            StateId: selectstate,
            // Phone1: phone1,
            // Phone2: phone2,
            Mobile1: mobile1,
            Mobile2: mobile2,
            Email: email,
            PAN: pan,
            TAN: tan,
            GST: gst,
            Aadhar: aadhar,
            BankName: bankName,
            BranchName: branchName,
            IFSC: IFSC,
            AccNo: accountNo,
            AccType: accountType,
            LastModified: new Date(),
            IsGovOrg: true,
            LegelName: legalName,
            IsTaxDeductor: true,
            IsActive: true,
            Guid: UUID,
            CompanyId: compnayid,
            CategoryId: categoryname,
            IPAddress: ipaddress,
            UserName: userName,
            GSTId: gstID,
            GSTPassword: gstPassword,
            IncomTaxId: incomeTaxID,
            IncomTaxPassword: incomeTaxPassword,
            ITFileNo: itFileNo,
            GSTFileNo: gstFileNo,
            OtherFileNo: otherFileNo,
            CompanyCINNo: CINNo,
            CompanyStatus: companyStatus,
            GSTFillingStatus: gstFillingStatus,
            TraceId: userID,
            TracePassword: userPassword,
            ResidentStatus: residentStatus,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        // After successfully creating a user, add the new username to the userlist
        // setuserlist([...userlist, userName]);
        // Clear the username error if it was previously set
        // setUsernameError('');
        if (res.data.Success == true) {
          fetchData();
          // resetData();
          onHide();
          if (getSalesPersonData) {
            getSalesPersonData();
          }
          notification.success({
            message: "Data Added Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      }
    } catch (error) {
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
    if (ifsccode == false) {
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
    partyid,
    categoryname,
    partyname,
    email,
    dob,
    doj,
    annivarsaryDate,
    selectstate,
    selectedcity,
    pincodeselected,
    pan,
    tan,
    gst,
    aadhar,
    mobile1,
    mobile2,
    isactive,
    add1,
    add2,
    add3,
    IFSC,
    accountNo,
    accountType,
    ifsccode,
  ]);

  function capitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  useEffect(() => {
    if (selectstate) {
      if (gstEdit == true) {
        const fillterStateCode = stateData.find(
          (item) => item.StateID == selectstate
        );
        setGst(fillterStateCode.StateCode);
      }
    }
  }, [selectstate]);

  return (
    <div>
      <div>
        <div className="form-border">
          {/* Content Header (Page header) */}
          <section
            className="content-header model-close-btn"
            style={{ width: "100%" }}
          >
            <div className="form-heading">
              <div className="header-icon">
                <i className="fa fa-users" />
              </div>
              <div className="header-title">
                <h1>Sales Person Master</h1>
                {/* <small>Category list</small> */}
              </div>
            </div>
            <div className="close-btn">
              <button
                type="button"
                className="close ml-auto"
                aria-label="Close"
                style={{ color: "black" }}
                onClick={onHide}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </section>
          {/* Main content */}
          <div>
            <div className="row">
              {/* Form controls */}
              <div className="col-sm-12">
                <div
                  className="lobicard all_btn_card"
                  id="lobicard-custom-control1"
                >
                  <div className="col-sm-12">
                    {/* <Row>
                                        <Col lg={12}>
                                                <div className="form-group">
                                                    <label>Company Name :</label>
                                                    <Select
                                                        options={companyoption}
                                                        value={companyoption.find((option) => option.value == companyName)}
                                                        placeholder="Select Company"
                                                        onChange={(selectedFirm) => {
                                                            setCompanyName(selectedFirm.value);
                                                            if (errors.companyName) {
                                                                setErrors(prevErrors => ({ ...prevErrors, companyName: '' }));
                                                            }
                                                        }}
                                                    />
                                                    {errors.companyName && <div className="error-message text-danger">{errors.companyName}</div>}
                                                </div>
                                            </Col>
                                        </Row> */}

                    <Tabs defaultActiveKey="1" transition={true}>
                      <TabPane
                        key="1"
                        tab={
                          <div>
                            <span
                              className={
                                errors.partyname
                                  ? "text-danger"
                                  : "" || errors.mobile1
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              Personal Details
                            </span>{" "}
                            {errors.partyname && errors.mobile1 && (
                              <Badge dot style={{ backgroundColor: "red" }} />
                            )}
                          </div>
                        }
                      >
                        {/* <Row>
                                                    <Col lg={12}>
                                                        <div className="form-group">
                                                            <label>Category Name :</label>
                                                            <Select
                                                                options={categoryoption}
                                                                // isMulti
                                                                isClearable={true}
                                                                value={categoryoption.find((option) => option.value == categoryname)}
                                                                placeholder="Select Category"
                                                                onChange={(selectedcategory) => {
                                                                    setCategoryName(selectedcategory ? selectedcategory.value : '');
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row> */}
                        <Row>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>
                                Sales Person Name :
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={partyname}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const capitalLetters = input.toUpperCase();
                                  setPartyName(input);
                                  if (errors.partyname) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      partyname: "",
                                    }));
                                  }
                                }}
                                placeholder="Enter Sales Person Name"
                              />
                              {errors.partyname && (
                                <div className="error-message text-danger">
                                  {errors.partyname}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Legal Name :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={legalName}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const capitalLetters = input.toUpperCase();
                                  setLegalName(input);
                                  // if (errors.companyname) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, companyname: '' }));
                                  // }
                                }}
                                placeholder="Enter Legal Name"
                              />
                              {/* {errors.companyname && <div className="error-message text-danger">{errors.companyname}</div>} */}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="form-group">
                              <label>Email :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={email}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const lowerCase = input.toLowerCase();
                                  const limitInput = lowerCase.slice(0, 50);
                                  setemail(limitInput);
                                  if (errors.email) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      email: null,
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
                              <label>Date of Birth :</label>
                              <input
                                type="date"
                                className="form-control"
                                value={dob}
                                onChange={(event) => {
                                  setDob(event.target.value);
                                }}
                                placeholder="Date of Birth"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="form-group">
                              <label>
                                Date of Joining :
                                <span className="text-danger"></span>
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={doj}
                                onChange={(event) => {
                                  setDoj(event.target.value);
                                }}
                                placeholder="Date of Birth"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="form-group">
                              <label>
                                Annivarsary Date :
                                <span className="text-danger"></span>
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={annivarsaryDate}
                                onChange={(event) => {
                                  setAnnivaryDate(event.target.value);
                                }}
                                placeholder="Date of Birth"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>
                                Mobile1 :<span className="text-danger">*</span>
                              </label>
                              {/* <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile1} onChange={(event) => {
                                                                const input = event.target.value;
                                                                const numericInput = input.replace(/\D/g, '');
                                                                const limitedInput = numericInput.slice(0, 10);
                                                                setMobile1(limitedInput);
                                                                if (errors.mobile1) {
                                                                    setErrors(prevErrors => ({ ...prevErrors, mobile1: null }));
                                                                }
                                                            }} /> */}
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
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Mobile2 :</label>
                              {/* <input type="text" className="form-control" placeholder="Enter Mobile " value={mobile2} onChange={(event) => {
                                                                const input = event.target.value;
                                                                const numericInput = input.replace(/\D/g, '');
                                                                const limitedInput = numericInput.slice(0, 10);
                                                                setMobile2(limitedInput);
                                                                if (errors.mobile2) {
                                                                    setErrors(prevErrors => ({ ...prevErrors, mobile2: null }));
                                                                }
                                                            }} /> */}
                              <PhoneInput
                                country={"in"}
                                enableSearch={true}
                                value={mobile2}
                                onChange={(value) => {
                                  setMobile2(value);
                                  if (errors.mobile2) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      mobile2: null,
                                    }));
                                  }
                                }}
                              />
                              {errors.mobile2 && (
                                <div className="error-message text-danger">
                                  {errors.mobile2}
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4}>
                            <div className="form-group">
                              <label>State :</label>
                              <Select
                                options={stateOption}
                                // value={stateOption.find((option) => option.value == selectstate)}
                                isClearable={true}
                                value={
                                  selectstate
                                    ? stateOption.find(
                                        (option) => option.value === selectstate
                                      )
                                    : null
                                }
                                placeholder="Select State"
                                onChange={(selectedState) => {
                                  setSelectState(
                                    selectedState ? selectedState.value : ""
                                  ); // Update regType in the component state
                                  setSelectedCity("");
                                  setPincodeSelected("");
                                  setGstEdit(true);

                                  // if (errors.selectstate) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, selectstate: null }));
                                  // }
                                }}
                                // key={selectstate}
                              />
                              {/* {errors.selectstate && <div className="error-message text-danger">{errors.selectstate}</div>} */}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="form-group">
                              <label>City :</label>
                              <Select
                                options={cityoption}
                                // isDisabled={selectstate ? false : true}
                                // value={cityoption.find((option) => option.value == selectedcity)}
                                isClearable={true}
                                value={
                                  selectedcity
                                    ? cityoption.find(
                                        (option) =>
                                          option.value === selectedcity
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
                                // key={selectedcity}
                              />
                              {/* {errors.selectedcity && <div className="error-message text-danger">{errors.selectedcity}</div>} */}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="form-group w-100">
                              <label>Pincode :</label>
                              <div className="d-flex ">
                                <Select
                                  className="w-100"
                                  options={pincodeOptions}
                                  // isDisabled={selectedcity ? false : true}
                                  // value={pincodeOptions.find((option) => option.value == pincodeselected)}
                                  isClearable={true}
                                  value={
                                    pincodeselected
                                      ? pincodeOptions.find(
                                          (option) =>
                                            option.value === pincodeselected
                                        )
                                      : null
                                  }
                                  placeholder="Select Pincode"
                                  onChange={(selectedPincode) => {
                                    setPincodeSelected(
                                      selectedPincode
                                        ? selectedPincode.value
                                        : ""
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
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label>GST :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={gst}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const convertInput = input
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, "");
                                  const limitedInput = convertInput.slice(
                                    0,
                                    15
                                  );
                                  setGst(limitedInput);
                                  const extractedPanValue = limitedInput.slice(
                                    2,
                                    12
                                  );
                                  setPan(extractedPanValue);
                                  if (errors.gst) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      gst: null,
                                    }));
                                  }
                                }}
                                placeholder="Enter GST "
                              />
                              {errors.gst && (
                                <div className="error-message text-danger">
                                  {errors.gst}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label>PAN :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={pan}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const filteredInput = input
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, ""); // Allow only capital letters and numbers
                                  const limitedInput = filteredInput.slice(
                                    0,
                                    10
                                  );
                                  setPan(limitedInput);
                                  setGstEdit(true);

                                  if (errors.pan) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      pan: null,
                                    }));
                                  }
                                }}
                                placeholder="Enter PAN "
                              />
                              {errors.pan && (
                                <div className="error-message text-danger">
                                  {errors.pan}
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label>TAN :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={tan}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const filteredInput = input
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, ""); // Allow only capital letters and numbers
                                  const limitedInput = filteredInput.slice(
                                    0,
                                    10
                                  );
                                  setTan(limitedInput);
                                  if (errors.tan) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      tan: null,
                                    }));
                                  }
                                }}
                                placeholder="Enter TAN "
                              />
                              {errors.tan && (
                                <div className="error-message text-danger">
                                  {errors.tan}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col lg={6} md={12}>
                            <div className="form-group">
                              <label>Aadhar :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={aadhar}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const numericInput = input.replace(/\D/g, "");
                                  const limitedInput = numericInput.slice(
                                    0,
                                    12
                                  );
                                  setAadhar(limitedInput);
                                  if (errors.aadhar) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      aadhar: null,
                                    }));
                                  }
                                }}
                                placeholder="Enter Aadhar "
                              />
                              {errors.aadhar && (
                                <div className="error-message text-danger">
                                  {errors.aadhar}
                                </div>
                              )}
                            </div>
                          </Col>
                          <div>
                            <label>Status :</label>
                            <br />
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="status"
                                checked={isactive == true ? true : false}
                                onChange={() => {
                                  setIsActive(true);
                                }}
                              />{" "}
                              Active
                            </label>
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="status"
                                checked={isactive == false ? true : false}
                                onChange={() => {
                                  setIsActive(false);
                                }}
                              />{" "}
                              Inactive
                            </label>
                          </div>
                        </Row>
                      </TabPane>
                      {/* <Tab
                                                eventKey="2"
                                                title="Login Details"
                                                className="tabs-design"
                                            >
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>User ID :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter User ID"
                                                                value={userID}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setUserID(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>User Password :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter User Password"
                                                                value={userPassword}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setUserPassword(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>GST ID :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter GST ID"
                                                                value={gstID}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setGSTID(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>
                                                                GST Password :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter GST Password"
                                                                value={gstPassword}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setGSTPassword(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>
                                                                Income Tax ID :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Income Tax ID"
                                                                value={incomeTaxID}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setIncomeTaxID(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>
                                                                Income Tax Password :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Income Tax Password"
                                                                value={incomeTaxPassword}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.slice(0, 40);
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setIncomeTaxPassword(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </Tab>
                                            <Tab
                                                eventKey="3"
                                                title="IT / GST Details"
                                                className="tabs-design"
                                            >
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>IT File No. :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter IT File No."
                                                                value={itFileNo}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.toUpperCase()
                                                                        .replace(/[^A-Z0-9]/g, "").slice(0, 10); // Allow only capital letters and numbers;
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setItFileNo(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>GST File No. :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter GST File No."
                                                                value={gstFileNo}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.toUpperCase()
                                                                        .replace(/[^A-Z0-9]/g, "").slice(0, 10); // Allow only capital letters and numbers;
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setGSTFileNo(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Other File No. :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Other File No."
                                                                value={otherFileNo}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.toUpperCase()
                                                                        .replace(/[^A-Z0-9]/g, "").slice(0, 10); // Allow only capital letters and numbers;
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setOtherFileNo(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>
                                                                CIN No. :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Company Identification No."
                                                                value={CINNo}
                                                                onChange={(event) => {
                                                                    const input = event.target;
                                                                    const start = input.selectionStart;
                                                                    const end = input.selectionEnd;
                                                                    const inputValue = input.value.toUpperCase()
                                                                        .replace(/[^A-Z0-9]/g, "").slice(0, 25); // Allow only capital letters and numbers;
                                                                    input.value = inputValue
                                                                    input.setSelectionRange(start, end);
                                                                    setCINNo(inputValue);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Company Status :</label>
                                                            {console.log('companyStatus123123', companyStatus)}
                                                            <Select
                                                                options={companyStatusOptions}
                                                                // isMulti
                                                                isClearable={true}
                                                                value={companyStatusOptions.find(
                                                                    (option) => option.value == companyStatus
                                                                )}
                                                                placeholder="Select Company Status"
                                                                onChange={(select) => {
                                                                    setCompanyStatus(select ? select.value : "");
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>Resident Status :</label>
                                                            <Select
                                                                options={companyStatusOptions}
                                                                // isMulti
                                                                value={companyStatusOptions.find(
                                                                  (option) => option.value == residentStatus
                                                                )}
                                                                placeholder="Select Resident Status"
                                                                onChange={(select) => {
                                                                    setResidentStatus(select ? select.value : "");
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <div className="form-group">
                                                            <label>GST Filling Status :</label>
                                                            <Select
                                                                options={companyStatusOptions}
                                                                // isMulti
                                                                isClearable={true}
                                                                value={companyStatusOptions.find(
                                                                    (option) => option.value == gstFillingStatus
                                                                )}
                                                                placeholder="Select GSt Filling Status"
                                                                onChange={(select) => {
                                                                    setGSTFillingStatus(
                                                                        select ? select.value : ""
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Tab> */}
                      <TabPane
                        key="2"
                        tab="Address Details"
                        className="tabs-design"
                      >
                        <Row>
                          <Col lg={12}>
                            <div className="form-group">
                              <label>Address1 :</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Address1"
                                value={add1}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const formattedValue =
                                    capitalizeEachWord(input);
                                  setAdd1(formattedValue);
                                  // if (errors.add1) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, add1: null }));
                                  // }
                                }}
                              />
                              {/* {errors.add1 && <div className="error-message text-danger">{errors.add1}</div>} */}
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={12}>
                            <div className="form-group">
                              <label>Address2 :</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Address2"
                                value={add2}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const formattedValue =
                                    capitalizeEachWord(input);
                                  setAdd2(formattedValue);
                                  // if (errors.add2) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, add2: null }));
                                  // }
                                }}
                              />
                              {/* {errors.add2 && <div className="error-message text-danger">{errors.add2}</div>} */}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="form-group">
                              <label>Address3 :</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Address3"
                                value={add3}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const formattedValue =
                                    capitalizeEachWord(input);
                                  setAdd3(formattedValue);
                                  // if (errors.add3) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, add3: null }));
                                  // }
                                }}
                              />
                              {/* {errors.add3 && <div className="error-message text-danger">{errors.add3}</div>} */}
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane
                        key="3"
                        tab="Bank Details"
                        className="tabs-design"
                      >
                        <Row>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>IFSC Code :</label>
                              <div className="d-flex">
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
                                <div className="more-btn-icon">
                                  <FiMoreHorizontal
                                    onClick={() => setIfscCode(true)}
                                  />

                                  <IfscCodeNew
                                    show={ifsccode}
                                    onHide={() => setIfscCode(false)}
                                    fetchIFSCData={fetchIFSCData}
                                    // fetchIFSCData={fetchIFSCData}
                                  />
                                </div>
                              </div>
                              {/* {errors.IFSC && <div className="error-message text-danger">{errors.IFSC}</div>} */}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Bank Name :</label>
                              <input
                                type="text"
                                inputMode="text"
                                className="form-control"
                                placeholder="Bank Name"
                                value={bankName}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Branch Name :</label>
                              <input
                                type="text"
                                inputMode="text"
                                className="form-control"
                                placeholder="Branch Name"
                                value={branchName}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Account Number :</label>
                              <input
                                type="text"
                                inputMode="tel"
                                className="form-control"
                                placeholder="Enter Account No."
                                value={accountNo}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const numericInput = input.replace(/\D/g, "");
                                  const limitedInput = numericInput.slice(
                                    0,
                                    16
                                  );
                                  setAccountNo(limitedInput);
                                  // if (errors.accountNo) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, accountNo: '' }));
                                  // }
                                }}
                              />
                              {/* {errors.accountNo && <div className="error-message text-danger">{errors.accountNo}</div>} */}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6}>
                            <div className="form-group">
                              <label>Account Type :</label>
                              <Select
                                className="w-100"
                                options={accountTypeOptions}
                                value={
                                  accountType
                                    ? accountTypeOptions.find(
                                        (option) => option.value == accountType
                                      )
                                    : null
                                }
                                isClearable={true}
                                onChange={(selected) => {
                                  setAccountType(
                                    selected ? selected.value : ""
                                  );
                                  // if (errors.accountType) {
                                  //     setErrors(prevErrors => ({ ...prevErrors, accountType: '' }));
                                  // }
                                }}
                                placeholder="Choose Account Type"
                                // key={accountType}
                              />
                              {/* {errors.accountType && <div className="error-message text-danger">{errors.accountType}</div>} */}
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </Tabs>

                    {/* <div>
                                            <label>Status</label><br />
                                            <label className="radio-inline">
                                                <input type="radio" name="status" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                            <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Inactive</label>
                                        </div> */}
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
              </div>
            </div>
          </div>
          {/* /.content */}
        </div>
      </div>
    </div>
  );
};

export default PartyForm;
