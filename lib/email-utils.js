// lib/email-utils.js
import {
  sendApprovalEmail as sendApprovalEmailAction,
  sendRejectionEmail as sendRejectionEmailAction,
  sendNotificationEmail as sendNotificationEmailAction,
} from "@/app/api/email/actions"

/**
 * Retrieves email history from local storage.
 * @returns {Array} An array of email objects.
 */
export const getEmailHistory = () => {
  try {
    const storedEmails = localStorage.getItem("emailHistory")
    return storedEmails ? JSON.parse(storedEmails) : []
  } catch (error) {
    console.error("Error retrieving email history from localStorage:", error)
    return []
  }
}

/**
 * Stores email details in local storage.
 * @param {Object} emailData - The email object to store.
 */
export const storeEmailDetails = (emailData) => {
  try {
    const emailHistory = getEmailHistory()
    const updatedHistory = [...emailHistory, { ...emailData, timestamp: new Date().toISOString() }]
    localStorage.setItem("emailHistory", JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error storing email details in localStorage:", error)
  }
}

// Re-export the server actions for sending emails
export const sendApprovalEmail = sendApprovalEmailAction
export const sendRejectionEmail = sendRejectionEmailAction
export const sendNotificationEmail = sendNotificationEmailAction
