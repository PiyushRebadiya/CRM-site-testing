import React, { useEffect, useState } from 'react'
import ReminderDash from './ReminderDash';
import { Button, Modal } from 'react-bootstrap';
import ReminderForm from '../reminder/ReminderForm';
import ReminderCalender from './ReminderCalender';
import { Popover } from 'antd';
import { BsInfoCircleFill } from "react-icons/bs";
import axios from 'axios';

function ReminderDashboard() {
    const insertReminderData = React.useRef(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const token = localStorage.getItem('CRMtoken');
    const companyId = localStorage.getItem('CRMCompanyId');
    const URL = process.env.REACT_APP_API_URL;

    // const fetchData = async () => {
    //     try {
    //         const res = await axios.get(URL + `/api/Master/DashboardReminderList?month=&Type=`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         const filterdata = res.data.filter((item) => item.CompanyID == companyId);
    //         // console.log(filterdata, 'data')
    //         const formattedEvents = filterdata.map((event) => {
    //             const festivals = filterdata.filter((display) => display.Type == 'Annivarsary Date' || display.Type == 'Birthday Date')
    //             const reminders = filterdata.filter((display) => display.Type == 'Reminder Date')
    //             // console.log(festivals, 'datesof parties')
    //              console.log(reminders, 'reminders')
    //             const festivalDates = new Date(festivals.DOB[0])
    //             console.log(festivalDates, 'festivals')
    //             const eventDate = new Date(event.DOB);
    //             // console.log(eventDate, 'DOBS')
    //             const today = new Date();
    //             eventDate.setFullYear(today.getFullYear()); // Set the year to the current year
    //             return {
    //                 title: event.PartyName,
    //                 type: event.Type,
    //                 start: eventDate,
    //                 end: eventDate,
    //                 color: eventColor(event.Type), // Set the color based on the reminder type
    //             };
    //         });
    //         setEvents(formattedEvents);
    //         // console.log(formattedEvents, 'formaaat')
    //     } catch (error) {
    //         console.error('Error fetching events:', error);
    //     }
    // };
    // useEffect(() => {
    //     fetchData()
    // }, [])

    const content = (
        <div>
           <p><i class="fa fa-circle" style={{color:'#eb2f96'}} aria-hidden="true"></i> - Client Annivarsary Dates</p>
           <p><i class="fa fa-circle" style={{color:'#FF5B00'}} aria-hidden="true"></i> - Client Birthday Dates</p>
           <p><i class="fa fa-circle" style={{color:'orange'}} aria-hidden="true"></i> - Employee Birthday Dates</p>
           <p><i class="fa fa-circle" style={{color:'#2f54eb'}} aria-hidden="true"></i> - Pending Reminder Dates</p>
           <p><i class="fa fa-circle" style={{color:'#54B435'}} aria-hidden="true"></i> - Completed Reminder Dates</p>
        </div>
    );
    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/DashboardReminderList?month=&Type=`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const filterdata = res.data.filter((item) => item.CompanyID == companyId);
            console.log(filterdata, 'dates')
            const ABReminder = filterdata.filter((display) => display.Type == 'Client Birthday' || display.Type == 'Client Annivarsary' || display.Type=='Employee BirthDay')
            const ABDates = ABReminder.map((event) => {
                const eventDate = new Date(event.DOB);
                const today = new Date();
                eventDate.setFullYear(today.getFullYear());
                return {
                    title: event.PartyName,
                    type: event.Type,
                    start: eventDate,
                    end: eventDate,
                    color: eventColor(event.Type), // Set the color based on the reminder type
                };
            })
            const Reminders = filterdata.filter((display) => display.Type == 'Reminder Date')
            const ReminderDates = Reminders.map((event) => {
                const eventDate = new Date(event.DOB)
                return {
                    title: event.PartyName,
                    type: event.Type,
                    isactive: event.IsActive,
                    start: eventDate,
                    end: eventDate,
                    remindertype: event.ReminderType,
                    color: ReminderColor(event.Type, event.IsActive), // Set the color based on the reminder type
                };
            })
            setEvents([...ABDates, ...ReminderDates]);
            // console.log([...ABDates,...ReminderDates],'Eventssssssssssssssssss')
            // console.log(formattedEvents, 'formaaat')
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    useEffect(() => {
        fetchData()
    }, [])
    const eventColor = (Type) => {
        // console.log('Type:', Type); // Check the value of Type
        // Define a mapping of reminder types to colors
        const colorMap = {
            'Client Birthday': '#FF5B00',
            'Client Annivarsary': '#eb2f96',
            'Employee BirthDay': 'orange',
            'Reminder Date': '#2f54eb',
            // Add more reminder types and their associated colors as needed
        };
        const color = colorMap[Type] || '#54B435';
        // console.log('Color:', color); // Check the color being returned
        return color;
    };
    const ReminderColor = (Type, IsActive) => {
        // console.log(IsActive, "ISACTIVE")
        // console.log('Type:', Type); // Check the value of Type
        // Define a mapping of reminder types to colors
        let colorMap
        if (IsActive == true) {
            colorMap = {
                'Reminder Date': '#2f54eb',
            };
        } else {
            colorMap = {
                'Reminder Date': '#54B435',
            };
        }
        const color = colorMap[Type] || '#54B435';
        // console.log('Color:', color); // Check the color being returned
        return color;
    };
    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color;
        const style = {
            backgroundColor,
            borderRadius: '10px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            fontSize: '0.7em',
        };
        return {
            style
        };
    };
    return (
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    <i class="fa fa-bell-o" style={{ fontSize: "35px", marginTop: "9px", marginLeft: "10px" }}></i>
                </div>
                <div className="header-title">
                    <h1>Reminder Dashboard</h1>
                    {/* <small></small> */}
                </div>
            </section>
            <section className="content footer-section-form-padding ">
                <div className="col-lg-12 pinpin">
                    <div className="card lobicard lobicard-custom-control" data-sortable="true">
                        <div className="card-header">
                            <div className="card-title custom_title">
                                <h4>Reminders</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="Workslist">
                                <div className="worklistdate">
                                    <ReminderDash insertReminderData={insertReminderData} fetchData={fetchData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 pinpin reminder-legend">
                    <div className="card lobicard lobicard-custom-control" data-sortable="true">
                        <div className="card-header">
                            <div className="card-title custom_title w-100">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4>Reminders Calender</h4>
                                    </div>
                                    <div className='' style={{ cursor: 'pointer' }}>
                                        <Popover content={content} placement="left" trigger="hover">
                                            <BsInfoCircleFill  className='inform-legends' size={20}/>
                                        </Popover>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="card-body">
                            <div className="Workslist">
                                <div className="worklistdate">
                                    <ReminderCalender events={events} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ReminderDashboard