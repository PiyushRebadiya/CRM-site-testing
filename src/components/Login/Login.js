import React, { useState, useEffect } from 'react'
import "../style/Style.css"
import { Link } from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {notification } from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CrmLogo from '../img/crm.png'
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Slider1 from '../img/slider1.png'
import Slider2 from '../img/slider2.png'
import Slider3 from '../img/slider3.png'
import Slider4 from '../img/slider4.png'
import LoginLogo1 from '../img/logincard1.png'
import LoginLogo2 from '../img/logincard2.png'
import LoginLogo3 from '../img/logincard3.png'
import LoginLogo4 from '../img/logincard4.png'
import Slider from "react-slick";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setuser] = useState(false)
  const [admin, setAdmin] = useState(true)
  const [mobilepsw, setMobilePsw] = useState("")

  const URL = process.env.REACT_APP_API_URL;
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('CRMtoken')
    if (token) {
      history.push('/taskdashboard')
    }
    else {
      history.push('/login')
    }
  }, [])

  const RunautoTask = () => {
    try {
      const res = axios.get(URL + '/api/Master/RunAutoTask')
    } catch (error) {
      console.log(error)
    }
  }
  const userLogin = () => {
    if (user == true) {
      axios.post(URL + "/api/Token/EmpLogin", {
        Username: userName,
        Password: password,
        // Mobile1:mobilepsw
      })
        .then((response) => {
          // Handle successful login
          if (response.data.success === true) {
            localStorage.setItem("CRMUsername", response.data.UserName)
            localStorage.setItem("CRMRole", response.data.Role)
            localStorage.setItem("CRMtoken", response.data.token)
            localStorage.setItem("CRMUserId", response.data.Id)
            localStorage.setItem("CRMCustId", response.data.CustId)
            localStorage.setItem("CRMCGUID", response.data.Cguid)
            notification.success({
              message: 'Login User successfully',
              placement: 'top',
              duration: 1,
            });
            if (response.data.CRM == true && response.data.HRM == true) {
              history.push('/packageselection')
              return
            } else if (response.data.CRM == true && response.data.Officeman == true || response.data.CRM == true || response.data.Officeman == true) {
              RunautoTask()
              return history.push('/taskdashboard')
            } else if (response.data.HRM == true) {
              const Role = response.data.Role == 'Admin' ? true : false
              const id = response.data.Id
              const custid = response.data.CustId
              const encodedValue = btoa(`CustId=${custid}&&Role=${Role}&&id=${id}`)
              localStorage.clear()
              window.location.href = `https://hrm.taxfile.co.in/attendance?${encodedValue}`
              // window.location.href = `http://localhost:3000/attendance?${encodedValue}`
            } else {
              return history.push('/taskdashboard')
            }

          } else {
            // Handle incorrect username or password here
            notification.error({
              message: 'No User Found !!!',
              placement: 'top', // You can adjust the placement
              duration: 1, // Adjust the duration as needed
            });
          }
        })
    }
    else {
      axios.post(URL + "/api/Token/Login", {
        Username: userName,
        Password: password,
        // Mobile:mobilepsw
      })
        .then((response) => {
          // Handle successful login
          if (response.data.success === true) {
            localStorage.setItem("CRMUsername", response.data.Username)
            localStorage.setItem("CRMRole", response.data.Role)
            localStorage.setItem("CRMtoken", response.data.token)
            localStorage.setItem("CRMUserId", response.data.Id)
            localStorage.setItem("CRMCustId", response.data.CustId)
            localStorage.setItem("CRMCGUID", response.data.Cguid)
            // Use Ant Design notification.success() for successful login
            notification.success({
              message: 'Login Admin successfully',
              placement: 'top',
              duration: 1,
            });
            if (response.data.CRM == true && response.data.HRM == true) {
              history.push('/packageselection')
              return
            } else if (response.data.CRM == true && response.data.Officeman == true || response.data.CRM == true || response.data.Officeman == true) {
              RunautoTask()
              return history.push('/taskdashboard')
            } else if (response.data.HRM == true) {
              const Role = response.data.Role == 'Admin' ? true : false
              const id = response.data.Id
              const URL = response.data.CustId
              const encodedValue = btoa(`CustId=${URL}&&Role=${Role}&&id=${id}`)
              localStorage.clear()
              window.location.href = `https://hrm.taxfile.co.in/attendance?${encodedValue}`
              // window.location.href = `http://localhost:3000/attendance?${encodedValue}`
            } else {
              return history.push('/taskdashboard')
            }

          } else {
            // Handle incorrect username or password here
            notification.error({
              message: 'No User Found !!!',
              placement: 'top', // You can adjust the placement
              duration: 1, // Adjust the duration as needed
            });
          }
        })
    }
  }

  useEffect(() => {
    if (!userName || !password) {
      const handleKeyDown = (event) => {
        if (event.key && event.key.toLowerCase() === 'enter') {
          event.preventDefault();
          notification.error({
            message: 'Enter Username and Password',
            placement: 'top',
            duration: 1,
          });
        }
      };

      // Add event listener when the component mounts
      window.addEventListener('keydown', handleKeyDown);

      // Remove event listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

  }, [!userName, !password,admin]);

  useEffect(() => {
    if (userName && password) {
      const handleKeyDown = (event) => {
        if (event.key && event.key.toLowerCase() === 'enter') {
          event.preventDefault();
          userLogin();
        }
      };

      // Add event listener when the component mounts
      window.addEventListener('keydown', handleKeyDown);

      // Remove event listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

  }, [userName, password,admin]);

  const handleAdmin = () => {
    setuser(false)
    setAdmin(true)

  }
  const handleUser = () => {
    setAdmin(false)
    setuser(true)
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const settings = {
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false
  };
  return (
    <div className='main-pages'>
      <div className='main-login'>
        <Container>
          {/* <Row>
            <Col lg={5}>
              <div className='login-logo-section'>
                <img src={CrmLogo} />
              </div>
            </Col>
          </Row> */}
          <div className='login-section'>
            <Row>
              <Col lg={5} md={12}>
                <div className='login-form-main-section'>
                  <div className='login-logo-section' style={{ cursor: 'pointer' }} onClick={() => {
                    history.push('/');
                  }}>
                    <img src={CrmLogo} />
                  </div>
                  <div className='login-form-input-section'>
                    <div className='admin-user-login-btn w-100'>
                      <div className='custome-btn w-50'>
                        {/* <button className='user-selection-btn w-100' onClick={handleAdmin}>Admin</button> */}
                        <button className={admin == true ? 'admin-selected-btn w-100' : 'admin-selection-btn w-100'} onClick={handleAdmin}>Admin</button>
                      </div>
                      <div className='custome-btn w-50'>
                        <button className={user == true ? 'user-selected-btn w-100' : 'user-selection-btn w-100'} onClick={handleUser}>User</button>
                      </div>
                    </div>
                    <div className='login-form-main'>
                      <h3>Login</h3>
                      <p>Please enter your credentials to login.</p>
                    </div>
                    <div className='login-input-form'>
                      <div className='user-input'>
                        <span><FaUser /></span>
                        <input
                          type="text"
                          id="username"
                          placeholder='Enter UserName'
                          className="input-text"
                          value={userName}
                          // onChange={(event) => setUserName(event.target.value)}
                          onChange={(event) => {
                            setUserName(event.target.value);
                          }}
                        />
                      </div>
                    </div>
                    {/* <div className='login-input-form'>
                      <div className='user-input'>
                        <span><MdCall /></span>
                        <input
                          type="text"
                          id="username"
                          placeholder='Enter Mobile No'
                          className="input-text"
                          value={mobilepsw}
                          onChange={(event) => {
                            const input = event.target.value;
                            const numericInput = input.replace(/\D/g, '');
                            const limitedInput = numericInput.slice(0, 10);
                            setMobilePsw(limitedInput);
                          }}
                        />
                      </div>
                    </div> */}
                    <div className='login-input-psw-form'>
                      <div className='user-input'>
                        <span><RiLockPasswordFill /></span>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder='Enter Password'
                          className='input-text'
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                          className="psw-show-icon"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                      </div>
                      <div className="input-group-append ml-2">
                      </div>
                    </div>
                    <div className='login-btn-section'>
                      <button className=" login-btn" onClick={userLogin}>Login</button>
                      {
                        admin == true ? (<Link to="/register" className="register-btn">
                          Create Account
                        </Link>) : null
                      }
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={7} md={12}>
                <div className='crm-section-main'>
                  <Slider {...settings}>
                    <div>
                      <img
                        className="d-block w-100"
                        src={Slider1}
                        alt="First slide"
                      />
                    </div>
                    <div>
                      <img
                        className="d-block w-100"
                        src={Slider2}
                        alt="Second slide"
                      />
                    </div>
                    <div>
                      <img
                        className="d-block w-100"
                        src={Slider3}
                        alt="Third slide"
                      />
                    </div>
                    <div>
                      <img
                        className="d-block w-100"
                        src={Slider4}
                        alt="Four slide"
                      />
                    </div>
                  </Slider>
                </div>
              </Col>
            </Row>
          </div>
          <div className='login-card-section-main'>
            <Container>
              <Row>
                <Col xl={3} lg={4} md={6}>
                  <div className='login-section-card'>
                    <div className='logo-login-img-section'>
                      <img src={LoginLogo1} />
                    </div>
                    <div className='logo-text-section'>
                      <p>Communication<br /> With Client</p>
                    </div>
                  </div>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <div className='login-section-card'>
                    <div className='logo-login-img-section'>
                      <img src={LoginLogo2} />
                    </div>
                    <div className='logo-text-section'>
                      <p>Analysis Report For<br />Business And Finance</p>
                    </div>
                  </div>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <div className='login-section-card'>
                    <div className='logo-login-img-section'>
                      <img src={LoginLogo3} />
                    </div>
                    <div className='logo-text-section'>
                      <p>Increase Your <br /> Work Strength</p>
                    </div>
                  </div>
                </Col>
                <Col xl={3} lg={4} md={6}>
                  <div className='login-section-card'>
                    <div className='logo-login-img-section'>
                      <img src={LoginLogo4} />
                    </div>
                    <div className='logo-text-section'>
                      <p>Potential Of Money<br /> And Work</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Login