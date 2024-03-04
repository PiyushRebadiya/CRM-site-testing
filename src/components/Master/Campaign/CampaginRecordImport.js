import React from 'react'
import { useState } from 'react';
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { notification } from "antd";


const CampaginRecordImport = ({ setImportExcel, onImportData }) => {
    const [isOpen, setIsOpen] = useState(true)
    // const [importedData, setImportedData] = useState([]); // State variable to store imported data

    function onClose() {
        setIsOpen(false)
        setImportExcel(false)
    }
    const onSubmit = (data) => {
        // Handle the imported data
        // setImportedData(data.validData);
        // console.log('Imported Data:', data.validData );
        onImportData(data.validData)
        // Close the import modal
        setIsOpen(false);
        setImportExcel(false);

        // Show success notification
        notification.success({
            message: 'Party Added Successfully !!!',
            placement: 'bottomRight',
            duration: 1,
        });
    };
    const fields = [
        {
            label: "PartyName",
            key: "PartyName",
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
            label: "Mobile3",
            key: "Mobile3",
            fieldType: {
                type: "input"
            },
        },
        {
            label: "Mobile4",
            key: "Mobile4",
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
                fields={fields}
                onSubmit={onSubmit}
            />
            {/* {importedData && (
        <div>
            <h2>Imported Data:</h2>
            <pre>{JSON.stringify(importedData, null, 2)}</pre>
        </div>
    )} */}
        </div>
    )
}

export default CampaginRecordImport