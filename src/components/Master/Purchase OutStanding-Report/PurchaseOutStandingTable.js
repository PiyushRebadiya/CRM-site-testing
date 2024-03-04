import React,{useState} from 'react'
import moment from 'moment';
import { Table } from 'antd';

const PurchaseOutStandingTable = ({ data }) => {
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
            title: 'Balance',
            dataIndex: 'Balance',
            render: (text, record) => (
                <span>
                    {`${Math.abs(record.Balance)} `}
                    <span style={{ color: record.Status === 'CR' ? 'green' : 'red' }}>{record.Status}</span>
                </span>
            ),
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

export default PurchaseOutStandingTable