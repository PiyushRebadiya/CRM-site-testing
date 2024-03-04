import React from 'react'
import { Tag } from 'antd';
import moment from 'moment';

function ProjectModal({ projectS }) {
    
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

    return (
        <div>
            <div className="table-responsive">
                <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color info">
                            <th>#</th>
                            <th>Project Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projectS.map((item, index) => {
                                const statusColor = getStatusColor(item.Description);
                                // const priorityColor = priorityTemplate(item.Priority)
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.ProjectName}</td>
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

export default ProjectModal