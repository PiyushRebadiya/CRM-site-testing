import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';
import RoleForm from './RoleForm';
import { Table, Tooltip } from 'antd';

function EditData(props) {
    const { selectedrow, fetchData, getRoleData } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <RoleForm rowData={selectedrow} getRoleData={getRoleData} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}

const RoleTable = ({ getRoleData, insertData, searchinput, onData }) => {
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
    const custId = localStorage.getItem("CRMCustId")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const URL = process.env.REACT_APP_API_URL

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            (item.Role && item.Role.toLowerCase().includes(searchTermLowerCase)) // Check for null
        );
    });
    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/RoleList?CustId=${custId}&CompanyId=${CompanyId}`, {
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
    const updateData = async (rowData) => {
        const id = rowData.RoleId
        try {
            const res = await axios.get(URL + `/api/Master/RoleLsitById?RoleId=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (rowData) => {
        const id = rowData.RoleId
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
            onClose: () => {
                // Optional: Perform any action when the timer expires
                console.log('Timer expired');
            }
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
            const res = await axios.get(URL + `/api/Master/DeletRole?RoleId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
            getRoleData();
            // fetchIFSCData()
        } catch (error) {
            console.log(error)
        }
    }

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

    const columns = [
        // ... (other columns)
        {
            title: 'Role Name',
            dataIndex: 'Role',

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

    return (
        <div>
            <div className="table-responsive ">
                {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
            <thead className="back_table_color">
                <tr className=" back-color  info">
                    <th>#</th>
                    <th>Role Name</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    filteredData.map((item, index) => {

                        return (
                            <tr key={index} className='align_middle'>
                                <td className='data-index'>{index + 1}</td>
                                <td>{item.Role}</td>
                                <td className='w-10'>
                                    <div className='action-btn'>
                                        <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.RoleId) }}><i className="fa fa-pencil fs-4" /></button>
                                        <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.RoleId) }}><i className="fa fa-trash-o fs-4" /> </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination} onChange={handleTableChange} />
            </div>
            {
                selectedrow ?
                    <EditData
                        show={editshow}
                        onHide={() => setEditShow(false)}
                        selectedrow={selectedrow}
                        fetchData={fetchData}
                        getRoleData={getRoleData}
                    /> : null
            }

        </div>
    )
}

export default RoleTable