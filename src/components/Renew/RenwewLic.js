import React,{useState} from 'react'
import RenewTable from './RenewTable'
import { Button, Modal } from 'react-bootstrap';


const RenwewLic = () => {
    const [searchinput, setSearchInput] = useState("")

  return (
    <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    {/* <i className="fa fa-users" /> */}
                    <i class="fa fa-university" aria-hidden="true"></i>
                </div>
                <div className="header-title">
                    <h1>CRM License</h1>
                    {/* <small>Bank List</small> */}
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>License List</h4>
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
                            <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    {/* <Button className="btn btn-add rounded-2"
                                    //  onClick={() => setBankNew(true)}
                                     >
                                        <i className="fa fa-plus" /> Add Bank [F2]
                                    </Button> */}
                                  
                                    {/* <BankNewForm
                                        show={banknew}
                                        onHide={() => setBankNew(false)}
                                        fetchData={insertData.current}
                                    // username={username}
                                    /> */}
                                    {/* <BankNewForm
                                        visible={banknew}
                                        onHide={() => { setBankNew(false) }}
                                        banknew={banknew}
                                        fetchData={insertData.current}
                                    // username={username}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }}/>

                                </div>
                            </div>
                            <div className='p-3' >
                                <RenewTable
                                //  insertData={insertData}
                                  searchinput={searchinput} 
                                //   onData={handleData}
                                   />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
  )
}

export default RenwewLic
