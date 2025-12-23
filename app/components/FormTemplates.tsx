'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  pdfUrl: string;
}

interface FormTemplatesProps {
  onSelectTemplate: (pdfUrl: string) => void;
}

export default function FormTemplates({ onSelectTemplate }: FormTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Job Application Form',
      description: 'Standard employment application',
      category: 'employment',
      thumbnail: '📄',
      pdfUrl: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf',
    },
    {
      id: '2',
      name: 'Tax Form W-4',
      description: 'Employee withholding certificate',
      category: 'tax',
      thumbnail: '💰',
      pdfUrl: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf',
    },
    {
      id: '3',
      name: 'Rental Agreement',
      description: 'Residential lease agreement',
      category: 'legal',
      thumbnail: '🏠',
      pdfUrl: 'https://www.irs.gov/pub/irs-pdf/fw9.pdf',
    },
    {
      id: '4',
      name: 'Medical Consent Form',
      description: 'Healthcare authorization',
      category: 'medical',
      thumbnail: '🏥',
      pdfUrl: 'https://www.irs.gov/pub/irs-pdf/fw4.pdf',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'employment', name: 'Employment' },
    { id: 'tax', name: 'Tax Forms' },
    { id: 'legal', name: 'Legal' },
    { id: 'medical', name: 'Medical' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    // Use proxy to avoid CORS issues
    const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(template.pdfUrl)}`;
    onSelectTemplate(proxyUrl);
    setIsOpen(false);
    toast.success(`Loading ${template.name}...`);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Templates
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose a template to get started quickly</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all group"
                  >
                    <div className="text-4xl mb-3">{template.thumbnail}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="mt-3 flex items-center text-purple-600 text-sm font-medium">
                      Use Template
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No templates found in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
