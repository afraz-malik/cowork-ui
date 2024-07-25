import React from 'react'

interface UsersProps {
  settingTab: (type: string) => void
}

const Users = ({ settingTab }: UsersProps) => {
  return (
    <>
      <div className='mainContent'>
        <div className='settingPage'>
          <div className='companyOptions'>
            <button onClick={() => settingTab('account')}>
              Personal Profile
            </button>
            <button onClick={() => settingTab('profile')}>
              Company Profile
            </button>
            <button onClick={() => settingTab('finance')}>Finance</button>
            <button className='activeBtn' onClick={() => settingTab('users')}>
              Users
            </button>
            <button onClick={() => settingTab('custom')}>Customization</button>
            <button onClick={() => settingTab('member')}>
              MemberShip Agreement
            </button>
          </div>
          <div className='companyProfile'>
            <div className='profileHeading'>
              <h6>Company Users</h6>
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

export default Users
