import React from 'react'
import FooterLogo from '../img/footerlogo.png'
const LandingPagesFooter = () => {
    return (
        <div>
            {/* ======= Footer ======= */}
            <footer id="footer" className="footer">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-5 col-md-12 footer-info">
                            {/* <a href="index.html" className="logo d-flex align-items-center">
                                <span>Impact</span>
                            </a> */}
                            <img src={FooterLogo} />
                            <p>TaxCRM is a cutting-edge Customer Relationship Management (CRM) website specifically designed to streamline and enhance the tax-related processes for individuals, businesses, and accounting professionals. This innovative platform seamlessly integrates customer data management with comprehensive tax solutions, offering a robust and user-friendly interface to meet the unique needs of tax professionals and their clients.</p>
                            <div className="social-links d-flex mt-4">
                                <a href="https://twitter.com/ssrajai" className="twitter"><i className="bi bi-twitter" /></a>
                                <a href="https://www.facebook.com/pages/MonarchComputersCom/129431577118632" className="facebook"><i className="bi bi-facebook" /></a>
                                <a href="https://www.instagram.com/taxfileinvosoft/" className="instagram"><i className="bi bi-instagram" /></a>
                                <a href="https://in.linkedin.com/in/sunil-rajai?trk=people-guest_people_search-card" className="linkedin"><i className="bi bi-linkedin" /></a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6 footer-links ">
                            <h4>Our Services</h4>
                            <ul>
                                <li><a href="http://itax.taxfile.co.in/home/ITAX">Income Tax Software</a></li>
                                <li><a href="http://itax.taxfile.co.in/home/eAuditor">Audit Software</a></li>
                                <li><a href="http://itax.taxfile.co.in/home/FreedomGST">GST Software</a></li>
                                <li><a href="http://itax.taxfile.co.in/home/ourwebsite">Website Development</a></li>
                                <li><a href="http://itax.taxfile.co.in/home/Customizesoftwarepage">Customize Softawre</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-12 footer-contact text-center text-md-start">
                            <h4>Contact Us</h4>
                            {/* 601-602, 6th Floor,Shubh Square, opp.Venus Hospital, Lal Darwaja,Surat-395003. (Gujarat) */}
                            <p>
                                601-602, 6th Floor,Shubh Square,  <br />
                                opp.Venus Hospital,Lal Darwaja,<br />
                                Surat-395003. (Gujarat) <br /><br />
                                <strong>Phone:</strong> +91 95100 56789(Customer Care)<br />
                                <strong>Email:</strong>helpsurat@helpsurat.com<br />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="container mt-4">
                    <div className="copyright">
                        © Copyright <strong><span>© 2023-2024 TAXCRM.</span></strong> All Rights Reserved
                    </div>
                </div>
            </footer>{/* End Footer */}
        </div>
    )
}

export default LandingPagesFooter