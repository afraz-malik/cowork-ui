import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import Layout from '../../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUpLong, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import more from "../../../Assets/Images/icon/dots-vertical.png";
import { DESKIE_API as API } from '../../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getInvoicesList } from '../../../api/invoice';
import { useNavigate } from 'react-router-dom';
import RecordPayment from '../../../Component/RecordPayment/RecordPayment';
import memberAvatar from "../../../Assets/Images/icon/memberAvatar.png";
import spaceAvatar from "../../../Assets/Images/icon/spaceAvatar.png";

const MyInvoice = () => {
    const navigate = useNavigate();
    const numbers = [1, 2, 3, 4, 5, 10, 20, 50, 100];
    const [limitValue, setLimitValue] = useState<any>();
    const [show, setShow] = useState(false);
    const [invoiceKey, setInvoiceKey] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [invoiceList, setInvoiceList] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(2);
    const [selectedValue, setSelectedValue] = useState(limit);
    const showResult = (value: number) => {
        setPage(1)
        setLimit(value)
    }
    const handleSelect = (selectedValue: any) => {
        const integerValue = parseInt(selectedValue);
        showResult(integerValue);
        setSelectedValue(selectedValue);
    };

    useEffect(() => {
        getInvoicesList(100, 1, "all").then((data) => {
            console.log('invoice', data);

            if (data.statusCode !== 200) {

            }
            else {
                setInvoiceList(data.invoices);
            }
        })
    }, [show]);

    const invoiceView = (invoiceId: string) => {
        return navigate(`/invoice-details/${invoiceId}`);
    }

    const paymentView = (invoiceId: string) => {
        setShow(true);
        setInvoiceKey(invoiceId);
    }

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="invoiceHeading">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 ms-2">
                                <li className="breadcrumb-item">Finances</li>
                                <li className="breadcrumb-item">Billing</li>
                                <li className="breadcrumb-item active" aria-current="page">All Invoices</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="memberBox">
                        <div className="topLine">
                            <div className='tableHeading'>
                                <h6><FontAwesomeIcon icon={faArrowLeft} /> All Invoices</h6>
                            </div>
                            <div className='memberSearch'>
                                <div className='searchInput'>
                                    <input type="text" placeholder='Search billing' className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <Link to="/create-invoice"><FontAwesomeIcon icon={faPlus} /> Create New Invoice</Link>
                            </div>
                        </div>
                        <div className="billingList">
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></th>
                                        <th>ID <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Member <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Assignment <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Date <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Status <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Amount <FontAwesomeIcon icon={faArrowUpLong} /></th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceList && invoiceList.map((invoice: any) => <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" onClick={() => invoiceView(invoice.id)} />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td>#INV{invoice.invoice_id}</td>
                                        <td>
                                            {invoice.member_image ? <img src={`${API}/${invoice.member_image}`} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                                : <img src={memberAvatar} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                            }
                                            {invoice.member_first_name} {invoice.member_last_name}
                                        </td>
                                        <td>
                                            {invoice.space_image ? <img src={`${API}/${invoice.space_image}`} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                                : <img src={spaceAvatar} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                            }
                                            {invoice.spaces_name}</td>
                                        <td>{moment(invoice.renewal_date).format("MMMM DD, YYYY")}</td>
                                        <td className='status'>
                                            <span className='unpaid'>Unpaid</span>
                                            {/* {invoice.amount ? <span className='paid'>Paid</span>
                                         : <span className='unpaid'>Unpaid</span>} */}
                                        </td>
                                        <td>{invoice.amount ? <>${invoice.amount}</> : "N/A"}</td>
                                        <td className='billingAction'>
                                            <button className='btn download' onClick={() => paymentView(invoice.id)}><img src={more} alt="download" /></button>
                                        </td>
                                    </tr>)}

                                </tbody>
                            </Table>
                            <div className='paginationBox'>
                                <div className="tableNumber">
                                    <Dropdown className="paginationDropdown" onSelect={handleSelect}>
                                        <Dropdown.Toggle id="pageDropDown">
                                            {selectedValue}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu role="menu" aria-labelledby="pageDropDown">
                                            {numbers.map((number) => (
                                                <Dropdown.Item key={number} eventKey={number.toString()}>
                                                    {number}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <p>Showing 10 of 100 members</p>
                                </div>
                                <div className="paginationNumber">
                                    <button><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                                    <button>1</button>
                                    <button>2</button>
                                    <button>3</button>
                                    <button>...</button>
                                    <button>8</button>
                                    <button>9</button>
                                    <button>10</button>
                                    <button>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <RecordPayment invoiceId={invoiceKey} show={show} setShow={setShow} handleClose={handleClose} />
            </Layout>
        </>
    )
}

export default MyInvoice