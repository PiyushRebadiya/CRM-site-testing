import React from 'react'
import { Link } from 'react-router-dom'
import '../style/Style.css'

function Package({ formData, setFormData }) {

    const handleInputChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked
        }));
    };

       // Set the initial state of the formData object
       React.useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            CRM: true // Set CRM to true by default
        }));
    }, []);
    
    return (
        <div className="login-wrapper reg-package-selection">
            <div className='user-selection-area-section'>
                <div className='reg-heading'>
                    <h4>Select Package</h4>
                </div>
                <div className="card border-color ">
                    <div className="card-body">

                        <div className='user-choice-headig'>
                            <label>
                                <input type='checkbox' name="CRM" checked={formData.CRM} onChange={handleInputChange} />
                                <span className="card-title">TAX Office CRM</span>
                            </label>
                        </div>

                    </div>
                </div>
                <div className="card border-color ">
                    <div className="card-body">
                        <div className='user-choice-headig'>
                            <label>
                                <input type='checkbox' name="office" checked={formData.office} onChange={handleInputChange} />
                                <span className="card-title">TAX Mangement</span>
                            </label>
                        </div>
                        {/* <p className="card-text">This is a short card.</p> */}
                    </div>
                </div>
                <div className="card  border-color">
                    <div className="card-body">
                        <div className='user-choice-headig'>
                            <label>
                                <input type='checkbox' name='HRM' checked={formData.HRM} onChange={handleInputChange} />
                                <span className="card-title">TAX HRM</span>
                            </label>
                        </div>
                        {/* <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Package