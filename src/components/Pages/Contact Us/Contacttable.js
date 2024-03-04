import React from 'react'
import axios from 'axios'
import { Table, Tag, Dropdown, Menu, Tooltip } from 'antd';
import { useState } from 'react';
import moment from 'moment';

const Contacttable = ({ data }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'Name',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
    },
    {
      title: 'Mobile No',
      dataIndex: 'Mobile',
    },
    {
      title: 'AreaName',
      dataIndex: 'AreaName',
    },
    {
      title: 'City',
      dataIndex: 'City',
    },
    {
      title: 'Pincode',
      dataIndex: 'Pincode',
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      width: 300,
      render: (text, record) => {
        // console.log('text', text)
        // console.log('record', record)
        return <td style={{overflowWrap: 'anywhere'}}>{text}</td>
      }
    },
    {
      title: 'Date',
      dataIndex: 'Message',
      render: (text, record) => record.EntryTime ? moment(record.EntryTime).format('DD/MM/YYYY hh:mm') : 'No Date'
    }
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  }
  const TotalRecordFooter = () => (
    <div>
      <h5><b>Total Records: </b>{data.length}</h5>
    </div>
  );
  return (
    <div>
      <Table  columns={columns} size='small' bordered dataSource={data} pagination={tableParams.pagination} onChange={handleTableChange} footer={TotalRecordFooter} scroll={{ x: 1300 }} />
    </div>
  )
}

export default Contacttable