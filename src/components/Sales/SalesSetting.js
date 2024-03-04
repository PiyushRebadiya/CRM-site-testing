import React, { useState, useEffect } from 'react'
import { notification } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import Item from 'antd/es/list/Item';
import Select from 'react-select'

// Validation
const validationSchema = Yup.object().shape({
  prefix: Yup.string().required("Prefix is required"),
  remark1: Yup.string().required("Remark is required"),
  // selectedbank: Yup.string().required("Please select Bank"),
  selectedformate: Yup.string().required("Please select Format"),
})

function SalesSetting({handleAddProformaClick, fetchSettingData, setting, onHide, rowData, }) {

  const [settingid, setSettingId] = useState(-1)
  const [prefix, setPrefix] = useState("")
  const [remark1, setRemark1] = useState("")
  const [remark2, setRemark2] = useState("")
  const [remark3, setRemark3] = useState("")
  const [remark4, setRemark4] = useState("")
  const [remark5, setRemark5] = useState("")
  const [remark6, setRemark6] = useState("")
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([])
  const [updatedata, setUpdatadata] = useState([])
  const [banklist, setBankList] = useState([])
  const [selectedbank, setSelectedBank] = useState("")
  const [id, setid] = useState(-1)
  const URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem('CRMtoken')
  const custId = localStorage.getItem('CRMCustId')
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const [selectedformate, setSelectedFormate] = useState("")
  const [getformatedata, setFormateData] = useState([])
  const [loading, setLoading] = useState(false);

  const SettingData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/SettingList?CompanyId=${CompanyId}&TransMode=Sales`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setData(res.data);
      setSettingId(res.data[0].Id)
      setPrefix(res.data[0].Prefix)
      setRemark1(res.data[0].Remark1)
      setRemark2(res.data[0].Remark2)
      setRemark3(res.data[0].Remark3)
      setRemark4(res.data[0].Remark4)
      setRemark5(res.data[0].Remark5)
      setRemark6(res.data[0].Remark6)
      setSelectedBank(res.data[0].CBankId)
      setSelectedFormate(res.data[0].Format)
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    SettingData()
  }, [])

  // useEffect(() => {
  //   updateDataSetting(id)
  // }, [id])
  // const updateDataSetting = async (id) => {
  //   try {
  //     const res = await axios.get(URL + `/api/Master/SettingById?Id=${id}`, {
  //       headers: { Authorization: `bearer ${token}` }
  //     })
  //     // setSelectedRow(res.data)
  //     // setEditShow(true)
  //     setUpdatadata(res.data)
  //     setSettingId(res.data.Id)
  //     setPrefix(res.data.Prefix)
  //     setRemark1(res.data.Remark1)
  //     setRemark2(res.data.Remark2)
  //     setRemark3(res.data.Remark3)
  //     setRemark4(res.data.Remark4)
  //     setRemark5(res.data.Remark5)
  //     setRemark6(res.data.Remark6)
  //     setSelectedBank(res.data.CBankId)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  const DataSubmit = async () => {
    try {
      await validationSchema.validate({
        prefix,
        remark1,
        // selectedbank,
        selectedformate
      }, { abortEarly: false });
      setLoading(true);
      if (settingid > 0) {
        const res = await axios.post(URL + "/api/Master/Createupdatemstsetting", {
          Id: settingid,
          Prefix: prefix,
          Remark1: remark1,
          Remark2: remark2,
          Remark3: remark3,
          Remark4: remark4,
          Remark5: remark5,
          Remark6: remark6,
          CompanyId: CompanyId,
          CBankId: selectedbank,
          TransMode: "Sales",
          Format: selectedformate
        }, {
          headers: { Authorization: `bearer ${token}` }
        })
        if (res.data.Success == true) {
          onHide()
          notification.success({
            message: 'Data Modified Successfully !!!',
            placement: 'top', // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      }
      else {
        const res = await axios.post(URL + "/api/Master/Createupdatemstsetting", {
          Prefix: prefix,
          Remark1: remark1,
          Remark2: remark2,
          Remark3: remark3,
          Remark4: remark4,
          Remark5: remark5,
          Remark6: remark6,
          CompanyId: CompanyId,
          CBankId: selectedbank,
          TransMode: "Sales",
          Format: selectedformate
        }, {
          headers: { Authorization: `bearer ${token}` }
        })
        if (res.data.Success == true) {
          fetchSettingData()
          onHide()
          notification.success({
            message: 'Data Added Successfully !!!',
            placement: 'top', // You can adjust the placement
            duration: 1, // Adjust the duration as needed
          });
        }
      }
    } catch (error) {
      const validationErrors = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F9') {
        event.preventDefault();
        DataSubmit();
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [settingid, remark1,remark2,remark3,remark4,remark5,remark6, prefix, selectedbank, selectedformate]); // Add any other dependencies as needed

  const getBankList = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/BankList?CustId=${custId}&CompanyID=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setBankList(res.data)
    } catch (error) {

    }
  }

  const getFormateData = async () => {
    try {
      const res = await axios.get(URL + '/api/Master/GetFormatList', {
        headers: { Authorization: `bearer ${token}` }
      })
      setFormateData(res.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    getBankList()
    getFormateData()
  }, [])

  const bankoption = banklist.map((display) => ({
    value: display.BankID,
    label: display.BankName,
  }));
  const formateOption = getformatedata.map((display) => ({
    value: display.Formattag,
    label: display.FormatName,
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
              <h1>Settings</h1>
              <small></small>
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
                <div className="col-sm-12">
                  <Row>
                    <Col lg={4}>
                      <div className="form-group">
                        <label>Format:<span className='text-danger'>*</span></label>
                        <div className='d-flex'>
                          <Select
                            className="w-100"
                            options={formateOption}
                            value={formateOption.find((option) => option.value == selectedformate)}
                            onChange={(selected) => {
                              setSelectedFormate(selected.value)
                              if (errors.selectedformate) {
                                setErrors(prevErrors => ({ ...prevErrors, selectedformate: '' }));
                              }
                            }}
                            placeholder="Select Formate"
                          />
                        </div>
                        {errors.selectedformate && <div className="error-message text-danger">{errors.selectedbank}</div>}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="form-group">
                        <label>Bank Name :</label>
                        <div className='d-flex'>
                          <Select
                            className="w-100"
                            options={bankoption}
                            isClearable={true}
                            // value={bankoption.find((option) => option.value == selectedbank)}
                            value={bankoption.filter(
                              (option) => option.value == selectedbank
                            )}
                            onChange={(selected) => {
                              setSelectedBank(selected
                                ? selected.value
                                : "")
                              // if (errors.selectedbank) {
                              //   setErrors(prevErrors => ({ ...prevErrors, selectedbank: '' }));
                              // }
                            }}
                            placeholder="Select Bank"
                          />
                        </div>
                        {/* {errors.selectedbank && <div className="error-message text-danger">{errors.selectedbank}</div>} */}
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="form-group">
                        <label>Prefix :<span className='text-danger'>*</span></label>
                        <input type="text" className="form-control"
                          value={prefix}
                          placeholder="Enter Prefix"
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const capitalizedValue = inputValue.toUpperCase(/\D/g, '');
                            const limitedInput = capitalizedValue.slice(0, 3);
                            setPrefix(limitedInput);
                            if (errors.prefix) {
                              setErrors(prevErrors => ({ ...prevErrors, prefix: '' }));
                            }
                          }}
                        />
                        {errors.prefix && <div className="error-message text-danger">{errors.prefix}</div>}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 1:<span className='text-danger'>*</span></label>
                        <input type='text' className="form-control" value={remark1} onChange={(event) => {
                          setRemark1(event.target.value);
                          if (errors.remark1) {
                            setErrors(prevErrors => ({ ...prevErrors, remark1: '' }));
                          }
                        }}
                        />
                        {errors.remark1 && <div className="error-message text-danger">{errors.remark1}</div>}
                      </div>

                    </Col>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 2:</label>
                        <input type='text' className="form-control" value={remark2} onChange={(event) => {
                          setRemark2(event.target.value);
                        }}
                        />
                      </div>


                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 3:</label>
                        <input type='text' className="form-control" value={remark3} onChange={(event) => {
                          setRemark3(event.target.value);
                        }}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 4:</label>
                        <input type='text' className="form-control" value={remark4} onChange={(event) => {
                          setRemark4(event.target.value);
                        }}
                        />
                      </div>

                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 5:</label>
                        <input type='text' className="form-control" value={remark5} onChange={(event) => {
                          setRemark5(event.target.value);
                        }}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-group">
                        <label>Term & Condition 6:</label>
                        <input type='text' className="form-control" value={remark6} onChange={(event) => {
                          setRemark6(event.target.value);
                        }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="reset-button">
                    <button className="btn btn-success m-2" onClick={DataSubmit} disabled={loading}>
                      {loading ? 'Saving...' : 'Save [F9]'}
                    </button>
                    <button className="btn btn-danger m-2" onClick={onHide} disabled={loading}>
                      Cancel [ESC]
                    </button>
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
export default SalesSetting