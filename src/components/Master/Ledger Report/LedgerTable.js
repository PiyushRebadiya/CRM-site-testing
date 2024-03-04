import React, { useState } from 'react'
import moment from 'moment'
import { Tag } from 'antd';
import { Table } from 'antd';

const LedgerTable = ({ data }) => {

  // Pagination
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter']
    },
  });

  // Column Define
  const columns = [
    // ... (other columns)
    // {
    //   title: 'Party Name',
    //   dataIndex: 'PartyName',
    // },
    {
      title: 'Trans No.',
      dataIndex: 'TranNo',
      render: (text, record) => record.Prefix + record.TranNo,
    },
    {
      title: 'Trans Type',
      dataIndex: 'TransMode',
    },
    {
      title: 'Trans Date',
      dataIndex: 'FromDate',
      render: (text, record) => moment(record.TransDate).format('DD/MM/YYYY'),
    },
    // {
    //   title: 'End Date',
    //   dataIndex: 'ToDate',
    //   render: (text, record) => moment(record.DueDate).format('DD/MM/YYYY'),
    // },
    {
      title: 'Remark',
      dataIndex: 'Remark',
    },
    {
      title: 'Debit ',
      dataIndex: 'PaymentAmt',
    },
    {
      title: 'Credit ',
      dataIndex: 'ReceiptAmt',
    },
    {
      title: 'Balance',
      dataIndex: 'Balance',
      render: (text, record) => {
        const crdrValue = record.CRDR !== null ? record.CRDR.toUpperCase() : '';

        let crdrColor = 'inherit';

        if (crdrValue === 'CR') {
          crdrColor = 'green';
        } else if (crdrValue === 'DR') {
          crdrColor = 'red';
        }

        return (
          <span>
            {Math.abs(record.Balance)}
            <span style={{ color: crdrColor }}>{crdrValue ? ` ${crdrValue}` : ''}</span>
          </span>
        );
      },
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

  // Total records
  const totalRecords = data.length; // Assuming filteredData is the data array
  const TotalRecordFooter = () => (
    <div>
      <h5><b>Total Records: </b>{totalRecords}</h5>
    </div>
  );

  return (
    <div>
      <div className="table-responsive ">
        <Table columns={columns} size='small' bordered dataSource={data} pagination={tableParams.pagination}
          onChange={handleTableChange} footer={TotalRecordFooter} />
      </div>
    </div>
  )
}

export default LedgerTable