import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if required Firebase config values are present
const isFirebaseConfigValid = () => {
  return (
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )
}

// Initialize Firebase with error handling
let analytics

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()

// Authentication functions
const signInWithGoogle = async (userType) => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Check if user exists in database
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        userType: userType || "patient", // Default to patient if not specified
        createdAt: serverTimestamp(),
        isApproved: true, // Auto-approve Google sign-ins
      })

      // Send welcome email
      await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          userType: userType || "patient",
        }),
      })
    }

    return { user, userType: userSnap.exists() ? userSnap.data().userType : userType || "patient" }
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

const signUpWithEmailAndPassword = async (email, password, displayName, userType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile
    await updateProfile(user, {
      displayName: displayName,
    })

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      userType: userType || "patient",
      createdAt: serverTimestamp(),
      isApproved: true, // Auto-approve users
    })

    // Send welcome email
    await fetch("/api/send-welcome-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: displayName,
        userType: userType || "patient",
      }),
    })

    return user
  } catch (error) {
    console.error("Error signing up with email and password:", error)
    throw error
  }
}

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error logging in with email and password:", error)
    throw error
  }
}

const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

// User functions
const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      throw new Error("User not found")
    }
  } catch (error) {
    console.error("Error getting user data:", error)
    throw error
  }
}

const updateUserData = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user data:", error)
    throw error
  }
}

// Appointment functions
const createAppointment = async (appointmentData) => {
  try {
    const appointmentRef = collection(db, "appointments")
    const docRef = await addDoc(appointmentRef, {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

const getAppointmentsByPatient = async (patientId) => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const q = query(
      appointmentsRef,
      where("patientId", "==", patientId),
      orderBy("appointmentDate", "desc"),
      orderBy("appointmentTime", "desc"),
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      appointmentDate: doc.data().appointmentDate?.toDate?.() || doc.data().appointmentDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting patient appointments:", error)
    throw error
  }
}

const getAppointmentsByDoctor = async (doctorId) => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const q = query(
      appointmentsRef,
      where("doctorId", "==", doctorId),
      orderBy("appointmentDate", "desc"),
      orderBy("appointmentTime", "desc"),
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      appointmentDate: doc.data().appointmentDate?.toDate?.() || doc.data().appointmentDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting doctor appointments:", error)
    throw error
  }
}

const updateAppointment = async (appointmentId, data) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await updateDoc(appointmentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    throw error
  }
}

const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await deleteDoc(appointmentRef)
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw error
  }
}

// Prescription functions
const createPrescription = async (prescriptionData) => {
  try {
    const prescriptionRef = collection(db, "prescriptions")
    const docRef = await addDoc(prescriptionRef, {
      ...prescriptionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating prescription:", error)
    throw error
  }
}

const getPrescriptionsByPatient = async (patientId) => {
  try {
    const prescriptionsRef = collection(db, "prescriptions")
    const q = query(prescriptionsRef, where("patientId", "==", patientId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
      endDate: doc.data().endDate?.toDate?.() || doc.data().endDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting patient prescriptions:", error)
    throw error
  }
}

const getPrescriptionsByDoctor = async (doctorId) => {
  try {
    const prescriptionsRef = collection(db, "prescriptions")
    const q = query(prescriptionsRef, where("doctorId", "==", doctorId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
      endDate: doc.data().endDate?.toDate?.() || doc.data().endDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting doctor prescriptions:", error)
    throw error
  }
}

const updatePrescription = async (prescriptionId, data) => {
  try {
    const prescriptionRef = doc(db, "prescriptions", prescriptionId)
    await updateDoc(prescriptionRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating prescription:", error)
    throw error
  }
}

const deletePrescription = async (prescriptionId) => {
  try {
    const prescriptionRef = doc(db, "prescriptions", prescriptionId)
    await deleteDoc(prescriptionRef)
  } catch (error) {
    console.error("Error deleting prescription:", error)
    throw error
  }
}

// Medical Records functions
const uploadMedicalRecord = async (patientId, file, metadata) => {
  try {
    // Upload file to storage
    const storageRef = ref(storage, `medical-records/${patientId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    // Create record in database
    const recordRef = collection(db, "medicalRecords")
    const docRef = await addDoc(recordRef, {
      patientId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileURL: downloadURL,
      ...metadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error uploading medical record:", error)
    throw error
  }
}

const getMedicalRecordsByPatient = async (patientId) => {
  try {
    const recordsRef = collection(db, "medicalRecords")
    const q = query(recordsRef, where("patientId", "==", patientId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      recordDate: doc.data().recordDate?.toDate?.() || doc.data().recordDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting patient medical records:", error)
    throw error
  }
}

const deleteMedicalRecord = async (recordId) => {
  try {
    const recordRef = doc(db, "medicalRecords", recordId)
    await deleteDoc(recordRef)
  } catch (error) {
    console.error("Error deleting medical record:", error)
    throw error
  }
}

// Messaging functions
const sendMessage = async (senderId, receiverId, content) => {
  try {
    // Create a unique conversation ID (sorted UIDs to ensure consistency)
    const conversationId = [senderId, receiverId].sort().join("_")

    // Add message to the conversation
    const messagesRef = collection(db, `conversations/${conversationId}/messages`)
    await addDoc(messagesRef, {
      senderId,
      content,
      timestamp: serverTimestamp(),
      read: false,
    })

    // Update or create conversation document
    const conversationRef = doc(db, "conversations", conversationId)
    const conversationSnap = await getDoc(conversationRef)

    if (conversationSnap.exists()) {
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
        lastMessageSenderId: senderId,
        [`unreadCount_${receiverId}`]: conversationSnap.data()[`unreadCount_${receiverId}`] + 1 || 1,
      })
    } else {
      await setDoc(conversationRef, {
        participants: [senderId, receiverId],
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
        lastMessageSenderId: senderId,
        [`unreadCount_${receiverId}`]: 1,
        [`unreadCount_${senderId}`]: 0,
        createdAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

const getConversations = async (userId) => {
  try {
    const conversationsRef = collection(db, "conversations")
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId),
      orderBy("lastMessageTimestamp", "desc"),
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastMessageTimestamp: doc.data().lastMessageTimestamp?.toDate?.() || doc.data().lastMessageTimestamp,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting conversations:", error)
    throw error
  }
}

const getMessages = async (conversationId, limit = 50) => {
  try {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`)
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(limit))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp,
      }))
      .reverse() // Reverse to get chronological order
  } catch (error) {
    console.error("Error getting messages:", error)
    throw error
  }
}

const markConversationAsRead = async (conversationId, userId) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId)
    await updateDoc(conversationRef, {
      [`unreadCount_${userId}`]: 0,
    })
  } catch (error) {
    console.error("Error marking conversation as read:", error)
    throw error
  }
}

