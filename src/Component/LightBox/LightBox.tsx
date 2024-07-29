import React, { useState } from 'react'
import { DESKIE_API as API } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faXmark } from '@fortawesome/free-solid-svg-icons'
import './LightBox.css'
import { SlideshowLightbox } from 'lightbox.js-react'

interface LightBoxShowProps {
  handleLightBoxClose?: () => void
  lightBoxShow: boolean
  handleDownloadClick?: (fileName: string) => void
  setLightBoxShow: (type: boolean) => void
  lightBoxFile: string
}

const LightBox = ({
  lightBoxFile,
  lightBoxShow,
  setLightBoxShow,
  handleLightBoxClose,
  handleDownloadClick
}: LightBoxShowProps) => {
  const [imageError, setImageError] = useState(false)
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      {lightBoxShow && (
        <div className='lightbox-overlay' onClick={handleLightBoxClose}>
          <div className='lightbox-content'>
            <div className='lightbox-inner'>
              {imageError ? (
                <div className='lightbox-error'>
                  <p>No preview available</p>
                  <div className='lightbox-error-buttons'>
                    {handleDownloadClick && (
                      <button onClick={() => handleDownloadClick(lightBoxFile)} className='download-button'>
                        <FontAwesomeIcon icon={faDownload} /> Download
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={`${API}/${lightBoxFile}`}
                  alt='lightbox'
                  className='lightbox-image'
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LightBox
