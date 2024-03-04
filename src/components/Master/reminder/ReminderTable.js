// import React, { useState,useEffect } from 'react'
// import axios from 'axios'
// import Swal from 'sweetalert2';
// import moment from 'moment';
// import ReminderForm from './ReminderForm';
// import Modal from 'react-bootstrap/Modal'

// function EditData(props) {
//     const { selectedrow, fetchData } = props
//     return (
//       <Modal
//         {...props}
//         size="xl"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//         backdrop="static"
//       >
//         <ReminderForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
//       </Modal>
//     );
//   }
// function ReminderTable({insertData}) {
//     const[data,setData] = useState([])
//     const [selectedrow, setSelectedRow] = useState([])
//     const [editshow, setEditShow] = React.useState(false);
//     React.useEffect(() => {
//         insertData.current = fetchData
//     }, [])
//     const URL = process.env.REACT_APP_API_URL
//     const token = localStorage.getItem("CRMtoken")
//     const custId = localStorage.getItem("CRMCustId")
//     const CompanyId = localStorage.getItem('CRMCompanyId')

//     const fetchData = async () => {
//         try {
//             const res = await axios.get(URL +`/api/Master/GetReminderList?CompanyID=${CompanyId}`, {
//                 headers: { Authorization: `bearer ${token}` }
//             })
//             setData(res.data)
//             console.log(res.data,"data")
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     useEffect(() => {
//         fetchData()
//     }, [])

//     const updateData = async (id) => {
//         try {
//             const res = await axios.get(URL + `/api/Master/ReminderById?ReminderId=${id}`, {
//                 headers: { Authorization: `bearer ${token}` }
//             })
//             setSelectedRow(res.data)
//             setEditShow(true)
//             console.log(res.data,'updateinh')
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     const deleteData = async (id) => {
//         try {
//             const res = await axios.get(URL + `/api/Master/DeleteReminder?ReminderId=${id}`, {
//                 headers: { Authorization: `bearer ${token}` },
//             })
//             fetchData()
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     const showAlert = (id) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You won't be able to revert this!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'No, cancel!',
//             reverseButtons: true,
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 deleteData(id)
//                 Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
//             } else if (result.dismiss === Swal.DismissReason.cancel) {
//                 Swal.fire('Cancelled', 'No changes have been made.', 'error');
//             }
//         });
//     };

//   return (
//     <div>
//          <div className="table-responsive ">
//         <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
//             <thead className="back_table_color">
//                 <tr className=" back-color  info">
//                     <th>#</th>
//                     <th>Reminder Name</th>
//                     <th>Reminder Date</th>
//                     <th>Reminder Type</th>
//                     <th colSpan="2">Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {
//                     data.map((item, index) => {

//                         return (
//                             <tr key={index}>
//                                 <td className='data-index'>{index + 1}</td>
//                                 <td>{item.ReminderName}</td>
//                                 <td>{moment(item.ReminderDate).format('DD-MM-YYYY')}</td>
//                                 <td>{item.ReminderType}</td>
//                                 <td className='w-10'>
//                                     <div className='action-btn'>
//                                         <button type="button" className="btn btn-add btn-sm" 
//                                         onClick={() => { updateData(item.ReminderId) }}
//                                         >
//                                             <i className="fa fa-pencil" /></button>
//                                         <button type="button" className="btn btn-danger btn-sm" 
//                                         onClick={() => { showAlert(item.ReminderId) }}
//                                         ><i className="fa fa-trash-o" /> </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         )
//                     })
//                 }
//             </tbody>
//         </table>
//         {
//         selectedrow ?
//           <EditData
//             show={editshow}
//             onHide={() => setEditShow(false)}
//             selectedrow={selectedrow}
//             fetchData={fetchData}
//           /> : null
//       }
//     </div>
//     </div>
//   )
// }

// export default ReminderTable


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import ReminderForm from './ReminderForm';
import Modal from 'react-bootstrap/Modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, notification, Space, Popover, Popconfirm, Tooltip } from 'antd';
import { Drawer } from 'antd';
import { Table, Tag, Dropdown, Menu, Input } from 'antd';

function generateNotificationKey() {
    return `notification_${new Date().getTime()}`;
}
function EditData(props) {
    const { selectedrow, fetchData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReminderForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
// function EditData(props) {
//     const { selectedrow, fetchData, onClose } = props;
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="70vw"
//         >
//             <ReminderForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
//         </Drawer>
//     );
// }

function ReminderTable({ insertData, searchinput, onData }) {
    const [data, setData] = useState([]);
    const [selectedrow, setSelectedRow] = useState([]);
    const [editshow, setEditShow] = React.useState(false);
    const [apiData, setApiData] = useState(null);
    const [activeNotifications, setActiveNotifications] = useState({});
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    useEffect(() => {
        insertData.current = fetchData;
    }, []);

    const URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('CRMtoken');
    const custId = localStorage.getItem('CRMCustId');
    const CompanyId = localStorage.getItem('CRMCompanyId');
    const userid = localStorage.getItem('CRMUserId')

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetReminderList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setData(res.data);
            onData(res.data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async (rowData) => {
        const id = rowData.ReminderId;
        try {
            const res = await axios.get(URL + `/api/Master/ReminderById?ReminderId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setSelectedRow(res.data);
            setEditShow(true);
            setApiData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const showAlert = (rowData) => {
        const id = rowData.ReminderId;
        const timerDuration = 2000; // 4000 milliseconds = 4 seconds
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            // timer: timerDuration,
            timerProgressBar: true,
            // onClose: () => {
            //     // Optional: Perform any action when the timer expires
            //     // console.log('Timer expired');
            // }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData(id)
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'No changes have been made.',
                    icon: 'error',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            }
        });
    };

    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteReminder?ReminderId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    let apiResponse
    const handleConfirmation = async (reminderId, notificationKey) => {
        notification.destroy(notificationKey);
        try {
            const res = await axios.get(URL + `/api/Master/ReminderById?ReminderId=${reminderId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            // setApiData(res.data);
            apiResponse = res.data
            // console.log(apiResponse, 'apidata')
        } catch (error) {
            console.log(error);
        }
        try {
            // Make an API call to update the reminder
            const res = await axios.post(URL + "/api/Master/CreateReminder", {
                Flag: "U",
                Reminder: {
                    ReminderId: apiResponse.ReminderId,
                    ReminderName: apiResponse.ReminderName,
                    PartyId: apiResponse.PartyId,
                    CompanyID: apiResponse.CompanyID,
                    ReminderDate: apiResponse.ReminderDate,
                    ReminderType: apiResponse.ReminderType,
                    IsExtend: apiResponse.IsExtend,
                    IsActive: false,
                    AutoClose: true,
                    IPAddress: apiResponse.IPAddress,
                    UserID: apiResponse.UserID,
                    UserName: apiResponse.UserName,
                    ServerName: apiResponse.ServerName,
                    EntryTime: new Date(),
                    ReferenceId: apiResponse.ReferenceId
                }
            }, {
                headers: { Authorization: `bearer ${token}` },
            });
            // console.log(res.data, 'datasubmit')
            if (res.data.Success) {
                notification.destroy(notificationKey);
            } else {
            }
        } catch (error) {
            console.error(error);
        }
    };
    // const showNotification = (message, reminderId) => {
    //     const notificationKey = `reminder-${reminderId}`;
    //     const existingNotification = activeNotifications[notificationKey];
    //     if (existingNotification) {
    //         // A notification for this reminder already exists, skip showing a new one
    //         return;
    //     }

    //     const closeNotification = () => {
    //         // Remove the notification from the activeNotifications
    //         const { [notificationKey]: _, ...rest } = activeNotifications;
    //         setActiveNotifications(rest);
    //     };

    //     const popoverContent = (
    //         <div>
    //             <Button type="primary" size="small"  onClick={() => handleConfirmation(reminderId)}
    //              style={{ zIndex: 9999 }} // Adjust the z-index
    //             >
    //                 Yes
    //             </Button>
    //         </div>
    //     );

    //     const notificationContent = (
    //         <div>
    //             <p>{message}</p>
    //             <Popover
    //                 content={popoverContent}
    //                 title="Are You Sure?"
    //                 trigger="click" // Show popover on click
    //                 overlayStyle={{ zIndex: 9999 }} // Adjust the z-index
    //             >
    //                 <Button
    //                     type="primary"
    //                     size="small"
    //                     onClick={closeNotification}
    //                     style={{ zIndex: 1 }} // Lower z-index for the notification
    //                 >
    //                     Completed
    //                 </Button>
    //             </Popover>
    //         </div>
    //     );
    //     notification.open({
    //         message: 'Reminder Due',
    //         description: notificationContent,
    //         icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
    //         key: notificationKey,
    //     });

    //     // Add the new notification to the activeNotifications
    //     setActiveNotifications({ ...activeNotifications, [notificationKey]: true });
    // };

    useEffect(() => {
        fetchData();

        const notificationInterval = setInterval(() => {
            fetchData();
        }, 120000); // 2 minutes in milliseconds

        return () => {
            clearInterval(notificationInterval);
        };
    }, []);

    // useEffect(() => {
    //     data.forEach((item) => {
    //         const currentDate = new Date();
    //         const today = moment(currentDate); 
    //         const eventDate = new Date(item.ReminderDate);
    //         const daysUntilEvent = moment(item.ReminderDate).diff(today, 'days');

    //         if (daysUntilEvent >= 0 && daysUntilEvent <= 10 && !item.AutoClose) {
    //             const message = `Reminder for ${item.ReminderName} is due in ${daysUntilEvent} days.`;
    //             const notificationKey = generateNotificationKey();
    //             showNotification(message, item.ReminderId, notificationKey);
    //         }
    //     });
    // }, [data]);

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        const lowerCaseReminderDate = moment(item.ReminderDate).format('DD/MM/YYYY').toLowerCase();
        const isActiveStatus = item.IsActive ? 'Pending' : 'Complete';
        return (
            (item.ReminderName && item.ReminderName.toLowerCase().includes(searchTermLowerCase)) ||
            (lowerCaseReminderDate && lowerCaseReminderDate.includes(searchTermLowerCase)) ||
            (item.ReminderType && item.ReminderType.toLowerCase().includes(searchTermLowerCase)) ||
            (isActiveStatus && isActiveStatus.toLowerCase().includes(searchTermLowerCase)) // Check for null
        );
    });

    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <Tooltip title='Edit'>
                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                <Tooltip title='Delete'>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
                </Tooltip>
            </div>
        );
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'red' : 'green';
    };

    const statusTemplate = (rowData) => {

        // console.log(rowData, "Ankit");
        const statusColor = getStatusColor(rowData);
        // console.log(statusColor, "statusColor")
        return <Tag color={statusColor}>{rowData == true ? 'Pending' : 'Complete'}</Tag>;
    };

    const columns = [
        // ... (other columns)
        {
            title: 'Reminder Name',
            dataIndex: 'ReminderName',

        },
        {
            title: 'Reminder Date',
            render: (text, record) => moment(record.ReminderDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Reminder Type',
            dataIndex: 'ReminderType',

        },
        {
            title: 'Reminder Status',
            dataIndex: 'IsActive',
            // render: (text, record) => (record.IsActive ? 'Pending' : 'Complete'),
            render: statusTemplate,
            align:'center'
        },
        {
            title: 'Action',
            fixed: 'right',
            align: 'center',
            render: actionTemplate,
            width: 190
        }
        // ... (other columns)
    ];
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }
    const totalRecords = filteredData.length; // Assuming filteredData is the data array


    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );
    return (
        <div>
            <div className="table-responsive ">
                {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="back-color info">
                            <th>#</th>
                            <th>Reminder Name</th>
                            <th>Reminder Date</th>
                            <th>Reminder Type</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => {
                            return (
                                <tr key={index} className='align_middle'>
                                    <td className="data-index">{index + 1}</td>
                                    <td>{item.ReminderName}</td>
                                    <td>{moment(item.ReminderDate).format('DD/MM/YYYY')}</td>
                                    <td>{item.ReminderType}</td>
                                    <td className="w-10">
                                        <div className='action-btn'>
                                            <button type="button" className="btn btn-add action_btn btn-sm rounded-2"
                                                onClick={() => { updateData(item.ReminderId) }}
                                            >
                                                <i className="fa fa-pencil fs-4" /></button>
                                            <button type="button" className="btn btn-danger action_btn btn-sm"
                                                onClick={() => { showAlert(item.ReminderId) }}
                                            ><i className="fa fa-trash-o fs-4" /> </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                    onChange={handleTableChange} footer={TotalRecordFooter} />
                {selectedrow ? (
                    <EditData
                        show={editshow}
                        onHide={() => setEditShow(false)}
                        selectedrow={selectedrow}
                        fetchData={fetchData}
                    />
                    // <EditData
                    //     visible={editshow}
                    //     onHide={() => setEditShow(false)}
                    //     selectedrow={selectedrow}
                    //     fetchData={fetchData}
                    // />
                ) : null}
            </div>
        </div>
    );
}

export default ReminderTable;
