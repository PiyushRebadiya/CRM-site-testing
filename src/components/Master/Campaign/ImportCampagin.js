import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button } from 'antd';
import axios from 'axios';
import Select from 'react-select'

const ImportCampaign = ({ setPartySubmit, selectedParties, onSelectParty, handleCampaginData, loading }) => {
  // console.log(selectedParties, "selectedParties=========selectedParties")
  const CompnyId = localStorage.getItem('CRMCompanyId')
  const URL = process.env.REACT_APP_API_URL
  const custId = localStorage.getItem('CRMCustId')
  const token = localStorage.getItem('CRMtoken')
  const [selectedUserName, setSelectedUserName] = useState("")
  const [errors, setErrors] = useState([])
  const [UserName, setUserName] = useState([])
  const [rows, setRows] = useState([{ id: 1, AssignTo: '', TaskPercantage: '', total: '' }]);

  const [party, setParty] = useState([])
  const [selectedParty, setSelectedParty] = useState([])
  const [desablerow, setDesableRow] = useState([])

  const totalPercentages = rows.reduce(
    (total, row) => total + parseFloat(row.TaskPercantage) || 0,
    0
  );

  const addRow = () => {
    const currentTotalPercentage = rows.reduce((total, row) => total + parseFloat(row.TaskPercantage) || 0, 0);

    if (currentTotalPercentage < 100) {
      const newRow = {
        id: rows.length > 0 ? rows[rows.length - 1].id + 1 : 1,
        AssignTo: '',
        TaskPercantage: '',
        total: ''
      };
      setRows([...rows, newRow]);
      setErrors(prevErrors => ({ ...prevErrors, addRow: '' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, addRow: 'Total TaskPercantage must be 100% or less' }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPartySubmit(false)
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPartySubmit]);

  const deleteRow = (rowId) => {
    const deletedData = selectedParty.filter((item) => item.id === rowId);
    setParty(PrevParty => [...PrevParty, ...deletedData]);

    const removePartyData = selectedParty.filter((item) => item.id !== rowId);
    setSelectedParty(removePartyData);

    const updatedRows = rows.filter((row) => row.id !== rowId);
    setRows(updatedRows);

    // Remove the deleted row's id from desablerow state
    setDesableRow(prevDesablerow => prevDesablerow.filter(id => id !== rowId));
  };

  const handleInputChange = (rowId, field, value) => {
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, [field]: parsedValue } : row
      );

      const updatedTotalPercentage = updatedRows.reduce(
        (total, row) => total + parseFloat(row.TaskPercantage) || 0,
        0
      );

      if (updatedTotalPercentage <= 100) {
        setRows(updatedRows);
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: 'Total TaskPercantage across rows cannot exceed 100%',
        }));
      }
    } else {
      const newValue = isNaN(parsedValue) ? 0 : Math.min(Math.max(parsedValue, 0), 100);

      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, [field]: newValue } : row
      );
      setRows(updatedRows);

      setErrors(prevErrors => ({ ...prevErrors, [field]: 'Percentage must be between 0 and 100' }));
    }
  };


  useEffect(() => {
    setParty(selectedParties)
  }, [selectedParties])
  useEffect(() => {
    if (selectedParty) {
      onSelectParty(selectedParty)
    }
  }, [selectedParty])

  const calculateTotal = (selectedUserName, rowId) => {
    const currentRow = rows.find((row) => row.id === rowId);
    const totalPercentage = parseFloat(currentRow.TaskPercantage) || 0;

    const total = (selectedParties.length * totalPercentage) / 100;
    let number = Math.round(total)
    if (totalPercentages > 95) {
      number = party.length
    }

    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, total: number, AssignTo: selectedUserName } : row
    );
    hndleFillterPartyData(updatedRows, number, rowId)
    setRows(updatedRows);
    const calculaterow = [...desablerow]
    calculaterow.push(rowId)
    setDesableRow(calculaterow)
    // Disable the "Calculate Total" button if the total is 100% or more
    if (totalPercentage >= 100) {
      setErrors(prevErrors => ({ ...prevErrors, addRow: 'Party is 100% alloted to users.' }));
    }
    return number;
  };
  const hndleFillterPartyData = (updatedRows, count, rowId) => {
    const updatedParty = updatedRows.find((item) => item.id == rowId)
    const croppedArray = party.slice(0, count);
    const updatedArray = croppedArray.map((item) => {
      return {
        ...item,
        ...updatedParty,
      };
    });
    // console.log(updatedArray, "updatedArray-updatedArray")
    setSelectedParty(prevSelectedParty => [...prevSelectedParty, ...updatedArray]);
    const filteredArray = party.filter((item) =>
      !updatedArray.some(updatedItem => updatedItem.PartyName === item.PartyName)
    );
    setParty(filteredArray)
  }

  // const handleCalculateTotal = (selectedUserName, rowId, count) => {
  //   console.log(count, "total")
  //   const total = calculateTotal(rowId);

  //   const updatedRows = rows.map((row) =>
  //     row.id === rowId ? { ...row, total: total, AssignTo: selectedUserName } : row
  //   );

  //   hndleFillterPartyData(updatedRows, count, rowId)
  //   setRows(updatedRows);
  //   console.log(`Total for Row ${rowId}:`, total);

  //   // Disable the "Calculate Total" button if the total is 100% or more
  //   if (totalPercentage >= 100) {
  //     setErrors(prevErrors => ({ ...prevErrors, addRow: 'Total TaskPercantage is already 100%' }));
  //   }
  // };
  const getUserdData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/GetEmpList?CustId=${custId}&CompanyId=${CompnyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      const filteredUsers = res.data.filter(user => user.Role !== 'Admin');
      setUserName(filteredUsers);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getUserdData();
  }, []);

  useEffect(() => {
    // console.log(UserName, "UserName state after update");
  }, [UserName]);
  const UserOptions = UserName.map((display) => ({
    value: display.Id,
    label: display.UserName,
  }));

  return (
    <div className="importCampaign-main" >

      <div className='selected-party-count-section'>
        <span>Selected Party : <b>{selectedParties.length}</b></span>

      </div>
      <Button onClick={addRow} style={{ marginRight: '10px', marginBottom: "15px" }}>
        Add Row
      </Button>
      {errors.addRow && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{errors.addRow}</div>
      )}
      {rows.map((row) => (
        <Row gutter={[16, 16]} key={row.id}>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <label >UserName</label>
            <Select
              type="text"
              options={UserOptions}
              placeholder="Select UserName"
              isDisabled={desablerow.includes(row.id)}
              value={UserName.find((user) => user.Id === row.selectedUserName)}
              onChange={(selected) => {
                setSelectedUserName(selected.value);
                if (errors.selectedUserName) {
                  setErrors(prevErrors => ({ ...prevErrors, selectedUserName: '' }));
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <label>Percentage</label>
            <input
              className='form-control'
              placeholder="%"
              type="number"
              value={row.TaskPercantage}
              readOnly={desablerow.includes(row.id)}
              onChange={(e) => handleInputChange(row.id, 'TaskPercantage', e.target.value)}
              disabled={totalPercentages >= 100}

            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <label>Total</label>
            <input
              className='form-control'
              placeholder="Total"
              value={row.total}
              readOnly
            />
          </Col>
          <Col xs={24} sm={12} md={8} style={{ marginTop: '30px' }}>
            <Button
              // onClick={() => handleCalculateTotal(selectedUserName, row.id, row.total)}
              onClick={() => calculateTotal(selectedUserName, row.id)}
              disabled={desablerow.includes(row.id)}
              style={{ marginRight: '10px' }}
            >
              Calculate Total
            </Button>
            {rows.length > 1 && (
              <Button onClick={() => deleteRow(row.id)}>Delete</Button>
            )}
          </Col>
        </Row>
      ))}
      <div>
        <button type='button' className='btn btn-success  ml-3 mt-4' onClick={handleCampaginData} disabled={loading}>
          {loading ? 'Saving...' : 'Save [F9]'}
        </button>
        <button type='button' className='btn btn-danger  ml-3 mt-4' onClick={() => { setPartySubmit(false) }}>
          Back
        </button>

      </div>
    </div>
  );
};

export default ImportCampaign;
