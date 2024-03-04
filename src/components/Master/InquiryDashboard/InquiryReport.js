import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import TaskChart from '../../Charts/TaskChart';
import TaskCompletedChart from '../../Charts/TaskCompletedChart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import InquriryChart from '../../Charts/InquriryChart';
import InquriryCompltedChart from '../../Charts/InquiryCompltedChart';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import InquiryUserChart from '../../Charts/InquiryUserChart';
import { Table, Tag, Space, Dropdown, Menu } from 'antd';

const { TabPane } = Tabs;

function InquiryReport({ chartinqurydata, completeinquiry, report }) {
    // console.log(chartinqurydata,'chartinquririt')
    const [globalFilter, setGlobalFilter] = React.useState(null);
    // const[report,setReport]=useState([])
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const companyId = localStorage.getItem("CRMCompanyId")
    const Role = localStorage.getItem('CRMRole')
    const userid = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL
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
    // const OverdueTask = chartinqurydata.filter((item) => item.Description == 'Pending')
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
            fixed:'left',
            width:180
        },
        {
            title:<Tag color='cyan'>Total Inquiry</Tag>,
            render: TotalTask,
            align: 'center',
            sorter: (a, b) => TotalTask(a) - TotalTask(b),
            width:120
        },
        {
            title:<Tag color='gold'>Pending</Tag>,
            dataIndex: 'Pending',
            align: 'center',
            sorter: (a, b) => a.Complete - b.Complete,

            width:120
        },
        {
            title:<Tag color='blue'>Running</Tag>,
            dataIndex: 'Inprogress',
            align: 'center',
            sorter: (a, b) => a.Inprogress - b.Inprogress,

            width:120
        },
        {
            title:<Tag color='green'>Completed</Tag>,
            dataIndex: 'Complete',
            align: 'center',
            sorter: (a, b) => a.Complete - b.Complete,
            width:120
        },
        {
            title:<Tag color='purple'>Hold</Tag>,
            dataIndex: 'Hold',
            align: 'center',
            sorter: (a, b) => a.Hold - b.Hold,
            width:120
        },
        {
            title:<Tag color='red'>Cancel</Tag>,
            dataIndex: 'Cancel',
            align: 'center',
            sorter: (a, b) => a.Cancel - b.Cancel,
            width:120
        },
      
      ];
    return (
        <div className='p-2'>
            <Row>
                <Col>
                    {/* <DataTable
                        globalFilter={globalFilter}
                        value={report}
                        paginator rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    >
                        <Column field={(rowdata) => rowdata.FirstName + ' ' + rowdata.LastName} header="Employee"/>
                        <Column field="Pending" header={<Tag severity='danger'>Pending</Tag>} sortable />
                        <Column field="Inprogress" header={<Tag severity='warning'>Running</Tag>} sortable />
                        <Column field="Complete" header={<Tag severity='success'>Completed</Tag>} sortable />
                        <Column
                            body={(rowData) => {
                                const totalTasks = parseFloat(rowData.Pending || 0) + parseFloat(rowData.Inprogress || 0) + parseFloat(rowData.Complete || 0);
                                return totalTasks;
                            }}
                            header={<Tag severity='info'>Total Tasks</Tag>}
                        />
                    </DataTable> */}
                      <Table columns={columns} dataSource={report} size='small'pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{x:'1800'}}/>
                </Col>
                {/* <Col xl={6} lg={6} style={{ borderLeft: '1px solid teal' }}>
                    {
                        Role != 'Admin' ? (
                            <Tabs tabPosition="top">
                                <TabPane tab='All Task' key='1'>
                                    <InquiryUserChart chartinqurydata={chartinqurydata} />
                                </TabPane>
                            </Tabs>
                        ) : <Tabs tabPosition="top">
                            <TabPane tab='All Task' key='1'>
                                <InquriryChart chartinqurydata={chartinqurydata} />
                            </TabPane>
                            <TabPane tab='Complete Task' key='2'>
                                <InquriryCompltedChart completeinquiry={completeinquiry} />
                            </TabPane>
                        </Tabs>
                    }
                </Col> */}
            </Row>
        </div>
    )
}

export default InquiryReport