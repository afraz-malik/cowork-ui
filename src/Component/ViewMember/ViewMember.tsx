import React, { useState, useEffect } from 'react'
import moment from 'moment';
import memberIcon from "../../Assets/Images/icon/member.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { singleMember } from '../../api/member';
import { DESKIE_API as API } from '../../config';
import PhoneInput from 'react-phone-input-2';
import memberBlank from "../../Assets/Images/icon/memberLargeIcon.png";
import more from "../../Assets/Images/icon/dots-vertical.png";
import { Link, useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import penIcon from "../../Assets/Images/icon/pencil-01.png";
import EditMember from './EditMember';
import memberAvatar from "../../Assets/Images/icon/memberLargeIcon.png";

const ViewMember = () => {
    const { id } = useParams();
    const [memberDetails, setMemberDetails] = useState<any>({});
    const [memberId, setMemberId] = useState("");
    const [updateShow, setUpdateShow] = useState(false);
    const handleUpdateClose = () => setUpdateShow(false);

    useEffect(() => {
        if (id) {
            singleMember(id).then((data) => {
                setMemberDetails(data.data && data.data);
            })
        }
    }, []);

    // member update view
    const memberUpdate = (memberId: string) => {
        setMemberId(memberId);
        setUpdateShow(true);
    }

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="invoiceHeading">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 ms-2">
                                <li className="breadcrumb-item"><Link to="/assets">Assets</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{memberDetails.first_name} {memberDetails.last_name}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="membersDetails">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <div className="memberName">
                                    <h5><FontAwesomeIcon icon={faArrowLeft} /></h5>
                                    {memberDetails.member_image ?
                                        <><img src={`${API}/${memberDetails.member_image}`} alt="avatar" style={{ borderRadius: "50%", objectFit: "cover" }} /></>
                                        : <><img src={memberAvatar} alt="avatar" style={{ borderRadius: "50%" }} /></>
                                    }
                                    <div>
                                        <h6>{memberDetails.first_name}</h6>
                                        <p>Member</p>
                                    </div>
                                </div>
                            </div>
                            <div className="editBtn">
                                <button className='invite'>Invitation Pending</button>
                                <button className='edit' onClick={() => memberUpdate(memberDetails.id)}><img src={penIcon} alt="edit" /> Edit Asset</button>
                            </div>
                        </div>
                        <div className="memberInfo">
                            <div className="memberInfoBox">
                                <h6>Signup Date</h6>
                                <p>{moment(memberDetails.created_at).format("MMMM DD, YYYY")}</p>
                            </div>
                            <div className="memberInfoBox" style={{ borderLeft: '1px solid  rgba(234, 236, 240, 1)', borderRight: '1px solid  rgba(234, 236, 240, 1)' }}>
                                <h6>Phone Number</h6>
                                <p>{memberDetails.phone_number}</p>
                            </div>
                            <div className="memberInfoBox">
                                <h6>Email</h6>
                                <p>{memberDetails.email}</p>
                            </div>
                            <div className="memberInfoBox">
                                <h6>Business Name</h6>
                                <p>{memberDetails.business_name}</p>
                            </div>
                            <div className="memberInfoBox" style={{ borderLeft: '1px solid  rgba(234, 236, 240, 1)', borderRight: '1px solid  rgba(234, 236, 240, 1)' }}>
                                <h6>Business Phone</h6>
                                <p>{memberDetails.business_phone}</p>
                            </div>
                            <div className="memberInfoBox">
                                <h6>Business Email</h6>
                                <p>{memberDetails.business_email}</p>
                            </div>
                        </div>
                        <div className="memberInvoice">
                            <div className="invoiceLeft">
                                <div className="memberAssign">
                                    <h6>{memberDetails.first_name}’s Invoice History</h6>
                                    <div className="invoiceHeading">
                                        <div className="invoiceName">
                                            <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>#INV009</span> </p>
                                            <div className='deskType'>
                                                <span className='private'>Private Office</span>
                                            </div>
                                            {/* <div className='deskType'>
                                            {memberDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {memberDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {memberDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </div> */}
                                        </div>
                                        <div className="invoicePrice billingAction">
                                            <p>$500 <span>/mo</span> </p>
                                            <button className='btn download'><img src={more} alt="download" /></button>
                                        </div>
                                    </div>
                                    <div className="invoiceHeading">
                                        <div className="invoiceName">
                                            <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>#INV009</span> </p>
                                            <div className='deskType'>
                                                <span className='private'>Private Office</span>
                                            </div>
                                            {/* <div className='deskType'>
                                            {memberDetails.tag === "private" ? <span className='private'>Private Office</span> : ""}
                                            {memberDetails.tag === "dedicated" ? <span className='dedicated'>Dedicated Desk</span> : ""}
                                            {memberDetails.tag === "flex" ? <span className='flex'>Flex</span> : ""}
                                        </div> */}
                                        </div>
                                        <div className="invoicePrice billingAction">
                                            <p>$500 <span>/mo</span> </p>
                                            <button className='btn download'><img src={more} alt="download" /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="invoiceHistory">
                                    <h6>{memberDetails.first_name}’s Invoice History</h6>
                                    <div className="invoiceBox">
                                        <div className="invoiceHeading">
                                            <div className="invoiceName">
                                                <h6>#INV009</h6>
                                                <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>Emma Clarkson</span> </p>
                                            </div>
                                            <div className="invoicePrice billingAction">
                                                <p>$500 <span>/mo</span> </p>
                                                <button className='btn download'><img src={more} alt="download" /></button>
                                            </div>
                                        </div>
                                        <div className="invoiceDetails">
                                            <div className="assign">
                                                <h6>Assignment</h6>
                                                <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>Emma Clarkson</span> </p>
                                            </div>
                                            <div className="assign">
                                                <h6>Due Date</h6>
                                                <p>January 20, 2024</p>
                                            </div>
                                            <div className="assign">
                                                <h6>Status</h6>
                                                <p className='status'>
                                                    {memberDetails.payment_status === "paid" ? <span className='paid'>Paid</span>
                                                        : memberDetails.payment_status === "void" ? <span className='unpaid'>Void</span>
                                                            : <span className='unpaid'>Unpaid</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="invoiceBox">
                                        <div className="invoiceHeading">
                                            <div className="invoiceName">
                                                <h6>#INV009</h6>
                                                <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>Emma Clarkson</span> </p>
                                            </div>
                                            <div className="invoicePrice billingAction">
                                                <p>$500 <span>/mo</span> </p>
                                                <button className='btn download'><img src={more} alt="download" /></button>
                                            </div>
                                        </div>
                                        <div className="invoiceDetails">
                                            <div className="assign">
                                                <h6>Assignment</h6>
                                                <p> <img src={`${API}/${memberDetails.member_image}`} alt="member" /> <span>Emma Clarkson</span> </p>
                                            </div>
                                            <div className="assign">
                                                <h6>Due Date</h6>
                                                <p>January 20, 2024</p>
                                            </div>
                                            <div className="assign">
                                                <h6>Status</h6>
                                                <p className='status'>
                                                    {memberDetails.payment_status === "paid" ? <span className='paid'>Paid</span>
                                                        : memberDetails.payment_status === "void" ? <span className='unpaid'>Void</span>
                                                            : <span className='unpaid'>Unpaid</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="invoiceRight">
                                <div className="memberBooking">
                                    <h6>Upcoming Bookings</h6>
                                    <div className="bookingList">
                                        <img src={`${API}/${memberDetails.member_image}`} alt="member" />
                                        <div className="spacesInfo">
                                            <h6>{memberDetails.member_image}</h6>
                                            <p>asa</p>
                                        </div>
                                    </div>
                                    <div className="bookingList">
                                        <img src={`${API}/${memberDetails.member_image}`} alt="member" />
                                        <div className="spacesInfo">
                                            <h6>{memberDetails.member_image}</h6>
                                            <p>asa</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="memberNotes">
                                    <h6>Notes</h6>
                                    <p>{memberDetails.notes ? memberDetails.notes: "You haven’t added any notes for this user."}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <EditMember memberId={memberId} updateShow={updateShow} setUpdateShow={setUpdateShow} handleUpdateClose={handleUpdateClose} />
            </Layout>
        </>
    )
}

export default ViewMember