import React, { useState } from 'react'
import './Settings.css'
import Customization from './Customization'
import Profile from './Profile'
import Account from './Account'
import Finance from './Finance'
import Users from './Users'
import Membership from './Membership'
import Layout from '../../Component/Layout/Layout'

const Settings = () => {
  const [companyProfile, setCompanyProfile] = useState(false)
  const [companyFinance, setCompanyFinance] = useState(false)
  const [companyCustomization, setCompanyCustomization] = useState(false)
  const [memberShip, setMemberShip] = useState(false)
  const [companyAccount, setCompanyAccount] = useState(true)
  const [companyUsers, setCompanyUsers] = useState(false)

  const settingTab = (setting: string) => {
    switch (setting) {
      case 'profile':
        setCompanyProfile(true)
        setCompanyFinance(false)
        setCompanyAccount(false)
        setMemberShip(false)
        setCompanyUsers(false)
        setCompanyCustomization(false)
        break
      case 'finance':
        setCompanyProfile(false)
        setCompanyFinance(true)
        setCompanyAccount(false)
        setMemberShip(false)
        setCompanyUsers(false)
        setCompanyCustomization(false)
        break
      case 'account':
        setCompanyProfile(false)
        setCompanyFinance(false)
        setCompanyAccount(true)
        setCompanyUsers(false)
        setCompanyCustomization(false)
        setMemberShip(false)
        break
      case 'users':
        setCompanyProfile(false)
        setCompanyFinance(false)
        setCompanyAccount(false)
        setCompanyUsers(true)
        setMemberShip(false)
        setCompanyCustomization(false)
        break
      case 'custom':
        setCompanyProfile(false)
        setCompanyFinance(false)
        setCompanyAccount(false)
        setCompanyUsers(false)
        setMemberShip(false)
        setCompanyCustomization(true)
        break
      case 'member':
        setCompanyProfile(false)
        setCompanyFinance(false)
        setCompanyAccount(false)
        setCompanyUsers(false)
        setMemberShip(true)
        setCompanyCustomization(false)
        break

      default:
        setCompanyProfile(false)
        setCompanyFinance(false)
        setCompanyAccount(false)
        setMemberShip(false)
        setCompanyUsers(false)
        setCompanyCustomization(false)
    }
  }

  return (
    <div id='settings'>
      {companyProfile ? <Profile settingTab={settingTab} /> : ''}
      {companyAccount ? <Account settingTab={settingTab} /> : ''}
      {companyFinance ? <Finance settingTab={settingTab} /> : ''}
      {companyUsers ? <Users settingTab={settingTab} /> : ''}
      {companyCustomization ? <Customization settingTab={settingTab} /> : ''}
      {memberShip ? <Membership settingTab={settingTab} /> : ''}
    </div>
  )
}

export default Settings
