import React, { useState } from 'react'
import moment from 'moment'
import { Tag } from 'antd';
import { Table } from 'antd';

const InquiryReportTable = ({ data }) => {
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
          title: 'Inquiry Name',
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
          title: 'Inquiry Status',
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
            <Table columns={columns} size='small' bordered dataSource={data} pagination={tableParams.pagination}
              onChange={handleTableChange} footer={TotalRecordFooter} />
          </div>
        </div>
      )
    }

export default InquiryReportTable