import React from 'react'
import moment from 'moment';
// import { Tag } from 'primereact/tag';
import { Tag } from 'antd';
const CompletedProjectTable = ({ completedProject }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return <Tag color='green'>Complete</Tag>
      case 'InProgress':
        return <Tag color='blue'>Running</Tag>;
      case 'Pending':
        return <Tag color='gold'>Pending</Tag>;
      default:
        return '';
    }
  };

  // const getStatusColor = (status) => {
  //   // Customize the color based on the status
  //   switch (status) {
  //     case 'InProgress':
  //       return 'blue';
  //     case 'Pending':
  //       return 'gold';
  //     case 'Complete':
  //       return 'green';
  //     default:
  //       return 'default';
  //   }
  // };

  return (
    <div>
      <div className="table-responsive">
        <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
          <thead className="back_table_color">
            <tr className=" back-color info">
              <th>#</th>
              <th>Project Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              completedProject.map((item, index) => {
                const statusColor = getStatusColor(item.Description);
                // const statusColor = (text) => {
                //   <Tag color={getStatusColor(text)} style={{ cursor: 'pointer' }}>
                //     {text} <i class="fa fa-caret-down" aria-hidden="true"></i>
                //   </Tag>
                // }
                return (
                  <tr key={index} className='align_middle'>
                    <td className='data-index'>{index + 1}</td>
                    <td>{item.ProjectName}</td>
                    <td>{statusColor}</td>
                    {/* <td> <Tag color={getStatusColor(text)} style={{ cursor: 'pointer' }}>
                      {text} <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </Tag></td> */}
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompletedProjectTable