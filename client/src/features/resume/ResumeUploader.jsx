import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, X, RefreshCw, FileCheck } from 'lucide-react';

export const ResumeUploader = ({ onUploadComplete, initialFile, uploadedFile, setUploadedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const activeFileProp = uploadedFile !== undefined ? uploadedFile : initialFile;
  const [file, setFile] = useState(activeFileProp || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(activeFileProp ? 100 : 0);
  const [statusMessage, setStatusMessage] = useState(activeFileProp ? 'File ready for Job Matching' : '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeFileProp) {
      setFile(activeFileProp);
      setProgress(100);
      setStatusMessage('File successfully uploaded & ready for analysis!');
    } else if (activeFileProp === null) {
      setFile(null);
      setUploading(false);
      setProgress(0);
      setStatusMessage('');
      setError('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [activeFileProp]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    setError('');
    
    // Validate file type
    if (!selectedFile.type.includes('pdf') && !selectedFile.name.endsWith('.pdf')) {
      setError('Please upload a PDF file (.pdf format only).');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    console.log("STEP 1 - Upload selected:", selectedFile);
    setFile(selectedFile);
    simulateUpload(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const simulateUpload = (uploadedFile) => {
    setUploading(true);
    setProgress(0);
    setStatusMessage('Reading PDF file...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setUploading(false);
        setStatusMessage('File successfully uploaded & ready for analysis!');
        if (onUploadComplete) {
          onUploadComplete(uploadedFile);
        }
        return;
      }

      setProgress(currentProgress);
      if (currentProgress === 25) setStatusMessage('Extracting document text & layout...');
      if (currentProgress === 60) setStatusMessage('Parsing section headers & contact details...');
      if (currentProgress === 85) setStatusMessage('Preparing ATS structured payload...');
    }, 100);
  };

  const resetUpload = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setStatusMessage('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (setUploadedFile) setUploadedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="hidden"
        id="resume-upload-input"
        aria-label="Upload Resume PDF File"
      />

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-600/10'
              : 'border-[#30363D] hover:border-gray-500 bg-[#161B22]'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current && inputRef.current.click();
            }
          }}
          aria-label="Drop PDF resume here or click to browse"
        >
          <div className="w-14 h-14 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Upload Your Resume PDF
          </h3>

          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4 leading-relaxed">
            Drag and drop your single or multi-column PDF resume here, or click to browse from your device.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded transition-colors shadow-sm">
            <FileText className="w-4 h-4" />
            <span>Select PDF File</span>
          </div>

          <div className="mt-4 text-[11px] text-gray-400 font-mono">
            Supported format: .PDF (Max 10MB)
          </div>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-blue-500">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{file.name}</h4>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <button
              onClick={resetUpload}
              className="p-1.5 rounded hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Remove file and select another"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">{statusMessage}</span>
                <span className="text-blue-500 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
                <div 
                  className="bg-blue-600 h-full transition-all duration-150 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!uploading && progress === 100 && (
            <div className="flex items-center gap-2 text-xs text-green-500 font-semibold bg-green-600/10 p-2.5 rounded border border-green-500/30">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 rounded bg-red-600/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
