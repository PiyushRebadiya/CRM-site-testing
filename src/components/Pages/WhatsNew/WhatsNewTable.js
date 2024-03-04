import React from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import { Tag } from 'antd';
const WhatsNewTable = () => {
    const [watsNewData, setWhatsNewData] = useState([])
    const URL = process.env.REACT_APP_API_URL
    const getListVersionUpdate = async () => {
        try {
            const response = await axios.get(URL + '/api/MASTER/WhatsNewList?Module=CRM')
            setWhatsNewData(response.data)
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getListVersionUpdate()
    }, [])
    return (
        <div>
            <div>
                <Accordion>
                    {[...new Set(watsNewData?.map(display => display.Release))].map((release, i) => {

                        const version = watsNewData?.find(display => display.Release === release);
                        const versionFillter = watsNewData?.filter((display) => display.Release == version.Release)
                        return (
                            <Accordion.Item eventKey={i} key={i}>
                                <Accordion.Header>{version.Release}</Accordion.Header>
                                <Accordion.Body>
                                    {versionFillter.map((item, index) => (
                                        <div key={index} className="description-item">
                                            <Tag>{moment(item.EntryDate).format("DD/MM/YYYY")}</Tag>
                                            <i className="bi bi-check-circle-fill mr-2" style={{ color: "#008374" }} />
                                            <span>{item.Description}</span>
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    )
}

export default WhatsNewTable