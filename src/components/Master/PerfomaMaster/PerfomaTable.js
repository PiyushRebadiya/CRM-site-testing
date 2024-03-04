import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import PerfomaForm from './PerfomaForm';
import Setting from './Setting';
import { useLocation } from 'react-router-dom'
import { BsPrinterFill } from 'react-icons/bs';
import { Drawer } from 'antd';
import { Table } from 'antd';
import moment from 'moment';
import { AiFillSetting } from 'react-icons/ai';
import { OverlayTrigger, } from 'react-bootstrap';
import { notification } from 'antd';
import { Tooltip } from 'antd';

function EditData(props) {
  const location = useLocation()
  const { selectedrow, fetchData, selectedporformadata } = props
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <PerfomaForm rowData={selectedrow} selectedporformadata={selectedporformadata} fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}
function SettingModal(props) {
  const { fetchData, setting, fetchSettingData } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Setting fetchData={fetchData} setting={setting} fetchSettingData={fetchSettingData} onHide={props.onHide} />
    </Modal>
  );
}
// function EditData(props) {
//   // const location = useLocation()
//   const { selectedrow, fetchData, fetchSalesData, selectedporformadata, onClose } = props
//   return (
//     <Drawer
//       {...props}
//       title="Edit Proforma"
//       placement="right"
//       onClose={onClose}
//       visible={props.visible}
//       width={1670}
//     >
//       <PerfomaForm rowData={selectedrow} selectedporformadata={selectedporformadata} fetchData={fetchData} fetchSalesData={fetchSalesData} onHide={props.onHide} />
//     </Drawer>
//   );
// }

function EditSettingData(props) {
  const { selectedrow, fetchData } = props
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Setting rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}

