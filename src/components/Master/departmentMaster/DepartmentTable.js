import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import DepartmentForm from './DepartmentForm';
import { Table, Tooltip } from 'antd';

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
      <DepartmentForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}


const DepartmentTable = ({ getDepartmentData, fetchData, onRow, data, searchinput, getProjectData }) => {
  // const [data, setData] = useState([])
  const [selectedRow, setSelectedRow] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });
  const URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem("CRMtoken")

  // const fetchData = async () => {
  //   try {
  //     const res = await axios.get(URL + '/api/Master/DepartmentList', {
  //       headers: { Authorization: `bearer ${token}` }
  //     })
  //     setData(res.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   fetchData()
  // }, [])
  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    return (
      // item.DepartmentName.toLowerCase().includes(searchTermLowerCase)
      (item.DepartmentName && item.DepartmentName.toLowerCase().includes(searchTermLowerCase)) // Check for null
    );
  });
  const updateData = async (rowData) => {
    const id = rowData.Id;
    try {
      const res = await axios.get(URL + `/api/Master/DepartmentLsitById?Id=${id}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      // setSelectedRow(res.data)
      onRow(res.data)
      // console.log(res.data, "dre")
      // setEditShow(true)
    } catch (error) {
      console.log(error)
    }
  }
  const showAlert = (rowData) => {
    const id = rowData.Id;
    const timerDuration = 2000;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
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
      const res = await axios.get(URL + `/api/Master/DeletDepartment?Id=${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      fetchData();
      if (getProjectData) {
        getProjectData()
      }
      getDepartmentData();
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(data.length, "data");

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
  const totalRecords = filteredData?.length;
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

  const columns = [
    // ... (other columns)
    {
      title: 'Department Name',
      dataIndex: 'DepartmentName',

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

  return (
    <div>
      <div className="table-responsive" style={{ height: "182px" }}>
        <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination} onChange={handleTableChange} footer={TotalRecordFooter} />
      </div>
    </div>
  )
}

export default DepartmentTable