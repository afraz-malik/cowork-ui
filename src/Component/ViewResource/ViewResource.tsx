import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { resourceBook, singleResource } from '../../api/resource';
import Layout from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import penIcon from "../../Assets/Images/icon/pencil-01.svg";
import spaceIcon from "../../Assets/Images/icon/spaceAvatar.png";
import { DESKIE_API as API } from '../../config';
import "./ViewResource.css"
import { faEye } from '@fortawesome/free-regular-svg-icons';
import calenderIcon from "../../Assets/Images/icon/calendar-check-01.svg"
import ResourceBooking from '../ResourceBooking/ResourceBooking';
import { formatResourceDate } from '../../CommonFunction/Function';
import EditResource from './EditResource';
import { ToastContainer } from 'react-toastify';


const ViewResource = () => {
    const { id } = useParams();
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const [editShow, setEditShow] = useState(false);
    const handleEditClose = () => setEditShow(false);
    const [editInfo, setEditInfo] = useState({});
    const [resourceDetails, setResourceDetails] = useState<any>({});
    const [bookList, setBookList] = useState<any[]>([]);
    const [paymentShow, setPaymentShow] = useState(false);
    const handlePaymentClose = () => setPaymentShow(false);
    const handlePaymentShow = () => setPaymentShow(true);
    useEffect(() => {
        if (id) {
            singleResource(id).then((data) => {
                setResourceDetails(data)
            })
            resourceBook(id).then((data) => {
                setBookList(data)
            })
        }
    }, [paymentShow,editShow]);

    const editResource = (resourceInfo: string) => {
        setEditShow(true);
        setEditInfo(resourceInfo);
      }

      
    return (
        <Layout>
            <ToastContainer />
            <div className='mainContent'>
                <div className="invoiceHeading">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 ms-2">
                            <li className="breadcrumb-item"><Link to={pathParts[1] === "resources" ? "/resources" : "/my-resources"}>Resource</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{resourceDetails.name}</li>
                        </ol>
                    </nav>
                </div>
                <div className="spacesDetailsBox">
                    <div className="topLine">
                        <div className="memberName">
                            <Link to={pathParts[1] === "resources" ? "/resources" : "/my-resources"} className='backDashboard'><FontAwesomeIcon icon={faArrowLeft} /></Link>
                            <h6> {resourceDetails.name}</h6>
                        </div>
                        <div className="editBtn">
                            <button onClick={()=>editResource(resourceDetails)}><img src={penIcon} alt="edit" /> Edit Resource</button>
                        </div>
                    </div>
                    <div className="resourceDetail">
                        <div className="resourceDescription">
                            <div className="resourceInfo">
                                <div className="resourceMiniBox">
                                    <div className="resourceName">
                                        <h6>Name</h6>
                                        <p className='mb-0'>{resourceDetails.name}</p>
                                    </div>
                                    <div className="resourceName">
                                        <h6>Capacity</h6>
                                        <p className='mb-0'>{resourceDetails.capacity}</p>
                                    </div>
                                    <div className="resourceName">
                                        <h6>Type</h6>
                                        <div className='resourceType'>
                                            {resourceDetails.type === "meeting" ? <span className='meeting'>Meeting Space</span> : ""}
                                            {resourceDetails.type === "equipment" ? <span className='equipment'>Equipment</span> : ""}
                                            {resourceDetails.type === "workspace" ? <span className='workspace'>Workspace</span> : ""}
                                            {resourceDetails.type === "other" ? <span className='other'>Other</span> : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="resourceMiniBox">
                                    <div className="resourceRate">
                                        <h6>Rate (Members)</h6>
                                        <p className='mb-0'>{resourceDetails.member_rate}</p>
                                    </div>
                                    <div className="resourceRate">
                                        <h6>Rate (Guests)</h6>
                                        <p className='mb-0'>{resourceDetails.public_rate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="resourceBooking mt-3">
                                <div className="bookingHeading">
                                    <h6><img src={calenderIcon} alt="edit" /> Upcoming Booking</h6>
                                    <button onClick={handlePaymentShow}><FontAwesomeIcon icon={faPlus} /> New Booking</button>
                                </div>
                                {bookList && bookList.map((resource) => <div className="bookingPerson">
                                    <img src={`${API}/${resource.creator_image}`} alt="edit" />
                                    <div>
                                        <p>{resource.creator_name}</p>
                                        <span>{formatResourceDate(resource.book_date)}</span>
                                    </div>
                                    <button><FontAwesomeIcon icon={faEye} /></button>
                                </div>)}
                            </div>
                        </div>

                        <div className="resourceImage">
                            {resourceDetails.image ?
                                <img src={`${API}/${resourceDetails.image}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <img src={spaceIcon} width="100px" height="100px" alt="shop" />
                            }
                        </div>
                    </div>
                </div>
                <ResourceBooking resourceDetails={resourceDetails} paymentShow={paymentShow} setPaymentShow={setPaymentShow} handlePaymentClose={handlePaymentClose} />
            </div>
            <EditResource editInfo={editInfo} editShow={editShow} setEditShow={setEditShow} handleEditClose={handleEditClose} />
        </Layout>
    )
}

export default ViewResource