import React, { useState } from 'react'
import Layout from '../../../Component/Layout/Layout'
import MyAccount from './MyAccount'
import './MySetting.css'

const MySetting = () => {
  const [companyFinance, setCompanyFinance] = useState(false)
  const [companyAccount, setCompanyAccount] = useState(true)
  const settingTab = (setting: string) => {
    switch (setting) {
      case 'finance':
        setCompanyFinance(true)
        setCompanyAccount(false)
        break
      case 'account':
        setCompanyFinance(false)
        setCompanyAccount(true)
        break
      default:
        setCompanyFinance(false)
        setCompanyAccount(false)
    }
  }

  return (
    <>
      <Layout>
        {companyAccount ? <MyAccount settingTab={settingTab} /> : ''}

        {/*
                    {companyProfile ? <Profile settingTab={settingTab} /> : ""}
                    {companyAccount ? <Account settingTab={settingTab} /> : ""}
                    {companyFinance ? <Finance settingTab={settingTab} /> : ""}
                    {companyUsers ? <Users settingTab={settingTab} /> : ""}
                    {companyCustomization ? <Customization settingTab={settingTab} /> : ""}
                */}
      </Layout>
    </>
  )
}

export default MySetting
