// import React from 'react'
// import { Table, Tag, Space, Dropdown, Menu, Input, Drawer } from 'antd';
// import axios from 'axios';
// import Modal from 'react-bootstrap/Modal'
// import CamoaignForm from './CamoaignForm'
// import { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';


// function EditData(props) {
//     const { selectedrow, fetchData, getProjectData, onClose, } = props
//     return (
//         <Drawer
//             {...props}
//             title="Edit campagin"
//             placement="right"
//             onClose={onClose}
//             visible={props.show}
//             width={1000}
//         >
//             <CamoaignForm
//                 rowData={selectedrow}
//                 fetchData={fetchData}
//                 onHide={props.onHide}
//                 getProjectData={getProjectData}

//             />
//         </Drawer>
//     )
// }

// const CampaignTable = ({ insertData, onData, getProjectData, searchinput }) => {

//     React.useEffect(() => {
//         insertData.current = fetchData
//     }, [])
//     const URL = process.env.REACT_APP_API_URL;
//     const token = localStorage.getItem("CRMtoken")
//     const companyId = localStorage.getItem("CRMCompanyId")
//     const [selectedrow, setSelectedRow] = useState([])
//     const [editshow, setEditShow] = useState(false);
//     const [Tabledata, setTabledata] = useState([])
//     const [sortColumn, setSortColumn] = useState(null);
//     const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

//     const fetchData = async () => {
//         try {
//             const res = await axios.get(URL + `/api/Transation/CampaignList?CompanyId=${companyId}`, {
//                 headers: { Authorization: `bearer ${token}` },
//             });
//             setTabledata(res.data);
//             onData(res.data);
//             // console.log(res.data, 'Fetched data');
//         } catch (error) {
//             console.error('Error fetching table data:', error);
//         }
//     };
//     useEffect(() => {
//         onData(Tabledata);
//     }, [Tabledata, onData]);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // const updateData = async (rowData,) => {
//     //     const id = rowData.Id;
//     //     const Cguid = rowData.Cguid
//     //     try {
//     //         const res = await axios.get(URL + `/api/Master/CampaignListById?Id=${id}&Cguid=${Cguid}`, {
//     //             headers: { Authorization: `bearer ${token}` }
//     //         })
//     //         console.log("API RESPONCE", res.data)
//     //         setSelectedRow(res.data)
//     //         setEditShow(true)
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }



//     const showAlert = (rowData) => {
//         const Cguid = rowData.Cguid;
//         const timerDuration = 2000; // 4000 milliseconds = 4 seconds
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You won't be able to revert this!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'No, cancel!',
//             reverseButtons: true,
//             // timer: timerDuration,
//             timerProgressBar: true,
//             // onClose: () => {
//             //     // Optional: Perform any action when the timer expires
//             //     // console.log('Timer expired');
//             // }
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 deleteData(Cguid)
//                 Swal.fire({
//                     title: 'Deleted!',
//                     text: 'Your file has been deleted.',
//                     icon: 'success',
//                     timer: timerDuration,
//                     timerProgressBar: true,
//                     showConfirmButton: true,
//                 });
//             } else if (result.dismiss === Swal.DismissReason.cancel) {
//                 Swal.fire({
//                     title: 'Cancelled!',
//                     text: 'No changes have been made.',
//                     icon: 'error',
//                     timer: timerDuration,
//                     timerProgressBar: true,
//                     showConfirmButton: true,
//                 });
//             }
//         });
//     };

//     const deleteData = async (Cguid) => {
//         try {
//             const res = await axios.get(URL + `/api/Transation/DeleteCampaign?Cguid=${Cguid}`, {
//                 headers: { Authorization: `bearer ${token}` },
//             })
//             fetchData()
//         } catch (error) {
//             console.log(error)
//         }

//     }

//     const actionTemplate = (rowData) => {
//         return (
//             <div className="action-btn">
//                 {/* <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button> */}
//                                 <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }} ><i className="fa fa-trash-o fs-4" /> </button>
//             </div>
//         );
//     };

//     const filteredData = Tabledata.filter((item) => {
//         const searchTermLowerCase = searchinput.toLowerCase();
//         return (
//             (item.Name && item.Name.toLowerCase().includes(searchTermLowerCase)) ||
//             (item.Description && item.Description.toLowerCase().includes(searchTermLowerCase))
//         );
//     });


//     const sortData = (column) => {
//         let sortedData = [...filteredData];
//         if (column === sortColumn) {
//             sortedData.reverse();
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//         } else {
//             sortedData.sort((a, b) => {
//                 return a[column].localeCompare(b[column]);
//             });
//             setSortOrder('asc');
//             setSortColumn(column);
//         }
//         setTabledata(sortedData);
//     };

