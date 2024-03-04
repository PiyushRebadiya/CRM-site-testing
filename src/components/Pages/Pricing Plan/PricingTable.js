import React from 'react'
import TaxCRM from '../../img/crm.png'
import { FaCheckCircle } from "react-icons/fa";
import { Container } from 'react-bootstrap';
import { FaRupeeSign } from "react-icons/fa";
const PricingTable = () => {
    return (
        <Container>
            <div className='pricing-table-main'>
                <div className='row'>
                    <div className="col-xs-12 col-md-12">
                        <div className="section-header">
                            <h2>Explore the top features</h2>
                            <p>TAXCRM  is a tool that help businesses aggregate, organize, and analyze customer information data to better manage relationships with customers.</p>
                        </div>
                        <div className=' card p-4'>
                            <table className="pricing-table w-100">
                                <tbody>
                                    <tr>
                                        <td width="30%" className="pricing-table-text">
                                            <img src={TaxCRM} />
                                        </td>
                                        <td width="20%">
                                            <div className='price-section-main'>
                                                <span><FaRupeeSign /></span>
                                                <p>250/-</p>
                                            </div>
                                            <h4 style={{ fontWeight: "bold" }}>TAX MANAGEMENT</h4>
                                        </td>
                                        <td width="20%">
                                            <div className='price-section-main'>
                                                <span><FaRupeeSign /></span>
                                                <p>250/-</p>
                                            </div>
                                            <h4 style={{ fontWeight: "bold" }}>TAXCRM</h4>
                                        </td>
                                        <td width="20%">
                                            <div className='price-section-main'>
                                                <span><FaRupeeSign /></span>
                                                <p>250/-</p>
                                            </div>
                                            <h4 style={{ fontWeight: "bold" }}>TAXHRM</h4>
                                        </td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Admin Panel</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Unlimited Firm</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Unlimited Users</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Payroll</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Employee Dashboard</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Multi Department</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Salary Structure</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Attendance Management</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Leave Management</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Different Company Management</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Task Allocation Project Wise</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Shift Wise Attendance</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Inquiry Management(Leads) And Reports</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Transaction Management</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Transaction Report and Invoice</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Recruitment Management</p></td>
                                        <td></td>
                                        <td></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Kanban Board</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Campaign Module</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                    <tr className="pricing-table-list">
                                        <td><p>Auto task ( Task Scheduler )</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr> <tr className="pricing-table-list">
                                        <td><p>Perfomance Chart View</p></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td><FaCheckCircle className='checked-pricing-icon' size={15} /></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PricingTable