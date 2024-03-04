import React, { useEffect, useState } from "react";
import "animate.css";
import Select from "react-select";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { notification } from "antd";
import { v4 as uuidv4 } from "uuid";
// import Modal from 'react-bootstrap/Modal';
// import { Button, Modal } from 'antd';
import { FiMoreHorizontal } from "react-icons/fi";
import * as Yup from "yup";
import moment from "moment";
// import PerfomaData from './PerfomaData';
import SalesTable from "./SalesTable";
// import { Modal } from 'antd';
import "../style/Style.css";
import Setting from "../Master/PerfomaMaster/Setting";
import { AiFillSetting } from "react-icons/ai";
// import { Button } from 'react-bootstrap';
import { Dropdown } from "primereact/dropdown";
import { useLocation } from "react-router-dom";
import "animate.css";
import PartyMaster from "../Master/PartyMaster/PartyMaster";
import { Drawer } from "antd";
import SalesPersonMaster from "../Master/SalesPersonMaster/SalesPersonMaster";

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
  partyName: Yup.string().required("Please Select Party Name"),
  // Add validation schema for other fields,
});
// Form validation Schema end
// function SettingModal(props) {
//   // const { fetchData } = props;
//   return (
//     <Modal
//       {...props}
//       size="xl"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//       backdrop="static"
//     >
//       <Setting
//       //  fetchData={fetchData}
//        onHide={props.onHide} />
//     </Modal>
//   );
// }
function SettingModal(props) {
  const { fetchSalesData, setting, fetchSettingData } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Setting
        fetchSalesData={fetchSalesData}
        setting={setting}
        fetchSettingData={fetchSettingData}
        onHide={props.onHide}
      />
    </Modal>
  );
}

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
      {/* <PartyForm getPartyData={getPartyData}  onHide={props.onHide} /> */}

      {/* </Modal.Body> */}
    </Modal>
  );
}
function SalesPersonNew(props) {
  const { getSalesPersonData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {/* <Modal.Body> */}
      <SalesPersonMaster
        getSalesPersonData={getSalesPersonData}
        onHide={props.onHide}
      />
      {/* </Modal.Body> */}
    </Modal>
  );
}

