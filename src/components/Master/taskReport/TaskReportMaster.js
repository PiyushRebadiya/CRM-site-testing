import React from 'react'
import { useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import TaskReportTable from './TaskReportTable'
import TaskReportAssignByMeTable from './TaskReportAssignByMe';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Space, Tooltip, Tabs } from 'antd';
import { FaFilter } from "react-icons/fa";

const { TabPane } = Tabs

const TaskReportMaster = () => {
    const location = useLocation()

    // From date as per Financial Year
    const from_Date = new Date();
    from_Date.setMonth(3); // April is month 3 (0-indexed)
    from_Date.setDate(1); // Set the day to 1
    // Adjust the year if the current month is before April
    if (new Date().getMonth() < 3) {
        from_Date.setFullYear(from_Date.getFullYear() - 1);
    }
    const formattedfrom = moment(from_Date).format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(formattedfrom);
    const [fromASBdate, setFromASBDate] = useState(formattedfrom);

    const to_Date = new Date();
    const formattedto = moment(to_Date).format('YYYY-MM-DD');
    const [todate, setTodate] = useState(formattedto)
    const [ToASBdate, setToASBDate] = useState(formattedto);

    const [data, setData] = useState([])
    const [assignByMedata, setAssignByMeData] = useState([])
    const [partylist, setPartyList] = useState([])
    const [selectedparty, setSelectedParty] = useState(0)
    const [selectedAssignByMeparty, setSelectedAsssignByMeParty] = useState(0)
    const [tasklist, setTaskList] = useState([])
    const [selectedTask, setSelectedTask] = useState('')
    const [selectedAssignByMeTask, setSelectedAssignByMeTask] = useState('')
    const [loading, setLoading] = useState(false);
    const [emplist, setEmplist] = useState([])
    const [selectedemp, setSelectedEmp] = useState("")
    const token = localStorage.getItem('CRMtoken')
    const CustId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const Userid = localStorage.getItem('CRMUserId')
    const role = localStorage.getItem('CRMRole')
    const URL = process.env.REACT_APP_API_URL

    // filter
    const [filter, setFilter] = useState(false)
    const [getprojectdata, setGetProjectData] = useState([])
    const [getcategorydata, setGetcategorydata] = useState([])
    const [gettaxadmindata, setGettaxadmindata] = useState([])
    const [category, setCategory] = useState(0)
    const [taxadmin, setTaxadmin] = useState(0)
    const [projectname, setProjectname] = useState(0)



    const handleClose = () => setFilter(false);
    const handleShow = () => setFilter(true);

    const resetRecord = () => {
        setFromDate(formattedfrom)
        setTodate(formattedfrom)
        setSelectedParty(0)
        setTaxadmin(0)
        setProjectname(0)
        setCategory(0)
        setSelectedEmp('')
        // setTaskStatus('')
        // AssignByMeTaskData()
        // TaskData()
        // handleClose()
    }

    const TaskReportList = async () => {
        try {
            const res = await axios.get(URL +
                `/api/Master/GetTaskReport?PartyId=0&TaskStatus=&startdate=${formattedfrom}&endDate=${formattedto}&CompanyId=${CompanyId}&Type=Task&AssignTo=${role == 'Admin' ? '' : Userid}&ProjectId=0&CategoryId=0&TaxadminId=0`, {

                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const TaskReportAssignByMeList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=0&TaskStatus=&startdate=${formattedfrom}&endDate=${formattedto}&CompanyId=${CompanyId}&Type=Task&AssignTo=&AssignBy=${role == 'Admin' ? '' : Userid}&ProjectId=0&CategoryId=0&TaxadminId=0`, {

                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        TaskReportList()
        TaskReportAssignByMeList()
    }, [])
    const DataSubmit = async () => {
        setLoading(true);
        if (role == 'Admin') {
            try {
                const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedparty}&TaskStatus=${selectedTask}&startdate=${fromdate}&endDate=${todate}&CompanyId=${CompanyId}&Type=Task&AssignTo=${role == 'Admin' ? selectedemp : Userid}&AssignBy=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`,
                    {
                        headers: { Authorization: `bearer ${token}` }
                    })
                setData(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                handleClose()
                setLoading(false);
            }
        }
        else {
            try {
                const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedparty}&TaskStatus=${selectedTask}&startdate=${fromdate}&endDate=${todate}&CompanyId=${CompanyId}&Type=Task&AssignTo=${role == 'Admin' ? selectedemp : Userid}&AssignBy=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setData(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                handleClose()
                setLoading(false);
            }
            try {
                const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedparty}&TaskStatus=${selectedTask}&startdate=${fromdate}&endDate=${todate}&CompanyId=${CompanyId}&Type=Task&AssignTo=&AssignBy=${role == 'Admin' ? '' : Userid}&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                    // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedparty}&TaskStatus=${selectedTask}&startdate=${fromdate}&endDate=${todate}&CompanyId=${CompanyId}&Type=Task&AssignTo=&AssignBy=${role == 'Admin' ? '' : Userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setAssignByMeData(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

    }

    const DataSubmitUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedparty}&TaskStatus=${selectedTask}&startdate=${fromdate}&endDate=${todate}&CompanyId=${CompanyId}&Type=Task&AssignTo=${role == 'Admin' ? selectedemp : Userid}&AssignBy=&ProjectId=${projectname}&CategoryId=${category}&TaxadminId=${taxadmin}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            handleClose()
            setLoading(false);
        }
    }
    const DataAssignByMeSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=0&TaskStatus=${selectedAssignByMeTask}&startdate=${fromASBdate}&endDate=${ToASBdate}&CompanyId=${CompanyId}&Type=Task&AssignTo=&AssignBy=${role == 'Admin' ? '' : Userid}&ProjectId=0&CategoryId=0&TaxadminId=0`, {
                // const res = await axios.get(URL + `/api/Master/GetTaskReport?PartyId=${selectedAssignByMeparty}&TaskStatus=${selectedAssignByMeTask}&startdate=${fromASBdate}&endDate=${fromASBdate}&CompanyId=${CompanyId}&Type=Task&AssignTo=&AssignBy=${role == 'Admin' ? '' : Userid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignByMeData(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F9') {
                event.preventDefault();
                DataSubmit();
                DataAssignByMeSubmit()
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedparty, selectedTask, fromdate, todate, selectedemp, CompanyId, selectedAssignByMeparty, selectedAssignByMeTask]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                DataClear()
                DataClearAssignByMe()
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fromdate, todate]);

    useEffect(() => {
        setData([])
    }, [location.pathname])
    const getPartyList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${CustId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPartyList(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTaskStatus = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            })
            setTaskList(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getEmplist = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${CustId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setEmplist(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetProjectData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const projectOptions = getprojectdata.map((display) => ({
        value: display.Id,
        label: display.ProjectName,
    }));
    const getCategoryData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            // console.log(res,"res")
            setGetcategorydata(res.data);
            // console.log(res.data, "categoryDAta");
        } catch (error) {
            // Handle error
        }
    };

    const categoryOptions = getcategorydata.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));
    const getTaxadmindata = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setGettaxadmindata(res.data);
            // console.log(res.data, "sub-categoryDAta");
        } catch (error) {
            // Handle error
        }
    };

    const taxadminOptions = gettaxadmindata.map((display) => ({
        value: display.Id,
        label: display.Heading,
    }));
    useEffect(() => {
        if (filter == true) {
            getProjectData()
            getCategoryData()
            getTaxadmindata()
        }
    }, [filter])
    useEffect(() => {
        getPartyList()
        getTaskStatus()
        getEmplist()
    }, [])
    const filterPartyName = partylist.find((item) => item.PartyId == selectedparty)

    const generatePDF = () => {
        const doc = new jsPDF('landscape');
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');

        doc.text(` ${companyName}`, 120, 10);
        doc.line(120, 12, 190, 12); // Draw a horizontal line after companyName
        doc.setFontSize(12);
        doc.text(`From Date : ${moment(fromdate).format('DD/MM/YYYY')}`, 15, 18);
        doc.text(`To date : ${moment(todate).format('DD/MM/YYYY')}`, 15, 23);
        doc.text(`Party Name : ${(selectedparty === 0) ? 'All' : filterPartyName.PartyName}`, 15, 28);
        // (selectedparty === 0) ? 'Party Name : All' : `Party Name : ${selectedparty}`;
        doc.text(`Status : ${(selectedTask === "") ? 'All' : selectedTask}`, 15, 33);
        doc.text(`Total Record : ${data.length}`, 15, 38);

        // const leftMargin = 15;
        doc.text('Task Report List :-', 15, 44);

        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : '-',
            item.ProjectName ? item.ProjectName : '-',
            item.CategoryName ? item.CategoryName : '-',
            item.TaskName ? item.TaskName : '-',
            item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date',
            item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date',
            item.ABFName ? item.ABFName : '-',
            item.ATFName ? item.ATFName : '-',
            item.TaskStatus ? item.TaskStatus : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'Project Name', 'CategoryName', 'Task Name', 'Start Date', 'End Date', 'AssignBy', 'AssignTo', 'Task Status']],
            body: tableData,
            startY: 48,
        });

        doc.save('TaskReport.pdf');
    };
    const generateAssignByMePDF = () => {
        const doc = new jsPDF('landscape');
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');

        doc.text(` ${companyName}`, 120, 10);
        doc.line(120, 12, 190, 12); // Draw a horizontal line after companyName
        doc.setFontSize(12);
        doc.text(`From Date : ${moment(fromdate).format('DD/MM/YYYY')}`, 15, 18);
        doc.text(`To date : ${moment(todate).format('DD/MM/YYYY')}`, 15, 23);
        doc.text(`Party Name : ${(selectedparty === 0) ? 'All' : filterPartyName.PartyName}`, 15, 28);
        // (selectedparty === 0) ? 'Party Name : All' : `Party Name : ${selectedparty}`;
        doc.text(`Status : ${(selectedTask === "") ? 'All' : selectedTask}`, 15, 33);
        doc.text(`Total Record : ${assignByMedata.length}`, 15, 38);

        // const leftMargin = 15;
        doc.text('Task Report List :-', 15, 44);

        const tableData = assignByMedata.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : '-',
            item.ProjectName ? item.ProjectName : '-',
            item.CategoryName ? item.CategoryName : '-',
            item.TaskName ? item.TaskName : '-',
            item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date',
            item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date',
            item.ABFName ? item.ABFName : '-',
            item.ATFName ? item.ATFName : '-',
            item.TaskStatus ? item.TaskStatus : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'Project Name', 'CategoryName', 'Task Name', 'Start Date', 'End Date', 'AssignBy', 'AssignTo', 'Task Status']],
            body: tableData,
            startY: 48,
        });

        doc.save('TaskReport.pdf');
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'Task Report.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Party Name', 'Project Name', 'CategoryName', 'Task Name', 'Start Date', 'End Date', 'AssignBy', 'AssignTo', 'Task Status'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : '-',
                item.ProjectName ? item.ProjectName : '-',
                item.CategoryName ? item.CategoryName : '-',
                item.TaskName ? item.TaskName : '-',
                item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date',
                item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date',
                item.ABFName ? item.ABFName : '-',
                item.ATFName ? item.ATFName : '-',
                item.TaskStatus ? item.TaskStatus : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "TaskReport.xlsx");
    };
    // const downloadAssignByMeExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(assignByMedata);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'Task Report.xlsx');
    // };
    const downloadAssignByMeExcel = () => {
        const columeName = ['No', 'Party Name', 'Project Name', 'CategoryName', 'Task Name', 'Start Date', 'End Date', 'AssignBy', 'AssignTo', 'Task Status'];
        const formattedData = [
            columeName,
            ...assignByMedata.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : '-',
                item.ProjectName ? item.ProjectName : '-',
                item.CategoryName ? item.CategoryName : '-',
                item.TaskName ? item.TaskName : '-',
                item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date',
                item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date',
                item.ABFName ? item.ABFName : '-',
                item.ATFName ? item.ATFName : '-',
                item.TaskStatus ? item.TaskStatus : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "TaskReport.xlsx");
    };
    const handlePrint = () => {
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
        const printContent = `
          <html>
            <head>
              <title>Print</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                p{
                    font-size: 25px;
                    font-weight:700;
                    text-align:center;
                }
              </style>
            </head>
            <body>
            <p> ${companyName}</p>
            <hr/>
            <div>
            <b>From Date :</b> ${moment(fromdate).format('DD/MM/YYYY')}<br/>
            <b>To date :</b> ${moment(todate).format('DD/MM/YYYY')}<br/>
            <b>Party Name :</b> ${(selectedparty === 0) ? 'All' : filterPartyName.PartyName}<br/>
            <b>Status :</b> ${(selectedTask === "") ? 'All' : selectedTask}<br/>
            <b>Total Record :</b> ${data.length}<br/>
            </div>
              <h4>Task Report</h4>
              <table>
                <thead>
                  <tr>
                  <th>No.</th>
                  <th>Party Name</th>
                  <th>Project Name</th>
                  <th>Category Name.</th>
                  <th>Task Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>AssignBy</th>
                  <th>AssignTo</th>
                  <th>Task Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.PartyName ? item.PartyName : '-'}</td>
                    <td>${item.ProjectName ? item.ProjectName : '-'}</td>
                    <td>${item.CategoryName ? item.CategoryName : '-'}</td>
                    <td>${item.TaskName ? item.TaskName : '-'}</td>
                    <td>${item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date'}</td>
                    <td>${item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date'}</td>
                    <td>${item.ABFName ? item.ABFName : '-'}</td>
                    <td>${item.ATFName ? item.ATFName : '-'}</td>
                    <td>${item.TaskStatus ? item.TaskStatus : '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Trigger print after the content is loaded in the new tab
        printWindow.print();
    };
    const handleAssignByMePrint = () => {
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
        const printContent = `
          <html>
            <head>
              <title>Print</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                p{
                    font-size: 25px;
                    font-weight:700;
                    text-align:center;
                }
              </style>
            </head>
            <body>
            <p> ${companyName}</p>
            <hr/>
            <div>
            <b>From Date :</b> ${moment(fromdate).format('DD/MM/YYYY')}<br/>
            <b>To date :</b> ${moment(todate).format('DD/MM/YYYY')}<br/>
            <b>Party Name :</b> ${(selectedparty === 0) ? 'All' : filterPartyName.PartyName}<br/>
            <b>Status :</b> ${(selectedTask === "") ? 'All' : selectedTask}<br/>
            <b>Total Record :</b> ${assignByMedata.length}<br/>
            </div>
              <h4>Task Report</h4>
              <table>
                <thead>
                  <tr>
                  <th>No.</th>
                  <th>Party Name</th>
                  <th>Project Name</th>
                  <th>Category Name.</th>
                  <th>Task Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>AssignBy</th>
                  <th>AssignTo</th>
                  <th>Task Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${assignByMedata.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.PartyName ? item.PartyName : '-'}</td>
                    <td>${item.ProjectName ? item.ProjectName : '-'}</td>
                    <td>${item.CategoryName ? item.CategoryName : '-'}</td>
                    <td>${item.TaskName ? item.TaskName : '-'}</td>
                    <td>${item.FromDate ? moment(item.FromDate).format('DD/MM/YYYY') : 'No Date'}</td>
                    <td>${item.ToDate ? moment(item.ToDate).format('DD/MM/YYYY') : 'No Date'}</td>
                    <td>${item.ABFName ? item.ABFName : '-'}</td>
                    <td>${item.ATFName ? item.ATFName : '-'}</td>
                    <td>${item.TaskStatus ? item.TaskStatus : '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Trigger print after the content is loaded in the new tab
        printWindow.print();
    };
    const empOption = emplist.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName,
    }));

    const partyOptions = partylist.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));
    const taskStatusData = tasklist.filter((item) => item.Remark == "TaskStatus")
    const taskOptions = taskStatusData.map((display) => ({
        value: display.Description,
        label: display.Description,
    }));
    const handlePartyChange = (selected) => {
        setSelectedParty(selected ? selected.value : 0);
    };
    const handleAssignByMePartyChange = (selected) => {
        setSelectedAsssignByMeParty(selected ? selected.value : 0);
    };
    const DataClear = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
        setSelectedParty(0)
        setSelectedTask("")
        setSelectedEmp("")
        setTaxadmin(0)
        setProjectname(0)
        setCategory(0)
        TaskReportList()
        TaskReportAssignByMeList()
        handleClose()
    }
    const DataClearAssignByMe = () => {
        setFromASBDate(formattedfrom)
        setToASBDate(formattedto)
        setSelectedAsssignByMeParty(0)
        setSelectedAssignByMeTask("")
        TaskReportAssignByMeList()
    }
    return (
        <div>
            <div>
                <div className='content-wrapper'>
                    {/* <section className="content-header">
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
<<<<<<< HEAD
                            <h1>{`${location.pathname == '/taskregister' && 'Task' || location.pathname == '/expenseregister' && 'Expense'} Report`}</h1>
                        </div>
                    </section> */}
                    <section className="content-header">
                        <div className="header-icon">
                            <i class="fa fa-search" style={{ fontSize: "30px", marginTop: "10px", marginLeft: "20px" }}></i>
                        </div>

                        <div className='headeradjust'>
                            <div className="header-title">
                                <h1>{`${location.pathname == '/taskregister' && 'Task' || location.pathname == '/expenseregister' && 'Expense'} Report`}</h1>
                                {/* <small>Task details</small> */}
                            </div>
                            {/* <Button className="btn btn-add rounded-2" onClick={() => setInquiryNew(true)}>
                                Add Inquiry <i class="fa fa-plus" aria-hidden="true"></i>
                            </Button> */}

                            <Tooltip title='Filter'>
                                <FaFilter size={25} onClick={handleShow} style={{ cursor: 'pointer' }} />
                            </Tooltip>
                            <Modal
                                show={filter}
                                onHide={handleClose}
                                centered
                                size='lg'
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Filter</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col lg={6}>
                                            <div className='filter-form date-section-main w-100 p-1'>
                                                <div className='date-lable left'>
                                                    <label>From Date :</label>
                                                </div>
                                                <div className='w-100'>
                                                    <input type='date' className='form-control w-100'
                                                        value={fromdate} onChange={(event) => { setFromDate(event.target.value) }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main w-100 p-1'>
                                                <div className='date-lable left'>
                                                    <label>To Date :</label>
                                                </div>
                                                <div className='w-100'>
                                                    <input type='date' className='form-control w-100'
                                                        value={todate} onChange={(event) => { setTodate(event.target.value) }}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main w-100 mt-4'>
                                                <div className='date-lable'>
                                                    <label>Party :</label>
                                                </div>
                                                <div className='w-100 p-1'>
                                                    <Select
                                                        className='w-100'
                                                        options={partyOptions}
                                                        // value={partyOptions.find((option) => option.value == selectedparty)}
                                                        value={selectedparty ? partyOptions.find((option) => option.value === selectedparty) : null}
                                                        onChange={handlePartyChange}
                                                        isClearable={true}
                                                        placeholder="Select Party"
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className=' filter-label date-section-main w-100 mt-4'>
                                                <div className='date-lable'>
                                                    <label>Project :</label>
                                                </div>
                                                <div className='w-100 p-1'>
                                                    <Select
                                                        className=''
                                                        options={projectOptions}
                                                        isClearable
                                                        value={projectOptions.find((option) => option.value == projectname)}
                                                        onChange={(selected) => {
                                                            setProjectname(selected ? selected.value : '')
                                                            // if (errors.party) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                            // }
                                                        }}
                                                        placeholder="Select Project"
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main p-1 mt-4'>
                                                <div className='date-lable d-flex'>
                                                    <label>Task Status :</label>
                                                </div>
                                                <div className='w-100'>
                                                    <Select
                                                        className='w-100'
                                                        options={taskOptions}
                                                        isClearable={true}
                                                        // value={taskOptions.find((option) => option.value == selectedTask)}
                                                        value={selectedTask ? taskOptions.find((option) => option.value === selectedTask) : null}

                                                        onChange={(selected) => {
                                                            setSelectedTask(selected ? selected.value : '')
                                                        }}
                                                        placeholder="Select Status"
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main p-1 mt-4'>
                                                <div className='date-lable d-flex'>
                                                    <label>Assign To :</label>
                                                </div>
                                                <Select
                                                    className='w-100'
                                                    options={empOption}
                                                    isClearable={true}
                                                    value={selectedemp ? empOption.find((option) => option.value === selectedemp) : null}

                                                    onChange={(selected) => {
                                                        setSelectedEmp(selected ? selected.value : '')
                                                    }}
                                                    placeholder="Select Username"
                                                />
                                            </div>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main p-1 mt-4'>
                                                <div className='date-lable d-flex'>
                                                    <label>Category :</label>
                                                </div>
                                                <div className='w-100'>
                                                    <Select
                                                        className='w-100'
                                                        options={categoryOptions}
                                                        isClearable
                                                        value={categoryOptions.find((option) => option.value == category)}
                                                        onChange={(selected) => {
                                                            setCategory(selected ? selected.value : '')
                                                            // if (errors.party) {
                                                            //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                            // }
                                                        }}
                                                        placeholder="Select Category"
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className='filter-label date-section-main p-1 mt-4'>
                                                <div className='date-lable d-flex w-50'>
                                                    <label>Sub Category :</label>
                                                </div>
                                                <Select
                                                    className='w-100'
                                                    options={taxadminOptions}
                                                    isClearable
                                                    value={taxadminOptions.find((option) => option.value == taxadmin)}
                                                    onChange={(selected) => {
                                                        setTaxadmin(selected ? selected.value : '')
                                                    }}
                                                    placeholder="Select Sub Category"
                                                />
                                            </div>

                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className='ms-2'
                                        onClick={DataClear}
                                    >
                                        Reset
                                    </Button>
                                    <Button variant="secondary"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </Button>
                                    <Button variant="primary"
                                        onClick={DataSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {/* <Popover
                            content={filterPop}
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <Button type="primary"> <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i></Button>
                        </Popover> */}

                        </div>
                    </section>
                    {
                        role == 'Admin' ? (
                            <section className="content">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 pinpin">
                                        <div className="card lobicard" data-sortable="true">
                                            <div className="card-header">
                                                <div className='title-download-section'>
                                                    <div className="card-title custom_title">
                                                        <h4 className='report-heading'>Report List</h4>
                                                    </div>
                                                    <div className='download-record-section'>
                                                        <Space wrap>
                                                            <Tooltip title="Download PDF" >
                                                                <FaFilePdf className='downloan-icon' onClick={generatePDF} />
                                                            </Tooltip>
                                                        </Space>
                                                        <Space wrap>
                                                            <Tooltip title="Download Excel" >
                                                                <RiFileExcel2Line className='downloan-icon' onClick={downloadExcel} />
                                                            </Tooltip>
                                                        </Space>
                                                        <Space wrap>
                                                            <Tooltip title="Print" >
                                                                <AiOutlinePrinter className='downloan-icon' onClick={handlePrint} />
                                                            </Tooltip>
                                                        </Space>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card-body report-section'>
                                                <div className='report-date-main-section'>
                                                    <Row>
                                                        <Col xl={3}>
                                                            <div className=' date-section-main w-100 p-1'>
                                                                <div className='date-lable w-50'>
                                                                    <label>From Date :</label>
                                                                </div>
                                                                <div className='w-100'>
                                                                    <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xl={3}>
                                                            <div className=' date-section-main w-100 p-1'>
                                                                <div className='w-50 date-lable'>
                                                                    <label>To Date :</label>
                                                                </div>
                                                                <div className='w-100'>
                                                                    <input type='date' className='form-control w-100' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        {/* <Col xl={3}>
                                                            <div className=' date-section-main w-100  p-1 '>
                                                                <div className=' w-50 date-lable'>
                                                                    <label>Party Name :</label>
                                                                </div>
                                                                <Select
                                                                    className='w-100'
                                                                    options={partyOptions}
                                                                    // value={partyOptions.find((option) => option.value == selectedparty)}
                                                                    value={selectedparty ? partyOptions.find((option) => option.value === selectedparty) : null}
                                                                    onChange={handlePartyChange}
                                                                    isClearable={true}
                                                                    placeholder="Select Party"
                                                                />
                                                            </div>
                                                        </Col> */}
                                                        {/* <Col xl={3}>
                                                            <div className=' date-section-main w-100  p-1'>
                                                                <div className=' w-50 date-lable'>
                                                                    <label>Status :</label>
                                                                </div>
                                                                <Select
                                                                    className='w-100'
                                                                    options={taskOptions}
                                                                    isClearable={true}
                                                                    // value={taskOptions.find((option) => option.value == selectedTask)}
                                                                    value={selectedTask ? taskOptions.find((option) => option.value === selectedTask) : null}

                                                                    onChange={(selected) => {
                                                                        setSelectedTask(selected ? selected.value : '')
                                                                    }}
                                                                    placeholder="Select Status"
                                                                />
                                                            </div>
                                                        </Col> */}
                                                        {/* <Col xl={3}>
                                                            <div className=' date-section-main w-100  p-1'>
                                                                <div className=' w-50 date-lable'>
                                                                    <label>Assign To :</label>
                                                                </div>
                                                                <Select
                                                                    className='w-100'
                                                                    options={empOption}
                                                                    isClearable={true}
                                                                    value={selectedemp ? taskOptions.find((option) => option.value === selectedemp) : null}

                                                                    onChange={(selected) => {
                                                                        setSelectedEmp(selected ? selected.value : '')
                                                                    }}
                                                                    placeholder="Select Username"
                                                                />
                                                            </div>
                                                        </Col> */}
                                                        <Col xl={2} >
                                                            <div className='ml-4 submit-record-data'>
                                                                <div className='report-submit-btn'>
                                                                    <button
                                                                        onClick={DataSubmit}
                                                                        disabled={loading}>
                                                                        {loading ? 'Submit...' : 'Submit [F9]'}
                                                                    </button>
                                                                </div>
                                                                <div className='report-submit-btn p-1'>
                                                                    <button onClick={DataClear}
                                                                    // disabled={selectedparty != 0 || selectedTask ? true : false}
                                                                    >
                                                                        Clear [Esc]</button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                        <div className="buttonexport" id="buttonlist">
                                        </div>
                                    </div> */}
                                            <div className='p-3' >
                                                <TaskReportTable data={data} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) :
                            <Tabs defaultActiveKey="44"
                                transition={false}
                                centered
                            >
                                <TabPane tab='My Report' key='My'>
                                    <section className="px-4 assignbyreport">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 pinpin">
                                                <div className="card lobicard" data-sortable="true">
                                                    <div className="card-header">
                                                        <div className='title-download-section'>
                                                            <div className="card-title custom_title">
                                                                <h4 className='report-heading'>Report List</h4>
                                                            </div>
                                                            <div className='download-record-section'>
                                                                <Space wrap>
                                                                    <Tooltip title="Download PDF" >
                                                                        <FaFilePdf className='downloan-icon' onClick={generatePDF} />
                                                                    </Tooltip>
                                                                </Space>
                                                                <Space wrap>
                                                                    <Tooltip title="Download Excel" >
                                                                        <RiFileExcel2Line className='downloan-icon' onClick={downloadAssignByMeExcel} />
                                                                    </Tooltip>
                                                                </Space>
                                                                <Space wrap>
                                                                    <Tooltip title="Print" >
                                                                        <AiOutlinePrinter className='downloan-icon' onClick={handlePrint} />
                                                                    </Tooltip>
                                                                </Space>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body report-section'>
                                                        <div className='report-date-main-section'>
                                                            <Row>
                                                                <Col xl={3}>
                                                                    <div className=' date-section-main w-100 p-1'>
                                                                        <div className='date-lable w-50'>
                                                                            <label>From Date :</label>
                                                                        </div>
                                                                        <div className='w-100'>
                                                                            <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col xl={3}>
                                                                    <div className=' date-section-main w-100 p-1'>
                                                                        <div className='w-50 date-lable'>
                                                                            <label>To Date :</label>
                                                                        </div>
                                                                        <div className='w-100'>
                                                                            <input type='date' className='form-control w-100' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                {/* <Col xl={3}>
                                                                    <div className=' date-section-main w-100  p-1 '>
                                                                        <div className=' w-50 date-lable'>
                                                                            <label>Party Name :</label>
                                                                        </div>
                                                                        <Select
                                                                            className='w-100'
                                                                            options={partyOptions}
                                                                            // value={partyOptions.find((option) => option.value == selectedparty)}
                                                                            value={selectedparty ? partyOptions.find((option) => option.value === selectedparty) : null}
                                                                            onChange={handlePartyChange}
                                                                            isClearable={true}
                                                                            placeholder="Select Party"
                                                                        />
                                                                    </div>
                                                                </Col> */}
                                                                {/* <Col xl={3}>
                                                                    <div className=' date-section-main w-100  p-1'>
                                                                        <div className=' w-50 date-lable'>
                                                                            <label>Status :</label>
                                                                        </div>
                                                                        <Select
                                                                            className='w-100'
                                                                            options={taskOptions}
                                                                            isClearable={true}
                                                                            // value={taskOptions.find((option) => option.value == selectedTask)}
                                                                            value={selectedTask ? taskOptions.find((option) => option.value === selectedTask) : null}

                                                                            onChange={(selected) => {
                                                                                setSelectedTask(selected ? selected.value : '')
                                                                            }}
                                                                            placeholder="Select Status"
                                                                        />
                                                                    </div>
                                                                </Col> */}
                                                                <Col xl={2} >
                                                                    <div className='ml-4 submit-record-data'>
                                                                        <div className='report-submit-btn'>
                                                                            <button onClick={DataSubmit} disabled={loading}>
                                                                                {loading ? 'Submit...' : 'Submit [F9]'}
                                                                            </button>
                                                                        </div>
                                                                        <div className='report-submit-btn p-1'>
                                                                            <button onClick={DataClear}
                                                                            // disabled={selectedparty != 0 || selectedTask ? true : false}
                                                                            >
                                                                                Clear [Esc]</button>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                    {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                        <div className="buttonexport" id="buttonlist">
                                        </div>
                                    </div> */}
                                                    <div className='p-3' >
                                                        <TaskReportTable data={data} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </TabPane>
                                <TabPane tab='Assign BY ME Report' key='AssignByMe'>
                                    <section className="px-4 assignbyreport">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 pinpin">
                                                <div className="card lobicard" data-sortable="true">
                                                    <div className="card-header">
                                                        <div className='title-download-section'>
                                                            <div className="card-title custom_title">
                                                                <h4 className='report-heading'>Report List</h4>
                                                            </div>
                                                            <div className='download-record-section'>
                                                                <Space wrap>
                                                                    <Tooltip title="Download PDF" >
                                                                        <FaFilePdf className='downloan-icon' onClick={generateAssignByMePDF} />
                                                                    </Tooltip>
                                                                </Space>
                                                                <Space wrap>
                                                                    <Tooltip title="Download Excel" >
                                                                        <RiFileExcel2Line className='downloan-icon' onClick={downloadAssignByMeExcel} />
                                                                    </Tooltip>
                                                                </Space>
                                                                <Space wrap>
                                                                    <Tooltip title="Print" >
                                                                        <AiOutlinePrinter className='downloan-icon' onClick={handleAssignByMePrint} />
                                                                    </Tooltip>
                                                                </Space>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='card-body report-section'>
                                                        <div className='report-date-main-section'>
                                                            <Row>
                                                                <Col xl={3}>
                                                                    <div className=' date-section-main w-100 p-1'>
                                                                        <div className='date-lable w-50'>
                                                                            <label>From Date :</label>
                                                                        </div>
                                                                        <div className='w-100'>
                                                                            <input type='date' className='form-control w-100' value={fromASBdate} onChange={(event) => { setFromASBDate(event.target.value) }} />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col xl={3}>
                                                                    <div className=' date-section-main w-100 p-1'>
                                                                        <div className='w-50 date-lable'>
                                                                            <label>To Date :</label>
                                                                        </div>
                                                                        <div className='w-100'>
                                                                            <input type='date' className='form-control w-100' value={ToASBdate} onChange={(event) => { setToASBDate(event.target.value) }} />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                {/* <Col xl={3}>
                                                                    <div className=' date-section-main w-100  p-1 '>
                                                                        <div className=' w-50 date-lable'>
                                                                            <label>Party Name :</label>
                                                                        </div>
                                                                        <Select
                                                                            className='w-100'
                                                                            options={partyOptions}
                                                                            // value={partyOptions.find((option) => option.value == selectedparty)}
                                                                            value={selectedAssignByMeparty ? partyOptions.find((option) => option.value === selectedAssignByMeparty) : null}
                                                                            onChange={handleAssignByMePartyChange}
                                                                            isClearable={true}
                                                                            placeholder="Select Party"
                                                                        />
                                                                    </div>
                                                                </Col> */}
                                                                {/* <Col xl={3}>
                                                                    <div className=' date-section-main w-100  p-1'>
                                                                        <div className=' w-50 date-lable'>
                                                                            <label>Status :</label>
                                                                        </div>
                                                                        <Select
                                                                            className='w-100'
                                                                            options={taskOptions}
                                                                            isClearable={true}
                                                                            // value={taskOptions.find((option) => option.value == selectedTask)}
                                                                            value={selectedAssignByMeTask ? taskOptions.find((option) => option.value === selectedAssignByMeTask) : null}

                                                                            onChange={(selected) => {
                                                                                setSelectedAssignByMeTask(selected ? selected.value : '')
                                                                            }}
                                                                            placeholder="Select Status"
                                                                        />
                                                                    </div>
                                                                </Col> */}
                                                                <Col xl={2} >
                                                                    <div className='ml-4 submit-record-data'>
                                                                        <div className='report-submit-btn'>
                                                                            <button onClick={DataAssignByMeSubmit} disabled={loading}>
                                                                                {loading ? 'Submit...' : 'Submit [F9]'}
                                                                            </button>
                                                                        </div>
                                                                        <div className='report-submit-btn p-1'>
                                                                            <button onClick={DataClearAssignByMe}
                                                                            // disabled={selectedparty != 0 || selectedTask ? true : false}
                                                                            >
                                                                                Clear [Esc]</button>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                    {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                        <div className="buttonexport" id="buttonlist">
                                        </div>
                                    </div> */}
                                                    <div className='p-3' >
                                                        {/* <TaskReportTable data={data} /> */}
                                                        <TaskReportAssignByMeTable data={assignByMedata} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </TabPane>
                            </Tabs>
                    }

                </div>
            </div>
        </div>
    )
}

export default TaskReportMaster