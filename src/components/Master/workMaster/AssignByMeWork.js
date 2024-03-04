import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'antd';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { async } from 'q';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal'
import TaskForm from './TaskForm';
import Swal from 'sweetalert2';
import Tab from 'react-bootstrap/Tab';
import TaskCalender from './TaskCalender';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Calender from './Calender'
// import Select from 'react-select';
import { Tabs, Table, Dropdown, Button, Input, Menu, Space, Switch } from 'antd';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;
const { Option } = Select;
function EditData(props) {
    const { selectedRow, fetchData, fetchAssignByMeData, insertABMCalenderData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <TaskForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} fetchAssignByMeData={fetchAssignByMeData} AssignByMeTaskData={insertABMCalenderData} />
        </Modal>
    );
}

function AssignByMeWork({ insertABMCalenderData, getTaxadmindata, getCategorydata, AsignByInsert }) {
    React.useEffect(() => {
        AsignByInsert.current = fetchAssignByMeData
    }, [])
    const [expandedRows, setExpandedRows] = useState([]);
    const [masterdata, setMasterData] = useState([]);
    const [data, setData] = useState([])
    const [taskshow, setTaskshow] = useState("")
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectlist, setProjectList] = useState([])
    const [assignbytask, setAssignbytask] = useState([])

    // const [activeAccordionItem, setActiveAccordionItem] = useState(null);
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const userid = localStorage.getItem('CRMUserId')
    const [activeKey, setActiveKey] = useState('');
    const [remarkshow, setRemarkShow] = useState(false)
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')

    const [selectedTab, setSelectedTab] = useState('runningtask');
    const tabOptions = [
        { label: 'All Tasks', value: 'all' },
        { label: 'Running Task', value: 'runningtask' },
        { label: 'Pending Task', value: 'pendingtask' },
        { label: 'Completed Task', value: 'completedtask' },
        { label: 'Calender', value: 'Calender' },
    ];

    const handleTabChange = (key) => {
        setSelectedTab(key);
    };

    const fetchData = async () => {
        try {
            if (Role == 'Admin') {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? ' ' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setData(res.data)
                // console.log(res.data,'rrererererer')
            }
            else {
                const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setData(res.data)
            }
            // console.log(res.data, 'resss')
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAssignByMeData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=&AssignTo=`, {

                headers: { Authorization: `bearer ${token}` }
            })
            // console.log(res.data, "datatattat")
            setAssignbytask(res.data)
            // ondata(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getProjectData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // console.log(res, "response")
            setProjectList(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
        getProjectData()
        masterData()
        fetchAssignByMeData()
    }, [])

    const updatedata = async (rowData) => {
        const Id = rowData.Id
        try {
            const res = await axios.get(URL + `/api/Master/TasklistById?Id=${Id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            setSelectedRow(res.data);
            setTaskshow(true)
            // console.log(res, "updateid")

        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (id) => {
        const timerDuration = 2000; // 4000 milliseconds = 4 seconds
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            // timer: timerDuration,
            timerProgressBar: true,
            // onClose: () => {
            //     // Optional: Perform any action when the timer expires
            //     console.log('Timer expired');
            // }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData(id)
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'No changes have been made.',
                    icon: 'error',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            }
        });
    };

    const deleteData = async (rowData) => {
        const Id = rowData.Id
        try {
            const res = await axios.get(URL + `/api/Master/Deletetask?Id=${Id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            fetchAssignByMeData()
            getCategorydata()
        } catch (error) {
            console.log(error)
        }
    }
    const masterData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/mst_Master`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setMasterData(res.data, "MAsterAPI");
        } catch (error) {
            console.log(error)
        }
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <button type="button" style={{ backgroundColor: '#77D970' }} className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                <button type="button" style={{ backgroundColor: '#B91646' }} className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
            </div>
        );
    };
    // const statusTemplate = (rowData) => {
    //     // const statusColorClass = rowData.TaskStatus === 'Completed' ? 'bg-success' : 'bg-danger';
    //     let statusColorClass = '';

    //     switch (rowData.Description) {
    //         case 'Complete':
    //             statusColorClass = 'bg-success';
    //             break;
    //         case 'Inprogress':
    //             statusColorClass = 'bg-danger';
    //             break;
    //         case 'Pending':
    //             statusColorClass = 'bg-warning';
    //             break;
    //         default:
    //             statusColorClass = '';
    //     }

    //     return <Tag className={statusColorClass}>{rowData.Description}</Tag>;
    // };
    const statusTemplate = (rowData) => {
        // console.log(rowData,'reowdaatarf')
        // const statusColorClass = rowData.TaskStatus === 'Completed' ? 'bg-success' : 'bg-danger';
        let statusStyle = {};

        let statusColorClass = '';

        switch (rowData.TaskStatus) {
            case 'Complete':
                statusStyle = "green";
                break;
            case 'InProgress':
                statusStyle = "blue";
                break;
            case 'Pending':
                statusStyle = "gold";
                break;
            default:
                statusStyle = '';
        }

        return <Tag color={statusStyle}>{rowData.TaskStatus}</Tag>;
    };
    // const priorityTemplate = (rowData) => {
    //     let priorityColorClass = '';

    //     switch (rowData.Priority) {
    //         case 'High':
    //             priorityColorClass = 'bg-yellow';
    //             break;
    //         case 'Urgent':
    //             priorityColorClass = 'bg-warning';
    //             break;
    //         case 'Low':
    //             priorityColorClass = 'bg-info';
    //             break;
    //         default:
    //             priorityColorClass = '';
    //     }

    //     return <Tag className={priorityColorClass}>{rowData.Priority}</Tag>;
    // };
    const priorityTemplate = (rowData) => {
        let priorityStyle = {};

        switch (rowData.Priority) {
            case 'High':
                priorityStyle = "red";
                break;
            case 'Urgent':
                priorityStyle = "purple";
                break;
            case 'Low':
                priorityStyle = "green";
                break;
            default:
                priorityStyle = "";
        }

        return <Tag color={priorityStyle}>{rowData.Priority}</Tag>;
    };
    const assignByTemplate = (rowData) => {
        const assignByName = rowData.FirstName + ' ' + rowData.LastName;
        const backgroundColor = '#205375';

        // const avatar = (
        //     <div
        //         className="avatar"
        //         style={{
        //             width: '30px',
        //             height: '30px',
        //             borderRadius: '50%',
        //             backgroundColor, // Use the generated background color
        //             color: 'white',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //             marginRight: '10px',
        //         }}
        //     >
        //         {assignByName.charAt(0).toUpperCase()}
        //     </div>
        // );

        return (
            assignByName
        );
    };
    const assignToTemplate = (rowData) => {
        const assignToNames = rowData.ATFName + rowData.ATLName

        return (
            // <div style={{ display: 'flex', alignItems: 'center' }}>
            //     {avatars}
            // </div>
            assignToNames
        );
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
    const taskoptions = masterdata.filter((display) => display.Remark === "TaskStatus");
    // console.log(taskoptions,'taskkkkk')

    const taskoptionsfilter = taskoptions.filter((remove) => remove.Description != 'Hold' && remove.Description != 'Cancel')
    // console.log(taskoptionsfilter,'taskoptionsfilter')

    const TaskOptions = taskoptionsfilter.map((display) => ({
        value: display.Description,
        label: display.Description,
    }))
    const getStatusMenu = (record) => (
        <Menu onClick={({ key }) => handleStatusChange(record, key)}>
            {TaskOptions.map((option) => (
                <Menu.Item key={option.value} style={{ color: option.color }}>
                    {option.label}
                </Menu.Item>
            ))}
        </Menu>
    );
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
                if (fetchAssignByMeData) {
                    fetchAssignByMeData()
                }
                if (insertABMCalenderData) {
                    insertABMCalenderData()
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
            title: 'From Date',
            key: 'FromDate',
            render: (text, record) => moment(record.FromDate).format('DD/MM/YYYY'),
            sorter: (a, b) => moment(a.FromDate).unix() - moment(b.FromDate).unix(),
            sortDirections: ['ascend', 'descend'],
            align: ['center'],
            width: 120,
            // defaultSortOrder: 'descend',
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
    ]
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
        ? [...baseColumns.slice(0, 4), remarkColumn, categoryName, subcategoryName, ...baseColumns.slice(4)]
        : baseColumns;
    // Create an array of unique project names from the data
    const projectNames = [...new Set(data.map((item) => item.ProjectName))];
    // console.log(projectNames,'projectnanna')
    return (
        <>
            <Tabs
                // activeKey={activeKey}
                defaultActiveKey="1"
                onChange={(key) => setActiveKey(key)}
                tabPosition="left"
            >
                {projectNames.map((projectName) => (
                    <TabPane tab={projectName} key={projectName}>
                        <div className='user-wise-btn'>
                            <Select
                                className='w-25  pb-2'
                                value={selectedTab} // Set the value of the selected tab
                                onChange={handleTabChange}
                            >
                                <Option value="all">All Tasks</Option>
                                <Option value="runningtask">Running Task</Option>
                                <Option value="pendingtask">Pending Task</Option>
                                <Option value="completedtask">Completed Task</Option>
                                <Option value="holdtask">Hold Task</Option>
                                <Option value="canceltask">Cancel Task</Option>
                                <Option value="Calender">Calender</Option>
                            </Select>
                            <div className='d-flex me-5'>
                                <Space align="center">
                                    Show More Details: <Switch checked={remarkshow} onChange={handleRemarkShow} />
                                </Space>
                            </div>
                        </div>
                        {selectedTab === 'all' && (
                            // <DataTable
                            //     value={assignbytask.filter((item) => item.ProjectName === projectName)}
                            //     paginator rows={10}
                            //     rowsPerPageOptions={[5, 10, 25, 50]}>
                            //     <Column field="ProjectName" header="Project Name" />
                            //     <Column field="TaskName" header="Task" />
                            //     <Column body={assignByTemplate}
                            //         header="Assign By" />
                            //     <Column body={assignToTemplate}
                            //         header="Assign To" />
                            //     <Column field={(rowData) => moment(rowData.FromDate).format('DD/MM/YYYY')} header="From Date" />
                            //     <Column field={(rowData) => moment(rowData.ToDate).format('DD/MM/YY')} header="Due Date" />
                            //     <Column body={priorityTemplate} header="Priority" />
                            //     <Column body={statusTemplate} header="Status" />
                            //     <Column
                            //         body={actionTemplate}
                            //         header="Actions"
                            //         style={{ textAlign: 'center', width: '8em' }}
                            //     />
                            // </DataTable>
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName)} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'runningtask' && (
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName && item.TaskStatus === 'InProgress')} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'pendingtask' && (
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName && item.TaskStatus === 'Pending')} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'completedtask' && (
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName && item.TaskStatus === 'Complete')} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'holdtask' && (
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName && item.TaskStatus === 'Hold')} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'canceltask' && (
                            <Table dataSource={assignbytask.filter((item) => item.ProjectName === projectName && item.TaskStatus === 'Cancel')} columns={columns} size='small' scroll={{ x: 500 }} pagination={tableParams.pagination}
                                onChange={handleTableChange} />
                        )}
                        {selectedTab === 'Calender' && (
                            <div>
                                <div className="col-lg-12 pinpin">
                                    <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                        <div className="card-header">
                                            <div className="card-title custom_title">
                                                <h4>Task Calender</h4>
                                            </div>
                                        </div>
                                        <Calender selectedProject={projectName} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabPane>
                ))}
            </Tabs>
            {
                selectedRow ?
                    <EditData
                        show={taskshow}
                        onHide={() => setTaskshow(false)}
                        selectedRow={selectedRow}
                        fetchData={fetchData}
                        fetchAssignByMeData={fetchAssignByMeData}
                        insertABMCalenderData={insertABMCalenderData}
                    /> : null
            }
        </>
    )
}
export default AssignByMeWork