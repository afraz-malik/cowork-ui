import React from 'react'
import Layout from '../../Component/Layout/Layout'
import { Col, Container, Row, Table } from 'react-bootstrap'
import './Dashboard.css'
import privateImg from '../../Assets/Images/icon/building-05.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const Dashboard = () => {
  const options: ApexOptions = {
    chart: {
      id: 'basic-area',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#5052c9'],
    },
    colors: ['#5052c9'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.02,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
  }

  const series = [
    {
      name: 'series-1',
      data: [
        2, 10, 15, 20, 26, 30, 34, 38, 40, 42, 45, 47, 50, 35, 49, 55, 60, 62,
        67, 70, 80, 75, 70, 65, 72, 85, 91, 125,
      ],
    },
  ]

  const pieData = [
    { category: 'Category 1', value: 30 },
    { category: 'Category 2', value: 50 },
    { category: 'Category 3', value: 20 },
  ]

  const pieSeries = pieData.map((item) => item.value)
  const categories = pieData.map((item) => item.category)

  const pieOptions: ApexOptions = {
    labels: categories,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    colors: ['#6366f1', '#2e90fa', '#f79009'],
    legend: {
      show: false,
    },
    chart: {
      dropShadow: {
        enabled: false,
      },
    },
  }

  return (
    <>
      <div className='mainContent'>

        <div className=''>

          <Row>
            <Col md={4}>
              <div className='dashboardStatus'>
                <div className='statusHeading'>
                  <img src={privateImg} alt='private' />
                  <p>Private Spaces</p>
                </div>
                <div className='statusContent'>
                  <p>Status Available</p>
                </div>
                <div className='statusNumber'>
                  <p>12/12</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className='dashboardStatus'>
                <div className='statusHeading'>
                  <img src={privateImg} alt='private' />
                  <p>Dedicated Desks</p>
                </div>
                <div className='statusContent'>
                  <p>Status Available</p>
                </div>
                <div className='statusNumber'>
                  <p>6/8</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className='dashboardStatus'>
                <div className='statusHeading'>
                  <img src={privateImg} alt='private' />
                  <p>Flex Memberships</p>
                </div>
                <div className='statusContent'>
                  <p>Status Available</p>

                </div>
                <div className='statusNumber'>
                  <p>6/10</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className=''>

          <Row>
            <Col md={8}>
              <div className='incomeGraph'>
                <div className='graphHeading'>
                  <div className='incomeNumber'>
                    <h6>Total Income</h6>
                    <p>2023</p>
                    <div className='incomeMoney'>
                      <p>$107,843</p>
                      <div className='incomePercentage'>
                        <FontAwesomeIcon icon={faArrowUp} /> 7.2 %
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='report'>
                    View Report
                  </button>
                </div>
                <div className='graphChart'>
                  <Chart
                    options={options}
                    series={series}
                    type='area'
                    height='270px'
                  />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className='monthIncome'>
                <div className='monthPlan'>
                  <div className='monthMoney'>
                    <div>
                      <h6>1800</h6>
                      <p>Booking This Month</p>
                    </div>
                    <div className='incomePercentage'>
                      <FontAwesomeIcon icon={faArrowUp} /> 7.2 %
                    </div>
                  </div>
                </div>
                <div className='circleChart'>
                  <Chart
                    options={pieOptions}
                    series={pieSeries}
                    type='donut'
                    width='160px'
                    height='160px'
                  />
                </div>
                <div className='monthChartOptions'>
                  <div className='chartOption'>
                    <div className='chartName'>
                      <div className='chartColor privateColor'></div>
                      <p>Private Spaces</p>
                    </div>
                    <div className='chartNumber'>
                      <p>
                        800 <span>book</span>
                      </p>
                    </div>
                  </div>
                  <div className='chartOption'>
                    <div className='chartName'>
                      <div className='chartColor dedicatedColor'></div>
                      <p>Dedicated Desks</p>
                    </div>
                    <div className='chartNumber'>
                      <p>
                        650 <span>book</span>
                      </p>
                    </div>
                  </div>
                  <div className='chartOption'>
                    <div className='chartName'>
                      <div className='chartColor flexColor'></div>
                      <p>Flex Memberships</p>
                    </div>
                    <div className='chartNumber'>
                      <p>
                        800 <span>book</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className='recentActivity mt-5'>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th>
                        Name <FontAwesomeIcon icon={faArrowUp} />
                      </th>
                      <th>Desk Type</th>
                      <th>
                        Income <FontAwesomeIcon icon={faArrowUp} />
                      </th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <label className='tableCheckBox'>
                          <input type='checkbox' name='agreement' />
                          <span className='checkmark'></span>
                        </label>
                      </td>
                      <td>#8763</td>
                      <td>Kristin Watson</td>
                      <td>January 26, 2024</td>
                      <td>Leaky fucet in bathroom</td>
                      <td className='status'>
                        <span className='closed'>Closed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className='tableCheckBox'>
                          <div className='contactCheck'>
                            <input type='checkbox' name='agreement' />
                            <span className='checkmark'></span>
                          </div>
                        </label>
                      </td>
                      <td>#8763</td>
                      <td>Kristin Watson</td>
                      <td>January 26, 2024</td>
                      <td>Leaky fucet in bathroom</td>
                      <td className='status'>
                        <span className='open'>Open</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

        </div>

      </div>
    </>
  )
}

export default Dashboard
