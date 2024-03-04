import React, { useState } from 'react'
import moment from 'moment'
import { Tag } from 'antd';
import { Table } from 'antd';

const TaskReportAssignByMeTable = ({ data }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });


  const assignByTemplate = (rowData) => {
    const assignByName = rowData.FirstName || rowData.LastName ? (rowData.FirstName + ' ' + rowData.LastName) : (rowData.ABFName + ' ' + rowData.ABLName);

    return (
      assignByName
    );
  };

  const assignToTemplate = (rowData) => {
    const assignToNames = rowData.ATFName + ' ' + rowData.ATLName

    return (
      assignToNames
    )
  };

  const getStatusColor = (description) => {
    switch (description) {
      case 'Complete':
        return 'green';
      case 'InProgress':
        return 'blue';
      case 'Pending':
        return 'gold';
      case 'Hold':
        return 'purple';
      case 'Cancel':
        return 'red';
      default:
        return 'default';
    }
  };

  const statusTemplate = (rowData) => {
    // console.log(rowData, "Ankit123");
    const statusColor = getStatusColor(rowData.TaskStatus);

    return <Tag color={statusColor}>{rowData.TaskStatus}</Tag>;
  };

  const columns = [
    // ... (other columns)
    {
      title: 'Party Name',
      dataIndex: 'PartyName',
    },
    {
      title: 'Project Name',
      dataIndex: 'ProjectName',
    },
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
    },
    {
      title: 'Task Name',
      dataIndex: 'TaskName',
    },
    {
      title: 'Start Date',
      dataIndex: 'FromDate',
      render: (text, record) => moment(record.FromDate).format('DD/MM/YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'ToDate',
      render: (text, record) => moment(record.ToDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Assign By',
      render: assignByTemplate,
    },
    {
      title: 'Assign To',
      render: assignToTemplate,
    },
    {
      title: 'Task Status',
      render: statusTemplate,
    },
    // ... (other columns)
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  }
  const totalRecords = data.length; // Assuming filteredData is the data array


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
              <th>Party Name</th>
              <th>Project Name</th>
              <th>From Date</th>
              <th>Task Name</th>
              <th>Task Status</th>
              <th>Category Name.</th>
              <th>AssignBy</th>
              <th>AssignTo</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item, index) => {
                const statusColor = getStatusColor(item.Description);
                return (
                  <tr key={index}>
                    <td className='data-index'>{index + 1}</td>
                    <td>{item.PartyName}</td>
                    <td>{item.ProjectName}</td>
                    <td>{moment(item.FromDate).format('DD/MM/YYYY')}</td>
                    <td>{item.TaskName}</td>
                    <td><span>{statusColor}</span></td>
                    <td>{item.CategoryName}</td>
                    <td>{item.ABFName}</td>
                    <td>{item.ATFName}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table> */}
        <Table columns={columns} size='small' bordered dataSource={data} pagination={tableParams.pagination}
          onChange={handleTableChange} footer={TotalRecordFooter} />
      </div>
    </div>
  )
}

export default TaskReportAssignByMeTable