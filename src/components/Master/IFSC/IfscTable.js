import React, { useState, useEffect } from 'react'
import axios from 'axios'
import IfscForm from './IfscForm'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';
import { Drawer } from 'antd';
import Button from 'react-bootstrap/Button';
import ImportTable from './ImportTable'
import { notification } from 'antd';
import { Table, Tag, Space, Dropdown, Menu,Tooltip } from 'antd';

function EditData(props) {
    const { selectedrow, fetchData, fetchIFSCData} = props
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <IfscForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} fetchIFSCData={fetchIFSCData} />
        </Modal>
    );
}

function ImportFile(props) {
    const { importfiledata, importDataformUpload } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Import File Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ImportTable importfiledata={importfiledata} onHide={props.onHide} importDataformUpload={importDataformUpload} />
            </Modal.Body>
        </Modal>
    );
}
// function EditData(props) {
//     const { selectedrow, fetchData, onClose,fetchIFSCData } = props
//     return (
//         <Drawer
//             {...props}
//             title="Edit IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width={1300}
//         >
//             <IfscForm
//                 rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} fetchIFSCData={fetchIFSCData}
//             />
//         </Drawer>
//     )
// }

function IfscTable({ fetchIFSCData, insertData, searchinput, onData, importdata }) {

    React.useEffect(() => {
        insertData.current = fetchData
    }, [])

    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [importShow, setImportShow] = React.useState(false);
    const [editshow, setEditShow] = React.useState(false);
    const token = localStorage.getItem("CRMtoken")
    const custId = localStorage.getItem("CRMCustId")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const [importfiledata, setImportFileData] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const URL = process.env.REACT_APP_API_URL

    const importDataformUpload = async () => {
        try {
            for (const display of importdata) {
                const dataToImport = {
                    Flag: "A",
                    IFSCCode: {
                        BankName: display.BankName,
                        BranchName: display.BranchName,
                        IFSC: display.IFSC,
                        CustId: custId,
                        Guid: display.Guid,
                        CompanyID: CompanyId,
                    },
                };

                const res = await axios.post(
                    URL + "/api/Master/CreateIFSC",
                    dataToImport,
                    {
                        headers: { Authorization: `bearer ${token}` },
                    }
                );
            }
            fetchData()
            notification.success({
                message: 'Data Import Successfully !!!',
                placement: 'bottomRight', // You can adjust the placement
                duration: 1, // Adjust the duration as needed
            });
        } catch (error) {
            console.error(error);
        }
    };
    // import-data-excel
    useEffect(() => {
        if (importdata.length > 0) {
            // setData(importdata)
            // onData(importdata)
            setImportFileData(importdata)
            setImportShow(true)
            // importDataformUpload() 
        }

    }, [importdata])
    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            // item.BankName.toLowerCase().includes(searchTermLowerCase) ||
            // item.BranchName.toLowerCase().includes(searchTermLowerCase) ||
            // item.IFSC?.toLowerCase().includes(searchTermLowerCase)
            (item.BankName && item.BankName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null   
            (item.BranchName && item.BranchName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null   
            (item.IFSC && item.IFSC.toLowerCase().includes(searchTermLowerCase)) // Check for null   


        );
    });

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/IFSCList?CustId=${custId}&CompanyID=${CompanyId}`, {
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
        const id = rowData.IFSCID;
        try {
            const res = await axios.get(URL + `/api/Master/IFSCListById?IFSCID=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (rowData) => {
        const id = rowData.IFSCID;
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
            const res = await axios.get(URL + `/api/Master/DeleteIFSC?IFSCID=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData()
            fetchIFSCData()
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
            title: 'Bank Name',
            dataIndex: 'BankName',

        },
        {
            title: 'Branch Name',
            dataIndex: 'BranchName',

        },
        {
            title: 'IFSC Code',
            dataIndex: 'IFSC',

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
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>IFSC Code</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredData.map((item, index) => {

                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.BankName}</td>
                                        <td>{item.BranchName}</td>
                                        <td>{item.IFSC}</td>
                                        <td className='w-10'>
                                            <div className='action-btn'>
                                                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.IFSCID) }}><i className="fa fa-pencil fs-4" /></button>
                                                <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.IFSCID) }}><i className="fa fa-trash-o fs-4" /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                        onChange={handleTableChange}   footer={TotalRecordFooter}/>
            </div>
            {
                selectedrow ?
                    // <EditData
                    //     visible={editshow}
                    //     onHide={() => setEditShow(false)}
                    //     selectedrow={selectedrow}
                    //     fetchData={fetchData}
                    //     fetchIFSCData={fetchIFSCData}
                    // /> : null
                <EditData
                    show={editshow}
                    onHide={() => setEditShow(false)}
                    selectedrow={selectedrow}
                    fetchData={fetchData}
                    fetchIFSCData={fetchIFSCData}
                /> : null
            }
            <ImportFile
                show={importShow}
                onHide={() => setImportShow(false)}
                importfiledata={importfiledata}
                importDataformUpload={importDataformUpload}
            />
        </div>
    )
}

export default IfscTable