// Feedback functions
const submitFeedback = async (feedbackData) => {
  try {
    const feedbackRef = collection(db, "feedback")
    const docRef = await addDoc(feedbackRef, {
      ...feedbackData,
      createdAt: serverTimestamp(),
      status: "pending", // pending, responded
    })
    return docRef.id
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw error
  }
}

const getFeedbackByUser = async (userId) => {
  try {
    const feedbackRef = collection(db, "feedback")
    const q = query(feedbackRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      responseTimestamp: doc.data().responseTimestamp?.toDate?.() || doc.data().responseTimestamp,
    }))
  } catch (error) {
    console.error("Error getting user feedback:", error)
    throw error
  }
}

const respondToFeedback = async (feedbackId, response) => {
  try {
    const feedbackRef = doc(db, "feedback", feedbackId)
    await updateDoc(feedbackRef, {
      response,
      responseTimestamp: serverTimestamp(),
      status: "responded",
    })
  } catch (error) {
    console.error("Error responding to feedback:", error)
    throw error
  }
}

// Admin functions
const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users")
    const querySnapshot = await getDocs(usersRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting all users:", error)
    throw error
  }
}

const getPendingApprovals = async () => {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("isApproved", "==", false), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }))
  } catch (error) {
    console.error("Error getting pending approvals:", error)
    throw error
  }
}

const approveUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      isApproved: true,
      approvedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error approving user:", error)
    throw error
  }
}

const getAllAppointments = async (limit = 100) => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const q = query(
      appointmentsRef,
      orderBy("appointmentDate", "desc"),
      orderBy("appointmentTime", "desc"),
      limit(limit),
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      appointmentDate: doc.data().appointmentDate?.toDate?.() || doc.data().appointmentDate,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))
  } catch (error) {
    console.error("Error getting all appointments:", error)
    throw error
  }
}

const getAllFeedback = async (limit = 100) => {
  try {
    const feedbackRef = collection(db, "feedback")
    const q = query(feedbackRef, orderBy("createdAt", "desc"), limit(limit))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      responseTimestamp: doc.data().responseTimestamp?.toDate?.() || doc.data().responseTimestamp,
    }))
  } catch (error) {
    console.error("Error getting all feedback:", error)
    throw error
  }
}

// Doctor availability functions
const updateDoctorAvailability = async (doctorId, availabilityData) => {
  try {
    const availabilityRef = doc(db, "doctorAvailability", doctorId)
    await setDoc(
      availabilityRef,
      {
        ...availabilityData,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating doctor availability:", error)
    throw error
  }
}

const getDoctorAvailability = async (doctorId) => {
  try {
    const availabilityRef = doc(db, "doctorAvailability", doctorId)
    const docSnap = await getDoc(availabilityRef)

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting doctor availability:", error)
    throw error
  }
}

// Get all doctors
const getAllDoctors = async () => {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("userType", "==", "doctor"), where("isApproved", "==", true))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }))
  } catch (error) {
    console.error("Error getting all doctors:", error)
    throw error
  }
}

// Custom function to check if a user is an admin
const getAdminAuthStatus = () => {
  try {
    const user = auth.currentUser
    if (user) {
      // Check for a custom claim on the user's token
      return user.email === "admin@smartcare.com"
    }
    return false
  } catch (error) {
    console.error("Error checking admin auth status:", error)
    return false
  }
}

// Custom function to sign in as admin
const signInAsAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Check if the user is an admin (e.g., by checking a custom claim)
    if (user.email === "admin@smartcare.com") {
      return { success: true, user }
    } else {
      // Sign out if not an admin
      await signOut(auth)
      return { success: false, error: "Unauthorized: Not an admin account" }
    }
  } catch (error) {
    console.error("Error signing in as admin:", error)
    return { success: false, error: error.message }
  }
}

// Custom function to sign out admin
const signOutAdmin = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error("Error signing out admin:", error)
    return { success: false, error: error.message }
  }
}

export {
  auth,
  db,
  storage,
  signInWithGoogle,
  signUpWithEmailAndPassword,
  loginWithEmailAndPassword,
  logoutUser,
  resetPassword,
  getUserData,
  updateUserData,
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
  uploadMedicalRecord,
  getMedicalRecordsByPatient,
  deleteMedicalRecord,
  sendMessage,
  getConversations,
  getMessages,
  markConversationAsRead,
  submitFeedback,
  getFeedbackByUser,
  respondToFeedback,
  getAllUsers,
  getPendingApprovals,
  approveUser,
  getAllAppointments,
  getAllFeedback,
  updateDoctorAvailability,
  getDoctorAvailability,
  getAllDoctors,
  signOutAdmin,
  getAdminAuthStatus,
  signInAsAdmin,
}
