import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit as firestoreLimit,
} from "firebase/firestore"
import { db } from "./firebase"
import { getSystemMetrics } from "./system-metrics"

// Get all report types from Firestore
export async function getReportTypes() {
  try {
    const reportTypesRef = collection(db, "report_types")
    const snapshot = await getDocs(reportTypesRef)

    const reportTypes = []
    snapshot.forEach((doc) => {
      reportTypes.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    // If no report types in Firestore, return defaults
    if (reportTypes.length === 0) {
      return [
        {
          id: "patient",
          label: "Patient Reports",
          icon: "user",
          description: "Patient statistics, demographics, and activity analysis",
          availableReports: [
            { id: "demographics", name: "Patient Demographics" },
            { id: "registration", name: "Registration Statistics" },
            { id: "activity", name: "Patient Activity" },
            { id: "satisfaction", name: "Satisfaction Survey" },
          ],
        },
        {
          id: "doctor",
          label: "Doctor Reports",
          icon: "stethoscope",
          description: "Doctor performance, availability, and patient load analysis",
          availableReports: [
            { id: "performance", name: "Performance Analysis" },
            { id: "availability", name: "Availability Report" },
            { id: "specialization", name: "Specialization Distribution" },
            { id: "patientLoad", name: "Patient Load Analysis" },
          ],
        },
        {
          id: "appointment",
          label: "Appointment Reports",
          icon: "calendar",
          description: "Appointment analytics, completion rates, and scheduling trends",
          availableReports: [
            { id: "completion", name: "Completion Rate" },
            { id: "distribution", name: "Type Distribution" },
            { id: "noshow", name: "No-show Analysis" },
            { id: "scheduling", name: "Scheduling Patterns" },
          ],
        },
        {
          id: "system",
          label: "System Reports",
          icon: "server",
          description: "System performance, usage metrics, and error analysis",
          availableReports: [
            { id: "performance", name: "Performance Metrics" },
            { id: "usage", name: "Usage Statistics" },
            { id: "errors", name: "Error Log Analysis" },
            { id: "uptime", name: "Uptime Report" },
          ],
        },
      ]
    }

    return reportTypes
  } catch (error) {
    console.error("Error fetching report types:", error)
    // Return default report types if Firestore fetch fails
    return [
      {
        id: "patient",
        label: "Patient Reports",
        icon: "user",
        description: "Patient statistics, demographics, and activity analysis",
        availableReports: [
          { id: "demographics", name: "Patient Demographics" },
          { id: "registration", name: "Registration Statistics" },
          { id: "activity", name: "Patient Activity" },
          { id: "satisfaction", name: "Satisfaction Survey" },
        ],
      },
      {
        id: "doctor",
        label: "Doctor Reports",
        icon: "stethoscope",
        description: "Doctor performance, availability, and patient load analysis",
        availableReports: [
          { id: "performance", name: "Performance Analysis" },
          { id: "availability", name: "Availability Report" },
          { id: "specialization", name: "Specialization Distribution" },
          { id: "patientLoad", name: "Patient Load Analysis" },
        ],
      },
      {
        id: "appointment",
        label: "Appointment Reports",
        icon: "calendar",
        description: "Appointment analytics, completion rates, and scheduling trends",
        availableReports: [
          { id: "completion", name: "Completion Rate" },
          { id: "distribution", name: "Type Distribution" },
          { id: "noshow", name: "No-show Analysis" },
          { id: "scheduling", name: "Scheduling Patterns" },
        ],
      },
      {
        id: "system",
        label: "System Reports",
        icon: "server",
        description: "System performance, usage metrics, and error analysis",
        availableReports: [
          { id: "performance", name: "Performance Metrics" },
          { id: "usage", name: "Usage Statistics" },
          { id: "errors", name: "Error Log Analysis" },
          { id: "uptime", name: "Uptime Report" },
        ],
      },
    ]
  }
}

// Get recent reports from Firestore
export async function getRecentReports(reportType = null, limitCount = 10) {
  try {
    const reportsRef = collection(db, "reports")
    let q

    if (reportType) {
      q = query(reportsRef, where("type", "==", reportType), orderBy("createdAt", "desc"), firestoreLimit(limitCount))
    } else {
      q = query(reportsRef, orderBy("createdAt", "desc"), firestoreLimit(limitCount))
    }

    const snapshot = await getDocs(q)

    const reports = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      reports.push({
        id: doc.id,
        name: data.name,
        type: data.type,
        format: data.format,
        date:
          data.createdAt?.toDate().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) || "Unknown date",
        url: data.url || "#",
        ...data,
      })
    })

    return reports
  } catch (error) {
    console.error("Error fetching reports:", error)
    return []
  }
}

