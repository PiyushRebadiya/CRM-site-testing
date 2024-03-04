import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import EmployeeForm from './EmployeeForm'
import moment from 'moment'
import { Table, Space, Dropdown, Menu, Tooltip } from 'antd';
import { Tag } from 'antd';
import Profile from '../../img/profle.jpg'
import { notification } from 'antd';

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
      <Modal.Header closeButton>
        <Modal.Title>Employee Form</Modal.Title>
      </Modal.Header>
      <EmployeeForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}

function EmployeeTable({ insertData, onData, searchinput }) {
  React.useEffect(() => {
    insertData.current = fetchData
  }, [])
  const [data, setData] = useState([])
  const token = localStorage.getItem('CRMtoken')
  const URL = process.env.REACT_APP_API_URL
  // const URLImage = "http://www.mcrm.taxfile.co.in/"
  const CustId = localStorage.getItem('CRMCustId')
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const [editshow, setEditShow] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
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
      const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${CustId}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setData(res.data);
      onData(res.data)
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    return (
      // item.FirstName.toLowerCase().includes(searchTermLowerCase) ||
      // item.LastName.toLowerCase().includes(searchTermLowerCase) ||
      // item.Mobile1?.toLowerCase().includes(searchTermLowerCase) ||
      // item.PAN?.toLowerCase().includes(searchTermLowerCase) ||
      // item.UserName.toLowerCase().includes(searchTermLowerCase) ||
      // (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) ||
      // item.Role.toLowerCase().includes(searchTermLowerCase)
      // --------------------------------------
      (item.FirstName && item.FirstName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.LastName && item.LastName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.Mobile1 && item.Mobile1.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.PAN && item.PAN.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.UserName && item.UserName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.Role && item.Role.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.Email && item.Email.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.AreaName && item.AreaName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.CityName && item.CityName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.StateName && item.StateName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.DOB && item.DOB.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.DOJ && item.DOJ.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.Gender && item.Gender.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) // Check for null
    );
  });

  const showAlert = (rowData) => {
    const id = rowData.Id
    const timerDuration = 2000;
    if (rowData.Role == 'Admin') {
      notification.error({
        message: 'You can not delete the Admin!!!',
        placement: 'bottomRight', // You can adjust the placement
        duration: 2, // Adjust the duration as needed
      });

    } else {
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
    }

  };

  const deleteData = async (id) => {
    try {
      const res = await axios.get(URL + `/api/Master/DeleteEmp?Id= ${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      fetchData();
    } catch (error) {
      // console.log(error)
    }
  }
  const updateData = async (rowData) => {
    const id = rowData.Id
    try {
      const res = await axios.get(URL + `/api/Master/GetEmpListById?Id= ${id}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setSelectedRow(res.data)
      setEditShow(true)
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
      title: 'Image',
      dataIndex: 'ProjectName',
      width: 70,
      render: (text, record) => (
        <>
          {record.Img ? (
            <img
              src={`${URL}/UploadFiles/Emp/${record.Img}`}
              style={{ height: "50px", width: "50px", borderRadius: "30%" }}
              alt="Employee Image"
            />
          ) : (<img
            src={Profile}
            style={{ height: "50px", width: "50px", borderRadius: "30%" }}
            alt="Employee Image"
          />)}
        </>
      ),

    },
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      width: 100
    },
    {
      title: 'Last Name',
      dataIndex: 'LastName',
      width: 100
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      width: 150
    },
    // {
    //   title: 'Area Name',
    //   dataIndex: 'AreaName',
    //   width: 180
    // },
    {
      title: 'City',
      dataIndex: 'CityName',
      width: 100
    },
    {
      title: 'State',
      dataIndex: 'StateName',
      width: 100

    },
    {
      title: 'Dob',
      dataIndex: 'DOB',
      render: (text, record) => record.DOB ? moment(record.DOB).format('DD/MM/YYYY') : 'No Date',
      width: 100

    },
    {
      title: 'Doj',
      dataIndex: 'DOJ',
      render: (text, record) => record.DOJ ? moment(record.DOJ).format('DD/MM/YYYY') : 'No Date',
      width: 100

    },
    {
      title: 'Gender',
      dataIndex: 'Gender',
      render: (text, record) => record.Gender == 'M' ? 'Male' : record.Gender == 'F' ? "Female" : record.Gender == "T" ? "Transgender" : "",
      width: 70,

    },
    {
      title: 'Mobile No.',
      dataIndex: 'Mobile1',
      width: 130,
      render: (text, record) => <span>{`+${record.Mobile1}`}</span>
    },
    {
      title: 'PAN',
      dataIndex: 'PAN',
      width: 100
    },
    {
      title: 'UserName',
      dataIndex: 'UserName',
      width: 100
    },
    {
      title: 'Password',
      dataIndex: 'Password',
      width: 100,
      render: (text, record) => (
        <>{'*'.repeat(record.Password.length)}</>
      ),
    },
    {
      title: 'Designation',
      dataIndex: 'PositionName',
      fixed: 'right',
      width: 140,
    },
    {
      title: 'Status',
      // render: (text, record) => record.IsActive ? "Active" : "Inactive",
      render: statusTemplate,
      fixed: 'right',
      align:'center',
      width: 80,
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      fixed: 'right',
      width: 70,
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
      <div className="table-responsive">
        {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover text-nowrap text-center">
          <thead className="back_table_color">
            <tr className=" back-color info">
              <th>#</th>
              <th>Image</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Area Name</th>
              <th>City</th>
              <th>State</th>
              <th>Dob</th>
              <th>Doj</th>
              <th>Gender</th>
              <th>Mobile No.</th>
              <th>PAN</th>
              <th>UserName</th>
              <th>Password</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className='align_middle'>
                <td className='data-index'>{index + 1}</td>
                <td><img src={URL + `/UploadFiles/Emp/${item.Img}`} style={{ height: "50px", width: "50px", borderRadius: "30%" }} /></td>
                <td>{item.FirstName}</td>
                <td>{item.LastName}</td>
                <td>{item.Email}</td>
                <td>{item.AreaName}</td>
                <td>{item.CityName}</td>
                <td>{item.StateName}</td>
                <td>{moment(item.DOB).format('DD/MM/YYYY')}</td>
                <td>{moment(item.DOJ).format('DD/MM/YYYY')}</td>
                <td>{item.Gender}</td>
                <td>{item.Mobile1}</td>
                <td>{item.PAN}</td>
                <td>{item.UserName}</td>
                <td>{'*'.repeat(item.Password.length)}</td>
                <td>{item.Role}</td>
                <td className='w-10'>
                  <div className='action-btn m-1'>
                    <button type="button" className="btn btn-add action_btn btn-sm mr-1 rounded-2" data-toggle="modal" data-target="#customer1" onClick={() => { updateData(item.Id) }}><i className="fa fa-pencil fs-4" /></button>
                    <button type="button" className="btn btn-danger action_btn btn-sm" data-toggle="modal" data-target="#customer2"><i className="fa fa-trash-o fs-4" onClick={() => { showAlert(item.Id) }} /> </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
          onChange={handleTableChange} scroll={{ x: 1300 }} footer={TotalRecordFooter} />
        {
          selectedRow ?
            <EditData
              show={editshow}
              onHide={() => setEditShow(false)}
              selectedRow={selectedRow}
              fetchData={fetchData}
            /> : null
        }
      </div>
    </div>
  )
}

export default EmployeeTable