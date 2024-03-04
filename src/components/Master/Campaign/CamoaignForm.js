import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Drawer } from 'antd';
import axios from 'axios';
import { Badge } from 'antd';
import { notification } from 'antd';
import ImportCampagin from './ImportCampagin';
import Select from 'react-select'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { v4 as uuidv4 } from 'uuid';
import { Space, Tooltip, Table } from 'antd';
import { LuImport } from "react-icons/lu";
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { CiImport } from "react-icons/ci";
import CampaignRecord from './CampaginRecordImport'
function CamoaignForm({ onHide, rowData, fetchDetailsData, getProjectData, fetchData, reset_Data, errorData, totalInput, }) {

  const validationSchema = Yup.object().shape({
    campaignName: Yup.string().required("Campaign Name is required"),
    campaignDescription: Yup.string().required("Campaign Description is required"),
    category: Yup.string().required("Please select category."),
    taxadmin: Yup.string().required("Please select Sub-category."),
  });

  React.useEffect(() => {
    if (errorData) {
      errorData.current = resetErrors
    }
  }, [])
  React.useEffect(() => {
    if (reset_Data) {
      reset_Data.current = resetData
    }
  }, [])

  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [errors, setErrors] = useState({});
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [resetForm, setResetForm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [CampaginId, setCampaginId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
  const [getprojectdata, setGetProjectData] = useState([])
  const [projectname, setProjectname] = useState()
  const [selectedprocess, setSelectedProcess] = useState()
  const [guid, setGuid] = useState("")
  const [category, setCategory] = useState()
  const [taxadmin, setTaxadmin] = useState()
  const [getcategorydata, setGetcategorydata] = useState([])
  const [isSubCategorySelected, setIsSubCategorySelected] = useState(false);
  const [gettaxadmindata, setGettaxadmindata] = useState([])
  const [processlist, setProcessList] = useState([])
  const [party, setParty] = useState([])
  const URL = process.env.REACT_APP_API_URL
  const [showForm, setShowForm] = useState(true);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const stdate = new Date()
  const startDate = moment(stdate).format('YYYY-MM-DD')
  const [startdate, setStartDate] = useState(startDate)
  const endate = new Date()
  const endDate = moment(endate).format('YYYY-MM-DD')
  const [enddate, setEndDate] = useState(endDate)
  // partyList
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [partySubmit, setPartySubmit] = useState(false)

  const token = localStorage.getItem('CRMtoken')
  const CusId = localStorage.getItem('CRMCustId')
  const CompanyId = localStorage.getItem('CRMCompanyId')
  const UserId = localStorage.getItem('CRMUserId')
  const UserName = localStorage.getItem('CRMUsername')
  const [ipaddress, setIpAddress] = useState('')

  // const [CampaginData, setCampaginData] = useState([])
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const uuid = uuidv4();
  const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${CusId}`;

  let ProjectID;
  const resetErrors = () => {
    setErrors({});
  };

  const resetData = () => {
    setCampaignName('');
    setCampaignDescription('');
    setProjectname('');
    setCategory('')
    setTaxadmin('')
    setSelectedProcess('');
  }

  useEffect(() => {
    if (rowData) {
      setCampaignName(rowData.Name)
      setCampaignDescription(rowData.Description)
      setCampaginId(rowData.Id)
      setProjectname(rowData.ProjectId)
      setCategory(rowData.CategoryId)
      setTaxadmin(rowData.SubCategoryId)
      setSelectedProcess(rowData.ProcessId)
      setGuid(rowData.Cguid)
    }
    else {
      resetData()
    }
  }, [rowData])

  const handlePartyClose = () => {
    setIsPartyDrawerOpen(false);
    setIsDrawerOpen(false);

  };
  const fetchPartyData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(URL + `/api/Master/PartyList?CustId=${CusId}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      const activeParty = res.data.filter((item) => item.IsActive == true)
      setData(activeParty)
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  }
  useEffect(() => {
    fetchPartyData()
  }, [])
  const handlepartyClick = async () => {
    setIsDrawerOpen(true);
    try {
      const res = await axios.get(URL + `/api/Master/PartyList?CustId=${CusId}&CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setPartyList(res.data)
      // console.log(partyList, "res.data")
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    if (resetForm) {
      setErrors({}); // Clear validation errors
      setResetForm(false);
    }
  }, [resetForm]);


  const handleNextButtonClick = async () => {
    try {
      // Validate the form data using Yup schema
      await validationSchema.validate({ campaignName, campaignDescription, taxadmin, category },
        { abortEarly: false });
      setNextButtonClicked(true);
    } catch (error) {
      const validationErrors = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);
    }
  };

  const handleCancelClick = () => {
    setNextButtonClicked(false);
    setShowForm(true);
    // resetData();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCancelClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCancelClick]);


  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);
    if (!selectAllChecked) {
      const allParties = partyList.map((party) => ({ PartyId: party.PartyId, PartyName: party.PartyName, Mobile1: party.Mobile1, Mobile2: party.Mobile2 }));
      setSelectedParties(allParties);
    } else {
      setSelectedParties([]);
      setSelectAllChecked(false);
    }
  };

  const handleCheckboxChange = (partyId, partyName) => {
    const isChecked = selectedParties.some((party) => party.PartyId === partyId);

    if (selectAllChecked) {
      setSelectAllChecked(false);
      setSelectedParties(selectedParties.filter((party) => party.PartyId !== partyId));
    } else {
      if (isChecked) {
        setSelectedParties(selectedParties.filter((party) => party.PartyId !== partyId));
      } else {
        setSelectedParties([...selectedParties, { PartyId: partyId, PartyName: partyName }]);
      }
    }
  };

  // get data 
  // const fetchCampaginData = async () => {
  //   try {
  //     const res = await axios.get(URL + `/api/Master/CampaignList?CompanyId=${CompanyId}`, {
  //       headers: { Authorization: `bearer ${token}` }
  //     })
  //     setCampaginData(res.data)
  //     // console.log(res.data, "Campagin")
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   fetchCampaginData()
  // }, [])
  const [insertSelectedParty, setInsertSelectedParty] = useState([])
  const handleSelectedParty = (selectedParty) => {
    setInsertSelectedParty(selectedParty)
  }
  let selectedPartyTask
  const handleGuidAdd = (UUID) => {
    const updatedParty = insertSelectedParty.map((partyItem) => ({
      ...partyItem,
      Cguid: UUID,
      UserId: UserId,
      UserName: UserName,
      IPAddress: ipaddress
    }));
    selectedPartyTask = updatedParty;
  }




  const handleCampaginData = async () => {
    handleGuidAdd(UUID)
    try {
      await validationSchema.validate({
        campaignName,
        campaignDescription,
        taxadmin,
        category
      }, { abortEarly: false });
      setLoading(true);
      const res = await axios.post(URL + '/api/Transation/CreateCampaign', {
        Flag: "A",
        CampaignMast: {
          CompanyId: CompanyId,
          Name: campaignName,
          Description: campaignDescription,
          ProjectId: projectname,
          CategoryId: category,
          SubCategoryId: taxadmin,
          ProcessId: selectedprocess,
          FromDate: startdate,
          ToDate: enddate,
          IsActive: true,
          CustId: CusId,
          // IPAddress: null,
          UserId: UserId,
          // UserName: "Henry",
          ServerName: null,
          EntryTime: null,
          Cguid: UUID,
          UserName: UserName,
          IPAddress: ipaddress
        },
        CampaignDetail: selectedPartyTask
      }, {
        headers: { Authorization: `bearer ${token}` }
      })
      if (res.data.Success == true) {
        fetchData()
        fetchDetailsData()
        resetData()
        onHide()
        setNextButtonClicked(false);
        // if (getProjectData) {
        //   getProjectData()
        // }
        notification.success({
          message: 'Data Added Successfully !!!',
          placement: 'bottomRight', // You can adjust the placement
          duration: 1, // Adjust the duration as needed
        });
      }
    } catch (error) {
      console.log(error, "error")
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
            handleCampaginData();
        }
    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [campaignName,campaignDescription,projectname,category,taxadmin,selectedprocess,startdate,enddate,UserId,UserName, insertSelectedParty]); // Add any other dependencies as needed

  //  project name dropdown
  const getProjectNameData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/ProjectList?CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setGetProjectData(res.data)
      // console.log(res.data, "ooooooo")
      // console.log(res.data[0].Id, "project")
      ProjectID = res.data[0].Id;
      if (!rowData) {
        setProjectname(ProjectID)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const fetchIPAddress = async () => {
    try {
      const res = await axios.get('https://api.ipify.org/?format=json', {
      });
      setIpAddress(res.data.ip)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    getProjectNameData()
    getCategoryData()
    getTaxadmindata()
    getProcessData()
    fetchIPAddress()
  }, [])


  const projectOptions = getprojectdata.map((display) => ({
    value: display.Id,
    label: display.ProjectName,
  }));
  // category dropdown
  const getCategoryData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      // console.log(res, "res")
      setGetcategorydata(res.data);
      // console.log(res.data, "categoryDAta");
    } catch (error) {

    }
  };
  const handleCategoryChange = (selected) => {
    setCategory(selected ? selected.value : '');
    setTaxadmin("");
    setSelectedProcess("");
    // setIsSubCategorySelected(false); // Allow changes to Sub-Category
    if (errors.category) {
      setErrors((prevErrors) => ({ ...prevErrors, category: '' }));
    }
  };

  const categoryFilter = getcategorydata.filter((display) => display.ProjectID == projectname || display.ProjectID == 0);
  // console.log(categoryFilter,"categoryFiltercategoryFilter")
  const categoryOptions = categoryFilter.map((display) => ({
    value: display.Id,
    label: display.CategoryName,
  }));

  // sub category dropdown
  const handleSubCategoryChange = (selected) => {
    setTaxadmin(selected ? selected.value : '');
    setSelectedProcess("");
    setIsSubCategorySelected(true); // Sub-Category is now selected
    if (errors.taxadmin) {
      setErrors((prevErrors) => ({ ...prevErrors, taxadmin: '' }));
    }
  };
  const subfilter = gettaxadmindata.filter((display) => display.CategoryId === category);
  // console.log(subfilter, "subfilter")
  const taxadminOptions = subfilter.map((display) => ({
    value: display.Id,
    label: display.Heading,
  }));

  const getTaxadmindata = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/TaxadminList?CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setGettaxadmindata(res.data);
      // console.log(res.data, "sub-categoryDAta");
    } catch (error) {
      // Handle error
    }
  };
  // process name dropdown
  const getProcessData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/ProcessList?CompanyId=${CompanyId}`, {
        headers: { Authorization: `bearer ${token}` }
      })
      setProcessList(res.data)
      // console.log(res.data,"uuuuuu")
    } catch (error) {
      console.log(error, "error")
    }
  }
  const processFilter = processlist.filter((display) => display.SubCategoryID === taxadmin);
  const ProcessOption = processFilter.map((display) => ({
    value: display.Id,
    label: display.ProcessName,
  }));
  const Address = (rowData) => {
    const address = rowData.Add1 || rowData.Add2 || rowData.Add3 ? (rowData.Add1 + ',' + rowData.Add2 + ',' + rowData.Add3 + ',' + (rowData.Code == null ? '' : rowData.Code)) : 'No Data'
    return address
  }
  const columns = [
    {
      title: 'Party Name',
      dataIndex: 'PartyName',
      width: 250,
      sorter: (a, b) => a.PartyName.localeCompare(b.PartyName),

    },
    {
      title: 'Legal Name',
      dataIndex: 'LegelName',
      width: 180
    },
    {
      title: 'Mobile',
      // dataIndex: 'Mobile1',
      width: 120,
      render: ((record) =>
        <>
          <span>{`+${record.Mobile1}`}</span>
        </>
      )
    },
    {
      title: 'Address',
      render: Address,
      width: 400
    },
    // {
    //     title:'Area Name',
    //     key: 'AreaName',
    //     width:180
    //     // render:assignByTemplate,
    // },

    {
      title: 'State Name',
      dataIndex: 'StateName',
      width: 120
      // render:assignToTemplate,
    },
    {
      title: 'City',
      dataIndex: 'CityName',
      width: 120
      // render:assignToTemplate,
    },
    // ... (other columns)
  ];
  const onSelectionChange = (e) => {
    setSelectedRows(e.value);
  };
  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const onFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const [importexcel, setImportExcel] = useState(false)
  const [importData, setImportData] = useState([])

  const handleimportData = (data) => {
    setImportData(data)
  }

  useEffect(() => {
    if (importData) {
      setData([...data, ...importData])
    }
  }, [importData])
  return (
    <div>
      <div>
        <section className="content-header" style={{ width: '100%' }}>
          <div className='form-heading'>
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Add Campaign</h1>
            </div>
          </div>
          <div >
            <button type="button" className="close ml-auto " aria-label="Close" onClick={onHide} style={{ color: "black", marginTop: "-15px" }} >
              <span aria-hidden="true"  >&times;</span>
            </button>
          </div>
        </section>
        <div className='row p-3 ' >
          <div className='col-sm-12' style={{ border: "2px solid cadetblue", borderRadius: "29px" }}>

            {nextButtonClicked ? (
              <div className='lobicard all_btn_card ' id='lobicard-custom-control2' data-sortable='true'>
                {/* <div>
                  <i class="fa fa-long-arrow-left" onClick={handleCancelClick}></i>
                </div>
                <label className="mt-3">Party :</label>
                <h3 className="Add-party-heading" onClick={handlepartyClick}>
                  Add Party
                </h3> */}
                {/* <div className="input-group badge-outer"> */}
                {/* <Space wrap>
                        <Tooltip title="Import Excel" >
                          <LuImport className='import-icon' />
                          <input type="file"
                           onChange={(e) => {
                            const file = e.target.files[0];
                            readExcel(file);
                          }}
                           />
                        </Tooltip>
                      </Space> */}
                {/* {selectedParties.map((party) => (
                    <Badge key={party.PartyId} className='badge-tag'>

                      {party.PartyName}
                    </Badge>
                  ))} */}

                {/* <Paginator
        first={first}
        rows={rows}
        totalRecords={data.length}
        onPageChange={onPageChange}
      /> */}
                {/* </div> */}
                <div className="mt-4">
                  {/* <button className="btn btn-success mr-4" type="button">
                    Submit
                  </button> */}

                </div>
                <div>

                  {
                    partySubmit == true ? (
                      <ImportCampagin
                        setPartySubmit={setPartySubmit}
                        selectedParties={selectedRows}
                        totalInput={totalInput}
                        handleCampaginData={handleCampaginData}
                        onSelectParty={handleSelectedParty}
                        loading={loading}
                      />
                    ) : (
                      <div>
                        <div className='selected-party-section-main'>
                          <div>
                            <InputText
                              type="search"
                              onInput={onFilterChange}
                              placeholder="Search Party"
                            />
                          </div>
                          <div className='selected-party'>
                            <span>{`Selected Party :${selectedRows.length}`}</span>
                            <button className='import-excel-campagin' onClick={() => { setImportExcel(true) }}><CiImport size={15} />Import Excel</button>

                          </div>
                        </div>
                        {
                          importexcel ? (
                            <CampaignRecord setImportExcel={setImportExcel} onImportData={handleimportData} />
                          ) : null
                        }
                        <DataTable
                          value={data}
                          selection={selectedRows}
                          onSelectionChange={onSelectionChange}
                          paginator
                          rows={rows}
                          first={first}
                          totalRecords={data.length}
                          onPage={onPageChange}
                          style={{ width: '100%' }}
                          rowsPerPageOptions={[5, 10, 20]}
                          globalFilter={globalFilter}
                        >
                          <Column selectionMode="multiple" style={{ width: '3em' }} />
                          {/* Your existing columns */}
                          <Column field="PartyName" header="Party Name" />
                          <Column field="LegelName" header="Legal Name" />
                          <Column field="Mobile1" header="Mobile" />
                          <Column field="StateName" header="State Name" />
                          <Column field="CityName" header="City" />
                        </DataTable>
                        <Button className='ml-3' onClick={() => setPartySubmit(true)}  disabled={selectedRows.length === 0}>Next</Button>
                        <Button className='btn btn-danger ml-3' onClick={handleCancelClick}>Back</Button>
                      </div>
                    )
                  }
                </div>
                {/* <div className='selected-parties-count'>
                  <span className='number-party'>Selected Party</span>
                  {selectedRows.length > 0 && (
                    <Badge className='badge-tag-to'>
                      {selectedRows.length}
                    </Badge>
                  )}
                </div> */}
              </div>
            ) : (
              <form >
                <div className="lobicard all_btn_card campagin-form" id="lobicard-custom-control1" data-sortable="true">
                  <div className='col-sm-12 '>
                    <Row >
                      <Col lg={6} className=' ' >
                        <div className='from-group campaginAdd-grp  '>
                          <label className='mt-3'>Campaign Name: <span className='text-danger'>*</span> </label>
                          <input
                            type="text"
                            className="form-control w-100"
                            placeholder="Enter Campaign Name"
                            value={campaignName}
                            onChange={(event) => {
                              const input = event.target.value;
                              const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                              setCampaignName(firstCapital)
                              if (errors.campaignName) {
                                setErrors(prevErrors => ({ ...prevErrors, campaignName: '' }));
                              }
                            }} />
                          {errors.campaignName && <div className="error-message text-danger">{errors.campaignName}</div>}
                        </div>
                      </Col>
                      <Col lg={6} className=' '>
                        <div className='from-group  w-100 '>
                          <label className='mt-3'>Campaign Description :<span className='text-danger'>*</span> </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Description"
                            value={campaignDescription}
                            onChange={(event) => {
                              const input = event.target.value;
                              const firstCapital = input.charAt(0).toUpperCase() + input.slice(1);
                              setCampaignDescription(firstCapital)
                              if (errors.campaignDescription) {
                                setErrors(prevErrors => ({ ...prevErrors, campaignDescription: '' }));
                              }
                            }} />
                          {errors.campaignDescription && <div className="error-message text-danger">{errors.campaignDescription}</div>}
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg={6} className=' '>
                        <div className="form-group mt-3  ">
                          <label>Project Name :<span className='text-danger'>*</span></label>
                          <div className='d-flex'>
                            <Select
                              className='w-100'
                              options={projectOptions}
                              value={projectname ? projectOptions.find((option) => option.value === projectname) : null}
                              onChange={(selected) => {
                                setProjectname(selected ? selected.value : '')
                                setSelectedProcess('')
                                setTaxadmin('')
                                setCategory('')
                                if (errors.projectname) {
                                  setErrors(prevErrors => ({ ...prevErrors, projectname: '' }));
                                }
                              }}
                              placeholder="Select Project"
                            />
                          </div>
                        </div>
                      </Col>
                      <Col lg={6} className=' '>
                        <div className="form-group mt-3 ">
                          <label>Category Name :<span className='text-danger'>*</span></label>
                          <div className='d-flex'>
                            <Select
                              className="w-100"
                              options={categoryOptions}
                              value={category ? categoryOptions.find((option) => option.value === category) : null}
                              onChange={handleCategoryChange}
                              placeholder="Select Category"
                            />
                          </div>
                          {errors.category && <div className="error-message text-danger">{errors.category}</div>}
                        </div>
                      </Col>
                      <Col lg={6} className=' '>
                        <div className="form-group ">
                          <label >Sub-Category Name :<span className='text-danger'>*</span></label>
                          <div className='d-flex'>
                            <Select
                              className="w-100"
                              options={taxadminOptions}
                              value={taxadmin ? taxadminOptions.find((option) => option.value === taxadmin) : null}
                              onChange={handleSubCategoryChange}
                              placeholder="Select Sub-Category"
                            />
                          </div>
                          {errors.taxadmin && <div className="error-message text-danger">{errors.taxadmin}</div>}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group ">
                          <label>Porcess Name :</label>
                          <div className='d-flex'>
                            <Select
                              className="w-100"
                              options={ProcessOption}
                              value={selectedprocess ? ProcessOption.find((option) => option.value === selectedprocess) : null}
                              onChange={(selected) => {
                                setSelectedProcess(selected ? selected.value : "")
                              }}
                              placeholder="Select Process Name"
                            />
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group ">
                          <label>Start Date :<span className='text-danger'>*</span></label>
                          <div className='d-flex'>
                            <input
                              type="date"
                              className="form-control"
                              value={startdate}
                              onChange={(event) => { setStartDate(event.target.value) }}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="form-group ">
                          <label>End Date :<span className='text-danger'>*</span></label>
                          <div className='d-flex'>
                            <input
                              type="date"
                              className="form-control"
                              value={enddate}
                              onChange={(event) => { setEndDate(event.target.value) }}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className='Footer-btn '>
                    {!nextButtonClicked && (
                      <Button className=' ml-3  ' type="button" onClick={handleNextButtonClick}>
                        Next
                      </Button>
                    )}
                    <button type='button' className='btn btn-danger  ml-3' onClick={onHide} > Cancel </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
      <Drawer
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        visible={isDrawerOpen}
        width="84vw"
        maskClosable={false}
      >
        <section className="content-header model-close-btn" style={{ width: '100%' }}>
          <div className='form-heading'>
            <div className="header-icon">
              <i className="fa fa-users" />
            </div>
            <div className="header-title">
              <h1>Party</h1>
            </div>
          </div>
          <div className='close-btn'>
            <i class="fa fa-long-arrow-left" onClick={handlePartyClose}></i>
          </div>
        </section>
        <input
          type="checkbox"
          id="selectAll"
          checked={selectAllChecked}
          onChange={handleSelectAllChange}
          style={{ marginLeft: '34px', width: '20px', height: '14px' }}
        />
        <label htmlFor="selectAll" style={{ marginLeft: '10px', fontSize: "20px" }}>
          Select All
        </label>

        <ul>
          {partyList.map((party) => (
            <li key={party.PartyId} className="party-list">
              <input
                className="checkbox-party"
                type="checkbox"
                id={party.PartyId}
                name="party"
                checked={selectAllChecked || selectedParties.some((p) => p.PartyId === party.PartyId)}
                onChange={() => handleCheckboxChange(party.PartyId, party.PartyName)}
              />
              <label htmlFor={party.PartyId} style={{ marginLeft: '10px' }}>
                {party.PartyName}
              </label>
            </li>
          ))}
        </ul>

      </Drawer>
    </div>
  );
}

export default CamoaignForm;
