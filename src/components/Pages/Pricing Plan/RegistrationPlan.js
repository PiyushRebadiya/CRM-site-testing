import React, { useEffect, useMemo, useState } from "react";
import "./registrationplan.css";
import { FaCheck } from "react-icons/fa6";
import { GoCheckCircleFill } from "react-icons/go";
import { formatIndianRupees } from "../../Master/common/common";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PaymentWindow from "./PaymentWindow";
import PricingTable from "./PricingTable";
import { Container } from "react-bootstrap";
const RegistrationPlan = () => {
  const [selectPlan, setSelectPlan] = useState([]);
  const [numberOfUSers, setNumberOfUSers] = useState(1);
  const [modalStatus, setModalStatus] = useState(false);

  const handleSelect = (value) => {
    const data = [...selectPlan];
    if (data.includes(value)) {
      const index = data.indexOf(value);
      data.splice(index, 1);
      setSelectPlan(data);
    } else {
      setSelectPlan([...selectPlan, value]);
    }
  };

  const onSelect = (e) => {
    handleSelect(Number(e.target.value));
  };

  const selectUsers = (e) => {
    const { value } = e.target;
    if (value < 0) {
      setNumberOfUSers(1);
    } else {
      if (value.length < 7) {
        setNumberOfUSers(value);
      }
    }
  };

  const totalPlanPrice = useMemo(() => {
    const totalSelectPlan = selectPlan.length * 250;
    return (totalSelectPlan * numberOfUSers).toFixed(2);
  }, [selectPlan, numberOfUSers]);

  const onShow = () => setModalStatus(true);
  const onHide = () => setModalStatus(false);

  return (
    <div
      className="content-wrapper d-flex flex-column justify-content-center"
      id="pricingPlan"
      style={{ minHeight: "80vh" }}
    >
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={modalStatus}
        centered
        backdrop="static"
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Product Cost : {formatIndianRupees(totalPlanPrice * 12)}/-
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentWindow selectPlan={selectPlan} onHide={onHide} totalPlanPrice={totalPlanPrice} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <div className="text-center my-3 title-container mx-5">
          <h2 className="title"><span className="text-color">C</span>hoose <span className="text-color">Y</span>our <span className="text-color">P</span>lan</h2>
        </div>
        <div className="mt-3">
          <div className="row">
            <div className="col-sm-12 col-md-6 pricingModel justify-content-around d-flex flex-md-column flex-lg-row w-100">
              <div className="col-md-12 col-lg-6 d-flex flex-column w-100 crmModule">
                <div
                  id="o_pricing16_box_oneapp"
                  className="card h-100 shadow-lg rounded-top-0"
                >
                  <div className="bg-o-color-8 pt-2"></div>
                  <h3 className="card-header pt-4">CRM + Tax Management</h3>
                  <div className="card-body flex-grow-0 pt-2">
                    <div className="d-flex align-items-top">
                      <span className="o_pricing16_price_currency h3 m-0 text-o-color-8 pt-1 pe-1 ">
                        Rs
                      </span>
                      <b className="o_pricing16_price block text-o-color-8 text-nowrap">
                        250
                      </b>
                      <span className="pl-5 h4 m-0 pt-1 pe-1 discountText">
                        500 Rs
                      </span>
                      <span class="h4 fw-normal"> *</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <ul className="list-group list-group-flush mt-1">
                      <li className="list-group-item border-0 py-1">
                        <b>Module & Features:</b>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <GoCheckCircleFill className="check-icon mr-2 text-success" />
                        </div>
                        <span>Unlimited Firm</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <GoCheckCircleFill className="check-icon mr-2 text-success" />
                        </div>
                        <span>Unlimited Users</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Admin Panel</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Role Wise Rights</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Multi Department Positions</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Different Company Management</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Kanban Board</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Campaign Module</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Auto task ( Task Scheduler )</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Task Management</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Perfomance Chart View</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Task Allocation Project Wise</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>
                          Inquiry Management And Reports With Invoice Print
                        </span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>
                          Reminder Of Birthday, Pending And Transaction Bills
                        </span>
                      </li>
                    </ul>
                  </div>
                  {!selectPlan.includes(1) ? (
                    <div
                      className="card-footer mt-auto border-0 d-grid gap-2 pb-4"
                      onClick={() => {
                        handleSelect(1);
                      }}
                    >
                      <a className="btn btn-lg btn-success text-primary text-white mb-2 py-4">
                        Select Plan
                      </a>
                    </div>
                  ) : (
                    <div
                      className="card-footer mt-auto border-0 d-grid gap-2 pb-4"
                      onClick={() => {
                        handleSelect(1);
                      }}
                    >
                      <a className="btn btn-lg btn-success remove-plan-bg text-white mb-2 py-4">
                        Remove Plan
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12 col-lg-6 d-flex flex-column w-100 hrmModule">
                <div
                  id="o_pricing16_box_oneapp"
                  className="card h-100 shadow-lg rounded-top-0"
                >
                  <div className="bg-o-color-8 pt-2"></div>
                  <h3 className="card-header pt-4">HRM</h3>
                  <div className="card-body flex-grow-0 pt-2">
                    <div className="d-flex align-items-top">
                      <span className="o_pricing16_price_currency h3 m-0 text-o-color-8 pt-1 pe-1 ">
                        Rs
                      </span>
                      <b className="o_pricing16_price block text-o-color-8 text-nowrap">
                        250
                      </b>
                      <span className="pl-5 h4 m-0 pt-1 pe-1 discountText">
                        500 Rs
                      </span>
                      <span class="h4 fw-normal"> *</span>
                    </div>
                  </div>
                  <div>
                    <ul className="list-group list-group-flush mt-1">
                      <li className="list-group-item border-0 py-1">
                        <b>Module & Features:</b>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <GoCheckCircleFill className="check-icon mr-2 text-success" />
                        </div>
                        <span>Unlimited Users</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Admin Panel</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Payroll</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Employee Dashboard</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Salary Structure</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Attendance Management</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Leave Management</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Shift Wise Attendance</span>
                      </li>
                      <li className="list-group-item border-0 py-1 d-flex align-items-center">
                        <div className="align-self-baseline">
                          <FaCheck className="check-icon mr-2 text-success" />
                        </div>
                        <span>Recruitment Management</span>
                      </li>
                    </ul>
                  </div>
                  {!selectPlan.includes(2) ? (
                    <div
                      className="card-footer mt-auto border-0 d-grid gap-2 pb-4"
                      onClick={() => {
                        handleSelect(2);
                      }}
                    >
                      <a className="btn btn-lg btn-success text-primary text-white mb-2 py-4">
                        Select Plan
                      </a>
                    </div>
                  ) : (
                    <div
                      className="card-footer mt-auto border-0 d-grid gap-2 pb-4"
                      onClick={() => {
                        handleSelect(2);
                      }}
                    >
                      <a className="btn btn-lg btn-success remove-plan-bg text-white mb-2 py-4">
                        Remove Plan
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className='pt-4 d-none d-md-block'>
        <PricingTable />
      </div>
      <Container>
        <div className="row w-100 justify-content-around align-items-center showing-upper-1000">
          <div className="col-sm-12 col-md-6 mb-3 d-flex flex-row col-sm-6 pricingCalculation w-100 mx-auto">
            <div className="row d-flex flex-column w-50">
              <div className="col-sm-6 blockUsersNumber col-md-12 col-lg-6 py-2 d-flex flex-md-row align-items-md-center mb-5 w-75">
                <label
                  className="h4 fw-bold text-nowrap text-700 m-md-0 form-label"
                  for="usersNumber"
                >
                  Number of users
                </label>
                <input
                  type="number"
                  min="1"
                  value={numberOfUSers}
                  onChange={selectUsers}
                  className="form-control ms-md-3 w-25 me-auto ms-3"
                  name="num_users"
                  id="usersNumber"
                  aria-describedby="usersNumberHelp"
                />
              </div>
              <div className="col-sm-6 col-md-12 col-lg-6 py-2 mb-5">
                <h4 className="activePlanTitle">Select Service</h4>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="implementationService1"
                    name="implementationService1"
                    className="implementationService form-check-input"
                    value={1}
                    onChange={onSelect}
                    checked={selectPlan.includes(1)}
                  />
                  <label
                    className="form-check-label font-initial"
                    for="implementationService1"
                  >
                    CRM + Tax Management
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="implementationService2"
                    name="implementationService2"
                    className="implementationService form-check-input"
                    value={2}
                    onChange={onSelect}
                    checked={selectPlan.includes(2)}
                  />
                  <label
                    className="form-check-label font-initial"
                    for="implementationService2"
                  >
                    HRM
                  </label>
                </div>
              </div>
            </div>
            <aside className="col p-0">
              <div className="blockTotal card shadow-none">
                <div className="card-body">
                  <table className="table table-borderless table-sm text-nowrap">
                    <tbody>
                      <tr>
                        <td className="w-100 fw-bold pb-0 text-wrap-balance ">
                          <span className="o_pricing16_wizard_users_number text-primary">
                            {numberOfUSers ? numberOfUSers : 0}
                          </span>{" "}
                          Users
                        </td>
                        <th className="text-end userPrice text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard']"
                          >
                            <span className="oe_currency_value">
                              {totalPlanPrice}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td className="w-100 border-top-none text-wrap-balance">
                          <i className="text-wrap-balance">Tax</i>
                        </td>
                        <th className="text-end userDiscount text-success border-top-none text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">+0.00</span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td className="w-100 border-top-none text-wrap-balance">
                          <i className="text-wrap-balance">Initial Discount</i>
                        </td>
                        <th className="text-end userDiscount text-success border-top-none text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">-0.00</span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr className="d-none">
                        <td className="w-100 fw-bold pb-3">Hosting</td>
                        <th className="text-end hostingPrice">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discounted' or 'yearly_standard_discounted']"
                          >
                            <span className="oe_currency_value">
                              {totalPlanPrice}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                    </tbody>
                    <tfoot className="border-top">
                      {/* <tr>
                                            <td className="w-100 pt-3 text-wrap-balance">
                                                <span className="fw-bold">Total</span> / month <sup className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">(*)</sup>
                                            </td>
                                            <th className="text-end totalPricing pt-3" style={{ borderTop: 'aliceblue' }}>
                                                <span data-oe-type="monetary" data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"><span className="oe_currency_value">{totalPlanPrice}</span>&nbsp;Rs</span>
                                            </th>
                                        </tr> */}
                      <tr>
                        <td className="w-100 pt-3 text-wrap-balance">
                          <span className="fw-bold">Total</span> / Year{" "}
                          <sup className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">
                            (*)
                          </sup>
                        </td>
                        <th
                          className="text-end totalPricing pt-3"
                          style={{ borderTop: "aliceblue" }}
                        >
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">
                              {(totalPlanPrice * 12).toFixed(2)}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">
                        <th
                          colspan="2"
                          className="small totalPricingYearly w-100 pt-1 text-center text-wrap-balance"
                        >
                          (*) Billed annually:{" "}
                          <span
                            className="text-wrap-balance"
                            data-oe-type="monetary"
                            data-oe-expression="12 * (prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount'])"
                          >
                            <span className="oe_currency_value">
                              {formatIndianRupees(Number(totalPlanPrice * 12))}
                            </span>
                          </span>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="card-footer text-end border-top-none">
                  <div className="openerp_enterprise_pricing_hide_alert d-none text-start">
                    <p>
                      <a href="/contactus">Contact us</a> to get our cloud prices
                    </p>
                    <p>
                      Or check our prices for on premise solutions using the
                      option below.
                    </p>
                  </div>
                  <div className="alert alert-danger p1 d-none openerp_enterprise_pricing_monthly_not_allowed text-start">
                    The monthly plan is only available to cloud hosting options
                    (Standard or Odoo.sh)
                  </div>
                  <div className="openerp_enterprise_pricing_form_button d-grid gap-2 mb-3">
                    <button
                      className="btn btn-success btn-lg openerp_enterprise_pricing_buy_now py-3"
                      disabled={
                        Number(numberOfUSers) === 0 || selectPlan.length === 0
                      }
                      onClick={onShow}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <div className="row w-100 justify-content-around align-items-center showing-inner-1000">
          <div className="col-sm-12 col-md-6 mb-3 d-flex flex-column col-sm-6 pricingCalculation w-100 mx-auto">
            <div className="row d-flex">
              <div className="col-sm-6 blockUsersNumber col-md-12 col-lg-6 py-2 d-flex flex-md-row align-items-md-center mb-5">
                <label
                  className="h4 fw-bold text-nowrap text-700 m-md-0 form-label"
                  for="usersNumber"
                >
                  Number of users
                </label>
                <input
                  type="number"
                  min="1"
                  value={numberOfUSers}
                  onChange={selectUsers}
                  className="form-control ms-md-3 w-25 me-auto ms-3"
                  name="num_users"
                  id="usersNumber"
                  aria-describedby="usersNumberHelp"
                />
              </div>
              <div className="col-sm-6 col-md-12 col-lg-6 py-2 mb-5">
                <h4 className="activePlanTitle">Select Service</h4>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="implementationService1"
                    name="implementationService1"
                    className="implementationService form-check-input"
                    value={1}
                    onChange={onSelect}
                    checked={selectPlan.includes(1)}
                  />
                  <label
                    className="form-check-label font-initial"
                    for="implementationService1"
                  >
                    CRM + Tax Management
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    id="implementationService2"
                    name="implementationService2"
                    className="implementationService form-check-input"
                    value={2}
                    onChange={onSelect}
                    checked={selectPlan.includes(2)}
                  />
                  <label
                    className="form-check-label font-initial"
                    for="implementationService2"
                  >
                    HRM
                  </label>
                </div>
              </div>
            </div>
            <aside className="col p-0">
              <div className="blockTotal card shadow-none">
                <div className="card-body">
                  <table className="table table-borderless table-sm text-nowrap">
                    <tbody>
                      <tr>
                        <td className="w-100 fw-bold pb-0 text-wrap-balance ">
                          <span className="o_pricing16_wizard_users_number text-primary">
                            {numberOfUSers ? numberOfUSers : 1}
                          </span>{" "}
                          Users
                        </td>
                        <th className="text-end userPrice text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard']"
                          >
                            <span className="oe_currency_value">
                              {totalPlanPrice}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td className="w-100 border-top-none text-wrap-balance">
                          <i className="text-wrap-balance">Tax</i>
                        </td>
                        <th className="text-end userDiscount text-success border-top-none text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">+0.00</span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td className="w-100 border-top-none text-wrap-balance">
                          <i className="text-wrap-balance">Initial Discount</i>
                        </td>
                        <th className="text-end userDiscount text-success border-top-none text-wrap-balance">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">-0.00</span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr className="d-none">
                        <td className="w-100 fw-bold pb-3">Hosting</td>
                        <th className="text-end hostingPrice">
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom_discounted' or 'yearly_standard_discounted']"
                          >
                            <span className="oe_currency_value">
                              {totalPlanPrice}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                    </tbody>
                    <tfoot className="border-top">
                      {/* <tr>
                                            <td className="w-100 pt-3 text-wrap-balance">
                                                <span className="fw-bold">Total</span> / month <sup className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">(*)</sup>
                                            </td>
                                            <th className="text-end totalPricing pt-3" style={{ borderTop: 'aliceblue' }}>
                                                <span data-oe-type="monetary" data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"><span className="oe_currency_value">{totalPlanPrice}</span>&nbsp;Rs</span>
                                            </th>
                                        </tr> */}
                      <tr>
                        <td className="w-100 pt-3 text-wrap-balance">
                          <span className="fw-bold">Total</span> / Year{" "}
                          <sup className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">
                            (*)
                          </sup>
                        </td>
                        <th
                          className="text-end totalPricing pt-3"
                          style={{ borderTop: "aliceblue" }}
                        >
                          <span
                            data-oe-type="monetary"
                            data-oe-expression="prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount']"
                          >
                            <span className="oe_currency_value">
                              {(totalPlanPrice * 12).toFixed(2)}
                            </span>
                            &nbsp;Rs
                          </span>
                        </th>
                      </tr>
                      <tr className="openerp_enterprise_user_pricing openerp_enterprise_user_pricing_yearly">
                        <th
                          colspan="2"
                          className="small totalPricingYearly w-100 pt-1 text-center text-wrap-balance"
                        >
                          (*) Billed annually:{" "}
                          <span
                            className="text-wrap-balance"
                            data-oe-type="monetary"
                            data-oe-expression="12 * (prices[is_custom and 'yearly_custom' or 'yearly_standard'] + prices[is_custom and 'yearly_custom_discount' or 'yearly_standard_discount'])"
                          >
                            <span className="oe_currency_value">
                              {formatIndianRupees(Number(totalPlanPrice * 12))}
                            </span>
                          </span>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="card-footer text-end border-top-none">
                  <div className="openerp_enterprise_pricing_hide_alert d-none text-start">
                    <p>
                      <a href="/contactus">Contact us</a> to get our cloud prices
                    </p>
                    <p>
                      Or check our prices for on premise solutions using the
                      option below.
                    </p>
                  </div>
                  <div className="alert alert-danger p1 d-none openerp_enterprise_pricing_monthly_not_allowed text-start">
                    The monthly plan is only available to cloud hosting options
                    (Standard or Odoo.sh)
                  </div>
                  <div className="openerp_enterprise_pricing_form_button d-grid gap-2 mb-3">
                    <button
                      className="btn btn-success btn-lg openerp_enterprise_pricing_buy_now py-3"
                      disabled={
                        Number(numberOfUSers) === 0 || selectPlan.length === 0
                      }
                      onClick={onShow}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegistrationPlan;
