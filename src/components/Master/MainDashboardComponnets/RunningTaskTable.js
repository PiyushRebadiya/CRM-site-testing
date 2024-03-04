import React from 'react'
import moment from 'moment';
import { Tag } from 'antd';

const RunningTaskTable = ({ runningtask }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete':
                return <Tag color='green'>Complete</Tag>
            case 'InProgress':
                return <Tag color='blue'>Running</Tag>;
            case 'Pending':
                return <Tag color='gold'>Pending</Tag>;
            default:
                return '';
        }
    };
    const priorityTemplate = (Priority) => {
        let priorityStyle = {};
        switch (Priority) {
            case 'High':
                priorityStyle = 'red';
                break;
            case 'Urgent':
                priorityStyle = 'purple';
                break;
            case 'Low':
                priorityStyle = 'green';
                break;
            default:
                priorityStyle = '';
        }
        return <Tag color={priorityStyle}>{Priority}</Tag>;
    };
    return (
        <div>
            <div className="table-responsive">
                <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color info">
                            <th>#</th>
                            <th>Project Name</th>
                            <th>TaskName</th>
                            <th>AssignBy</th>
                            <th>AssignTo</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            runningtask.map((item, index) => {
                                const statusColor = getStatusColor(item.TaskStatus);
                                const priorityColor = priorityTemplate(item.Priority)
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.ProjectName}</td>
                                        <td>{item.TaskName}</td>
                                        <td>{item.FirstName + ' ' + item.LastName}</td>
                                        <td>{item.ATFName + ' ' + item.ATLName}</td>
                                        <td>{moment(item.ToDate).format('DD/MM/YYYY')}</td>
                                        <td>{priorityColor}</td>
                                        <td>{statusColor}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RunningTaskTable