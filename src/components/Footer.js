import React, { useState } from 'react'
import moment from 'moment';
import { Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';

const Footer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory()
  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const handleShow = () => {
    history.push('/whatsnew')
  }
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <span><strong>Copyright © {new Date().getFullYear() - 1}-{moment(new Date()).format('YYYY')} TAXCRM.</strong> All rights reserved.</span>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <Tooltip title="What's New">
              <span onClick={handleShow} style={{ cursor: 'pointer' }}><strong>Version :</strong> 1.6.2</span>
            </Tooltip>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className='help-line-number'>
              <Tooltip title="Contact us">
                <span style={{ cursor: 'pointer' }}><strong><i class="fa fa-phone" aria-hidden="true"></i> Help Line No: :</strong> +9195100 56789</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </footer>

  )
}

export default Footer