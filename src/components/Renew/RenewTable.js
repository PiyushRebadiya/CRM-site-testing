import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Dropdown, Menu, Tooltip } from "antd";
import moment from "moment";
import axios from "axios";
import RenewForm from "./RenewForm";
import Modal from 'react-bootstrap/Modal'

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
          <RenewForm rowData={selectedrow}
           fetchData={fetchData}
            onHide={props.onHide} 
            />
      </Modal>
  );
}


const RenewTable = ({searchinput}) => {
  const [data, setData] = useState([]);
  const [selectedrow, setSelectedRow] = useState([])
  const [editshow, setEditShow] = React.useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        position: ['bottomCenter']
    },
});
  const token = localStorage.getItem("CRMtoken");
  const URL = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/UsermstList`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setData(res.data);
    } catch (error) {}
  };


  useEffect(() => {
    fetchData();
  }, []);

  const updateData = async(rowData)=>{
    try {
      const res = await axios.get(URL + `/api/Master/UsermstLsitById?Id=${rowData.Id}`,{
        headers:{Authorization:`bearer ${token}`}
      })
      setSelectedRow(res.data)
      setEditShow(true)
    } catch (error) {
      
    }
  }
  const actionTemplate = (rowData) => {
    return (
        <div className="action-btn">
              <Tooltip title="Edit" >
            <button type="button" className="btn btn-add action_btn btn-sm rounded-2" 
            onClick={() => { updateData(rowData) }}
            ><i className="fa fa-pencil fs-4" /></button>
              </Tooltip>
            {/* <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updatedata(rowData) }}><i className="fa fa-pencil fs-4" /></button> */}

            {/* <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o" /> </button> */}
        </div>
    );
};

const filteredData = data.filter((item) => {
  const searchTermLowerCase = searchinput.toLowerCase();
  return (
    // item.FirstName.toLowerCase().includes(searchTermLowerCase) ||
    // item.LastName.toLowerCase().includes(searchTermLowerCase) ||
    // item.Mobile1?.toLowerCase().includes(searchTermLowerCase) ||
    // item.PAN?.toLowerCase().includes(searchTermLowerCase) ||
    // item.UserName.toLowerCase().includes(searchTermLowerCase) ||
    // (item.PositionName && item.PositionName.toLowerCase().includes(searchTermLowerCase)) ||
    // item.Role.toLowerCase().includes(searchTermLowerCase)
    // --------------------------------------
    (item.FirstName && item.FirstName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
    (item.LastName && item.LastName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
    (item.CustId && item.CustId.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
    (item.Mobile && item.Mobile.toLowerCase().includes(searchTermLowerCase)) 
 
)});
  const columns = [
    {
      title: "User",
      render: (text,record)=>(
        <span>{record.FirstName+' '+ record.LastName}</span>
      ),
    },
    {
      title: "Customer ID",
     dataIndex:'CustId',
    },
    {
      title: "Mobile No.",
      dataIndex: "Mobile",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "LicenseDate",
      // dataIndex: "LicenseDate",
      render: (text, record) =>  record.LicenseDate ? (moment(record.LicenseDate).format('DD/MM/YYYY')):"No Date",
    },
    {
      title: 'Action',
      fixed: 'right',
      align: 'center',
      render: actionTemplate,
      width: 120
  }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
        pagination,
        filters,
        ...sorter,
    });
}
const totalRecords = data.length;
const TotalRecordFooter = () => (
  <div>
      <h5><b>Total Records: </b>{totalRecords}</h5>
  </div>
);
  return (
    <div>
      <Table columns={columns} dataSource={data} size="small" bordered pagination={tableParams.pagination}
                        onChange={handleTableChange} scroll={{ x: 1300 }}   footer={TotalRecordFooter} />
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
  );
};

export default RenewTable;
