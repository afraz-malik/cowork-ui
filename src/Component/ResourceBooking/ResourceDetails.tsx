import React from 'react'
import { DESKIE_API as API } from '../../config'
import spaceIcon from '../../Assets/Images/icon/spaceAvatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import bookingIcon from '../../Assets/Images/icon/file-02.svg'

interface tabMemberProps {
  tabChoose: (tab: string, select: string) => void
  resourceDetail: any
}
const ResourceDetails = ({ tabChoose, resourceDetail }: tabMemberProps) => {
  const detailsFunction = () => {
    tabChoose('schedule', 'details')
  }
  return (
    <>
      <div className='paymentDetails'>
        <div className='detailsHeading'>
          <h6>
            <img src={bookingIcon} alt='bookingIcon' /> Details
          </h6>
        </div>
        <div className='resourceShow'>
          <div className='leftResource'>
            <div>
              <h6>Capacity</h6>
              <p className='mb-0 mt-4'>{resourceDetail.capacity} occupants</p>
            </div>
            <div>
              <h6>Type</h6>
              <div className='resourceType border-0 p-0 mt-4'>
                {resourceDetail.type === 'meeting' ? (
                  <span className='meeting'>Meeting Space</span>
                ) : (
                  ''
                )}
                {resourceDetail.type === 'equipment' ? (
                  <span className='equipment'>Equipment</span>
                ) : (
                  ''
                )}
                {resourceDetail.type === 'workspace' ? (
                  <span className='workspace'>Workspace</span>
                ) : (
                  ''
                )}
                {resourceDetail.type === 'other' ? (
                  <span className='other'>Other</span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div>
              <h6>Rate</h6>
              <p className='mb-0 mt-4'>${resourceDetail.member_rate}</p>
            </div>
          </div>
          <div className='rightResource'>
            {resourceDetail.image ? (
              <img
                src={`${API}/${resourceDetail.image}`}
                alt='avatar'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img src={spaceIcon} width='100px' height='100px' alt='shop' />
            )}
          </div>
        </div>
      </div>
      <div className='resourcesBtn'>
        <button className='cancel'>Cancel</button>
        <button className='continue' onClick={detailsFunction}>
          Continue <FontAwesomeIcon icon={faArrowRight} className='ml-2' />
        </button>
      </div>
    </>
  )
}

export default ResourceDetails
