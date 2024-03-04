import React, { useEffect,useState} from 'react'
import PositionMaster from '../positionMaster/PositionMaster'
import DepartmentMaster from '../departmentMaster/DepartmentMaster'
import axios from 'axios'
const DepartmentMain = () => {
  const [projectdata, setProjectData] = useState([])
  const cusId=localStorage.getItem('CRMCustId')
  const CompanyId=localStorage.getItem('CRMCompanyId')
  const token=localStorage.getItem('CRMtoken')
  const URL=process.env.REACT_APP_API_URL
  const getProjectData = async () => {
    try {
        const res = await axios.get(URL + `/api/Master/DepartmentList?CustId=${cusId}&CompanyId=${CompanyId}`, {
            headers: { Authorization: `bearer ${token}` }
        })
        setProjectData(res.data)
    } catch (error) {
        console.log(error)
    }
}
useEffect(()=>{
  getProjectData()
},[])
  return (
    <div className='content-wrapper'>
        <div className='department-position-main'>
            <DepartmentMaster getProjectData={getProjectData}/>
            <PositionMaster projectdata={projectdata}/>
        </div>
    </div>
  )
}

export default DepartmentMain