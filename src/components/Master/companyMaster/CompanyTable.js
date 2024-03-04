import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import CompanyForm from './CompanyForm';
import Button from 'react-bootstrap/Button';
import { MdAddCircleOutline } from 'react-icons/md';
import { Table, Alert, Tooltip } from 'antd';
import { notification } from 'antd';
import CompanyListContext from '../../context/filteredCompanyList';

function EditData(props) {
    const { selectedRow, fetchData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <CompanyForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
const CompanyTable = ({ insertData, onData, editFormOpen, handleNewButtonClick }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    const CustId = localStorage.getItem('CRMCustId')
    const [editshow, setEditShow] = React.useState(false);
    const companyId = localStorage.getItem('CRMCompanyId')
    const [selectedRow, setSelectedRow] = useState([]);
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [searchinput, sertSearchInput] = useState("")
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const { filteredCompanyList, setFilteredCompanyList } = useContext(CompanyListContext);


    const isNewButtonVisible = !showCompanyForm && !editFormOpen;

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CompanyList?CustId=${CustId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setData(res.data);
            onData(res.data)
        } catch (error) {
            // Handle error
        }
    };
    const getCompanyList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/CompanyList?CustId=${CustId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
           
            setFilteredCompanyList(res.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            item.CompanyName.toLowerCase().includes(searchTermLowerCase) ||
            (item.Add1 && item.Add1.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Add2 && item.Add2.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Add3 && item.Add3.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Mobile1 && item.Mobile1.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.PAN && item.PAN.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.GST && item.GST.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.AreaName && item.AreaName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.StateName && item.StateName.toLowerCase().includes(searchTermLowerCase)) // Check for null
            // item.IFSCCode?.toLowerCase().includes(searchTermLowerCase) ||
        );
    });
    const updatedata = async (rowData) => {
        try {
            const res = await axios.get(URL + `/api/Master/CompanyListById?CompanyId=${rowData.CompanyId}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            // setSelectedRow(res.data);
            // setEditShow(true)
            setSelectedRow(res.data);
            setShowCompanyForm(true);
            // console.log(res.data, 'updatedid')
        } catch (error) {
            console.log(error)
        }
    }

    const showAlert = (rowData) => {
        // const CompnayId = rowData.CompanyId
        // if (CompnayId == companyId) {
        //     // console.log(CompnayId, "CompnayId-CompnayId-------------------------")
        //     notification.error({
        //         message: ' NOT DELETED!!!',
        //         placement: 'bottomRight', // You can adjust the placement
        //         duration: 1, // Adjust the duration as needed
        //     });
        // } else {
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
                deleteData(rowData.CompanyId)
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
        // }
    };

    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteCompany?CompanyId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData();
            getCompanyList();
        } catch (error) {
            // console.log(error)
        }
    }
    const AlertDelete = (rowData) => {
        notification.error({
            message: ' NOT DELETED!!!',
            placement: 'bottomRight', // You can adjust the placement
            duration: 1, // Adjust the duration as needed
        });
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <Tooltip title='Edit'>
                    <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                {
                    rowData != data[0] ? (
                        <Tooltip title='Delete'>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
                        </Tooltip>
                    ) : (
                        <Tooltip title='Delete'>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => { AlertDelete(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
                        </Tooltip>
                    )
                }

            </div>
        );
    };

    const columns = [
        // ... (other columns)
        {
            title: 'Company Name',
            dataIndex: 'CompanyName',

        },
        {
            title: 'Address',
            dataIndex: 'key', // Assuming 'key' is a unique identifier for each row
            render: (text, record) => (
                <span>{`${record.Add1}, ${record.Add2}, ${record.Add3} ,${record.Code ? record.Code : ''}`}</span>
            ),
        },
        {
            title: 'City',
            dataIndex: 'CityName',
        },
        {
            title: 'State',
            dataIndex: 'StateName',
        },
        {
            title: 'Mobile No.',
            dataIndex: 'Mobile1',
            render: (text, record) => `+${record.Mobile1}`
        },
        {
            title: 'Email',
            dataIndex: 'Email',
        },
        {
            title: 'PAN',
            dataIndex: 'PAN',
        },
        {
            title: 'GST',
            dataIndex: 'GST',
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
        <div className='p-3'>
            <div className="table-responsive">
                {isNewButtonVisible && (
                    <div className="col-sm-12">
                        <div className='user-action-btn'>
                            <div className="btn-group d-flex input-searching-main pb-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={handleNewButtonClick}>
                                        <i className="fa fa-plus" /> Add Company [F2]
                                    </Button>
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search Company ' onChange={(event) => { sertSearchInput(event.target.value) }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!showCompanyForm && (
                    <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                        onChange={handleTableChange} footer={TotalRecordFooter} />
                )}
            </div>
            {showCompanyForm && (
                <CompanyForm
                    rowData={selectedRow}
                    onHide={() => setShowCompanyForm(false)}
                    fetchData={fetchData}
                />
            )}

        </div>
    )
}

export default CompanyTable