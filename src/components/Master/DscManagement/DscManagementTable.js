import React from 'react'
import axios from 'axios';
import { Tooltip, notification } from 'antd';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import moment from 'moment';
import DscManagementForm from './DscManagementForm';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Tag, Table } from 'antd';


function EditData(props) {
    const { selectedrow, fetchData } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <DscManagementForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}


const DscManagementTable = ({ insertData, searchinput, onData }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const token = localStorage.getItem("CRMtoken")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const UserId = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL
    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetDSCList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            onData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        const assign = (item.FirstName + ' ' + item.LastName).toLowerCase();
        return (
            (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Startdate && item.Startdate.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Enddate && item.Enddate.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (assign && assign.includes(searchTermLowerCase)) ||
            (item.Remark && item.Remark.toLowerCase().includes(searchTermLowerCase)) // Check for null
            //     (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            //     (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) // Check for null
        );
    });
    const updateData = async (id) => {

        try {
            const res = await axios.get(URL + `/api/Master/DSCById?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (id) => {
        const timerDuration = 2000;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
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
            const res = await axios.get(URL + `/api/Master/DeleteDSC?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            if (res.data == true) {
                fetchData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    const actionTemplate = (record)=>{
        return(
            <div className='action-btn'>
                <Tooltip title='Edit'>
                    <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(record.Id) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                <Tooltip title='Delete'>
                    <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(record.Id) }}><i className="fa fa-trash-o fs-4" /> </button>
                </Tooltip>
            </div>
        )
    }
    const columns = [
        // ... (other columns)
        {
            title: 'Issue Date',
            // dataIndex: 'ProjectName',
            render: (record) => {
                return (
                    <div>
                        {moment(record.Startdate).format('DD/MM/YYYY')}
                    </div>
                )
            }

        },
        {
            title: 'Assign By',
            // dataIndex: 'CategoryName',
            render: (record) => {
                return (
                    <div>
                        {record.FirstName + ' ' + record.LastName}
                    </div>
                )
            }

        },
        {
            title: 'Party Name',
            dataIndex: 'PartyName',
        },
        {
            title: 'Type',
            dataIndex: 'Type',
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',
        },
        {
            title: 'Expiry date',
            render: (record) => {
                return (
                    <div>
                        <input
                            type="date"
                            className='dsc-input-table-date mt-1'
                            value={moment(record.Enddate).format('YYYY-MM-DD')}
                            readOnly={true}
                            onChange={(e) => handleEndDateChange(record, e.target.value)}
                            onDoubleClick={(e) => e.target.readOnly = false} // Enable editing on double click
                            onBlur={(e) => e.target.readOnly = true} // Disable editing on blur (when focus is lost)
                        />
                    </div>
                )
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            align: 'center',
            render: actionTemplate,
            width: 200
        }
        // ... (other columns)
    ];
    const handleEndDateChange = async (item, value) => {
        // const inputDate = value;
        // const calculatedDate = new Date(inputDate);
        // calculatedDate.setFullYear(calculatedDate.getFullYear() + 1);
        // const DateConvert = calculatedDate
        // const day = DateConvert.getDate().toString().padStart(2, '0');
        // const month = (DateConvert.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
        // const year = DateConvert.getFullYear();
        // const formattedDate = `${year}-${month}-${day}`;
        try {
            const res = await axios.post(URL + "/api/Master/CreateDSC", {
                Flag: "U",
                DSC: {
                    Id: item.Id,
                    CompanyId: item.CompanyId,
                    PartyId: item.PartyId,
                    Name: item.Name,
                    Startdate: item.Startdate,
                    Enddate: value,
                    Type: item.Type,
                    Remark: item.Remark,
                    AssignBy: item.AssignBy,
                    UserID: item.UserID,
                    IsActive: true,
                }

            }, {
                headers: { Authorization: `bearer ${token}` }
            })
            if (res.data.Success == true) {
                fetchData()
                notification.success({
                    message: 'Data Modified Successfully !!!',
                    placement: 'bottomRight', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
            }
            fetchData()
        } catch (error) {
            console.log(error)
        }
    }
    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{filteredData.length}</h5>
        </div>
    );
    return (
        <div>
            <div>
                {/* <div className="table-responsive ">
                    <table id="dataTableExample1" className="table table-light table-hover">
                        <thead className="back_table_color">
                            <tr className="">
                                <th className='table-data'>#</th>
                                <th className='table-data' >Issue Date</th>
                                <th className='table-data'>Assign By</th>
                                <th className='table-data'>Party Name</th>
                                <th className='table-data'>Type</th>
                                <th className='table-data'>Remark</th>
                                <th className='table-data'>Expiry date</th>
                                <th colSpan="2" className='table-data'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredData.map((item, index) => {
                                    return (
                                        <tr key={index} className='align_middle'>
                                            <td className='data-index'>{index + 1}</td>
                                            <td className='text-center'>{moment(item.Startdate).format('DD/MM/YYYY')}</td>
                                            <td className='table-data'>{item.FirstName + ' ' + item.LastName}</td>
                                            <td className='table-data'>{item.PartyName}</td>
                                            <td className='table-data'>{item.Type}</td>
                                            <td className='table-data'>{item.Remark}</td>
                                            <td className='table-date'> <Tag color='red'>
                                                <input
                                                    type="date"
                                                    className='dsc-input-table-date mt-1'
                                                    value={moment(item.Enddate).format('YYYY-MM-DD')}
                                                    readOnly={true}
                                                    onChange={(e) => handleEndDateChange(item, e.target.value)}
                                                    onDoubleClick={(e) => e.target.readOnly = false} // Enable editing on double click
                                                    onBlur={(e) => e.target.readOnly = true} // Disable editing on blur (when focus is lost)
                                                />
                                            </Tag></td>

                                            <td className='w-10'>
                                                <div className='action-btn'>
                                                    <Tooltip title='Edit'>
                                                        <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.Id) }}><i className="fa fa-pencil fs-4" /></button>
                                                    </Tooltip>
                                                    <Tooltip title='Delete'>
                                                        <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.Id) }}><i className="fa fa-trash-o fs-4" /> </button>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                    onChange={handleTableChange}
                    footer={TotalRecordFooter}
                />

                {
                    selectedrow ?
                        <EditData
                            show={editshow}
                            onHide={() => setEditShow(false)}
                            selectedrow={selectedrow}
                            fetchData={fetchData}
                        /> : null
                }
            </div>
        </div>
    )
}

export default DscManagementTable


