import React, { useState } from 'react'
import moment from 'moment';
import { Table } from 'antd';
import { useLocation } from 'react-router-dom';

const ProformaSalesTable = ({ data }) => {
    const location=useLocation()
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const columns = [
        // ... (other columns)
        {
            title: 'Party Name',
            dataIndex: 'PartyName',

        },
        {
            title: 'INV No.',
            render: (text, record) => (
                <div>
                    <span>{location.pathname == '/purchaseregister' ? (record.PurchaseNo): (record.Prefix + record.TranNo)}</span>
                </div>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'TransDate',
            render: (text, record) => moment(record.TransDate).format('DD/MM/YYYY'),
        },
        {
            title: 'DueDate',
            dataIndex: 'DueDate',
            render: (text, record) => moment(record.DueDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',

        },
        {
            title: 'Amount',
            dataIndex: 'NetAmount',
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

export default ProformaSalesTable