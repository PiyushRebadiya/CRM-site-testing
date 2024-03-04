import React from 'react'
import Contacttable from './Contacttable'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ContactUsMaster = () => {
  const [taxadminnew, setTaxAdminNew] = React.useState(false);
  const [searchinput, setSearchInput] = useState("")
  const [data, setData] = useState([])
  const insertData = React.useRef(null);
  const URL = process.env.REACT_APP_API_URL


  const getContactusData = async () => {
    try {
      const res = await axios.get(URL + '/api/Master/ContactUSList')
      setData(res.data)
    } catch (error) {
      console.log(error, "error")
    }
  }
  useEffect(() => {
    getContactusData()
  }, [])
  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFont('Arial', 'bold');
    doc.setFontSize(13);
    const leftMargin = 15;
    doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
    doc.text('Contact us List', leftMargin, 25);
    const tableData = data.map((item, index) => [
      index + 1,
      item.Name ? item.Name : '-',
      item.Email ? item.Email : '-',
      item.Mobile ? item.Mobile : '-',
      item.AreaName ? item.AreaName : '-',
      item.City ? item.City : '-',
      item.Pincode ? item.Pincode : '-',
      item.Message ? item.Message : '-',
      item.EntryTime ? moment(item.EntryTime).format('DD/MM/YYYY hh:mm') : 'No Date',

    ]);

    doc.autoTable({
      head: [['No', 'Name', 'Email', 'Mobile', 'AreaName', 'City', 'Pincode', 'Message', 'Date']],
      body: tableData,
      startY: 30,
    });

    doc.save('ContactList.pdf');
  };
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'SubCategory.xlsx');
  };
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            p{
                font-size: 25px;
                font-weight:700;
                text-align:center;
            }
          </style>
        </head>
        <body>      
        <hr/>
        <div>
        <b>Total Record :-${data.length}</b>
        </div>
          <h4>Contact List</h4>
          <table>
            <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>AreaName</th>
            <th>City</th>
            <th>Pincode</th>
            <th>Message</th>
            <th>Date</th>
            </tr>
            <tbody>
              ${data.map((item, index) =>
      `
        <tr>
                  <td>${index + 1}</td>
                  <td>${item.Name ? item.Name : '-'}</td>
                  <td>${item.Email ? item.Email : '-'}</td>       
                  <td>${item.Mobile ? item.Mobile : '-'}</td>                   
                  <td>${item.AreaName ? item.AreaName : '-'}</td>                   
                  <td>${item.City ? item.City : '-'}</td>                   
                  <td>${item.Pincode ? item.Pincode : '-'}</td>                   
                  <td>${item.Message ? item.Message : '-'}</td>                   
                  <td>${item.EntryTime ? moment(item.EntryTime).format('DD/MM/YYYY hh:mm') : 'No Date'}</td>                   
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print after the content is loaded in the new tab
    printWindow.print();
  };
  const filteredData = data.filter((item) => {
    const searchTermLowerCase = searchinput.toLowerCase();
    return (
      (item.Name && item.Name.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Email && item.Email.includes(searchTermLowerCase)) ||
      (item.Mobile && item.Mobile.toLowerCase().includes(searchTermLowerCase)) ||
      (item.AreaName && item.AreaName.toLowerCase().includes(searchTermLowerCase)) ||
      (item.City && item.City.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Pincode && item.Pincode.toLowerCase().includes(searchTermLowerCase)) ||
      (item.Message && item.Message.toLowerCase().includes(searchTermLowerCase))
    );
  });
  return (
    <div>
      <div className='content-wrapper'>
        <section className="content-header close-btn-flex">
          <div>
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Contact Us List</h1>
              <small></small>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-lg-12 pinpin">
              <div className="card lobicard" data-sortable="true">
                <div className="card-header">
                  <div className='title-download-section'>
                    <div className="card-title custom_title">
                      <h4 className='report-heading'>Contact Us List</h4>
                    </div>
                    <div className='download-record-section'>
                      <Space wrap>
                        <Tooltip title="Download PDF" >
                          <FaFilePdf className='downloan-icon' onClick={generatePDF} />
                        </Tooltip>
                      </Space>
                      <Space wrap>
                        <Tooltip title="Download Excel" >
                          <RiFileExcel2Line className='downloan-icon' onClick={downloadExcel} />
                        </Tooltip>
                      </Space>
                      <Space wrap>
                        <Tooltip title="Print" >
                          <AiOutlinePrinter className='downloan-icon' onClick={handlePrint} />
                        </Tooltip>
                      </Space>

                    </div>
                  </div>
                </div>
                <div className="btn-group d-flex input-searching-main  pt-3 pl-3 ps-3" role="group">
                  <div className='searching-input'>
                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                  </div>
                </div>
                <div className='p-3' >
                  {/* <TaxAdminTable insertData={insertData} searchinput={searchinput} getTaxadmindata={getTaxadmindata} onData={handleData} /> */}
                  <Contacttable data={filteredData} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactUsMaster