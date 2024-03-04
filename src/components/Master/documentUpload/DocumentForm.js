// import React from 'react'
// import { useState, useEffect } from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import axios from 'axios';
// import { notification } from 'antd';
// import { AiOutlineCloudUpload } from 'react-icons/ai';
// import Select from 'react-select'


// const DocumentForm = ({ onHide, rowData }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [selectedName, setSelectedName] = useState("");
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [companyid, setCompanyId] = useState("")
//     const [partyId, setPartyId] = useState("")
//     const [category, setCategory] = useState("")

//     const [categorydata, setGetcategorydata] = useState([])
//     const CustId = localStorage.getItem("CRMCustId")
//     const token = localStorage.getItem('CRMtoken')
//     const companyId = localStorage.getItem('CRMCompanyId')
//     const URL = process.env.REACT_APP_API_URL
//     // const handleFileChange = (event) => {
//     //     const file = event.target.files[0];
//     //     setSelectedFile(file);
//     //     setSelectedName(file.name);
//     // };

//     useEffect(() => {
//         console.log(rowData, 'document')
//         if (rowData) {
//             setCompanyId(rowData.CompanyId)
//             setPartyId(rowData.PartyId)
//         }
//     }, [rowData])
//     const handleFileChange = (event) => {
//         const files = event.target.files;
//         console.log(files, "files")
//         const fileNames = Array.from(files).map(file => file.name);
//         setSelectedFiles(fileNames);
//     };

//     const getCategorydata = async () => {
//         try {
//             const res = await axios.get(URL + `/api/Master/CategoryList?CompanyID=${companyId}`, {
//                 headers: { Authorization: `bearer ${token}` },
//             });
//             setGetcategorydata(res.data);
//             console.log(res, "catrespose")
//         } catch (error) {
//             // Handle error
//         }
//     };
//     useEffect(() => {
//         getCategorydata();
//     }, []);
//     const categoryOptions = categorydata.map((display) => ({
//         value: display.Id,
//         label: display.CategoryName,
//     }));

//     // const DataSubmit = async () => {
//     //     console.log(selectedFiles, "selectedName")
//     //     const formData = new FormData();
//     //     // formData.append('images', selectedFiles);
//     //     selectedFiles.forEach((file, index) => {
//     //         formData.append(`Filename[${index}]`, file);
//     //     });
//     //     formData.append('CategoryId', category);
//     //     formData.append('PartyId', partyId);
//     //     formData.append('CompanyId', companyid);
//     //     try {
//     //         const res = await axios.post(URL + '/api/Master/FileUploads', formData, {
//     //             headers: { Authorization: `bearer ${token}` }
//     //         })
//     //         console.log(res.data, "datasubmit")
//     //         if (res.data.Success == true) {
//     //             onHide();
//     //             notification.success({
//     //                 message: 'Data Added Successfully !!!',
//     //                 placement: 'top',
//     //                 duration: 1
//     //             });
//     //         }
//     //     } catch (error) {
//     //         console.log(error, "error")
//     //     }

//     // }
//     const DataSubmit = async () => {
//         console.log('Submitting data...');
//         console.log('Selected Files:', selectedFiles);
//         console.log('Category:', category);
//         console.log('PartyId:', partyId);
//         console.log('CompanyId:', companyid);

//         const formData = new FormData();
//         selectedFiles.forEach((file, index) => {
//             formData.append(`Filename[${index}]`, file);
//         });
//         formData.append('CategoryId', category);
//         formData.append('PartyId', partyId);
//         formData.append('CompanyId', companyid);

//         try {
//             const res = await axios.post(URL + '/api/Master/FileUploads', formData, {
//                 headers: { Authorization: `bearer ${token}` }
//             });
//             console.log('API response:', res.data);

