import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { notification } from "antd";
import moment from "moment";

const RenewForm = ({ rowData, fetchData, onHide }) => {
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [custId, setCustId] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [usename, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [Id, setId] = useState("");
  const [Cguid, setCguid] = useState("");
  const [firmtype, setFirmType] = useState("");
  const [renewalOption, setRenewalOption] = useState(null);
  const today = new Date();
  const formattedDate = moment(today).format("yyyy-MM-DD");
  const [LicDate, setLicDate] = useState(formattedDate);
  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("CRMtoken");
  const [loading, setLoading] = useState(false);

  const [daysDifference, setDaysDifference] = useState(0);

  const [regid, setRegId] = useState("");
  const [packageid, setPackageId] = useState("");
  const [crm, setCrm] = useState("");
  const [officeman, setofficeman] = useState("");
  const [hrm, setHrm] = useState("");
  const [role, setRole] = useState("");
  const [ip, setip] = useState("");
  useEffect(() => {
    if (rowData) {
      setFname(rowData.FirstName);
      setLname(rowData.LastName);
      setCustId(rowData.CustId);
      setMobile(rowData.Mobile);
      setEmail(rowData.Email);
      setId(rowData.Id);
      setUsername(rowData.Username);
      setPass(rowData.Password);
      setCguid(rowData.Cguid);
      setRegId(rowData.RegTypeId);
      setPackageId(rowData.PackageId);
      setCrm(rowData.CRM);
      setofficeman(rowData.Officeman);
      setHrm(rowData.HRM);
      setRole(rowData.Role);
      setip(rowData.IPAddress);
      setFirmType(rowData.Name);
      const fromstartDate = rowData.LicenseDate;
      const formattedDatestart = moment(fromstartDate).format("yyyy-MM-DD");
      setLicDate(formattedDatestart);
    }
  }, [rowData]);

  const RenewOption = [
    { value: "3", label: "3 months" },
    { value: "6", label: "6 months" },
    { value: "12", label: "12 months" },
  ];

  // const handleRenewalChange = (selectedOption) => {
  //   setRenewalOption(selectedOption);

  //   // Assuming licDate is a Date object
  //   const newLicDate = new Date(LicDate);
  //   newLicDate.setMonth(
  //     newLicDate.getMonth() + parseInt(selectedOption.value, 10)
  //   );
  //   const fromstartDate = newLicDate;
  //   const formattedDatestart = moment(fromstartDate).format("yyyy-MM-DD");
  //   setLicDate(formattedDatestart);
  //   console.log(formattedDatestart, "newDateeee");
  // };

  const handleRenewalChange = (selectedOption) => {
    setRenewalOption(selectedOption);

    // Assuming licDate is a JavaScript Date object
    const currentDate = new Date();
    const newLicDate = new Date(currentDate);

    const daysInMonth = 28; // Considering 1 month as 28 days
    newLicDate.setDate(
      newLicDate.getDate() + parseInt(selectedOption.value, 10) * daysInMonth
    );
    let formated = newLicDate;
    const formatedDate = moment(formated).format("yyyy-MM-DD");
    setLicDate(formatedDate);

    const timeDifference = newLicDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    setDaysDifference(daysDifference);
  };

  const DataSubmit = async () => {
    try {
      const res = await axios.post(
        URL + "/api/Master/CreateUser",
        {
          Flag: "U",
          tokens: {
            Id: Id,
            RegTypeId: regid,
            PackageId: packageid,
            CRM: crm,
            Officeman: officeman,
            HRM: hrm,
            CustId: custId,
            FirstName: Fname,
            LastName: Lname,
            Mobile: mobile,
            Email: email,
            Username: usename,
            Password: pass,
            Role: role,
            IsActive: true,
            //   isDefault: true,
            Cguid: Cguid,
            IPAddress: ip,
            Name: firmtype,
            LicenseDate: LicDate,
            // DiffDate:daysDifference
          },
        },
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      if (res.data.Sucess == true) {
        fetchData();
        onHide();
        // getUserList()
        notification.success({
          message: "Updated Successfully",
          placement: "top",
          duration: 1,
        });
      }
    } catch (error) {}
  };

  return (
    <div>
      <div className="form-border">
        <section
          className="content-header model-close-btn "
          style={{ width: "100%" }}
        >
          <div className="form-heading">
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Renew License</h1>
              {/* <small>Bank List</small> */}
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
        <div className="">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="lobicard all_btn_card"
                id="lobicard-custom-control1"
                data-sortable="true"
              >
                <div className="col-sm-12">
                  <Row>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Customer Name : <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="text"
                          className="form-control"
                          placeholder="Bank Name"
                          value={Fname + " " + Lname}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>Customer ID:</label>
                        <input
                          type="text"
                          inputMode="text"
                          className="form-control"
                          value={custId}
                          disabled
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>Mobile No :</label>
                        <input
                          type="email"
                          inputMode="email"
                          className="form-control"
                          value={mobile}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Email ID :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          value={email}
                          className="form-control"
                          disabled
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          License Date :<span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={LicDate}
                          onChange={(event) => {
                            setLicDate(event.target.value);
                          }}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Renew License :<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            options={RenewOption}
                            value={renewalOption}
                            onChange={handleRenewalChange}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row></Row>

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
      </div>
    </div>
  );
};

export default RenewForm;