const SalesForm = ({
  rowData,
  fetchSalesData,
  onHide,
  selectedsalesdata,
  PINUMBER,
}) => {
  useEffect(() => {
    setPINumber(PINUMBER)
  }, [PINUMBER])
  const location = useLocation();
  const [partyList, setPartyList] = React.useState(false);
  const [piNumber, setPINumber] = useState(PINUMBER);
  const [partyData, setPartyData] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [crDays, setCRDays] = useState(0);
  const [remark, setRemark] = useState("");
  const [totalSubAmount, setTotalSubAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const TodayDate = new Date();
  const inputDate = TodayDate;
  const date = moment(inputDate);
  const formattedDate = date.format("yyyy-MM-DD");
  const [piData, setPIDate] = useState(formattedDate);
  const [dueDate, setDueDate] = useState(formattedDate);
  const [settingData, setSettingData] = useState([]);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState();
  const [addressshow, setAddressShow] = useState(true);
  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("CRMtoken");
  const companyId = localStorage.getItem("CRMCompanyId");
  const customerId = localStorage.getItem("CRMCustId");
  const userId = localStorage.getItem("CRMUserId");
  const username = localStorage.getItem("CRMUsername");
  const [ipaddress, setIpAddress] = useState("");

  const [setting, setSetting] = useState("");
  const [transno, setTransno] = useState("");
  const [guIDUpd, setGuidUPD] = useState("");
  const [datafromsales, setDatafromSales] = useState([]);
  //performa-data-get-start
  const [selectsales, setSelectSales] = useState(false);
  const [datafromsalesGUID, setDataFormSalesGUID] = useState("");
  const [salesfromid, setSalesFromId] = useState(-1);
  const [salesgetdatasales, setSalesGetDataSales] = useState([]);
  const [salesdata, setSalesData] = useState([]);
  const [salesmultiparty, setSalesMultiParty] = useState([]);
  const [multiselect, setMultiSelect] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [cbankid, setCBankId] = useState("");
  const [insertrecord, setInsertRecord] = useState(1);
  // end
  const [salesId, setSalesId] = useState(-1);
  const [rowdelete, setrowdelete] = useState(-1);
  const [salesPersonList, setSalesPersonList] = useState([]);
  const [salesPerson, setSalesPerson] = useState("");
  const [salesPersonModal, setSalesPersonModal] = React.useState(false);
  let PartyID;

  const getSalesData = async (partyName) => {
    try {
      const res = await axios.get(
        URL +
        `/api/Transation/GetTransationList?CompanyID=${companyId}&TransMode=Proforma`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setSalesData(res.data);
      const PartyIdFilter = res.data;
      const PartyFilterData = PartyIdFilter.filter(
        (item) => item.PartyId == partyName
      );
      if (PartyFilterData.length > 1) {
        if (!rowData) {
          setSalesGetDataSales([]);
        }
        setSalesMultiParty(PartyFilterData);
        setMultiSelect(true);
      } else {
        setMultiSelect(true);
        setSalesMultiParty(PartyFilterData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filterMultiPartyData = salesmultiparty.map((display) => ({
    value: display.CGuid + "," + display.Id,
    label: display.Prefix + display.TranNo,
  }));
  useEffect(() => {
    if (selectsales == true) {
      getSalesData(partyName);
    } else {
      if (!rowData) {
        setSalesGetDataSales([]);
      }
    }
  }, [selectsales, partyName]);
  const getSalesById = async (salesfromid, datafromsalesGUID) => {
    try {
      const res = await axios.get(
        URL +
        `/api/Transation/GetTransationListById1?CompanyID=${companyId}&TransMode=Proforma&Id=${salesfromid}&CGUID=${datafromsalesGUID}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setSalesGetDataSales(res.data.StockDetail);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectsales == true) {
      if (datafromsalesGUID) {
        getSalesById(salesfromid, datafromsalesGUID);
      }
    } else {
      if (!rowData) {
        setSalesGetDataSales([]);
        setDataFormSalesGUID("");
      }
    }
  }, [datafromsalesGUID, selectsales]);

  useEffect(() => {
    if (rowData) {
      setPartyName(rowData.PartyId);
      setRemark(rowData.Remark);
      const Duedate = moment(rowData.DueDate);
      const formattedueDate = Duedate.format("yyyy-MM-DD");
      setDueDate(formattedueDate);
      setSetting(rowData.Prefix);
      setCRDays(rowData.CreditDay);
      setTotalSubAmount(rowData.SubTotal);
      setNetAmount(rowData.NetAmount);
      setTransno(rowData.TranNo);
      setGuidUPD(rowData.CGuid);
      setSalesId(rowData.Id);
      const Pidate = moment(rowData.TransDate);
      const formattePiDate = Pidate.format("yyyy-MM-DD");
      setPIDate(formattePiDate);
      setPINumber(rowData.TranNo);
      setAddressShow(false);
      addressDisplay(rowData.PartyId);
      setSalesPerson(rowData.SalespersonId);
    }
  }, [rowData]);

  const fetchIPAddress = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json", {});
      // console.log(res.data.ip, "res-resresres")
      setIpAddress(res.data.ip);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchIPAddress();
  }, []);
  const addressDisplay = async (partyName) => {
    let partyData;
    try {
      const res = await axios.get(
        URL +
        `/api/Master/PartyList?CustId=${customerId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      partyData = res.data;
    } catch (error) {
      console.log(error);
    }
    const partyAddress = partyData.find((item) => item.PartyId == partyName);
    if (partyAddress) {
      setAddress(
        partyAddress.Add1 +
        "," +
        partyAddress.Add2 +
        "," +
        partyAddress.Add3 +
        "," +
        partyAddress.CityName +
        "," +
        partyAddress.StateName +
        "," +
        partyAddress.Code
      );
    }
  };
  const handledataFromSales = (salesdata) => {
    setDatafromSales(salesdata);
    setInsertRecord(insertrecord + 1);
  };

  let updatedData;
  let salesItemInsert;
  const SalesGuid = (guid) => {
    if (datafromsales.length != 0) {
      if (selectedsalesdata) {
        const purchaseId = selectedsalesdata.map((item) => item.TransID);
        if (rowdelete >= 0) {
          updatedData = datafromsales;
        } else {
          const newData = datafromsales.map((obj) => {
            const { TransID, ...rest } = obj;
            return rest;
          });
          // console.log(newData, "newData")

          updatedData = newData.map((item, index) => ({
            ...item,
            // ["TransID"]: purchaseId[index],
            ["CGUID"]: guIDUpd,
            ["TransMode"]: "Sales",
            ["UserID"]: userId,
            ["UserName"]: username,
            ["EntryTime"]: new Date(),
            ["InQnty"]: 0,
            ["OutQnty"]: item.Qnty,
          }));
        }
      } else {
        updatedData = datafromsales.map((item) => ({
          ...item,
          ["CGUID"]: guid,
          ["TransMode"]: "Sales",
          ["UserID"]: userId,
          ["UserName"]: username,
          ["EntryTime"]: new Date(),
          ["InQnty"]: 0,
          ["OutQnty"]: item.Qnty,
        }));
      }
    } else {
      if (rowdelete >= 0) {
      } else {
        updatedData = selectedsalesdata;
      }
    }
    salesItemInsert = updatedData;
  };
  useEffect(() => {
    const inputDate = piData;
    if (!isNaN(crDays)) {
      const calculatedDate = new Date(inputDate);
      calculatedDate.setDate(calculatedDate.getDate() + crDays);
      const DateConvert = calculatedDate;
      const day = DateConvert.getDate().toString().padStart(2, "0");
      const month = (DateConvert.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are 0-indexed
      const year = DateConvert.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      setDueDate(formattedDate);
    } else {
      // Handle the case where crDays is NaN (e.g., clear the dueDate)
      setDueDate("");
    }
  }, [crDays, piData]);

  const handleTableDataChange = (
    totalQuantity,
    totalAmount,
    totalDiscAmount,
    totalGrossAmount,
    totalTaxAmount,
    totalNetAmount
  ) => {
    setTotalQuantity(totalQuantity);
    setTotalSubAmount(totalGrossAmount.toFixed(2));
    setTotalTaxAmount(totalTaxAmount.toFixed(2));
    setNetAmount(totalNetAmount.toFixed(2));
  };
  const handleDeleteRow = (deleterow) => {
    setrowdelete(deleterow);
  };
  const handleSinglePrint = (GUID) => {
    const url = `https://report.taxfile.co.in/Report/TransactionReport?CompanyID=${companyId}&CGuid=/${GUID}/&ReportMode=Sales`;
    const windowName = "myWindow";
    const windowSize = "width=1500,height=900";
    setResult(window.open(url, windowName, windowSize));
  };
  let error;
  const [errordisplay, setErrorDisplay] = useState([]);

  const DataSubmit = async () => {
    const generateRandomCharacter = (characters) => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      return characters[randomIndex];
    };
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const section1 = Array.from({ length: 8 }, () =>
      generateRandomCharacter(characters)
    );
    const section2 = Array.from({ length: 8 }, () =>
      generateRandomCharacter(characters)
    );
    const section3 = Array.from({ length: 8 }, () =>
      generateRandomCharacter(characters)
    );
    const guid = `${section1.join("")}-${section2.join("")}-${section3.join(
      ""
    )}`;

    SalesGuid(guid);
    try {
      await validationSchema.validate(
        {
          partyName,
        },
        { abortEarly: false }
      );
      setLoading(true);
      if (salesId >= 0) {
        const res = await axios.post(
          URL + "/api/Transation/CreateTransation",
          {
            Flag: "U",
            TransationMast: {
              // Id:proformaId,
              CompanyID: companyId,
              CGuid: guIDUpd,
              TranNo: piNumber,
              Prefix: setting,
              TransDate: piData,
              TransMode: "Sales",
              PartyId: partyName,
              CreditDay: crDays,
              DueDate: dueDate,
              Remark: remark,
              TotalQty: totalQuantity,
              SubTotal: totalSubAmount,
              TotalTax: totalTaxAmount,
              NetAmount: netAmount,
              PaymentAmt: netAmount,
              ReceiptAmt: "0",
              UserID: userId,
              UserName: username,
              EntryTime: new Date(),
              CBankId: cbankid,
              IPAddress: ipaddress,
              UserName: username,
              SalespersonId: salesPerson,
            },
            StockDetail: salesItemInsert,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          const GUID = res.data.TransationMast.CGuid;
          fetchSalesData();
          onHide();
          handleSinglePrint(GUID);
          notification.success({
            message: "Data Modified Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        } else if (res.data.Errors) {
          setErrorDisplay(res.data.Errors);
        }
      } else {
        const res = await axios.post(
          URL + "/api/Transation/CreateTransation",
          {
            Flag: "A",
            TransationMast: {
              CompanyID: companyId,
              CGuid: guid,
              TranNo: piNumber,
              Prefix: setting,
              TransDate: piData,
              TransMode: "Sales",
              PartyId: partyName,
              CreditDay: crDays,
              DueDate: dueDate,
              Remark: remark,
              TotalQty: totalQuantity,
              SubTotal: totalSubAmount,
              TotalTax: totalTaxAmount,
              NetAmount: netAmount,
              // IPAddress: null,
              UserID: userId,
              UserName: username,
              PaymentAmt: netAmount,
              ReceiptAmt: "0",
              EntryTime: new Date(),
              CBankId: cbankid,
              IPAddress: ipaddress,
              UserName: username,
              SalespersonId: salesPerson,
            },
            StockDetail: salesItemInsert,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          const GUID = res.data.TransationMast.CGuid;
          fetchSalesData();
          onHide();
          handleSinglePrint(GUID);
          notification.success({
            message: "Data Added Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        } else if (res.data.Errors) {
          setErrorDisplay(res.data.Errors);
        }
      }
    } catch (error) {
      console.log(error, "error");
      const validationErrors = {};
      if (error.response && error.response.status == 500) {
        notification.error({
          message: "Please Enter One Record In Table !!!",
          placement: "bottomRight", // You can adjust the placement
          duration: 2, // Adjust the duration as needed
        });
      }
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
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onHide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onHide]);

  const getPartyData = async () => {
    try {
      const res = await axios.get(
        URL +
        `/api/Master/PartyListDropdown?CustId=${customerId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setPartyData(res.data);
      // PartyID = res.data[0].PartyId
      // if (!rowData) {
      //   setPartyName(PartyID)
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesPersonData = async () => {
    try {
      const res = await axios.get(
        URL +
        `/api/Master/SalesPersonList?CustId=${customerId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      // console.log(res.data, "getSalesPersonData")
      setSalesPersonList(res.data);
      // PartyID = res.data[0].PartyId
      // if (!rowData) {
      //   setPartyName(PartyID)
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    getPartyData();
    getSalesPersonData();
  }, []);

  const filterSalesPersonName = salesPersonList.map((display) => ({
    value: display.SalespersonId,
    label: display.SalesPersonName,
  }));
  const filterPartyName = partyData.map((display) => ({
    value: display.PartyId,
    label: display.PartyName,
  }));
  const fetchSettingData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/SettingList?CompanyId=${companyId}&TransMode=Sales`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setSettingData(res.data);
      if (!rowData) {
        setSetting(res.data[0].Prefix);
      }
      setCBankId(res.data[0].CBankId);
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    fetchSettingData();
  }, []);

  const [partygetdataadress, setPartyGetDataAdd] = useState([]);
  const PartyRecordGetData = async () => {
    try {
      const res = await axios.get(
        URL +
        `/api/Master/PartyList?CustId=${customerId}&CompanyId=${companyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setPartyGetDataAdd(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useState(() => {
    getPartyData();
    fetchSettingData();
    PartyRecordGetData();
  }, []);
  useEffect(() => {
    if (partyName) {
      if (addressshow == true) {
        const partyAddress = partygetdataadress.find(
          (item) => item.PartyId == partyName
        );
        if (partyAddress) {
          if (
            partyAddress.Add1 ||
            partyAddress.Add2 ||
            partyAddress.Add3 ||
            partyAddress.CityName ||
            partyAddress.StateName ||
            partyAddress.Code
          ) {
            setAddress(
              partyAddress.Add1 +
                "," +
                partyAddress.Add2 +
                "," +
                partyAddress.Add3 +
                " " +
                (partyAddress.CityName ? partyAddress.CityName : "") +
                " " +
                (partyAddress.StateName ? partyAddress.StateName : "") +
                " " +
                (partyAddress.Code ? partyAddress.Code : "")
            );
          }
        }
      }
    }
  }, [partyName]);

  useEffect(() => {
    if (partyList == false) {
      const handleKeyDown = (event) => {
        if (event.key === "F9") {
          event.preventDefault();
          DataSubmit();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    salesId,
    partyName,
    insertrecord,
    piData,
    crDays,
    dueDate,
    remark,
    errordisplay,
    partyList,
  ]);

  return (
    <div>
      <div className="form-border">
        <div className="mt-3">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="lobicard all_btn_card"
                id="lobicard-custom-control1"
                data-sortable="true"
              >
                <div className="col-sm-12">
                  <Row>
                    <Col lg={4}>
                      <div className="form-group">
                        <label>
                          Party Name :<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex w-100">
                          <Select
                            className="w-100"
                            options={filterPartyName}
                            isClearable={true}
                            value={filterPartyName.find(
                              (option) => option.value == partyName
                            )}
                            onChange={(selected) => {
                              setPartyName(selected ? selected.value : "");
                              setAddressShow(true);
                              if (errors.partyName) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  partyName: "",
                                }));
                              }
                            }}
                            placeholder="Select Party"
                          />
                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setPartyList(true)}
                            />
                            <PartyNew
                              show={partyList}
                              onHide={() => setPartyList(false)}
                              getPartyData={getPartyData}
                            />
                          </div>
                          {location.pathname == "/sales" && !rowData ? (
                            <div className="proformaData-checkbox">
                              <input
                                type="checkbox"
                                id="proformadata"
                                name="proformadata"
                                onChange={(event) => {
                                  setSelectSales(event.target.checked);
                                }}
                              />
                              <label
                                className="pl-2  heading-proforma"
                                for="proformadata"
                              >
                                Proforma
                              </label>
                            </div>
                          ) : null}
                        </div>
                        {errors.partyName && (
                          <div className="error-message text-danger">
                            {errors.partyName}
                          </div>
                        )}
                      </div>
                      {location.pathname === "/sales" ? (
                        selectsales && multiselect ? (
                          <div className="form-group">
                            <label>
                              Proforma Bill No. :
                              <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex w-100">
                              <Select
                                className="w-100"
                                options={filterMultiPartyData}
                                onChange={(selected) => {
                                  const spliteGuid = selected.value;
                                  const spliteGUIDConvert =
                                    spliteGuid.split(",");
                                  const spliteGUID = spliteGUIDConvert[0];
                                  const spliteID = spliteGUIDConvert[1];
                                  setDataFormSalesGUID(spliteGUID);
                                  setSalesFromId(spliteID);
                                }}
                                placeholder="Select Bill No"
                              />
                            </div>
                          </div>
                        ) : null
                      ) : null}
                      <div className="form-group">
                        <label>Address :</label>
                        <textarea
                          className="form-control"
                          placeholder="Party Address"
                          rows="3"
                          value={partyName ? address : ""}
                          disabled
                          onChange={(event) => {
                            setBillingAddress(event.target.value);
                            // if (errors.compAddress) {
                            //     setErrors(prevErrors => ({ ...prevErrors, compAddress: '' }));
                            // }
                          }}
                        />
                        {/* {errors.compAddress && <div className="error-message text-danger">{errors.compAddress}</div>} */}
                      </div>
                    </Col>
                    <Col lg={6} className="ml-auto">
                      <Row>
                        <Col lg={6}>
                          <div className="form-group align_Form w-100">
                            <div className="w-100 label_align ">
                              <label>INV Number :</label>
                            </div>
                            <div className="w-50 m-1">
                              <input
                                type="text"
                                inputMode="tel"
                                className="form-control"
                                disabled
                                placeholder="Enter Sales Invoice No."
                                value={setting}
                                maxLength={3}
                                onChange={(event) => {
                                  setSetting(event.target.value);
                                }}
                              />
                            </div>
                            <div className="w-50 m-1">
                              <input
                                type="text"
                                className="form-control"
                                disabled
                                placeholder="Enter Sales Invoice No."
                                value={piNumber}
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const numericInput = input.replace(/\D/g, "");
                                  const limitedInput = numericInput.slice(
                                    0,
                                    5
                                  );
                                  setPINumber(limitedInput);
                                }}
                              />
                            </div>
                          </div>
                          <div className="form-group align_Form w-100">
                            <div className="w-50 label_align ">
                              <label>Date :</label>
                            </div>
                            <div className="w-50">
                              <input
                                type="date"
                                inputMode="date"
                                className="form-control"
                                placeholder="Select Date"
                                value={piData}
                                onChange={(event) => {
                                  setPIDate(event.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group align_Form w-100">
                            <div className="w-50 label_align">
                              <label>Credit Days :</label>
                            </div>
                            <div className="w-50 m-1">
                              <input
                                className="form-control"
                                type="text"
                                value={crDays}
                                onChange={(e) => {
                                  // Handle non-numeric input for crDays
                                  const value = parseInt(e.target.value, 10);
                                  setCRDays(isNaN(value) ? 0 : value);
                                }}
                                placeholder="Enter crDays"
                              />
                            </div>
                          </div>
                          <div className="form-group align_Form w-100">
                            <div className="w-50 label_align">
                              <label>Due Date :</label>
                            </div>
                            <div className="w-50">
                              <input
                                type="date"
                                inputMode="date"
                                className="form-control"
                                placeholder="Select Due Date"
                                value={dueDate}
                                onChange={(event) => {
                                  setDueDate(event.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        {/* <Col lg={6}> */}
                          <div className="form-group align_Form w-100">
                            <div className="ww-50 label_align">
                              <label>Sales Person Name :</label>
                            </div>
                            <div className="w-100 m-1">
                              <div className="d-flex w-100">
                                <Select
                                  className="w-100"
                                  options={filterSalesPersonName}
                                  isClearable={true}
                                  value={filterSalesPersonName.find(
                                    (option) => option.value == salesPerson
                                  )}
                                  onChange={(selected) => {
                                    setSalesPerson(
                                      selected ? selected.value : ""
                                    );
                                  }}
                                  placeholder="Select Sales Person"
                                />
                                <div className="more-btn-icon">
                                  <FiMoreHorizontal
                                    onClick={() => setSalesPersonModal(true)}
                                  />
                                  <SalesPersonNew
                                    show={salesPersonModal}
                                    onHide={() => setSalesPersonModal(false)}
                                    getSalesPersonData={getSalesPersonData}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        {/* </Col> */}
                      </Row>
                    </Col>
                    {/* <Row>
                      <Col lg={4}>
                        <div className="form-group">
                          <label>Sales Person Name</label>
                          <div className="d-flex w-100">
                            <Select
                              className="w-100"
                              options={filterSalesPersonName}
                              isClearable={true}
                              value={filterSalesPersonName.find(
                                (option) => option.value == salesPerson
                              )}
                              onChange={(selected) => {
                                setSalesPerson(selected ? selected.value : "");
                              }}
                              placeholder="Select Sales Person"
                            />
                          </div>
                        </div>
                      </Col>
                    </Row> */}
                  </Row>
                  <div>
                    <SalesTable
                      onDataChange={handleTableDataChange}
                      onDataUpdate={handledataFromSales}
                      selectedsalesdata={selectedsalesdata}
                      ondeleteRow={handleDeleteRow}
                      salesgetdatasales={salesgetdatasales}
                      selectsales={selectsales}
                      partyName={partyName}
                    />
                  </div>

                  <Row>
                    <Col lg={4}>
                      <div className="form-group">
                        <label>Remark :</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter Remark"
                          value={remark}
                          onChange={(event) => {
                            setRemark(event.target.value);
                          }}
                        />
                        <table>
                          {errordisplay.map((item) => {
                            return (
                              <tr>
                                <td className="text-danger">
                                  {item.ErrorName}
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                      </div>
                    </Col>
                    <Col lg={4} className="ml-auto">
                      <div className="form-group align_Form w-100">
                        <div className="w-50 label_align">
                          <label>Total Quantity :</label>
                        </div>
                        <div className="w-50">
                          <input
                            type="text"
                            inputMode="tel"
                            className="form-control"
                            value={totalQuantity}
                            placeholder=""
                            disabled
                          />
                        </div>
                      </div>

                      <div className="form-group align_Form w-100">
                        <div className="w-50 label_align">
                          <label>Total Sub-Amount :</label>
                        </div>
                        <div className="w-50">
                          <input
                            type="text"
                            inputMode="tel"
                            className="form-control"
                            value={totalSubAmount}
                            placeholder=""
                            disabled
                          />
                        </div>
                      </div>

                      <div className="form-group align_Form w-100">
                        <div className="w-50 label_align">
                          <label>Total Tax Amount :</label>
                        </div>
                        <div className="w-50">
                          <input
                            type="text"
                            inputMode="tel"
                            className="form-control"
                            value={totalTaxAmount}
                            placeholder=""
                            disabled
                          />
                        </div>
                      </div>

                      <div className="form-group align_Form">
                        <div className="w-50 label_align">
                          <label>Net Amount :</label>
                        </div>
                        <div className="w-50">
                          <input
                            type="text"
                            inputMode="tel"
                            className="form-control"
                            value={netAmount}
                            placeholder=""
                            disabled
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="reset-button ">
                    <button
                      className="btn btn-success m-2"
                      onClick={DataSubmit}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save[F9]"}
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
      </div>
    </div>
  );
};

export default SalesForm;
