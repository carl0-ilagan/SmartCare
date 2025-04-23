import { doc, getDoc, getDocs, query, collection, where, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

// Check if a user has admin privileges
export async function isUserAdmin(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data().role === "admin"
    }
    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Get all admin users
export async function getAdminUsers() {
  try {
    const adminsSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "admin")))
    return adminsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return []
  }
}

// Create a new admin user (should be protected by security rules)
export async function createAdminUser(userData) {
  try {
    // This should be done through a secure admin API in production
    // For demo purposes only
    const userRef = doc(db, "users", userData.uid)
    await setDoc(userRef, {
      ...userData,
      role: "admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}
