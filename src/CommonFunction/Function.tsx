import imgExtension from "../Assets/Images/icon/feature-image.png";
import fileExtension from "../Assets/Images/icon/feature-file.png";
import videoExtension from "../Assets/Images/icon/feature-video.png";
import unknownExtension from "../Assets/Images/icon/feature-unknown.png";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';


export function convertBytesToSize(bytes: any) {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (bytes < kilobyte) {
    return bytes + ' Byte';
  } else if (bytes < megabyte) {
    return Math.round(bytes / kilobyte) + ' KB';
  } else if (bytes < gigabyte) {
    return Math.round(bytes / megabyte) + ' MB';
  } else {
    return Math.round(bytes / gigabyte) + ' GB';
  }
}

export const getFileType = (extension: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

  if (imageExtensions.includes(extension)) {
    return imgExtension;
  } else if (videoExtensions.includes(extension)) {
    return videoExtension;
  } else if (documentExtensions.includes(extension)) {
    return fileExtension;
  } else {
    return unknownExtension;
  }
};
// due date
export function getDueDateStatus(dueDateString: any) {
  // Parse the due date string into a Date object
  const dueDate = new Date(dueDateString);

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const difference = dueDate.getTime() - currentDate.getTime();

  // Convert difference to days
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

  // Check if the due date is in the past or the future
  if (daysDifference < 0) {
    // Due date is in the past
    if (daysDifference === -1) {
      return 'Yesterday';
    } else {
      return `${Math.abs(daysDifference)} days ago`;
    }
  } else if (daysDifference === 0) {
    // Due date is today
    return 'Today';
  } else if (daysDifference === 1) {
    // Due date is tomorrow
    return 'Tomorrow';
  } else {
    // Due date is in the future, return the actual date
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}


export function separateComma(sharesString: any) {
  return sharesString.split(',').map((filename: any) => filename.trim());
}

export function maskEmail(email: string) {
  if (email) {
    const atIndex = email.indexOf('@');
    // Check if '@' is found in the email
    if (atIndex === -1) {
      console.error('Invalid email format: "@" not found');
      return email; // Return the original email if '@' is not found
    }

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);
    if (username.length >= 13) {
      const maskedUsername = username.substring(0, 10) + '...';
      return maskedUsername + domain;
    }
    return email;
  }


}

// chatting function

export const formattedDateForChatHeadWithCurrent = () => {
  const now = moment();

  // Format the date
  const formattedDate = now.format('dddd, MMMM Do');

  // Add the ordinal suffix manually
  const day = now.date();
  const ordinalSuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const finalFormattedDate = formattedDate.replace('Do', `${day}${ordinalSuffix}`);
  return finalFormattedDate;
}


export const fromNow = (date: any) => {
  const dateMoment = moment(date)
  const readable = dateMoment.fromNow()
  return readable
}


export const convertTimeToReadable = (date: any) => {
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const dateObj = new Date(date);
  const timeString = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  // Check if the date is today
  if (dateObj.toDateString() === now.toDateString()) {
    return timeString;
  }
  // Check if the date is yesterday
  else if (dateObj.toDateString() === yesterday.toDateString()) {
    return `yesterday ${timeString}`;
  }
  // If the date is before yesterday
  else {
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const suffix = ['st', 'nd', 'rd', 'th'][((day % 10) - 1) % 10] || 'th';
    return `${day}${suffix}, ${month}, ${timeString}`;
  }
}

const getFirstName = (full_name: string) => {
  const first_name = full_name.split(" ")[0]
  return first_name
}

export const enhanceGroupUserName = (name: string) => {
  const names = name.split("&")
  const rest_names = names.slice(3)
  const main_name = `${getFirstName(names[1])},${getFirstName(names[2])}`
  if (rest_names.length === 0) return main_name
  else if (rest_names.length === 1) {
    const full_group_name = `${main_name} & ${getFirstName(rest_names[0])}`
    return full_group_name
  } else {
    const rest_users_number = rest_names.length
    const full_group_name = `${main_name} & ${rest_users_number} others`
    return full_group_name
  }
}

export const enhanceToGroupUserName = (name: string) => {
  console.log('group', name);
  return name.replace(/&/g, ' & ');

  //   const names = name.split("&")
  //   const rest_names = names.slice(2)
  //   const main_name = `${names[0]}, ${names[1]}`
  //   const rest_name = rest_names.reduce((acc, cur) => {
  //     return `${acc}, ${cur}`;
  //   });


  //   return main_name + " & " + rest_name
}

export const handleTodayClick = (setDueDate: any) => {
  setDueDate(new Date());
};

export const handleYesterdayClick = (setDueDate: any) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  setDueDate(yesterday);
};

export const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, setDueDate }: any) => (
  <div>
    <div className='calenderHeading'>
      <button className='arrowLeft' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}><FontAwesomeIcon icon={faChevronLeft} /></button>
      <span className='calenderDate'>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      <button className='arrowRight' onClick={increaseMonth} disabled={nextMonthButtonDisabled}><FontAwesomeIcon icon={faChevronRight} /></button>
    </div>
    <div className='calenderBtn'>
      <button onClick={() => handleYesterdayClick(setDueDate)}>Yesterday</button>
      <button onClick={() => handleTodayClick(setDueDate)}>Today</button>
    </div>
  </div>
);

// pagination divided
export function multiplyBySixAndShowSeries(originalValue: number) {
  if (originalValue <= 6) {
    return [originalValue];
  }
  const resultArray = Array.from({ length: Math.ceil(originalValue / 6) }, (_, index) => {
    const calculatedValue = 6 * (index + 1);
    return calculatedValue <= originalValue ? calculatedValue : originalValue;
  });
  return resultArray;
}

export function paginationNumber(total: any, limit: any) {
  const divisions = Math.ceil(total / limit);
    const resultArray = [];
    for (let i = 1; i <= divisions; i++) {
        resultArray.push(i);
    }
    return resultArray;
}