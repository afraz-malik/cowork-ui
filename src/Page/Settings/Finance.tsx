import React from 'react'

interface FinanceProps {
    settingTab: (type: string) => void;
}

const Finance = ({ settingTab }: FinanceProps) => {
    return (
        <>
            <div className='mainContent'>
                <div className="settingPage">
                    <div className="companyOptions">
                    <button onClick={() => settingTab('account')}>Personal Profile</button>
                        <button className='activeBtn' onClick={() => settingTab('profile')}>Company Profile</button>
                        <button onClick={() => settingTab('finance')}>Finances</button>
                        <button onClick={() => settingTab('users')}>Users</button>
                        <button onClick={() => settingTab('custom')}>Customization</button>
                    </div>
                    <div className="companyProfile">
                        <div className='profileHeading'>
                            <h6>Company Finance</h6>
                            <p>Update your company’s info here.</p>
                        </div>
                        <div className='profileSave'>
                            <button className='cancel'>Cancel</button>
                            <button className='save'>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Finance