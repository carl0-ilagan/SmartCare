"use client"

import { useState, useEffect } from "react"
import {
  Download,
  FileText,
  Filter,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  PieChart,
  BarChart,
  LineChart,
} from "lucide-react"
import { AdminHeaderBanner } from "@/components/admin-header-banner"
import {
  getReportTypes,
  getRecentReports,
  generateReport,
  getReportFormats,
  getDateRangeOptions,
} from "@/lib/report-utils"

export default function ReportsPage() {
  const [reportTypes, setReportTypes] = useState([])
  const [activeTab, setActiveTab] = useState("")
  const [dateRange, setDateRange] = useState("last30")
  const [format, setFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentReports, setRecentReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reportFormats, setReportFormats] = useState([])
  const [dateRangeOptions, setDateRangeOptions] = useState([])
  const [generationSuccess, setGenerationSuccess] = useState(false)
  const [selectedSubType, setSelectedSubType] = useState("")
  const [reportPreview, setReportPreview] = useState(null)

  // Load report types and formats
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true)

        // Get report types from Firestore
        const types = await getReportTypes()
        setReportTypes(types)

        // Set active tab to first report type
        if (types.length > 0 && !activeTab) {
          setActiveTab(types[0].id)
          // Set default subtype
          if (types[0].availableReports && types[0].availableReports.length > 0) {
            setSelectedSubType(types[0].availableReports[0].id)
          }
        }

        // Get report formats and date range options
        setReportFormats(getReportFormats())
        setDateRangeOptions(getDateRangeOptions())

        setError(null)
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Failed to load report configuration. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [activeTab])

  // Load reports when tab changes
  useEffect(() => {
    async function loadReports() {
      if (!activeTab) return

      try {
        setIsLoading(true)
        const reports = await getRecentReports(activeTab, 5)
        setRecentReports(reports)
        setError(null)

        // Reset subtype when tab changes
        const currentType = reportTypes.find((t) => t.id === activeTab)
        if (currentType?.availableReports && currentType.availableReports.length > 0) {
          setSelectedSubType(currentType.availableReports[0].id)
        } else {
          setSelectedSubType("")
        }
      } catch (err) {
        console.error("Error loading reports:", err)
        setError("Failed to load reports. Please try again.")
        setRecentReports([])
      } finally {
        setIsLoading(false)
      }
    }

    if (reportTypes.length > 0) {
      loadReports()
    }
  }, [activeTab, reportTypes])

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      setGenerationSuccess(false)
      setReportPreview(null)

      // Get the report type label
      const reportType = reportTypes.find((t) => t.id === activeTab)
      const subTypeLabel = reportType?.availableReports?.find((r) => r.id === selectedSubType)?.name || "General"

      // Create report data
      const reportData = {
        name: `${subTypeLabel} - ${dateRange === "custom" ? "Custom" : dateRange} Report`,
        type: activeTab,
        subType: selectedSubType,
        format: format,
        dateRange: dateRange,
        parameters: {
          dateRange: dateRange,
          format: format,
          subType: selectedSubType,
        },
      }

      // Generate the report
      const newReport = await generateReport(reportData)

      // Add to recent reports
      setRecentReports((prev) => [newReport, ...prev.slice(0, 4)])
      setGenerationSuccess(true)

      // Set report preview
      setReportPreview(newReport.content)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setGenerationSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error generating report:", err)
      setError("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Get the current active report type
  const activeReportType = reportTypes.find((t) => t.id === activeTab)

  // Get available subtypes for the current report type
  const availableSubTypes = activeReportType?.availableReports || []

  // Render report preview based on type
  const renderReportPreview = () => {
    if (!reportPreview) return null

    if (activeTab === "patient") {
      if (selectedSubType === "demographics") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Total Patients</h3>
                <p className="text-2xl font-bold">{reportPreview.totalPatients}</p>
              </div>
              <div className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Demographics Summary</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Age Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(reportPreview.ageDistribution).map(([age, count]) => (
                    <div key={age} className="flex justify-between">
                      <span>{age}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-soft-amber h-2.5 rounded-full"
                            style={{ width: `${(count / reportPreview.totalPatients) * 100}%` }}
                          ></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Gender Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(reportPreview.genderDistribution).map(([gender, count]) => (
                    <div key={gender} className="flex justify-between">
                      <span>{gender}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-soft-amber h-2.5 rounded-full"
                            style={{ width: `${(count / reportPreview.totalPatients) * 100}%` }}
                          ></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }

      if (selectedSubType === "registration") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Total Registrations</h3>
                <p className="text-2xl font-bold">{reportPreview.totalRegistrations}</p>
              </div>
              <div className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Registration Trends</span>
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Weekly Trend</h4>
              <div className="flex items-end h-32 space-x-2">
                {reportPreview.weeklyTrend.map((count, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-soft-amber rounded-t"
                      style={{ height: `${(count / Math.max(...reportPreview.weeklyTrend)) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1">Day {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Conversion Rate</h4>
                <p className="text-2xl font-bold text-soft-amber">{reportPreview.conversionRate}</p>
              </div>

              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Channel Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(reportPreview.channelDistribution).map(([channel, count]) => (
                    <div key={channel} className="flex justify-between">
                      <span>{channel}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }
    }

    if (activeTab === "doctor") {
      if (selectedSubType === "performance") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Total Doctors</h3>
                <p className="text-2xl font-bold">{reportPreview.totalDoctors}</p>
              </div>
              <div className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Performance Metrics</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded p-3 text-center">
                <h4 className="font-medium">Average Rating</h4>
                <p className="text-2xl font-bold text-soft-amber">{reportPreview.averageRating}</p>
                <p className="text-xs text-drift-gray">out of 5.0</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium">Patient Satisfaction</h4>
                <p className="text-2xl font-bold text-soft-amber">{reportPreview.patientSatisfaction}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium">Appointment Completion</h4>
                <p className="text-2xl font-bold text-soft-amber">{reportPreview.appointmentCompletion}</p>
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Top Performers</h4>
              <div className="space-y-2">
                {reportPreview.topPerformers.map((doctor, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-drift-gray">{doctor.patients} patients</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-soft-amber font-bold">{doctor.rating}</span>
                      <span className="text-xs text-drift-gray ml-1">/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }

      if (selectedSubType === "availability") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Total Hours</h3>
                <p className="text-2xl font-bold">{reportPreview.totalHours}</p>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Availability Analysis</span>
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Utilization</h4>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-soft-amber h-4 rounded-full text-xs text-white flex items-center justify-center"
                  style={{ width: reportPreview.utilization }}
                >
                  {reportPreview.utilization}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Peak Hours</h4>
                <ul className="list-disc list-inside">
                  {reportPreview.peakHours.map((hour, index) => (
                    <li key={index} className="text-drift-gray">
                      {hour}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Availability by Day</h4>
                <div className="space-y-2">
                  {Object.entries(reportPreview.availabilityByDay).map(([day, availability]) => (
                    <div key={day} className="flex justify-between">
                      <span>{day}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-soft-amber h-2 rounded-full" style={{ width: availability }}></div>
                        </div>
                        <span>{availability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }
    }

    if (activeTab === "system") {
      if (selectedSubType === "performance") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">System Performance</h3>
                <p className="text-xs text-drift-gray">Last updated: {new Date().toLocaleString()}</p>
              </div>
              <div className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Performance Metrics</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded p-3 text-center">
                <h4 className="font-medium text-sm">CPU Usage</h4>
                <p className="text-xl font-bold text-soft-amber">{reportPreview.averageCPU}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium text-sm">Memory Usage</h4>
                <p className="text-xl font-bold text-soft-amber">{reportPreview.averageMemory}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium text-sm">Disk Usage</h4>
                <p className="text-xl font-bold text-soft-amber">{reportPreview.diskUsage}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium text-sm">Response Time</h4>
                <p className="text-xl font-bold text-soft-amber">{reportPreview.responseTime}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium text-sm">Uptime</h4>
                <p className="text-xl font-bold text-soft-amber">{reportPreview.uptime}</p>
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Peak Usage Times</h4>
              <ul className="list-disc list-inside">
                {reportPreview.peakUsageTimes.map((time, index) => (
                  <li key={index} className="text-drift-gray">
                    {time}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }

      if (selectedSubType === "errors") {
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">Error Analysis</h3>
                <p className="text-xs text-drift-gray">Last updated: {new Date().toLocaleString()}</p>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-soft-amber" />
                <span>Error Log Summary</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-3 text-center">
                <h4 className="font-medium">Total Errors</h4>
                <p className="text-2xl font-bold text-soft-amber">{reportPreview.totalErrors}</p>
              </div>

              <div className="border rounded p-3 text-center">
                <h4 className="font-medium">Critical Errors</h4>
                <p className="text-2xl font-bold text-red-500">{reportPreview.criticalErrors}</p>
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Errors by Type</h4>
              <div className="space-y-2">
                {Object.entries(reportPreview.errorsByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-soft-amber h-2.5 rounded-full"
                          style={{ width: `${(count / reportPreview.totalErrors) * 100}%` }}
                        ></div>
                      </div>
                      <span>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium mb-2">Most Frequent Error</h4>
              <p className="text-drift-gray">{reportPreview.mostFrequentError}</p>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-medium">Summary</h4>
              <p className="text-drift-gray">{reportPreview.summary}</p>
            </div>
          </div>
        )
      }
    }

    // Default preview
    return (
      <div className="text-center">
        <p className="text-drift-gray">Report preview generated successfully.</p>
        <p className="text-drift-gray mt-2">Click the download button to save this report.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminHeaderBanner
        title="Reports & Exports"
        subtitle="Generate and analyze system reports"
        stats={[
          { label: "Total Reports", value: "124", icon: <FileText className="h-4 w-4" /> },
          { label: "This Month", value: "28", icon: <Calendar className="h-4 w-4" /> },
        ]}
      />

      {/* Report Type Tabs */}
      <div className="mb-6 border-b border-earth-beige">
        <div className="flex space-x-4 overflow-x-auto pb-1">
          {reportTypes.map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-soft-amber text-soft-amber"
                  : "text-drift-gray hover:text-graphite"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-graphite mb-2">Report Options</h2>
            <p className="text-sm text-drift-gray">
              {activeReportType?.description || "Configure your report parameters"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Report Subtype */}
            {availableSubTypes.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-graphite mb-1">Report Type</label>
                <div className="relative">
                  <select
                    value={selectedSubType}
                    onChange={(e) => setSelectedSubType(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-3 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                  >
                    {availableSubTypes.map((subType) => (
                      <option key={subType.id} value={subType.id}>
                        {subType.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-drift-gray" />
                  </div>
                </div>
              </div>
            )}

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-graphite mb-1">Date Range</label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-3 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-drift-gray" />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-graphite mb-1">Format</label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-3 py-2 border border-earth-beige rounded-md focus:outline-none focus:ring-2 focus:ring-soft-amber focus:border-soft-amber"
                >
                  {reportFormats.map((format) => (
                    <option key={format.id} value={format.id}>
                      {format.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-drift-gray" />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-graphite mb-1">Additional Filters</label>
              <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-earth-beige rounded-md hover:bg-pale-stone focus:outline-none focus:ring-2 focus:ring-soft-amber">
                <Filter className="h-5 w-5 mr-2 text-drift-gray" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-graphite">Report Preview</h2>
          <div className="flex items-center gap-2">
            {generationSuccess && (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-md">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Report generated</span>
              </div>
            )}
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || !activeTab || !selectedSubType}
              className="flex items-center px-4 py-2 bg-soft-amber text-white rounded-md hover:bg-soft-amber/90 focus:outline-none focus:ring-2 focus:ring-soft-amber focus:ring-offset-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="border border-earth-beige rounded-lg p-6 min-h-[400px] overflow-y-auto">
          {isLoading && !isGenerating ? (
            <div className="animate-pulse">
              <div className="h-12 w-12 rounded-full bg-earth-beige mb-4 mx-auto"></div>
              <div className="h-4 bg-earth-beige rounded w-48 mb-2 mx-auto"></div>
              <div className="h-3 bg-earth-beige rounded w-32 mx-auto"></div>
            </div>
          ) : isGenerating ? (
            <div className="animate-pulse flex flex-col items-center justify-center h-full">
              <RefreshCw className="h-12 w-12 text-soft-amber animate-spin mb-4" />
              <p className="text-lg font-medium text-graphite">Generating your report...</p>
              <p className="text-drift-gray mt-2">This may take a few moments</p>
            </div>
          ) : error ? (
            <div className="text-center flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
              <p className="text-lg font-medium text-graphite mb-2">Something went wrong</p>
              <p className="text-drift-gray max-w-md">{error}</p>
            </div>
          ) : reportPreview ? (
            renderReportPreview()
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="h-16 w-16 text-drift-gray mb-4" />
              <h3 className="text-xl font-medium text-graphite mb-2">
                {activeReportType?.label || "Select a report type"}
              </h3>
              <p className="text-drift-gray max-w-md">
                {activeReportType
                  ? `Click the "Generate Report" button to create a detailed ${activeReportType.label.toLowerCase()} based on your selected parameters.`
                  : "Please select a report type from the tabs above."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-graphite mb-4">Recent Reports</h2>
        {isLoading && !recentReports.length ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-earth-beige rounded w-1/3"></div>
                <div className="h-4 bg-earth-beige rounded w-1/6"></div>
                <div className="h-4 bg-earth-beige rounded w-1/6"></div>
                <div className="h-4 bg-earth-beige rounded w-1/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-earth-beige">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-drift-gray uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-drift-gray uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-drift-gray uppercase tracking-wider">
                    Date Generated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-drift-gray uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-drift-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-beige">
                {recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <tr key={report.id || index} className="hover:bg-pale-stone/30">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-graphite">{report.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-drift-gray">
                        {reportTypes.find((t) => t.id === report.type)?.label.replace(" Reports", "") || report.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-drift-gray">{report.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-drift-gray">
                        {report.format.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-drift-gray">
                        <a
                          href={report.url || "#"}
                          className="text-soft-amber hover:text-soft-amber/80 mr-3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-drift-gray">
                      {error
                        ? "Failed to load reports. Please try again."
                        : "No recent reports found for this category"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
