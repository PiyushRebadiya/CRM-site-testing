import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import Swal from 'sweetalert2';

function PreviewImage(props) {
    const { rowData } = props;

    const getFileTypeIcon = () => {
        const fileType = rowData.FileType;
        if (fileType === '.pdf') {
            return <FaFilePdf size={50} />;
        } else if (fileType === '.xlsx') {
            return <FaFileExcel size={50} />;
        }
        // You can add more conditions for other file types as needed
        return null;
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    File Preview
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
                {rowData.FileType === '.pdf' || rowData.FileType === '.xlsx' ? (
                    getFileTypeIcon()
                ) : (
                    <img src={rowData.FilePath + rowData.Filename} alt="" style={{ height: "50%", width: "50%" }} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <a href={rowData.FilePath + rowData.Filename} download="image.jpg" target="_blank">
                    <Button variant="primary">Download</Button>
                </a>
                <Button onClick={props.onHide} className='bg-danger'>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

const DocumentTable = ({ insertData,partyID }) => {
    const [rowData, setRowData] = useState([]);
    const [documentData, setDocumentData] = useState([])
    const [modalShow, setModalShow] = React.useState(false);
    // const [partyId, setPartyId] = useState("");
    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL
    React.useEffect(() => {
        insertData.current = fetchDocument_Data
    }, [])
    const handlePreviewImage = (item) => {
        setRowData(item);
        setModalShow(true)
    }

    const fetchDocument_Data = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GetFileList?PartyId=${partyID}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            setDocumentData(res.data);
        } catch (error) {
            // Handle error
        }
    };
    useEffect(() => {
        fetchDocument_Data()
    }, [])

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
                handleDelete(id)
                Swal.fire('Deleted!', 'Your file has been deleted successfully', 'success');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'No changes have been made.', 'error');
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Master/DeleteImage?Id=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchDocument_Data()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className='p-3'>
                <div className="table-responsive">
                    <table id="dataTableExample1" className="table table-bordered table-striped table-hover  text-nowrap text-center">
                        <thead className="back_table_color">
                            <tr className=" back-color info">
                                <th>#</th>
                                <th>Category</th>
                                <th>File</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentData.map((item, index) => (
                                <tr key={index} className='align_middle'>
                                    <td className='data-index'>{index + 1}</td>
                                    <td>{item.Category}</td>
                                    {/* <td></td> */}
                                    <td>
                                        {item.FileType === '.pdf' ? (
                                            // PDF file
                                            <i className="fa fa-file-pdf-o fa-2x" aria-hidden="true"></i>
                                        ) : item.FileType === '.xlsx' ? (
                                            // EXCL file
                                            /* Add your EXCL file icon or rendering logic here */
                                            <i className="fa fa-file-excel-o fa-2x" aria-hidden="true"></i>
                                        ) : (
                                            // Other file types (assuming it's an image in this case)
                                            <img src={`${item.FilePath + item.Filename}`} alt="" style={{ height: "50px", width: "50px" }} />
                                        )}

                                        {/* <img src={`${item.FilePath + item.Filename}`} style={{ height: "50px", width: "50px" }} /> */}
                                    </td>
                                    <td className='w-10'>
                                        <div className='action-btn'>
                                            <button type="button" className="btn btn-add action_btn btn-sm mr-1 rounded-2" onClick={() => handlePreviewImage(item)}><i class="fa fa-eye" aria-hidden="true"></i></button>
                                            {/* <button type="button" className="btn btn-primary action_btn btn-sm mr-1 rounded-2" >4</button> */}
                                            <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => showAlert(item.Id)}><i className="fa fa-trash-o fs-4" /> </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        rowData ?
                            <PreviewImage
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                rowData={rowData}
                            // onDownload={handleDownload}
                            /> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default DocumentTable