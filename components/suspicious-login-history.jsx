"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Shield, Info } from "lucide-react"
import { getSuspiciousLogins } from "@/lib/security-utils"

export function SuspiciousLoginHistory({ userId }) {
  const [suspiciousLogins, setSuspiciousLogins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSuspiciousLogins = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const logins = await getSuspiciousLogins(userId)
        setSuspiciousLogins(logins)
      } catch (error) {
        console.error("Error fetching suspicious logins:", error)
        setError("Unable to load suspicious login history")
      } finally {
        setLoading(false)
      }
    }

    fetchSuspiciousLogins()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 border-2 border-soft-amber border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-pale-stone rounded-md text-center">
        <Info className="h-5 w-5 text-soft-amber mx-auto mb-2" />
        <p className="text-sm text-drift-gray">{error}</p>
      </div>
    )
  }

  if (suspiciousLogins.length === 0) {
    return (
      <div className="p-4 bg-pale-stone rounded-md text-center">
        <Shield className="h-5 w-5 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-drift-gray">No suspicious login activity detected</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-drift-gray mb-2">Recent Suspicious Activity</p>
      {suspiciousLogins.map((login) => {
        // Determine risk level
        const riskLevel = login.threatScore >= 75 ? "High Risk" : login.threatScore >= 50 ? "Medium Risk" : "Low Risk"
        const riskColor =
          login.threatScore >= 75 ? "text-red-600" : login.threatScore >= 50 ? "text-amber-600" : "text-yellow-600"

        // Format date
        const date = login.timestamp?.toDate ? login.timestamp.toDate() : new Date()
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(date)

        return (
          <div key={login.id} className="p-3 border border-earth-beige rounded-md bg-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <AlertTriangle className={`h-4 w-4 ${riskColor} mt-0.5 mr-2 flex-shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-graphite">Suspicious Login</p>
                  <p className="text-xs text-drift-gray">{formattedDate}</p>
                  <p className={`text-xs font-medium ${riskColor} mt-1`}>{riskLevel}</p>
                  <p className="text-xs text-drift-gray mt-1">{login.deviceInfo?.deviceName || "Unknown device"}</p>
                  <p className="text-xs text-drift-gray">{login.ipAddress || "Unknown location"}</p>
                  {login.reasons && login.reasons.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-drift-gray">Reasons: {login.reasons.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
