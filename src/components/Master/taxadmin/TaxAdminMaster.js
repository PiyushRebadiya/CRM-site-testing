import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import TaxAdminForm from './TaxAdminForm';
import TaxAdminTable from './TaxAdminTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function TaxAdminNewForm(props) {
    const { fetchData, getTaxadmindata } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <TaxAdminForm getTaxadmindata={getTaxadmindata} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
// function TaxAdminNewForm(props) {
//     const { fetchData, getTaxadmindata, onClose, taxadminnew } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     useEffect(()=>{
//         if(taxadminnew == true)
//         {
//             errorData.current()
//             reset_Data.current()
//         }
//     },[taxadminnew])

//     return (
//         <Drawer
//         {...props}
//         title="Add IFSC"
//         placement="right"
//         onClose={onClose}
//         visible={props.visible}
//         width={1200}
//         >
//             <TaxAdminForm getTaxadmindata={getTaxadmindata} fetchData={fetchData} onHide={props.onHide} errorData={errorData} reset_Data={reset_Data}/>
//         </Drawer>
//     );
// }
const TaxAdminMaster = ({ getTaxadmindata, onHide }) => {
    const [taxadminnew, setTaxAdminNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const insertData = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setTaxAdminNew(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    const handleData = (data) => {
        setData(data)
    }
    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 70, 10);
        doc.setFontSize(13);
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('SubCategory List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.CategoryName ? item.CategoryName : '-',
            item.Heading ? item.Heading : '-',
            item.IsActive ? item.IsActive : 'false',

        ]);

        doc.autoTable({
            head: [['No', 'Category Name', 'Heading', 'Is Active']],
            body: tableData,
            startY: 30,
        });

        doc.save('SubCategoryList.pdf');
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'SubCategory.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Category Name', 'Heading', 'Is Active'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.CategoryName ? item.CategoryName : '-',
                item.Heading ? item.Heading : '-',
                item.IsActive ? item.IsActive : 'false'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "SubCategory.xlsx");
    };
    const handlePrint = () => {
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
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
            <p>${companyName}</p>
            <hr/>
            <div>
            <b>Total Record :-${data.length}</b>
            </div>
              <h4>Sub Category List</h4>
              <table>
                <tr>
                <th>No</th>
                <th>Category</th>
                <th>Heading</th>
                <th>Is Active</th>
                </tr>
                <tbody>
                  ${data.map((item, index) =>
            `
            <tr>
                      <td>${index + 1}</td>
                      <td>${item.CategoryName ? item.CategoryName : '-'}</td>
                      <td>${item.Heading ? item.Heading : '-'}</td>                   
                      <td>${item.IsActive ? item.IsActive : 'false'}</td>                   
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
    return (
        <div className={getTaxadmindata ? "" : 'content-wrapper'}>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-th" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Sub Categeory</h1>
                        <small></small>
                    </div>
                </div>
                {
                    getTaxadmindata ? (<div>
                        <div className='close-btn'>
                            <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>) : null
                }
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Sub-Category List</h4>
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
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setTaxAdminNew(true)}><i className="fa fa-plus" /> Add Sub-Category [F2]</Button>
                                    <TaxAdminNewForm
                                        show={taxadminnew}
                                        onHide={() => setTaxAdminNew(false)}
                                        fetchData={insertData.current}
                                        getTaxadmindata={getTaxadmindata}
                                    />
                                    {/* <TaxAdminNewForm
                                        visible={taxadminnew}
                                        onHide={() => setTaxAdminNew(false)}
                                        taxadminnew={taxadminnew}
                                        fetchData={insertData.current}
                                        getTaxadmindata={getTaxadmindata}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />

                                </div>
                            </div>

                            {/* <div className="btn-group">
                                <button className="btn btn-exp btn-sm" data-toggle="dropdown"><i className="fa fa-bars" /> Export Table Data</button>
                                <ul className="dropdown-menu exp-drop" role="menu">
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'json',escape:'false'});">
                                            <img src="assets/dist/img/json.png" width={24} alt="logo" /> JSON</a>
                                    </li>
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'json',escape:'false',ignoreColumn:'[2,3]'});">
                                            <img src="assets/dist/img/json.png" width={24} alt="logo" /> JSON (ignoreColumn)</a>
                                    </li>
                                    <li><a href="#" onclick="$('#dataTableExample1').tableExport({type:'json',escape:'true'});">
                                        <img src="assets/dist/img/json.png" width={24} alt="logo" /> JSON (with Escape)</a>
                                    </li>
                                    <li className="dropdown-divider" />
                                    <li><a href="#" onclick="$('#dataTableExample1').tableExport({type:'xml',escape:'false'});">
                                        <img src="assets/dist/img/xml.png" width={24} alt="logo" /> XML</a>
                                    </li>
                                    <li><a href="#" onclick="$('#dataTableExample1').tableExport({type:'sql'});">
                                        <img src="assets/dist/img/sql.png" width={24} alt="logo" /> SQL</a>
                                    </li>
                                    <li className="dropdown-divider" />
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'csv',escape:'false'});">
                                            <img src="assets/dist/img/csv.png" width={24} alt="logo" /> CSV</a>
                                    </li>
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'txt',escape:'false'});">
                                            <img src="assets/dist/img/txt.png" width={24} alt="logo" /> TXT</a>
                                    </li>
                                    <li className="dropdown-divider" />
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'excel',escape:'false'});">
                                            <img src="assets/dist/img/xls.png" width={24} alt="logo" /> XLS</a>
                                    </li>
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'doc',escape:'false'});">
                                            <img src="assets/dist/img/word.png" width={24} alt="logo" /> Word</a>
                                    </li>
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'powerpoint',escape:'false'});">
                                            <img src="assets/dist/img/ppt.png" width={24} alt="logo" /> PowerPoint</a>
                                    </li>
                                    <li className="dropdown-divider" />
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'png',escape:'false'});">
                                            <img src="assets/dist/img/png.png" width={24} alt="logo" /> PNG</a>
                                    </li>
                                    <li>
                                        <a href="#" onclick="$('#dataTableExample1').tableExport({type:'pdf',pdfFontSize:'7',escape:'false'});">
                                            <img src="assets/dist/img/pdf.png" width={24} alt="logo" /> PDF</a>
                                    </li>
                                </ul>
                            </div> */}
                            <div className='p-3' >
                                <TaxAdminTable insertData={insertData} searchinput={searchinput} getTaxadmindata={getTaxadmindata} onData={handleData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TaxAdminMaster