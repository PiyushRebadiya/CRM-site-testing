import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd';
import Select from 'react-select'

const Menuform = ({ onHide, fetchData, rowData }) => {
    const [addmenu, setAddmenu] = useState("")
    const [isactive, setIsActive] = useState(null)
    const [menuid, setMenuid] = useState("")
    const [mainmenulist, setMainMenuList] = useState([])
    const [mainmenuselect,setMainMenuSelect]=useState([])
    const URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('CRMtoken');

    useEffect(() => {
        if (rowData) {
            setAddmenu(rowData.MenuName)
            setIsActive(rowData.IsActive)
            setMenuid(rowData.Id)
        }
    }, [rowData])
    const getMainMenuList = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/GetMainMenuList', {
                headers: { Authorization: `bearer ${token}` },
            })
            setMainMenuList(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMainMenuList()
    }, [])
    const DataSubmit = async () => {
        if (menuid > 0) {
            const res = await axios.post(URL + "/api/Master/CreateMenu",
                {
                    Id: menuid,
                    MainMenuId:mainmenuselect,
                    MenuName: addmenu,
                    IsActive: isactive
                },
                {
                    headers: { Authorization: `bearer ${token}` },
                })
            if (res.data.Success == true) {
                fetchData()
                onHide()
                notification.success({
                    message: 'Data Modified Successfully !!!',
                    placement: 'top', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
            }
        }
        else {
            const res = await axios.post(URL + "/api/Master/CreateMenu",
                {
                    MainMenuId:mainmenuselect,
                    MenuName: addmenu,
                    IsActive: true
                },
                {
                    headers: { Authorization: `bearer ${token}` },
                })
            if (res.data.Success == true) {
                fetchData()
                onHide()
                notification.success({
                    message: 'Data Added Successfully !!!',
                    placement: 'top', // You can adjust the placement
                    duration: 1, // Adjust the duration as needed
                });
            }
        }
    }
    const mainMenuOption = mainmenulist.map((display) => ({
        value: display.Id,
        label: display.MasterMenuName,
    }));
    return (
        <div>
            <div className='form-border'>
                {/* Content Header (Page header) */}
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Add Menu</h1>
                            <small>Menu List</small>
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
                {/* Main content */}
                <div className="">
                    <div className="row">
                        {/* Form controls */}
                        <div className="col-sm-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                {/* <div className="card-header all_card_btn">
                            <div className="card-title custom_title">
                                <a className="btn btn-add" href="clist.html"><i className="fa fa-list" /> Customer List </a>
                            </div>
                             </div> */}
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>MainMenu Name :</label>                                   
                                        <Select
                                            className='w-100'
                                            options={mainMenuOption}
                                            value={mainMenuOption.find((option) => option.value == mainmenuselect)}
                                            onChange={(selected) => setMainMenuSelect(selected.value)} 
                                            placeholder="Search Main Menu"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>MenuName :</label>
                                        <input type="text" className="form-control " placeholder="Enter Menuname" value={addmenu} onChange={(e) => { setAddmenu(e.target.value) }} />
                                    </div>

                                    <label>Status</label><br />
                                    <label className="radio-inline">
                                        <input type="radio" name="status" checked={isactive == true ? true : null} onChange={() => { setIsActive(true) }} /> Active</label>
                                    <label className="radio-inline"><input type="radio" name="status" checked={isactive == false ? true : null} onChange={() => { setIsActive(false) }} /> Inactive</label>
                                    <div className="reset-button">
                                        <button className="btn btn-danger m-2" onClick={onHide}> Cancel</button>
                                        <button className="btn btn-success m-2" onClick={DataSubmit}> Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /.content */}
            </div>
        </div>
    )
}

export default Menuform
