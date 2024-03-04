import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import { Table, Tooltip } from 'antd';

const PositionTable = ({ getPositionData, fetchData, onRow, data, searchinput }) => {
  const [selectedRow, setSelectedRow] = useState([]);
  const URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem("CRMtoken")
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });
  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    return (
      // item.PositionName.toLowerCase().includes(searchTermLowerCase) ||
      (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
      // item.DepartmentName.toLowerCase().includes(searchTermLowerCase)
      (item.DepartmentName && item.DepartmentName.toLowerCase().includes(searchTermLowerCase)) // Check for null
    );
  });

  const updateData = async (rowData) => {
    try {
      const res = await axios.get(URL + `/api/Master/PositionById?Id=${rowData.Id}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      // setSelectedRow(res.data)
      onRow(res.data)
      // setEditShow(true)
    } catch (error) {
      console.log(error)
    }
  }
  const showAlert = (rowData) => {
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
        deleteData(rowData.Id)
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
      const res = await axios.get(URL + `/api/Master/DeletPosition?Id=${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      fetchData()
      getPositionData();
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
      title: 'Department Name',
      dataIndex: 'DepartmentName',
      width: 320
    },
    {
      title: 'Designation ',
      dataIndex: 'PositionName',
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
  const totalRecords = filteredData?.length; // Assuming filteredData is the data array
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
      <div className="table-responsive" style={{ height: "226px" }}>
        <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination} onChange={handleTableChange} footer={TotalRecordFooter} />
      </div>
    </div>
  )
}

export default PositionTable