import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Setting from './Setting';

function EditData(props) {
    const { selectedRow, fetchData } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Setting rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}

const SettingTable = ({ insertData, searchinput }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    const CustId = localStorage.getItem('CRMCustId')
    const companyId = localStorage.getItem('CRMCompanyId')
    const [editshow, setEditShow] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/SettingList?CompanyId=${companyId}&TransMode=Proforma`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setData(res.data);
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const updatedata = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/SettingById?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            setSelectedRow(res.data);
            setEditShow(true)

        } catch (error) {
            console.log(error)
        }
    }

    const showAlert = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData(id)
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'No changes have been made.', 'error');
            }
        });
    };

    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteSetting?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData();
        } catch (error) {
            // console.log(error)
        }
    }

    return (
        <div>
            <div className="table-responsive">
                <table id="dataTableExample1" className="table table-bordered table-striped table-hover  text-nowrap text-center">
                    <thead className="back_table_color">
                        <tr className=" back-color info">
                            <th>#</th>
                            <th>Prefix</th>
                            <th>Remark 1</th>
                            <th>Remark 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className='data-index'>{index + 1}</td>
                                <td>{item.Prefix}</td>
                                <td>{item.Remark1}</td>
                                <td>{item.Remark2}</td>
                                <td className='w-10'>
                                    <div className='action-btn'>
                                        <button type="button" className="btn btn-add btn-sm" data-toggle="modal" data-target="#customer1"><i class="fa fa-eye" aria-hidden="true"></i></button>
                                        <button type="button" className="btn btn-add btn-sm" data-toggle="modal" data-target="#customer1" onClick={() => { updatedata(item.Id) }}><i className="fa fa-pencil" /></button>
                                        <button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#customer2"><i className="fa fa-trash-o" onClick={() => { showAlert(item.Id) }} /> </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    selectedRow ?
                        <EditData
                            show={editshow}
                            onHide={() => setEditShow(false)}
                            selectedRow={selectedRow}
                            fetchData={fetchData}
                        /> : null
                }
            </div>
        </div>
    )
}

export default SettingTable