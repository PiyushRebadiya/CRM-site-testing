import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import Swal from 'sweetalert2';

const Menulist = ({ insertData }) => {
  React.useEffect(() => {
    insertData.current = fetchData
  }, [])
  const [data, setData] = useState([])
  const token = localStorage.getItem("CRMtoken")
  const URL = process.env.REACT_APP_API_URL

  const fetchData = async () => {
    try {
      const res = await axios.get(URL + '/api/Master/GetMenuList', {
        headers: { Authorization: `bearer ${token}` }
      })
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  // const showAlert = (id) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteData(id)
  //       Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire('Cancelled', 'No changes have been made.', 'error');
  //     }
  //   });
  // };

  // const deleteData = async (id) => {
  //   try {
  //     const res = await axios.get(URL + `/api/Master/DeleteMenu?Id=${id}`, {
  //       headers: { Authorization: `bearer ${token}` },
  //     })
  //     console.log(res, "DC")
  //     fetchData();
  //   } catch (error) {
  //     // console.log(error)
  //   }
  // }

  return (
    <div>
      <div className="table-responsive">
        <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
          <thead className="back_table_color">
            <tr className=" back-color info">
              <th>#</th>
              <th>MenuList</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item, index) => {
                return (
                  <tr>
                    <td className='data-index'>{index + 1}</td>
                    <td>{item.MenuName}</td>
                    <td><input type='checkbox' checked={item.IsActive} /></td>

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

export default Menulist
