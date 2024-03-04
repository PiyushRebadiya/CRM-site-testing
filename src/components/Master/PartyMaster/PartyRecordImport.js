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
    const MobileNumber = (data) => {
        if (data?.length == 10) {
            return `91${data}`
        }
        return data
    }
    const MobileNumber1 = (data) => {
        if (data?.length == 10) {
            return `91${data}`
        }
        return data
    }
    const onSubmit = async (data) => {
        const dataImport = data.validData
        try {
            for (const display of dataImport) {
                const dataToImport = {
                    PartyName: display.PartyName,
                    Add1: display.Add1,
                    Add2: display.Add2,
                    Add3: display.Add3,
                    Mobile1: MobileNumber(display.Mobile1),
                    Mobile2: MobileNumber1(display.Mobile2),
                    TraceId: display.TraceId,
                    TracePassword: display.TracePassword,
                    GSTId: display.GSTId,
                    GSTPassword: display.GSTPassword,
                    IncomTaxId: display.IncomTaxId,
                    IncomTaxPassword: display.IncomTaxPassword,
                    CustId: custId,
                    Email: display.Email,
                    Email1: display.Email1,
                    ContactPerson: display.ContactPerson,
                    Partner: display.Partner,
                    LegelName: display.LegelName,
                    CompanyCINNo: display.CompanyCINNo,
                    GSTFileNo: display.GSTFileNo,
                    ITFileNo: display.ITFileNo,
                    GST: display.GST,
                    PAN: display.PAN,
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
                // setTimeout(async () => {
                //     const res = await axios.post(
                //         URL + "/api/Master/CreateParty", dataToImport,
                //         {
                //             headers: { Authorization: `bearer ${token}` },
                //         }
                //     );
                // }, 400)
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
            label: "PartyName",
            key: "PartyName",
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
        {
            label: "Mobile2",
            key: "Mobile2",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Email",
            key: "Email",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Email1",
            key: "Email1",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Contact Person",
            key: "ContactPerson",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Partner",
            key: "PartnerId",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "LegelName",
            key: "LegelName",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "CIN No",
            key: "CompanyCINNo",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "GST File No",
            key: "GSTFileNo",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "IT File No",
            key: "ITFileNo",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "GST No",
            key: "GST",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "PAN No",
            key: "PAN",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Deductor User Password",
            key: "TracePassword",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "GSTUsername",
            key: "GSTId",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "GSTPassword",
            key: "GSTPassword",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "IncomTaxId",
            key: "IncomTaxId",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "IncomTaxPassword",
            key: "IncomTaxPassword",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "EmployeeName",
            key: "EmpId",
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
