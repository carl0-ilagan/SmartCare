"use client"

import { useState, useEffect } from "react"
import { Bell, Lock, Shield, Calendar, Clock, Monitor, Smartphone, Globe, LogOut } from "lucide-react"
import { SaveConfirmationModal } from "@/components/save-confirmation-modal"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SuccessNotification } from "@/components/success-notification"
import { SettingsBanner } from "@/components/settings-banner"
import { SuspiciousLoginHistory } from "@/components/suspicious-login-history"
import { getUserSessions, revokeSession, revokeAllOtherSessions, formatSessionTime } from "@/lib/session-management"

export default function DoctorSettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    notifications: {
      appointments: true,
      messages: true,
      prescriptions: true,
      patientUpdates: true,
      marketing: false,
    },
    privacy: {
      allowAnalytics: true,
      shareExpertise: false,
      anonymousFeedback: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
    },
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  // Fetch user settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return

      try {
        setLoading(true)
        const settingsDoc = await getDoc(doc(db, "userSettings", user.uid))
        if (settingsDoc.exists()) {
          // Merge with default settings to ensure all properties exist
          const fetchedSettings = settingsDoc.data()
          setSettings((prevSettings) => ({
            notifications: { ...prevSettings.notifications, ...fetchedSettings.notifications },
            privacy: { ...prevSettings.privacy, ...fetchedSettings.privacy },
            security: { ...prevSettings.security, ...fetchedSettings.security },
          }))
        } else {
          // Create default settings if none exist
          await setDoc(doc(db, "userSettings", user.uid), {
            ...settings,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        setNotification({
          show: true,
          message: "Failed to load settings. Please try again.",
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [user])

  // Fetch user sessions from Firestore
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return

      try {
        setSessionsLoading(true)
        const sessionsData = await getUserSessions(user.uid)
        setSessions(sessionsData)
      } catch (error) {
        console.error("Error fetching sessions:", error)
        setNotification({
          show: true,
          message: "Failed to load sessions. Please try again.",
          type: "error",
        })
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [user])

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    })
  }

  const handlePrivacyChange = (key) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    })
  }

  const handleSecurityChange = (key, value) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: typeof value === "boolean" ? value : value,
      },
    })
  }

  // Fetch active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return

      try {
        setSessionsLoading(true)
        const activeSessions = await getUserSessions(user.uid)
        setSessions(activeSessions)
      } catch (error) {
        console.error("Error fetching sessions:", error)
        setNotification({
          show: true,
          message: "Failed to load active sessions",
          type: "error",
        })
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [user])

  // Handle revoking a session
  const handleRevokeSession = async (sessionId) => {
    try {
      setSessionsLoading(true)
      await revokeSession(sessionId)

      // Update the sessions list
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))

      setNotification({
        show: true,
        message: "Session revoked successfully",
        type: "success",
      })
    } catch (error) {
      console.error("Error revoking session:", error)
      setNotification({
        show: true,
        message: "Failed to revoke session",
        type: "error",
      })
    } finally {
      setSessionsLoading(false)
    }
  }

  // Handle revoking all other sessions
  const handleRevokeAllOtherSessions = async () => {
    try {
      setSessionsLoading(true)
      await revokeAllOtherSessions(user.uid)

      // Refresh the sessions list
      const activeSessions = await getUserSessions(user.uid)
      setSessions(activeSessions)

      setNotification({
        show: true,
        message: "All other sessions revoked successfully",
        type: "success",
      })
    } catch (error) {
      console.error("Error revoking other sessions:", error)
      setNotification({
        show: true,
        message: "Failed to revoke other sessions",
        type: "error",
      })
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return

    try {
      setSaveLoading(true)
      await setDoc(
        doc(db, "userSettings", user.uid),
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
      setShowSaveModal(true)
    } catch (error) {
      console.error("Error saving settings:", error)
      setNotification({
        show: true,
        message: "Failed to save settings. Please try again.",
        type: "error",
      })
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-24 md:pt-28">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <SettingsBanner userRole="doctor" />

      {notification.show && (
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div className="space-y-6">
        {/* Notifications */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-graphite">Notifications</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="notify-appointments" className="text-sm text-graphite">
                Appointment Notifications
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notify-appointments"
                  className="peer sr-only"
                  checked={settings.notifications.appointments}
                  onChange={() => handleNotificationChange("appointments")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="notify-messages" className="text-sm text-graphite">
                New Messages
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notify-messages"
                  className="peer sr-only"
                  checked={settings.notifications.messages}
                  onChange={() => handleNotificationChange("messages")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="notify-prescriptions" className="text-sm text-graphite">
                Prescription Updates
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notify-prescriptions"
                  className="peer sr-only"
                  checked={settings.notifications.prescriptions}
                  onChange={() => handleNotificationChange("prescriptions")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="notify-patientUpdates" className="text-sm text-graphite">
                Patient Updates
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notify-patientUpdates"
                  className="peer sr-only"
                  checked={settings.notifications.patientUpdates}
                  onChange={() => handleNotificationChange("patientUpdates")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="notify-marketing" className="text-sm text-graphite">
                Marketing & Promotions
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notify-marketing"
                  className="peer sr-only"
                  checked={settings.notifications.marketing}
                  onChange={() => handleNotificationChange("marketing")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-graphite">Privacy</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="privacy-analytics" className="text-sm font-medium text-graphite">
                  Allow Analytics
                </label>
                <p className="text-xs text-drift-gray">Help us improve by allowing anonymous usage data collection</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="privacy-analytics"
                  className="peer sr-only"
                  checked={settings.privacy.allowAnalytics}
                  onChange={() => handlePrivacyChange("allowAnalytics")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="privacy-share-expertise" className="text-sm font-medium text-graphite">
                  Share Expertise Publicly
                </label>
                <p className="text-xs text-drift-gray">
                  Allow your professional information to be displayed in doctor search
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="privacy-share-expertise"
                  className="peer sr-only"
                  checked={settings.privacy.shareExpertise || false}
                  onChange={() => handlePrivacyChange("shareExpertise")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="privacy-anonymous-feedback" className="text-sm font-medium text-graphite">
                  Anonymous Patient Feedback
                </label>
                <p className="text-xs text-drift-gray">Allow patients to submit anonymous feedback about your care</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="privacy-anonymous-feedback"
                  className="peer sr-only"
                  checked={settings.privacy.anonymousFeedback || true}
                  onChange={() => handlePrivacyChange("anonymousFeedback")}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-pale-stone bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-graphite">Security</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="security-2fa" className="text-sm font-medium text-graphite">
                  Two-Factor Authentication
                </label>
                <p className="text-xs text-drift-gray">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="security-2fa"
                  className="peer sr-only"
                  checked={settings.security.twoFactor}
                  onChange={() => handleSecurityChange("twoFactor", !settings.security.twoFactor)}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500"></div>
              </label>
            </div>

            {/* Two-Factor Authentication Status */}
            <div className="pt-2 pb-4">
              <p className="text-sm text-graphite">
                Status:{" "}
                <span className={`font-medium ${settings.security.twoFactor ? "text-green-600" : "text-red-600"}`}>
                  {settings.security.twoFactor ? "Enabled" : "Disabled"}
                </span>
              </p>
              {!settings.security.twoFactor && (
                <p className="text-xs text-drift-gray mt-1">
                  Enable two-factor authentication for additional account security
                </p>
              )}
            </div>

            <div>
              <label htmlFor="session-timeout" className="mb-1 block text-sm font-medium text-graphite">
                Session Timeout
              </label>
              <p className="text-xs text-drift-gray mb-2">
                Automatically log out when the website is not in use for the selected period
              </p>
              <select
                id="session-timeout"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                className="w-full max-w-xs rounded-md border border-earth-beige bg-white py-2 pl-3 pr-10 text-graphite focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Login Sessions */}
            <div className="pt-4 border-t border-earth-beige">
              <h3 className="font-medium text-graphite mb-3">Login Sessions</h3>
              <p className="text-sm text-drift-gray mb-2">Currently active sessions on your account:</p>

              <div className="mb-4">
                <button
                  onClick={handleRevokeAllOtherSessions}
                  disabled={sessionsLoading || sessions.filter((s) => !s.isCurrentSession).length === 0}
                  className={`px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 ${
                    sessionsLoading || sessions.filter((s) => !s.isCurrentSession).length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Revoke All Other Sessions
                </button>
              </div>

              {sessionsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-md flex justify-between items-center ${
                        session.isCurrentSession ? "bg-pale-stone" : "bg-white border border-earth-beige"
                      }`}
                    >
                      <div>
                        <div className="flex items-center">
                          {session.deviceType === "mobile" ? (
                            <Smartphone className="h-4 w-4 text-drift-gray mr-2" />
                          ) : (
                            <Monitor className="h-4 w-4 text-drift-gray mr-2" />
                          )}
                          <p className="text-sm font-medium text-graphite">
                            {session.deviceName}
                            {session.isCurrentSession && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-drift-gray">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Last active: {formatSessionTime(session.lastActive)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-drift-gray">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Created: {formatSessionTime(session.createdAt)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-drift-gray">
                          <Globe className="h-3 w-3 mr-1" />
                          <span>IP: {session.ipAddress || "Unknown"}</span>
                        </div>
                      </div>
                      {!session.isCurrentSession && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="flex items-center text-red-500 hover:text-red-600 text-sm"
                          disabled={sessionsLoading}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}

                  {sessions.length === 0 && (
                    <div className="text-center py-4 text-drift-gray">No active sessions found</div>
                  )}
                </div>
              )}
            </div>

            {/* Suspicious Login Activity */}
            <div className="pt-4 border-t border-earth-beige">
              <h3 className="font-medium text-graphite mb-3">Suspicious Login Activity</h3>
              <SuspiciousLoginHistory userId={user?.uid} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saveLoading}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saveLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>

      <SaveConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Settings Saved"
        message="Your settings have been successfully updated."
      />
    </div>
  )
}
