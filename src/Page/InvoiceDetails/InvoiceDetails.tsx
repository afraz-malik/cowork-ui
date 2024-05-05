import React, { useState } from 'react'
import Layout from '../../Component/Layout/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import "./InvoiceDetails.css";
import avatar from "../../Assets/Images/icon/Avatar.png";
import download from "../../Assets/Images/icon/download-02.png";
import recordFile from "../../Assets/Images/icon/record.png";
import emailFile from "../../Assets/Images/icon/mail-01.png";
import voidFile from "../../Assets/Images/icon/void.png";
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { singleInvoice } from '../../api/invoice';
import moment from 'moment';
import { DESKIE_API as API } from '../../config';
import { usePDF } from 'react-to-pdf';
import { Dropdown } from 'react-bootstrap';
import RecordPayment from '../../Component/RecordPayment/RecordPayment';
import spacesImage from "../../Assets/Images/icon/spaceAvatar.png";
import memberImage from "../../Assets/Images/icon/memberAvatar.png";
import { paymentVoid } from './../../api/invoice';
import { showNotifications } from '../../CommonFunction/toaster';


const InvoiceDetails = () => {

    const { id } = useParams();
    const [invoiceDetail, setInvoiceDetail] = useState<any>({});
    console.log('invoiceDetail', invoiceDetail);

    const [show, setShow] = useState(false);
    const [invoiceKey, setInvoiceKey] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { toPDF, targetRef } = usePDF({ filename: `${invoiceDetail && invoiceDetail.invoice_id}.pdf` });

    useEffect(() => {
        if (id) {
            singleInvoice(id).then((data) => {
                setInvoiceDetail(data.data)
            })
        }
    }, [show]);

    const paymentView = () => {
        setShow(true);
    }

    const voidUpdate = () => {
        const paymentInfo={
            "void": "void"
        }
        paymentVoid(invoiceDetail.payment_id, paymentInfo).then((data) => {
            if (data.statusCode !== 200) {
                showNotifications('error', data.message)
            }
            else {
                setShow(false)
                showNotifications('success', data.message)
            }
        })
    }

    return (
        <Layout>
            <div className='mainContent'>
                <div className="invoiceHeading">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 ms-2">
                            <li className="breadcrumb-item">Finances</li>
                            <li className="breadcrumb-item"><Link to="/billing">Billing</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Invoice {invoiceDetail && invoiceDetail.invoice_id}</li>
                        </ol>
                    </nav>
                </div>
                <div className="createInvoice d-flex">
                    <div className="topLine">
                        <div className='tableHeading'>
                            <h6><FontAwesomeIcon icon={faArrowLeft} /> Invoice: #INV{invoiceDetail && invoiceDetail.invoice_id}</h6>
                        </div>
                        <div className='invoiceDropdown'>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    <FontAwesomeIcon icon={faPlus} /> Actions <FontAwesomeIcon icon={faChevronDown} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <div className="invoiceActions">
                                        <button onClick={() => paymentView()}><img src={recordFile} alt="record" /> Record Manual Payment</button>
                                        <button><img src={emailFile} alt="record" /> Email Invoice</button>
                                        <button onClick={() => voidUpdate()}><img src={voidFile} alt="record" /> Void</button>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="invoiceInformation d-flex">

                    <div className="invoiceView" ref={targetRef}>
                        <div className="invoiceDetail">
                            <div className="invoiceTop">
                                <div className="invoiceId">
                                    <h1>Invoice : <span>#INV{invoiceDetail && invoiceDetail.invoice_id}</span></h1>
                                </div>
                                <div className="invoiceDate">
                                    <p>Issued: <span>{invoiceDetail && moment(invoiceDetail.created_at).format('MMMM D, YYYY')}</span></p>
                                    <p>Due: <span>{invoiceDetail && moment(invoiceDetail.dueDate).format('MMMM D, YYYY')}</span></p>
                                </div>
                            </div>
                            <div className="invoiceInfo">
                                <div className="invoiceId">
                                    <p>Invoice ID</p>
                                    <h6>#{invoiceDetail && invoiceDetail.invoice_id}</h6>
                                </div>
                                <div className="invoiceId">
                                    <p>Status</p>
                                    <h6 className='status'>{invoiceDetail && invoiceDetail.payment_status === "paid" ? <><span className='paid'>Paid</span></> : invoiceDetail.payment_status === "void" ? <span className='unpaid'>Void</span> : <span className='unpaid'>UnPaid</span>}</h6>
                                </div>
                                <div className="invoiceId">
                                    <p>Payment Date</p>
                                    <h6>{invoiceDetail && invoiceDetail.payment_date ? <>{moment(invoiceDetail.payment_date).format('MMMM D, YYYY')}</> : "N/A"}</h6>
                                </div>
                                <div className="invoiceId">
                                    <p>Payment Method</p>
                                    <h6>{invoiceDetail && invoiceDetail.payment_method ? <>{invoiceDetail.payment_method}</> : "N/A"}</h6>
                                </div>
                            </div>
                            <div className="invoiceItem">
                                <div className="itemHeading">
                                    <p>Item</p>
                                    <p>Amount</p>
                                </div>
                                <div className="itemList">
                                    <div className="itemName">
                                        {invoiceDetail && invoiceDetail.space_image ? <img src={`${API}/${invoiceDetail && invoiceDetail.space_image}`} alt="avatar" />
                                            : <img src={spacesImage} alt="avatar" />} {invoiceDetail && invoiceDetail.space_name}
                                    </div>
                                    <div className="itemPrice">
                                        {invoiceDetail && invoiceDetail.amount ? <>${invoiceDetail.amount}</> : "N/A"}
                                    </div>
                                </div>
                                <div className="itemTotal">
                                    <p>Total Amount <span>{invoiceDetail && invoiceDetail.amount ? <>${invoiceDetail.amount}</> : "N/A"}</span></p>
                                </div>
                                <div className="itemTotal">
                                    <p className='d-flex'>Amount Owed <span>
                                        {invoiceDetail && invoiceDetail.amount ?
                                            <p className={(invoiceDetail && parseFloat((invoiceDetail.amount - invoiceDetail.payment_value).toFixed(2)) === 0 ? 'amountPaid' : 'amountUnpaid').toString()}>
                                                ${parseFloat((invoiceDetail.amount - invoiceDetail.payment_value).toFixed(2)).toString()}
                                            </p>
                                            :
                                            "N/A"
                                        }
                                    </span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='rightInvoice'>
                        <div className="invoiceMember">
                            <h1>Member Info</h1>
                            <div className="memberDetails">
                                {invoiceDetail && invoiceDetail.member_image ? <img src={`${API}/${invoiceDetail.member_image}`} width="40px" height="40px" alt="avatar" style={{ borderRadius: "50%" }} />
                                    : <img src={memberImage} width="40px" height="40px" alt="avatar" style={{ borderRadius: "50%" }} />}

                                <div>
                                    <p>{invoiceDetail && invoiceDetail.first_name} {invoiceDetail && invoiceDetail.last_name}</p>
                                    <span>{invoiceDetail && invoiceDetail.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="invoiceNotes">
                            <h1>Note</h1>
                            <p>{invoiceDetail && invoiceDetail.notes ? <>{invoiceDetail.notes}</> : "No notes"}</p>
                        </div>
                        <div className="invoiceDownload">
                            <p>Download Invoice</p>
                            <button onClick={() => toPDF()}><img src={download} alt="download" /> Download PDF</button>
                        </div>
                    </div>

                </div>
            </div>

            <RecordPayment invoiceId={id} show={show} setShow={setShow} handleClose={handleClose} invoiceDetail={invoiceDetail}  />
        </Layout>
    )
}

export default InvoiceDetails