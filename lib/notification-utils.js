import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "./firebase"

// Send a notification to a user
export async function sendNotification(userId, notification) {
  try {
    // Add to notifications collection
    const notificationRef = collection(db, "notifications")
    const newNotification = {
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type || "info",
      read: false,
      actionLink: notification.actionLink || null,
      actionText: notification.actionText || null,
      createdAt: serverTimestamp(),
      metadata: notification.metadata || {},
    }

    const docRef = await addDoc(notificationRef, newNotification)

    // Update user's notification counter
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        unreadNotifications: (userDoc.data().unreadNotifications || 0) + 1,
        recentNotifications: arrayUnion({
          id: docRef.id,
          title: notification.title,
          createdAt: new Date().toISOString(),
          type: notification.type || "info",
        }),
      })
    }

    return docRef.id
  } catch (error) {
    console.error("Error sending notification:", error)
    throw error
  }
}

// Send an access request notification to a patient
export async function sendAccessRequestNotification(patientId, adminId, adminName, dataType, reason) {
  try {
    // Get admin data for the notification
    const adminDoc = await getDoc(doc(db, "users", adminId))
    const adminData = adminDoc.exists() ? adminDoc.data() : { displayName: adminName || "Admin" }

    // Create notification
    const notification = {
      title: `Access Request: ${dataType}`,
      message: `${adminData.displayName} has requested access to your ${dataType}. Reason: ${reason}`,
      type: "access_request",
      actionLink: "/dashboard/settings/privacy",
      actionText: "Review Request",
      metadata: {
        adminId,
        adminName: adminData.displayName,
        dataType,
        reason,
        requestedAt: new Date().toISOString(),
      },
    }

    return await sendNotification(patientId, notification)
  } catch (error) {
    console.error("Error sending access request notification:", error)
    throw error
  }
}
