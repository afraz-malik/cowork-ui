import React, { useState, useEffect } from 'react';
import Layout from '../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import filter from '../../Assets/Images/icon/filter-lines.png';
import { Container, Row, Table } from 'react-bootstrap';
import Pagination from '../../Component/Pagination/Pagination';
import AddResources from '../../Component/AddResources/AddResources';
import { adminResourceList, resourceList } from '../../api/resource';
import { DESKIE_API as API } from '../../config';
import spaceAvatar from "../../Assets/Images/icon/spaceAvatar.png";
import { Link ,useNavigate} from 'react-router-dom';
import editPen from "../../Assets/Images/icon/edit-01.png";
import ResourceBooking from '../../Component/ResourceBooking/ResourceBooking';
import calenderIcon from "../../Assets/Images/icon/calendar-check-01.svg";
import "./Resources.css";
import { formatResourceDate } from '../../CommonFunction/Function';


const Resources = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [paymentShow, setPaymentShow] = useState(false);
  const handlePaymentClose = () => setPaymentShow(false);
  const handlePaymentShow = () => setPaymentShow(true);
  const [resourceLists, setResourceLists] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(6);
  const [result, setResult] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [limitValue, setLimitValue] = useState<number>(0);
  const pageCount = Math.ceil(totalValue / limitValue);
  const [prevButton, setPrevButton] = useState<boolean>(false);
  const [nextButton, setNextButton] = useState<boolean>(false);
  const [pageValue, setPageValue] = useState<number>();
  const [bookingResult, setBookingResult] = useState<any[]>([]);

  useEffect(() => {
    resourceList(limit, page).then((data) => {
      if (data.statusCode !== 200) {

      }
      else {
        setResourceLists(data.resource);
        setTotalValue(data.total)
        setLimitValue(data.limit)
        setPageValue(data.page)
      }
    })
    adminResourceList().then((data) => {
      setBookingResult(data)
    })
  }, [show, limit, page]);

  const nextPage = () => {
    setResult([])
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setResult([])
    setPage(page - 1)
  }
  const viewResource= (resourceId: string) => {
    return navigate(`${resourceId}`)
  }
    
  return (
    <Layout>
      <div className='mainContent'>
        <div className="resourcesPage">
          <div className="memberBox">
            <div className="topLine">
              <div className='tableHeading'>
                <h6>All Resources</h6>
              </div>
              <div className='memberSearch'>
                <button className='filterBtn'><img src={filter} alt='filter' /> Filter</button>
                <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Resource</button>
              </div>
            </div>

            <div className="spaceList">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></th>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceLists && resourceLists.map((data: any, index) => <tr key={`refer` + index}>
                    <td><label className="tableCheckBox">
                      <div className="contactCheck">
                        <input type="checkbox" name="agreement" />
                        <span className="checkmark"></span></div>
                    </label></td>
                    <td>
                      <div className='tableImage justify-content-center'>
                        {data.image ?
                          <img src={`${API}/${data.image}`} alt="avatar" style={{ objectFit: "cover", borderRadius: "50%" }} />
                          : <img src={spaceAvatar} alt="avatar" style={{ borderRadius: "50%" }} />
                        } </div>
                    </td>
                    <td className='tableLink'><Link to={`${data.id}`}>{data.name}</Link></td>
                    <td className='resourceType'>
                      {data.type === "meeting" ? <span className='meeting'>Meeting Space</span> : ""}
                      {data.type === "equipment" ? <span className='equipment'>Equipment</span> : ""}
                      {data.type === "workspace" ? <span className='workspace'>Workspace</span> : ""}
                      {data.type === "other" ? <span className='other'>Other</span> : ""}
                    </td>
                    <td className='tableAction'>
                      <button className='btn view' onClick={()=>viewResource(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                      <button className='btn edit'><img src={editPen} alt="edit" /></button>
                    </td>
                  </tr>)}
                </tbody>
              </Table>
              <Pagination page={page} paginationTitle="resource" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={resourceLists} />
            </div>
          </div>
          <div className="upcomingListResources">
            <div className="bookingHeading">
              <h6><img src={calenderIcon} alt="edit" /> Upcoming Booking</h6>
            </div>
            {bookingResult && bookingResult.map((resource)=><div className="bookingPerson">
              <img src={`${API}/${resource.resource_image}`} alt="edit" />
              <div>
                <p>{resource.resource_name} <span>({resource.creator_name})</span> </p>
                <span>{formatResourceDate(resource.created_at)}</span>
              </div>
              <button  onClick={()=>viewResource(resource.resource_id)}><FontAwesomeIcon icon={faEye} /></button>
            </div>)}
            
          </div>
        </div>

        <AddResources show={show} setShow={setShow} handleClose={handleClose} />
        <ResourceBooking paymentShow={paymentShow} setPaymentShow={setPaymentShow} handlePaymentClose={handlePaymentClose} />
      </div>
    </Layout>
  )
}

export default Resources