import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../style/Style.css'
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'
import { notification } from 'antd';

const AsignMenuMain = () => {
  // const [data, setData] = useState([])
  const [userdata, setUserData] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState([])
  const [userchecked, setUserchecked] = useState([]);
  const [submit, setSubmit] = useState(false)
  const URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem('CRMtoken')
  // const userassignId = localStorage.getItem('CRMUserId')
  const [username, setUserName] = useState("")
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [selectedall, setSelectedAll] = useState(false)
  const custId = localStorage.getItem('CRMCustId')
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const fetchData = async () => {
    try {
      const res = await axios.get(`${URL}/api/Master/GetMenuList`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getuserData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token} ` }
      })
      setUserData(res.data)
    } catch (error) {

    }

  }
  useEffect(() => {
    getuserData()
    // fetchData()
  }, [])

  const userId = async () => {
    try {

      const res = await axios.get(
        `${URL}/api/Master/GetAssignMenuById?UserId=${username}`,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );

      const sortedMenuItems = res.data.sort((a, b) =>
        a.MasterMenuName.localeCompare(b.MasterMenuName)
      );
      const menuItemsWithChecked = sortedMenuItems.map((item) => ({
        ...item,
        checked: item.UserId !== '0',
      }));
      setUserchecked(menuItemsWithChecked);

    } catch (error) {
      console.error(error);

    }
  };

  useEffect(() => {
    if (username) {
      userId();
      fetchData();
      setSelectedAll(false)
    }
  }, [username]);

  const DataSubmit = async () => {

    try {
      const selectedMenuIds = selectedMenuItems
        .map((menuItem) => menuItem.MenuId)
        .join(',');
      setLoading(true);
      const res = await axios.post(
        `${URL}/api/Master/AssignMenu?MenuId=${selectedMenuIds}&UserId=${username}`,
        null,
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      notification.success({
        message: 'Data Modified Successfully !!!',
        placement: 'top',
        duration: 1,
      });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
      setSubmit(false); // Reset submit state to false
    }
  };

  const userRole=userdata.filter((display)=> display.Role != 'Admin')
  const userOption = userRole.map((display) => ({
    value: display.Id,
    label: display.FirstName + ' ' + display.LastName,
  }));
  const [menuItem, setmenuItem] = useState([])
  const menulistData = async () => {
    try {
      const res = await axios.get(URL + "/api/Master/GetMenuList", {
        headers: { Authorization: `bearer ${token}` }
      })
      setmenuItem(res.data)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    menulistData()
  }, [])
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectedAll(event.target.checked)

    const updatedUserchecked = userchecked.map((menuItem) => ({
      ...menuItem,
      checked: isChecked,
    }));

    setUserchecked(updatedUserchecked);
    setSubmit(true);

    const updatedSelectedMenuItems = isChecked
      ? updatedUserchecked.filter((menuItem) => menuItem.checked)
      : [];
    setSelectedMenuItems(updatedSelectedMenuItems);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        if (username) {
          event.preventDefault();
          DataSubmit();
        }
        else {
          notification.error({
            message: 'Please Select User   !!!',
            placement: 'top',
            duration: 1,
          });
        }
      }

    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [username, userchecked]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if(selectedall){
          DataClear();
        } else {
          setUserchecked([]);
          setSelectedMenuItems([]);
          setUserName('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [username,userchecked]);
  const DataClear = () => {
    setSubmit(false);
    setSelectedAll(false)
    userId()
  }


  return (
    <div>
      <div className='content-wrapper'>
        <div className="col-lg-12 pinpin">
          <Row>
            <Col lg={6}>
              <div className='user-select-dropdown'>
                <Row>
                  <Col lg={6}>
                    <Select
                      className='w-100'
                      options={userOption}
                      value={userOption.find((option) => option.value == username) || ''}
                      onChange={(selected) => setUserName(selected.value)}
                      placeholder="Search User"

                    />
                  </Col>
                  <Col lg={6}>
                    {
                      username ? (<div className='all-select-menu-list'>
                        <label>
                          <input type="checkbox" className="m-1" checked={selectedall} onChange={handleSelectAll} />
                          <span>All Menu Select</span>
                        </label>
                      </div>) : null
                    }
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className='asignmenu-main-section-footer'>
            <div className="card lobicard" data-sortable="true">
              <div className="table-responsive">
                <table id="dataTableExample1" className="table table-bordered  table-hover">
                  <thead className="back_table_color">
                    <tr className=" back-color info">
                      <th>#</th>
                      <th>MainMenu List</th>
                      <th>Menu List</th>
                      <th>Is Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userchecked.map((item, index, array) => {
                      // Check if it's the first row of the group with the same MainMenuId
                      const isFirstRow = index === 0 || item.MainMenuId !== array[index - 1].MainMenuId;

                      // Find submenu items with the same MainMenuId
                      const filteredSubmenu = array.filter((display) => display.MainMenuId === item.MainMenuId);

                      return (
                        <React.Fragment key={index}>
                          {isFirstRow && (
                            <tr>
                              <td className='data-index'>{index + 1}</td>
                              <td rowSpan={filteredSubmenu.length}>{item.MasterMenuName}</td>
                              {/* name change MenuName to AliasName  */}
                              <td>{item.AliasName}</td>
                              <td>
                                <input
                                  type='checkbox'
                                  checked={item.checked}
                                  disabled={!username}
                                  onChange={() => {
                                    const updatedUserchecked = array.map((menuItem) =>
                                      menuItem.MenuId === item.MenuId
                                        ? { ...menuItem, checked: !menuItem.checked }
                                        : menuItem
                                    );
                                    setUserchecked(updatedUserchecked);
                                    setSubmit(true);

                                    // Update selectedMenuItems based on the checked state
                                    const updatedSelectedMenuItems = updatedUserchecked.filter((menuItem) => menuItem.checked);
                                    setSelectedMenuItems(updatedSelectedMenuItems);
                                  }}
                                />
                              </td>
                            </tr>
                          )}
                          {!isFirstRow && (
                            <tr>
                              <td className='data-index'>{index + 1}</td>
                              {/* name change MenuName to AliasName  */}
                              <td>{item.AliasName}</td>
                              <td>
                                <input
                                  type='checkbox'
                                  checked={item.checked}
                                  disabled={!username}
                                  onChange={() => {
                                    const updatedUserchecked = array.map((menuItem) =>
                                      menuItem.MenuId === item.MenuId
                                        ? { ...menuItem, checked: !menuItem.checked }
                                        : menuItem
                                    );
                                    setUserchecked(updatedUserchecked);
                                    setSubmit(true);

                                    // Update selectedMenuItems based on the checked state
                                    const updatedSelectedMenuItems = updatedUserchecked.filter((menuItem) => menuItem.checked);
                                    setSelectedMenuItems(updatedSelectedMenuItems);
                                  }}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                </table>
              </div>
              <div className='submit-btn'>
                {
                  submit == true && username ? (
                    /* <> */
                    /* <button className='btn btn-success' onClick={DataSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save[F9]'}</button> */
                    /* <button className='btn btn-success' disabled={loading}>Cancle</button> */
                    <div className="reset-button ">
                      <button className='btn btn-success' onClick={DataSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save[F9]'}</button>
                      <button className="btn btn-danger m-2" onClick={DataClear} disabled={loading}>
                        Cancel [ESC]
                      </button>
                    </div>
                    /* </> */
                  ) : (
                    <>
                      <div className="reset-button ">
                        <button className='btn btn-success' disabled>Save[F9]</button>
                        <button className="btn btn-danger m-2" disabled={loading}>
                          Cancel [ESC]
                        </button>
                      </div>
                      {/* <button className='btn btn-success' disabled>Save[F9]</button>
                      <button className='btn btn-success' disabled={loading}>Cancle</button> */}
                    </>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default AsignMenuMain