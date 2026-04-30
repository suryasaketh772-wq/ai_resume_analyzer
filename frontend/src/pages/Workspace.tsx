import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { LogOut, Upload, FileText, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { resumesAPI } from '../services/api';
import { Badge } from '../components/ui/Badge';
import UploadResume from './UploadResume';
import ResumeResults from './ResumeResults';

export default function Workspace() {
  const { logout } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumesAPI.getAll();
      setResumes(response.data);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const getScoreVariant = (score: number | null) => {
    if (score === null || score === undefined) return 'neutral';
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleUploadSuccess = (newResume: any) => {
    fetchResumes();
    setSelectedResumeId(newResume.id);
    setIsUploading(false);
  };

  const handleDelete = async (e: React.MouseEvent, resumeId: number) => {
    e.stopPropagation(); // Prevent card selection
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      await resumesAPI.delete(resumeId);
      if (selectedResumeId === resumeId) {
        setSelectedResumeId(null);
      }
      fetchResumes();
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const selectedResumeData = resumes.find(r => r.id === selectedResumeId);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* LEFT PANEL: Sidebar Master List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">AI Resume</h1>
            <p className="text-sm text-gray-500 font-medium">Workspace</p>
          </div>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-shrink-0">
          <button
            onClick={() => {
              setIsUploading(true);
              setSelectedResumeId(null);
            }}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all duration-200 ${isUploading ? 'bg-blue-700 ring-2 ring-offset-2 ring-blue-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New Resume
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Resumes</h3>
            <button onClick={fetchResumes} className="text-gray-400 hover:text-blue-500">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading && resumes.length === 0 ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : resumes.length > 0 ? (
            resumes.map((resume) => (
              <div 
                key={resume.id}
                onClick={() => {
                  setSelectedResumeId(resume.id);
                  setIsUploading(false);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedResumeId === resume.id && !isUploading ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${selectedResumeId === resume.id && !isUploading ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <FileText className={`w-4 h-4 ${selectedResumeId === resume.id && !isUploading ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {resume.file_path ? resume.file_path.split('/').pop() : 'Resume'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, resume.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 flex-shrink-0 ml-2"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Badge variant={getScoreVariant(resume.score)} className="text-[10px] px-2 py-0.5">
                    {resume.score !== null ? `${Math.round(resume.score)}% Match` : 'Unscored'}
                  </Badge>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(resume.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-4">
              <p className="text-sm text-gray-500">No resumes uploaded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Detail View */}
      <div className="flex-1 bg-white overflow-y-auto relative flex flex-col">
        {isUploading ? (
          <div className="p-8 max-w-4xl mx-auto w-full animate-fade-in-up">
            <UploadResume onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : selectedResumeId && selectedResumeData ? (
          <div className="animate-fade-in-up w-full h-full">
            <ResumeResults 
              resultData={{
                score: selectedResumeData.score || 0,
                found_skills: selectedResumeData.detected_skills || [],
                missing_skills: [], // TODO: We need the backend to return missing skills and suggestions in the main resume object or fetch it
                suggestions: [] // For now this will rely on dummy fallback in ResumeResults component if empty
              }} 
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <FileText className="w-16 h-16 text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Resume</h2>
            <p className="text-gray-500 max-w-sm">
              Click on a resume from the sidebar to view its detailed AI analysis, or upload a new one to get started.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
