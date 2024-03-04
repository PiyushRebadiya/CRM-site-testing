// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
// import moment from 'moment';
// import { Toast } from 'primereact/toast';
// // import NotificationContainer from './Notification';

// function ReminderDash() {
//     const [tablist, setTabList] = useState([])
//     const [listData, setListData] = useState([])
//     const [selectedTab, setSelectedTab] = useState('');// Set the default tab here
//     const [toast, setToast] = useState(null);

//     const URL = process.env.REACT_APP_API_URL
//     const companyId = localStorage.getItem("CRMCompanyId")
//     const token = localStorage.getItem("CRMtoken")

//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1;
//     const today = moment();
//     const tenDaysFromNow = moment().add(10, 'days');


//     useEffect(() => {
//         // Set the default active tab when the component mounts
//         if (tablist.length > 0) {
//             setSelectedTab(tablist[0].Description);
//         }
//     }, [tablist]);

//     const reminderTab = async () => {
//         try {
//             const res = await axios.get(URL + '/api/Master/mst_Master', {
//                 headers: { Authorization: `bearer ${token}` }
//             })
//             const filtertab = res.data.filter((display) => display.Remark == 'Date')
//             setTabList(filtertab)
//         } catch (error) {

//         }
//     }
//     useEffect(() => {
//         // Request notification permission when the component mounts
//         if (Notification.permission !== 'granted') {
//             Notification.requestPermission().then(permission => {
//                 if (permission !== 'granted') {
//                     console.log('Notification permission denied');
//                 }
//             });
//         }
//     }, []);
//     const fetchReminderData = async (type) => {
//         try {
//             const res = await axios.get(URL + `/api/Master/DashboardReminderList?month=${currentMonth}&Type=${type}`, {
//                 headers: { Authorization: `bearer ${token}` }
//             });
//             setListData(res.data);
//               // Create notifications for reminders within 1 day
//         const currentDate = new Date();
//         const tomorrow = new Date();
//         tomorrow.setDate(currentDate.getDate() + 1);

//         listData.forEach(item => {
//             const eventDate = new Date(item.DOB);

//             // Check if the event is within 1 day or today
//             if (eventDate >= currentDate && eventDate < tomorrow) {
//                 const notification = new Notification('Reminder', {
//                     body: `Reminder: ${item.PartyName} - ${moment(item.DOB).format('DD-MM-YYYY')}`,
//                 });

//                 notification.onclick = () => {
//                     // Handle what happens when the user clicks the notification
//                     console.log('Notification clicked');
//                 };
//             }
//         });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     useEffect(() => {
//         if (selectedTab) {
//             fetchReminderData(selectedTab);
//         }
//     }, [selectedTab]);
//     useEffect(() => {
//         fetchReminderData()
//         reminderTab()
//     }, [])
//     const filterlistdata = listData.filter((item) => item.CompanyID == companyId)
//     const filteredData = filterlistdata.filter((item) => {
//         const eventDate = moment(item.DOB, 'YYYY-MM-DD');

//         if (eventDate.isSame(today, 'day')) {
//             return true; // Event is today
//         } else {
//             return eventDate.isBetween(today, tenDaysFromNow, null, '[]'); 
//         }
//     });
//     useEffect(() => {
//         // Ensure this effect runs only once when the component mounts
//         if (filteredData && toast) {
//             // Clear any existing notifications before starting the interval
//             toast.clear();

//             // Set up an interval to check and display notifications every 1 minute
//             const notificationInterval = setInterval(() => {
//                 const currentDate = moment();
//                 const todayEvents = filteredData.filter(item => moment(item.DOB, 'YYYY-MM-DD').isSame(currentDate, 'day'));

//                 todayEvents.forEach(item => {
//                     toast.show({
//                         severity: 'info',
//                         summary: 'Event Today',
//                         detail: `Event for ${item.PartyName} is today.`,
//                         life: 10000,
//                         closable: true,
//                     });
//                 });
//             }, 60000); // 1 minute in milliseconds

//             // Clear the interval when the component unmounts
//             return () => {
//                 clearInterval(notificationInterval);
//             };
//         }
//     }, []);
//     return (
//         <div>
//              <Tabs activeKey={selectedTab} onSelect={(key) => setSelectedTab(key)}>
//                 {
//                     tablist.map((display) => {
//                         return (
//                             <Tab title={display.Description} eventKey={display.Description} key={display.Description}>
//                                 <DataTable value={filteredData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
//                                     <Column field="PartyName" header="Name" />                       
//                                     <Column
//                                         field="DaysLeft"
//                                         header="Days Left"
//                                         body={(rowData) => {
//                                             const eventDate = moment(rowData.DOB, 'YYYY-MM-DD');
//                                             const currentDate = moment();
//                                             const daysLeft = eventDate.diff(currentDate, 'days');

//                                             if (daysLeft === 0) {
//                                                 return 'Today';
//                                             } else if (daysLeft === 1) {
//                                                 return '1 day to go';
//                                             } else {
//                                                 return `${daysLeft} days to go`;
//                                             }
//                                         }}
//                                     />
//                                      <Column
//                                         field="DOB"
//                                         header="Date"
//                                         body={(rowData) => moment(rowData.DOB).format('DD-MM-YYYY')}
//                                     />
//                                 </DataTable>
//                             </Tab>
//                         )
//                     })
//                 }
//             </Tabs>
//             {/* <NotificationContainer /> */}
//             <Toast ref={setToast} />
//         </div>
//     )
// }

