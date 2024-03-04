import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import FirmForm from './FirmForm';

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
            <FirmForm rowData={selectedRow} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
const FirmTable = ({insertData,searchinput}) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    const [data, setData] = useState([])
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    const CustId = localStorage.getItem('CRMCustId')
    const [editshow, setEditShow] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            position: ['bottomCenter']
        },
    });


    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/AdminFirmList?CustId=${CustId}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            // console.log(res, 'response firmmmm')
            setData(res.data);
            // console.log(res.data, "crespose")
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        return (
            item.FirmName.toLowerCase().includes(searchTermLowerCase) ||
            item.PAN?.toLowerCase().includes(searchTermLowerCase) ||
            item.GST?.toLowerCase().includes(searchTermLowerCase) ||
            item.Mobile1?.toLowerCase().includes(searchTermLowerCase) ||
            item.Mobile2?.toLowerCase().includes(searchTermLowerCase) 
        );
    });
    const updatedata = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/FirmListById?FirmId=${id}`, {
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
            const res = await axios.get(URL + `/api/Master/DeleteFirm?FirmId=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchData();
        } catch (error) {
            // console.log(error)
        }
    }
    return (
        <div>
            <div>
                <div className="table-responsive">
                    <table id="dataTableExample1" className="table table-bordered table-striped table-hover  text-nowrap text-center">
                        <thead className="back_table_color">
                            <tr className=" back-color info">
                                <th>#</th>
                                <th>Firm Name</th>
                                <th>FirmType</th>
                                <th>Address</th>
                                <th>Area Name</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Phone No.</th>
                                <th>Mobile No.</th>
                                <th>Email</th>
                                <th>PAN</th>
                                <th>GST</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td className='data-index'>{index + 1}</td>
                                    <td>{item.FirmName}</td>
                                    <td>{item.FirmType}</td>
                                    <td>{`${item.Add1},${item.Add2},${item.Add3}`}</td>
                                    <td>{item.AreaName}</td>
                                    <td>{item.CityName}</td>
                                    <td>{item.StateName}</td>
                                    <td>{`${item.Phone1} / ${item.Phone2}`}</td>
                                    <td>{`${item.Mobile1} / ${item.Mobile2}`}</td>
                                    <td>{item.Email}</td>
                                    <td>{item.PAN}</td>
                                    <td>{item.GST}</td>
                                    <td className='w-10'>
                                        <div className='action-btn'>
                                            <button type="button" className="btn btn-add btn-sm" data-toggle="modal" data-target="#customer1" onClick={() => { updatedata(item.FirmId) }}><i className="fa fa-pencil" /></button>
                                            <button type="button" className="btn btn-danger btn-sm" data-toggle="modal" data-target="#customer2"><i className="fa fa-trash-o" onClick={() => { showAlert(item.FirmId) }} /> </button>
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
        </div>
    )
}

export default FirmTable