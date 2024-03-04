import React, { useState } from 'react'
import '../style/Style.css'
import { useHistory } from 'react-router-dom'

const PackageSelect = () => {
    const [status, setStatus] = useState("")
    const history = useHistory()
    const handleNavigate = () => {
        if (status == 'HRM') {
            const Role = localStorage.getItem('CRMRole') == 'Admin' ? true : false
            const id = localStorage.getItem('CRMUserId')
            const URL = localStorage.getItem('CRMCustId')
            const encodedValue = btoa(`CustId=${URL}&&Role=${Role}&&id=${id}`)
            const decode = atob(encodedValue)
            localStorage.clear()
            window.location.href = `https://hrm.taxfile.co.in/attendance?${encodedValue}`
            // window.location.href = `http://localhost:3000/attendance?${encodedValue}`
        } else {
            history.push('/taskdashboard')
        }
    }
    return (
        <div className='main-registration'>
            <div className="login-wrapper ">
                <div className='container-center lg'>
                    <div className='login-area'>
                        <div className='user-selection-area-section'>
                            <div className='reg-heading'>
                                <h4>Select Package</h4>
                            </div>
                            <div className="card border-color ">
                                <div className="card-body">
                                    <div className='user-choice-headig'>
                                        <label>
                                            <input type='radio' value="CRM" name="select" onChange={(event) => { setStatus(event.target.value) }} />
                                            <span className="card-title">TAX Office CRM</span>
                                        </label>
                                    </div>
                                    {/* <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p> */}
                                </div>
                            </div>
                            <div className="card  border-color">
                                <div className="card-body">
                                    <div className='user-choice-headig'>
                                        <label>
                                            <input type='radio' name='select' value="HRM" onChange={(event) => { setStatus(event.target.value) }} />
                                            <span className="card-title">TAX HRM</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <button className='submit-btn-reg' disabled={!status} onClick={handleNavigate}>Navigate</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PackageSelect