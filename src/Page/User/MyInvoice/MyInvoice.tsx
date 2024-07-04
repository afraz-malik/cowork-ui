import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import Layout from '../../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUpLong, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import more from "../../../Assets/Images/icon/dots-vertical.png";
import { DESKIE_API as API } from '../../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getInvoicesList, invoicesView } from '../../../api/invoice';
import { useNavigate } from 'react-router-dom';
import RecordPayment from '../../../Component/RecordPayment/RecordPayment';
import memberAvatar from "../../../Assets/Images/icon/memberAvatar.png";
import spaceAvatar from "../../../Assets/Images/icon/spaceAvatar.png";
import Pagination from '../../../Component/Pagination/Pagination';

const MyInvoice = () => {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [invoiceKey, setInvoiceKey] = useState("");
    const [prevButton, setPrevButton] = useState<boolean>(false);
    const [nextButton, setNextButton] = useState<boolean>(false);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [limitValue, setLimitValue] = useState<number>(0);
    const [pageValue, setPageValue] = useState<number>();
    const pageCount = Math.ceil(totalValue / limitValue);
    const handleClose = () => setShow(false);
    const [invoiceList, setInvoiceList] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(6);
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
        getInvoicesList(limit, page, "all").then((data) => {
            setInvoiceList(data.invoices);
            setTotalValue(data.total)
            setLimitValue(data.limit)
            setPageValue(data.page)
        })
    }, [show]);

    useEffect(() => {
        if (pageCount > 1) {
          setPrevButton(true)
        }
        if (page === 1) {
          setPrevButton(false)
        }
        // next button
        if (pageCount > 1) {
          setNextButton(true)
        }
        if (pageCount === page) {
          setNextButton(false)
        }
      }, [pageCount, page])

    const invoiceView = (invoiceId: string) => {
        return navigate(`/invoice-details/${invoiceId}`);
    }

    const paymentView = (invoiceId: string) => {
        setShow(true);
        setInvoiceKey(invoiceId);
    }

    const nextPage = () => {
        setPage(page + 1)
        setNextButton(true)
      }
    
      const prevPage = () => {
        setPage(page - 1)
      }

      const viewInvoice = (invoiceId: string) => {
        invoicesView(invoiceId).then((data) => {
 console.log('invoice',data);
 
        })
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
                                {/* <Link to="/create-invoice"><FontAwesomeIcon icon={faPlus} /> Create New Invoice</Link> */}
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
                                        <th>items <FontAwesomeIcon icon={faArrowUpLong} /></th>
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
                                        <td><Link to={`/my-invoice-details/${invoice.id}`} onClick={()=>invoice.invoice_view ? null : viewInvoice(invoice.id)}>#INV{invoice.invoice_id}</Link></td>
                                        <td>
                                            {invoice.member_image ? <img src={`${API}/${invoice.member_image}`} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                                : <img src={memberAvatar} width="32px" height="32px" alt="avatar" style={{ borderRadius: "50%" }} />
                                            }
                                            {invoice.user_name}
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
                                        {invoice.renewal_frequency === "resource" ? <td>{invoice.amount ? <>${invoice.amount}</> : "N/A"}</td>
                                        : <td>{invoice.total_amount ? <>${invoice.total_amount}</> : "N/A"}</td>}
                                        <td className='billingAction'>
                                            <button className='btn download' onClick={() => paymentView(invoice.id)}><img src={more} alt="download" /></button>
                                        </td>
                                    </tr>)}

                                </tbody>
                            </Table>
                            <Pagination page={page} paginationTitle="invoices" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={invoiceList} />
                        </div>
                    </div>
                </div>

                <RecordPayment invoiceId={invoiceKey} show={show} setShow={setShow} handleClose={handleClose} />
            </Layout>
        </>
    )
}

export default MyInvoice