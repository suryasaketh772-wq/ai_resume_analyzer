import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb, Download } from 'lucide-react';

export default function ResumeResults({ resultData: propResultData }: { resultData?: any }) {
  // Remove dummy data fallback and use real passed data
  const score = propResultData?.score ?? 0;
  const found_skills = propResultData?.found_skills || [];
  const missing_skills = propResultData?.missing_skills || [];
  const suggestions = propResultData?.suggestions || [];
  const { candidate_name, candidate_email, candidate_phone } = propResultData || {};

  // Determine score color
  let scoreColor = 'text-green-600';
  let scoreBg = 'bg-green-100';
  let scoreBorder = 'border-green-600';
  if (score < 50) {
    scoreColor = 'text-red-600';
    scoreBg = 'bg-red-100';
    scoreBorder = 'border-red-600';
  } else if (score < 80) {
    scoreColor = 'text-yellow-600';
    scoreBg = 'bg-yellow-100';
    scoreBorder = 'border-yellow-600';
  }

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div id="resume-results-dashboard" className="w-full p-8 max-w-5xl mx-auto space-y-8 pb-20 bg-gray-50">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analysis Results</h1>
        <button 
          onClick={handleExportPDF}
          className="print-hidden flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
      
      <div className="flex flex-col mb-4">
        
        {/* Contact Info Card */}
        {(candidate_name || candidate_email || candidate_phone) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-wrap gap-6 items-center">
            {candidate_name && (
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Candidate Name</span>
                <span className="text-lg font-semibold text-gray-900">{candidate_name}</span>
              </div>
            )}
            {candidate_email && (
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</span>
                <span className="text-lg font-semibold text-gray-900">{candidate_email}</span>
              </div>
            )}
            {candidate_phone && (
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</span>
                <span className="text-lg font-semibold text-gray-900">{candidate_phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Section: Score */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">Overall Match Score</h2>
          <div className={`w-48 h-48 rounded-full flex items-center justify-center border-8 ${scoreBorder} ${scoreBg} shadow-inner`}>
            <span className={`text-6xl font-black ${scoreColor}`}>{Math.round(score)}%</span>
          </div>
          <p className="mt-8 text-gray-600 text-center max-w-2xl text-lg">
            {score >= 80 ? "Excellent match! Your resume highlights the core skills required for this role." :
             score >= 50 ? "Good foundation, but there are a few key areas you should focus on improving." :
             "Your resume is missing several critical requirements. Consider tailoring it closer to the job description."}
          </p>
        </div>

        {/* Bottom Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Skills */}
          <div className="space-y-8">
            {/* Found Skills */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                <CheckCircle2 className="w-7 h-7 text-green-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Detected Skills</h3>
              </div>
              {found_skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {found_skills.map((skill: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm hover:bg-green-100 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No required skills were detected.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                <XCircle className="w-7 h-7 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Missing Skills</h3>
              </div>
              {missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {missing_skills.map((skill: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-700 border border-red-200 shadow-sm hover:bg-red-100 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Great job! No missing skills detected.</p>
              )}
            </div>
          </div>

          {/* Right Column: Suggestions */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
              <Lightbulb className="w-7 h-7 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Actionable Feedback</h3>
            </div>
            
            {suggestions.length > 0 ? (
              <ul className="space-y-6">
                {suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="flex items-start bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-sm mt-0.5">
                      <span className="text-sm font-bold">{idx + 1}</span>
                    </div>
                    <p className="ml-4 text-gray-800 leading-relaxed font-medium">{suggestion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mb-6" />
                <p className="text-gray-500 text-lg">Your resume looks perfect. No suggestions at this time!</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
