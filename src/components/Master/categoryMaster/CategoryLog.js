import React, { useEffect } from 'react'
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline, Tag } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaRegUserCircle } from "react-icons/fa";

const CategoryLog = ({ logtno }) => {
    const [mode, setMode] = useState('left');
    const [logData, setLogData] = useState([])
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem("CRMtoken")
    const CRMCompanyId = localStorage.getItem('CRMCompanyId')

    const fetchLog = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CommonLogList?Cguid=${logtno}&CompanyId=${CRMCompanyId}`, {
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
                <p className='log-date'>{item.EntryTime ? (moment(item.EntryTime).format('DD MMM, YYYY h:mm A')):'No Date'}</p>
                <p className='log-taskname'><span>{item.Name}</span></p>
                {
                    item.Flag =='A'? (
                        <p className='assignby-name'>Added By : <span>{item.UserName}</span></p>
                    ):
                    <p className='assignby-name'>Edit By : <span>{item.UserName}</span></p>
                }
            </div>
        )
    }

    const timelineData = logData.map(item => ({
        // color:'blue',
        color: item.Flag == 'A' ? "green" : 'gold',
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

export default CategoryLog