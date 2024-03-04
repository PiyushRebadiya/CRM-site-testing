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
import Accordion from 'react-bootstrap/Accordion';

const SalesDeadlines = () => {
    const URL = process.env.REACT_APP_API_URL
    const Role = localStorage.getItem('CRMRole')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const userid = localStorage.getItem('CRMUserId')
    const token = localStorage.getItem('CRMtoken')
    const [SalesData, setSalesData] = useState([])

    // const getInqueryList = async () => {
    //     try {
    //         if (Role == 'Admin') {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             console.log(res, "response")
    //             setSalesData(res.data)
    //         }
    //         else {
    //             const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${CompanyId}&Type=Deal&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}`, {
    //                 headers: { Authorization: `bearer ${token}` }
    //             })
    //             setSalesData(res.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     getInqueryList()
    // }, [])
    const fetchDataSales = async () => {
        try {
          const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${CompanyId}&TransMode=Sales`, {
            headers: { Authorization: `bearer ${token}` }
          })
          // const allData = res.data;
          // const filteredData = allData.filter(item => item.CustId === customerId);
          setSalesData(res.data)
        //   console.log(res.data,'resssss')
        
          // datarecord(res.data)
        } catch (error) {
          console.log(error)
        }
      }
    useEffect(() => {
        fetchDataSales();
    }, []);
    
//Today Filter
const Today = new Date()
const DueToday = moment(Today).format('DD/MM/YYYY');
const TodayData = SalesData.filter((item)=>moment(item.DueDate).format('DD/MM/YYYY')==DueToday)




// const today = moment().startOf('day');
// const startOfWeek = today.clone().startOf('week');
// const endOfWeek = today.clone().endOf('week');

// const SalesData = [
//     { DueDate: '23/11/2023', /* other properties */ },
//     { DueDate: '25/11/2023', /* other properties */ },
//     // ... other entries
//   ];
//   console.log('API Date Format:', SalesData[0].DueDate);
  
// const ThisWeekData = SalesData.filter((item) => {
//   const itemDate = moment(item.DueDate, 'DD/MM/YYYY', true);

//   return (
//     itemDate.isValid() &&
//     itemDate.isBetween(startOfWeek, endOfWeek, null, '[]') // Using [) to include both startOfWeek and endOfWeek
//   );
// });

// console.log('Start of Week:', startOfWeek.format('DD/MM/YYYY'));
// console.log('End of Week:', endOfWeek.format('DD/MM/YYYY'));
// console.log('This Week Data:', ThisWeekData);
const today = moment().startOf('day');
const startOfWeek = today.clone().startOf('week');
const endOfWeek = today.clone().endOf('week');

const ThisWeekData = SalesData.filter((item) => {
  const itemDate = moment(item.DueDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

  return (
    itemDate.isValid() &&
    itemDate.isBetween(startOfWeek, endOfWeek, null, '[]') // Using [) to include both startOfWeek and endOfWeek
  );
});

const startOfNextWeek = today.clone().startOf('week').add(1, 'weeks');
const endOfNextWeek = today.clone().endOf('week').add(1, 'weeks');

const NextWeekData = SalesData.filter((item) => {
  const itemDate = moment(item.DueDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

  return (
    itemDate.isValid() &&
    itemDate.isBetween(startOfNextWeek, endOfNextWeek, null, '[]') // Using [) to include both startOfNextWeek and endOfNextWeek
  );
});

// console.log('Start of Next Week:', startOfNextWeek.format('DD/MM/YYYY'));
// console.log('End of Next Week:', endOfNextWeek.format('DD/MM/YYYY'));
// console.log('Next Week Data:', NextWeekData);

// console.log('This Week Data:', ThisWeekData);


const OverdueData = SalesData.filter((item) => {
  const itemDate = moment(item.DueDate, 'YYYY-MM-DDTHH:mm:ss', true).startOf('day');

  return itemDate.isValid() && itemDate.isBefore(today, 'day');
});

// console.log('Today:', today.format('DD/MM/YYYY'));
// console.log('Overdue Data:', OverdueData);



    const priorityTemplate = (rowData) => {
        let priorityStyle = {};

        switch (rowData.Priority) {
            case 'High':
                priorityStyle = {
                    background: 'linear-gradient(to right, #B6FFFA, #80B3FF)',
                    color: '#205375',
                };
                break;
            case 'Urgent':
                priorityStyle = {
                    background: 'linear-gradient(to right, #3D246C, #9F91CC)',
                    color: 'white',
                };
                break;
            case 'Low':
                priorityStyle = {
                    background: 'linear-gradient(to right, #BB6BD91A, #FFD4D4)',
                    color: '#FF7D7D',
                };
                break;
            default:
                priorityStyle = {};
        }

        return <Tag style={priorityStyle}>{rowData.Priority}</Tag>;
    };
    return (
        <div>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="header-icon">
                        <i className="fa fa-dashboard" />
                    </div>
                    <div className="header-title">
                        <h1>Inquiry Deadlines</h1>
                    </div>
                </section>
                <div className='deadline-main-section'>
                    <Row>
                        <Col lg={3}>
                            <div className='over-due-section-main'>
                                <div className='over-due-heading-section '>
                                    <h5>OverDue</h5>
                                </div>
                                <div className='p-4'>
                                    {
                                        OverdueData.map((item) => (
                                            // <Card style={{ width: '20rem' }}>
                                            //     {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                            //     <Card.Body>
                                            //         <Card.Title>{item.PartyName}</Card.Title>
                                            //         <span><Tag>{item.Priority}</Tag></span>
                                            //         <Card.Text>
                                            //             <b>Task Name - </b>
                                            //             {item.TaskName}
                                            //         </Card.Text>

                                            //     </Card.Body>
                                            //     <ListGroup className="list-group-flush">
                                            //         <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                            //         <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                            //         <ListGroup.Item><b>Priority - </b>{item.Priority}</ListGroup.Item>
                                            //         <ListGroup.Item><b>Task Status - </b>{item.TaskStatus}</ListGroup.Item>
                                            //         <ListGroup.Item><b>Inquiry Date - </b>{moment(item.DueDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                            //         <ListGroup.Item><b>Due Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                            //     </ListGroup>
                                            //     <Card.Body>
                                            //         <Card.Link href="#">Card Link</Card.Link>
                                            //         <Card.Link href="#">Another Link</Card.Link>
                                            //     </Card.Body>
                                            // </Card>
                                            <Accordion  className='p-2'>
                                                <Accordion.Item >
                                                    <Accordion.Header style={{border:'1px solid red'}}><Tag severity="danger">{moment(item.DueDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <ListGroup className="list-group-flush">
                                                     <ListGroup.Item><b>Task - </b>{item.TaskName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                                     <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Priority - </b>{item.Priority}</ListGroup.Item>
                                                     <ListGroup.Item><b>Task Status - </b>{item.TaskStatus}</ListGroup.Item>
                                                     <ListGroup.Item><b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                     <ListGroup.Item><b>Due Date - </b>{moment(item.DueDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                 </ListGroup>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }

                                </div>
                            </div>
                        </Col>
                        <Col lg={3} style={{ borderLeft: '1px dashed #D2DE32', paddingLeft: '10px' }}>
                            <div className='due-today-section-main'>
                                <div className='due-today-heading-section'>
                                    <h5>Due Today</h5>
                                </div>
                                <div className='p-4'>
                                {
                                        TodayData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header style={{border:'1px solid #D2DE32'}}><Tag severity="warning">{moment(item.DueDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <ListGroup className="list-group-flush">
                                                    <ListGroup.Item><b>Task - </b>{item.TaskName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                                     <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Priority - </b>{item.Priority}</ListGroup.Item>
                                                     <ListGroup.Item><b>Task Status - </b>{item.TaskStatus}</ListGroup.Item>
                                                     <ListGroup.Item><b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                     <ListGroup.Item><b>Due Date - </b>{moment(item.DueDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                 </ListGroup>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col lg={3}  style={{ borderLeft: '1px dashed #7091F5', paddingLeft: '10px' }}>
                            <div className='due-week-section-main'>
                                <div className='due-week-heading-section'>
                                    <h5>Due This Week</h5>
                                </div>
                                <div className='p-4'>
                                {
                                        ThisWeekData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header style={{border:'1px solid #7091F5'}}><Tag>{moment(item.DueDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <ListGroup className="list-group-flush">
                                                    <ListGroup.Item><b>Task - </b>{item.TaskName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                                     <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Priority - </b>{item.Priority}</ListGroup.Item>
                                                     <ListGroup.Item><b>Task Status - </b>{item.TaskStatus}</ListGroup.Item>
                                                     <ListGroup.Item><b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                     <ListGroup.Item><b>Due Date - </b>{moment(item.DueDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                 </ListGroup>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col lg={3}  style={{ borderLeft: '1px dashed #279EFF', paddingLeft: '10px' }}>
                            <div className='due-next-week-section-main'>
                                <div className='due-next-week-heading-section'>
                                    <h5>Due Next Week</h5>
                                </div>
                                <div className='p-4'>
                                {
                                        NextWeekData.map((item) => (
                                            <Accordion defaultActiveKey="0" className='p-2'>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header style={{border:'1px solid #279EFF'}}><Tag severity="info">{moment(item.DueDate).format('DD/MM')}</Tag><b className='ms-2'>{item.PartyName}</b></Accordion.Header>
                                                    <Accordion.Body>
                                                    <ListGroup className="list-group-flush">
                                                          <ListGroup.Item><b>Task - </b>{item.TaskName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Assign To - </b>{item.FirstName} {item.LastName} </ListGroup.Item>
                                                     <ListGroup.Item> <b>Assign By - </b>{item.ATFName} {item.ATLName}</ListGroup.Item>
                                                     <ListGroup.Item><b>Priority - </b>{item.Priority}</ListGroup.Item>
                                                     <ListGroup.Item><b>Task Status - </b>{item.TaskStatus}</ListGroup.Item>
                                                     <ListGroup.Item><b>Inquiry Date - </b>{moment(item.FromDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                     <ListGroup.Item><b>Due Date - </b>{moment(item.DueDate).format('DD/MM/YYYY')}</ListGroup.Item>
                                                 </ListGroup>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default SalesDeadlines