import React, { useState, useEffect } from 'react';
import Layout from '../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import filter from '../../Assets/Images/icon/filter-lines.png';
import { Container, Dropdown, Row, Table } from 'react-bootstrap';
import Pagination from '../../Component/Pagination/Pagination';
import AddResources from '../../Component/AddResources/AddResources';
import { adminResourceList, resourceList } from '../../api/resource';
import { DESKIE_API as API } from '../../config';
import spaceAvatar from "../../Assets/Images/icon/spaceAvatar.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import editPen from "../../Assets/Images/icon/edit-01.png";
import ResourceBooking from '../../Component/ResourceBooking/ResourceBooking';
import calenderIcon from "../../Assets/Images/icon/calendar-check-01.svg";
import "./Resources.css";
import { formatResourceDate } from '../../CommonFunction/Function';
import EditResource from '../../Component/ViewResource/EditResource';


const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [paymentShow, setPaymentShow] = useState(false);
  const handlePaymentClose = () => setPaymentShow(false);
  const [editShow, setEditShow] = useState(false);
  const handleEditClose = () => setEditShow(false);
  const [editInfo, setEditInfo] = useState({});
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
  const [filterTag, setFilterTag] = useState('');


  useEffect(() => {
    resourceList(limit, page, filterTag).then((data) => {
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
  }, [show, limit, page,editShow,filterTag]);

  const nextPage = () => {
    setResult([])
    setPage(page + 1)
    setNextButton(true)
  }

  const prevPage = () => {
    setResult([])
    setPage(page - 1)
  }

  const viewResource = (resourceId: string) => {
    return navigate(`${resourceId}`)
  }

  const editResource = (resourceInfo: string) => {
    setEditShow(true);
    setEditInfo(resourceInfo);
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
                <div className='filterDropdown taskDropdown'>
                  <Dropdown>
                    <Dropdown.Toggle>
                      <button className='filterBtn'><img className='mr-2' src={filter} alt='filter' />{filterTag === "all" ? "My Types" : filterTag === "workspace" ? "Workspace" : filterTag === "meeting" ? "Meeting Spaces" : filterTag === "equipment" ? "Equipment" : filterTag === "other" ? "Other" : "Filters"}</button>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setFilterTag('all')}>All Types</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterTag('workspace')}>Workspace</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterTag('meeting')}>Meeting Space</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterTag('equipment')}>Equipment</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterTag('other')}>Other</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                {pathParts[1] === "resources" ? <button onClick={handleShow}><FontAwesomeIcon icon={faPlus} /> Add Resource</button> : ""}

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
                      <button className='btn view' onClick={() => viewResource(data.id)}><FontAwesomeIcon icon={faEye} /></button>
                      <button className='btn edit' onClick={()=>editResource(data)}><img src={editPen} alt="edit" /></button>
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
            {bookingResult && bookingResult.map((resource) => <div className="bookingPerson">
              <img src={`${API}/${resource.resource_image}`} alt="edit" />
              <div>
                <p>{resource.resource_name} <span>({resource.creator_name})</span> </p>
                <span>{formatResourceDate(resource.book_date)}</span>
              </div>
              <button onClick={() => viewResource(resource.resource_id)}><FontAwesomeIcon icon={faEye} /></button>
            </div>)}
          </div>
        </div>

        <AddResources show={show} setShow={setShow} handleClose={handleClose} />
        <ResourceBooking paymentShow={paymentShow} setPaymentShow={setPaymentShow} handlePaymentClose={handlePaymentClose} />
        <EditResource editInfo={editInfo} editShow={editShow} setEditShow={setEditShow} handleEditClose={handleEditClose} />
      </div>
    </Layout>
  )
}

export default Resources