import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import "./Pagination.css";
import { multiplyBySixAndShowSeries, paginationNumber } from '../../CommonFunction/Function';
import { Dropdown } from 'react-bootstrap';

interface PaginationProps {
    prevPage: () => void;
    nextPage: () => void;
    limit: number;
    setLimit: (value: number) => void;
    prevButton: boolean;
    nextButton: boolean;
    pageValue: any;
    totalValue: any;
    allRequestList?: any;
    setPage: any;
    paginationTitle: string;
}

const Pagination = ({ paginationTitle, setPage, limit, setLimit, prevPage, nextPage, prevButton, nextButton, pageValue, totalValue, allRequestList }: PaginationProps) => {
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
    const limitDivided = multiplyBySixAndShowSeries(totalValue);
    const paginationDivided = paginationNumber(totalValue, limit);
    const handleSelect = (selectedValue: any) => {
        const integerValue = parseInt(selectedValue);
        setLimit(integerValue);
        setSelectedValue(selectedValue);
    };

    return (
        <>
            <div className='paginationBox'>
                <div className="tableNumber">
                    <Dropdown className="paginationDropdown" onSelect={handleSelect}>
                        <Dropdown.Toggle id="pageDropDown">
                            {selectedValue !== null ? selectedValue : (limitDivided.length > 0 && limitDivided[0])}
                        </Dropdown.Toggle>
                        <Dropdown.Menu role="menu" aria-labelledby="pageDropDown">
                            {limitDivided.map((number) => (
                                <Dropdown.Item key={number} eventKey={number.toString()}>
                                    {number}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <p>1-10 of {allRequestList.length} of {totalValue} {paginationTitle} items</p>
                </div>
                <div className="paginationNumber">
                    <button onClick={() => prevPage()} className={prevButton === true ? "" : "disablePag"}><FontAwesomeIcon icon={faArrowLeft} /> Previous</button>
                    {paginationDivided.map((number) => (
                        <button onClick={() => setPage(number)}>{number}</button>
                    ))}
                    <button onClick={() => nextPage()} className={nextButton === true ? "" : "disablePag"}>Next <FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </div>
        </>
    )
}

export default Pagination