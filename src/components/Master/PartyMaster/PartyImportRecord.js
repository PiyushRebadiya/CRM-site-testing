import React from 'react'
import { LuImport,LuRefreshCw } from "react-icons/lu";
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { notification } from 'antd';
import axios from 'axios';
const PartyImportRecord = ({ data, importdata, onHide, fetchData }) => {

    const custId = localStorage.getItem('CRMCustId')
    const CompanyID = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const UserId = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL
    const supportColume = data.reduce((result, obj) => {
        Object.keys(obj).forEach(key => {
            if (!result.includes(key)) {
                result.push(key);
            }
        });
        return result;
    }, []);
    // const selectedSupportValues = [35, 4, 29, 17, 11, 13, 12, 15, 16, 10, 9, 8, 20, 18, 19, 21, 5, 6, 7, 24, 22, 23, 25, 26].map(index => supportColume[index]);
    const selectedSupportValues = [4, 5, 6, 7, 15].map(index => supportColume[index]);
    const selectcolume = selectedSupportValues.map((display) => ({
        value: display,
        label: display,
    }));

    const ExcelColume = importdata.reduce((result, obj) => {
        Object.keys(obj).forEach(key => {
            if (!result.includes(key)) {
                result.push(key);
            }
        });
        return result;
    }, []);
    const handleFileImport = async () => {
        try {
            for (const display of importrecord) {
                const dataToImport = {
                    PartyName: display.PartyName,
                    Add1: display.Add1,
                    Add2: display.Add2,
                    Add3: display.Add3,
                    Mobile1: display.Mobile1,
                    CustId: custId,
                    CompanyID: CompanyID,
                    UserId: UserId,
                    IsActive: true,
                };
                const res = await axios.post(
                    URL + "/api/Master/CreateParty", dataToImport,
                    {
                        headers: { Authorization: `bearer ${token}` },
                    }
                );
            }
            fetchData()
            onHide()
            notification.success({
                message: 'Data Import Successfully !!!',
                placement: 'bottomRight', // You can adjust the placement
                duration: 1, // Adjust the duration as needed
            });
        } catch (error) {
            console.error(error);
        }
    }
    const [importrecord, setImportRecord] = useState(importdata);
    const [isDisable, setIsDisable] = useState([])
    const [selectedcolumnname, setSelectedColumnName] = useState([])
    const [clearvalue, setClearValue] = useState(false)
    const handlecolumselected = (excelColumn, index, selectedcolumn) => {
        setClearValue(false)
        const disableindex = [...isDisable]
        disableindex.push(index)
        setIsDisable(disableindex)
        const selectedColumnName = [...selectedcolumnname]
        selectedColumnName.push(selectedcolumn)
        setSelectedColumnName(selectedColumnName)
        const updatedImportData = importrecord.map((dataObject, i) => {
            // Check if the current object has a key that matches the excelColumn value
            const matchingKey = Object.keys(dataObject).find((key) => excelColumn.includes(key));
            // console.log(unmatchkey,"unmatchkey-unmatchkey")
            // If a matching key is found, update the key name
            if (matchingKey) {
                const updatedObject = { ...dataObject, [selectedcolumn]: dataObject[matchingKey] };
                // Remove the old key if needed
                delete updatedObject[matchingKey];
                return updatedObject;
            }

        });
        setImportRecord(updatedImportData)
    }

    const handleFileReset = () => {
        setImportRecord(importdata)
        setIsDisable([])
        setSelectedColumnName([])
        setClearValue(true)
    }
    return (
        <div>
            <div className='import-btn-data'>
                <Button className="btn btn-add rounded-2 center-icon" onClick={handleFileImport} >
                    <LuImport /><span className='pl-1'>Import Data</span>
                </Button>
                <Button className="btn btn-add rounded-2 center-icon" onClick={handleFileReset} >
                    <LuRefreshCw />
                </Button>
            </div>
            <div className='import-colum-name'>
                <div className="table-responsive d-flex">
                    <table id="dataTableExample1" className="table table-bordered table-striped table-hover  text-nowrap text-center">
                        <thead className="back_table_color">
                            <tr className=" back-color info nowrap">
                                <th>Import Excel ColumnName</th>
                                <th>Support ColumnName</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ExcelColume.map((display, index) => {
                                    return (
                                        <tr>
                                            <td>{display}</td>
                                            <td> <Select
                                                options={selectcolume}
                                                value={clearvalue == true ? null : selectcolume.find((option) => option.value === selectedcolumnname.includes(option.value))}
                                                // value={clearvalue == true ? null : selectcolume.find((option) => selectedcolumnname.includes(option.value))}
                                                placeholder="Select ColumnName"
                                                isDisabled={isDisable.includes(index)}
                                                onChange={(selectedColumn) => { handlecolumselected(display, index, selectedColumn.value) }}

                                            /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PartyImportRecord
