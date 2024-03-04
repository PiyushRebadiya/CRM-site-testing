import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Modal } from 'antd';
import Badge from 'react-bootstrap/Badge';
import { Tag } from 'antd';


const localizer = momentLocalizer(moment);

function EventModal({ apiResponse, visible, handleClose }) {
  // console.log(apiResponse,'apiresooooo')
  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <h6 style={{ fontWeight: "bold", marginTop: "5px" }} className="popover-title">Reminder</h6>
      <hr></hr>
      <p><span style={{ fontWeight: "bold" }} >Reminder Name - </span>{apiResponse.title}</p>
      <p><span style={{ fontWeight: "bold" }} >Reminder Date - </span>{moment(apiResponse.start).format('DD/MM/YYYY')}</p>
      {/* <p><span style={{ fontWeight: "bold" }} >Reminder Type - </span>{apiResponse.type}</p>  */}
      <p><span style={{ fontWeight: "bold" }} >Reminder Type - </span>
        {
          apiResponse.type == 'Client Annivarsary' ? (
            <Tag
              color='magenta'
            >{apiResponse.type}</Tag>

          ) : apiResponse.type == 'Client Birthday' ? (
            <Tag
              color='orange'
            >{apiResponse.type}
            </Tag>
          ) : apiResponse.remindertype == 'Sales' ? (
            <Tag
              color='blue'
            >{apiResponse.remindertype}
            </Tag>
          ) :
            apiResponse.remindertype == 'Proforma' ? (
              <Tag
                color='blue'
              >{apiResponse.remindertype}
              </Tag>
            ) :
              apiResponse.type == 'Employee BirthDay' ? (
                <Tag
                  color='gold'
                >
                  {apiResponse.type}
                </Tag>
              ) :
                apiResponse.type == 'Reminder Date' && (
                  <Tag
                    color='blue'
                  >{apiResponse.type}
                  </Tag>
                )

        }
      </p>
      {/* Add more details as needed */}
    </Modal>
  );
}

const ReminderCalender = ({ events }) => {
  // console.log(events,'formRDash')
  // const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = localStorage.getItem('CRMtoken');
  const companyId = localStorage.getItem('CRMCompanyId');
  const URL = process.env.REACT_APP_API_URL;


  // const fetchData = async () => {
  //   try {
  //     const res = await axios.get(URL +`/api/Master/DashboardReminderList?month=&Type=`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const filterdata = res.data.filter((item) => item.CompanyID == companyId);

  //     const formattedEvents = filterdata.map((event) => {
  //       const eventDate = new Date(event.DOB);
  //       const today = new Date();
  //       eventDate.setFullYear(today.getFullYear()); // Set the year to the current year
  //       return {
  //         title: event.PartyName,
  //         type: event.Type,
  //         start: eventDate,
  //         end: eventDate,
  //         color: eventColor(event.Type), // Set the color based on the reminder type
  //       };
  //     });
  //     setEvents(formattedEvents);
  //     console.log(formattedEvents,'formaaat')
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };

  //   const eventColor = (Type) => {
  //     console.log('Type:', Type); // Check the value of Type
  //     // Define a mapping of reminder types to colors
  //     const colorMap = {
  //       'Birthday Date': '#F31559',
  //       'Anniversary Date':'#F31559',
  //       'Reminder Date': 'teal',
  //       // Add more reminder types and their associated colors as needed
  //     };
  //     const color = colorMap[Type] || '#54B435';
  //     console.log('Color:', color); // Check the color being returned
  //     return color;
  //   };

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

  //   const fetchData = async () => {
  //     try {
  //       // const res = await axios.get(URL + `/api/Master/GetReminderList?CompanyID=${companyId}`, {
  //       const res = await axios.get(URL + `/api/Master/DashboardReminderList?month=${currentMonth}&Type=Birthday Date`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  // console.log(res.data,'bdate')
  // setBdate(res.data)
  // const filterBdata = bdate.filter((item) => item.CompanyID == companyId)
  // console.log(filterBdata,'ffffff')

  //       const formattedEvents =filterBdata.map((event) => ({
  //         title: event.PartyName + '' + "'s birth Day",
  //         start: new Date(event.DOB), // Make sure ReminderDate is a valid date string
  //         end: new Date(event.DOB), // You can set the end date the same as the start date if needed
  //       }));
  // console.log(res.data,'iiiiii')
  //       setEvents(formattedEvents);
  //     } catch (error) {
  //       console.error('Error fetching events:', error);
  //     }
  //   };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ height: '80vh', backgroundColor: 'white', padding: '5px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end" // You can use this if you have different end times for events
        popup
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
      {selectedEvent && (
        <EventModal
          apiResponse={selectedEvent} // Pass selectedEvent as apiResponse
          visible={isModalVisible}
          handleClose={handleModalClose}
        />
      )}

    </div>
  );
};

export default ReminderCalender;