//             // 18/10/2023- change the response to true when Api is fixed
//             if (res.data.Success === false) {
//                 onHide();
//                 notification.success({
//                     message: 'Data Added Successfully !!!',
//                     placement: 'top',
//                     duration: 1
//                 });
//             }
//         } catch (error) {
//             console.error('Error submitting data:', error);
//         }
//     }
//     return (
//         <div>
//             <div className='form-border'>
//                 <section className="content-header model-close-btn " style={{ width: "100%" }}>
//                     <div className='form-heading'>
//                         <div className="header-icon">
//                             <i className="fa fa-users" />
//                         </div>
//                         <div className="header-title">
//                             <h1>Upload Documents</h1>
//                         </div>
//                     </div>
//                     <div className='close-btn'>
//                         <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>
//                 </section>
//                 <div className="">
//                     <div className="container">
//                         <div className=" row lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
//                             <div className="col-lg-6">
//                                 <div className="form-group">
// <div className="form-group">
//     <label>Category :</label>
//     <Select
//         className='w-100'
//         options={categoryOptions}
//         value={categoryOptions.find((option) => option.value == category)}
//         onChange={(selected) => {
//             setCategory(selected.value)
//         }}
//         placeholder="Select Category"
//     />

//                                     </div>
//                                     {/* <label>Document :</label>
//                                     <input type='file' className="form-control"/> */}
//                                     <div className='file-upload-document'>
//                                         <div className="parent">
//                                             <div className="file-upload">
//                                                 <AiOutlineCloudUpload style={{ fontSize: "30px" }} />
//                                                 <h3>Upload Document</h3>
//                                                 <p>Maximun file size 10mb</p>
//                                                 <input type="file" onChange={handleFileChange} multiple />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <strong>Selected Files:</strong>
//                                             <ul>
//                                                 {selectedFiles.map((fileName, index) => (
//                                                     <li key={index}>{fileName}</li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="reset-button">
//                                 <button className="btn btn-danger m-2" onClick={onHide}> Cancel</button>
//                                 <button className="btn btn-success m-2" onClick={DataSubmit}>Upload</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DocumentForm

// --------------------------------------------------------------------------------------------------------------------------------------------------------

import React from 'react'
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { notification } from 'antd';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Select from 'react-select'
import DocumentTable from './DocumentTable';
import * as Yup from 'yup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required."),
})

const ImageViewModal = ({ show, onHide, imageUrl, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>File Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    imageUrl.includes('data:image') ? (<img src={imageUrl} alt="Preview" style={{ width: '100%' }} />) : (
                        imageUrl.includes('pdf') || imageUrl.endsWith('.pdf') ? (
                            <div className='text-center'>
                                <FaFilePdf size={90} />
                            </div>
                        ) : (imageUrl.includes('sheet') || imageUrl.endsWith('.xls') || imageUrl.endsWith('.xlsx') ? (<div className='text-center'>
                            <FaFileExcel size={90} />
                        </div>
                        ) : null)
                    )
                }

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => onDelete(imageUrl)}>
                    Delete
                </Button>
                <a href={imageUrl} download="image.jpg">
                    <Button variant="primary">Download</Button>
                </a>
            </Modal.Footer>
        </Modal>
    );
};

