import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import UserForm from './UserForm';
import { Table, Tooltip } from 'antd';
import { Tag } from 'antd';
import { notification } from 'antd';

function EditData(props) {
    const { selectedrow, fetchData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <UserForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}

function UserTable({ insertData, searchinput, datarecord }) {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])

    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL
    const customerId = localStorage.getItem("CRMCustId")
    const CompanyId = localStorage.getItem('CRMCompanyId')


    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            (item.FirstName && item.FirstName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.LastName && item.LastName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            item.Mobile1?.toLowerCase().includes(searchTermLowerCase) ||
            (item.Email && item.Email.toLowerCase().includes(searchTermLowerCase)) ||// Check for null      
            (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.UserName && item.UserName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Role && item.Role.toLowerCase().includes(searchTermLowerCase)) // Check for null      
        );
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${customerId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // console.log(res.data, 'dddddd')
            setData(res.data)
            // datarecord(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
        // user_name()
    }, [])

    // Get an array of usernames from the data
    // const user_name = () => {
    //     const existingUsernames = data.map((item) => item.Username);
    //     username(existingUsernames)
    // }
    //   console.log(existingUsernames, "existingUsernamesexistingUsernamesexistingUsernamesexistingUsernames")

    const updateData = async (rowData) => {
        try {
            const res = await axios.get(URL + `/api/Master/GetEmpListById?Id=${rowData.Id}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const showAlert = (rowData) => {
        if (rowData.Role == 'Admin') {
            notification.error({
                message: 'You can not delete the Admin!!!',
                placement: 'bottomRight', // You can adjust the placement
                duration: 2, // Adjust the duration as needed
            });
        } else {
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

            }).then((result) => {
                if (result.isConfirmed) {
                    deleteData(rowData.Id)
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
        }

    };

    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteEmp?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
        } catch (error) {
            console.log(error)
        }
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <Tooltip title='Edit'>
                <button
                    type="button"
                    className="btn btn-add action_btn btn-sm rounded-2"
                    onClick={() => { updateData(rowData) }}
                >
                    <i className="fa fa-pencil fs-4" />
                </button>
                </Tooltip>
                <Tooltip title='Delete'>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => { showAlert(rowData) }}
                >
                    <i className="fa fa-trash-o fs-4" />
                </button>
                </Tooltip>
                {/* Conditionally render the delete button only if rowData is not the first element in data array */}
                {/* {rowData !== data[0] && (
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => { showAlert(rowData) }}
                    >
                        <i className="fa fa-trash-o fs-4" />
                    </button>
                )} */}
            </div>
        );
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'green' : 'red';
    };

    const statusTemplate = (rowData) => {
        // console.log(rowData, "Ankit");
        const statusColor = getStatusColor(rowData.IsActive);
        // console.log(statusColor, "statusColor")

        return <Tag color={statusColor}>{rowData.IsActive ? 'Active' : 'Inactive'}</Tag>;
    };

    const columns = [
        // ... (other columns)
        {
            title: 'First Name',
            dataIndex: 'FirstName',

        },
        {
            title: 'Last Name',
            dataIndex: 'LastName',

        },
        {
            title: 'Mobile',
            // dataIndex: 'Mobile1',
            render: ((record) =>
                <>
                    <span>{`+${record.Mobile1}`}</span>
                </>
            ),
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'Email',

        },
        {
            title: 'Designation',
            dataIndex: 'PositionName',

        },
        {
            title: 'Username',
            dataIndex: 'UserName',

        },
        {
            title: 'Password',
            dataIndex: 'Password',
            render: (text, record) => (
                <>{'*'.repeat(record.Password.length)}</>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'Role',
        },
        {
            title: 'Status',
            // render: (text, record) => record.IsActive ? "Active" : "Inactive",
            render: statusTemplate,
            fixed: 'right',
            width: 80,
        },
        {
            title: 'Action',
            fixed: 'right',
            align: 'center',
            render: actionTemplate,
            width: 120
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
                        <tr className=" back-color  info">
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((item, index) => {
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index '>{index + 1}</td>
                                        <td>{item.FirstName}</td>
                                        <td>{item.LastName}</td>
                                        <td className="align-middle">{item.Mobile1}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.PositionName}</td>
                                        <td>{item.UserName}</td>
                                        <td>{'*'.repeat(item.Password.length)}</td>
                                        <td>{item.Role}</td>
                                        <td className='w-10'>
                                            <div className='action-btn'>
                                                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.Id) }}><i className="fa fa-pencil fs-4" /></button>
                                                <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.Id) }}><i className="fa fa-trash-o fs-4" /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                    onChange={handleTableChange} footer={TotalRecordFooter} />
            </div>
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
    )
}

export default UserTable