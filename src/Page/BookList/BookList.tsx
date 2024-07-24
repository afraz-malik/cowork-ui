import React, { useEffect, useState } from 'react'
import { getTourList } from '../../api/tour'
import { Table } from 'react-bootstrap'

const BookList = () => {
  const [tourList, setTourList] = useState([])
  useEffect(() => {
    getTourList().then((data) => {
      setTourList(data)
    })
  }, [])
  return (
    <div>
      <div className='text-center'>
        <h2>Book list</h2>
      </div>
      <Table responsive='sm'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Day</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {tourList &&
            tourList.map((tour: any, i: number) => (
              <tr>
                <td>{i + 1}</td>
                <th>{tour.name}</th>
                <th>{tour.email}</th>
                <th>{tour.tour_date}</th>
                <th>{tour.tour_day}</th>
                <th>{tour.tour_time}</th>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BookList