const DocumentForm = ({ onHide, rowData, partyID }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [companyid, setCompanyId] = useState("")
    const [partyId, setPartyId] = useState("")
    const [partyName, setPartyName] = useState("")
    const [category, setCategory] = useState("")
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    const insertData = React.useRef(null);

    useEffect(() => {
        if (rowData) {
            setCompanyId(rowData.CompanyId)
            setPartyId(rowData.PartyId)
            setPartyName(rowData.PartyName)
        }
    }, [rowData])

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const [filename, setFileName] = useState("")
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const updatedFiles = [...selectedFiles, ...files];
        setSelectedFiles(updatedFiles);

        const newNames = files.map((file) => file.name);
        const updatedNames = [...filename, ...newNames];
        setFileName(updatedNames)

        // setFileName(updatedNames);
        // Create an array to store file previews
        const previews = [];
        for (const file of updatedFiles) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previews.push(e.target.result);
                if (previews.length === updatedFiles.length) {
                    // Set the image previews state after all URLs are generated
                    setFilePreviews(previews);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (deletedImageUrl) => {
        const deletedFileIndex = filePreviews.findIndex((preview) => preview === deletedImageUrl);

        if (deletedFileIndex !== -1) {
            // Remove the file from updatedFiles at the found index
            const updatedFiles = [...selectedFiles.slice(0, deletedFileIndex), ...selectedFiles.slice(deletedFileIndex + 1)];
            setSelectedFiles(updatedFiles);
        }
        const updatedPreviews = filePreviews.filter((preview) => preview !== deletedImageUrl);
        setFilePreviews(updatedPreviews);
        setShowImageModal(false);
    };

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                // companyName,
                category,
            }, { abortEarly: false });

            const formData = new FormData();
            selectedFiles.forEach((file, index) => {
                formData.append(`Filename[${index}]`, file);
            });
            // formData.append('Filename', selectedFiles);
            formData.append('CategoryId', category);
            formData.append('PartyId', partyId);
            formData.append('CompanyId', companyid);
            const res = await axios.post(URL + '/api/Master/FileUploads', formData, {
                headers: { Authorization: `bearer ${token}` }
            });

            if (res.data.Success === false) {
                insertData.current()
                setFilePreviews([])
                setSelectedFiles([])
                setCategory('')
                notification.success({
                    message: 'Document Upload Successfully !!!',
                    placement: 'top',
                    duration: 1
                });
            }
        } catch (error) {
            const validationErrors = {};
            if (error.inner && Array.isArray(error.inner)) {
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
        }
    }
    return (
        <div>
            <div className='form-border'>
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Upload Documents</h1>
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
            </div >

            {/* <Tabs
                defaultActiveKey="form"
                id="uncontrolled-tab-example"
                className="mb-3"
            > */}
            {/* <Tab eventKey="form" title="Upload Document"> */}
            <div className="">
                <div className="container">
                    <div className=" row lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                        <Row>
                            <Col lg={6}>
                                <div className="form-group">
                                    <label>Party Name :</label>
                                    <input type="text" className="form-control" value={partyName} disabled />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="form-group">
                                    <label> Document Category :<span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control" value={category} onChange={(event) => {
                                        setCategory(event.target.value)
                                        if (errors.category) {
                                            setErrors(prevErrors => ({ ...prevErrors, category: '' }));
                                        }
                                    }} placeholder='Enter Document Category' />
                                    {errors.category && <div className="error-message text-danger">{errors.category}</div>}
                                </div>
                            </Col>
                        </Row>
                   
                        <Row>
                            <Col>
                                <div className='file-upload-document'>
                                    <div className="parent">
                                        <div className="file-upload">
                                            <AiOutlineCloudUpload style={{ fontSize: "30px" }} />
                                            <h3>Upload Document</h3>
                                            <p>Maximun file size 10mb</p>
                                            <input type="file" onChange={handleFileChange} multiple />
                                        </div>
                                    </div>
                                    <div>
                                        <strong>File Preview:</strong>
                                        <div className="file-preview-container singleLine">
                                            {filePreviews.map((preview, index) => (
                                                <div key={index} onClick={() => handleImageClick(preview)}>
                                                    {preview.includes('data:image') ? (
                                                        <div className='m-1'>
                                                            <img src={preview} alt={`Preview ${index}`} style={{ width: '150px', height: '150px', cursor: 'pointer', padding: "10px" }} />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p>{filename[index]}</p>
                                                            {preview.includes('pdf') || preview.endsWith('.pdf') ? (
                                                                <div className='m-2'>
                                                                    <FaFilePdf size={90} /><br />
                                                                    <a href={preview} target="_blank" rel="noopener noreferrer" download={filename[index]}>
                                                                        Download PDF
                                                                    </a>
                                                                </div>
                                                            ) : preview.includes('sheet') || preview.endsWith('.xls') || preview.endsWith('.xlsx') ? (
                                                                <div className='m-2'>
                                                                    <FaFileExcel size={90} /><br />
                                                                    <a href={preview} target="_blank" rel="noopener noreferrer" download={filename[index]}>
                                                                        Download Excel
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <p>File type not supported</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-success m-3" onClick={DataSubmit}>Upload</button>
                            </Col>
                        </Row>
                        <DocumentTable partyID={partyID} insertData={insertData} />
                        <ImageViewModal show={showImageModal} onHide={() => setShowImageModal(false)} imageUrl={selectedImage} onDelete={handleDeleteImage} />
                    </div>
                </div>

                <div className="reset-button">
                    <button className="btn btn-danger m-2" onClick={onHide}> Cancel</button>
                    {/* <button className="btn btn-success m-2" onClick={DataSubmit}>Upload</button> */}
                </div>
            </div>
            {/* </Tab> */}
            {/* <Tab eventKey="documentlist" title="Document List"> */}
            {/* <DocumentTable partyID={partyID} insertData={insertData} /> */}
            {/* </Tab> */}
            {/* </Tabs> */}

        </div >
    )
}

export default DocumentForm

