export default function DoctorProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button */}
      <div className="h-6 w-24 bg-gray-200 rounded"></div>

      {/* Doctor Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-pale-stone p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-200"></div>
          </div>

          <div className="flex-grow">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>

            <div className="flex items-center mt-2">
              <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col space-y-3">
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-pale-stone">
        <nav className="flex space-x-8">
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-pale-stone p-6">
        <div className="space-y-6">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-7 w-32 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
                    <div>
                      <div className="h-5 w-48 bg-gray-200 rounded mb-1"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
