import React, { useState, useEffect } from 'react'
import { Dropdown, Table } from 'react-bootstrap';
import "./Billing.css";
import Layout from '../../Component/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faArrowUpLong, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import more from "../../Assets/Images/icon/dots-vertical.png";
import arrowDown from "../../Assets/Images/icon/downIcon.png";
import { DESKIE_API as API } from '../../config';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getInvoicesList } from '../../api/invoice';
import { useNavigate } from 'react-router-dom';
import memberAvatar from "../../Assets/Images/icon/memberAvatar.png";
import spaceAvatar from "../../Assets/Images/icon/spaceAvatar.png";
import Pagination from '../../Component/Pagination/Pagination';
import { resourceInvoiceList } from '../../api/resource';

const Billing = () => {
    const navigate = useNavigate();

    const [invoiceTag, setInvoiceTag] = useState("");
    const [invoiceList, setInvoiceList] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number>(6);
    // pagination
    const [allCheck, setAllCheck] = useState(false);
    const [result, setResult] = useState<string[]>([]);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [limitValue, setLimitValue] = useState<number>(0);
    const pageCount = Math.ceil(totalValue / limitValue);
    const [prevButton, setPrevButton] = useState<boolean>(false);
    const [nextButton, setNextButton] = useState<boolean>(false);
    const [tableId, setTableId] = useState<string[]>([]);
    const [pageValue, setPageValue] = useState<number>();
    
    // const showResult = (value: number) => {
    //     setPage(1)
    //     setLimit(value)
    // }
    // const handleSelect = (selectedValue: any) => {
    //     const integerValue = parseInt(selectedValue);
    //     showResult(integerValue);
    //     setSelectedValue(selectedValue);
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoiceData, resourceInvoiceData] = await Promise.all([
                    getInvoicesList(limit, page, invoiceTag),
                    resourceInvoiceList()
                ]);
                console.log('mergedInvoices',resourceInvoiceData);
                // Merging the invoice lists from both responses
                const mergedInvoices = [...invoiceData.invoices, ...resourceInvoiceData.data];
   
    
                // Updating the state with the merged data and other values from the first API response
                setInvoiceList(mergedInvoices);
                setTotalValue(invoiceData.total);
                setLimitValue(invoiceData.limit);
                setPageValue(invoiceData.page);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        // Call the function to fetch data
        fetchData();
    }, [invoiceTag,page,limit]);

 

    const [searchTerm, setSearchTerm] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const filteredInvoices = invoiceList.filter((member: any) => {
        const fullName = `${member.member_first_name} ${member.member_last_name}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.spaces_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.amount.toLowerCase().includes(searchTerm.toLowerCase());
    });


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
    }, [pageCount,page])
    

    // pagination
   
    const nextPage = () => {
        setAllCheck(false)
        setResult([])
        setTableId([])
        setPage(page + 1)
        setNextButton(true)
    }

    const prevPage = () => {
        setAllCheck(false)
        setResult([])
        setTableId([])
        setPage(page - 1)
    }

   

    

    return (
        <>
            <Layout>
                <div className='mainContent'>
                    <div className="invoiceHeading">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 ms-2">
                                <li className="breadcrumb-item">Finances</li>
                                <li className="breadcrumb-item"><Link to="/billing">Billing</Link></li>
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
                                    <input type="text" placeholder='Search billing' onChange={handleInputChange} className='form-control' />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <div className='filterDropdown'>
                                    <Dropdown>
                                        <Dropdown.Toggle>
                                            <button className='filterBtn'>{invoiceTag ? invoiceTag : 'Status'}  <img src={arrowDown} alt='filter' className='ml-2' /></button>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setInvoiceTag("all")}>All</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setInvoiceTag("unpaid")}>UnPaid</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setInvoiceTag("paid")}>Paid</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setInvoiceTag("void")}>Void</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
                                    {filteredInvoices && filteredInvoices.map((invoice: any) => <tr>
                                        <td><label className="tableCheckBox">
                                            <div className="contactCheck">
                                                <input type="checkbox" name="agreement" />
                                                <span className="checkmark"></span></div>
                                        </label></td>
                                        <td><Link to={`/invoice-details/${invoice.id}`}>#INV{invoice.invoice_id}</Link></td>
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
                                            {invoice.spaces_name ? invoice.spaces_name : "N/A"}</td>
                                        <td>{moment(invoice.created_at).format("MMMM DD, YYYY")}</td>
                                        <td className='status'>
                                            {invoice.payment_status === "paid" ? <span className='paid'>Paid</span>
                                                : invoice.payment_status === "void" ? <span className='unpaid'>Void</span>
                                                    : <span className='unpaid'>Unpaid</span>}
                                        </td>
                                        <td>{invoice.amount ? <>${invoice.amount}</> : "N/A"}</td>
                                        <td className='billingAction'>
                                            <button className='btn download'><img src={more} alt="download" /></button>
                                        </td>
                                    </tr>)}

                                </tbody>
                            </Table>
                            <Pagination page={page} paginationTitle="invoices" setPage={setPage} limit={limit} setLimit={setLimit} prevButton={prevButton} nextButton={nextButton} pageValue={pageValue} totalValue={totalValue} prevPage={prevPage} nextPage={nextPage} allRequestList={invoiceList} />
                            
                        </div>
                    </div>
                </div>


            </Layout>
        </>
    )
}

export default Billing