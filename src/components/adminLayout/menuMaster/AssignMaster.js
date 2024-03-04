import React from 'react'
import Menulist from './Menulist'
import Menuform from './Menuform';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

function AddMenu(props) {
    const { fetchData } = props;
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Menuform fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
const AssignMaster = () => {
    const [menuform, setMenuform] = React.useState(false)
    const insertData = React.useRef(null);
    return (
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    <i className="fa fa-users" />
                </div>
                <div className="header-title">
                    <h1>Menu-Master</h1>
                    <small>Work List</small>
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className="card-title custom_title">
                                    <h4>Menu List</h4>
                                </div>
                            </div>
                            <div className="btn-group d-flex input-searching-main  pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="add-tooltip">Press F2</Tooltip>}
                                    >
                                        <Button className="btn btn-add" onClick={() => setMenuform(true)}><i className="fa fa-plus" /> Add Menu</Button>
                                    </OverlayTrigger>
                                    <AddMenu
                                        show={menuform}
                                        onHide={() => setMenuform(false)}
                                        fetchData={insertData.current}
                                    />
                                </div>
                            </div>
                            <div className='p-3'>
                            <Menulist insertData={insertData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AssignMaster