//     const columns = [

//         {
//             title: 'Campaign Name',
//             dataIndex: 'Name',
//             key: 'Name',
//             fixed: 'right',
//             align: 'center',
//         },
//         {
//             title: 'Campaign Description',
//             dataIndex: 'Description',
//             key: 'Description',
//             align: 'center',
//         },
//         {
//             title: 'Project Name ',
//             dataIndex: 'ProjectName',
//             key: 'ProjectName',
//             align: 'center',
//         },
//         {
//             title: 'Category ',
//             dataIndex: 'CategoryName',
//             key: 'CategoryName',
//             align: 'center',
//         },
//         {
//             title: 'Sub-Category ',
//             dataIndex: 'Heading',
//             key: 'Heading',
//             align: 'center',
//         },
//         {
//             title: 'Action',

//             align: 'center',
//             render: actionTemplate,
//             width: 190
//         },
//         // Add more columns as needed

//     ];
//     const totalRecords = filteredData.length;

//     const TotalRecordFooter = () => (
//         <div>
//             <h5><b>Total Records: </b>{totalRecords}</h5>
//         </div>
//     );


//     return (
//         <div>
//             <div className='table-responsive'>
//                 {Tabledata.length > 0 ? (
//                     <Table columns={columns} dataSource={filteredData} footer={TotalRecordFooter} />
//                 ) : (
//                     <p>No data available.</p>
//                 )}
//             </div>
//             {
//                 selectedrow ?
//                     <EditData
//                         show={editshow}
//                         onHide={() => setEditShow(false)}
//                         selectedrow={selectedrow}
//                         fetchData={fetchData}
//                         getProjectData={getProjectData}
//                     /> : null
//             }
//         </div>

//     );
// }

// export default CampaignTable




import Accordion from 'react-bootstrap/Accordion';
import React from 'react'
import { Table, Tag, Space, Dropdown, Menu, Input, Drawer } from 'antd';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'antd';

function CampaignTable({ insertData, insertDetails }) {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    React.useEffect(() => {
        insertDetails.current = fetchDetails
    }, [])
    const URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("CRMtoken")
    const companyId = localStorage.getItem("CRMCompanyId")
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = useState(false);
    const [Tabledata, setTabledata] = useState([])
    const [tabledatadetails, setTableDataDetails] = useState([])
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/CampaignList?CompanyId=${companyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setTabledata(res.data);
            // onData(res.data);
            // console.log(res.data, 'Fetched data');
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };
    // useEffect(() => {
    //     onData(Tabledata);
    // }, [Tabledata, onData]);
    const fetchDetails = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/CampaignDetailList?Cguid=`, {
                headers: { Authorization: `bearer ${token}` }
            });
            setTableDataDetails(res.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
        fetchDetails()
    }, []);

    const showAlert = (rowData) => {
        const Cguid = rowData.Cguid;
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
                deleteData(Cguid)
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

    const deleteData = async (Cguid) => {
        try {
            const res = await axios.get(URL + `/api/Transation/DeleteCampaign?Cguid=${Cguid}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
        } catch (error) {
            console.log(error)
        }

    }


    const columns = [
        {
            title: 'PartyName',
            dataIndex: 'PartyName',
        },
        {
            title: 'Asign To',
            dataIndex: 'Asign to',
            render: (text, record) => <span>{record.Firstname + ' ' + record.LastName}</span>
        },
        {
            title: 'Mobile1',
            dataIndex: 'Mobile1',
            render: (text, record) => <span>{record.Mobile1 ? record.Mobile1 : '-'}</span>

        },
        {
            title: 'Mobile2',
            dataIndex: 'Mobile2',
            render: (text, record) => <span>{record.Mobile2 ? record.Mobile2 : '-'}</span>

        },
        {
            title: 'Mobile3',
            dataIndex: 'Mobile3',
            render: (text, record) => <span>{record.Mobile3 ? record.Mobile3 : '-'}</span>

        },
        {
            title: 'Mobile4',
            dataIndex: 'Mobile4',
            render: (text, record) => <span>{record.Mobile4 ? record.Mobile4 : '-'}</span>

        },
    ];
    return (
        <Accordion>
            {
                Tabledata.map((display, index) => {
                    const filterData = tabledatadetails.filter((item) => item.Cguid == display.Cguid)
                    return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                            {/* <Accordion.Header>{display.Name}</Accordion.Header> */}
                            <Accordion.Header>
                                <div className='accordian-delete-btn'>
                                    <p>{display.Name}</p>
                                    <Button
                                        type="primary"
                                        className='mr-3'
                                        danger
                                        ghost
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showAlert(display);
                                        }}
                                    >Delete</Button>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className='cmp-accordian'>
                                    <p>Name : <span>{display.Name}</span></p>
                                    <p>Description : <span>{display.Description}</span></p>
                                    <p>ProjectName : <span>{display.ProjectName}</span></p>
                                    <p>CategoryName : <span>{display.CategoryName}</span></p>
                                    <p>Sub-CategoryName : <span>{display.Heading}</span></p>
                                </div>
                                {
                                    filterData.length != 0 ? (<Table columns={columns} size='small' bordered dataSource={filterData} pagination={filterData.pagination} scroll={{ x: 1300 }} />) : null
                                }

                            </Accordion.Body>

                            <Accordion.Body>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })
            }
        </Accordion>
    );
}

