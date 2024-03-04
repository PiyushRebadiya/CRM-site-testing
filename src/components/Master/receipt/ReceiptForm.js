import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import Modal from 'react-bootstrap/Modal';
import { notification } from 'antd';
import PartyMaster from '../PartyMaster/PartyMaster'
import { FiMoreHorizontal } from 'react-icons/fi';
import * as Yup from 'yup';
import { Drawer } from 'antd';

const validationSchema = Yup.object().shape({
    party: Yup.string().required("Please select Party Name"),
    amount: Yup.string().required("Please enter Amount"),
    // chequeno: Yup.string().when('selectreceipt', {
    //     is: 'Bank',
    //     then: Yup.string().required('Cheque/NEFT/RTGS/IMPS/UPI Number is required when Bank is selected'),
    //     otherwise: Yup.string().notRequired(),
    // }),
    // Add validation schema for other fields,
});

function PartyNew(props) {
    const { getPartyData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            {/* <Modal.Body> */}
            <PartyMaster getPartyData={getPartyData} onHide={props.onHide} />
            {/* </Modal.Body> */}
        </Modal>
    );
}

const ReceiptForm = ({ fetchData, fetchExpense, fetchPayment, onHide, rowData }) => {
    const [partyData, setPartyData] = useState(false);
    const location = useLocation()
    const history = useHistory()
    const [partylist, setPartyList] = useState([])
    const [party, setParty] = useState()
    const [selectreceipt, setSelectReceipt] = useState("")
    const [chequeno, setChequeNo] = useState("")
    const chequeDate = new Date()
    const formattedChequeDate = moment(chequeDate).format('yyyy-MM-DD');
    const [chequedate, setChequeDate] = useState(formattedChequeDate)
    const [amount, setAmount] = useState("")
    const [remark, setRemark] = useState("")
    const [no, setNo] = useState("")
    const todaydate = new Date()
    const formattedToDate = moment(todaydate).format('yyyy-MM-DD');
    const [date, setDate] = useState(formattedToDate)
    const [rid, setRid] = useState(-1)
    const [amountword, setAmountword] = useState("")
    const [transmode, setTransMode] = useState("")
    const [errors, setErrors] = useState({});
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const CusId = localStorage.getItem('CRMCustId')
    const compnayid = localStorage.getItem('CRMCompanyId')
    const username = localStorage.getItem('CRMUsername')
    const userid = localStorage.getItem('CRMUserId')
    const [ipaddress, setIpAddress] = useState('')

    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const [guid, setguid] = useState("")
    const second = currentDate.getSeconds();
    const uuid = uuidv4();
    const hash = uuid.substring(0, 10);
    const UUID = `${day}-AC${year}-${hash}`;


    const fetchIPAddress = async () => {
        try {
            const res = await axios.get('https://api.ipify.org/?format=json', {
            });
            // console.log(res.data.ip, "res-resresres")
            setIpAddress(res.data.ip)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        fetchIPAddress()
    },[])
    const getTrnNo = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationAddonList?CompanyID=${compnayid}&TransMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setNo(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getPartyData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${CusId}&CompanyId=${compnayid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPartyList(res.data)
            if (!rowData) {
                setParty(res.data[0].PartyId)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getPartyData()
        if (!rowData) {
            getTrnNo()
        }
    }, [])

    useEffect(() => {
        if (rowData) {
            setParty(rowData.PartyId)
            setSelectReceipt(rowData.CBJ)
            setChequeNo(rowData.ChequeNo)
            const cheqData = rowData.ChequeDate
            const formattedChequDate = moment(cheqData).format('yyyy-MM-DD');
            setChequeDate(formattedChequDate)
            setAmount(rowData.NetAmount)
            setRemark(rowData.Remark)
            setNo(rowData.TranNo)
            const date = rowData.TransDate
            const formattedDate = moment(date).format('yyyy-MM-DD');
            setDate(formattedDate)
            setRid(rowData.Id)
            setTransMode(rowData.TransMode)
            setguid(rowData.CGuid)
        }
    }, [rowData])

    useEffect(() => {
        if (!rowData) {
            setSelectReceipt('Cash');
        }
    }, []);


    const partyOption = partylist.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));

    const handleSinglePrint = (guid) => {
        const url = `https://report.taxfile.co.in/Report/MasterReport?CompanyID=${compnayid}&CGuid=/${guid}/&ReportMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}`;
        const windowName = "myWindow";
        const windowSize = "width=1500,height=900";
        setResult(window.open(url, windowName, windowSize));
    }
    const DataSubmit = async () => {
        try {
            await validationSchema.validate({
                party,
                amount,
                // chequeno
            }, { abortEarly: false });
            setLoading(true);
            if (rid >= 0) {
                const res = await axios.post(URL + '/api/Transation/CreateVouchar', {
                    Flag: "U",
                    TransationMast: {
                        Id: rid,
                        CompanyID: compnayid,
                        CGuid: guid,
                        TranNo: no,
                        TransDate: date,
                        TransMode: transmode,
                        PartyId: party,
                        Remark: remark,
                        NetAmount: amount,
                        ChequeNo: chequeno,
                        ChequeDate: (selectreceipt == 'Bank' ? chequedate : ''),
                        CBJ: selectreceipt,
                        UserID: userid,
                        UserName: username,
                        EntryTime: new Date(),
                        PaymentAmt: (location.pathname == '/receiptentry' && "0" || location.pathname == '/expenseentry' && amount || location.pathname == '/payment' && amount),
                        ReceiptAmt: (location.pathname == '/receiptentry' && amount || location.pathname == '/expenseentry' && '0' || location.pathname == '/payment' && '0'),
                        IPAddress:ipaddress,
                    }
                }, {
                    headers: { Authorization: `bearer ${token}` }
                })      
                if (res.data.Success == true) {
                    const GUIDPrint = res.data.TransationMast.CGuid
                    if (location.pathname == '/receiptentry') {
                        fetchData();
                        // resetData();
                        onHide();
                        handleSinglePrint(GUIDPrint)
                    }
                    else if (location.pathname == '/payment') {                   
                        fetchPayment();
                        onHide();
                        // handleSinglePrint(GUIDPrint)
                    }
                    else {
                        fetchExpense();
                        // resetData();
                        onHide();
                        handleSinglePrint(GUIDPrint)
                    }
                    notification.success({
                        message: 'Data Modified Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1,
                    });
                }
            }
            else {
                const res = await axios.post(URL + '/api/Transation/CreateVouchar', {
                    Flag: "A",
                    TransationMast: {
                        CompanyID: compnayid,
                        CGuid: UUID,
                        TranNo: no,
                        TransDate: date,
                        TransMode: (location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'),
                        PartyId: party,
                        Remark: remark,
                        NetAmount: amount,
                        ChequeNo: chequeno,
                        ChequeDate: (selectreceipt == 'Bank' ? chequedate : ''),
                        CBJ: selectreceipt,
                        EntryTime: new Date(),
                        UserID: userid,
                        UserName: username,
                        PaymentAmt: (location.pathname == '/receiptentry' && "0" || location.pathname == '/expenseentry' && amount || location.pathname == '/payment' && amount),
                        ReceiptAmt: (location.pathname == '/receiptentry' && amount || location.pathname == '/expenseentry' && '0' || location.pathname == '/payment' && '0'),
                        IPAddress:ipaddress,
                    }

                }, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data.Success == true) {
                    const GUIDPrint = res.data.TransationMast.CGuid
                    // history.push(location.pathname)
                    if (location.pathname == '/receiptentry') {
                        fetchData();
                        // resetData();
                        onHide()
                        handleSinglePrint(GUIDPrint)

                    }
                    else if (location.pathname == '/payment') {
                        fetchPayment()
                        onHide();
                        // handleSinglePrint(GUIDPrint)
                    }
                    else {
                        fetchExpense()
                        // resetData();
                        onHide()
                        handleSinglePrint(GUIDPrint)


                    }
                    notification.success({
                        message: 'Data Added Successfully !!!',
                        placement: 'bottomRight', // You can adjust the placement
                        duration: 1, // Adjust the duration as needed
                    });
                }
            }
        } catch (error) {
            console.log(error); // Log the error to the console
            const validationErrors = {};
            if (error.inner && Array.isArray(error.inner)) {
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
            }
            console.log('Validation Errors:', validationErrors); // Log validation errors
            setErrors(validationErrors);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (partyData == false) {
            const handleKeyDown = (event) => {
                if (event.key === 'F9') {
                    event.preventDefault();
                    DataSubmit();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [rid, compnayid, no, party, date, selectreceipt, amount, chequeno, chequedate, remark, partyData]);

    // function numberToWords(number) {
    //     const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    //     const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    //     const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    //     const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    //     function convertChunk(number) {
    //         if (number === 0) {
    //             return '';
    //         } else if (number < 10) {
    //             return units[number] + ' ';
    //         } else if (number < 20) {
    //             return teens[number - 10] + ' ';
    //         } else if (number < 100) {
    //             return tens[Math.floor(number / 10)] + ' ' + convertChunk(number % 10);
    //         } else {
    //             return units[Math.floor(number / 100)] + ' Hundred ' + convertChunk(number % 100);
    //         }
    //     }

    //     let words = '';
    //     let chunkCount = 0;

    //     while (number > 0) {
    //         const chunk = number % 1000;
    //         if (chunk !== 0) {
    //             words = convertChunk(chunk) + thousands[chunkCount] + ' ' + words;
    //         }
    //         number = Math.floor(number / 1000);
    //         chunkCount++;
    //     }
    //     return words.trim();
    // }

    // useEffect(() => {
    //     if (selectreceipt === 'Bank') {
    //         // Set the cheque date to the current date or your desired logic
    //         const currentDate = date;
    //         const formattedChequeDate = moment(currentDate).format('yyyy-MM-DD');
    //         setChequeDate(formattedChequeDate);
    //     } else {
    //         // Set to default or empty if not 'Bank'
    //         setChequeDate('');
    //     }
    // }, [selectreceipt, date]);

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;

        // Update the date
        setDate(selectedDate);

        // If the receipt type is 'Bank', update the cheque date as well
        if (selectreceipt === 'Bank') {
            setChequeDate(selectedDate);
        }
    };

    return (
        <div>
            <div>
                <div className='form-border'>
                    <section className="content-header model-close-btn " style={{ width: "100%" }}>
                        <div className='form-heading'>
                            <div className="header-icon">
                                <i className="fa fa-users" />
                            </div>
                            <div className="header-title">
                                <h1>{location.pathname == '/receiptentry' && 'Add Receipt' || location.pathname == '/expenseentry' && ' Add Expense' || location.pathname == '/payment' && ' Add Payment'} </h1>
                            </div>
                        </div>
                        <div className='close-btn'>
                            <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </section>
                    <div className="">
                        <div className="container">
                            <div className=" row lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Party Name :<span className='text-danger'>*</span></label>
                                        <div className='d-flex'>
                                            <Select
                                                className='w-100'
                                                options={partyOption}
                                                isClearable={true}
                                                value={partyOption.find((option) => option.value == party)}
                                                onChange={(selected) => {
                                                    setParty(selected ? selected.value : '')
                                                    if (errors.party) {
                                                        setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                                                    }
                                                }}
                                                placeholder="Select Party "
                                                key={party}
                                            />
                                            <div className='more-btn-icon'>
                                                <FiMoreHorizontal onClick={() => setPartyData(true)} />
                                                <PartyNew
                                                    show={partyData}
                                                    onHide={() => setPartyData(false)}
                                                    getPartyData={getPartyData}
                                                />
                                            </div>
                                        </div>
                                        {errors.party && <div className="error-message text-danger">{errors.party}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="radio-inline">
                                            <input
                                                type="radio"
                                                name="receipt"
                                                value="Cash"
                                                checked={selectreceipt === 'Cash'}
                                                onChange={(event) => {
                                                    setSelectReceipt(event.target.value);
                                                    setChequeNo("");
                                                    setChequeDate(formattedChequeDate);
                                                }}
                                            /> Cash
                                        </label>
                                        <label className="radio-inline">
                                            <input
                                                type="radio"
                                                value="Bank"
                                                name="receipt"
                                                checked={selectreceipt === 'Bank'}
                                                onChange={(event) => {
                                                    setSelectReceipt(event.target.value);
                                                }}
                                            /> Bank
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>CHEQUE / NEFT / RTGS / IMPS / UPI Number :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter No."
                                            value={chequeno}
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = numericInput.slice(0, 15);
                                                setChequeNo(limitedInput);
                                                // if (errors.chequeno) {
                                                //     setErrors(prevErrors => ({ ...prevErrors, chequeno: '' }));
                                                // }
                                            }}
                                            disabled={selectreceipt === 'Cash'}
                                        />
                                         {/* {errors.chequeno && <div className="error-message text-danger">{errors.chequeno}</div>} */}
                                    </div>
                                    {
                                        selectreceipt == 'Bank' ? (
                                            <div className="form-group">
                                                <label>CHEQUE / NEFT / RTGS / IMPS / UPI Date :</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={chequedate}
                                                    onChange={(event) => {
                                                        setChequeDate(event.target.value);
                                                    }}
                                                    disabled={selectreceipt === 'Cash'}
                                                />
                                            </div>
                                        ) : null
                                    }

                                    <div className="form-group">
                                        <label>Amount :<span className='text-danger'>*</span></label>
                                        <input
                                            type='text'
                                            className="form-control"
                                            placeholder='Enter Amount'
                                            value={amount}
                                            onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/[^\d.]/g, '');
                                                const decimalIndex = numericInput.indexOf('.');
                                                let limitedInput = numericInput;
                                                if (decimalIndex !== -1) {
                                                    limitedInput = numericInput.slice(0, decimalIndex + 3); // Allow up to two decimal places
                                                }
                                                setAmount(limitedInput);

                                                if (errors.amount) {
                                                    setErrors(prevErrors => ({ ...prevErrors, amount: '' }));
                                                }
                                            }}
                                        />
                                        {errors.amount && <div className="error-message text-danger">{errors.amount}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>Remark :</label>
                                        <textarea class="form-control" placeholder='Enter Remark' rows="5" value={remark} onChange={(event) => { setRemark(event.target.value) }} />
                                    </div>
                                </div>
                                <div className=' ml-auto col-lg-4'>
                                    <div className="form-group">
                                        <label> No. :</label>
                                        <input type='text' className="form-control" placeholder='Enter  No.' value={no} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label> Date :</label>
                                        <input type='date' className="form-control" value={date} onChange={handleDateChange} />
                                    </div>
                                </div>
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
    )
}

export default ReceiptForm