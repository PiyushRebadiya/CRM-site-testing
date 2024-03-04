import React, { useState, useEffect } from 'react';
import { Button, Drawer } from 'antd';
import CampaignTable from './CampaignTable';
import CamoaignForm from './CamoaignForm';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';

function CampaginNewform(props) {
    const [showForm, setShowForm] = useState(false); // New state variable to manage the form visibility

    const { fetchData, fetchDetailsData, getProjectData, onHide, campaginData, visible } = props;
    const errorData = React.useRef(null);
    const reset_Data = React.useRef(null);
    useEffect(() => {
        if (campaginData == true) {
            errorData.current()
            reset_Data.current()
        }
    }, [campaginData])
    return (
        <Drawer
            {...props}
            // title="Add Campaign"
            placement="right"
            onClose={onHide}
            visible={props.visible}
            width="70vw"
            maskClosable={false}
        >
            {visible && (
                <CamoaignForm
                    onHide={onHide}
                    fetchData={fetchData}
                    getProjectData={getProjectData}
                    fetchDetailsData={fetchDetailsData}
                // ... (other props you need to pass)
                />
            )}
        </Drawer>

    );
}
const CampaignMaster = ({ getProjectData, onHide }) => {

    const [showDrawer, setShowDrawer] = useState(false);
    const [data, setData] = useState([])
    const [searchinput, setSearchInput] = useState("")
    const [showForm, setShowForm] = useState(false);
    const insertData = React.useRef(null);
    const insertDetails = React.useRef(null);


    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setShowForm(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empt

    const handleData = (data) => {
        setData(data)
    }
    return (
        <div className='content-wrapper'>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                      <i class="fa fa-bullhorn" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Campaign Master</h1>
                        {/* <small>Party List</small> */}
                    </div>
                </div>
            </section>
            <section className="content" >
                <div className="row" >
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Campaign List</h4>
                                    </div>

                                    <div className='d-flex'>
                                        <div className="upload-btn-wrapper">
                                            {/* <button className="btn">Upload a file</button> */}
                                            {/* <LuImport className='import-icon' />
                                        <input type="file" onChange={(e) => {
                                            const file = e.target.files[0];
                                            readExcel(file);
                                        }} /> */}
                                        </div>
                                        <div className='download-record-section'>
                                            {/* <FaFilePdf className='downloan-icon' onClick={generatePDF} />
                                        <RiFileExcel2Line className='downloan-icon' onClick={downloadExcel} />
                                        <AiOutlinePrinter className='downloan-icon' onClick={handlePrint} /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setShowForm(true)}>
                                        <i className="fa fa-plus" style={{ marginRight: "3px" }} /> Add Campaign [F2]
                                    </Button>
                                </div>
                                <CampaginNewform
                                    visible={showForm}
                                    onHide={() => setShowForm(false)}
                                    showForm={showForm}
                                    fetchData={insertData.current}
                                    getProjectData={getProjectData}
                                    fetchDetailsData={insertDetails.current}
                                />

                                {/* <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                </div> */}
                            </div>
                            <div className='p-3' >
                                <CampaignTable insertData={insertData} insertDetails={insertDetails} searchinput={searchinput} onData={handleData} getProjectData={getProjectData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}


export default CampaignMaster;
