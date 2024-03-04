import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import moment from 'moment';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import { Tag } from 'primereact/tag';
import Modal from 'react-bootstrap/Modal'
// import TaskForm from '../components/Master/workMaster/TaskForm';
import InquiryForm from '../Inquiry Master/InquiryForm';
// import TaskDashForm from './TaskDashForm';
import InquiryDashForm from './InquiryDashForm';
import { Button,Offcanvas } from 'react-bootstrap';
import { Table, Tag, Space, Dropdown, Menu, Input, Switch,Tooltip } from 'antd';
import { FaRegEye } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import TaskLog from '../workMaster/TaskLogs'

function TaskLogHistory(props) {
    const {logtno} = props
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

const { TabPane } = Tabs;
function InquiryNewForm(props) {
    const { fetchData, insertCalenderData, fetchAssignByMeData, insertChartData, fetchCompleteData, fetchReportData,InqueryMainData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <InquiryForm onHide={props.onHide} fetchData={fetchData} insertCalenderData={insertCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} InqueryMainData={InqueryMainData} />
        </Modal>
    );
}

function EditData(props) {
    const { selectedRow, fetchData, insertCalenderData, fetchAssignByMeData, user, insertChartData, fetchCompleteData, fetchReportData,InqueryMainData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <InquiryForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} insertCalenderData={insertCalenderData} insertChartData={insertChartData} fetchAssignByMeData={fetchAssignByMeData} user={user} fetchCompleteData={fetchCompleteData} fetchReportData={fetchReportData} InqueryMainData={InqueryMainData} />
        </Modal>
    );
}

