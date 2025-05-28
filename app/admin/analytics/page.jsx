"use client"

import { useState, useEffect } from "react"
import { AdminHeaderBanner } from "@/components/admin-header-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getTopRatedDoctors,
  getMostActivePatients,
  getMostActiveDoctors,
  getFeedbackCategoryDistribution,
  getFeedbackTrends,
} from "@/lib/analytics-utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Award, Activity, Users, MessageSquare, TrendingUp, Star, Calendar, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Date range options
const DATE_RANGES = [
  { id: "today", label: "Today" },
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3_months", label: "Last 3 Months" },
  { id: "last_6_months", label: "Last 6 Months" },
  { id: "this_year", label: "This Year" },
  { id: "all_time", label: "All Time" },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("doctors")
  const [dateRange, setDateRange] = useState("last_6_months")
  const [topDoctors, setTopDoctors] = useState([])
  const [activePatients, setActivePatients] = useState([])
  const [activeDoctors, setActiveDoctors] = useState([])
  const [feedbackCategories, setFeedbackCategories] = useState([])
  const [feedbackTrends, setFeedbackTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // COLORS for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Fetch data based on active tab and date range
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`Fetching data for tab: ${activeTab}, date range: ${dateRange}`)

      // Fetch data based on active tab
      switch (activeTab) {
        case "doctors":
          const [doctors, doctorsActivity] = await Promise.all([
            getTopRatedDoctors(5, dateRange),
            getMostActiveDoctors(5, dateRange),
          ])
          setTopDoctors(doctors || [])
          setActiveDoctors(doctorsActivity || [])
          break
        case "patients":
          const patients = await getMostActivePatients(5, dateRange)
          setActivePatients(patients || [])
          break
        case "categories":
          const categories = await getFeedbackCategoryDistribution(dateRange)
          setFeedbackCategories(categories || [])
          break
        case "trends":
          const trends = await getFeedbackTrends(dateRange)
          setFeedbackTrends(trends || [])
          break
        default:
          // Fetch all data for initial load
          const [allDoctors, allPatients, allDoctorsActivity, allCategories, allTrends] = await Promise.all([
            getTopRatedDoctors(5, dateRange),
            getMostActivePatients(5, dateRange),
            getMostActiveDoctors(5, dateRange),
            getFeedbackCategoryDistribution(dateRange),
            getFeedbackTrends(dateRange),
          ])
          setTopDoctors(allDoctors || [])
          setActivePatients(allPatients || [])
          setActiveDoctors(allDoctorsActivity || [])
          setFeedbackCategories(allCategories || [])
          setFeedbackTrends(allTrends || [])
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      setError("Failed to load analytics data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [activeTab, dateRange])

  // Format data for the rating chart
  const doctorRatingData = topDoctors.map((doctor) => ({
    name: doctor.displayName || doctor.email || "Unknown",
    rating: doctor.averageRating || 0,
    count: doctor.feedbackCount || 0,
  }))

  // Format data for the activity charts
  const patientActivityData = activePatients.map((patient) => ({
    name: patient.displayName || patient.email || "Unknown",
    activities: patient.count || 0,
  }))

  const doctorActivityData = activeDoctors.map((doctor) => ({
    name: doctor.displayName || doctor.email || "Unknown",
    activities: doctor.count || 0,
    specialty: doctor.specialty || "General",
  }))

  // Helper function to safely format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"

    try {
      // Handle Firestore Timestamp objects
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleDateString()
      }

      // Handle Date objects or timestamps
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString()
      }

      // Handle string dates
      return new Date(timestamp).toLocaleDateString()
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Unknown"
    }
  }

  // Get human-readable date range label
  const getDateRangeLabel = () => {
    const range = DATE_RANGES.find((r) => r.id === dateRange)
    return range ? range.label : "Custom Range"
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeaderBanner
        title="Analytics Dashboard"
        subtitle="Comprehensive insights into system performance and user activity"
        stats={[
          {
            label: "Top Doctor",
            value: topDoctors.length > 0 ? topDoctors[0]?.displayName || "Loading..." : "No data",
            icon: <Award className="h-4 w-4 text-white/70" />,
          },
          {
            label: "Most Active Patient",
            value: activePatients.length > 0 ? activePatients[0]?.displayName || "Loading..." : "No data",
            icon: <Activity className="h-4 w-4 text-white/70" />,
          },
          {
            label: "Top Feedback Category",
            value: feedbackCategories.length > 0 ? feedbackCategories[0]?.name || "Loading..." : "No data",
            icon: <MessageSquare className="h-4 w-4 text-white/70" />,
          },
          {
            label: "Date Range",
            value: getDateRangeLabel(),
            icon: <Calendar className="h-4 w-4 text-white/70" />,
          },
        ]}
      />

      {/* Date Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Date Range Filter</CardTitle>
          <CardDescription>Select a time period to filter the analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            {/* Fixed: Wrapped TabsList in a Tabs component */}
            <Tabs value={dateRange} onValueChange={setDateRange} className="w-full">
              <TabsList className="inline-flex min-w-max">
                {DATE_RANGES.map((range) => (
                  <TabsTrigger
                    key={range.id}
                    value={range.id}
                    className={dateRange === range.id ? "bg-soft-amber text-white" : ""}
                  >
                    {range.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="doctors" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="doctors">Top Doctors</TabsTrigger>
          <TabsTrigger value="patients">Active Patients</TabsTrigger>
          <TabsTrigger value="categories">Feedback Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* TOP DOCTORS TAB */}
        <TabsContent value="doctors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Ratings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-soft-amber" />
                  Top Rated Doctors
                </CardTitle>
                <CardDescription>Doctors with the highest average ratings based on patient feedback</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : doctorRatingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={doctorRatingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rating" name="Average Rating" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Star className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No rating data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Doctors List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-soft-amber" />
                  Doctor Leaderboard
                </CardTitle>
                <CardDescription>Detailed view of our highest-rated healthcare providers</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : topDoctors.length > 0 ? (
                  <div className="space-y-4">
                    {topDoctors.map((doctor, index) => (
                      <div
                        key={doctor.id || index}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-pale-stone"
                      >
                        <div className="flex-shrink-0 relative">
                          <div className="absolute -left-1 -top-1 bg-soft-amber text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {doctor.photoURL ? (
                              <Image
                                src={doctor.photoURL || "/placeholder.svg"}
                                alt={doctor.displayName || "Doctor"}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 text-soft-amber" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-graphite truncate">
                            {doctor.displayName || doctor.email || "Unknown Doctor"}
                          </p>
                          <p className="text-xs text-drift-gray">{doctor.specialty || "General Practice"}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center bg-white px-2 py-1 rounded-md">
                            <Star className="h-4 w-4 text-soft-amber mr-1" />
                            <span className="text-sm font-medium">{doctor.averageRating || 0}</span>
                            <span className="text-xs text-drift-gray ml-1">({doctor.feedbackCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[300px] flex-col items-center justify-center text-center">
                    <Award className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No doctor rating data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Active Doctors */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-soft-amber" />
                  Most Active Doctors
                </CardTitle>
                <CardDescription>Doctors with the highest activity levels in the system</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : doctorActivityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={doctorActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activities" name="Activity Count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Activity className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No doctor activity data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ACTIVE PATIENTS TAB */}
        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-soft-amber" />
                  Most Active Patients
                </CardTitle>
                <CardDescription>Patients with the highest activity levels in the system</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : patientActivityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patientActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activities" name="Activity Count" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Activity className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No patient activity data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Patients List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-soft-amber" />
                  Patient Activity Leaderboard
                </CardTitle>
                <CardDescription>Detailed view of our most engaged patients</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : activePatients.length > 0 ? (
                  <div className="space-y-4">
                    {activePatients.map((patient, index) => (
                      <div
                        key={patient.userId || index}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-pale-stone"
                      >
                        <div className="flex-shrink-0 relative">
                          <div className="absolute -left-1 -top-1 bg-soft-amber text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {patient.photoURL ? (
                              <Image
                                src={patient.photoURL || "/placeholder.svg"}
                                alt={patient.displayName || "Patient"}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 text-soft-amber" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-graphite truncate">
                            {patient.displayName || patient.email || "Unknown Patient"}
                          </p>
                          <p className="text-xs text-drift-gray">Last active: {formatDate(patient.lastActivity)}</p>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center bg-white px-2 py-1 rounded-md">
                            <Activity className="h-4 w-4 text-soft-amber mr-1" />
                            <span className="text-sm font-medium">{patient.count || 0}</span>
                            <span className="text-xs text-drift-gray ml-1">activities</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[300px] flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No patient activity data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Activity Insights */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-soft-amber" />
                  Patient Activity Insights
                </CardTitle>
                <CardDescription>Analysis of patient engagement and activity patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : activePatients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-soft-amber" />
                        Average Activities
                      </h3>
                      <p className="text-2xl font-bold text-graphite">
                        {Math.round(activePatients.reduce((sum, p) => sum + (p.count || 0), 0) / activePatients.length)}
                      </p>
                      <p className="text-xs text-drift-gray mt-1">Per active patient</p>
                    </div>

                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1 text-soft-amber" />
                        Top Patient
                      </h3>
                      <p className="text-lg font-bold text-graphite truncate">
                        {activePatients[0]?.displayName || "Unknown"}
                      </p>
                      <p className="text-xs text-drift-gray mt-1">{activePatients[0]?.count || 0} activities</p>
                    </div>

                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-soft-amber" />
                        Most Recent Activity
                      </h3>
                      <p className="text-lg font-bold text-graphite">{formatDate(activePatients[0]?.lastActivity)}</p>
                      <p className="text-xs text-drift-gray mt-1">By {activePatients[0]?.displayName || "Unknown"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center">
                    <TrendingUp className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No patient insights available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FEEDBACK CATEGORIES TAB */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feedback Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-soft-amber" />
                  Feedback Categories
                </CardTitle>
                <CardDescription>Distribution of feedback across different categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : feedbackCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {feedbackCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No feedback category data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-soft-amber" />
                  Category Ratings
                </CardTitle>
                <CardDescription>Average ratings across different feedback categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : feedbackCategories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feedbackCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageRating" name="Average Rating" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Star className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No category rating data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category List */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-soft-amber" />
                  Feedback Category Details
                </CardTitle>
                <CardDescription>Detailed breakdown of feedback categories and their metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : feedbackCategories.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-earth-beige">
                          <th className="text-left py-3 px-4 text-sm font-medium text-graphite">Category</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-graphite">Count</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-graphite">Average Rating</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-graphite">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbackCategories.map((category, index) => {
                          const totalCount = feedbackCategories.reduce((sum, cat) => sum + cat.count, 0)
                          const percentage = ((category.count / totalCount) * 100).toFixed(1)

                          return (
                            <tr key={index} className="border-b border-earth-beige">
                              <td className="py-3 px-4 text-sm text-graphite">{category.name}</td>
                              <td className="py-3 px-4 text-sm text-center text-graphite">{category.count}</td>
                              <td className="py-3 px-4 text-sm text-center">
                                <div className="flex items-center justify-center">
                                  <Star className="h-4 w-4 text-soft-amber mr-1" />
                                  <span>{category.averageRating}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-center text-graphite">{percentage}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No feedback category details available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TRENDS TAB */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Feedback Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-soft-amber" />
                  Feedback Trends
                </CardTitle>
                <CardDescription>Trends in feedback volume and ratings over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : feedbackTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feedbackTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        name="Feedback Count"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="averageRating"
                        name="Average Rating"
                        stroke="#FF8042"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <TrendingUp className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No feedback trend data available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trend Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-soft-amber" />
                  Trend Insights
                </CardTitle>
                <CardDescription>Key insights from feedback trends analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-amber"></div>
                  </div>
                ) : feedbackTrends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Average Monthly Feedback */}
                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2">Average Feedback</h3>
                      <p className="text-2xl font-bold text-graphite">
                        {Math.round(
                          feedbackTrends.reduce((sum, period) => sum + (period.count || 0), 0) / feedbackTrends.length,
                        )}
                      </p>
                      <p className="text-xs text-drift-gray mt-1">Submissions per period</p>
                    </div>

                    {/* Average Rating Trend */}
                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2">Rating Trend</h3>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-graphite">
                          {feedbackTrends[feedbackTrends.length - 1]?.averageRating || 0}
                        </p>
                        {feedbackTrends.length > 1 &&
                        feedbackTrends[feedbackTrends.length - 1].averageRating > feedbackTrends[0].averageRating ? (
                          <span className="ml-2 text-green-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">
                              +
                              {(
                                feedbackTrends[feedbackTrends.length - 1].averageRating -
                                feedbackTrends[0].averageRating
                              ).toFixed(1)}
                            </span>
                          </span>
                        ) : feedbackTrends.length > 1 ? (
                          <span className="ml-2 text-red-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                            <span className="text-xs">
                              {(
                                feedbackTrends[feedbackTrends.length - 1].averageRating -
                                feedbackTrends[0].averageRating
                              ).toFixed(1)}
                            </span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-drift-gray mt-1">Current vs. first period</p>
                    </div>

                    {/* Peak Period */}
                    <div className="bg-pale-stone p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-graphite mb-2">Peak Feedback Period</h3>
                      <p className="text-2xl font-bold text-graphite">
                        {
                          feedbackTrends.reduce((max, period) => (period.count > max.count ? period : max), {
                            count: 0,
                          }).period
                        }
                      </p>
                      <p className="text-xs text-drift-gray mt-1">
                        {
                          feedbackTrends.reduce((max, period) => (period.count > max.count ? period : max), {
                            count: 0,
                          }).count
                        }{" "}
                        submissions
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[200px] flex-col items-center justify-center text-center">
                    <Activity className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No trend insights available for {getDateRangeLabel()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
