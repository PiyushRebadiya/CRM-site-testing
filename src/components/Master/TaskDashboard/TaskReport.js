import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import TaskChart from '../../Charts/TaskChart';
import TaskCompletedChart from '../../Charts/TaskCompletedChart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import TaskUserChart from '../../Charts/TaskUserChart';
import { Table, Tag, Space, Dropdown, Menu } from 'antd';

const { TabPane } = Tabs;

function TaskReport({ taskchartdata, taskcompletedata, report }) {
    // const [taskchartdata, setTaskchartData] = useState([])
    // const [taskcompletedata, setTaskcompletedata] = useState([])
    // const[report,setReport]=useState([])

    const [globalFilter, setGlobalFilter] = React.useState(null);

    const onGlobalFilterChange = (e) => {
        setGlobalFilter(e.target.value);
    };
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            position: ['bottomCenter']
        },
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const Role = localStorage.getItem('CRMRole')
    const userid = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL
    // const fetchData = async () => {
    //     try {
    //         if (Role == 'Admin') {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             // console.log(res, "response")
    //             setTaskchartData(res.data)
    //         }
    //         else {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
    //                 // const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setTaskchartData(res.data)
    //         }
    //         // setInquiryData(res.data);
    //         // console.log(res.data, 'datasforcharts');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const fetchTaskData = async () => {
    //     try {
    //         if (Role == 'Admin') {
    //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
    //             const res = await axios.get(URL + `/api/Master/TaskSummary?Type=Task&CompanyId=${companyId}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setReport(res.data)
    //             console.log(res.data, "reportcknnf")
    //         }
    //         else {
    //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
    //             const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setReport(res.data)
    //         }
    //         // setInquiryData(res.data);
    //         // console.log(res.data, 'datasforcharts');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const fetchReportData = async () => {
    //     try {

    //         if (Role == 'Admin') {
    //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
    //             const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setReport(res.data)
    //         }
    //         else {
    //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
    //             const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setReport(res.data)
    //         }
    //         // setInquiryData(res.data);
    //         // console.log(res.data, 'datasforcharts');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        // fetchData();
        // fetchReportData()
        // fetchTaskData()
    }, []);

    const OverdueTask = taskchartdata.filter((item) => item.Description == 'Pending')
    const Employee = (rowData)=>{
        const name = rowData.FirstName+ ' '+rowData.LastName
        return name
    }
    const TotalTask = (rowData)=>{
        {
            const totalTasks = parseFloat(rowData.Pending || 0) + parseFloat(rowData.Inprogress || 0) + parseFloat(rowData.Complete || 0);
            return totalTasks;
        }
    }
    const columns = [
        // ... (other columns)
        
        {
            title:'Employee',
            render: Employee,
            align: 'center',
            width: 150,
            fixed:'left'
        },
        {
            title:<Tag color='cyan'>Total Tasks</Tag>,
            render: TotalTask,
            align: 'center',
            width: 60,
            sorter: (a, b) => TotalTask(a) - TotalTask(b),
            // render: (text, record) => moment(record.ToDate).format('DD/MM/YYYY')
        },     
        {
            title:<Tag color='gold'>Pending</Tag>,
            dataIndex: 'Pending',
            align: 'center',
            width: 60,
            sorter: (a, b) => a.Pending - b.Pending,

            // render:assignByTemplate,
        },
        {
            title:<Tag color='blue'>Running</Tag>,
            dataIndex: 'Inprogress',
            align: 'center',
            width: 60,
            sorter: (a, b) => a.Inprogress - b.Inprogress,

        },
        {
            title:<Tag color='green'>Completed</Tag>,
            dataIndex: 'Complete',
            align: 'center',
            width: 60,
            sorter: (a, b) => a.Complete - b.Complete,
            // render:assignToTemplate,
        },
        {
            title:<Tag color='purple'>Hold</Tag>,
            dataIndex: 'Hold',
            align: 'center',
            width:60,
            sorter: (a, b) => a.Hold - b.Hold,

        },
        {
            title:<Tag color='red'>Cancel</Tag>,
            dataIndex: 'Cancel',
            align: 'center',
            width:60,
            sorter: (a, b) => a.Cancel - b.Cancel,

        },
      ];
    return (
        <div className='p-2'>
            <Row>
                <Col>
                    <div>
                        <Table columns={columns} dataSource={report} pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{x:800}} 
                        size='small'
                         />
                    </div>
                </Col>
                {/* <Col xl={6} lg={6} style={{ borderLeft: '1px solid teal' }}>
                        {
                            Role != 'Admin' ? (
                                <Tabs tabPosition="top">
                                    <TabPane tab='All Task' key='1'>
                                        <TaskUserChart taskchartdata={taskchartdata} />
                                    </TabPane>
                                </Tabs>
                            ) : <Tabs tabPosition="top">
                            <TabPane tab='All Task' key='1'>
                                <TaskChart taskchartdata={taskchartdata} />
                            </TabPane>
                            <TabPane tab='Complete Task' key='2'>
                                <TaskCompletedChart taskcompletedata={taskcompletedata} />
                            </TabPane>
                        </Tabs>
                        }
                </Col> */}
            </Row>
            {/* <Tabs tabPosition="left">
                <TabPane tab="Report" key="1">

                </TabPane>
                <TabPane tab="Task Chart" key="2">
                    <div>

                    </div>
                </TabPane>
              
            </Tabs> */}
        </div>
    )
}

export default TaskReport