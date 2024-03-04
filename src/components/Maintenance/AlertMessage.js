import React from 'react'
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';

const AlertMessage = ({data}) => {
  return (
    <div>
      <Alert
      banner
      type='warning'
      message={
        <Marquee pauseOnHover gradient={false}>
          <b>
         Site Will Be Under Maintenance Between 6:00 PM To 6:30 PM, We Will Be Right Back.
          </b>
        </Marquee>
      }
    />
    </div>
  )
}

export default AlertMessage