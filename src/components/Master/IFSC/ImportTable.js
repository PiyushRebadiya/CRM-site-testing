import React from 'react'
import { LuImport } from "react-icons/lu";
import { Button } from 'react-bootstrap';
const ImportTable = ({ importfiledata, onHide,importDataformUpload }) => {
    const handleFileImport=()=>{
        importDataformUpload()
        onHide()
    }
    return (
        <div>
            <div className='import-btn-data'>
                <Button className="btn btn-add rounded-2 center-icon" onClick={handleFileImport} >
                <LuImport /><span className='pl-1'>Import Data</span>
                </Button>

            </div>
            <div className="table-responsive ">
                <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className=" back-color  info">
                            <th>#</th>
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>IFSC Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            importfiledata.map((item, index) => {
                                return (
                                    <tr key={index} className='align_middle'>
                                        <td className='data-index'>{index + 1}</td>
                                        <td>{item.BankName}</td>
                                        <td>{item.BranchName}</td>
                                        <td>{item.IFSC}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ImportTable