const InquiryDash = ({ resetData, filterData, insertData, ondata, insertCalenderData, insertChartData, fetchCompleteData, fetchReportData,InqueryMainData }) => {
    React.useEffect(() => {
        insertData.current = fetchData
        resetData.current = fetchData
    }, [])
    useEffect(() => {
        if (filterData) {
            setInquiryData(filterData)
        }
    }, [filterData])
    const [inquirynew, setInquiryNew] = useState(false);
    const [inquiryData, setInquiryData] = useState([]);
    const [inquiryshow, setInquiryshow] = useState("")
    const [selectedRow, setSelectedRow] = useState([]);
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const userid = localStorage.getItem('CRMUserId')
    const companyId = localStorage.getItem("CRMCompanyId")
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')
    const [assignbytask, setAssignbytask] = useState([])
    const [user, setUser] = useState(false)
    const [masterData, setMasterData] = useState([]);
    const [remarkshow, setRemarkShow] = useState(false)
    const [searchinput, setSearchInput] = useState("")
    const [logShow, setLogShow] = React.useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setInquiryData(res.data)
            ondata(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // fetchData()
    }, [])
    const reset = () => {
        fetchData()
    }
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
            setInquiryshow(true)
            setUser(true)
            // console.log(res, "updateid")

        } catch (error) {
            console.log(error)
        }
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
    const statusTemplate = (rowData) => {
        // const statusColorClass = rowData.TaskStatus === 'Completed' ? 'bg-success' : 'bg-danger';
        let statusStyle = {};

        let statusColorClass = '';

        switch (rowData.TaskStatus) {
            case 'Complete':
                statusStyle = {
                    background: 'linear-gradient(to right, #DAF5E6, #D9F8C4)',
                    color: '#3AC977',
                };
                break;
            case 'InProgress':
                statusStyle = {
                    background: 'linear-gradient(to right, #FFD6A5, #FFD4D4)',
                    color: '#CE5A67',
                };
                break;
            case 'Pending':
                statusStyle = {
                    background: 'linear-gradient(to right, #BB6BD91A, #FFD4D4)',
                    color: '#FF7D7D',
                };
                break;
            default:
                statusStyle = '';
        }

        return <Tag style={statusStyle}>{rowData.TaskStatus}</Tag>;
    };
    const getPriorityTagColor = (priority) => {
        switch (priority && priority.toLowerCase()) {
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

        return <Tag color={priorityColor}>{rowData.Priority}</Tag>;
    };

    const assignToTemplate = (rowData) => {
        const assignToNames = rowData.ATFName + ' ' + rowData.ATLName

        return (
            assignToNames
        )
    };
    const [logtno,setLogTNo]=useState('')
    const handleLogDetails=(tno)=>{
        setLogTNo(tno)
        setLogShow(true)
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <Tooltip title='Edit'>
                <button type="button" className="btn btn-add btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                <button className="log-btn" onClick={()=>{handleLogDetails(rowData.Cguid)}}>  <Tooltip title='TimeLine'>
                    <FaRegEye size={18} />
                </Tooltip></button>
                {/* <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o" /> </button> */}
            </div>
        );
    };
    const groupedInquiry = {};
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

    const runninginquiry = filteredData.filter((value) => value.TaskStatus === "InProgress");
    const pendinginquiry = filteredData.filter((value) => value.TaskStatus === "Pending");
    const completedinquiry = filteredData.filter((value) => value.TaskStatus === "Complete");
    const holdinquiry = filteredData.filter((value) => value.TaskStatus === "Hold");
    const cancelinquiry = filteredData.filter((value) => value.TaskStatus === "Cancel");
    runninginquiry.forEach((inquiry) => {
        const projectName = inquiry.ProjectName;
        if (!groupedInquiry[projectName]) {
            groupedInquiry[projectName] = [];
        }
        groupedInquiry[projectName].push(inquiry);
    });
    const getTagColor = (status) => {

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

    const baseColumns = [
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
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search TicketNo"
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
                return ticketNoA.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: 'Party Name',
            dataIndex: 'PartyName',
            width: 250,
            sorter: (a, b) => {
                const partyNameA = a.PartyName || '';  // Treat null values as empty strings
                const partyNameB = b.PartyName || '';  // Treat null values as empty strings
                return partyNameA.localeCompare(partyNameB);
            },
            sortDirections: ['ascend', 'descend'],
            // align: ['center'],
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
                const projectNameA = a.ProjectName || '';  // Treat null values as empty strings
                const projectNameB = b.ProjectName || '';  // Treat null values as empty strings
                return projectNameA.localeCompare(projectNameB);
            },
            sortDirections: ['ascend', 'descend'],
            // align: ['center'],
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
            title: 'Category Name',
            dataIndex: 'CategoryName',
            sorter: (a, b) => a.CategoryName.localeCompare(b.CategoryName),
            sortDirections: ['ascend', 'descend'],
            width: 180,
            // align: ['center'],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Category"
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
                const ticketNoA = (record.CategoryName || '').toString();  // Convert to string, treating null as empty string
                return ticketNoA.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: 'Inquiry Name',
            dataIndex: 'TaskName',
            sorter: (a, b) => a.TaskName.localeCompare(b.TaskName),
            sortDirections: ['ascend', 'descend'],
            width: 180,
            // align: ['center'],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Inquiry"
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
            width: 140,
            sorter: (a, b) => a.AssignTo.localeCompare(b.AssignTo),
            sortDirections: ['ascend', 'descend'],
            // align: ['center'],
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
            title: 'Assign To',
            key: 'assignTo',
            render: assignToTemplate,
            width: 140,
            sorter: (a, b) => a.AssignTo.localeCompare(b.AssignTo),
            sortDirections: ['ascend', 'descend'],
            // align: ['center'],
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
            render: (text, record) => moment(record.ToDate).format('DD/MM/YYYY'),
            sorter: (a, b) => moment(a.ToDate).unix() - moment(b.ToDate).unix(),
            sortDirections: ['ascend', 'descend'],
            align: ['center'],
            width: 100,
            // defaultSortOrder: 'descend',
        },
        // {
        //     title: 'Priority',
        //     key: 'priority',
        //     render: priorityTemplate,
        //     align: ['center'],
        //     width: 100
        // },
        {
            title: 'Status',
            dataIndex: 'TaskStatus',
            key: 'status',
            align: ['center'],
            width: 120,
            fixed: 'right',
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
            render: actionTemplate,
            align: ['center'],
            fixed: 'right',
            width: 120
        }
        // ... (other columns)
    ];
    const remarkColumn = {
        title: 'Remark',
        dataIndex: 'Remark1+Remark2',
        width: 120,
        // align: ['center'],
        render: (text, record) => (
            <span>{`${record.Remark1},${record.Remark2},${record.Remark3}`}</span>
        )
    };

    const priorityColumn = {
        title: 'Priority',
        width: 120,
        render: priorityTemplate,
    };

    const columns = remarkshow
        ? [...baseColumns.slice(0, 5), remarkColumn, priorityColumn, ...baseColumns.slice(5)]
        : baseColumns;


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

    const taskoptionsfilter = taskoptions.filter((remove)=>remove.Description != 'Hold' && remove.Description != 'Cancel')
    // console.log(taskoptionsfilter,'taskoptionsfilter')

    const TaskOptions = taskoptionsfilter.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    const handleStatusChange = async (record, selectedStatus) => {
        // Handle the status change here
        // console.log(`Task ID ${record.Id} status changed to: ${selectedStatus}`);
        // You might want to update the status in your state or make an API call to update the status
        try {
            const res = await axios.post(
                URL + '/api/Master/UpdateTask',
                {
                    // Flag: 'U',
                    // task: {
                    //     Id: rowData.Id,  
                    //     Cguid: rowData.Cguid,
                    //     ProjectId: rowData.ProjectId,
                    //     TaskName: rowData.TaskName,
                    //     UserId: rowData.UserId,
                    //     CategoryId: rowData.CategoryId,
                    //     PartyId: rowData.PartyId,
                    //     TaxadminId: rowData.TaxadminId,
                    //     TaskStatus: statusChanger,
                    //     AssignBy: rowData.AssignBy,
                    //     AssignTo: rowData.AssignTo,
                    //     Priority: rowData.Priority,
                    //     FromDate: rowData.FromDate,
                    //     ToDate: rowData.ToDate,
                    //     CustId: rowData.CustId,
                    //     Type: 'Task',
                    //     CompanyID: companyId,
                    //     Remark1: rowData.Remark1,
                    //     Remark2: rowData.Remark2,
                    //     Remark3: rowData.Remark3,
                    // },
                    Id: record.Id,
                    //"Cguid":"bb524407-ac21-490f-b71e-7721dcacc71f",
                    TaskStatus: selectedStatus
                },
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );
            if (res.data.Success) {
                InqueryMainData()
                fetchData()
                if (insertCalenderData) {
                    insertCalenderData()
                }
                if (fetchAssignByMeData) {
                    fetchAssignByMeData()
                }
                if (insertChartData) {
                    insertChartData()
                }
                if (fetchCompleteData) {
                    fetchCompleteData()
                }
                if (fetchReportData) {
                    fetchReportData()
                }
            }
            if (fetchReportData) {
                fetchReportData()
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    const getStatusMenu = (record) => (
        <Menu
            onClick={({ key }) => handleStatusChange(record, key)}
        >
            {TaskOptions.map((option) => (
                <Menu.Item key={option.value} style={{ color: option.color }}>
                    {option.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    const fetchAssignByMeData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setAssignbytask(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (Role != 'Admin') {
            fetchAssignByMeData()
        }
    }, [])
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
    const pendingRecords = pendinginquiry.length; // Assuming filteredData is the data array
    const runningRecords = runninginquiry.length; // Assuming filteredData is the data array
    const completedRecords = completedinquiry.length; // Assuming filteredData is the data array
    const holdRecords = holdinquiry.length; // Assuming filteredData is the data array
    const cancelRecords = cancelinquiry.length; // Assuming filteredData is the data array

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
            if (Role == 'Admin' && event.key === 'F2') {
                setInquiryNew(true)
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
        <div className='p-3'>
            <div className='user-wise-btn'>
                <div>
                    {
                        Role == 'Admin' ? (
                            <Button className="btn btn-add rounded-2" onClick={() => setInquiryNew(true)}>
                               <i class="fa fa-plus" aria-hidden="true"></i>Add Inquiry[F2]
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
            <InquiryNewForm
                show={inquirynew}
                onHide={() => setInquiryNew(false)}
                fetchData={insertData.current}
                insertCalenderData={insertCalenderData}
                fetchAssignByMeData={fetchAssignByMeData}
                insertChartData={insertChartData}
                fetchCompleteData={fetchCompleteData}
                fetchReportData={fetchReportData}
                InqueryMainData={InqueryMainData}
            />
            <Tabs
                defaultActiveKey="2"
                transition={true}
            >
                <TabPane key="1" tab="All Inquiry">
                    {/* <DataTable value={inquiryData} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="PartyName" header="Party Name" />
                        <Column field="CategoryName" header="Category Name" />
                        <Column field="TaskName" header="Task" />
                        <Column body={assignByTemplate}
                            header="Assign By" />
                        <Column body={assignToTemplate}
                            header="Assign To" />
                        <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YYYY')} header="Due Date" />
                        <Column body={priorityTemplate} header="Priority" />
                        <Column body={statusTemplate} header="Status" />
                        <Column
                            body={actionTemplate}
                            header="Actions"
                            style={{ textAlign: 'center', width: '8em' }}
                        />
                    </DataTable> */}
                    <Table columns={columns} size='small' dataSource={filteredData} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={TotalRecordFooter} />
                </TabPane>
                <Tabs key="2" tab="Pending Inquiry">
                    {/* <DataTable
                        value={pendinginquiry}
                        paginator rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="PartyName" header="Party Name" />
                        <Column field="CategoryName" header="Category Name" />
                        <Column field="TaskName" header="Task" />
                        <Column body={assignByTemplate}
                            header="Assign By" />
                        <Column body={assignToTemplate}
                            header="Assign To" />
                        <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YYYY')} header="Due Date" />
                        <Column body={priorityTemplate} header="Priority" />
                        <Column body={statusTemplate} header="Status" />
                        <Column
                            body={actionTemplate}
                            header="Actions"
                            style={{ textAlign: 'center', width: '8em' }}
                        />
                    </DataTable> */}
                    <Table columns={columns} size='small' dataSource={pendinginquiry} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={PendingRecordFooter} />
                </Tabs>

                <Tabs key="3" tab="Running Inquiry">
                    {/* <DataTable
                        value={runninginquiry}
                        paginator rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="PartyName" header="Party Name" />
                        <Column field="CategoryName" header="Category Name" />
                        <Column field="TaskName" header="Task" />
                        <Column body={assignByTemplate}
                            header="Assign By" />
                        <Column body={assignToTemplate}
                            header="Assign To" />
                        <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YYYY')} header="Due Date" />
                        <Column body={priorityTemplate} header="Priority" />
                        <Column body={statusTemplate} header="Status" />
                        <Column
                            body={actionTemplate}
                            header="Actions"
                            style={{ textAlign: 'center', width: '8em' }}
                        />
                    </DataTable> */}
                    <Table columns={columns} size='small' dataSource={runninginquiry} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={RunningRecordFooter} />
                </Tabs>

                <Tabs key="4" tab="Completed Inquiry">
                    {/* <DataTable
                        value={completedinquiry}
                        paginator rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}>
                        <Column field="PartyName" header="Party Name" />
                        <Column field="CategoryName" header="Category Name" />
                        <Column field="TaskName" header="Task" />
                        <Column body={assignByTemplate}
                            header="Assign By" />
                        <Column body={assignToTemplate}
                            header="Assign To" />
                        <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YYYY')} header="Due Date" />
                        <Column body={priorityTemplate} header="Priority" />
                        <Column body={statusTemplate} header="Status" />
                        <Column
                            body={actionTemplate}
                            header="Actions"
                            style={{ textAlign: 'center', width: '8em' }}
                        />
                    </DataTable> */}
                    <Table columns={columns} size='small' dataSource={completedinquiry} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={CompleteRecordFooter} />
                </Tabs>
                <Tabs key='5' tab="Hold Inquiry">
                <Table columns={columns} size='small' dataSource={holdinquiry} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={HoldRecordFooter} />
                </Tabs>
                <Tabs key='6' tab="Cancel Inquiry">
                <Table columns={columns} size='small' dataSource={cancelinquiry} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }} footer={CancelRecordFooter} />
                </Tabs>
                {/* {
                    Role != 'Admin' ? (
                        <Tab eventKey='6' title='Assign By Me'>
                            <DataTable
                                value={assignbytask}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column field="PartyName" header="Party Name" />
                                <Column field="CategoryName" header="Category Name" />
                                <Column field="TaskName" header="Task" />
                                <Column body={assignByTemplate}
                                    header="Assign By" />
                                <Column body={assignToTemplate}
                                    header="Assign To" />
                                <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YYYY')} header="Due Date" />
                                <Column body={priorityTemplate} header="Priority" />
                                <Column body={statusTemplate} header="Status" />
                                <Column
                                    body={actionTemplate}
                                    header="Actions"
                                    style={{ textAlign: 'center', width: '8em' }}
                                />
                            </DataTable>
                        </Tab>
                    ) : null
                } */}
            </Tabs>
            {
                selectedRow ?
                    <EditData
                        show={inquiryshow}
                        onHide={() => setInquiryshow(false)}
                        selectedRow={selectedRow}
                        fetchData={fetchData}
                        insertCalenderData={insertCalenderData}
                        insertChartData={insertChartData}
                        fetchAssignByMeData={fetchAssignByMeData}
                        user={user}
                        fetchCompleteData={fetchCompleteData}
                        fetchReportData={fetchReportData}
                        InqueryMainData={InqueryMainData}
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

export default InquiryDash