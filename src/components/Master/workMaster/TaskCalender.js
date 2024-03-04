import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Popover } from 'antd';
import axios from 'axios';
import moment from 'moment';


const TaskCalender = ({ selectedProject }) => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('CRMtoken');
    const companyId = localStorage.getItem("CRMCompanyId")
    const URL = process.env.REACT_APP_API_URL;

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaskList&CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    // Function to render events for a specific date
    const dateCellRender = (date) => {
        const dateString = date.format('YYYY-MM-DD');
        const eventsForDate = data
            .filter(
                (item) =>
                    (item.FromDate || '').split('T')[0] === dateString ||
                    (item.ToDate || '').split('T')[0] === dateString
            )
            .filter((item) => !selectedProject || item.ProjectName === selectedProject);
            

        return (
            <ol className="events" style={{listStyleType:"circle"}}>
                {eventsForDate.map((item) => (
                    <li key={item.Id}>
                        <Popover

                            placement="top" // Adjust placement as needed (top, bottom, left, right)
                            title={<h6 style={{ fontWeight: "bold",marginTop:"5px" }} className="popover-title">{item.ProjectName}</h6>}
                            content={
                                <div className="popover-content">
                                    <hr></hr>
                                    <p><span style={{ fontWeight: "bold" }} >Task Name -</span>{item.TaskName}</p>
                                    <p><span style={{ fontWeight: "bold" }} >Assign By -</span>{item.AssignBy}</p>
                                    <p><span style={{ fontWeight: "bold" }} >Assign To -</span>{item.AssignTo}</p>
                                    <p><span style={{ fontWeight: "bold" }} >Task Status -</span>{item.Description}</p>
                                    <p><span style={{ fontWeight: "bold" }} >Assigned On -</span>{moment(item.FromDate).format('YYYY-MM-DD')}</p>
                                    <p><span style={{ fontWeight: "bold" }} >Due Date -</span>{moment(item.ToDate).format('YYYY-MM-DD')}</p>
                                    {/* Add more event details here */}
                                </div>
                            }
                            trigger="hover" // Show the Popover on hover
                        >
                            {/* <Badge status="success" text={item.ProjectName} /> */}
                            <h6 style={{fontWeight:"bolder"}}>{item.TaskName}</h6>
                        </Popover>
                    </li>
                ))}
            </ol>
        );
    };

    // Function to render backlog numbers for a specific month
    const monthCellRender = (date) => {
        const dateString = date.format('YYYY-MM');
        const backlogNumber = data.filter((item) => {
            const startDate = item.FromDate || '';
            const endDate = item.ToDate || '';
            return startDate && endDate && (startDate.split('T')[0].startsWith(dateString) || endDate.split('T')[0].startsWith(dateString));
        }).length;

        return (
            <div className="notes-month">
                {/* <section>{backlogNumber}</section>
                <span>Total Task</span> */}
            </div>
        );
    };

    return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />;
};

export default TaskCalender;
