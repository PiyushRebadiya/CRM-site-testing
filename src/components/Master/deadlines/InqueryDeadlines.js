import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Tag, List } from 'antd';
import Accordion from 'react-bootstrap/Accordion';
import { Modal } from 'react-bootstrap';
import InqiryForm from '../Inquiry Master/InquiryForm'

function Inquiryform(props) {
    const { selectedrow, getInqueryList } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <InqiryForm onHide={props.onHide} rowData={selectedrow} fetchData={getInqueryList} />
        </Modal>
    );
}

const InqueryDeadlines = () => {
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const userid = localStorage.getItem('CRMUserId')
    const token = localStorage.getItem('CRMtoken')
    const [InquiryData, setInquryData] = useState([])
    const [inquirynew, setInquiryNew] = useState(false);
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);

    const getInqueryList = async () => {
        try {
            if (Role == 'Admin') {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                // console.log(res, "response")
                setInquryData(res.data)
            }
            else {
                // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
                const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                setInquryData(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getInqueryList()
    }, [])

    const updateData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/TasklistById?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
            // console.log(res.data, 'edit')
        } catch (error) {
            console.log(error)
        }
    }
    //Today Filter
    const DueData = InquiryData.filter((item) => item.TaskStatus != 'Complete')
    // console.log(DueData, 'dueData')
    const Today = new Date()
    const DueToday = moment(Today).format('DD/MM/YYYY');
    // console.log(DueToday, "Today")
    // console.log(InquiryData, 'ToMatch')
    const TodayData = InquiryData.filter((item) => moment(item.ToDate).format('DD/MM/YYYY') == DueToday)


    const today = moment().startOf('day');
    const startOfWeek = today.clone().startOf('week');
    const endOfWeek = today.clone().endOf('week');

    const ThisWeekData = InquiryData.filter((item) => {
        const itemDate = moment(item.ToDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        //     return (
        //         itemDate.isValid() && 
        //         itemDate.isBetween(startOfWeek, endOfWeek, null, '[]') // Using [) to include both startOfWeek and endOfWeek
        //     );
        // });
        return (
            itemDate.isValid() &&
            itemDate.isBetween(startOfWeek, endOfWeek, null, '[]') && // Within this week
            !itemDate.isSameOrBefore(today, 'day') // Not today or overdue
        );
    });

    const startOfNextWeek = today.clone().startOf('week').add(1, 'weeks');
    const endOfNextWeek = today.clone().endOf('week').add(1, 'weeks');

    const NextWeekData = InquiryData.filter((item) => {
        const itemDate = moment(item.ToDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        return (
            itemDate.isValid() &&
            itemDate.isBetween(startOfNextWeek, endOfNextWeek, null, '[]') // Using [) to include both startOfNextWeek and endOfNextWeek
        );
    });



    const OverdueData = InquiryData.filter((item) => {
        const itemDate = moment(item.ToDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        return itemDate.isValid() && itemDate.isBefore(today, 'day');
    });

    const priorityTemplate = (Priority) => {
        let priorityStyle = {};
        switch (Priority) {
            case 'High':
                priorityStyle = 'red';
                break;
            case 'Urgent':
                priorityStyle = 'purple';
                break;
            case 'Low':
                priorityStyle = 'green';
                break;
            default:
                priorityStyle = '';
        }
        return <Tag color={priorityStyle}>{Priority}</Tag>;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete':
                return <Tag color='green'>Complete</Tag>;
            case 'InProgress':
                return <Tag color='blue'>Running</Tag>;
            case 'Pending':
                return <Tag color='gold'>Pending</Tag>;
            case 'Hold':
                return <Tag color='volcano'>Hold</Tag>;
            case 'Cancel':
                return <Tag color='red'>Cancel</Tag>;
            default:
                return '';
        }
    };

    // switch (status) {
    //     case 'Complete':
    //       return <Tag style={{ background: 'linear-gradient(to right, #DAF5E6, #D9F8C4)',
    //       color: '#3AC977',}}>Complete</Tag>;
    //     case 'InProgress':
    //       return  <Tag style={{ background: 'linear-gradient(to right, #FFD6A5, #FFD4D4)',
    //       color: '#CE5A67',}}>Running</Tag>;
    //     case 'Pending':
    //       return  <Tag style={{  background: 'linear-gradient(to right, #BB6BD91A, #FFD4D4)',
    //       color: '#FF7D7D',}}>Pending</Tag>;
    //     default:
    //       return '';
    //   }
    // };
    return (
        <div>
            <div className="content-wrapper mb-3">
                <section className="content-header">
                    <div className="header-icon">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Inquiry Deadlines</h1>
                    </div>
                </section>
                <div className='deadline-main-section'>
                    <Row>
                        <Col xl={3} lg={6} md={6}>
                            <div className='due-today-section-main'>
                                <div className='over-due-heading-section'>
                                    <div className='dedline-heading-title-main'>
                                        <div className='dedline-heading'>
                                            <h5 style={{ fontWeight: "bold" }}>OverDue</h5>
                                        </div>
                                        <div className='number-rounded-dedline'>
                                            <span>{OverdueData.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4' style={{ height: '72vh', overflowY: 'auto' }}>
                                    {
                                        OverdueData.map((item) => {
                                            const Priority = priorityTemplate(item.Priority)
                                            const Status = getStatusColor(item.TaskStatus)
                                            return (
                                                <Accordion className='p-1' defaultActiveKey='0'>
                                                    <Accordion.Item >
                                                        <Accordion.Header style={{ border: '1px solid red' }}><Tag color="red">{moment(item.ToDate).format('DD/MM')}</Tag><b className='ms-2 '>{item.PartyName}</b></Accordion.Header>
                                                        <Accordion.Body>
                                                            {/* <ListGroup className="list-group-flush">
                                                                <ListGroup.Item><b>Inquiry - </b>{item.TaskName}</ListGroup.Item>
                                                                <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                                                <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                                                <ListGroup.Item style={{ display: 'flex', alignItems: 'center' }}><b>Priority - </b><span>{Priority}</span></ListGroup.Item>
                                                                <ListGroup.Item style={{ display: 'flex', alignItems: 'center' }}><b>Inquiry Status - </b>{Status}</ListGroup.Item>
                                                                <ListGroup.Item><b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                                <ListGroup.Item><b>Due Date - </b>{moment(item.ToDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                        
                                                                <Button variant='danger' onClick={() => { updateData(item.Id) }}>
                                                                    <i className="fa fa-pencil fs-4 "  style={{marginRight:"10px",}}  />Edit Inquiry
                                                                </Button>


                                                            </ListGroup> */}
                                                            <List bordered>
                                                                <List.Item>
                                                                    <b>Inquiry - </b>{item.TaskName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Project - </b>{item.ProjectName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign To - </b>{item.FirstName} {item.LastName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign By - </b>{item.ATFName} {item.ATLName}
                                                                </List.Item>
                                                                <List.Item style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span><b>Priority - </b>{Priority}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                <span><b>Status - </b>{Status}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Due Date - </b>{moment(item.ToDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='danger' onClick={() => { updateData(item.Id) }}>
                                                                        <i className="fa fa-pencil fs-4 " style={{ marginRight: "10px", }} />Edit Inquiry
                                                                    </Button>
                                                                    </span>

                                                                </List.Item>

                                                            </List>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )
                                        }
                                        )
                                    }

                                </div>
                            </div>
                        </Col>
                        <Col xl={3} lg={6} md={6} style={{ borderLeft: '1px dashed red', paddingLeft: '10px' }}>
                            <div className='due-today-section-main'>
                                {/* <div className='due-today-heading-section'>
                                    <h5>Due Today</h5>
                                </div> */}
                                <div className='due-today-heading-section'>
                                    <div className='dedline-heading-title-main-today'>
                                        <div className='dedline-heading'>
                                            <h5 style={{ fontWeight: "bold" }}>Due Today</h5>
                                        </div>
                                        <div className=''>
                                            <span>{TodayData.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4' style={{ height: '72vh', overflowY: 'auto' }}>
                                    {
                                        TodayData.map((item) => {
                                            const Priority = priorityTemplate(item.Priority)
                                            const Status = getStatusColor(item.TaskStatus)
                                            return (
                                                <Accordion className='p-2' defaultActiveKey='0'>
                                                    <Accordion.Item >
                                                        <Accordion.Header style={{ border: '1px solid #FCC314' }}><Tag color="gold">{moment(item.ToDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                        <Accordion.Body>
                                                        <List bordered>
                                                                <List.Item>
                                                                    <b>Inquiry - </b>{item.TaskName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Project - </b>{item.ProjectName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign To - </b>{item.FirstName} {item.LastName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign By - </b>{item.ATFName} {item.ATLName}
                                                                </List.Item>
                                                                <List.Item style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span><b>Priority - </b>{Priority}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                <span><b>Status - </b>{Status}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Due Date - </b>{moment(item.ToDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='warning' onClick={() => { updateData(item.Id) }}>
                                                                        <i className="fa fa-pencil fs-4 " style={{ marginRight: "10px", }} />Edit Inquiry
                                                                    </Button>
                                                                    </span>

                                                                </List.Item>

                                                            </List>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )
                                        }
                                        )
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col xl={3} lg={6} md={6} style={{ borderLeft: '1px dashed #7091F5', paddingLeft: '10px' }}>
                            <div className='due-today-section-main'>
                                {/* <div className='due-week-heading-section'>
                                    <h5>Due This Week</h5>
                                </div> */}
                                <div className='due-week-heading-section'>
                                    <div className='dedline-heading-title-main-week'>
                                        <div className='dedline-heading'>
                                            <h5 style={{ fontWeight: "bold" }}>Due This Week</h5>
                                        </div>
                                        <div className='number-rounded-dedline'>
                                            <span>{ThisWeekData.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4' style={{ height: '72vh', overflowY: 'auto' }}>
                                    {
                                        ThisWeekData.map((item) => {
                                            const Priority = priorityTemplate(item.Priority)
                                            const Status = getStatusColor(item.TaskStatus)
                                            return (<Accordion defaultActiveKey="0" className='p-2 '>
                                                <Accordion.Item >
                                                    <Accordion.Header style={{ border: '1px solid #7091F5' }}><Tag color='blue'>{moment(item.ToDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <List bordered>
                                                                <List.Item>
                                                                    <b>Inquiry - </b>{item.TaskName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Project - </b>{item.ProjectName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign To - </b>{item.FirstName} {item.LastName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign By - </b>{item.ATFName} {item.ATLName}
                                                                </List.Item>
                                                                <List.Item style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span><b>Priority - </b>{Priority}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                <span><b>Status - </b>{Status}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Due Date - </b>{moment(item.ToDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button  onClick={() => { updateData(item.Id) }}>
                                                                        <i className="fa fa-pencil fs-4 " style={{ marginRight: "10px", }} />Edit Inquiry
                                                                    </Button>
                                                                    </span>

                                                                </List.Item>

                                                            </List>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>)

                                        })
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col xl={3} lg={6} md={6} style={{ borderLeft: '1px dashed #3AC977', paddingLeft: '10px' }}>
                            <div className='due-next-week-section-main'>
                                {/* <div className='due-next-week-heading-section'>
                                    <h5>Due Next Week</h5>
                                </div> */}
                                <div className='due-next-week-heading-section'>
                                    <div className='dedline-heading-title-main-nxtweek'>
                                        <div className='dedline-heading'>
                                            <h5 style={{ fontWeight: "bold" }}>Due Next Week</h5>
                                        </div>
                                        <div className='number-rounded-dedline'>
                                            <span>{NextWeekData.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4' style={{ height: '72vh', overflowY: 'auto' }}>
                                    {
                                        NextWeekData.map((item) => {
                                            const Priority = priorityTemplate(item.Priority)
                                            const Status = getStatusColor(item.TaskStatus)
                                            return (
                                                <Accordion defaultActiveKey="0" className='p-2'>
                                                    <Accordion.Item >
                                                        <Accordion.Header style={{ border: '1px solid #3AC977' }}><Tag color="green">{moment(item.ToDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                        <Accordion.Body>
                                                        <List bordered>
                                                                <List.Item>
                                                                    <b>Inquiry - </b>{item.TaskName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Project - </b>{item.ProjectName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign To - </b>{item.FirstName} {item.LastName}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Assign By - </b>{item.ATFName} {item.ATLName}
                                                                </List.Item>
                                                                <List.Item style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span><b>Priority - </b>{Priority}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                <span><b>Status - </b>{Status}</span>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <b>Due Date - </b>{moment(item.ToDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='success' onClick={() => { updateData(item.Id) }}>
                                                                        <i className="fa fa-pencil fs-4 " style={{ marginRight: "10px", }} />Edit Inquiry
                                                                    </Button>
                                                                    </span>

                                                                </List.Item>

                                                            </List>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )
                                        }
                                        )
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            {
                selectedrow ?
                    <Inquiryform
                        show={editshow}
                        onHide={() => setEditShow(false)}
                        selectedrow={selectedrow}
                        getInqueryList={getInqueryList}
                    /> : null
            }
        </div>
    )
}

export default InqueryDeadlines