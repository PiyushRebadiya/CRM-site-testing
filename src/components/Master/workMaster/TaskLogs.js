import React, { useEffect } from 'react'
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline, Tag } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaRegUserCircle } from "react-icons/fa";

const TaskLogs = ({ logtno }) => {
        const [mode, setMode] = useState('left');
    const [logData, setLogData] = useState([])
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem("CRMtoken")
    const CRMCompanyId = localStorage.getItem('CRMCompanyId')

    const fetchLog = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/LogTableList?CompanyId=${CRMCompanyId}&TicketNo=${logtno}`, {
                headers: { Authorization: `bearer ${token}` }
            })
                        setLogData(res.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchLog()
    }, [])
    const getPriorityTagColor = (TaskStatus) => {
        // console.log(TaskStatus,"TaskStatus")
        switch (TaskStatus) {
            case 'Pending':
                return 'gold'; // Set your color for high priority
            case 'InProgress':
                return 'blue'; // Set your color for urgent priority
            case 'Complete':
                return 'green'; // Set your color for low priority
            case 'Hold':
                return 'volcano'; // Set your color for low priority
            case 'Cancel':
                return 'red'; // Set your color for low priority
            default:
                return 'default'; // Set a default color if priority is not recognized
        }
    };

    const priorityTemplate = (rowData, priorityColor) => {
        return (
            <Tag color={priorityColor}>{rowData.TaskStatus}</Tag>
        );
    }
    const childrendata = (item) => {
        const priorityColor = getPriorityTagColor(item.TaskStatus);
        return (
            <div className='log-history-data'>
                {/* <p>{item.EntryTime}</p> */}
                <p className='log-date'>{moment(item.EntryTime).format('DD MMM, YYYY h:mm A')}</p>
                <p className='log-taskname'>Task Name : <span>{item.TaskName}</span></p>
                <p className='process-name'>{item.ProcessName}</p>
                <span>{priorityTemplate(item, priorityColor)}</span>
                <p className='assignby-name'>By : <span>{item.ABF + '  ' + item.ABL}</span></p>
                {/* <p className='assignby-name'>Transfer By : <span>{item.UserName}</span></p> */}
                <p className='assignby-name'>AssignTo : <span>{item.ATF + '  ' + item.ATL}</span></p>
                <p className='assignby-name'>Remark : <span>{item.Remark}</span></p>
            </div>
        )
    }

    const timelineData = logData.map(item => ({
        // color:'blue',
        color: item.TaskStatus == 'InProgress' ? "blue" : item.TaskStatus == 'Complete' ? 'green' : 'gold',
        // label: item.EntryTime,
        children: childrendata(item),
    }));

    return (
        <div>
            <Timeline
                // mode='left'
                items={timelineData}
                // pending={timeLineStatus?.TaskStatus === 'Complete' ? undefined : 'In Progress'}
            />

        </div>
    )
}

export default TaskLogs