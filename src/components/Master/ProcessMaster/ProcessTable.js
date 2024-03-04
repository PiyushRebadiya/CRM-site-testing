import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import { Tag } from 'antd';
import { Table, Tooltip } from 'antd';
import ProcessForm from './ProcessForm';
import { Offcanvas } from 'react-bootstrap';
import { FaRegEye } from "react-icons/fa";
import CategoryLog from '../categoryMaster/CategoryLog';

function TaskLogHistory(props) {
    const { logtno } = props
    return (
        <Offcanvas
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            placement='end'
        >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title id="contained-modal-title-vcenter">
                    TimeLine
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-5 ms-2'>
                <CategoryLog logtno={logtno} />
            </Offcanvas.Body>
        </Offcanvas>
    );
}

function EditData(props) {
    const { selectedrow, fetchData, getProcessData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ProcessForm rowData={selectedrow} onHide={props.onHide} fetchData={fetchData} getProcessData={getProcessData} />
        </Modal>
    );
}

const ProcessTable = ({ searchinput, insertData, onData, getProcessData }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [logShow, setLogShow] = React.useState(false);
    const [logtno, setLogTNo] = useState('')
    const role = localStorage.getItem('CRMRole')
    const token = localStorage.getItem("CRMtoken")
    const companyId = localStorage.getItem("CRMCompanyId")
    const URL = process.env.REACT_APP_API_URL
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProcessList?CompanyId=${companyId}`, {
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
        return (
            (item.SubCategoryName && item.SubCategoryName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.ProcessName && item.ProcessName.toLowerCase().includes(searchTermLowerCase))
        );
    });
    const updateData = async (rowData) => {
        const id = rowData.Id
        try {
            const res = await axios.get(URL + `/api/Master/ProcessById?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (rowData) => {
        const id = rowData.Id
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
                // console.log('Timer expired');
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
            const res = await axios.get(URL + `/api/Master/DeletProcess?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
            getProcessData()
        } catch (error) {
            console.log(error)
        }
    }
    // const sortData = (column) => {
    //     let sortedData = [...filteredData];
    //     if (column === sortColumn) {
    //         // If clicking the same column, toggle the sorting order
    //         sortedData.reverse();
    //         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         // If clicking a different column, sort in ascending order by default
    //         sortedData.sort((a, b) => {
    //             return a[column].localeCompare(b[column]);
    //         });
    //         setSortOrder('asc');
    //         setSortColumn(column);
    //     }
    //     setData(sortedData);
    // };

    const handleLogDetails = (tno) => {
        setLogTNo(tno)
        setLogShow(true)
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
                {
                    role == 'Admin' || role == 'Sub-Admin' ? (
                        <button className="log-btn"
                            onClick={() => { handleLogDetails(rowData.Cguid) }}
                        >
                            <Tooltip title="TimeLine" >
                                <FaRegEye size={18} />
                            </Tooltip>
                        </button>
                    ) : (
                        null
                    )
                }

            </div>
        );
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'green' : 'red';
    };

    const statusTemplate = (rowData) => {
        // console.log(rowData, "Ankit");
        const statusColor = getStatusColor(rowData);
        // console.log(statusColor, "statusColor")

        return <Tag color={statusColor}>{rowData ? 'Active' : 'Inactive'}</Tag>;
    };

    const columns = [
        // ... (other columns)
        {
            title: 'Sub-Category',
            dataIndex: 'SubCategoryName',
        },
        {
            title: 'Process Name',
            dataIndex: 'ProcessName',
        },
        {
            title: 'Is Active',
            dataIndex: 'IsActive',
            render: statusTemplate,
            align: 'center',
            width: 150
        },
        {
            title: 'Action',
            fixed: 'right',
            align: 'center',
            render: actionTemplate,
            width: 150
        }

    ];
    const totalRecords = filteredData.length; // Assuming filteredData is the data array

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }
    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );
    return (
        <div>
            <div className="table-responsive ">
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
                        getProcessData={getProcessData}
                    /> : null
            }
            <TaskLogHistory
                show={logShow}
                onHide={() => setLogShow(false)}
                logtno={logtno}
            />
        </div>
    )
}

export default ProcessTable