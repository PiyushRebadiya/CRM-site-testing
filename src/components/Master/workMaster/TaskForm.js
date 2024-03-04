import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { notification } from "antd";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import { FiMoreHorizontal } from "react-icons/fi";
import CategoryMaster from "../categoryMaster/CategoryMaster";
import TaxAdminMaster from "../taxadmin/TaxAdminMaster";
import PartyMaster from "../PartyMaster/PartyMaster";
import ProjectMaster from "../projectMaster/ProjectMaster";
import { Button } from "react-bootstrap";
import { GrPowerReset } from "react-icons/gr";
import ProcessMaster from "../ProcessMaster/ProcessMaster";
import { Space, Tooltip } from "antd";

// Form validation Schema start
const validationSchema = Yup.object().shape({
  projectname: Yup.string().required("Please select Project name"),
  TaskName: Yup.string().required("Task Name is required"),
  assignBy: Yup.string().required("Please select by whom the task is assigned"),

  assignTo: Yup.string()
    .min(1, "Please select whom you want to assign the task")
    .required("Please select whom you want to assign the task"),
  // priority: Yup.string().required("Please select task priority"),
  category: Yup.string().required("Please select Category"),
  taxadmin: Yup.string().required("Please select Sub-Category"),
  // formdate: Yup.string().required("Please select Starting date of task"),
  todate: Yup.string().required("Please select Ending date of task"),
  taskStatus: Yup.string().required("Task status is required"),
  remark1: Yup.string().when("taskStatus", {
    is: (taskStatus) => taskStatus === "Hold" || taskStatus === "Cancel",
    then: () =>
      Yup.string().required(
        "Remark1 is required when task status is Hold or Cancel"
      ),
    otherwise: () => Yup.string(),
  }),
  // party: Yup.string().required("Please select Party"),
  // Add validation schema for other fields,
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
function ProcessNew(props) {
  const { getProcessData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {/* <Modal.Body> */}
      <ProcessMaster getProcessData={getProcessData} onHide={props.onHide} />
      {/* </Modal.Body> */}
    </Modal>
  );
}
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

function SubCategoryNew(props) {
  const { getTaxadmindata } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      {/* <Modal.Body> */}
      <TaxAdminMaster getTaxadmindata={getTaxadmindata} onHide={props.onHide} />
      {/* </Modal.Body> */}
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
      {/* </Modal.Body> */}
    </Modal>
  );
}

function TaskForm({
  onHide,
  rowData,
  fetchData,
  fetchCalenderData,
  fetchAssignByMeData,
  insertChartData,
  fetchCompleteTaskData,
  fetchReportData,
  fetchAssignByChart,
  AsignByfetch,
  TaskData,
  AssignByMeTaskData,
}) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [subCategoryModal, setsubCategoryModal] = useState(false);
  const [partyModal, setPartyModal] = useState(false);
  const [processModal, setProcessModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [projectname, setProjectname] = useState();
  const [TaskName, setTaskName] = useState("");
  const [partyData, setPartyData] = useState([]);
  const [party, setParty] = useState("");
  const [assignBy, setAssignBy] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [priority, setPriority] = useState("High");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [category, setCategory] = useState("");
  const [taxadmin, setTaxadmin] = useState("");
  const [getprojectdata, setGetProjectData] = useState([]);
  const [getuserdata, setGetuserData] = useState([]);
  const [getcategorydata, setGetcategorydata] = useState([]);
  const [gettaxadmindata, setGettaxadmindata] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [errors, setErrors] = useState({});
  const [remark1, setRemark1] = useState("");
  const [remark2, setRemark2] = useState("");
  const [remark3, setRemark3] = useState("");
  const toDayDate = new Date();
  const formattedDateToDay = moment(toDayDate).format("yyyy-MM-DD");
  const [formdate, setFormDate] = useState(formattedDateToDay);
  const formattedDateToDate = moment(toDayDate).format("yyyy-MM-DD");
  const [todate, setToDate] = useState(formattedDateToDate);
  const [taskid, setTaskId] = useState(-1);
  const [userasign, setUserAsign] = useState("");
  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("CRMtoken");
  const custId = localStorage.getItem("CRMCustId");
  const userid = localStorage.getItem("CRMUserId");
  const userName = localStorage.getItem("CRMUsername");
  const CompnyId = localStorage.getItem("CRMCompanyId");
  const role = localStorage.getItem("CRMRole");
  const [isSubCategorySelected, setIsSubCategorySelected] = useState(false);
  const [getassignuserdata, setGetAssignuserData] = useState([]);
  const [cguid, setCguid] = useState("");
  const [checkRemarks, setCheckRemarks] = useState(false);
  const [ticketno, setTicketNo] = useState("");
  const [Prefix, setPrefix] = useState("T");
  const [loading, setLoading] = useState(false);
  const [processlist, setProcessList] = useState([]);
  const [selectedprocess, setSelectedProcess] = useState("");
  const [remarkError, setRemarkError] = useState("Add Remark");
  const [ipaddress, setIpAddress] = useState("");
  const [responsible, setResponsible] = useState(formattedDateToDay);
  const [yearList, setYearList] = useState([]);
  const yearSelected = JSON.parse(localStorage.getItem("CRMYear"));
  const [selectedYear, setSelectedYear] = useState(yearSelected.YearName);
  const [feeschecked, setFeesChecked] = useState(false);
  const [totalfees, setTotalFees] = useState("");
  const [advanceFees, setAdvanceFees] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [partyOptionsFilterText, setPartyOptionsFilterText] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [process1, setProcess1] = useState("");
  const [assetmentList, setAssetmentList] = useState([]);
  const [assetmentYear, setAssetmentYear] = useState("");
  const [financialYearID, setFinancialYearID] = useState("");

  let ProjectID;
  let firstUserSelected;

  const toggleRemarks = () => {
    setCheckRemarks(!checkRemarks);
  };

  useEffect(() => {
    if (taskStatus == "Hold" || taskStatus == "Cancel") {
      setCheckRemarks(true);
    } else {
      setCheckRemarks(false);
    }
  }, [taskStatus]);

  useEffect(() => {
    if (feeschecked == false) {
      setTotalFees("");
      setAdvanceFees("");
    }
  }, [feeschecked]);
  useEffect(() => {
    if (rowData) {
      setAssignTo(rowData.AssignTo);
      setProjectname(rowData.ProjectId);
      setParty(rowData.PartyId);
      setTaskName(rowData.TaskName);
      setAssignBy(rowData.AssignBy);
      setPriority(rowData.Priority);
      setTaskStatus(rowData.TaskStatus);
      setCategory(rowData.CategoryId);
      setTaxadmin(rowData.TaxadminId);
      const fromDayDate = rowData.FromDate;
      const formattedDatefrom = moment(fromDayDate).format("yyyy-MM-DD");
      setFormDate(formattedDatefrom);
      const toDayDate = rowData.ToDate;
      const formattedDatetodate = moment(toDayDate).format("yyyy-MM-DD");
      setToDate(formattedDatetodate);
      setRemark1(rowData.Remark1);
      setRemark2(rowData.Remark2);
      setRemark3(rowData.Remark3);
      setTaskId(rowData.Id);
      setCguid(rowData.Cguid);
      setTicketNo(rowData.TicketNo);
      setPrefix(rowData.Prefix);
      setSelectedProcess(rowData.ProcessId);

      setResponsible(moment(rowData.ResponsibleDate).format("yyyy-MM-DD"));
      setSelectedYear(rowData.Year);
      setFeesChecked(rowData.FeesEligible);
      setTotalFees(rowData.TotalFees);
      setAdvanceFees(rowData.AdvanceFees);
      setTransferTo(rowData.TransferTo);
      setProcess1(rowData.ProcessId2);
      setAssetmentYear(rowData.AY);

      if (rowData.TaskStatus == "Hold" || rowData.TaskStatus == "Cancel") {
        setRemarkError("");
      }
    }
  }, [rowData]);

  const resetForm = () => {
    setAssignTo("");
    setProjectname("");
    setParty(null);
    setTaskName("");
    setAssignBy("");
    setPriority(null);
    setTaskStatus(null);
    setCategory("");
    setTaxadmin(null);
    setRemark1("");
    setRemark2("");
    setRemark3("");
    setSelectedProcess("");
  };
  const getProjectData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/ProjectList?CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setGetProjectData(res.data);
      ProjectID = res.data[0].Id;
      if (!rowData) {
        setProjectname(ProjectID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTicketNo = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/GetTaskAddonList?CompanyID=${CompnyId}&Type=Task`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setTicketNo(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProjectData();
    if (!rowData) {
      getTicketNo();
    }
  }, []);
  //party selected fillter project

  const checkGetProjectData = getprojectdata?.find((item) =>
    selectedProject?.includes(item?.Id)
  );

  const projectOptions = selectedProject
    ? checkGetProjectData
      ? getprojectdata
          ?.filter((item) => selectedProject?.includes(item?.Id))
          .map((display) => ({
            value: display.Id,
            label: display.ProjectName,
          }))
      : getprojectdata?.map((display) => ({
          value: display.Id,
          label: display.ProjectName,
        }))
    : getprojectdata?.map((display) => ({
        value: display.Id,
        label: display.ProjectName,
      }));

  const getCategoryData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/CategoryList?CompanyID=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setGetcategorydata(res.data);
    } catch (error) {
      // Handle error
    }
  };
  const getTaxadmindata = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/TaxadminList?CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setGettaxadmindata(res.data);
    } catch (error) {
      // Handle error
    }
  };
  const handleCategoryChange = (selected) => {
    setCategory(selected ? selected.value : "");
    // setIsSubCategorySelected(false); // Allow changes to Sub-Category
    if (errors.category) {
      setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
    }
  };
  const handleSubCategoryChange = (selected) => {
    setTaxadmin(selected ? selected.value : "");
    setIsSubCategorySelected(true); // Sub-Category is now selected
    if (errors.taxadmin) {
      setErrors((prevErrors) => ({ ...prevErrors, taxadmin: "" }));
    }
  };

  // Update taxadminOptions based on the selected category
  const subfilter = gettaxadmindata.filter(
    (display) => display.CategoryId === category
  );
  const activeSubCategory = subfilter.filter(
    (display) => display.IsActive === true
  );
  const taxadminOptions = activeSubCategory.map((display) => ({
    value: display.Id,
    label: display.Heading,
  }));

  const categoryFilter = getcategorydata.filter(
    (display) => display.ProjectID == projectname || display.ProjectID == 0
  );
  const activeCategory = categoryFilter.filter(
    (display) => display.IsActive === true
  );
  const categoryOptions = activeCategory.map((display) => ({
    value: display.Id,
    label: display.CategoryName,
  }));
  const getPartyData = async () => {
    try {
      const res = await axios.get(
        URL +
          `/api/Master/PartyListDropdown?CustId=${custId}&CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setPartyData(res.data);
    } catch (error) {
      // Handle error
    }
  };

  const partyOptions = partyData.map((display) => ({
    ...display,
    value: display.PartyId,
    label: display.PartyName,
    // label: (
    //     <div>
    //         <div>{display.PartyName}<span style={{ fontSize: "10px", color: "grey" }}>{display.LegelName && (`(${display.LegelName})`)}</span></div>
    //     </div>
    // ),
  }));

  const getassigndata = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/UsermstList`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setGetAssignuserData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setGetuserData(res.data);
      firstUserSelected = res.data[0].Id;
      if (!rowData) {
        setAssignBy(firstUserSelected);
      }
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
  const getProcessData = async () => {
    try {
      const res = await axios.get(
        URL + `/api/Master/ProcessList?CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      setProcessList(res.data);
    } catch (error) {
      console.log(error, "error");
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
  const getYearList = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/YearList", {
        headers: { Authorization: `bearer ${token}` },
      });
      setYearList(res.data);
    } catch (error) {}
  };
  const getAssetmentYearList = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/AYList", {
        headers: { Authorization: `bearer ${token}` },
      });
      setAssetmentList(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedYear) {
      const financial_year = yearList?.filter(
        (display) => display.YearName === selectedYear
      );
      setFinancialYearID(financial_year[0]?.YearId);
    }
  }, [selectedYear, yearList]);
  useEffect(() => {
    if (selectedYear) {
      const asset_year = assetmentList?.filter(
        (display) => display.FYearId === financialYearID
      );
      setAssetmentYear(asset_year[0]?.YearName);
    }
  }, [selectedYear, financialYearID, assetmentList]);

  useEffect(() => {
    getYearList();
    getUserData();
    getassigndata();
    getTaxadmindata();
    getPartyData();
    getCategoryData();
    // getProjectData()
    fetchMasterData();
    getProcessData();
    fetchIPAddress();
    getAssetmentYearList();
  }, []);

  const options = masterData.filter((display) => display.Remark === "Priority");
  const PriorityOptions = options.map((display) => ({
    value: display.Description,
    label: display.Description,
  }));

  const taskoptions = masterData.filter(
    (display) => display.Remark === "TaskStatus"
  );
  // const activeUser = taskoptions.filter((display) => display.IsActive === true);
  const TaskOptions = taskoptions.map((display) => ({
    value: display.Description,
    label: display.Description,
  }));
  const processFilter = processlist.filter(
    (display) => display.SubCategoryID === taxadmin
  );
  const activeProcess = processFilter.filter(
    (display) => display.IsActive === true
  );
  const ProcessOption = activeProcess.map((display) => ({
    value: display.Id,
    label: display.ProcessName,
  }));
  getuserdata.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
  const activeUser = getuserdata.filter((display) => display.IsActive === true);
  const userOptions = activeUser.map((display) => ({
    value: display.Id,
    label: display.FirstName + " " + display.LastName,
  }));
  const yearOption = yearList.map((display) => ({
    value: display.YearName,
    label: display.YearName,
  }));
  const assignByOptions = getuserdata.map((display) => ({
    value: display.Id,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="avatar"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            // backgroundColor: getRandomColor(), // Generate a random background color
            backgroundColor: "gray",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
          }}
        >
          {display.FirstName.charAt(0).toUpperCase()}
        </div>
        {display.FirstName + " " + display.LastName}
      </div>
    ),
  }));

  const userFilter = getuserdata.filter(
    (display) => display.UserName == userName
  );
  const assignoption = userFilter.map((display) => ({
    value: display.Id,
    label: display.FirstName + " " + display.LastName,
    // label: (<div style={{ display: 'flex', alignItems: 'center' }}>
    //     <div
    //         className="avatar"
    //         style={{
    //             width: '30px',
    //             height: '30px',
    //             borderRadius: '50%',
    //             // backgroundColor: getRandomColor(), // Generate a random background color
    //             backgroundColor: 'gray',
    //             color: 'white',
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             marginRight: '10px',
    //         }}
    //     >
    //         {display.FirstName.charAt(0).toUpperCase()}
    //     </div>
    //     {display.FirstName + ' ' + display.LastName}
    // </div>)
  }));

  const DataSubmit = async () => {
    try {
      await validationSchema.validate(
        {
          projectname,
          TaskName,
          category,
          taxadmin,
          taskStatus,
          assignBy,
          assignTo,
          remark1,
          todate,
          // party
        },
        { abortEarly: false }
      );
      setLoading(true);
      if (taskid >= 0) {
        const res = await axios.post(
          URL + "/api/Master/CreateTask",
          {
            Flag: "U",
            task: {
              // Id: taskid,
              Cguid: cguid,
              ProjectId: projectname,
              TaskName: TaskName,
              UserId: userid,
              CategoryId: category,
              PartyId: party,
              TaxadminId: taxadmin,
              TaskStatus: taskStatus,
              AssignBy: assignBy,
              // AssignBy: (role == 'Admin' ? assignBy : userid),
              AssignTo: assignTo,
              Priority: priority,
              FromDate: formdate,
              ToDate: todate,
              CustId: custId,
              Type: "Task",
              CompanyID: CompnyId,
              Remark1: remark1,
              Remark2: remark2,
              Remark3: remark3,
              UserId: userid,
              Prefix: Prefix,
              TicketNo: ticketno,
              ProcessId: selectedprocess,
              IPAddress: ipaddress,
              UserName: userName,
              ResponsibleDate: responsible,
              Year: selectedYear,
              FeesEligible: feeschecked,
              TotalFees: totalfees,
              AdvanceFees: advanceFees,
              TransferTo: transferTo,
              ProcessId2: process1,
              AY: assetmentYear,
            },
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          notification.success({
            message: "Data Modified Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
          if (TaskData) {
            TaskData();
          }
          if (fetchData) {
            fetchData();
          }
          onHide();
          if (fetchCalenderData) {
            fetchCalenderData();
          }
          if (fetchAssignByMeData) {
            fetchAssignByMeData();
          }
          if (insertChartData) {
            insertChartData();
          }
          if (fetchCompleteTaskData) {
            fetchCompleteTaskData();
          }
          if (fetchReportData) {
            fetchReportData();
          }
          if (fetchAssignByChart) {
            fetchAssignByChart();
          }
          if (AsignByfetch) {
            AsignByfetch();
          }
          if (AssignByMeTaskData) {
            AssignByMeTaskData();
          }
        }
      } else {
        const res = await axios.post(
          URL + "/api/Master/CreateTask",
          {
            Flag: "A",
            task: {
              ProjectId: projectname,
              TaskName: TaskName,
              UserId: userid,
              CategoryId: category,
              PartyId: party,
              TaxadminId: taxadmin,
              TaskStatus: taskStatus,
              AssignBy: role == "Admin" ? assignBy : userid,
              AssignTo: assignTo,
              Priority: priority,
              FromDate: formdate,
              ToDate: todate,
              CustId: custId,
              Type: "Task",
              CompanyID: CompnyId,
              Remark1: remark1,
              Remark2: remark2,
              Remark3: remark3,
              UserId: userid,
              Prefix: Prefix,
              TicketNo: ticketno,
              ProcessId: selectedprocess,
              IPAddress: ipaddress,
              UserName: userName,
              ResponsibleDate: responsible,
              Year: selectedYear,
              FeesEligible: feeschecked,
              TotalFees: totalfees,
              AdvanceFees: advanceFees,
              TransferTo: transferTo,
              ProcessId2: process1,
              AY: assetmentYear,
            },
          },
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );
        if (res.data.Success == true) {
          if (TaskData) {
            TaskData();
          }
          if (fetchData) {
            fetchData();
          }
          onHide();
          if (fetchCalenderData) {
            fetchCalenderData();
          }
          if (fetchAssignByMeData) {
            fetchAssignByMeData();
          }
          if (insertChartData) {
            insertChartData();
          }
          if (fetchCompleteTaskData) {
            fetchCompleteTaskData();
          }
          if (fetchReportData) {
            fetchReportData();
          }
          if (fetchAssignByChart) {
            fetchAssignByChart();
          }
          if (AsignByfetch) {
            AsignByfetch();
          }
          if (AssignByMeTaskData) {
            AssignByMeTaskData();
          }
          notification.success({
            message: "Data Added Successfully !!!",
            placement: "bottomRight", // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      }
    } catch (error) {
      console.log(error, "error");
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
    if (
      projectModal == false &&
      categoryModal == false &&
      subCategoryModal == false &&
      processModal == false &&
      partyModal == false
    ) {
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
    projectModal,
    categoryModal,
    subCategoryModal,
    processModal,
    partyModal,
    taskid,
    projectname,
    TaskName,
    category,
    taxadmin,
    taskStatus,
    assignBy,
    assignTo,
    priority,
    todate,
    formdate,
    remark1,
    remark2,
    remark3,
    selectedYear,
    assetmentYear,
    feeschecked,
    responsible,
    totalfees,
    advanceFees,
    process1,
    transferTo,
  ]); // Add any other dependencies as needed

  const loggedInUser = {
    value: userName, // Replace with the actual user ID
    label: userName, // Replace with the user's name or identifier
  };
  const userOptions1 = [loggedInUser];

  const HandlePriorityChange = (selectoption) => {
    setPriority(selectoption.value);
    // if (errors.priority) {
    //     setErrors(prevErrors => ({ ...prevErrors, priority: '' }));
    // }
  };

  const HandleTaskStatusChange = (selectoption) => {
    setTaskStatus(selectoption.value);
    if (errors.taskStatus) {
      setErrors((prevErrors) => ({ ...prevErrors, taskStatus: "" }));
    }
  };

  function CustomOption({ innerProps, label }) {
    return <div {...innerProps}>{label}</div>;
  }
  const handleSelect = (selected) => {
    setAssignTo(selected.map((option) => option.value));
    const assigntask = selected.map((option) => option.value).join(",");
    setAssignTo(assigntask);
    if (errors.assignTo) {
      setErrors((prevErrors) => ({ ...prevErrors, assignTo: "" }));
    }
  };
  const handleAssignBySelect = (selected) => {
    setAssignBy(selected.map((option) => option.value));
    const assigntask = selected.map((option) => option.value).join(",");
    setAssignBy(assigntask);
    // if (errors.assignTo) {
    //     setErrors(prevErrors => ({ ...prevErrors, assignTo: '' }));
    // }
  };

  // CAPITAL LETTER INPUT
  // const remark1Ref = useRef(null);
  // const handleInputChange = (event) => {
  //     const input = event.target.value;
  //     const cursorPosition = remark1Ref.current.selectionStart; // Store cursor position

  //     const capitalLetters = input.toUpperCase();
  //     setRemark1(capitalLetters);

  //     if (errors.remark1) {
  //         setErrors((prevErrors) => ({ ...prevErrors, remark1: '' }));
  //     }

  //     // Set cursor position back to its original position
  //     remark1Ref.current.setSelectionRange(cursorPosition, cursorPosition);
  // };

  useEffect(() => {
    let firstDate = moment(formdate);
    let secondDate = moment(todate);
    if (!(firstDate <= secondDate)) {
      setToDate(formdate);
    }
  }, [formdate]);

  // Party Selected Project List
  const getSelectedProjectList = async (party) => {
    try {
      const response = await axios.get(
        URL +
          `/api/Master/GetProjectListByParty?PartyId=${party}&CompanyId=${CompnyId}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      const fillterProject = response.data[0].ProjectId?.split(",").map(
        (item) => Number(item)
      );
      setSelectedProject(fillterProject);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (party) {
      getSelectedProjectList(party);
    } else {
      setSelectedProject("");
    }
  }, [party]);

  const checkFilterValue = (value, inputText) => {
    return value?.toLowerCase().includes(inputText?.toLowerCase());
  };

  const partyOptionFilters = useMemo(() => {
    if (partyOptionsFilterText?.length) {
      const data = partyOptions.filter(
        (option) =>
          checkFilterValue(option?.PartyName, partyOptionsFilterText) ||
          checkFilterValue(option?.LegelName, partyOptionsFilterText) ||
          checkFilterValue(option?.Phone1, partyOptionsFilterText) ||
          checkFilterValue(option?.Mobile1, partyOptionsFilterText) ||
          checkFilterValue(option?.Mobile2, partyOptionsFilterText) ||
          checkFilterValue(option?.Email, partyOptionsFilterText) ||
          checkFilterValue(option?.PAN, partyOptionsFilterText) ||
          checkFilterValue(option?.TAN, partyOptionsFilterText) ||
          checkFilterValue(option?.GST, partyOptionsFilterText) ||
          checkFilterValue(option?.Aadhar, partyOptionsFilterText) ||
          checkFilterValue(option?.ITFileNo, partyOptionsFilterText) ||
          checkFilterValue(option?.GSTFileNo, partyOptionsFilterText) ||
          checkFilterValue(option?.OtherFileNo, partyOptionsFilterText) ||
          checkFilterValue(option?.CompanyCINNo, partyOptionsFilterText)
      );
      if (data?.length) {
        return data;
      } else {
        return [
          {
            label: "No results found",
          },
        ];
      }
    } else {
      return partyOptions;
    }
  }, [partyOptionsFilterText, partyOptions]);

  return (
    <div>
      <div className="form-border">
        {/* Content Header (Page header) */}
        <section
          className="content-header model-close-btn "
          style={{ width: "100%" }}
        >
          <div className="form-heading">
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Task</h1>
              {/* <small>Task List</small> */}
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
                data-sortable="true"
              >
                <div className="col-sm-12">
                  <Row>
                    <Col lg={2}>
                      <div className="form-group">
                        <label>Ticket No :</label>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          value={Prefix + ticketno}
                        />
                      </div>
                    </Col>
                    <Col lg={10}>
                      <div className="form-group">
                        <label>Party :</label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            options={
                              partyOptionsFilterText.length
                                ? partyOptionFilters
                                : partyOptions
                            }
                            // value={partyOptions.find((option) => option.value == party)}
                            isClearable={true}
                            value={
                              party
                                ? partyOptions.find(
                                    (option) => option.value === party
                                  )
                                : null
                            }
                            onChange={(selected) => {
                              setParty(selected ? selected.value : "");
                              setProjectname("");
                              // if (errors.party) {
                              //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                              // }
                            }}
                            filterOption={(option, inputValue) => {
                              setPartyOptionsFilterText(inputValue);
                              return true;
                            }}
                            placeholder="Select Party"
                          />
                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setPartyModal(true)}
                            />
                            <PartyNew
                              show={partyModal}
                              onHide={() => setPartyModal(false)}
                              getPartyData={getPartyData}
                            />
                          </div>
                        </div>
                        {errors.party && (
                          <div className="error-message text-danger">
                            {errors.party}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Project Name :<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            options={projectOptions}
                            // isDisabled={category ? true : false}
                            value={
                              projectname
                                ? projectOptions.find(
                                    (option) => option.value === projectname
                                  )
                                : null
                            }
                            onChange={(selected) => {
                              setProjectname(selected ? selected.value : ""); // Clear the selected value if selected is null or undefined
                              setSelectedProcess("");
                              setTaxadmin("");
                              setCategory("");
                              if (errors.projectname) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  projectname: "",
                                }));
                              }
                            }}
                            placeholder="Select Project"
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
                        {errors.projectname && (
                          <div className="error-message text-danger">
                            {errors.projectname}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Category Name :<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            options={categoryOptions}
                            // isDisabled={taxadmin ? true : false}
                            // value={categoryOptions.find((option) => option.value == category)}
                            value={
                              category
                                ? categoryOptions.find(
                                    (option) => option.value === category
                                  )
                                : null
                            }
                            onChange={(selected) => {
                              setCategory(selected ? selected.value : "");
                              setTaxadmin("");
                              setSelectedProcess("");
                              // setIsSubCategorySelected(false); // Allow changes to Sub-Category
                              if (errors.category) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  category: "",
                                }));
                              }
                            }}
                            placeholder="Select Category"
                            // isDisabled={isSubCategorySelected} // Disable if Sub-Category is selected
                          />

                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setCategoryModal(true)}
                            />
                            <CategoryNew
                              show={categoryModal}
                              onHide={() => setCategoryModal(false)}
                              getCategoryData={getCategoryData}
                            />
                          </div>
                        </div>
                        {errors.category && (
                          <div className="error-message text-danger">
                            {errors.category}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>
                          Sub-Category Name :
                          <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            // isDisabled={selectedprocess ? true : false}
                            options={taxadminOptions}
                            // value={taxadminOptions.find((option) => option.value === taxadmin)}
                            value={
                              taxadmin
                                ? taxadminOptions.find(
                                    (option) => option.value === taxadmin
                                  )
                                : null
                            }
                            // onChange={handleSubCategoryChange}
                            onChange={(selected) => {
                              setTaxadmin(selected ? selected.value : "");
                              setSelectedProcess("");
                              setIsSubCategorySelected(true); // Sub-Category is now selected
                              if (errors.taxadmin) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  taxadmin: "",
                                }));
                              }
                            }}
                            placeholder="Select Sub-Category"
                          />
                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setsubCategoryModal(true)}
                            />
                            <SubCategoryNew
                              show={subCategoryModal}
                              onHide={() => setsubCategoryModal(false)}
                              getTaxadmindata={getTaxadmindata}
                            />
                          </div>
                        </div>
                        {errors.taxadmin && (
                          <div className="error-message text-danger">
                            {errors.taxadmin}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <label>Process Name :</label>
                        <div className="d-flex">
                          <Select
                            className="w-100"
                            options={ProcessOption}
                            // value={ProcessOption.find((option) => option.value === selectedprocess)}
                            isClearable={true}
                            value={
                              selectedprocess
                                ? ProcessOption.find(
                                    (option) => option.value === selectedprocess
                                  )
                                : null
                            }
                            onChange={(selected) => {
                              setSelectedProcess(
                                selected ? selected.value : ""
                              );
                            }}
                            placeholder="Select Process Name"
                          />
                          <div className="more-btn-icon">
                            <FiMoreHorizontal
                              onClick={() => setProcessModal(true)}
                            />
                            <ProcessNew
                              show={processModal}
                              onHide={() => setProcessModal(false)}
                              getProcessData={getProcessData}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="form-group">
                    <label>
                      Task Name :<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={TaskName}
                      placeholder="Enter Task Name"
                      onChange={(event) => {
                        // const input = event.target.value;
                        // const capitalLetters = input.toUpperCase();
                        setTaskName(event.target.value);
                        if (errors.TaskName) {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            TaskName: "",
                          }));
                        }
                      }}
                    />
                    {errors.TaskName && (
                      <div className="error-message text-danger">
                        {errors.TaskName}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="form-group">
                      <Space wrap>
                        <Tooltip title="Add Remark">
                          <button
                            type="button"
                            onClick={toggleRemarks}
                            className="remark-btn"
                          >
                            {checkRemarks
                              ? "Hide Details"
                              : "Show More Details"}
                          </button>
                        </Tooltip>
                        {taskStatus === "Hold" || taskStatus === "Cancel" ? (
                          <span className="text-danger ml-3">
                            {remarkError}
                          </span>
                        ) : null}
                      </Space>
                    </div>
                    {checkRemarks && (
                      <Row>
                        <Col lg={12}>
                          <div className="form-group">
                            <label>Remark-1</label>
                            <textarea
                              // ref={remark1Ref}
                              className="form-control"
                              rows="2"
                              placeholder="Enter Remark"
                              value={remark1}
                              // onChange={handleInputChange}
                              onChange={(event) => {
                                setRemark1(event.target.value);
                                setRemarkError("");
                                if (errors.remark1) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    remark1: "",
                                  }));
                                }
                              }}
                            />
                            {errors.remark1 && (
                              <div className="error-message text-danger">
                                {errors.remark1}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group">
                            <label>Remark-2</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              placeholder="Enter Remark"
                              value={remark2}
                              onChange={(event) => {
                                // const input = event.target.value;
                                // const capitalLetters = input.toUpperCase();
                                setRemark2(event.target.value);
                              }}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group">
                            <label>Remark-3</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              placeholder="Enter Remark"
                              value={remark3}
                              onChange={(event) => {
                                // const input = event.target.value;
                                // const capitalLetters = input.toUpperCase();
                                setRemark3(event.target.value);
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                  <Row>
                    {role == "Admin" ? (
                      <Col lg={6}>
                        <div className="form-group">
                          <label>
                            Assign By :<span className="text-danger">*</span>
                          </label>
                          <Select
                            className="w-100"
                            options={userOptions}
                            value={
                              assignBy
                                ? userOptions?.find(
                                    (option) => option.value == assignBy
                                  )
                                : null
                            }
                            isSearchable={true}
                            onChange={(selected) => {
                              setAssignBy(selected.value);
                              if (errors.assignBy) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  assignBy: "",
                                }));
                              }
                            }}
                            placeholder="Select Assign By"
                          />
                          {errors.assignBy && (
                            <div className="error-message text-danger">
                              {errors.assignBy}
                            </div>
                          )}
                        </div>
                      </Col>
                    ) : null}
                    {/* {role === "Admin" ? (
                         
                        ) : null} */}
                    {role != "Admin" ? (
                      <Col lg={12}>
                        <div className="form-group">
                          <label>
                            Assign To :<span className="text-danger">*</span>
                          </label>
                          <Select
                            className="w-100"
                            isMulti
                            options={userOptions}
                            value={userOptions?.filter((option) =>
                              assignTo?.includes(option.value)
                            )} // Filter and select options that are present in assignTo array
                            onChange={handleSelect}
                            placeholder="Select Assign To"
                          />
                          {errors.assignTo && (
                            <div className="error-message text-danger">
                              {errors.assignTo}
                            </div>
                          )}
                        </div>
                      </Col>
                    ) : (
                      <Col lg={6}>
                        <div className="form-group">
                          <label>
                            Assign To :<span className="text-danger">*</span>
                          </label>
                          <Select
                            className="w-100"
                            isMulti
                            options={userOptions}
                            value={userOptions?.filter((option) =>
                              assignTo?.includes(option.value)
                            )} // Filter and select options that are present in assignTo array
                            onChange={handleSelect}
                            placeholder="Select Assign To"
                          />
                          {errors.assignTo && (
                            <div className="error-message text-danger">
                              {errors.assignTo}
                            </div>
                          )}
                        </div>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col lg={6} md={12}>
                      <Row>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label>Financial Year :</label>
                            <div className="d-flex">
                              <Select
                                className="w-100"
                                options={yearOption}
                                isClearable={true}
                                value={
                                  selectedYear
                                    ? yearOption.find(
                                        (option) =>
                                          option.value === selectedYear
                                      )
                                    : null
                                }
                                onChange={(selected) => {
                                  setSelectedYear(
                                    selected ? selected.value : ""
                                  );
                                }}
                                placeholder="Select Year"
                              />
                            </div>
                          </div>
                        </Col>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label>Assetment Year :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={assetmentYear}
                              placeholder="Assetment Year"
                              disabled
                            />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} md={12}>
                      <Row>
                        <Col lg={4} md={12}>
                          <div className="form-group">
                            <label>Start Date :</label>
                            <input
                              type="date"
                              className="form-control"
                              value={formdate}
                              onChange={(event) => {
                                setFormDate(event.target.value);
                                // if (errors.formdate) {
                                //     setErrors(prevErrors => ({ ...prevErrors, formdate: '' }));
                                // }
                              }}
                            />
                            {/* {errors.formdate && <div className="error-message text-danger">{errors.formdate}</div>} */}
                          </div>
                        </Col>
                        <Col lg={4} md={12}>
                          <div className="form-group">
                            <label>Due Date :</label>
                            <input
                              type="date"
                              className="form-control"
                              min={formdate}
                              value={todate}
                              onChange={(event) => {
                                setToDate(event.target.value);
                                if (errors.todate) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    todate: "",
                                  }));
                                }
                              }}
                            />
                            {errors.todate && (
                              <div className="error-message text-danger">
                                {errors.todate}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={4} md={12}>
                          <div className="form-group">
                            <label>Responsible Date :</label>
                            <input
                              type="date"
                              className="form-control"
                              value={responsible}
                              onChange={(event) => {
                                setResponsible(event.target.value);
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col></Col>
                  </Row>
                  {/* <br /> */}
                  <div className="form-group">
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={feeschecked}
                        onChange={(event) => {
                          setFeesChecked(event.target.checked);
                        }}
                      />
                      <span className="m-1">Fees Eligible</span>
                    </label>
                  </div>
                  <Row>
                    {/* <Col lg={4}> */}
                    {/* <div className="form-group">
                        <label style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={feeschecked}
                            onChange={(event) => {
                              setFeesChecked(event.target.checked);
                            }}
                          />
                          <span className="m-1">Fees Eligible</span>
                        </label>
                      </div> */}
                    {feeschecked ? (
                      <>
                        <Col lg={4}>
                          <div className="d-flex">
                            <div className="form-group mr-1">
                              <label>Total Fees:</label>
                              <input
                                type="text"
                                className="form-control"
                                value={totalfees}
                                placeholder="Enter Fees"
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const numericInput = input.replace(/\D/g, "");
                                  const limitedInput = numericInput.slice(
                                    0,
                                    10
                                  );
                                  setTotalFees(limitedInput);
                                }}
                              />
                            </div>
                            <div className="form-group ms-1">
                              <label>Advnace Fees:</label>
                              <input
                                type="text"
                                className="form-control"
                                value={advanceFees}
                                placeholder="Enter Advance Fees"
                                onChange={(event) => {
                                  const input = event.target.value;
                                  const numericInput = input.replace(/\D/g, "");
                                  const limitedInput = numericInput.slice(
                                    0,
                                    10
                                  );
                                  setAdvanceFees(limitedInput);
                                }}
                              />
                            </div>
                            {/* <Col lg={3}>
                              <div className="form-group">
                                <label>Status:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={pendingFees}
                                  disabled
                                  onChange={(event) => {
                                    setPendingFees(event.target.value);
                                  }}
                                />
                              </div>
                            </Col> */}
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="form-group">
                            <label>Priority :</label>
                            <Select
                              className="w-100"
                              options={PriorityOptions}
                              value={PriorityOptions.find(
                                (option) => option.value === priority
                              )}
                              onChange={HandlePriorityChange}
                              placeholder="Select Priority"
                            />
                            {/* {errors.priority && <div className="error-message text-danger">{errors.priority}</div>} */}
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="form-group">
                            <label>
                              Task Status :
                              <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="w-100"
                              options={TaskOptions}
                              value={TaskOptions.find(
                                (option) => option.value == taskStatus
                              )}
                              onChange={HandleTaskStatusChange}
                              placeholder="Select Task Status"
                            />
                            {errors.taskStatus && (
                              <div className="error-message text-danger">
                                {errors.taskStatus}
                              </div>
                            )}
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg={6}>
                          <div className="form-group">
                            <label>Priority :</label>
                            <Select
                              className="w-100"
                              options={PriorityOptions}
                              value={PriorityOptions.find(
                                (option) => option.value === priority
                              )}
                              onChange={HandlePriorityChange}
                              placeholder="Select Priority"
                            />
                            {/* {errors.priority && <div className="error-message text-danger">{errors.priority}</div>} */}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group">
                            <label>
                              Task Status :
                              <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="w-100"
                              options={TaskOptions}
                              value={TaskOptions.find(
                                (option) => option.value == taskStatus
                              )}
                              onChange={HandleTaskStatusChange}
                              placeholder="Select Task Status"
                            />
                            {errors.taskStatus && (
                              <div className="error-message text-danger">
                                {errors.taskStatus}
                              </div>
                            )}
                          </div>
                        </Col>
                      </>
                    )}
                    {/* </Col> */}
                  </Row>
                  {taskStatus == "Transfer" ? (
                    <Row>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Transfer To :</label>
                          <Select
                            className="w-100"
                            options={userOptions}
                            value={userOptions.filter(
                              (option) => option.value == transferTo
                            )} // Filter and select options that are present in assignTo array
                            onChange={(selectoption) => {
                              setTransferTo(selectoption.value);
                            }}
                            placeholder="Select Transfer To"
                          />
                          {/* {errors.priority && <div className="error-message text-danger">{errors.priority}</div>} */}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group">
                          <label>Process :</label>
                          <div className="d-flex">
                            <Select
                              className="w-100"
                              options={ProcessOption}
                              value={ProcessOption.filter(
                                (option) => option.value == process1
                              )}
                              onChange={(selected) => {
                                setProcess1(selected.value);
                              }}
                              placeholder="Select Priority"
                            />
                            <div className="more-btn-icon">
                              <FiMoreHorizontal
                                onClick={() => setProcessModal(true)}
                              />
                              <ProcessNew
                                show={processModal}
                                onHide={() => setProcessModal(false)}
                                getProcessData={getProcessData}
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                  <div className="buttons-reset">
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
                    <div>
                      <Button
                        variant="light"
                        className="border border-rounded"
                        onClick={resetForm}
                      >
                        <GrPowerReset />
                      </Button>
                    </div>
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
}

export default TaskForm;
