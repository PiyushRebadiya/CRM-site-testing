import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
// import PartyForm from './PartyForm';
import PartnerForm from './PartnerForm';
import moment from 'moment'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import DocumentForm from '../documentUpload/DocumentForm';
import { Drawer, Tooltip } from 'antd';
// import PartyImportRecord from './PartyImportRecord';
import { Table, Tag, Space, Dropdown, Menu, Input } from 'antd';

function EditData(props) {
    const { selectedrow, fetchData, getPartnerData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <PartnerForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} getPartnerData={getPartnerData} />
        </Modal>
    );
}

const PartnerTable = ({ getPartnerData, insertData, searchinput, datarecord, ondata, importdata }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [loading, setLoading] = useState(true);
    const [documentnew, setDocumentNew] = React.useState(false)
    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [importShow, setImportShow] = React.useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const companyid = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL
    const customerId = localStorage.getItem("CRMCustId")
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const { Search } = Input;

    useEffect(() => {
        if (importdata.length > 0) {
            setImportShow(true)
        }
    }, [importdata])
    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(URL + `/api/Master/PartnerList?CustId=${customerId}&CompanyId=${companyid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            ondata(res.data)
            datarecord(res.data)
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: 200,
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                },
            });
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false); // Set loading to false after the request is completed
        }
    }
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            (item.PartnerName && item.PartnerName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.LegelName && item.LegelName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Add1 && item.Add1.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Add2 && item.Add2.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Add3 && item.Add3.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.StateName && item.StateName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.Mobile1 && item.Mobile1.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.PAN && item.PAN.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item.GST && item.GST.toLowerCase().includes(searchTermLowerCase)) // Check for null
        );
    });

    const updateData = async (rowData) => {
        try {
            const res = await axios.get(URL + `/api/Master/PartnerListById?PartnerId=${rowData.PartnerId}`, {
                headers: { Authorization: `bearer ${token}` } 
            })
            setSelectedRow(res.data)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    // const [partnerID, setPartnerID] = useState()
    // const uploadData = async (rowData) => {
    //     setPartnerID(rowData.PartnerId)
    //     try {
    //         const res = await axios.get(URL + `/api/Master/PartnerListById?PartnerId=${rowData.PartnerId}`, {

    //             headers: { Authorization: `bearer ${token}` }
    //         })
    //         setSelectedRow(res.data)
    //         setDocumentNew(true)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const showAlert = (rowData) => {
        const id = rowData.PartnerId
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

    const deleteData = async (id, timerDuration) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeletePartner?PartnerId=${id}`, {

                headers: { Authorization: `bearer ${token}` },
            })
            if (res.data.Success == true) {
                fetchData()
                if (getPartnerData) {
                    getPartnerData()
                }
                // getPartyData()

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
                    text: 'This Party is used in your entries !!!',
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
    const Address = (rowData) => {
        const address = rowData.Add1 || rowData.Add2 || rowData.Add3 ? (rowData.Add1 + ',' + rowData.Add2 + ',' + rowData.Add3 + ',' + (rowData.Code == null ? '' : rowData.Code)) : 'No Data'
        return address
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">

                <Tooltip title="Edit">
                    <button type="button" className="btn btn-add action_btn btn-sm rounded-2"
                    onClick={() => { updateData(rowData) }}
                    >
                        <i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                {/* <Tooltip title="Upload Document">
                    <button type="button" className="btn btn-primary action_btn btn-sm mr-1 rounded-2" onClick={() => uploadData(rowData)}>  <AiOutlineCloudUpload size={22} /></button>
                </Tooltip> */}
                <Tooltip title="Delete">
                    <button type="button" className="btn btn-danger btn-sm"
                    onClick={() => { showAlert(rowData) }}
                    >
                        <i className="fa fa-trash-o fs-4" /> </button>
                </Tooltip>
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
        {
            title: 'Partner Name',
            dataIndex: 'PartnerName',
            width: 250,
        },
        {
            title: 'Legal Name',
            dataIndex: 'LegelName',
            width: 180
        },
        {
            title: 'Address',
            dataIndex: 'Add1',
            width: 400,
            render: (text, record) => {
              const { Add1, Add2, Add3, Code } = record;
              const address = Add1 || Add2 || Add3 || Code ? `${Add1}, ${Add2}, ${Add3}, ${Code ? Code : ''}` : 'No Data';
              return <span>{address}</span>;
            }
          },

        {
            title:'State Name',
            dataIndex:'StateName',
            width: 120
            // render:assignToTemplate,
        },
        {
            title: 'Mobile',
            // dataIndex: 'Mobile1',
            width: 120,
            render: (record) => {
            //   console.log('Record:', record); // Logging the record object
              return <span>{`+${record.Mobile1}`}</span>;
            }
          },
        {
            
            title: 'Date of Birth',
            dataIndex:'DOB',
            render: (text, record) => record.DOB ? moment(record.DOB).format('DD/MM/YYYY') : 'No Date',
            width: 120
        },
        {
            title: 'Date of Joining',
            dataIndex:'DOJ',
            render: (text, record) => record.DOJ ? moment(record.DOJ).format('DD/MM/YYYY') : 'No Date',
            width: 130
        },
        {
            title: 'Date of Annivarsary',
            dataIndex:'AnnivarsaryDate',
            render: (text, record) => record.AnnivarsaryDate ? moment(record.AnnivarsaryDate).format('DD/MM/YYYY') : 'No Date',
            width: 180
        },
        {
            title: 'PAN',
            dataIndex: 'PAN',
            width: 130
        },
        //   {
        //     title:'TAN',
        //     dataIndex:'TAN',
        //     width:130
        //   },
        {
            title: 'GST',
            dataIndex: 'GST',
            width: 155
        },
        {
            title: 'Status',
            // render: (text, record) => record.IsActive ? "Active" : "Inactive",
            render: statusTemplate,
            fixed: 'right',
            align: 'center',
            width: 80,
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 180,
            align: 'center',
            render: actionTemplate
        }
        // ... (other columns)
    ];

    const totalRecords = filteredData.length; // Assuming filteredData is the data array


    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );

    return (
        <div>
            <Table
                columns={columns}
                loading={loading}
                bordered
                size='small'
                //  dataSource={filteredData}
                // pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                scroll={{ x: 2100 }}
                dataSource={filteredData}
                pagination={tableParams.pagination}
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
                        getPartnerData={getPartnerData}
                    /> : null
            }
            {/* {
        selectedrow ?
            <NewData
                show={documentnew}
                onHide={() => setDocumentNew(false)}
                selectedrow={selectedrow}
                partnerID={partnerID}
            /> : null
    }
    <ImportFile
        show={importShow}
        onHide={() => setImportShow(false)}
        data={data}
        importdata={importdata}
        fetchData={fetchData}
    /> */}
        </div>
    )
}

export default PartnerTable
