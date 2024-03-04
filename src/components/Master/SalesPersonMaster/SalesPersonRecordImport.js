import React, { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import axios from "axios";
import { notification } from "antd";

export default function Import({ setImportFile, fetchData }) {

    const [isOpen, setIsOpen] = useState(true)
    const userId = localStorage.getItem('CRMUserId')
    const custId = localStorage.getItem('CRMCustId')
    const companyId = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    function onClose() {
        setIsOpen(false)
        setImportFile(false)
    }
    const onSubmit = async (data) => {
        const dataImport = data.validData
        try {
            for (const display of dataImport) {
                const dataToImport = {
                    ServerName: display.ServerName,
                    Add1: display.Add1,
                    Add2: display.Add2,
                    Add3: display.Add3,
                    Mobile1: display.Mobile1,
                    CustId: custId,
                    CompanyID: companyId,
                    UserId: userId,
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
            setImportFile(false)
            notification.success({
                message: 'Data Import Successfully !!!',
                placement: 'bottomRight', // You can adjust the placement
                duration: 1, // Adjust the duration as needed
            });
        } catch (error) {
            console.error(error);
        }
        setIsOpen(false)
    }
    const fields = [
        {
            label: "ServerName",
            key: "ServerName",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Add1",
            key: "Add1",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Add2",
            key: "Add2",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Add3",
            key: "Add3",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Mobile1",
            key: "Mobile1",
            fieldType: {
                type: "input"
            },
        },
    ];

    return (
        <div>
            <ReactSpreadsheetImport
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                fields={fields}
            />
        </div>
    );
}
