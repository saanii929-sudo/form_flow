'use client';

interface PageThumbnailsProps {
  numPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PageThumbnails({ numPages, currentPage, onPageChange }: PageThumbnailsProps) {
  if (numPages <= 1) return null;

  return (
    <div className="bg-white border-r border-gray-200 w-48 overflow-y-auto">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Pages ({numPages})
        </h3>
        <div className="space-y-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                currentPage === page
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  currentPage === page ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Page {page}
                </span>
                {currentPage === page && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="mt-2 bg-gray-100 rounded aspect-[8.5/11] flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
