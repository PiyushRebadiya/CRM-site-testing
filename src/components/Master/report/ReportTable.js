import React, { useState } from 'react'
import moment from 'moment';
import { Table } from 'antd';

const ReportTable = ({ data }) => {


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
            title: 'CBJ',
            dataIndex: 'CBJ',

        },
        {
            title: 'No.',
            dataIndex: 'TranNo',
        },
        {
            title: 'Date',
            dataIndex: 'TransDate',
            render: (text, record) => moment(record.TransDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Cheque No',
            dataIndex: 'ChequeNo',
            render: (text, record) => record.ChequeNo ? record.ChequeNo : 'No Cheque',
        },
        {
            title: 'Cheque Date',
            dataIndex: 'ChequeDate',
            render: (text, record) => record.ChequeDate ? moment(record.ChequeDate).format('DD/MM/YYYY') : 'No Date',
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
                {/* <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color  info">
                            <th>#</th>
                            <th>Party Name</th>
                            <th>CBJ</th>
                            <th>No</th>
                            <th>Date</th>
                            <th>Cheque No.</th>
                            <th>Cheque Date</th>
                            <th>Amount</th>                     
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.PartyName}</td>
                                        <td>{item.CBJ}</td>
                                        <td>{item.TranNo}</td>
                                        <td>{moment(item.TransDate).format('DD/MM/YYYY')}</td>
                                        <td>{item.ChequeNo ? item.ChequeNo : "No Cheque" }</td>
                                        <td>{item.ChequeDate ? moment(item.ChequeDate).format('DD/MM/YYYY') : "No Date"}</td>
                                        <td>{item.NetAmount}</td>                                       
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

export default ReportTable