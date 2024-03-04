import React, { useEffect } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Banner from '../img/bannercrm.png'
import CrmLogo from '../img/crm.png';
import ChirstmasLogo from '../img/ChirstmasLogo.png'
import Card1 from '../img/card1.svg'
import Card2 from '../img/card2.svg'
import Card3 from '../img/card3.svg'
import Card4 from '../img/card4.svg'
import Task1 from '../img/task1.svg'
import Task2 from '../img/task2.svg'
import Task3 from '../img/task3.svg'
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import Slider from "react-slick";
import Inquery1 from '../img/inquiry.png'
import FooterLogo from '../img/footerlogo.png'
import Reminder from '../img/rimnder.png'
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import { notification } from 'antd';
import LandingPagesFooter from './LandingPagesFooter';

function LandingPage() {
    const history = useHistory()
    const location = useLocation()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [message, setMessage] = useState("")
    const [pincode, setPincode] = useState("")
    const [AreaName, setAreaName] = useState("")
    const [CityName, setCityName] = useState("")
    const [nameValid, setNameValid] = useState(true);
    const [mobileValid, setMobileValid] = useState(true);
    const [messageValid, setMessageValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [mobileErrorMessage, setMobileErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const token = localStorage.getItem('CRMtoken')
        if (token) {
            history.push('/taskdashboard')
        }
        else {
            history.push('/')
        }
    }, [])
    const [showAll, setShowAll] = useState(false);
    const listItems = [
        " Task management is the process of managing a task through its life cycle. It involves the planning estimation, and scheduling of the task as well as the ability to track dependencies and milestones",
        "Increased productivity — helps individuals and teams stay organized and prioritize tasks, leading to increased productivity.",
        "It allows for the assignment of tasks to specific individuals  reducing the chances of tasks being overlooked or forgotten.",
        "Improved visibility — provides a clear and comprehensive view of all tasks, their status,and the people responsible for them.",
        "This makes it easier to track progress and identify any bottlenecks or roadblocks.",
        "Better time management — allows users to prioritize tasks, set deadlines, and track the amount of time spent on each task.This helps individuals and teams manage their time more effectively and  reduces the risk of missing deadlines.",
        "Calendar Integration",
        "Auto Task Assignment",
        "Performance Chart View",

    ];
    const initialDisplayCount = 3;
    const displayedItems = showAll ? listItems : listItems.slice(0, initialDisplayCount);

    const settings = {
        infinite: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false
    };
    const handleLogin = () => {
        history.push('/login')
    }
    const handleBuyPlan = () => {
        history.push('/subscription-plan')
    }

    const validateMobile = (input) => {
        const numericInput = input.replace(/\D/g, '');
        return numericInput.length === 10;
    };
    const getEmailsend = async (email, name) => {
        try {
            const res = await axios.post(URL + `/api/Master/SendContactusMail?Cguid=${name}&Transmode=ContactUs&CEmail=${email}`)
        } catch (error) {
            console.log(error)
        }
    }

    const validateEmail = (input) => {
        // You can use a simple regex for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (name && mobile && message) {
                const res = await axios.post(URL + '/api/Master/ContactUs', {
                    Name: name,
                    Email: email,
                    Mobile: mobile,
                    Message: message,
                    AreaName: AreaName,
                    City: CityName,
                    Pincode: pincode

                })
                if (res.data.Success == true) {
                    if (email) {
                        getEmailsend(email, name)
                    }
                    setMessage('')
                    setMobile('')
                    setEmail('')
                    setName('')
                    setPincode('')
                    setAreaName('')
                    setCityName('')

                    notification.success({
                        message: 'Thank You We Will Contact You Soon !!',
                        placement: 'bottomRight',
                        duration: 3,
                    });
                }
            } else {
                // notification.error({
                //     message: 'Please fill up Name and Mobile No.!!',
                //     placement: 'bottomRight',
                //     duration: 2,
                // });
                setNameValid(!!name);
                setMobileValid(validateMobile(mobile));
                setMessageValid(!!message);

                if (!mobile) {
                    setMobileErrorMessage('Mobile number is required');
                } else if (!validateMobile(mobile)) {
                    setMobileErrorMessage('Invalid mobile number (10 digits required)');
                } else {
                    setMobileErrorMessage('');
                }

                // Validate the email field separately
                if (email && !validateEmail(email)) {
                    setEmailValid(false);
                    setEmailErrorMessage('Invalid email address');
                } else {
                    setEmailValid(true);
                    setEmailErrorMessage('');
                }
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>

            {/* ======= Header ======= */}
            <section id="topbar" className="topbar d-flex align-items-center">
                <div className="container d-flex justify-content-center justify-content-md-between">
                    <div className="contact-info d-flex align-items-center">
                        <i className="bi bi-envelope d-flex align-items-center"><span>helpsurat@helpsurat.com</span></i>
                        <i className="bi bi-phone d-flex align-items-center ms-4"><span>+91 95100 56789 <span className='display-mobile-none'>(Customer Care)</span></span></i>
                    </div>
                    <div className="social-links d-none d-md-flex align-items-center">
                        <a href="https://twitter.com/ssrajai" className="twitter"><i className="bi bi-twitter" /></a>
                        <a href="https://www.facebook.com/pages/MonarchComputersCom/129431577118632" className="facebook"><i className="bi bi-facebook" /></a>
                        <a href="https://www.instagram.com/taxfileinvosoft/" className="instagram"><i className="bi bi-instagram" /></a>
                        <a href="https://in.linkedin.com/in/sunil-rajai?trk=people-guest_people_search-card" className="linkedin"><i className="bi bi-linkedin" /></a>
                    </div>
                </div>
            </section>{/* End Top Bar */}
            <header id="header" className="header d-flex align-items-center">
                <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                    <a href="#" className="logo d-flex align-items-center">
                        {/* Uncomment the line below if you also wish to use an image logo */}
                        <img src={CrmLogo} alt="" />
                        {/* <img src={ChirstmasLogo}/> */}
                    </a>
                    <div>

                        {/* <button className='login-btn-landing-pages mr-3' onClick={handleBuyPlan}>Buy Plan</button> */}
                        <button className='login-btn-landing-pages' onClick={handleLogin}>Get Started</button>
                    </div>

                    {/* <i className="mobile-nav-toggle mobile-nav-show bi bi-list" />
                    <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x" /> */}
                </div>
            </header>{/* End Header */}
            {/* End Header */}
            {/* ======= Hero Section ======= */}
            <section id="hero" className="hero">
                <div className="container position-relative">
                    <div className="row gy-5" data-aos="fade-in">
                        <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center text-center text-lg-start">
                            <h2><span>H</span>appy <span>C</span>ustomers, <span>A</span>mazing <span>B</span>usiness.</h2>
                            <p className='banner-text'>Providing good relations to your customers,Transforming client and customer relationships for the better.</p>
                            {/* <div className="d-flex justify-content-center justify-content-lg-start">
                                <button className='buy-now-btn'>Buy Now</button>
                            </div> */}
                        </div>
                        <div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2">
                            {/* <img src="assets/img/hero-img.svg" className="img-fluid" alt data-aos="zoom-out" data-aos-delay={100} /> */}
                            <img src={Banner} className="img-fluid" alt data-aos="zoom-out" data-aos-delay={100} />
                        </div>
                    </div>
                </div>
                {/* <div className="icon-boxes position-relative">
                    <div className="container position-relative">
                        <div className="row gy-4 mt-5">
                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay={100}>
                                <div className="icon-box">
                                    <div className="icon"><i className="bi bi-easel" /></div>
                                    <h4 className="title"><a href className="stretched-link">Reports & DashBoards</a></h4>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay={200}>
                                <div className="icon-box">
                                    <div className="icon"><i className="bi bi-gem" /></div>
                                    <h4 className="title"><a href className="stretched-link">Task Management</a></h4>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay={300}>
                                <div className="icon-box">
                                    <div className="icon"><i className="bi bi-geo-alt" /></div>
                                    <h4 className="title"><a href className="stretched-link">Mobile CRM</a></h4>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay={500}>
                                <div className="icon-box">
                                    <div className="icon"><i className="bi bi-command" /></div>
                                    <h4 className="title"><a href className="stretched-link">Communication
                                        With Client</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className='icon-card-main-section'>
                    <Container>
                        <Row>
                            <Col lg={3} md={6}>
                                <div className='icon-card-main'>
                                    <div className='icon-img-section'>
                                        <img src={Card1} />
                                    </div>
                                    <div className='icon-text-card'>
                                        <p>Unlimited<br />Firms</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3} md={6}>
                                <div className='icon-card-main'>
                                    <div className='icon-img-section'>
                                        <img src={Card2} />
                                    </div>
                                    <div className='icon-text-card'>
                                        <p>Unlimited<br />Users</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3} md={6}>
                                <div className='icon-card-main'>
                                    <div className='icon-img-section'>
                                        <img src={Card3} />
                                    </div>
                                    <div className='icon-text-card'>
                                        <p>Role Wise<br /> Rights</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={3} md={6}>
                                <div className='icon-card-main'>
                                    <div className='icon-img-section'>
                                        <img src={Card4} />
                                    </div>
                                    <div className='icon-text-card'>
                                        <p>Multi Department<br />Positions</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
            {/* End Hero Section */}
            <main id="main">
                {/* ======= About Us Section ======= */}
                <section id="about" className="about">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>About TaxCRM</h2>
                            <p>TAXCRM  is a tool that help businesses aggregate, organize, and analyze customer information data to better manage relationships with customers.</p>
                        </div>
                        <div className="row gy-4">
                            <div className="col-lg-6">
                                <div className='content-title-header-section'>
                                    <h3 className='landing-page-text-color'>Task & Project/Service/Work Management</h3>
                                </div>
                                {/* <img src="assets/img/about.jpg" className="img-fluid rounded-4 mb-4" alt /> */}
                                {/* <ul>
                                    <li><i className="bi bi-check-circle-fill" /> Task management is the process of managing a task through its life cycle. It involves the planning,
                                        estimation, and scheduling of the task as well as the ability to track dependencies and milestones.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Increased productivity — helps individuals and teams stay organized and prioritize tasks,
                                        leading to increased productivity. It allows for the assignment of tasks to specific individuals,
                                        reducing the chances of tasks being overlooked or forgotten.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Better collaboration — includes features for team collaboration and communication,
                                        such as shared task lists, comments, and notifications.
                                        This helps teams work together more effectively and reduces the likelihood of miscommunication.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Improved visibility — provides a clear and comprehensive view of all tasks, their status,
                                        and the people responsible for them. This makes it easier to track progress and identify any
                                        bottlenecks or roadblocks.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Better time management — allows users to prioritize tasks, set deadlines, and track the amount of
                                        time spent on each task. This helps individuals and teams manage their time more effectively and
                                        reduces the risk of missing deadlines.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Improved accountability — helps increase accountability by assigning tasks to specific individuals and
                                        tracking their progress. This makes it easier to identify who is responsible for specific tasks and hold
                                        them accountable for their completion.</li>
                                    <li><i className="bi bi-check-circle-fill" /> Calendar Integration</li>
                                    <li><i className="bi bi-check-circle-fill" /> Performance Chart View</li>
                                    <li><i className="bi bi-check-circle-fill" /> Auto Task Assignment</li>
                                </ul> */}
                                <div>
                                    {displayedItems.map((item, index) => (
                                        <p key={index}><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> {item}</p>
                                    ))}
                                </div>
                                {listItems.length > initialDisplayCount && (
                                    <button className="read-more-option" onClick={() => setShowAll(!showAll)}>
                                        {showAll ? '...Read Less' : 'Read More...'}
                                    </button>
                                )}

                            </div>
                            <div className="col-lg-6">
                                <Row>
                                    <Col xl={10} lg={12} md={12} className='ml-auto'>
                                        <div className="slider-pages-section">
                                            {/* <Carousel>
                                        <Carousel.Item interval={500}>
                                            <img src={Card1} />                                           
                                        </Carousel.Item>
                                        <Carousel.Item interval={500}>
                                            <img src={Card1} />
                                        </Carousel.Item>
                                        <Carousel.Item interval={500}>
                                            <img src={Card1} />                                       
                                        </Carousel.Item>
                                    </Carousel> */}
                                            <Slider {...settings}>
                                                <div>
                                                    <img
                                                        className="d-block w-100 "
                                                        src={Task1}
                                                        alt="First slide"
                                                    />
                                                </div>
                                                <div>
                                                    <img
                                                        className="d-block w-100"
                                                        src={Task2}
                                                        alt="Second slide"
                                                    />
                                                </div>
                                                <div>
                                                    <img
                                                        className="d-block w-100"
                                                        src={Task3}
                                                        alt="Third slide"
                                                    />
                                                </div>
                                            </Slider>
                                        </div>
                                    </Col>
                                </Row>


                            </div>
                        </div>
                        <div className='client-management-section'>
                            <div className="row gy-4">
                                <div className="col-lg-6">
                                    <Row>
                                        <Col xl={10} lg={12} md={12} className='mr-auto'>
                                            <div className='slider-img-main-section'>
                                                <div className="slider-pages-section">
                                                    <img src={Inquery1} width="100%" />
                                                    {/* <Slider {...settings}>
                                                    <div>
                                                        <img
                                                            className="d-block w-100 "
                                                            src={Task1}
                                                            alt="First slide"
                                                        />
                                                    </div>
                                                    <div>
                                                        <img
                                                            className="d-block w-100"
                                                            src={Task2}
                                                            alt="Second slide"
                                                        />
                                                    </div>
                                                    <div>
                                                        <img
                                                            className="d-block w-100"
                                                            src={Task3}
                                                            alt="Third slide"
                                                        />
                                                    </div>
                                                </Slider> */}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="col-lg-6">
                                    <div className='content-title-header-section'>
                                        <h3 className='landing-page-text-color'>Lead Management</h3>
                                    </div>
                                    <div>
                                        {/* {displayedItems.map((item, index) => (
                                            <p key={index}><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> {item}</p>
                                        ))}
                                    </div>
                                    {listItems.length > initialDisplayCount && (
                                        <button className="read-more-option" onClick={() => setShowAll(!showAll)}>
                                            {showAll ? '...Read Less' : 'Read More...'}
                                        </button>
                                    )} */}
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> To accelerate your business development, sales teams needs to continually generate new
                                            leads and increase the number of interactions with each prospect. In today’s digital age,
                                            generating a long prospect list from the internet is easier than managing them efficiently,
                                            for which you will need the right lead management tools.</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Never miss out on a follow-up Get all the information you need on one screen and sell faster.
                                            Close deals fast — whether you’re working at the office or on the road.</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Tracking leads in the sales pipeline.</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Monitor the sales team's activity</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Increase productivity</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Deadline Dashboard</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Kanban board</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='reminder-management-section'>
                            <div className="row gy-4">
                                <div className="col-lg-6">
                                    <div className='content-title-header-section'>
                                        <h3 className='landing-page-text-color'>Reminder</h3>
                                    </div>
                                    <div>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Missed appointments, administrative backlog, and client confusion can negatively impact your revenue
                                            and business image. One simple step toward better scheduling, simplified admin, and improved client retention
                                            is using appointment reminder software to track bookings, notify clients when their scheduled service is approaching, and encourage follow-up appointments.</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Client Birth Day/Anniversary/DOJ Reminders</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Schedule calls, meetings, mailings, or quotations  Reminder</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Calendar Integration</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <Row>
                                        <Col xl={10} lg={12} md={12} className='ml-auto'>
                                            <div className="slider-pages-section">
                                                <img src={Reminder} width="100%" />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        {/* <div className='client-management-section'>
                            <div className="row gy-4">
                                <div className="col-lg-6">
                                    <Row>
                                        <Col xl={10} lg={12} md={12} className='mr-auto'>                                         
                                        </Col>
                                    </Row>
                                </div>
                                <div className="col-lg-6">
                                    <div className='content-title-header-section'>
                                        <h3 className='landing-page-text-color'>Client Management</h3>
                                    </div>
                                    <div>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Store Client Information with Documents on Cloud Storage</p>
                                        <p><i className="bi bi-check-circle-fill" style={{ color: "#008374" }} /> Contact Managements</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </section>
                {/* End About Us Section */}
                {/* ======= Stats Counter Section ======= */}
                {/* <section id="stats-counter" className="stats-counter">
                    <div className="container" data-aos="fade-up">
                        <div className="row gy-4 align-items-center">
                            <div className="col-lg-6">
                                <img src="assets/img/stats-img.svg" alt className="img-fluid" />
                            </div>
                            <div className="col-lg-6">
                                <div className="stats-item d-flex align-items-center">
                                    <span data-purecounter-start={0} data-purecounter-end={232} data-purecounter-duration={1} className="purecounter" />
                                    <p><strong>Happy Clients</strong> consequuntur quae diredo para mesta</p>
                                </div>
                                <div className="stats-item d-flex align-items-center">
                                    <span data-purecounter-start={0} data-purecounter-end={521} data-purecounter-duration={1} className="purecounter" />
                                    <p><strong>Projects</strong> adipisci atque cum quia aut</p>
                                </div>
                                <div className="stats-item d-flex align-items-center">
                                    <span data-purecounter-start={0} data-purecounter-end={453} data-purecounter-duration={1} className="purecounter" />
                                    <p><strong>Hours Of Support</strong> aut commodi quaerat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* End Stats Counter Section */}
                {/* ======= Call To Action Section ======= */}
                {/* <section id="call-to-action" className="call-to-action">
                    <div className="container text-center" data-aos="zoom-out">
                        <a href="https://www.youtube.com/watch?v=LXb3EKWsInQ" className="glightbox play-btn" />
                        <h3>Call To Action</h3>
                        <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <a className="cta-btn" href="#">Call To Action</a>
                    </div>
                </section> */}
                {/* End Call To Action Section */}
                {/* ======= Our Services Section ======= */}
                <section id="services" className="services sections-bg">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>Our Services</h2>
                            <p>Welcome to TAXCRM, your one-stop solution for efficient Business management. Our services include seamless Client Management, powerful Reports for real-time insights, and user-friendly Billing solutions. Let us simplify your financial processes and empower your business for success. Contact us today to tailor these services to your unique needs</p>
                        </div>
                        <div className="row gy-4" data-aos="fade-up" data-aos-delay={100}>
                            <div className="col-xl-3 col-lg-6 col-md-6">
                                <div className='our-service-card-section'>
                                    <div className="service-item  position-relative">
                                        <div className="icon">
                                            <i className="bi bi-activity" />
                                        </div>
                                        <h3>Client Management</h3>
                                        <p>Store Client Information with Documents on Cloud Storage</p>
                                        <p>Contact Managements</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-6">
                                <div className='our-service-card-section'>
                                    <div className="service-item position-relative">
                                        <div className="icon">
                                            <i className="bi bi-broadcast" />
                                        </div>
                                        <h3>Digital Signature (DSC) Management</h3>
                                        <p>DSC Client List</p>
                                        <p>DSC Expiry Status Reminder</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-6">
                                <div className='our-service-card-section'>
                                    <div className="service-item position-relative">
                                        <div className="icon">
                                            <i className="bi bi-easel" />
                                        </div>
                                        <h3>Reports</h3>
                                        <p>Reports with data, charts, and graphs.</p>
                                        <p>Export Reports to Excel or PDF.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6 col-md-6">
                                <div className='our-service-card-section'>
                                    <div className="service-item position-relative">
                                        <div className="icon">
                                            <i className="bi bi-bounding-box-circles" />
                                        </div>
                                        <h3>Billing</h3>
                                        <p>Invoicing Management (Proforma/Sales Bill/Receipt)</p>
                                        <p>Expenses Management</p>
                                        <p>Inventory Management</p>
                                        <p>Outstanding Register</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Our Services Section */}
                {/* ======= Testimonials Section ======= */}
                {/* End Testimonials Section */}
                {/* ======= Portfolio Section ======= */}
                {/* End Portfolio Section */}
                {/* ======= Our Team Section ======= */}
                {/* <section id="team" className="team">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>Our Team</h2>
                            <p>Nulla dolorum nulla nesciunt rerum facere sed ut inventore quam porro nihil id ratione ea sunt quis dolorem dolore earum</p>
                        </div>
                        <div className="row gy-4">
                            <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay={100}>
                                <div className="member">
                                    <img src="assets/img/team/team-1.jpg" className="img-fluid" alt />
                                    <h4>Walter White</h4>
                                    <span>Web Development</span>
                                    <div className="social">
                                        <a href><i className="bi bi-twitter" /></a>
                                        <a href><i className="bi bi-facebook" /></a>
                                        <a href><i className="bi bi-instagram" /></a>
                                        <a href><i className="bi bi-linkedin" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay={200}>
                                <div className="member">
                                    <img src="assets/img/team/team-2.jpg" className="img-fluid" alt />
                                    <h4>Sarah Jhinson</h4>
                                    <span>Marketing</span>
                                    <div className="social">
                                        <a href><i className="bi bi-twitter" /></a>
                                        <a href><i className="bi bi-facebook" /></a>
                                        <a href><i className="bi bi-instagram" /></a>
                                        <a href><i className="bi bi-linkedin" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay={300}>
                                <div className="member">
                                    <img src="assets/img/team/team-3.jpg" className="img-fluid" alt />
                                    <h4>William Anderson</h4>
                                    <span>Content</span>
                                    <div className="social">
                                        <a href><i className="bi bi-twitter" /></a>
                                        <a href><i className="bi bi-facebook" /></a>
                                        <a href><i className="bi bi-instagram" /></a>
                                        <a href><i className="bi bi-linkedin" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay={400}>
                                <div className="member">
                                    <img src="assets/img/team/team-4.jpg" className="img-fluid" alt />
                                    <h4>Amanda Jepson</h4>
                                    <span>Accountant</span>
                                    <div className="social">
                                        <a href><i className="bi bi-twitter" /></a>
                                        <a href><i className="bi bi-facebook" /></a>
                                        <a href><i className="bi bi-instagram" /></a>
                                        <a href><i className="bi bi-linkedin" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* End Our Team Section */}
                {/* ======= Pricing Section ======= */}
                {/* <section id="pricing" className="pricing sections-bg">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>Pricing</h2>
                            <p>Aperiam dolorum et et wuia molestias qui eveniet numquam nihil porro incidunt dolores placeat sunt id nobis omnis tiledo stran delop</p>
                        </div>
                        <div className="row g-4 py-lg-5" data-aos="zoom-out" data-aos-delay={100}>
                            <div className="col-lg-4">
                                <div className="pricing-item">
                                    <h3>Free Plan</h3>
                                    <div className="icon">
                                        <i className="bi bi-box" />
                                    </div>
                                    <h4><sup>$</sup>0<span> / month</span></h4>
                                    <ul>
                                        <li><i className="bi bi-check" /> Quam adipiscing vitae proin</li>
                                        <li><i className="bi bi-check" /> Nec feugiat nisl pretium</li>
                                        <li><i className="bi bi-check" /> Nulla at volutpat diam uteera</li>
                                        <li className="na"><i className="bi bi-x" /> <span>Pharetra massa massa ultricies</span></li>
                                        <li className="na"><i className="bi bi-x" /> <span>Massa ultricies mi quis hendrerit</span></li>
                                    </ul>
                                    <div className="text-center"><a href="#" className="buy-btn">Buy Now</a></div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="pricing-item featured">
                                    <h3>Business Plan</h3>
                                    <div className="icon">
                                        <i className="bi bi-airplane" />
                                    </div>
                                    <h4><sup>$</sup>29<span> / month</span></h4>

                                    <ul>
                                        <li><i className="bi bi-check" /> Quam adipiscing vitae proin</li>
                                        <li><i className="bi bi-check" /> Nec feugiat nisl pretium</li>
                                        <li><i className="bi bi-check" /> Nulla at volutpat diam uteera</li>
                                        <li><i className="bi bi-check" /> Pharetra massa massa ultricies</li>
                                        <li><i className="bi bi-check" /> Massa ultricies mi quis hendrerit</li>
                                    </ul>
                                    <div className="text-center"><a href="#" className="buy-btn">Buy Now</a></div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="pricing-item">
                                    <h3>Developer Plan</h3>
                                    <div className="icon">
                                        <i className="bi bi-send" />
                                    </div>
                                    <h4><sup>$</sup>49<span> / month</span></h4>
                                    <ul>
                                        <li><i className="bi bi-check" /> Quam adipiscing vitae proin</li>
                                        <li><i className="bi bi-check" /> Nec feugiat nisl pretium</li>
                                        <li><i className="bi bi-check" /> Nulla at volutpat diam uteera</li>
                                        <li><i className="bi bi-check" /> Pharetra massa massa ultricies</li>
                                        <li><i className="bi bi-check" /> Massa ultricies mi quis hendrerit</li>
                                    </ul>
                                    <div className="text-center"><a href="#" className="buy-btn">Buy Now</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* End Pricing Section */}
                {/* ======= Frequently Asked Questions Section ======= */}
                {/* <section id="faq" className="faq">
                    <div className="container" data-aos="fade-up">
                        <div className="row gy-4">
                            <div className="col-lg-4">
                                <div className="content px-xl-5">
                                    <h3>Frequently Asked <strong>Questions</strong></h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="accordion accordion-flush" id="faqlist" data-aos="fade-up" data-aos-delay={100}>
                                    <div className="accordion-item">
                                        <h3 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-1">
                                                <span className="num">1.</span>
                                                Non consectetur a erat nam at lectus urna duis?
                                            </button>
                                        </h3>
                                        <div id="faq-content-1" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                            <div className="accordion-body">
                                                Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h3 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-2">
                                                <span className="num">2.</span>
                                                Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque?
                                            </button>
                                        </h3>
                                        <div id="faq-content-2" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                            <div className="accordion-body">
                                                Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h3 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-3">
                                                <span className="num">3.</span>
                                                Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi?
                                            </button>
                                        </h3>
                                        <div id="faq-content-3" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                            <div className="accordion-body">
                                                Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h3 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-4">
                                                <span className="num">4.</span>
                                                Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla?
                                            </button>
                                        </h3>
                                        <div id="faq-content-4" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                            <div className="accordion-body">
                                                Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h3 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-5">
                                                <span className="num">5.</span>
                                                Tempus quam pellentesque nec nam aliquam sem et tortor consequat?
                                            </button>
                                        </h3>
                                        <div id="faq-content-5" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                            <div className="accordion-body">
                                                Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit turpis cursus in
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* End Frequently Asked Questions Section */}
                {/* ======= Recent Blog Posts Section ======= */}
                {/* <section id="recent-posts" className="recent-posts sections-bg">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>Recent Blog Posts</h2>
                            <p>Consequatur libero assumenda est voluptatem est quidem illum et officia imilique qui vel architecto accusamus fugit aut qui distinctio</p>
                        </div>
                        <div className="row gy-4">
                            <div className="col-xl-4 col-md-6">
                                <article>
                                    <div className="post-img">
                                        <img src="assets/img/blog/blog-1.jpg" alt className="img-fluid" />
                                    </div>
                                    <p className="post-category">Politics</p>
                                    <h2 className="title">
                                        <a href="blog-details.html">Dolorum optio tempore voluptas dignissimos</a>
                                    </h2>
                                    <div className="d-flex align-items-center">
                                        <img src="assets/img/blog/blog-author.jpg" alt className="img-fluid post-author-img flex-shrink-0" />
                                        <div className="post-meta">
                                            <p className="post-author">Maria Doe</p>
                                            <p className="post-date">
                                                <time dateTime="2022-01-01">Jan 1, 2022</time>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div className="col-xl-4 col-md-6">
                                <article>
                                    <div className="post-img">
                                        <img src="assets/img/blog/blog-2.jpg" alt className="img-fluid" />
                                    </div>
                                    <p className="post-category">Sports</p>
                                    <h2 className="title">
                                        <a href="blog-details.html">Nisi magni odit consequatur autem nulla dolorem</a>
                                    </h2>
                                    <div className="d-flex align-items-center">
                                        <img src="assets/img/blog/blog-author-2.jpg" alt className="img-fluid post-author-img flex-shrink-0" />
                                        <div className="post-meta">
                                            <p className="post-author">Allisa Mayer</p>
                                            <p className="post-date">
                                                <time dateTime="2022-01-01">Jun 5, 2022</time>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div className="col-xl-4 col-md-6">
                                <article>
                                    <div className="post-img">
                                        <img src="assets/img/blog/blog-3.jpg" alt className="img-fluid" />
                                    </div>
                                    <p className="post-category">Entertainment</p>
                                    <h2 className="title">
                                        <a href="blog-details.html">Possimus soluta ut id suscipit ea ut in quo quia et soluta</a>
                                    </h2>
                                    <div className="d-flex align-items-center">
                                        <img src="assets/img/blog/blog-author-3.jpg" alt className="img-fluid post-author-img flex-shrink-0" />
                                        <div className="post-meta">
                                            <p className="post-author">Mark Dower</p>
                                            <p className="post-date">
                                                <time dateTime="2022-01-01">Jun 22, 2022</time>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* End Recent Blog Posts Section */}
                {/* ======= Contact Section ======= */}
                <section id="contact" className="contact">
                    <div className="container" data-aos="fade-up">
                        <div className="section-header">
                            <h2>Contact Us</h2>
                            <p>Connect with TAXCRM your gateway to personalized financial solutions. Our dedicated team is here to assist you on your journey to financial success.</p>
                        </div>
                        <div className="row gx-lg-0 gy-4">
                            <div className="col-lg-4">
                                <div className="info-container d-flex flex-column align-items-center justify-content-center">
                                    <div className="info-item d-flex">
                                        <a href='https://maps.app.goo.gl/4HMv962FjNBPsri19'><i className="bi bi-geo-alt flex-shrink-0" /></a>
                                        <div>
                                            <h4>Location:</h4>
                                            <p>601-602, 6th Floor,Shubh Square, opp.Venus Hospital, Lal Darwaja,Surat-395003. (Gujarat)</p>
                                        </div>
                                    </div>
                                    <div className="info-item d-flex">
                                        <i className="bi bi-envelope flex-shrink-0" />
                                        <div>
                                            <h4>Email:</h4>
                                            <p>helpsurat@helpsurat.com</p>
                                        </div>
                                    </div>
                                    <div className="info-item d-flex">
                                        <i className="bi bi-phone flex-shrink-0" />
                                        <div>
                                            <h4>Call:</h4>
                                            <p>+91 95100 56789 (IVR 20 lines)</p>
                                        </div>
                                    </div>
                                    <div className="info-item d-flex">
                                        <i className="bi bi-clock flex-shrink-0" />
                                        <div>
                                            <h4>Open Hours:</h4>
                                            <p>Mon-Sat: 10:00 AM - 8:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div
                                    className='php-email-form border'
                                    style={{
                                        border: !nameValid || !mobileValid || !messageValid ? '1px solid red' : '1px solid #ced4da',
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input type="text" name="name" value={name} className="form-control" style={{
                                                border: !nameValid ? '1px solid red' : '1px solid #ced4da',
                                            }} id="name" onChange={(event) => {
                                                const input = event.target.value;
                                                const limitedInput = input.slice(0, 45);
                                                setName(limitedInput)
                                                setNameValid(true)
                                            }} placeholder="Enter Name" required />
                                            {!nameValid && <div style={{ color: 'red' }}>Name is required</div>}
                                        </div>
                                        <div className="col-md-6 form-group mt-3 mt-md-0">
                                            <input type="email" className="form-control" style={{
                                                border: !emailValid ? '1px solid red' : '1px solid #ced4da',
                                            }} value={email} name="email" onChange={(event) => {
                                                const input = event.target.value;
                                                const limitedInput = input.slice(0, 45);
                                                setEmail(limitedInput)
                                                setEmailValid(true)
                                            }} id="email" placeholder="Enter Email" required />
                                            {!emailValid && <div style={{ color: 'red' }}>{emailErrorMessage}</div>}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className=" col-md-6 form-group mt-3">
                                            <input type="text" className="form-control" style={{
                                                border: !mobileValid ? '1px solid red' : '1px solid #ced4da',
                                            }} name="subject" id="subject" value={mobile} onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = Number(numericInput.slice(0, 10)).toString();
                                                const dummy = limitedInput === '0' ? '' : limitedInput
                                                setMobile(dummy)
                                                setMobileValid(true);
                                            }}
                                                placeholder="Enter Mobile No." required />
                                            {!mobileValid && <div style={{ color: 'red' }}>{mobileErrorMessage || 'Mobile No. is required'}</div>}
                                        </div>
                                        <div className=" col-md-6 form-group mt-3">
                                            <input className="form-control" text="number" placeholder="Enter Pincode" value={pincode} onChange={(event) => {
                                                const input = event.target.value;
                                                const numericInput = input.replace(/\D/g, '');
                                                const limitedInput = numericInput.slice(0, 6);
                                                setPincode(limitedInput);
                                            }}
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className=" col-md-6 form-group mt-3">
                                            <input type="text" className="form-control" name="AreaName" id="AreaName" value={AreaName}
                                                onChange={(event) => {
                                                    const input = event.target.value;
                                                    const limitedInput = input.slice(0, 45);
                                                    setAreaName(limitedInput)
                                                }}

                                                placeholder="Enter AreaName" required />
                                        </div>
                                        <div className=" col-md-6 form-group mt-3">
                                            <input className="form-control" text="text" placeholder="Enter City Name" value={CityName}
                                                onChange={(event) => {
                                                    const input = event.target.value;
                                                    const limitedInput = input.slice(0, 45);
                                                    setCityName(limitedInput)
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mt-3">
                                        <textarea className="form-control" style={{
                                            border: !messageValid ? '1px solid red' : '1px solid #ced4da',
                                        }} name="message" rows={7} value={message} placeholder="Enter Message" onChange={(event) => {
                                            setMessage(event.target.value)
                                            setMessageValid(true)
                                        }} required defaultValue={""} />
                                        {!messageValid && <div style={{ color: 'red' }}>Message is required</div>}
                                    </div>
                                    {/* <div className="my-3">
                                        <div className="loading">Loading</div>
                                        <div className="error-message" />
                                        <div className="sent-message">Your message has been sent. Thank you!</div>
                                    </div> */}
                                    <div className="text-center"><button type="submit" onClick={handleSubmit} disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button></div>
                                </div>
                            </div>{/* End Contact Form */}
                        </div>
                    </div>
                </section>
                {/* End Contact Section */}
            </main>{/* End #main */}
            {/* ======= Footer ======= */}
            {/* Start Footer */}
            <LandingPagesFooter />
            {/* End Footer */}
        </div>

    )
}

export default LandingPage