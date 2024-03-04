import React from 'react'
import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DocumentForm from './DocumentForm';

function NewData(props) {
    // const { fetchData } = props

    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <DocumentForm  onHide={props.onHide} />
        </Modal>
    );
}

const DocumentMaster = () => {
    const [searchinput, sertSearchInput] = useState("")
    const [documentnew, setDocumentNew] = React.useState(false)
    return (
        <div>
            <div>
                <div className='content-wrapper'>
                    <section className="content-header">
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Document-Upload</h1>
                            <small>Document List</small>
                        </div>
                    </section>
                    <section className="content">
                        <div className="row">
                            <div className="col-lg-12 pinpin">
                                <div className="card lobicard" data-sortable="true">
                                    <div className="card-header">
                                        <div className="card-title custom_title">
                                            <h4>Document List</h4>
                                        </div>
                                    </div>
                                    <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                        <div className="buttonexport" id="buttonlist">
                                            {/* <button className="btn btn-add"> <i className="fa fa-plus" /> Add Customer
                                        </button> */}
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="add-tooltip">Press F2</Tooltip>}
                                            >
                                                <Button className="btn btn-add " onClick={() => setDocumentNew(true)}>
                                                    <i className="fa fa-plus" /> Add Document
                                                </Button>
                                            </OverlayTrigger>
                                            <NewData
                                                show={documentnew}
                                                onHide={() => setDocumentNew(false)}
                                            // fetchData={insertData.current}
                                            />
                                        </div>
                                        {/* <div className='searching-input'>
                                            <input type="text" className='form-control' placeholder='Search Company ' onChange={(event) => { sertSearchInput(event.target.value) }} />

                                        </div> */}
                                    </div>
                                    <div className='p-3'>
                                        {/* <CompanyTable insertData={insertData} searchinput={searchinput} /> */}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default DocumentMaster