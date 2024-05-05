import React, { useState } from 'react';
import dashboard from "../../Assets/Images/icon/dashboardIcon.png";
import members from "../../Assets/Images/icon/membersIcon.png";
import assets from "../../Assets/Images/icon/assetsIcon.png";
import tasks from "../../Assets/Images/icon/taskIcon.png";
import messenger from "../../Assets/Images/icon/messageIcon.png";
import calender from "../../Assets/Images/icon/calenderIcon.png";
import files from "../../Assets/Images/icon/filesIcon.png";
import finance from "../../Assets/Images/icon/financeIcon.png";
import settings from "../../Assets/Images/icon/settingIcon.png";


interface ProfileProps {
    settingTab: (type: string) => void;
}


const Customization = ({ settingTab }: ProfileProps) => {
    const [authValue, setAuthValue] = useState(false);
    const authClick = () => {
        setAuthValue(!authValue)
    }
    
    return (
        <>
            <div className='mainContent'>
                <div className="settingPage">
                    <div className="companyOptions">
                    <button onClick={() => settingTab('account')}>Personal Profile</button>
                    <button onClick={() => settingTab('profile')}>Company Profile</button>
                        <button onClick={() => settingTab('finance')}>Finances</button>
                        <button onClick={() => settingTab('users')}>Users</button>
                        <button className='activeBtn' onClick={() => settingTab('custom')}>Customization</button>
                    </div>
                    <div className="companyProfile">
                        <div className='profileHeading'>
                            <h6>Customization</h6>
                            <p>Enable or disable features for your space</p>
                        </div>
                        <div className='profileSave'>
                            <button className='cancel'>Cancel</button>
                            <button className='save'>Save</button>
                        </div>
                    </div>

                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={dashboard} alt="" />
                            <div><p>Dashboard (Admin)</p><span>Admin summary</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={members} alt="" />
                            <div><p>Members (Admin)</p><span>Manage users</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={assets} alt="" />
                            <div><p>Assets (Admin)</p><span>Manage bookable spaces</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={tasks} alt="" />
                            <div><p>Tasks (Admin)</p><span>Internal task list</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={messenger} alt="" />
                            <div><p>Message Center (Admin)</p><span>Internal messaging system</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={calender} alt="" />
                            <div><p>Calendar (Admin)</p><span>Bookings, tours, etc</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={files} alt="" />
                            <div><p>Files (Admin)</p><span>File storage</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={finance} alt="" />
                            <div><p>Finances (Admin)</p><span>Invoices, income, expense tracking, etc</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                    <div className="settingCustom">
                        <div className="dashboardInfos">
                            <img src={settings} alt="" />
                            <div><p>Settings (Admin)</p><span>Space customization</span></div>
                        </div>
                        <div className="authToggle">
                            {authValue === true ?
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} defaultChecked />
                                    <span className="slider round"></span>
                                </label> :
                                <label className="switch">
                                    <input type="checkbox" onClick={authClick} />
                                    <span className="slider round"></span>
                                </label>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Customization