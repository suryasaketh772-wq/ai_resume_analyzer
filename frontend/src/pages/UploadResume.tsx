import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { resumesAPI } from '../services/api';

export default function UploadResume({ onUploadSuccess }: { onUploadSuccess?: (data: any) => void }) {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await resumesAPI.getRoles();
        setRoles(response.data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!selectedRole) {
      setError('Please select a job role.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 1. Upload the resume
      const uploadResponse = await resumesAPI.upload(formData);
      const resumeId = uploadResponse.data.id;
      
      // 2. Analyze the resume against the selected role
      await resumesAPI.analyze(resumeId, parseInt(selectedRole));
      
      setSuccess('Resume uploaded and analyzed successfully!');
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess(uploadResponse.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload New Resume</h1>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Target Job Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                disabled={uploading}
              >
                <option value="">-- Select a Role --</option>
                {Object.entries(
                  roles.reduce((acc, role) => {
                    const cat = role.category || "Uncategorized";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(role);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([category, catRoles]) => (
                  <optgroup key={category} label={category}>
                    {catRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.role_name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {file ? file.name : 'Click or drag file to this area to upload'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Only PDF files are supported</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-6 text-green-800 bg-green-50 rounded-md border border-green-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  <span className="font-semibold text-lg">{success}</span>
                </div>
                <ul className="space-y-2 ml-8 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✅</span> File uploaded
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span> File saved securely
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span> Database updated
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✅</span> skills detected correctly
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={!file || uploading}
                className={`px-6 py-2 rounded-md font-medium text-white transition-colors flex items-center ${
                  !file || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Upload PDF
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