const PerfomaTable = ({ insertData, editFormOpen, onData, handleNewButtonClick }) => {
  React.useEffect(() => {
    insertData.current = fetchData
  }, [])
  const location = useLocation()
  const [data, setData] = useState([])
  const [settingData, setSettingData] = useState([])
  const [selectedRow, setSelectedRow] = useState([]);
  const [showProformaForm, setShowProformaForm] = useState(false);
  const [searchinput, sertSearchInput] = useState("")
  const [selectedporformadata, setSelectedpPerformaData] = useState([])
  const [editshow, setEditShow] = React.useState(false);
  const [setting, setSetting] = useState("")
  const [settingform, setSettingForm] = useState(null)

  const isNewButtonVisible = !showProformaForm && !editFormOpen;

  const token = localStorage.getItem("CRMtoken")
  const URL = process.env.REACT_APP_API_URL
  const customerId = localStorage.getItem("CRMCustId")
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const [result, setResult] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });

  const fetchSettingData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/SettingList?CompanyId=${CompanyId}&TransMode=Proforma`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setSettingData(res.data);
      setSetting(res.data[0].Prefix);
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    fetchSettingData();
  }, []);

  const RemarkAddOn = async () => {
    try {
      const response = await axios.post(URL + "/api/Master/Createupdatemstsetting", {
        Prefix: "INV",
        Remark1: "Payment Terms And Conditions",
        Remark2: "",
        Remark3: "",
        Remark4: "",
        Remark5: "",
        Remark6: "",
        CompanyId: CompanyId,
        CBankId: "",
        TransMode: "Proforma",
        Format: "F1"
      }, {
        headers: { Authorization: `bearer ${token}` }
      })
    } catch (error) {

    }
  }
  const handleAddProformaClick = () => {

    if (!settingData) {
      // Handle the case where settingData is not available (still fetching)
      // You can show a loading state or take other actions

    } else if (settingData.length <= 0) {
      // Show a notification if settingData is empty
      // notification.error({
      //   message: 'Please set setting first.',
      //   placement: 'bottomRight',
      //   duration: 2,
      // });
      RemarkAddOn()
      handleNewButtonClick();

    } else {
      // Handle the click event as usual
      handleNewButtonClick();
    }
  };
  // const handleAddProformaClick = () => {
  //   handleNewButtonClick();
  // };
  useEffect(() => {
    // Function to handle keypress event
    function handleKeyPress(event) {
      if (event.key === 'F2') {
        fetchSettingData()
        handleAddProformaClick();
      }
    }

    // Add event listener for keypress
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [settingData]); // Empty dependency array to ensure this effect runs only once

  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    const ticketNumber = (item.Prefix || "") + (item.TranNo || "");
    const lowerCaseTicketNumber = ticketNumber.toLowerCase();
    const lowerCaseDueDate = moment(item.DueDate).format('DD/MM/YYYY').toLowerCase();
    const lowerCaseTransDate = moment(item.TransDate).format('DD/MM/YYYY').toLowerCase();
    return (
      // item.Remark.toLowerCase().includes(searchTermLowerCase)
      (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      lowerCaseTicketNumber.includes(searchTermLowerCase) ||
      // (item.TranNo && item.TranNo.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (lowerCaseDueDate && lowerCaseDueDate.includes(searchTermLowerCase)) ||
      (lowerCaseTransDate && lowerCaseTransDate.includes(searchTermLowerCase)) ||
      (item.Remark && item.Remark.toLowerCase().includes(searchTermLowerCase)) // Check for null
      // (fullName && fullName.includes(searchTermLowerCase))
    );
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${CompanyId}&TransMode=Proforma`, {
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
    const id = rowData.Id;
    const cguid = rowData.CGuid;
    try {
      const res = await axios.get(URL + `/api/Transation/GetTransationListById1?CompanyID=${CompanyId}&TransMode=Proforma&Id=${id}&CGUID=${cguid}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setSelectedRow(res.data.TransationMast)
      setSelectedpPerformaData(res.data.StockDetail)
      setShowProformaForm(true)
      // setEditShow(true)
    } catch (error) {
      console.log(error, "error ankit")
    }
  }
  const showAlert = (rowData) => {
    const id = rowData.CGuid;
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
      const res = await axios.get(URL + `/api/Transation/DeleteTransation?TransMode=Proforma&CGUID=${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }
  const handleSinglePrint = (rowData) => {
    const guid = rowData.CGuid
    // var targetURL = `http://www.report.taxfile.co.in/Report/TransactionReport?CompanyID=${CompanyId}&CGuid=/${guid}/&ReportMode=${location.pathname == '/proformaentry' && 'Proforma' || location.pathname == '/sales' && 'Sales'}`;

    // // Redirect to the specified URL
    // window.open(targetURL, '_blank');
    const url = `https://report.taxfile.co.in/Report/TransactionReport?CompanyID=${CompanyId}&CGuid=/${guid}/&ReportMode=Proforma`;
    const windowName = "myWindow";
    const windowSize = "width=1500,height=900";
    setResult(window.open(url, windowName, windowSize));
  }

  const actionTemplate = (rowData) => {
    return (
      <div className="action-btn">
        <Tooltip title='Edit'>
          <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button>
        </Tooltip>
        <Tooltip title="Delete">
          <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
        </Tooltip>
        <Tooltip title="Print">
          <button type="button" className="btn btn-primary action_btn btn-sm" onClick={() => { handleSinglePrint(rowData) }} ><BsPrinterFill size={20} /></button>
        </Tooltip>
      </div>
    );
  };

  const columns = [
    {
      title: 'Party Name',
      dataIndex: 'PartyName',
      width: 250,

    },
    {
      title: 'INV No.',
      render: (text, record) => record.Prefix + record.TranNo, // Add the return statement here
      width: 50
    },
    // {
    //     title:'Area Name',
    //     key: 'AreaName',
    //     width:180
    //     // render:assignByTemplate,
    // },
    {
      title: 'Net Amount',
      dataIndex: 'NetAmount',
      width: 120
      // render:assignToTemplate,
    },

    {
      title: 'Proforma Date',
      dataIndex: 'TransDate',
      render: (text, record) => record.TransDate ? moment(record.TransDate).format('DD/MM/YYYY') : 'No Date',
      width: 60
    },
    {
      title: 'Due Date',
      dataIndex: "DueDate",
      render: (text, record) => record.DueDate ? moment(record.DueDate).format('DD/MM/YYYY') : 'No Date',
      width: 60
    },
    {
      title: 'Remark',
      dataIndex: "Remark",
      width: 300
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 50,
      render: actionTemplate
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
    // <div>
    //   <div className="table-responsive ">
    //     <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={{ pageSize: 10, position: ['bottomCenter'] }} />
    //   </div>
    //   {
    //     selectedrow ?
    //       <EditData
    //         show={editshow}
    //         onHide={() => setEditShow(false)}
    //         selectedrow={selectedrow}
    //         selectedporformadata={selectedporformadata}
    //         fetchData={fetchData}
    //         fetchSalesData={fetchDataSales}

    //       /> : null
    //   }

    // </div>
    <div className='p-3'>
      <div className="table-responsive">
        {isNewButtonVisible && (
          <div className="col-sm-12">
            <div className='user-action-btn'>
              <div className="btn-group d-flex input-searching-main pb-3" role="group">
                <div className="buttonexport d-flex " id="buttonlist">
                  {/* <Button className="btn btn-add rounded-2" onClick={handleNewButtonClick} disabled={!settingData || settingData.length <= 0}> */}
                  <Button className="btn btn-add rounded-2" onClick={handleAddProformaClick}>
                    <i className="fa fa-plus" /> Add Proforma [F2]
                  </Button>
                  <div className='ml-3'>
                    <Tooltip title="Prefix Setting">
                      <Button className="btn btn-add rounded" style={{ marginRight: '800px' }} onClick={() => setSettingForm(true)}>
                        <AiFillSetting className='mb-1' />
                      </Button>
                    </Tooltip>
                    <SettingModal
                      show={settingform}
                      onHide={() => setSettingForm(false)}
                      setting={setting}
                      fetchSettingData={fetchSettingData}
                    />
                  </div>
                </div>
                <div className='searching-input'>
                  <input type="text" className='form-control' placeholder='Search Here ' onChange={(event) => { sertSearchInput(event.target.value) }} />
                </div>
              </div>
            </div>
          </div>
        )}
        {!showProformaForm && (
          <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
            onChange={handleTableChange} footer={TotalRecordFooter} />
        )}
      </div>
      {showProformaForm && (
        <PerfomaForm
          rowData={selectedRow}
          onHide={() => setShowProformaForm(false)}
          fetchData={fetchData}
          selectedporformadata={selectedporformadata}
        />
      )}

    </div>
  )
}

export default PerfomaTable