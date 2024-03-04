import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Modal } from 'antd';
import Badge from 'react-bootstrap/Badge';
import { Tag } from 'antd';


const localizer = momentLocalizer(moment);

function EventModal({ event, visible, handleClose }) {

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <h6 style={{ fontWeight: "bold", marginTop: "5px" }} className="popover-title">{event.project}</h6>
      <hr></hr>
      <p><span style={{ fontWeight: "bold" }} >Party Name - </span>{event.project}</p>
      <p><span style={{ fontWeight: "bold" }} >Inquiry - </span>{event.task}</p>
      <p><span style={{ fontWeight: "bold" }} >Assign By - </span>{event.AssignBy}</p>
      <p><span style={{ fontWeight: "bold" }} >Assign To - </span>{event.AssignTo}</p>
      <p><span style={{ fontWeight: "bold" }} >Status - </span> {event.badgestatus === "Complete" ? (
        <Tag color="green">Completed</Tag>
      ) : event.badgestatus === "InProgress" ? (
        <Tag color="blue">In Progress</Tag>
      ) : event.badgestatus === "Pending" ? (
        <Tag color="gold">Pending</Tag>
      ) : event.badgestatus === "Hold" ? (
        <Tag color='purple'>Hold</Tag>
      ) : event.badgestatus === "Cancel" ? (
        <Tag color='red'>Cancel</Tag>
      ) :
        (
          <Badge pill bg="secondary">{event.status}</Badge>
        )}</p>
      <p><span style={{ fontWeight: "bold" }} >Start - </span>{moment(event.start).format('DD/MM/YYYY')}</p>
      <p><span style={{ fontWeight: "bold" }} >End - </span>{moment(event.end).format('DD/MM/YYYY')}</p>
    </Modal>
  );
};


function InquiryCalender({ insertCalenderData }) {
  React.useEffect(() => {
    if (insertCalenderData) {
      insertCalenderData.current = fetchData
    }
  }, [])
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = localStorage.getItem('CRMtoken');
  const custId = localStorage.getItem("CRMCustId")
  const companyId = localStorage.getItem("CRMCompanyId")
  const userid = localStorage.getItem('CRMUserId')
  const Role = localStorage.getItem('CRMRole')

  const URL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? ' ' : userid}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // let filteredEvents = res.data;
      // //   if (selectedProject) {
      // //     filteredEvents = filteredEvents.filter(event => event.ProjectName === selectedProject);
      // //   }

      // const formattedEvents = filteredEvents.map(event => ({
      //   project: event.PartyName,
      //   title: event.PartyName + ' - ' + event.TaskName,
      //   task: event.TaskName,
      //   start: new Date(event.FromDate),
      //   end: new Date(event.ToDate),
      //   badgestatus: event.TaskStatus,
      //   status: event.Description,
      //   AssignBy: event.AssignBy,
      //   AssignTo: event.AssignTo,
      //   color: eventColor(event.TaskStatus),
      // }));

      // setEvents(formattedEvents);
      // console.log(res.data, "cal");
      if (Role == 'Admin') {
        const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? ' ' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
          headers: { Authorization: `bearer ${token}` }
        })
         let filteredEvents = res.data;

       const formattedEvents = filteredEvents.map(event => ({
         project: event.PartyName,
         title: event.PartyName + ' - ' + event.TaskName,
         task: event.TaskName,
         start: new Date(event.FromDate),
         end: new Date(event.ToDate),
         badgestatus: event.TaskStatus,
         status: event.Description,
         AssignBy: event.FirstName+' '+event.LastName ,
         AssignTo: event.ATFName+' '+event.ATLName,
         color: eventColor(event.TaskStatus),
       }))
       setEvents(formattedEvents);
      //  console.log(res.data, "cal");
      }
      else {
        const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
          headers: { Authorization: `bearer ${token}` }
        })
      
        let filteredEvents = res.data;

        const formattedEvents = filteredEvents.map(event => ({
          project: event.PartyName,
          title: event.PartyName + ' - ' + event.TaskName,
          task: event.TaskName,
          start: new Date(event.FromDate),
          end: new Date(event.ToDate),
          badgestatus: event.TaskStatus,
          status: event.Description,
          AssignBy: event.FirstName+' '+event.LastName ,
          AssignTo: event.ATFName+' '+event.ATLName,
          color: eventColor(event.TaskStatus),
        }))
        setEvents(formattedEvents);
        // console.log(res.data, "cal");
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const eventColor = (Description) => {
    // Define a mapping of TaskStatus to colors
    const colorMap = {
      Complete: '#54B435',
      InProgress: '#0174BE',
      Pending: '#FF9800',
      Hold:'#5D3587',
      Cancel:'#f5222d'
      // Add more TaskStatus-color mappings as needed
    };

    // Return the color based on the TaskStatus, or a default color
    return colorMap[Description] || 'gray';
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
    <div style={{ height: '76.8vh', backgroundColor: "white", padding: "5px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor={(event) => new Date(event.end.getTime() + 24 * 60 * 60 * 1000)} // Add a day to the end date
        popup
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          visible={isModalVisible}
          handleClose={handleModalClose}
        />
      )}
    </div>

  );
};

export default InquiryCalender