// Generate a new report and save to Firestore
export async function generateReport(reportData) {
  try {
    const reportsRef = collection(db, "reports")

    // Generate mock report data based on type
    const reportContent = await generateMockReportData(reportData)

    // Add timestamp and content
    const reportWithTimestamp = {
      ...reportData,
      createdAt: serverTimestamp(),
      status: "completed",
      content: reportContent,
      url: "#", // In a real app, this would be a URL to the generated report file
    }

    const docRef = await addDoc(reportsRef, reportWithTimestamp)

    return {
      id: docRef.id,
      ...reportWithTimestamp,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }
  } catch (error) {
    console.error("Error generating report:", error)
    throw error
  }
}

// Generate mock report data based on report type
async function generateMockReportData(reportData) {
  const { type, subType, dateRange } = reportData

  // For system reports, use actual system metrics
  if (type === "system" && subType === "performance") {
    try {
      const metrics = await getSystemMetrics()
      return {
        metrics,
        summary: "System is performing within expected parameters.",
        recommendations: [
          "Consider upgrading server capacity during peak hours",
          "Optimize database queries for better performance",
        ],
      }
    } catch (error) {
      console.error("Error fetching system metrics:", error)
    }
  }

  // Mock data for different report types
  const mockData = {
    patient: {
      demographics: {
        totalPatients: 1247,
        ageDistribution: {
          "0-18": 187,
          "19-35": 412,
          "36-50": 328,
          "51-65": 198,
          "65+": 122,
        },
        genderDistribution: {
          Male: 602,
          Female: 635,
          Other: 10,
        },
        locationMap: {
          Downtown: 342,
          Suburbs: 528,
          Rural: 377,
        },
        summary: "Patient demographics show a balanced distribution across age groups and genders.",
      },
      registration: {
        totalRegistrations: 156,
        weeklyTrend: [23, 18, 27, 31, 19, 22, 16],
        conversionRate: "68%",
        channelDistribution: {
          Website: 87,
          Mobile: 52,
          Referral: 17,
        },
        summary: "Registration rates have increased by 12% compared to the previous period.",
      },
    },
    doctor: {
      performance: {
        totalDoctors: 42,
        averageRating: 4.7,
        patientSatisfaction: "92%",
        appointmentCompletion: "96%",
        topPerformers: [
          { name: "Dr. Sarah Johnson", rating: 4.9, patients: 187 },
          { name: "Dr. Michael Chen", rating: 4.8, patients: 163 },
          { name: "Dr. Emily Rodriguez", rating: 4.8, patients: 159 },
        ],
        summary: "Doctor performance metrics show high satisfaction rates across all specialties.",
      },
      availability: {
        totalHours: 1680,
        utilization: "78%",
        peakHours: ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"],
        availabilityByDay: {
          Monday: "82%",
          Tuesday: "79%",
          Wednesday: "81%",
          Thursday: "76%",
          Friday: "74%",
          Saturday: "68%",
          Sunday: "42%",
        },
        summary: "Doctor availability is highest during weekday mornings and early afternoons.",
      },
    },
    system: {
      performance: {
        averageCPU: "24%",
        averageMemory: "62%",
        diskUsage: "47%",
        responseTime: "238ms",
        uptime: "99.97%",
        peakUsageTimes: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
        summary: "System performance is stable with no significant issues detected.",
      },
      errors: {
        totalErrors: 37,
        criticalErrors: 3,
        errorsByType: {
          "Database Connection": 12,
          Authentication: 8,
          "File Upload": 7,
          "API Timeout": 6,
          Other: 4,
        },
        mostFrequentError: "Database connection timeout",
        summary: "Error rates have decreased by 23% compared to the previous period.",
      },
    },
  }

  // Return mock data based on report type and subtype
  if (type === "patient" && mockData.patient[subType]) {
    return mockData.patient[subType]
  } else if (type === "doctor" && mockData.doctor[subType]) {
    return mockData.doctor[subType]
  } else if (type === "system" && mockData.system[subType]) {
    return mockData.system[subType]
  }

  // Default mock data
  return {
    summary: `This is a mock ${type} report for ${subType || "general analysis"}.`,
    generatedAt: new Date().toISOString(),
    dataPoints: 128,
  }
}

// Get report formats
export function getReportFormats() {
  return [
    { id: "pdf", label: "PDF Document", icon: "file-text" },
    { id: "excel", label: "Excel Spreadsheet", icon: "file-spreadsheet" },
    { id: "csv", label: "CSV File", icon: "file" },
    { id: "json", label: "JSON Data", icon: "code" },
  ]
}

// Get date range options
export function getDateRangeOptions() {
  return [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "last7", label: "Last 7 Days" },
    { id: "last30", label: "Last 30 Days" },
    { id: "thisMonth", label: "This Month" },
    { id: "lastMonth", label: "Last Month" },
    { id: "custom", label: "Custom Range" },
  ]
}