export default CampaignTable




    // import React, { useState, useEffect } from 'react';
    // import { Table } from 'antd';
    // import axios from 'axios';

    // const CampaignTable = () => {
    //     const URL = process.env.REACT_APP_API_URL;
    //     const token = localStorage.getItem("CRMtoken");
    //     const companyId = localStorage.getItem("CRMCompanyId");
    //     const [Tabledata, setTabledata] = useState([]);
    //     const [expandedRows, setExpandedRows] = useState({});

    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get(URL + `/api/Transation/CampaignList?CompanyId=${companyId}`, {
    //                 headers: { Authorization: `bearer ${token}` },
    //             });
    //             setTabledata(res.data);
    //         } catch (error) {
    //             console.error('Error fetching table data:', error);
    //         }
    //     };

    //     const fetchDetails = async (guid) => {
    //         try {
    //             const res = await axios.get(URL + `/api/Transation/CampaignDetailList?Cguid=${guid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             });
    //             return res.data;
    //         } catch (error) {
    //             console.log(error);
    //             return [];
    //         }
    //     };

    //     const handleGuid = async (guid) => {
    //         const details = await fetchDetails(guid);
    //         setExpandedRows({
    //             ...expandedRows,
    //             [guid]: details,
    //         });
    //     };

    //     useEffect(() => {
    //         fetchData();
    //     }, []);

    //     const expandedRowRender = (record) => {
    //         const columns = [
    //             {
    //                 title: 'PartyName',
    //                 dataIndex: 'PartyName',
    //             },
    //             {
    //                 title: 'Mobile1',
    //                 dataIndex: 'Mobile1',
    //             },
    //             {
    //                 title: 'Mobile2',
    //                 dataIndex: 'Mobile2',
    //             },
    //             {
    //                 title: 'Mobile3',
    //                 dataIndex: 'Mobile3',
    //             },
    //             {
    //                 title: 'Mobile4',
    //                 dataIndex: 'Mobile4',
    //             },
    //             {
    //                 title: 'Assign To',
    //                 dataIndex: 'Firstname',
    //             },
    //         ];

    //         return <Table columns={columns} dataSource={expandedRows[record.Cguid]} pagination={true} />;
    //     };

    //     const columns = [
    //         {
    //             title: 'Campaign Name',
    //             dataIndex: 'Name',
    //             key: 'Name',
    //             fixed: 'right',
    //             align: 'center',
    //         },
    //         {
    //             title: 'Campaign Description',
    //             dataIndex: 'Description',
    //             key: 'Description',
    //             align: 'center',
    //         },
    //         {
    //             title: 'Project Name ',
    //             dataIndex: 'ProjectName',
    //             key: 'ProjectName',
    //             align: 'center',
    //         },
    //         {
    //             title: 'Category ',
    //             dataIndex: 'CategoryName',
    //             key: 'CategoryName',
    //             align: 'center',
    //         },
    //         {
    //             title: 'Sub-Category ',
    //             dataIndex: 'Heading',
    //             key: 'Heading',
    //             align: 'center',
    //         },
    //         {
    //             title: 'Action',
    //             align: 'center',
    //             width: 190,
    //             render: (text, record) => (
    //                 <button onClick={() => handleGuid(record.Cguid)}>View Details</button>
    //             ),
    //         },
    //     ];

    //     return (
    //         <Table
    //             columns={columns}
    //             expandable={{
    //                 expandedRowRender: (record) => expandedRowRender(record),
    //             }}
    //             dataSource={Tabledata.map((record) => ({ ...record, key: record.Cguid }))}
    //         />
    //     );
    // };

    // export default CampaignTable;


    ;
