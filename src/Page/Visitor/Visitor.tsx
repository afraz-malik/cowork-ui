import React, { useState, useEffect } from 'react';
import "./Visitor.css";
import qrImage from "../../Assets/Images/icon/wifiScan.png";
import checkCircle from "../../Assets/Images/icon/check-circle-white.png";
import { DESKIE_API as API } from '../../config';
import { singleProfile } from '../../api/settings';
import logo from "../../Assets/Images/logo/logo.png";
import { Dropdown } from 'react-bootstrap';
import arrow from "../../Assets/Images/icon/downIcon.png";
import { v4 as uuidv4 } from 'uuid';
import { visitorAdd } from '../../api/visitor';
import { showNotifications } from '../../CommonFunction/toaster';
import { ToastContainer } from 'react-toastify';
import checkIcon from "../../Assets/Images/icon/check-circle.png"
import { getMemberList } from '../../api/member';
import { adminList } from '../../api/admin';

const Visitor = () => {
  const [profile, setProfile] = useState<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [roleItem, setRoleItem] = useState<string | null>(null);
  const [visitorOption, setVisitorOption] = useState(true);
  const [visitorInfo, setVisitorInfo] = useState(false);
  const [successCheck, setSuccessCheck] = useState(false);
  const [member, setMember] = useState([]);
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    singleProfile().then((data) => {
      setProfile(data.data);
    })
    getMemberList(100, 1).then((data) => {
      setMember(data.members);
    })
    adminList().then((data) => {
      setAdmin(data);
    })
  }, []);

  

  const handleSelect = (eventKey: string | null) => {
    setSelectedItem(eventKey);
  };

  const manuallyOption = () => {
    setVisitorOption(false);
    setVisitorInfo(true);
  }

  const saveVisitor = () => {
    let invoiceInfo = {
      "id": uuidv4(),
      "name": name,
      "email": email,
      "reason": selectedItem,
      "looking": roleItem,
      "companyName": profile.company_name,
      "address": profile.address,
      "logoImage": `${API}/${encodeURIComponent(profile.company_logo_dark)}`,
    }

    visitorAdd(invoiceInfo).then((data) => {
      if (data.statusCode !== 201) {
        showNotifications("error", "Insert all the information");
      }
      else {
        showNotifications("success", data.message);
        setVisitorInfo(false);
        setSuccessCheck(true);
      }
    })
  }
  return (
    <section className='visitorSection'>
      <ToastContainer />
      <div className="visitorLeft">
        <div className='visitorImage' style={{ background: `linear-gradient(rgba(31, 41, 55, 0.9), rgba(31, 41, 55, 0.94)), url(${profile && `${API}/${encodeURIComponent(profile.background)}`})` }}>
          <div>
            {profile && profile.company_logo_dark ?
              <img src={`${API}/${profile.company_logo_dark}`} alt="logo" />
              : <img src={logo} alt="logo" />
            }
            <h5>Guest Check-in</h5>
          </div>

        </div>
      </div>
      {visitorOption ? <div className="visitorRight">
        <h5>Scan <b>QR code</b> to check-in as a guest</h5>
        <img src={qrImage} alt="qrImage" />
        <div className="orLine">
          <h2><span>or</span></h2>
        </div>
        <button className='tapNext' onClick={manuallyOption}><img src={checkCircle} alt="check" /> TAP TO CHECK IN MANUALLY</button>
      </div> : ""}
      {visitorInfo ? <div className="visitorRight">
        <div className="reasonVisit memberInput">
          <label>Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder='Enter your name' className='form-control' required />
        </div>
        <div className="reasonVisit memberInput">
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter your E-mail' className='form-control' required />
        </div>
        <div className="reasonVisit memberInput">
          <label>Reason For Visit</label>
          <Dropdown onSelect={handleSelect}>
            <Dropdown.Toggle id="dropdown-basic">
              {selectedItem && selectedItem ? <>{selectedItem} <img src={arrow} alt="arrow" /></> : <>Choose <img src={arrow} alt="arrow" /></>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Guest">Guest</Dropdown.Item>
              <Dropdown.Item eventKey="Delivery">Delivery</Dropdown.Item>
              <Dropdown.Item eventKey="Maintenance">Maintenance</Dropdown.Item>
              <Dropdown.Item eventKey="Tour">Tour</Dropdown.Item>
              <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="reasonVisit memberInput mb-2">
          <label>I’m Here To See</label>
          <Dropdown onSelect={(event) => setRoleItem(event)}>
            <Dropdown.Toggle id="dropdown-basic">
              {roleItem && roleItem ? <>{roleItem} <img src={arrow} alt="arrow" /></> : <>Nobody <img src={arrow} alt="arrow" /></>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {admin && admin.map((admin: any, index: number) =><Dropdown.Item eventKey={`${admin.first_name} ${admin.last_name}`}>{admin.first_name} {admin.last_name}</Dropdown.Item>)}
              {member && member.map((member: any, index: number) =><Dropdown.Item eventKey={`${member.first_name} ${member.last_name}`}>{member.first_name} {member.last_name}</Dropdown.Item>)}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <button className='tapNext mt-5' onClick={saveVisitor}><img src={checkCircle} alt="check" /> TAP TO CHECK IN</button>
      </div> : ""}

      {successCheck ? <div className="visitorRight">
        <div className="success text-center">
          <img src={checkIcon} alt="check" />
          <h5>Welcome, {name}!</h5>
          <h4>{name} has been notified that you’re here.</h4>
        </div>
      </div> : ""}

    </section>
  )
}

export default Visitor