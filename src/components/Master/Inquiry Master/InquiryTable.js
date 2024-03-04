import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';
import InquiryForm from './InquiryForm';
import moment from 'moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tooltip } from 'antd';
import { Table, Tag, Space, Dropdown, Menu, Input, Switch } from 'antd';

function EditData(props) {
  const { selectedrow, fetchInquiryData } = props
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <InquiryForm rowData={selectedrow} fetchData={fetchInquiryData} onHide={props.onHide} />
    </Modal>
  );
}

const InquiryTable = ({ insertData, searchinput, onData }) => {
  React.useEffect(() => {
    insertData.current = fetchInquiryData
  }, [])
  const [data, setData] = useState([])
  const [selectedrow, setSelectedRow] = useState([])
  const [editshow, setEditShow] = React.useState(false);
  const token = localStorage.getItem("CRMtoken")
  const custId = localStorage.getItem("CRMCustId")
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const userid = localStorage.getItem('CRMUserId')
  const Role = localStorage.getItem('CRMRole')
  const URL = process.env.REACT_APP_API_URL
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });


  const fetchInquiryData = async () => {
    try {
      if (Role == 'Admin') {
        const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
          headers: { Authorization: `bearer ${token}` }
        })
        setData(res.data)
        onData(res.data)
      } else {
        const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
          headers: { Authorization: `bearer ${token}` }
        })
        setData(res.data)
        onData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchInquiryData()
  }, [])

  const updateData = async (rowData) => {
    const id = rowData.Id
    try {
      const res = await axios.get(URL + `/api/Master/TasklistById?Id=${id}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setSelectedRow(res.data)
      setEditShow(true)
    } catch (error) {
      console.log(error)
    }
  }

  const showAlert = (rowData) => {
    const id = rowData.TicketNo
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
      // onClose: () => {
      //   // Optional: Perform any action when the timer expires
      //   console.log('Timer expired');
      // }
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
      const res = await axios.get(URL + `/api/Master/Deletetask?TicketNo=${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      // fetchData()
      fetchInquiryData()
    } catch (error) {
      console.log(error)
    }
  }

  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    const ticketNumber = (item.Prefix || "") + (item.TicketNo || "");
    const lowerCaseTicketNumber = ticketNumber.toLowerCase();
    const assignByName = (item.FirstName || item.LastName ? (item.FirstName + ' ' + item.LastName) : (item.ABFName + ' ' + item.ABLName)).toLowerCase();
    const assignToNames = (item.ATFName + ' ' + item.ATLName).toLowerCase();
    const lowerCaseDueDate = moment(item.ToDate).format('DD/MM/YYYY').toLowerCase();
    return (
      lowerCaseTicketNumber.includes(searchTermLowerCase) ||
      (item.ProjectName && item.ProjectName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.CategoryName && item.CategoryName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (assignByName && assignByName.includes(searchTermLowerCase)) ||
      (assignToNames && assignToNames.includes(searchTermLowerCase)) ||
      (item.TaskName && item.TaskName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (lowerCaseDueDate && lowerCaseDueDate.includes(searchTermLowerCase)) ||
      (item.Priority && item.Priority.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.TaskStatus && item.TaskStatus.toLowerCase().includes(searchTermLowerCase)) // Check for null
    );
  });
  const assignByTemplate = (rowData) => {
    const assignByName = rowData.FirstName || rowData.LastName ? (rowData.FirstName + ' ' + rowData.LastName) : (rowData.ABFName + ' ' + rowData.ABLName);
    const backgroundColor = '#205375';

    const avatar = (
      <div
        className="avatar"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '10px',
        }}
      >
        {assignByName.charAt(0).toUpperCase()}
      </div>
    );

    return (
      // <div style={{ display: 'flex', alignItems: 'center' }}>
      //     {avatar}
      //     {assignByName}
      // </div>
      assignByName
    );
  };

  const getPriorityTagColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'red'; // Set your color for high priority
      case 'urgent':
        return 'purple'; // Set your color for urgent priority
      case 'low':
        return 'green'; // Set your color for low priority
      case 'medium':
        return 'blue'; // Set your color for medium priority
      default:
        return 'default'; // Set a default color if priority is not recognized
    }
  };

  const priorityTemplate = (rowData) => {
    const priorityColor = getPriorityTagColor(rowData.Priority);

    return <Tag color={priorityColor}>{rowData.Priority}</Tag>;
  };

  const getStatusColor = (rowData) => {
    switch (rowData) {
      case 'InProgress':
        return 'blue';
      case 'Pending':
        return 'gold';
      case 'Complete':
        return 'green';
      case 'Hold':
        return 'purple';
      case 'Cancel':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusMenu = (rowData) => {
    const statusColor = getStatusColor(rowData);
    return <Tag color={statusColor}>{rowData}</Tag>;
  };

  const assignToTemplate = (rowData) => {
    const assignToNames = rowData.ATFName + ' ' + rowData.ATLName

    return (
      assignToNames
    )
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="action-btn">
        <Tooltip title="Edit" >
        <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button>
        </Tooltip>
        <Tooltip title="Delete">
        <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
        </Tooltip>
      </div>
    );
  };

  const columns = [
    // ... (other columns)
    {
      title: 'Ticket No',
      // dataIndex: 'ProjectName',
      render: (text, record) => record.Prefix + record.TicketNo,
      align: ['center'],
      width: 90
    },
    {
      title: 'Party Name',
      dataIndex: 'PartyName',
      width: 250
    },
    {
      title: 'Project Name',
      dataIndex: 'ProjectName',
      width: 200
    },
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      width: 200,
    },
    {
      title: 'Inquiry Name',
      dataIndex: 'TaskName',
      width: 350,
    },
    {
      title: 'Assign By',
      key: 'assignBy',
      render: assignByTemplate,
      sorter: (a, b) => a.AssignBy.localeCompare(b.AssignBy),
      sortDirections: ['ascend', 'descend'],
      width: 150
    },
    {
      title: 'Assign To',
      key: 'assignTo',
      render: assignToTemplate,
      sorter: (a, b) => a.AssignTo.localeCompare(b.AssignTo),
      sortDirections: ['ascend', 'descend'],
      width: 150
    },
    {
      title: 'Due Date',
      dataIndex: 'ToDate',
      render: (text, record) => record.ToDate ? moment(record.ToDate).format('DD/MM/YYYY') : 'No Date',
      // render: (text, record) => moment(record.ToDate).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.ToDate).unix() - moment(b.ToDate).unix(),
      sortDirections: ['ascend', 'descend'],
      width: 100
    },
    {
      title: 'Priority',
      key: 'priority',
      render: priorityTemplate,
      align: ['center'],
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'TaskStatus',
      align: ['center'],
      render: getStatusMenu,
      width: 120
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
              <th>Ticket No</th>
              <th>Project Name</th>
              <th>Category Name</th>
              <th>Inquiry Name</th>
              <th>Assign By</th>
              <th>Assign To</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData.map((item, index) => {
                const priorityColorClass = getPriorityColor(item.Priority);
                const statusColorClass = getStatusColor(item.TaskStatus);

                return (
                  <tr key={index} className='align_middle'>
                    <td className='data-index'>{item.Prefix + item.TicketNo}</td>
                    <td>{item.ProjectName}</td>
                    <td>{item.CategoryName}</td>
                    <td>{item.TaskName}</td>
                    <td>{assignByTemplate(item)}</td>
                    <td>{assignToTemplate(item)}</td>
                    <td>{moment(item.ToDate).format('DD/MM/YYYY')}</td>
                    <td><span>{priorityColorClass}</span></td>
                    <td><span>{statusColorClass}</span></td>
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
            fetchInquiryData={fetchInquiryData}
          /> : null
      }

    </div>
  )
}

export default InquiryTable