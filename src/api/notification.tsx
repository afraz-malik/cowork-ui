import { get } from './base-api'

// single profile
export const notificationsList = async () => {
  return get(`/invoiceNotification`)
}
