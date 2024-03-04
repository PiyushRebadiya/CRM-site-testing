import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import QRCode from "react-qr-code";
import Gpay from "./Img/gpay.jpg";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from "axios";
import { notification } from "antd";

const PaymentWindow = ({ totalPlanPrice, onHide, custId, selectPlan }) => {
  const [UPIID, setUPIID] = useState("")
  
  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required').max(50, 'invalid username'),
    mobile: Yup.string()
      .required('Mobile Number is required').length(10, 'Must be 10 characters'),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      mobile: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      const CRMCustId = localStorage.getItem('CRMCustId');

      let packageName = []
      if(selectPlan.includes(1)){
        packageName.push("CRM");
        packageName.push("Tax Management");
      }
      if(selectPlan.includes(2)){
        packageName.push("HRM");
      }
      const payload = {
        Name: values.username,
        Mobile: String(values.mobile),
        Price: totalPlanPrice,
        CustId: custId || CRMCustId,
        Packages: packageName.join(", "),
      }
      try {
        const res = await axios.post(process.env.REACT_APP_API_URL + '/api/Master/CreratePayment', payload);
        if (res?.data?.Success == true) {
          notification.success({
            message: 'Thank You !!!',
            placement: 'bottomRight', // You can adjust the placement
            duration: 1,
          });
        } else {
          notification.error({
            message: 'Something went wrong !!!',
            placement: 'bottomRight', // You can adjust the placement
            duration: 1,
          })
        }
        setTimeout(() => {
          onHide();
        }, 1000);
      } catch (error) {
        notification.error({
          message: 'Something went wrong !!!',
          placement: 'bottomRight', // You can adjust the placement
          duration: 1,
        })
      }
    },
  });
  const { handleSubmit, handleChange, errors, touched, handleBlur, values, setFieldValue } = formik;

  const URL = process.env.REACT_APP_API_URL;
  const UPI_ID = async() => {
    try {
      const res = await axios.get(URL + "/api/Master/UPIList")
      setUPIID(res?.data[0]?.UPI);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
      UPI_ID()
  },[])

  function generateUPIUrl(upiId, amount, currency, note) {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=${encodeURIComponent(note)}&am=${encodeURIComponent(
      amount
    )}&cu=${encodeURIComponent(currency)}`;
    return upiUrl;
  }
  
  const upiUrl = useMemo(() => {
    const yearPrice = totalPlanPrice * 12;
    const amount = `${yearPrice}`;
    const currency = "INR";
    const note = "Payment To Monarch";
    return generateUPIUrl(UPIID, amount, currency, note);
  }, [UPIID]);

  return (
    <div className="p-1 m-auto">
      <div className="text-center">
        <img src={Gpay} style={{ height: "60px" }} />
      </div>
      <div className="payment-main-section">
        <Row className="">
          <Col lg={6}>
            <div className="payment-mobile-number-section">
              <div>
                <h3>Pay to Mobile Number :</h3>
                <p>+91 9904016789</p>
                <h3>UPI ID given below :</h3>
                <p>{UPIID}</p>
              </div>
            </div>
          </Col>
          <Col lg={6} style={{ borderLeft: "0.5px solid gray" }}>
            <div className="qr-section">
              <QRCode value={upiUrl} style={{ height: "150px" }} />
            </div>
            <div className="g-pay-lable">
              <p>Scan QR Code in GPay App to Make Payment</p>
            </div>
          </Col>
        </Row>
      </div>
      <div class="upi-modal-footer text-center mt-3">
        <p className="h6">
          Once the payment is made, please enter the Google Pay transaction ID
          and click confirm payment button.
        </p>
        <form method="post" name="frmgpay">
          <input type="hidden" name="gid" id="gid" value="" />
          <input type="hidden" name="paytype" id="paytype" value="gpay" />
          <div class="grid-upi-form d-flex w-100">
            <div className="w-100">
              {" "}
              <input
                type="text"
                name="username"
                onChange={handleChange}
                id="payrefid"
                required=""
                placeholder="Enter Username"
              />{" "}
            </div>
          </div>
          {
            errors?.username ? <div className="text-danger text-left">{errors.username}</div> : null
          }
          <div class="grid-upi-form d-flex w-100">
            <div className="w-100">
              {" "}
              <input
                type="number"
                name="mobile"
                onChange={handleChange}
                maxLength={10}
                id="payrefid"
                required=""
                placeholder="Enter Mobile Number"
              />{" "}
            </div>
          </div>
          {
            errors?.mobile ? <div className="text-danger text-left">{errors.mobile}</div> : null
          }
          <div class="grid-upi-form d-flex w-100">
            <div className="w-100">
              <button class="btn-1" name="BtnGpay" id="BtnGpay" value="BtnGpay" onClick={handleSubmit}>
                Confirm Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentWindow;
