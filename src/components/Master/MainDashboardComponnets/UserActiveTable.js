import React from 'react'

const UserActiveTable = ({ activeUser }) => {
    return (
        <div>
            <div>
                <div className="table-responsive ">
                    <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className=" back-color  info">
                                <th>#</th>
                                {/* <th  style={{ cursor: "pointer" }}>Name {sortColumn === 'Name' && sortOrder === 'asc' ? '▲' : '▼'}</th> */}
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                activeUser.map((item, index) => {
                                    return (
                                        <tr key={index} className='align_middle'>
                                            <td className='data-index '>{index + 1}</td>
                                            <td>{item.FirstName}</td>
                                            <td>{item.LastName}</td>
                                            <td className="align-middle">{item.Mobile1}</td>
                                            <td>{item.Email}</td>
                                            <td>{item.PositionName}</td>
                                            <td>{item.UserName}</td>
                                            <td>{'*'.repeat(item.Password.length)}</td>
                                            <td>{item.Role}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserActiveTable