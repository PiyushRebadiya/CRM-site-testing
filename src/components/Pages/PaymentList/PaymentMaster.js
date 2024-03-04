import React from 'react'
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
import PaymentTable from './PaymentTable';

const PaymentMaster = () => {
    const [taxadminnew, setTaxAdminNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const insertData = React.useRef(null);
    const URL = process.env.REACT_APP_API_URL

    const fetchPaymentList = async () => {
        try {
          const res = await axios.get(URL + `/api/Master/PaymentList`);
          const comparePaymentDesc = (a, b) => {
            return b.PaymentId - a.PaymentId;
          };
          const sortedData = res.data.sort(comparePaymentDesc);
          setData(sortedData);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        fetchPaymentList()
      }, [])

  return (
        <div>
      <div className='content-wrapper'>
        <section className="content-header close-btn-flex">
          <div>
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Payment List</h1>
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
                      <h4 className='report-heading'>Payment List</h4>
                    </div>
                    {/* <div className='download-record-section'>
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

                    </div> */}
                  </div>
                </div>
                <div className="btn-group d-flex input-searching-main  pt-3 pl-3 ps-3" role="group">
                  <div className='searching-input'>
                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                  </div>
                </div>
                <div className='p-3' >
                  {/* <TaxAdminTable insertData={insertData} searchinput={searchinput} getTaxadmindata={getTaxadmindata} onData={handleData} /> */}
                  <PaymentTable data={data} searchinput={searchinput} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PaymentMaster
