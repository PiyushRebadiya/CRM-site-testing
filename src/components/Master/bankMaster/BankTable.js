import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import BankForm from './BankForm';
import { Drawer } from 'antd';
import { Table, Tag, Space, Dropdown, Menu, Tooltip } from 'antd';

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
            <BankForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
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
//             width={1300}
//         >
//             <BankForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
//         </Drawer>
//     );
// }

const BankTable = ({ insertData, searchinput, onData }) => {
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
            item.BankName.toLowerCase().includes(searchTermLowerCase) ||
            item.BranchName.toLowerCase().includes(searchTermLowerCase) ||
            item.IFSCCode?.toLowerCase().includes(searchTermLowerCase) ||
            item.AcNo?.toLowerCase().includes(searchTermLowerCase) ||
            item.AccType.toLowerCase().includes(searchTermLowerCase)
        );
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/BankList?CustId=${customerId}&CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // const allData = res.data;
            // const filteredData = allData.filter(item => item.CustId === customerId);
            setData(res.data)
            onData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
        // user_name()
    }, [])

    const updateData = async (rowData) => {
        const id = rowData.BankID;
        try {
            const res = await axios.get(URL + `/api/Master/BankListById?BankID=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const showAlert = (rowData) => {
        const id = rowData.BankID;
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
            const res = await axios.get(URL + `/api/Master/DeleteBank?BankID=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
        } catch (error) {
            console.log(error)
        }
    }

    // Sorting function
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
            title: 'IFSC Code',
            dataIndex: 'IFSCCode',

        },
        {
            title: 'Bank Name',
            dataIndex: 'BankName',

        },
        {
            title: 'Branch Name',
            dataIndex: 'BranchName',

        },
        {
            title: 'Account Number',
            dataIndex: 'AcNo',

        },
        {
            title: 'Account Type',
            dataIndex: 'Description',

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
                            <th>IFSC Code</th>
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>Account Number</th>
                            <th>Account Type</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((item, index) => {
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.IFSCCode}</td>
                                        <td>{item.BankName}</td>
                                        <td>{item.BranchName}</td>
                                        <td>{item.AcNo}</td>
                                        <td>{item.Description}</td>
                                        <td className='w-10'>
                                            <div className='action-btn'>
                                                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.BankID) }}><i className="fa fa-pencil fs-4" /></button>
                                                <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.BankID) }}><i className="fa fa-trash-o fs-4" /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} onChange={handleTableChange} pagination={tableParams.pagination} footer={TotalRecordFooter} />
            </div>
            {
                selectedrow ?
                    <EditData
                        show={editshow}
                        onHide={() => setEditShow(false)}
                        selectedrow={selectedrow}
                        fetchData={fetchData}
                    /> : null
                // <EditData
                //     visible={editshow}
                //     onHide={() => setEditShow(false)}
                //     selectedrow={selectedrow}
                //     fetchData={fetchData}
                // /> : null
            }

        </div>
    )
}

export default BankTable