import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
// import { Button } from 'react-bootstrap';
import axios from 'axios';
import { notification } from 'antd';
import Select from 'react-select';
import moment from 'moment';
import { Button, Select as AntSelect } from 'antd';
import { useLocation } from 'react-router-dom';
const { Option } = AntSelect;

const PurchaseTable = ({ onDataChange, onDataUpdate, selectedpurchasedata, ondeleteRow, salesgetdatasales, selectpurchase, partyName }) => {

    const location = useLocation()
    const [focusedCell, setFocusedCell] = useState({ rowIndex: -1, key: '' });
    const antSelectRef = useRef(null);
    const CompanyId = localStorage.getItem('CRMCompanyId')
    let deleterow;
    const alertDisplay = () => {
        notification.error({
            message: 'Please Select Invoice Type And Party  !',
            placement: 'top',
            duration: 1,
        });
    }
    const [data, setData] = useState([]);
    const [itemdata, setItemData] = useState([])
    const [itemid, setItemId] = useState()
    const [gstdata, setGstData] = useState([])
    const [taxError, setTaxError] = useState(null);
    const [selectgst, setSelectGst] = useState("")
    const userId = localStorage.getItem('CRMUserId')
    const username = localStorage.getItem('CRMUsername')

    useEffect(() => {
        if (salesgetdatasales) {
            const PurchaseData = salesgetdatasales.map(obj => {
                const { TransID, CGUID, ...rest } = obj;
                return rest;
            });
            const salesproformadata = PurchaseData.map(detail => ({
                // CGUID:detail.CGUID,
                // TransID: detail.TransID,
                ItemId: detail.ItemId,
                Description: detail.Description,
                Qnty: detail.Qnty,
                Rate: detail.Rate,
                Amount: detail.Amount,
                Discount: detail.Discount,
                DiscountAmount: detail.DiscountAmount,
                GrossTotal: detail.GrossTotal,
                TaxRate: detail.TaxRate,
                TaxAmount: detail.TaxAmount,
                NetAmount: detail.NetAmount,
            }));
            setData(salesproformadata)
        }
    }, [salesgetdatasales])

    useEffect(() => {
        let performitemRecord;
        if (selectedpurchasedata) {
            performitemRecord = selectedpurchasedata.map(detail => ({
                // CGUID:detail.CGUID,
                TransID: detail.TransID,
                ItemId: detail.ItemId,
                Description: detail.Description,
                Qnty: detail.Qnty,
                Rate: detail.Rate,
                Amount: detail.Amount,
                Discount: detail.Discount,
                DiscountAmount: detail.DiscountAmount,
                GrossTotal: detail.GrossTotal,
                TaxRate: detail.TaxRate,
                TaxAmount: detail.TaxAmount,
                NetAmount: detail.NetAmount,
            }));
            setData(performitemRecord)
        }

    }, [selectedpurchasedata])

    let deletedata
    const handleChange = () => {
        if (deletedata) {
            onDataUpdate(deletedata);
        }
        else {
            onDataUpdate(data);
        }

    };
    let itemId
    // const [Rate, setRate] = useState(itemdata.length > 0 ? itemdata[0].SellingPrice : "");
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem("CRMtoken")
    const handleRowdelete = () => {
        ondeleteRow(deleterow)
    }
    const handleDeleteRow = async (purchasecGuid, rowIndex) => {
        const deleteData = [...data];
        if (purchasecGuid) {
            try {
                const res = await axios.get(URL + `/api/Transation/DeleteTransation?TransMode=${location.pathname == '/Purchase' && "Purchase" || location.pathname == '/invoiceentry' && 'Invoice'}&CGUID=${purchasecGuid}`, {
                    headers: { Authorization: `bearer ${token}` }
                })
                if (res.data == true) {
                    deleteData.splice(rowIndex, 1);
                    setData(deleteData);
                    deleterow = rowIndex
                }
            } catch (error) {
                console.log(error)
            }
            handleRowdelete()
        }
        else {
            deleteData.splice(rowIndex, 1);
            setData(deleteData);
            deletedata = deleteData
            handleChange()
        }
    }
    const handleDeleteRecord = (rowIndex) => {
        const deleteRecord = [...data]
        deleteRecord.splice(rowIndex, 1);
        setData(deleteRecord)
        deletedata = deleteRecord
        handleChange()
    }

    const itemchange = (selectedItem, rowIndex) => {
        const selectedItemId = selectedItem;
        itemId = selectedItem
        const updatedData = data.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, ItemId: selectedItemId };
            }
            return row;
        });
        setData(updatedData);
        setItemId(selectedItemId);
    };

    const handleCellChange = (rowIndex, key, value) => {
        const updatedData = [...data];
        updatedData[rowIndex][key] = value;
        if (key === 'ItemId') {
            // Handle dropdown ItemID selection
            updatedData[rowIndex][key] = itemid;
        }
        else if (key === "TaxAmount") {
            updatedData[rowIndex][key] = value;
        }
        else if (key === 'TaxRate') {
            // Validate Tax Rate
            const validTaxRates = ['0', '5', '12', '18', '28'];
            if (!validTaxRates.includes(value)) {
                setTaxError('Enter a valid tax rate (0, 5, 12, 18, or 28)');
                return;
            } else {
                setTaxError(null);
            }
            updatedData[rowIndex][key] = value;
        }
        // updatedData[rowIndex][key] = value;
        else {
            // Handle other cell changes
            updatedData[rowIndex][key] = value;
        }
        setData(updatedData);
        handleChange()
    };

    function deepEqual(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (const key of keys1) {
            if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
        }
        return true;
    }

    useEffect(() => {
        const updatedData = [...data];
        updatedData.forEach((row, rowIndex) => {
            const Quantity = parseFloat(row['Qnty']) || 0;
            const Rate = parseFloat(row['Rate']) || 0;
            updatedData[rowIndex]['Amount'] = (Quantity * Rate).toFixed(2);
            const DiscountRate = parseFloat(row['Discount']) || 0;
            const Amount = parseFloat(row['Amount']) || 0;
            const discountAmount = (Amount * (DiscountRate / 100)).toFixed(2);
            updatedData[rowIndex]['DiscountAmount'] = discountAmount;
            const grossAmount = (Amount - discountAmount).toFixed(2);
            updatedData[rowIndex]['GrossTotal'] = grossAmount;
            const grossTotal = parseFloat(updatedData[rowIndex]["GrossTotal"]);
            const TAX = parseFloat(row['TaxRate']) || 0;
            // const TAX = taxRates[rowIndex] || 0;
            const gross_Total = parseFloat(updatedData[rowIndex]["GrossTotal"]);
            const TAXAmount = (gross_Total * (TAX / 100)).toFixed(2);
            updatedData[rowIndex]["TaxAmount"] = TAXAmount;
            const netAmount = (grossTotal + parseFloat(TAXAmount)).toFixed(2);
            updatedData[rowIndex]["NetAmount"] = netAmount;
        });
        if (!deepEqual(updatedData, data)) {
            setData(updatedData);
        }
        handleChange();
    }, [data]);

    const handleInput = (e, key) => {
        const inputValue = e.target.textContent;
        // Check if the cell is the Remarks or Description cell
        if (key === 'Remarks' || key === 'Description') {
            // Remove Enter and space key presses
            const sanitizedValue = inputValue.replace(/[\n\r]/g, '');
            e.target.textContent = sanitizedValue;
        } else {
            // For other cells, remove non-numeric characters
            const numericValue = inputValue.replace(/[^0-9.]/g, '');
            // Update the content of the content-editable <div> with the numeric value
            e.target.textContent = numericValue;
        }
    };

    const handleAddRow = () => {
        let newRow = {
            ItemId: '',
            Description: '',
            Qnty: 1,
            Rate: 0,
            Amount: 0,
            Discount: 0,
            DiscountAmount: 0,
            GrossTotal: 0,
            TaxRate: 0,
            TaxAmount: 0,
            NetAmount: 0,
        };
        setData([...data, newRow]);
    };

    const getTotalQuantity = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.Qnty || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    }
    const getTotalAmount = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.Amount || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    }
    const getTotalDiscount = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.DiscountAmount || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    }
    const getGrossTotal = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.GrossTotal || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    }
    const getTotalTaxAmount = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.TaxAmount || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    }
    const getTotalNetAmount = () => {
        const total = data.reduce((total, row) => total + parseFloat(row.NetAmount || 0), 0);
        const roundedTotal = parseFloat(total.toFixed(2)); // Round to 2 decimal places and convert to a number
        return roundedTotal;
    };

    const getItemData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/TrnCategoryList?CompanyID=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setItemData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGSTData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/GstList`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setGstData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getItemData()
        getGSTData()
    }, [])
    const itemoptionTable = itemdata.map((display) => ({
        value: display.Id,
        label: display.CategoryName,
    }));
    const gstOptionTable = gstdata.map((display) => ({
        value: display.Rates,
        label: display.DisplayRate,
    }));
    const totalQuantity = getTotalQuantity();
    const totalAmount = getTotalAmount();
    const totalDiscAmount = getTotalDiscount();
    const totalGrossAmount = getGrossTotal();
    const totalTaxAmount = getTotalTaxAmount();
    const totalNetAmount = getTotalNetAmount();
    useEffect(() => {
        onDataChange(totalQuantity, totalAmount, totalDiscAmount, totalGrossAmount, totalTaxAmount, totalNetAmount);
    }, [totalQuantity, totalAmount, totalDiscAmount, totalGrossAmount, totalTaxAmount, totalNetAmount]);

    const handleCellFocus = (rowIndex, key, target) => {
        // Set focus state
        setFocusedCell({ rowIndex, key });

        // Create a selection range for the cell's content
        const range = document.createRange();
        range.selectNodeContents(target);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        if (key === 'ItemID' && antSelectRef.current) {
            antSelectRef.current.focus();
        }
    };
    const alertPartySelect = () => {
        notification.error({
            message: 'Please Select PartyName !!!',
            placement: 'bottomRight', // You can adjust the placement
            duration: 1, // Adjust the duration as needed
        });
    }

    return (
        <>
        <div className="table-container">
          {taxError && (
            <div style={{ color: 'red', marginTop: '5px' }}>{taxError}</div>
          )}
          <table className='editable-table w-100'>
            <thead>
              <tr>
                <th>Service/Product</th>
                <th style={{width: "15%"}}>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Discount(%)</th>
                <th>Discount Amount</th>
                <th>Gross Amount</th>
                <th>Tax(%)</th>
                <th>Tax Amount</th>
                <th>Net Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* <td>{rowIndex + 1}</td> */}
                  {Object.keys(row).map((key) => (
                    key !== 'TransID' && key !== 'CGUID' && (
                      <td
                        key={key}
                        contentEditable={key !== 'Amount' && key !== 'ItemId' && key !== 'DiscountAmount' && key !== 'GrossTotal' && key !== 'TaxAmount' && key !== 'NetAmount'}
                        onFocus={(e) => key !== 'ItemId' && handleCellFocus(rowIndex, key, e.target)}
                        onBlur={(e) => key !== 'ItemId' && handleCellChange(rowIndex, key, e.target.textContent)}
                        onInput={(e) => key !== 'ItemId' && handleInput(e, key)} // Pass the key to handleInput
                      >
                        {key === 'Amount' ? (
                          // parseFloat(row['Quantity'] || 0) * parseFloat(row['Rate'] || 0)
                          row['Amount']
                        ) : key === 'ItemId' ? (
                          // <Select
                          //   value={itemoptionTable.find((option) => option.value === row.ItemId)} // Set the value based on your data
                          //   onChange={(selectedOption) => itemchange(selectedOption.value, rowIndex)}
                          //   placeholder="Select Item"
                          //   options={itemoptionTable}
                          //   maxMenuHeight={80}
                          //   styles={{
                          //     control: (provided, state) => ({
                          //       ...provided,
                          //       width: 200,
                          //     }),
                          //     // Add other styles as needed
                          //   }}
                          // />
  
                          <AntSelect
                            showSearch
                            value={itemoptionTable.find((option) => option.value === row.ItemId)} // Set the value based on your data
                            style={{
                              width: 300,
                            }}
                            onChange={(selectedOption) => itemchange(selectedOption, rowIndex)}
                            options={itemoptionTable}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                          />
  
                        ) : (
                          row[key]
                        )}
                      </td>
                    )
                  ))}
                  <td>
                    {selectedpurchasedata ?
                      <Button variant="danger" onClick={() => handleDeleteRow(row.CGUID, rowIndex)}>Delete</Button>
                      :
                      <Button variant="danger" onClick={() => handleDeleteRecord(rowIndex)}>Delete</Button>
                    }
                  </td>
                </tr>
              ))}
  
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className='text-center'>Total</td>
                <td>{getTotalQuantity()}</td>
                <td></td>
                <td>{getTotalAmount()}</td>
                <td></td>
                <td>{getTotalDiscount()}</td>
                <td>{getGrossTotal()}</td>
                <td></td>
                <td>{getTotalTaxAmount()}</td>
                <td>{getTotalNetAmount()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
  
          {/* <button className=' add-row' onClick={handleAddRow}> <i className="fa fa-plus" aria-hidden="true"></i> Add Item</button> */}
          {
            partyName ? (
              <button className=' add-row' onClick={handleAddRow}> <i className="fa fa-plus" aria-hidden="true"></i> Add Item</button>
            ) : (
              <button className=' add-row' onClick={alertPartySelect}> <i className="fa fa-plus" aria-hidden="true"></i> Add Item</button>
            )
          }
        </div>
      </>
    )
}

export default PurchaseTable