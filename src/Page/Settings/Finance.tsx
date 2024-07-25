import React, { useState } from 'react'
import { stripeCreate } from '../../api/settings'
import { showNotifications } from '../../CommonFunction/toaster'

interface FinanceProps {
  settingTab: (type: string) => void
}

const Finance = ({ settingTab }: FinanceProps) => {
  const [secretId, setSecretId] = useState('')
  const [publishId, setPublishId] = useState('')
  const stripeAdd = () => {
    let stripeInfo = {
      secret_id: secretId,
      publish_id: publishId,
    }
    stripeCreate(stripeInfo).then((data) => {
      showNotifications('success', 'Stripe Update Successfully !!')
    })
  }
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
            <button className='activeBtn' onClick={() => settingTab('finance')}>
              Finance
            </button>
            <button onClick={() => settingTab('users')}>Users</button>
            <button onClick={() => settingTab('custom')}>Customization</button>
            <button onClick={() => settingTab('member')}>
              MemberShip Agreement
            </button>
          </div>
          <div className='companyProfile'>
            <div className='profileHeading'>
              <h6>Finance</h6>
              <p>Update your finance info here.</p>
            </div>
            <div className='profileSave'>
              <button className='cancel'>Cancel</button>
              <button className='save' onClick={stripeAdd}>
                Save
              </button>
            </div>
          </div>
          <div className='companyName'>
            <p>Stripe Secret ID</p>
            <div className='rightSideSetting col-8'>
              {/* <div className='memberInput '>
                <input
                  type='text'
                  placeholder='Enter your company name'
                  className=''
                  required
                />
              </div> */}
              <div className='companyInput profileName'>
                <span>Public Key</span>
                <input
                  type='text'
                  // value={lastName}
                  // onChange={(e) => setLastName(e.target.value)}
                  placeholder='pk_test_51Hyz5LLXg7nSa3dpRFlGm8fR90U4f7wL3QnqK5D...'
                  className='form-control'
                />
              </div>
            </div>
          </div>
          <div className='settingSecondInput'>
            {/* <p>Stripe Publish ID</p> */}
            <div className='rightSideSetting col-8'>
              <div className='companyInput profileName'>
                <span>Private Key</span>
                <input
                  type='text'
                  // value={lastName}
                  // onChange={(e) => setLastName(e.target.value)}
                  placeholder='sk_test_51Hyz5LLXg7nSa3dpO1a2VrNbN1Tk8G9mQ6Yr7Js...'
                  className='form-control'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Finance
