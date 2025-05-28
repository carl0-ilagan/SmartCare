"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PaginationControls({ currentPage, totalPages, onPageChange, isLoading = false }) {
  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>

      {isLoading && <div className="ml-2 text-sm text-gray-500">Loading...</div>}
    </div>
  )
}
