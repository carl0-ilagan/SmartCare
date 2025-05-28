export default function DoctorsSearchLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>

      {/* Search and Filter Section */}
      <div className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <div className="h-10 w-full bg-gray-200 rounded-full"></div>
          </div>

          <div className="relative w-full md:w-64">
            <div className="h-10 w-full bg-gray-200 rounded-full"></div>
          </div>

          <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="h-7 w-32 bg-gray-200 rounded"></div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-lg border border-pale-stone bg-white p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-3 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-gray-200"></div>
                <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                <div className="h-8 w-full rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-10 w-10 rounded bg-gray-200"></div>
            <div className="h-6 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-10 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
