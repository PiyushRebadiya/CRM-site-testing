import React, { useEffect } from "react";
import axios from "axios";
import { Table, Tag, Dropdown, Menu, Tooltip } from "antd";
import { useState } from "react";
import moment from "moment";

const PaymentTable = ({ data, searchinput }) => {
  //   const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ["bottomCenter"],
    },
  });
  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    const entryDate = moment(item.EntryTime).format('DD/MM/YYYY').toLowerCase();
    return (
      (item.Name && item.Name.toLowerCase().includes(searchTermLowerCase)) ||
      (item.CustId && item.CustId.toLowerCase().includes(searchTermLowerCase)) ||
      (item.CustId && item.CustId.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Mobile && item.Mobile.toString().toLowerCase().includes(searchTermLowerCase)) ||
      (item.ServerName && item.ServerName.toString().toLowerCase().includes(searchTermLowerCase)) ||
      (entryDate && entryDate.includes(searchTermLowerCase)) ||
      (item.Packages && item.Packages.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Price && item.Price.toLowerCase().includes(searchTermLowerCase))
    );
  });
  //   const fetchPaymentList = async () => {
  //     try {
  //       const res = await axios.get(URL + `/api/Master/PaymentList`);
  //       console.log(res, "paymentList")
  //     //   setData(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchPaymentList()
  //   }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
    },
    {
      title: "Customer ID",
      dataIndex: "CustId",
    },
    {
      title: "Mobile No",
      dataIndex: "Mobile",
    },
    {
      title: "Server Name",
      dataIndex: "ServerName",
    },
    {
      title: "Entry Time",
      dataIndex: "EntryTime",
      render: (text) => <span>{moment(text).format("DD/MM/YYYY")}</span>
    },
    {
      title: "Pakages",
      dataIndex: "Packages",
    },
    {
      title: "Payment",
      dataIndex: "Price",
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
  const TotalRecordFooter = () => (
    <div>
      <h5>
        <b>Total Records: </b>
        {filteredData?.length}
      </h5>
    </div>
  );
  return (
    <div>
      <Table
        columns={columns}
        size="small"
        bordered
        dataSource={filteredData}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        footer={TotalRecordFooter}
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default PaymentTable;
