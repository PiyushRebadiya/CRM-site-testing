import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Tag } from 'primereact/tag';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Swal from 'sweetalert2';
import ReminderForm from '../reminder/ReminderForm';
import { List } from 'antd';


function EditData(props) {
    const { selectedrow, fetchData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReminderForm rowData={selectedrow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
const ReminderDeadlines = () => {
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const userid = localStorage.getItem('CRMUserId')
    const token = localStorage.getItem('CRMtoken')
    const [ReminderData, setReminderData] = useState([])
    const [selectedrow, setSelectedRow] = useState([]);
    const [editshow, setEditShow] = React.useState(false);



    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetReminderList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setReminderData(res.data)
            // console.log(res.data,'ressss')
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/ReminderById?ReminderId=${id}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data)
            setEditShow(true)
            // console.log(res.data, 'edit')
        } catch (error) {
            console.log(error)
        }
    }
    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteReminder?ReminderId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const showAlert = (id) => {
        const confirm = Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        });

        confirm.then((result) => {
            if (result.isConfirmed) {
                deleteData(id);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'No changes have been made.', 'error');
            }
        });
    };

    //Today Filter
    const Today = new Date()
    const DueToday = moment(Today).format('DD/MM/YYYY');

    const filterData = ReminderData.filter((item)=>item.IsActive==true)

    const TodayData = filterData.filter((item) => moment(item.ReminderDate).format('DD/MM/YYYY') == DueToday)


    const today = moment().startOf('day');
    const startOfWeek = today.clone().startOf('week');
    const endOfWeek = today.clone().endOf('week');

    const ThisWeekData = filterData.filter((item) => {
        const itemDate = moment(item.ReminderDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        return (
            itemDate.isValid() &&
            itemDate.isBetween(startOfWeek, endOfWeek, null, '[]') &&
            !itemDate.isSameOrBefore(today, 'day')
        );
    });

    // console.log('Start of Week:', startOfWeek.format('DD/MM/YYYY'));
    // console.log('End of Week:', endOfWeek.format('DD/MM/YYYY'));
    // console.log('This Week Data:', ThisWeekData);


    const startOfNextWeek = today.clone().startOf('week').add(1, 'weeks');
    const endOfNextWeek = today.clone().endOf('week').add(1, 'weeks');

    const NextWeekData = filterData.filter((item) => {
        const itemDate = moment(item.ReminderDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        return (
            itemDate.isValid() &&
            itemDate.isBetween(startOfNextWeek, endOfNextWeek, null, '[]') // Using [) to include both startOfNextWeek and endOfNextWeek
        );
    });

    // console.log('Start of Next Week:', startOfNextWeek.format('DD/MM/YYYY'));
    // console.log('End of Next Week:', endOfNextWeek.format('DD/MM/YYYY'));
    // console.log('Next Week Data:', NextWeekData);

    // console.log('This Week Data:', ThisWeekData);


    const OverdueData = filterData.filter((item) => {
        const itemDate = moment(item.ReminderDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

        return itemDate.isValid() && itemDate.isBefore(today, 'day');
    });

    // console.log('Today:', today.format('DD/MM/YYYY'));
    // console.log('Overdue Data:', OverdueData);

    return (
        <div>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="header-icon">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Reminder Deadlines</h1>
                    </div>
                </section>
                <div className='deadline-main-section'>
                    <Row>
                        <Col lg={3} md={6} sm={12}>
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
                                        OverdueData.map((item) => (
                                            <Accordion className='p-2' defaultActiveKey='0'>
                                                <Accordion.Item >
                                                    <Accordion.Header style={{ border: '1px solid red' }}><Tag severity="danger">{moment(item.ReminderDate).format('DD/MM')}</Tag><b className='ms-2'>{item.ReminderName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                        {/* <ListGroup className="list-group-flush">
                                                            <ListGroup.Item><b>Type - </b>{item.ReminderType}</ListGroup.Item>
                                                            <ListGroup.Item><b>Due Date - </b>{moment(item.ReminderDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                            <Button variant='danger' onClick={() => { updateData(item.ReminderId) }}><i class="fa fa-pencil" aria-hidden="true"></i> Edit</Button>
                                                        </ListGroup> */}
                                                        
                                                        <List bordered>
                                                                <List.Item>
                                                                <b>Type - </b>{item.ReminderType}
                                                                </List.Item>
                                                                <List.Item>
                                                                <b>Due Date - </b>{moment(item.ReminderDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='danger' onClick={() => { updateData(item.ReminderId) }}><i class="fa fa-pencil" aria-hidden="true"></i> Edit</Button>
                                                                    </span>
                                                                </List.Item>
                                                            </List>
                                                       
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }

                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} style={{ borderLeft: '1px dashed #D2DE32', paddingLeft: '10px' }}>
                            <div className='due-today-section-main'>
                                <div className='due-today-heading-section'>
                                    <div className='dedline-heading-title-main-today'>
                                        <div className='dedline-heading'>
                                            <h5 style={{ fontWeight: "bold" }}>Due Today</h5>
                                        </div>
                                        <div className='number-rounded-dedline'>
                                            <span>{TodayData.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4' style={{ height: '72vh', overflowY: 'auto' }}>
                                    {
                                        TodayData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item>
                                                    <Accordion.Header style={{ border: '1px solid #D2DE32' }}><Tag severity="warning">{moment(item.ReminderDate).format('DD/MM')}</Tag><b className='ms-2'>{item.ReminderName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <List bordered>
                                                                <List.Item>
                                                                <b>Type - </b>{item.ReminderType}
                                                                </List.Item>
                                                                <List.Item>
                                                                <b>Due Date - </b>{moment(item.ReminderDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='warning' onClick={() => { updateData(item.ReminderId) }}><i class="fa fa-pencil" aria-hidden="true"></i> Edit</Button>
                                                                    </span>
                                                                </List.Item>
                                                            </List>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} style={{ borderLeft: '1px dashed #7091F5', paddingLeft: '10px' }}>
                            <div className='due-today-section-main'>
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
                                        ThisWeekData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item >
                                                    <Accordion.Header style={{ border: '1px solid #7091F5' }}><Tag>{moment(item.ReminderDate).format('DD/MM')}</Tag><b className='ms-2'>{item.ReminderName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <List bordered>
                                                                <List.Item>
                                                                <b>Type - </b>{item.ReminderType}
                                                                </List.Item>
                                                                <List.Item>
                                                                <b>Due Date - </b>{moment(item.ReminderDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button  onClick={() => { updateData(item.ReminderId) }}><i class="fa fa-pencil" aria-hidden="true"></i> Edit</Button>
                                                                    </span>
                                                                </List.Item>
                                                            </List>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} style={{ borderLeft: '1px dashed #279EFF', paddingLeft: '10px' }}>
                            <div className='due-next-week-section-main'>
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
                                        NextWeekData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item >
                                                    <Accordion.Header style={{ border: '1px solid #3AC977' }}><Tag severity="success">{moment(item.ReminderDate).format('DD/MM')}</Tag><b className='ms-2'>{item.ReminderName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <List bordered>
                                                                <List.Item>
                                                                <b>Type - </b>{item.ReminderType}
                                                                </List.Item>
                                                                <List.Item>
                                                                <b>Due Date - </b>{moment(item.ReminderDate).format('DD/MM/YYYY')}
                                                                </List.Item>
                                                                <List.Item>
                                                                    <span className='mx-auto'>
                                                                    <Button variant='success' onClick={() => { updateData(item.ReminderId) }}><i class="fa fa-pencil" aria-hidden="true"></i> Edit</Button>
                                                                    </span>
                                                                </List.Item>
                                                            </List>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                      {selectedrow ? (
                    <EditData
                        show={editshow}
                        onHide={() => setEditShow(false)}
                        selectedrow={selectedrow}
                        fetchData={fetchData}
                    />
                    // <EditData
                    //     visible={editshow}
                    //     onHide={() => setEditShow(false)}
                    //     selectedrow={selectedrow}
                    //     fetchData={fetchData}
                    // />
                ) : null}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default ReminderDeadlines