import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import AutoTaskForm from './AutoTaskForm';
import "../../style/Style.css"
import Swal from 'sweetalert2';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';
import { Table } from 'antd';

function EditData(props) {
  const { selectedrow, fetchData } = props
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <AutoTaskForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}

function AutoTaskTable({ insertData, searchinput, onData, getAutoTaskData }) {
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
  const companyId = localStorage.getItem("CRMCompanyId")

  const URL = process.env.REACT_APP_API_URL
  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    return (
      (item.ProjectName && item.ProjectName.toLowerCase().includes(searchTermLowerCase)) ||
      (item.CategoryName && item.CategoryName.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Heading && item.Heading.toLowerCase().includes(searchTermLowerCase)) ||
      (item.TaskName && item.TaskName.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Date && item.Date.toLowerCase().includes(searchTermLowerCase)) ||
      (item.TimePeriod && item.TimePeriod.toLowerCase().includes(searchTermLowerCase))
    );
  });
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  }
  const fetchData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/AutoTaskList?CompanyId=${companyId}&Type=Auto`, {
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
    try {
      const res = await axios.get(URL + `/api/Master/AutoTaskListById?Id=${id}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setSelectedRow(res.data)
      setEditShow(true)
    } catch (error) {
      console.log(error)
    }
  }
  const showAlert = (rowData) => {
    const id = rowData.AutoReference;
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
      //   // console.log('Timer expired');
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
      const res = await axios.get(URL + `/api/Master/AutoTaskDelete?AutoReference=${id}`, {
        headers: { Authorization: `bearer ${token}` },
      })
      fetchData()
      getAutoTaskData()
    } catch (error) {
      console.log(error)
    }
  }

  // Sorting function
  const sortData = (column) => {
    let sortedData = [...filteredData];
    if (column === sortColumn) {
      // If clicking the same column, toggle the sorting order
      sortedData.reverse();
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different column, sort in ascending order by default
      sortedData.sort((a, b) => {
        return a[column].localeCompare(b[column]);
      });
      setSortOrder('asc');
      setSortColumn(column);
    }
    setData(sortedData);
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="action-btn ">
        <Tooltip title="Edit">
          <button type="button" className="btn btn-add action_btn btn-sm rounded-2 mr-3" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button>
        </Tooltip>
        <Tooltip title="Delete">
          <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
        </Tooltip>
      </div>
    );
  };

  const getStatusColor = (status) => {
    // Customize the color based on the status
    switch (status) {
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

const statusTemplate = (rowData) => {
  // console.log(rowData, "Ankit");
  const statusColor = getStatusColor(rowData);
  // console.log(statusColor, "statusColor")

  return <Tag color={statusColor}>{rowData}</Tag>;
};

  const columns = [
    // ... (other columns)
    {
      title: 'Project Name',
      dataIndex: 'ProjectName',
      width: 190
    },
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      width: 190
    },
    {
      title: 'Sub-Category Name',
      dataIndex: 'Heading',
      width: 190
    },
    {
      title: 'Task Name',
      dataIndex: 'TaskName',
      width: 400
    },
    {
      title: 'Start Date',
      render: (text, record) => moment(record.Date).format('DD/MM/YYYY'),
      width: 70
    },
    {
      title: 'Time Period',
      dataIndex: 'TimePeriod',
      width: 80
    },
    {
      title: 'Status',
      dataIndex: 'TaskStatus',
      key: 'status',
      fixed: 'right',
      width: 120,
      align: ['center'],
      render: statusTemplate,

  },
    {
      title: 'Action',
      fixed: 'right',
      align: 'center',
      render: actionTemplate,
      width: 80
    }
    // ... (other columns)
  ];

  const TotalRecordFooter = () => (
    <div>
      <h5><b>Total Records: </b>{filteredData.length}</h5>
    </div>
  );
  return (
    <div>
      <div className="table-responsive ">
        {/* <table id="dataTableExample1" className="table table-bordered table-striped table-    ">
            <thead className="back_table_color">
                <tr className=" back-color  info">
                    <th>#</th>
                    <th>Project Name</th>
                    <th>Category Name</th>
                    <th>Sub-Category Name</th>
                    <th>Start Date</th>
                    <th>Time Period</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item, index) => {
                        const date_ = moment(item.Date).format('DD/MM/YYYY');
                        return (
                            <tr key={index} className='align_middle'>
                                <td className='data-index'>{index + 1}</td>
                                <td>{item.ProjectName}</td>
                                <td>{item.CategoryName}</td>
                                <td>{item.Heading}</td>
                                <td>{date_}</td>
                                <td>{item.TimePeriod}</td>
                                <td className='w-10'>
                                    <div className='action-btn'>
                                        <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.Id) }}><i className="fa fa-pencil fs-4" /></button>
                                        <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.AutoReference) }}><i className="fa fa-trash-o fs-4" /> </button>
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
          /> : null
      }

    </div>
  )
}

export default AutoTaskTable