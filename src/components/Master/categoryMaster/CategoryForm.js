import axios from "axios";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import * as Yup from "yup";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { FiMoreHorizontal } from "react-icons/fi";
import ProjectMaster from "../projectMaster/ProjectMaster";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
  CategoryName: Yup.string().required("Category Name is required"),
  selectedproject: Yup.string().required("Project Name is required"),
});
// Form validation Schema end

function ProjectNew(props) {
  const { getProjectData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {/* <Modal.Body> */}
      <ProjectMaster getProjectData={getProjectData} onHide={props.onHide} />
      {/* </Modal.Body> */}
    </Modal>
  );
}

const CategoryForm = ({ getCategoryData, onHide, rowData, fetchData }) => {
  const [CategoryName, setCategoryName] = useState("");
  const [isactive, setIsActive] = useState(true);
  const [categoryid, setCategoryid] = useState("");
  const [errors, setErrors] = useState({});
  const [projectlist, setProjectList] = useState([]);
  const [selectedproject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState(true);
  const [cguid, setCguid] = useState("");
  const [projectModal, setProjectModal] = useState(false);

  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("CRMtoken");
  const CompanyId = localStorage.getItem("CRMCompanyId");
  const UserID = localStorage.getItem("CRMUserId");
  const Username = localStorage.getItem("CRMUsername");
  const CustId = localStorage.getItem("CRMCustId");
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const uuid = uuidv4();
  const UUID = `${day}CC${month}-${uuid}-${CustId}`;

  useEffect(() => {
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
  }, [CategoryName, selectedproject, categoryid, billing]);
  useEffect(() => {
    if (rowData) {
      setCategoryName(rowData.CategoryName);
      setIsActive(rowData.IsActive);
      setCategoryid(rowData.Id);
      setSelectedProject(rowData.ProjectID);
      setBilling(rowData.AddBilling);
      setCguid(rowData.Cguid);
    }
  }, [rowData]);
  let ProjectID;
  const getProjectData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/ProjectList?CompanyId=${CompanyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setProjectList(res.data);
      ProjectID = res.data[0].Id;
      if (!rowData) {
        setSelectedProject(ProjectID);
      }
    } catch (error) {}
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
    getProjectData();
    fetchIPAddress();
  }, []);

  const ProjectOption = projectlist.map((display) => ({
    value: display.Id,
    label: display.ProjectName,
  }));

  const [categoryerror, setCategoryError] = useState("");
  const DataSubmit = async () => {
    try {
      await validationSchema.validate(
        {
          CategoryName,
          selectedproject,
        },
        { abortEarly: false }
      );
      setLoading(true);
      if (categoryid > 0) {
        const res = await axios.post(
          URL + "/api/Master/CreateCategory",
          {
            Id: categoryid,
            CategoryName: CategoryName,
            IsActive: isactive,
            CompanyID: CompanyId,
            AddBilling: billing,
            ProjectID: selectedproject,
            IPAddress: ipaddress,
            UserName: Username,
            UserId: UserID,
            Cguid: cguid,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          fetchData();
          onHide();
          if (getCategoryData) {
            getCategoryData();
          }
          notification.success({
            message: "Data Modified Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      } else {
        const res = await axios.post(
          URL + "/api/Master/CreateCategory",
          {
            ProjectID: selectedproject,
            CategoryName: CategoryName,
            IsActive: true,
            AddBilling: billing,
            CompanyID: CompanyId,
            IPAddress: ipaddress,
            UserName: Username,
            UserId: UserID,
            Cguid: UUID,
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          fetchData();
          onHide();
          if (getCategoryData) {
            getCategoryData();
          }
          notification.success({
            message: "Data Added Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      }
    } catch (error) {
      if (error.response) {
        setCategoryError(error.response.data.Message);
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

  return (
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
              <h1>Add Category</h1>
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
        <div className="">
          <div className="row">
            {/* Form controls */}
            <div className="col-sm-12">
              <div
                className="lobicard all_btn_card"
                id="lobicard-custom-control1"
              >
                <div className="col-sm-12">
                  <Row>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>
                          Project Name :<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <Select
                           className="w-100"
                            options={ProjectOption}
                            placeholder="Select Project Name"
                            isClearable={true}
                            value={ProjectOption.find(
                              (option) => option.value == selectedproject
                            )}
                            onChange={(selected) => {
                              setSelectedProject(
                                selected ? selected.value : ""
                              );
                              if (errors.selectedproject) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  selectedproject: "",
                                }));
                              }
                            }}
                          />
                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setProjectModal(true)}
                            />
                            <ProjectNew
                              show={projectModal}
                              onHide={() => setProjectModal(false)}
                              getProjectData={getProjectData}
                            />
                          </div>
                        </div>
                        {errors.selectedproject && (
                          <div className="error-message text-danger">
                            {errors.selectedproject}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group">
                    <label>
                      Category Name :<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Category Name"
                      required
                      value={CategoryName}
                      onChange={(e) => {
                        const input = e.target.value;
                        const firstCapital =
                          input.charAt(0).toUpperCase() + input.slice(1);
                        setCategoryName(firstCapital);
                        setCategoryError("");
                        if (errors.CategoryName) {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            CategoryName: "",
                          }));
                        }
                      }}
                    />
                    {errors.CategoryName && (
                      <div className="error-message text-danger">
                        {errors.CategoryName}
                      </div>
                    )}
                    {categoryerror ? (
                      <span className="text-danger">{categoryerror}</span>
                    ) : null}
                  </div>

                  {/* <div>
                                        <label>Status</label><br />
                                        <label className="radio-inline">
                                            <input type="radio" name="status" checked={isactive} onChange={() => { setIsActive(true) }} /> Active</label>
                                        <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Inactive</label>
                                    </div> */}
                  <div>
                    <label>Status</label>
                    <br />
                    <div className="billing-category">
                      <div>
                        <label className="radio-inline">
                          <input
                            type="radio"
                            name="status"
                            checked={isactive}
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
                            checked={!isactive}
                            onChange={() => {
                              setIsActive(false);
                            }}
                          />{" "}
                          Inactive
                        </label>
                      </div>
                      <div className="addbilling">
                        <label className="radio-inline">
                          <input
                            type="checkbox"
                            name="status"
                            checked={billing}
                            onChange={(event) => {
                              setBilling(event.target.checked);
                            }}
                          />{" "}
                          Add In Billing
                        </label>
                      </div>
                    </div>
                  </div>

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
  );
};

export default CategoryForm;
