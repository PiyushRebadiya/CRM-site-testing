import React, { useState } from 'react'
import moment from 'moment';
import { Table } from 'antd';

const OutStandingTable = ({ data }) => {
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
                    {`${Math.abs(record.Balance)?.toFixed(2)} `}
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
                {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color  info">
                            <th>#</th>
                            <th>Party Name</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.PartyName}</td>
                                        <td>
                                            {`${item.Balance} `}
                                            <span style={{ color: item.Status === 'CR' ? 'green' : 'red' }}>{item.Status}</span>
                                        </td>
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

export default OutStandingTable