import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const showNotifications = (toastifyType: string, message: string, subMessage?: string) => {

    const messageType = Array.isArray(message);
    let showMessage = message;

    if(messageType){
        showMessage = "";
        for(const msg of message){
            showMessage += `${msg}. `
        }
    }

    switch (toastifyType) {
        case 'success':
            toast.success(
                <div className='d-flex flex-column'>
                    <div className='main'>{showMessage}</div>
                    <div className='sub'>{subMessage}</div>
                </div>
            );
            break;
        case 'error':
            toast.error(
                <div className='d-flex flex-column'>
                    <div className='main'>{showMessage}</div>
                    <div className='sub'>{subMessage}</div>
                </div>
            );
            break;
        default:
            toast.info(
                <div className='d-flex flex-column'>
                    <div className='main'>{showMessage}</div>
                    <div className='sub'>{subMessage}</div>
                </div>
            );
    }
}   