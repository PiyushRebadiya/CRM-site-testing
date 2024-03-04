import React, { useState } from 'react'
import AlertMessage from './AlertMessage'
const Maintenance = () => {
    const [message,setMessage] = useState('')
    const DataSubmit=()=>{
    const Marquee = message
    }
    return (
        <div className='content-wrapper'>
            <div className="row">
                {/* Form controls */}
                <div className="col-sm-12">
                    <div className="lobicard all_btn_card" id="lobicard-custom-control1" data-sortable="true">
                        <div className='card lobicard ' style={{ height: "307px" }}>
                            <div className="card-header">
                                <div className="card-title custom_title">
                                    <h4>Maintenance</h4>
                                </div>
                            </div>
                            <AlertMessage data={message}/>
                            <div className="card-body">
                                <div className='form-input-padding'>
                                    <div className="form-group">
                                        <label>Add Message :</label>
                                        <textarea className='form-control' onChange={(e)=>setMessage(e.target.value)} >
                                        </textarea>
                                    </div>
                                </div>
                                <div className="reset-button">
                                    <button className="btn btn-primary m-2" onClick={DataSubmit} >Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Maintenance