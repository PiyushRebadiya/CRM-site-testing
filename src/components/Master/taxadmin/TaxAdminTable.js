import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import TaxAdminForm from './TaxAdminForm';
import Swal from 'sweetalert2';
import { Drawer } from 'antd';
import { Table, Tag, Dropdown, Menu,Tooltip } from 'antd';
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
    const { selectedrow, fetchData, getTaxadmindata } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <TaxAdminForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} getTaxadmindata={getTaxadmindata} />

        </Modal>
    );
}
// function EditData(props) {
//     const { selectedrow, fetchData, onClose } = props
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width={900}
//         >
//             <TaxAdminForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />

//         </Drawer>
//     );
// }

const TaxAdminTable = ({ getTaxadmindata, insertData, searchinput, onData }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [logShow, setLogShow] = React.useState(false);
    const [logtno, setLogTNo] = useState('')
    const role = localStorage.getItem('CRMRole')
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const CompanyId = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        const isActiveString = item.IsActive ? 'Active' : 'Inactive';
        return (
            (item.CategoryName && item.CategoryName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Heading && item.Heading.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            ((searchTermLowerCase === 'active' && item.IsActive) ||
                (searchTermLowerCase === 'inactive' && !item.IsActive))
        );
    });
    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${CompanyId}`, {
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
        const id = rowData.Id
        try {
            const res = await axios.get(URL + `/api/Master/TaxadminById?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
            // console.log(res.data,'subCategory')
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
                deleteData(id, timerDuration)
                // Swal.fire({
                //     title: 'Deleted!',
                //     text: 'Your file has been deleted.',
                //     icon: 'success',
                //     timer: timerDuration,
                //     timerProgressBar: true,
                //     showConfirmButton: true,
                // });
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
    const deleteData = async (id,timerDuration) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeletTaxadmin?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            if (res.data.Success == true) {
                fetchData()
                if (getTaxadmindata) {
                    getTaxadmindata()
                }
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            } else {
                Swal.fire({
                    // title: 'Cancelled!',
                    text: 'This Sub-Category is used in your entries !!!',
                    icon: 'error',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            }
            } catch (error) {
                console.log(error)
            }
        }
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
                        role =='Admin' ||role =='Sub-Admin' ?(
                            <button className="log-btn" 
                            onClick={() => { handleLogDetails(rowData.Cguid) }}
                            >
                                <Tooltip title="TimeLine" >
                                    <FaRegEye size={18} />
                                </Tooltip>
                            </button>
                        ) :(
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
                title: 'Category',
                dataIndex: 'CategoryName',

            },
            {
                title: 'Sub-Category',
                dataIndex: 'Heading',

            },
            {
                title: 'Status',
                dataIndex: 'IsActive',
                align: 'center',
                render: statusTemplate,
                width:150

            },
            {
                title: 'Action',
                fixed: 'right',
                align: 'center',
                render: actionTemplate,
                width: 150
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
                <div className="table-responsive">
                    {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color info">
                            <th>#</th>
                            <th>Category</th>
                            <th>Heading</th>
                            <th>Is Active</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((item, index) => {
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.CategoryName}</td>
                                        <td>{item.Heading}</td>
                                        <td>{`${item.IsActive ?item.IsActive:'' }`}</td>
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
                            getTaxadmindata={getTaxadmindata}
                        /> : null
                    // <EditData
                    //     visible={editshow}
                    //     onHide={() => setEditShow(false)}
                    //     selectedrow={selectedrow}
                    //     fetchData={fetchData}
                    // /> : null
                }
  <TaskLogHistory
                show={logShow}
                onHide={() => setLogShow(false)}
                logtno={logtno}
            />
            </div>
        )
    }

    export default TaxAdminTable