// export default ReminderDash

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { notification, Button,Table } from 'antd';
import { InfoCircleOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal'
import ReminderForm from '../reminder/ReminderForm';


function ReminderModal(props) {
    const { fetchData, fetchReminderData, onHide } = props;
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReminderForm
                fetchData={fetchReminderData}
                fetchCalender={fetchData}
                onHide={props.onHide}
            />
        </Modal>
    );
}
function ReminderDash({ fetchData }) {

    const [tablist, setTabList] = useState([]);
    const [listData, setListData] = useState([]);
    const [selectedTab, setSelectedTab] = useState(''); // Set the default tab here
    const [toast, setToast] = useState(null);
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [reminderform, setReminderform] = useState(false)
    const insertData = React.useRef(null);
    const URL = process.env.REACT_APP_API_URL;
    const companyId = localStorage.getItem("CRMCompanyId");
    const token = localStorage.getItem("CRMtoken");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const today = moment();
    const tenDaysFromNow = moment().add(10, 'days');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
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
    useEffect(() => {
        // Set the default active tab when the component mounts
        if (tablist.length > 0) {
            setSelectedTab(tablist[0].Description);
        }
    }, [tablist]);

    const reminderTab = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            });
            const filtertab = res.data.filter((display) => display.Remark == 'Date');
            setTabList(filtertab);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReminderData = async (type) => {
        try {
            const res = await axios.get(URL + `/api/Master/DashboardReminderList?month=${currentMonth}&Type=${type}`, {
                headers: { Authorization: `bearer ${token}` }
            });
            const filterType = res.data.filter((item)=>item.Type=='Annivarsary Date')
            setListData(res.data);
            // console.log(res.data,'fetchingReminder')
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedTab) {
            fetchReminderData(selectedTab);
        }
    }, [selectedTab]);

    useEffect(() => {
        fetchReminderData();
        reminderTab();
    }, []);

    const filterlistdata = listData.filter((item) => item.CompanyID == companyId);
    const filteredData = filterlistdata.filter((item) => {
        const eventDate = moment(item.DOB, 'YYYY-MM-DD');

        if (eventDate.isSame(today, 'day')) {
            return true; // Event is today
        } else {
            return eventDate.isBetween(today, tenDaysFromNow, null, '[]');
        }
    });

    const filterlistdataModified = filterlistdata
        .map((item) => {
            const eventDate = moment(item.DOB, 'YYYY-MM-DD');

            // Calculate "Days Left" based on the current date
            const todayFormatted = today.format('MM-DD');
            const eventDateFormatted = eventDate.format('MM-DD');

            // Calculate "Days Left" by comparing only the month and day
            const daysLeft = moment(eventDateFormatted, 'MM-DD').diff(
                moment(todayFormatted, 'MM-DD'),
                'days'
            );

            // Format the DOB to include the year
            const formattedDOB = moment(item.DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

            return {
                ...item,
                DOB: formattedDOB, // Include the year in the DOB
                DaysLeft:daysLeft,
            };
        })
        .filter((item) => item.DaysLeft >= 0 && item.DaysLeft <= 10)
        .slice(0, 10);
    const filteredEvents = filterlistdataModified.filter(item => item !== null && item !== undefined);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setReminderform(true)
            }
        }
        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    const columns = [
        {
            title: 'Date',
            dataIndex: 'DOB',
            key: 'DOB',
            // render: (text,record) => moment(record.DOB).format('DD/MM/YYYY'),
        },
        {
            title: 'Name',
            dataIndex: 'PartyName',
            key: 'PartyName',
        },
        // {
        //     title: 'Days Left',
        //     // dataIndex: 'DaysLeft',
        //     key: 'DaysLeft',

        //     render: (text, record) => 
        //       <span>{record.DaysLeft +' '+ "Days Left"}</span>
        //   },
        {
            title: 'Days Left',
            // dataIndex: 'DaysLeft',
            key: 'DaysLeft',

            render: (text, record) => {
                const daysLeft = record.DaysLeft;

                if (daysLeft === 0) {
                    return <span>Today</span>;
                } else if (daysLeft === 1) {
                    return <span>Tomorrow</span>;
                } else {
                    return <span>{daysLeft} Days Left</span>;
                }
            },
        },
    ];
    return (
        <div>

            <Button className="btn btn-add rounded-2"
                onClick={() => setReminderform(true)}
            >
                <i className="fa fa-plus ms-1" />Add Reminder[F2]
            </Button>

            <ReminderModal
                show={reminderform}
                onHide={() => setReminderform(false)}
                fetchReminderData={fetchReminderData}
                fetchData={fetchData}
            // fetchData={insertData.current}
            // fetchIFSCData={fetchIFSCData}
            />
            <Tabs activeKey={selectedTab} onSelect={(key) => setSelectedTab(key)} className="mt-3">
                {tablist.map((display) => (
                    <Tab title={display.Description} eventKey={display.Description} key={display.Description}>
                        <Table
                            dataSource={filteredEvents}
                            columns={columns}
                            pagination={tableParams.pagination}
                            onChange={handleTableChange}
                        />
                    </Tab>
                ))}
            </Tabs>
            <Toast ref={setToast} />

        </div>
    );
}

export default ReminderDash;
