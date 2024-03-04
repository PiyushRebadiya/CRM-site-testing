import React, { useEffect, useState } from 'react'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskForm from './TaskForm';
import TaskTable from './TaskTable';
import TaskCalendar from './TaskCalender';
import Calender from './Calender';
import { Tabs } from 'antd';
import AssignByMeWork from './AssignByMeWork';
import AssignByMeCalender from './AssignByMeCalender';
// import AutoTask from './AutoTask';
const { TabPane } = Tabs;

function TaskNewForm(props) {
    const { fetchData,insertCalenderData,insertABMCalenderData, AsignByfetch } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <AutoTask onHide={props.onHide} fetchData={fetchData} /> */}
            <TaskForm onHide={props.onHide} fetchData={fetchData} fetchCalenderData={insertCalenderData} AsignByfetch={AsignByfetch} fetchAssignByMeData={insertABMCalenderData} />
        </Modal>
    );
}

function WorkMaster() {
    const [tasknew, setTaskNew] = useState(false);
    const insertData = React.useRef(null);
    const insertCalenderData = React.useRef(null);
    const insertABMCalenderData = React.useRef(null);
    const AsignByInsert = React.useRef(null);
    const [data, setData] = useState([])
    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL
    const CompnyId = localStorage.getItem('CRMCompanyId')
    const Role = localStorage.getItem('CRMRole')
    const [record, setRecord] = useState([])
    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setTaskNew(true);
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompnyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            // console.log(res, "pres")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleData = (data) => {
        setRecord(data)
    }
    return (
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    {/* <i className="fa fa-users" /> */}
                    <i class="fa fa-tasks" aria-hidden="true"></i>
                </div>
                {/* <div className="header-title">
                    <h1>Task</h1>
                </div> */}
                <div className='headeradjust'>
                    <div className="header-title">
                        <h1>Task Dashboard</h1>
                        {/* <small>Task details</small> */}
                    </div>
                    {/* <Button className="btn btn-add rounded-2" onClick={() => setTaskNew(true)}>
                            Add Task <i class="fa fa-plus" aria-hidden="true"></i>
                        </Button> */}
                    <Button className="btn btn-add rounded-2" onClick={() => setTaskNew(true)}>
                        <i className="fa fa-plus" /> Add Task [F2]
                    </Button>
                    <TaskNewForm
                        show={tasknew}
                        onHide={() => setTaskNew(false)}
                        fetchData={insertData.current}
                        insertCalenderData={insertCalenderData.current}
                        AsignByfetch={AsignByInsert.current}
                        insertABMCalenderData={insertABMCalenderData.current}
                    />
                    {/* <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i> */}
                    {/* <Popover
                            content={filterPop}
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <Button type="primary"> <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i></Button>
                        </Popover> */}
                </div>
            </section>
            {/* <div className="btn-group d-flex pt-3 pl-3 ps-3" role="group">
                <div className="buttonexport" id="buttonlist">
                    <Button className="btn btn-add rounded-2" onClick={() => setTaskNew(true)}>
                        <i className="fa fa-plus" /> Add Task [F2]
                    </Button>
                    <TaskNewForm
                        show={tasknew}
                        onHide={() => setTaskNew(false)}
                        fetchData={insertData.current}
                        AsignByfetch={AsignByInsert.current}
                    />
                </div>
            </div> */}
            {/* <TaskTable insertData={insertData} /> */}
            {

            }
            {
                Role == 'Admin' ? (
                    <div className='work-padding'>
                        <Tabs
                            defaultActiveKey="home"
                            transition={false}
                            id="noanim-tab-example"
                            className="ms-3"
                        >
                            <TabPane tab="Tasks List" key="My Task">
                                <Tabs
                                    defaultActiveKey="home"
                                    transition={false}
                                    id="noanim-tab-example"
                                    className="mb-3 ms-3"
                                >
                                    <TabPane tab="Projects" key="home">
                                        <TaskTable insertData={insertData} insertCalenderData={()=>{insertCalenderData.current()}}  />
                                    </TabPane>
                                    <TabPane tab="Calender" key="calender">
                                        <div className="col-lg-12 pinpin">
                                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                                <div className="card-header">
                                                    <div className="card-title custom_title">
                                                        <h4>Task Calender</h4>
                                                    </div>
                                                </div>
                                                <Calender insertCalenderData={insertCalenderData} data={data} />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </TabPane >
                        </Tabs>
                    </div>
                ) :
                    <div className='work-padding'>
                        <Tabs
                            defaultActiveKey="home"
                            transition={false}
                            id="noanim-tab-example"
                            className="ms-3"
                        >
                            <TabPane tab="My Task" key="My Task">
                                <Tabs
                                    defaultActiveKey="home"
                                    transition={false}
                                    id="noanim-tab-example"
                                    className="mb-3 ms-3"
                                >
                                    <TabPane tab="Projects" key="home">
                                        <TaskTable insertData={insertData} insertCalenderData={()=>{insertCalenderData.current()}}/>
                                    </TabPane>
                                    <TabPane tab="Calender" key="calender">
                                        <div className="col-lg-12 pinpin">
                                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                                <div className="card-header">
                                                    <div className="card-title custom_title">
                                                        <h4>Task Calender</h4>
                                                    </div>
                                                </div>
                                                <Calender  insertCalenderData={insertCalenderData} data={data} />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </TabPane >
                            <TabPane tab="Assign By ME" key="Assign By ME">
                                <Tabs>
                                    <TabPane tab="Projects" key="1">
                                        <AssignByMeWork AsignByInsert={AsignByInsert} insertABMCalenderData={()=>{insertABMCalenderData.current()}} />
                                    </TabPane>
                                    <TabPane tab="Calender" key="2">
                                    <div className="col-lg-12 pinpin">
                                            <div className="card lobicard lobicard-custom-control" data-sortable="true">
                                                <div className="card-header">
                                                    <div className="card-title custom_title">
                                                        <h4>Task Calender</h4>
                                                    </div>
                                                </div>
                                                <AssignByMeCalender insertABMCalenderData={insertABMCalenderData} data={data} />
                                            </div>
                                        </div>
                                       
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                        </Tabs>
                    </div>
            }

        </div>
    )
}

export default WorkMaster