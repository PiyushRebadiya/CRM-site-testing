import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import UserTable from './UserTable'
import UserForm from './UserForm'

function UserNewForm(props) {
    const { fetchData, username } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <UserForm fetchData={fetchData} onHide={props.onHide} username={username} />
        </Modal>
    );
}

function UserMaster() {
    const [usernew, setUserNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [username, setUsername] = useState([])
    const insertData = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setUserNew(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    const handleUser = (userdata) => {
        // console.log(userdata, "fdsfdsfdfdfdfdf")
        setUsername(userdata)
    }
    return (
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    <i className="fa fa-users" />
                </div>
                <div className="header-title">
                    <h1>User Master</h1>
                    {/* <small>User List</small> */}
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className="card-title custom_title">
                                    <h4>User List</h4>
                                </div>
                            </div>
                            <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setUserNew(true)}>
                                        <i className="fa fa-plus" /> Add User [F2]
                                    </Button>
                                    <UserNewForm
                                        show={usernew}
                                        onHide={() => setUserNew(false)}
                                        fetchData={insertData.current}
                                        username={username}
                                    />
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />

                                </div>
                            </div>
                            <div className='p-3' >
                                <UserTable insertData={insertData} searchinput={searchinput} datarecord={handleUser} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserMaster