import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-bootstrap/Modal';
import IfscMaster from "../IFSC/IfscMaster"
import { FiMoreHorizontal } from 'react-icons/fi';
import * as Yup from 'yup';
import '../../style/Style.css'
import { Drawer } from 'antd';

// Form validation Schema start
// const pincodeRegex = /^[0-9]{6}$/
const validationSchema = Yup.object().shape({
    IFSC: Yup.string().required("IFSC code is required"),
    accountNo: Yup.string().required("Account Number is required"),
    accountType: Yup.string().required("Account Type is required"),
    // Add validation schema for other fields,
});
// Form validation Schema end

function IfscCodeNew(props) {
    const { fetchIFSCData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <IfscMaster fetchIFSCData={fetchIFSCData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}

// function IfscCodeNew(props) {
//     const { fetchIFSCData } = props;
//     const errorData = React.useRef(null);

//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             visible={props.visible}
//             width="62vw"  // Add event listener
//         >
//             {/* <Modal.Body> */}
//             <IfscMaster fetchIFSCData={fetchIFSCData} onHide={props.onHide} errorData={errorData} />
//             {/* </Modal.Body> */}
//         </Drawer>
//     );
// }

const BankForm = ({ rowData, fetchData, onHide, errorData, reset_Data }) => {

    React.useEffect(() => {
        if (errorData) {
            errorData.current = resetErrors
        }
    }, [])
    React.useEffect(() => {
        if (reset_Data) {
            reset_Data.current = resetData
        }
    }, [])

    const [ifsccode, setIfscCode] = React.useState(false);
    const [IFSC, setIFSC] = useState(null)
    const [bankid, setbankid] = useState(-1);
    const [IFSCData, setIFSCData] = useState([]);
    const [bankName, setBankName] = useState("")
    const [branchName, setBranchName] = useState("")
    const [accountNo, setAccountNo] = useState("")
    const [accountType, setAccountType] = React.useState("S");
    const [errors, setErrors] = useState({});
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const customerId = localStorage.getItem("CRMCustId")
    const userId = localStorage.getItem("CRMUserId")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const [masterData, setMasterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const UUID = `${day}CC${month}-AA${year}-${hours}-${minutes}${second}-${uuid}-${customerId}`;

    const resetErrors = () => {
        setErrors({});
    };

    const resetData = () => {
        setIFSC(null);
        setBankName("");
        setBranchName("");
        setAccountNo("");
        setAccountType("S");
    }

    useEffect(() => {
        resetErrors(); // Reset errors when the form is opened
        if (rowData) {
            setIFSC(rowData.IFSCCode)
            setbankid(rowData.BankID)
            setBankName(rowData.BankName)
            setBranchName(rowData.BranchName)
            setAccountNo(rowData.AcNo)
            setAccountType(rowData.AccType)

        } else {
            resetData(); // Ensure data is reset when rowData is not provided
        }
    }, [rowData])

    const fetchIFSCData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/IFSCList?CustId=${customerId}&CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // const allData = res.data;
            // const filteredData = allData.filter(item => item.CustId === customerId);
            // console.log(filteredData, "Ankit");
            setIFSCData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchMasterData = async () => {
        try {
            const res = await axios.get(URL + '/api/Master/mst_Master', {
                headers: { Authorization: `bearer ${token}` }
            })
            setMasterData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchIFSCData();
        fetchMasterData()
    }, [])
    const options = masterData.filter((display) => display.Remark === "Bank Account");
    const accountTypeOptions = options.map((display) => ({
        value: display.MasterTag1,
        label: display.Description,
    }))

    const ifscOptions = IFSCData.map((display) => ({
        value: display.IFSC,
        label: display.IFSC,
    }));

    const handleIFSCChange = (selectedIfsc) => {
        const selectedIfscID = selectedIfsc.value
        setIFSC(selectedIfscID);
        const selectIfsc = IFSCData.find((display) => display.IFSC == selectedIfscID);
        if (selectIfsc) {
            setBankName(selectIfsc.BankName);
            setBranchName(selectIfsc.BranchName)
        } else {
            setBankName('');
            setBranchName('')
        }
        if (errors.IFSC) {
            setErrors(prevErrors => ({ ...prevErrors, IFSC: '' }));
        }
    };

    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                IFSC,
                accountNo,
                accountType
            }, { abortEarly: false });
            setLoading(true);
            if (bankid >= 0) {
                const res = await axios.post(URL + `/api/Master/CreateBank`, {
                    Flag: "U",
                    Bank: {
                        BankID: bankid,
                        IFSCCode: IFSC,
                        BankName: bankName,
                        BranchName: branchName,
                        AcNo: accountNo,
                        AccType: accountType,
                        Entrydate: new Date(),
                        CompanyID: CompanyId,
                        UserID: userId,
                        CustId: customerId,
                        Guid: UUID,
                        CompanyID: CompanyId,
                    }
                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    })
                if (res.data.Success == true) {
                    fetchData();
                    resetData();
                    onHide();
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }

            }
            else {
                const res = await axios.post(URL + "/api/Master/CreateBank", {
                    Flag: "A",
                    Bank: {
                        CustId: customerId,
                        IFSCCode: IFSC,
                        BankName: bankName,
                        BranchName: branchName,
                        AcNo: accountNo,
                        AccType: accountType,
                        Entrydate: new Date(),
                        CompanyID: CompanyId,
                        UserID: userId,
                        Guid: UUID
                    }

                },
                    {
                        headers: { Authorization: `bearer ${token}` },
                    });
                // After successfully creating a user, add the new username to the userlist
                // setuserlist([...userlist, userName]);
                // Clear the username error if it was previously set
                // setUsernameError('');
                if (res.data.Success == true) {
                    fetchData();
                    resetData();
                    onHide();
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            const validationErrors = {};
            if (error.inner && Array.isArray(error.inner)) {
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ifsccode == false) {
            const handleKeyDown = (event) => {
                if (event.key === 'F9') {
                    event.preventDefault();
                    DataSubmit();
                }
            };

            // Add event listener when the component mounts
            window.addEventListener('keydown', handleKeyDown);

            // Remove event listener when the component unmounts
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [bankid, IFSC, accountNo, accountType, ifsccode]); // Add any other dependencies as needed

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onHide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onHide]);

    return (
        <div>
            <div className="form-border">
                <section className="content-header model-close-btn " style={{ width: "100%" }}>
                    <div className='form-heading'>
                        <div className="header-icon">
                            <i className="fa fa-users" />
                        </div>
                        <div className="header-title">
                            <h1>Add Bank</h1>
                            {/* <small>Bank List</small> */}
                        </div>
                    </div>
                    <div className='close-btn'>
                        <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </section>
                {/* Main content */}
                <div className="">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className="col-sm-12">
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>IFSC Code : <span className='text-danger'>*</span></label>
                                                <div className='d-flex'>
                                                    <Select
                                                        className='w-100'
                                                        options={ifscOptions}
                                                        value={ifscOptions.find((option) => option.value == IFSC)}
                                                        onChange={handleIFSCChange}
                                                        placeholder="Choose IFSC Code"
                                                        key={IFSC} // Force remount when IFSC changes
                                                    />
                                                    <div className='more-btn-icon'>
                                                        <FiMoreHorizontal onClick={() => setIfscCode(true)} />
                                                        <IfscCodeNew
                                                            show={ifsccode}
                                                            onHide={() => setIfscCode(false)}
                                                            fetchIFSCData={fetchIFSCData}
                                                        />
                                                        {/* <IfscCodeNew
                                                            visible={ifsccode}
                                                            onHide={() => setIfscCode(false)}
                                                            fetchIFSCData={fetchIFSCData}
                                                        /> */}
                                                    </div>
                                                </div>

                                                {errors.IFSC && <div className="error-message text-danger">{errors.IFSC}</div>}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Bank Name :</label>
                                                <input type="text" inputMode='text' className="form-control" placeholder="Bank Name" value={bankName} onChange={(event) => setBankName(event.target.value)} disabled />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Branch Name :</label>
                                                <input type="email" inputMode='email' className="form-control" placeholder="Branch Name" value={branchName} onChange={(event) => setBranchName(event.target.value)} disabled />
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Account Number :<span className='text-danger'>*</span></label>
                                                <input type="text" inputMode='tel' className="form-control" placeholder="Enter Account No." value={accountNo} onChange={(event) => {
                                                    const input = event.target.value;
                                                    const numericInput = input.replace(/\D/g, '');
                                                    const limitedInput = numericInput.slice(0, 16);
                                                    setAccountNo(limitedInput);
                                                    if (errors.accountNo) {
                                                        setErrors(prevErrors => ({ ...prevErrors, accountNo: '' }));
                                                    }
                                                }}
                                                />
                                                {errors.accountNo && <div className="error-message text-danger">{errors.accountNo}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label>Account Type : <span className='text-danger'>*</span></label>
                                                <Select
                                                    className='w-100'
                                                    options={accountTypeOptions}
                                                    value={accountTypeOptions.find((option) => option.value == accountType)}
                                                    onChange={(selected) => {
                                                        setAccountType(selected.value)
                                                        if (errors.accountType) {
                                                            setErrors(prevErrors => ({ ...prevErrors, accountType: '' }));
                                                        }
                                                    }}
                                                    placeholder="Choose Account Type"
                                                    key={accountType} // Force remount when accountType changes
                                                />
                                                {errors.accountType && <div className="error-message text-danger">{errors.accountType}</div>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="reset-button ">
                                        <button className="btn btn-success m-2" onClick={DataSubmit} disabled={loading}>
                                            {loading ? 'Saving...' : 'Save [F9]'}
                                        </button>
                                        <button className="btn btn-danger m-2" onClick={onHide} disabled={loading}>
                                            Cancel [ESC]
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default BankForm