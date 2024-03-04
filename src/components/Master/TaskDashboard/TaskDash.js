import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import moment from 'moment';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';
// import { Tag } from 'primereact/tag';
import Modal from 'react-bootstrap/Modal'
import TaskForm from '../workMaster/TaskForm';
import TaskDashForm from './TaskDashForm';
import { Button, Offcanvas } from 'react-bootstrap';
import '../../style/Style.css'
// import { Dropdown } from 'primereact/dropdown';
import { Table, Tag, Space, Dropdown, Menu, Input, DatePicker, Select, Switch,Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { FaInfo } from "react-icons/fa6";
import TaskLog from '../workMaster/TaskLogs'
import { FaRegEye } from "react-icons/fa";

const { TabPane } = Tabs;

function TaskLogHistory(props) {
    const { logtno } = props
    return (
        <Offcanvas
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            placement='end'
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title id="contained-modal-title-vcenter">
                    TimeLine
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-5 ms-2'>
                <TaskLog logtno={logtno} />
            </Offcanvas.Body>
        </Offcanvas>
    );
}


function TaskNewForm(props) {
    const { fetchData, fetchCalenderData, fetchAssignByMeData, insertChartData, fetchCompleteTaskData, fetchReportData,TaskData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <TaskForm onHide={props.onHide} fetchData={fetchData} fetchCalenderData={fetchCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData} TaskData={TaskData} />
        </Modal>
    );
}
function EditData(props) {
    const { selectedRow, fetchData, fetchCalenderData, fetchAssignByMeData, user, taskData, insertChartData, fetchCompleteTaskData, fetchReportData,TaskData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <TaskDashForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} fetchCalenderData={fetchCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} user={user} taskData={taskData}  fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData}  /> */}
            <TaskForm rowData={selectedRow} onHide={props.onHide} fetchData={fetchData} fetchCalenderData={fetchCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} fetchCompleteTaskData={fetchCompleteTaskData} fetchReportData={fetchReportData}TaskData={TaskData} />

        </Modal>
    );
}
function TaskDash({ resetData, filterData, insertData, fetchCalenderData, ondata, taskData, insertChartData, fetchCompleteTaskData, fetchReportData,TaskData }) {
    React.useEffect(() => {
        insertData.current = fetchData
        resetData.current = fetchData
    }, [])
    const [tasknew, setTaskNew] = useState(false);
    const [runningTask, setRunningTask] = useState([]);
    const [taskshow, setTaskshow] = useState("")
    const [selectedRow, setSelectedRow] = useState([]);
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const userid = localStorage.getItem('CRMUserId')
    const companyId = localStorage.getItem("CRMCompanyId")
    const [totalProject, setTotalProject] = useState([]);
    const [assignbytask, setAssignbytask] = useState([])
    const Role = localStorage.getItem('CRMRole')
    const [user, setUser] = useState(false)
    const URL = process.env.REACT_APP_API_URL
    const [editableStatus, setEditableStatus] = useState(null);
    const [masterData, setMasterData] = useState([]);
    const [taskid, setTaskId] = useState(-1)
    const [dateFilter, setDateFilter] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [getuserdata, setGetuserData] = useState([])
    const [remarkshow, setRemarkShow] = useState(false)
    const [searchinput, setSearchInput] = useState("")
    const [logShow, setLogShow] = React.useState(false);
    const [logtno, setLogTNo] = useState('')
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    useEffect(() => {
        if (filterData) {
            setRunningTask(filterData)
        }
    }, [filterData])

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? ' ' : ' '}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=`, {

                headers: { Authorization: `bearer ${token}` }
            })
            setRunningTask(res.data)
            ondata(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // fetchData()
    }, [])
    // const reset = () => {
    //     fetchData()
    // }
    const fetchAssignByMeData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=`, {

                headers: { Authorization: `bearer ${token}` }
            })
            // setAssignbytask(res.data)
            // ondata(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // fetchAssignByMeData()
    }, [])

    useEffect(() => {
        const storedCompanyId = localStorage.getItem('CRMCompanyId');
        // Check if the companyId has changed
        if (companyId !== storedCompanyId) {
            // Update local storage
            localStorage.setItem('CRMCompanyId', companyId);

            // Reload the page
            window.location.reload();
        }
    }, [companyId]);

    const updatedata = async (rowData) => {
        const Id = rowData.Id
        try {
            const res = await axios.get(URL + `/api/Master/TasklistById?Id=${Id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            setSelectedRow(res.data);
            setTaskshow(true)
            setUser(true)
            // console.log(res, "updateifffffffffffffd")

        } catch (error) {
            console.log(error)
        }
    }

    const records = (filterData)=>{
        const filterDatarecords = filterData.length
        return(
            {filterDatarecords}
        )
    }
    const assignByTemplate = (rowData) => {
        const assignByName = rowData.FirstName || rowData.LastName ? (rowData.FirstName + ' ' + rowData.LastName) : (rowData.ABFName + ' ' + rowData.ABLName);
        const backgroundColor = '#205375';

        const avatar = (
            <div
                className="avatar"
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                }}
            >
                {assignByName.charAt(0).toUpperCase()}
            </div>
        );

        return (
            // <div style={{ display: 'flex', alignItems: 'center' }}>
            //     {avatar}
            //     {assignByName}
            // </div>
            assignByName
        );
    };

    const fetchMasterData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            })
            setMasterData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMasterData()
    }, [])
    const taskoptions = masterData.filter((display) => display.Remark === "TaskStatus");
    // console.log(taskoptions,'taskkkkk')
    const taskoptionsfilter = taskoptions.filter((remove)=>remove.Description != 'Hold' && remove.Description != 'Cancel')
    // console.log(taskoptionsfilter,'taskoptionsfilter')

    const TaskOptions = taskoptionsfilter.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    const getPriorityTagColor = (Priority) => {
        switch (Priority && Priority.toLowerCase()) {
            case 'high':
                return 'red'; // Set your color for high priority
            case 'urgent':
                return 'purple'; // Set your color for urgent priority
            case 'low':
                return 'green'; // Set your color for low priority
            case 'medium':
                return 'blue'; // Set your color for medium priority
            default:
                return 'default'; // Set a default color if priority is not recognized
        }
    };

    const priorityTemplate = (rowData) => {
        const priorityColor = getPriorityTagColor(rowData.Priority);

        return <Tag
            color={priorityColor}
        >{rowData.Priority}</Tag>;
    };

    const assignToTemplate = (rowData) => {
        const assignToNames = rowData.ATFName + ' ' + rowData.ATLName

        return (
            assignToNames
        )
    };
    const getUserData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGetuserData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getUserData()
    }, [])
    const userOptions = getuserdata.map((display) => ({
        value: display.Id,
        label: display.FirstName + ' ' + display.LastName
    }));
    const handleLogDetails = (tno) => {
        setLogTNo(tno)
        setLogShow(true)
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                  <Tooltip title="Edit" >
                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                  </Tooltip>
                {/* <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button> */}
                <button className="log-btn" onClick={() => { handleLogDetails(rowData.TicketNo) }}>
                    <Tooltip title="TimeLine" >
                        <FaRegEye size={18} />
                    </Tooltip>
                </button>


                {/* <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o" /> </button> */}
            </div>
        );
    };
    // const groupedTasks = {};


    const filteredData = filterData.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        const ticketNumber = (item.Prefix || "") + (item.TicketNo || "");
        const lowerCaseTicketNumber = ticketNumber.toLowerCase();
        const lowerCaseDueDate = moment(item.ToDate).format('DD/MM/YYYY').toLowerCase();
        return (
            lowerCaseTicketNumber.includes(searchTermLowerCase) ||
            (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.TaskName && item.TaskName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.ATFName && item.ATFName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.ATLName && item.ATLName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.FirstName && item.FirstName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.LastName && item.LastName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.ProjectName && item.ProjectName?.toLowerCase().includes(searchTermLowerCase)) ||
            (lowerCaseDueDate && lowerCaseDueDate.includes(searchTermLowerCase)) ||
            (item.Priority && item.Priority?.toLowerCase().includes(searchTermLowerCase))
        );
    });

    // filterData is Changes to filteredData to serach in tables
    const runningtask = filteredData.filter((value) => value.TaskStatus === "InProgress");
    const pendingtask = filteredData.filter((value) => value.TaskStatus === "Pending");
    const completedtask = filteredData.filter((value) => value.TaskStatus === "Complete");
    const holdtask = filteredData.filter((value) => value.TaskStatus === "Hold");
    const canceltask = filteredData.filter((value) => value.TaskStatus === "Cancel");

    // runningtask.forEach((task) => {
    //     const projectName = task.ProjectName;
    //     if (!groupedTasks[projectName]) {
    //         groupedTasks[projectName] = [];
    //     }
    //     groupedTasks[projectName].push(task);
    // });

    const baseColumns = [
        // ... (other columns)
        {
            title: 'Ticket No',
            key: 'TicketNo',
            dataIndex: 'TicketNo',
            align: ['center'],
            // defaultSortOrder: 'descend',
            sorter: (a, b) => {
                const ticketNoA = (a.TicketNo || '').toString();  // Convert to string, treating null as empty string
                const ticketNoB = (b.TicketNo || '').toString();  // Convert to string, treating null as empty string

                return ticketNoA.localeCompare(ticketNoB);
            },
            sortDirections: ['ascend', 'descend'],
            width: 120,
            render: (text, record) => (
                <div>
                    <span>{record.Prefix + record.TicketNo}</span>
                  </div>
                ),
                // render: (text, record) => {
                //     const statusColor = getTableColor(record.TaskStatus); // Assuming you have a function to get the color based on the status
              
                //     return (
                //       <div style={{ borderLeft: `4px solid ${statusColor}`,height: '30px', display:'flex',alignItems:'center'}}>
                //         <span className='m-4'>{record.Prefix + record.TicketNo}</span>
                //       </div>
                //     );
                // },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Ticket"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const ticketNoA = (record.TicketNo || '').toString();  // Convert to string, treating null as empty string
                const prefixAndNumber = (record.Prefix + ticketNoA).toLowerCase();
                return prefixAndNumber.includes(value.toLowerCase());
            },
        },

        {
            title: 'Party Name',
            dataIndex: 'PartyName',
            sorter: (a, b) => {
                const partyNameA = a.PartyName || '';  // Treat null values as empty strings
                const partyNameB = b.PartyName || '';  // Treat null values as empty strings

                return partyNameA.localeCompare(partyNameB);
            },
            sortDirections: ['ascend', 'descend'],
            // align:['center'],
            width: 250,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Party"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const ticketNoA = (record.PartyName || '').toString();  // Convert to string, treating null as empty string
                return ticketNoA.toLowerCase().includes(value.toLowerCase());
            },

        },
        {
            title: 'Project Name',
            dataIndex: 'ProjectName',
            sorter: (a, b) => {
                const ProjectNameA = a.ProjectName || '';  // Treat null values as empty strings
                const ProjectNameB = b.ProjectName || '';  // Treat null values as empty strings

                return ProjectNameA.localeCompare(ProjectNameB);
            },
            sortDirections: ['ascend', 'descend'],
            // align:['center'],
            width: 160,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Project"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const ticketNoA = (record.ProjectName || '').toString();  // Convert to string, treating null as empty string
                return ticketNoA.toLowerCase().includes(value.toLowerCase());
            },

        },
        {
            title: 'Task Name',
            dataIndex: 'TaskName',
            sorter: (a, b) => {
                const TaskNameA = a.TaskName || '';  // Treat null values as empty strings
                const TaskNameB = b.TaskName || '';  // Treat null values as empty strings

                return TaskNameA.localeCompare(TaskNameB);
            },
            sortDirections: ['ascend', 'descend'],
            width: 180,

            // align:['center'],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Task"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const ticketNoA = (record.TaskName || '').toString();  // Convert to string, treating null as empty string
                return ticketNoA.toLowerCase().includes(value.toLowerCase());
            },

        },
        {
            title: 'Assign By',
            key: 'assignBy',
            render: assignByTemplate,
            sorter: (a, b) => a.AssignBy.localeCompare(b.AssignBy),
            sortDirections: ['ascend', 'descend'],
            // align:['center'],
            width: 140,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => record.FirstName.toLowerCase().includes(value.toLowerCase()),

        },
        {
            title: 'Assign To',
            key: 'assignTo',
            render: assignToTemplate,
            sorter: (a, b) => a.AssignBy.localeCompare(b.AssignBy),
            sortDirections: ['ascend', 'descend'],
            // align:['center'],
            width: 140,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm(); // Directly call confirm after clearing filters
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => record.ATFName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Due Date',
            key: 'DueDate',
            render: (text, record) =>  record.ToDate ? (moment(record.ToDate).format('DD/MM/YYYY')):"No Date",
            sorter: (a, b) => moment(a.ToDate).unix() - moment(b.ToDate).unix(),
            sortDirections: ['ascend', 'descend'],
            align: ['center'],
            width: 100,
            // defaultSortOrder: 'descend',
        },
        {
            title: 'Priority',
            key: 'priority',
            render: priorityTemplate,
            align: ['center'],
            width: 100
        },
        {
            title: 'Status',
            dataIndex: 'TaskStatus',
            key: 'status',
            fixed: 'right',
            width: 120,
            align: ['center'],
            render: (text, record) => (
                <Dropdown overlay={getStatusMenu(record)} trigger={['click']}>
                    <Tag color={getTagColor(text)} style={{ cursor: 'pointer' }}>
                        {text} <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </Tag>
                </Dropdown>
            ),
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 120,
            render: actionTemplate,
            align: ['center']
        }
        // ... (other columns)
    ];

    const remarkColumn = {
        title: 'Remark',
        dataIndex: 'Remark1+Remark2',
        align: ['center'],
        width: 180,
        render: (text, record) => (
            <span>{`${record.Remark1},${record.Remark2},${record.Remark3}`}</span>
        )
    };
    const categoryName = {
        title: 'Category Name',
        dataIndex: 'CategoryName',
        align: ['center'],
        width: 180,
    };
    const subcategoryName = {
        title: 'Sub-Category Name',
        dataIndex: 'Heading',
        align: ['center'],
        width: 180,
    };
    const columns = remarkshow
        ? [...baseColumns.slice(0, 4), remarkColumn, categoryName,subcategoryName, ...baseColumns.slice(4)]
        : baseColumns;
    const getStatusMenu = (record) => (
        <Menu onClick={({ key }) => handleStatusChange(record, key)}>
            {TaskOptions.map((option) => (
                <Menu.Item key={option.value} style={{ color: option.color }}>
                    {option.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleStatusChange = async (record, selectedStatus) => {
        // Handle the status change here
        // You might want to update the status in your state or make an API call to update the status
        try {
            const res = await axios.post(
                URL + '/api/Master/UpdateTask',
                {
                    Id: record.Id,
                    //"Cguid":"bb524407-ac21-490f-b71e-7721dcacc71f",
                    TaskStatus: selectedStatus
                },
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );
            if (res.data.Success) {
                if(TaskData){
                    TaskData() 
                }
                if(fetchCalenderData){
                    fetchCalenderData()
                }
                // if(filterData){
                //     filterData()
                // }
            
                // if (taskData) {
                //     taskData()
                // }
                // if (fetchCalenderData) {
                //     fetchCalenderData()
                // }
                // if (insertChartData) {
                //     insertChartData()
                // }
                // if (fetchCompleteTaskData) {
                //     fetchCompleteTaskData()
                // }
            }
            // if (fetchReportData) {
            //     fetchReportData()
            // }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getTagColor = (status) => {
        // Customize the color based on the status
        switch (status) {
            case 'InProgress':
                return 'blue';
            case 'Pending':
                return 'gold';
            case 'Complete':
                return 'green';
                case 'Hold':
                    return 'purple';
                case 'Cancel':
                    return 'red';
            default:
                return 'default';
        }
    };
    const getTableColor = (status) => {
        // Customize the color based on the status
        switch (status) {
            case 'InProgress':
                return 'blue';
            case 'Pending':
                return 'white';
            case 'Complete':
                return 'white';
                case 'Hold':
                    return 'white';
                case 'Cancel':
                    return 'white';
            default:
                return 'default';
        }
    };
    const handleRemarkShow = () => {
        setRemarkShow(!remarkshow)
    }
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }
    const totalRecords = filteredData.length; // Assuming filteredData is the data array
    const pendingRecords = pendingtask.length; // Assuming filteredData is the data array
    const runningRecords = runningtask.length; // Assuming filteredData is the data array
    const completedRecords = completedtask.length; // Assuming filteredData is the data array
    const holdRecords = holdtask.length; // Assuming filteredData is the data array
    const cancelRecords = canceltask.length; // Assuming filteredData is the data array

    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );
    const PendingRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{pendingRecords}</h5>
        </div>
    );
    const RunningRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{runningRecords}</h5>
        </div>
    );
    const CompleteRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{completedRecords}</h5>
        </div>
    );
    const HoldRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{holdRecords}</h5>
        </div>
    );
    const CancelRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{cancelRecords}</h5>
        </div>
    );
    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if ( Role == 'Admin' && event.key === 'F2') {
                setTaskNew(true)
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    return (
        <div className='mt-3'>
            <div className='user-wise-btn'>
                <div className='ms-2'>
                    {
                        Role == 'Admin' ? (
                            <Button className="btn btn-add rounded-2" onClick={() => setTaskNew(true)}>
                                 <i class="fa fa-plus" aria-hidden="true"/>Add Task[F2]
                            </Button>
                        ) : null
                    }
                    {/* <Button className='ms-2' onClick={reset}>
                        Reset
                    </Button> */}
                </div>
                <div className='d-flex'>
                    <Space align="center">
                        Show More Details: <Switch checked={remarkshow} onChange={handleRemarkShow} />
                    </Space>
                    <div className='searching-input'>
                        <input type="text" className='form-control' placeholder='Search here'
                            onChange={(event) => { setSearchInput(event.target.value) }}
                        />
                    </div>
                </div>

            </div>
            <TaskNewForm
                show={tasknew}
                onHide={() => setTaskNew(false)}
                fetchData={fetchData}
                fetchCalenderData={fetchCalenderData}
                fetchAssignByMeData={fetchAssignByMeData}
                insertChartData={insertChartData}
                TaskData={TaskData}
                fetchCompleteTaskData={fetchCompleteTaskData}
                fetchReportData={fetchReportData}
            />

            <Tabs
                defaultActiveKey="2"
                transition={true}
            >
                <TabPane key="1" tab="All Tasks">
                    <Table columns={columns} size='small' dataSource={filteredData} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={TotalRecordFooter}/>
                </TabPane>
                <TabPane key="2" tab="Pending Tasks">
                    <Table columns={columns} size='small' dataSource={pendingtask} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={PendingRecordFooter} />

                </TabPane>

                <TabPane key="3" tab="Running Tasks">

                    <Table columns={columns} size='small' dataSource={runningtask} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={RunningRecordFooter} />
                </TabPane>

                <TabPane key="4" tab="Completed Tasks">

                    <Table columns={columns} size='small' dataSource={completedtask} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={CompleteRecordFooter} />
                </TabPane>
                <TabPane key="5" tab="Hold Tasks">

                    <Table columns={columns} size='small' dataSource={holdtask} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={HoldRecordFooter} />
                </TabPane>
                <TabPane key="6" tab="Cancel Tasks">

                    <Table columns={columns} size='small' dataSource={canceltask} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={CancelRecordFooter} />
                </TabPane>
            </Tabs>
            {
                selectedRow ?
                    <EditData
                        show={taskshow}
                        onHide={() => setTaskshow(false)}
                        selectedRow={selectedRow}
                        fetchData={fetchData}
                        fetchCalenderData={fetchCalenderData}
                        fetchAssignByMeData={fetchAssignByMeData}
                        user={user}
                        TaskData={TaskData}
                        insertChartData={insertChartData}
                        fetchCompleteTaskData={fetchCompleteTaskData}
                        fetchReportData={fetchReportData}
                    /> : null
            }
            <TaskLogHistory
                show={logShow}
                onHide={() => setLogShow(false)}
                logtno={logtno}
            />
        </div>
    )
}

export default TaskDash