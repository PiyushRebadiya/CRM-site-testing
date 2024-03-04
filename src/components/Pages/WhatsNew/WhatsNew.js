import React from 'react'
import WhatsNewTable from './WhatsNewTable'
const WhatsNew = () => {

    return (
        <div className='content-wrapper'>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        <i className="fa fa-lightbulb-o" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>What's New</h1>
                        {/* <small>IFSC List</small> */}
                    </div>
                </div>
            </section>
            <section className="content padding-main ">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>What's New List</h4>
                                    </div>
                                </div>
                            </div>
                            <WhatsNewTable />
                        </div>
                    </div>
                </div>
            </section>
        </div>
        // <div>
        //     <Accordion>
        //         {[...new Set(watsNewData?.map(display => display.Release))].map((release, i) => {

        //             const version = watsNewData?.find(display => display.Release === release);
        //             const versionFillter = watsNewData?.filter((display) => display.Release == version.Release)
        //             return (
        //                 <Accordion.Item eventKey={i} key={i}>
        //                     <Accordion.Header>{version.Release}</Accordion.Header>
        //                     <Accordion.Body>
        //                         {versionFillter.map((item, index) => (
        //                             <div key={index} className="description-item">
        //                                 <Tag>{moment(item.EntryDate).format("DD/MM/YYYY")}</Tag>
        //                                 <i className="bi bi-check-circle-fill mr-2" style={{ color: "#008374" }} />
        //                                 <span>{item.Description}</span>
        //                             </div>
        //                         ))}
        //                     </Accordion.Body>
        //                 </Accordion.Item>
        //             );
        //         })}
        //     </Accordion>
        // </div>
    )
}

export default WhatsNew