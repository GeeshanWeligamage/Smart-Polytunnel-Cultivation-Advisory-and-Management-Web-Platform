import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Stethoscope, Image as ImageIcon, X, CheckCircle2, AlertTriangle, Loader2, Info } from 'lucide-react';

const AgroDoctor = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // --- 1. Image Selection Handler ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  // --- 2. Trigger File Input Click ---
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // --- 3. Clear Selection ---
  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- 4. REAL AI ANALYSIS - sends image to Flask ML backend ---
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(
        'http://localhost:5001/api/disease/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );

      if (response.data.status === 'success') {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Analysis timed out. Please try again.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Server returned an error.');
      } else {
        setError('Could not connect to AI server. Make sure the ML backend is running on port 5001.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div data-aos="fade-up" className="space-y-8 pb-10">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Agro-Doctor AI Diagnosis</h2>
          <p className="text-slate-500 text-sm">Upload a clear photo of the affected plant leaf for instant analysis.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
           <Stethoscope size={16} /> AI-Powered v1.0
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        className="hidden" 
      />

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* --- LEFT SIDE: Upload / Image Preview Area --- */}
        <div data-aos="fade-right" data-aos-delay="100" className="space-y-6">
          
          {!imagePreview ? (
            // 1. Upload Placeholder
            <div 
              onClick={handleUploadClick}
              className="bg-white p-10 rounded-[2rem] border-3 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group min-h-[300px]"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <UploadCloud size={40} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Click to Upload Leaf Photo</h3>
              <p className="text-slate-400 max-w-xs">Supports JPG, PNG. Ensure good lighting and focus on the disease.</p>
            </div>
          ) : (
            // 2. Image Preview
            <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm group">
              <img src={imagePreview} alt="Preview" className="w-full h-[300px] object-cover" />
              
              {/* Overlay during analysis */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2 size={48} className="animate-spin mb-4 text-emerald-400" />
                  <p className="font-bold text-lg tracking-wider animate-pulse">Analyzing Leaf...</p>
                  <p className="text-sm text-slate-300">Scanning for pathogens</p>
                </div>
              )}

              {/* Clear Button */}
              {!isAnalyzing && (
                <button onClick={handleClear} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-slate-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm">
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze} 
            disabled={!selectedImage || isAnalyzing}
            className={`w-full p-4 rounded-xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-3 transition-all ${
              !selectedImage || isAnalyzing ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200/50 hover:-translate-y-1'
            }`}
          >
            {isAnalyzing ? 'Processing Image...' : <><Stethoscope /> Diagnose Now</>}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

        </div>

        {/* --- RIGHT SIDE: Diagnosis Report Area --- */}
        <div data-aos="fade-left" data-aos-delay="200" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[400px] relative overflow-hidden">
          
          {result ? (
            // 1. Final Result View
            <div className="relative z-10 animate-in fade-in slide-in-from-right duration-500">
              
              {/* Header: Disease Name & Confidence */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2 mb-2">
                   {result.severity === "None" ? (
                     <CheckCircle2 size={20} className="text-emerald-500" />
                   ) : (
                     <AlertTriangle size={20} className="text-amber-500" />
                   )}
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                     {result.severity === "None" ? "Plant Status" : "Detected Issue"}
                   </p>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{result.diseaseName}</h3>
                
                {/* Description */}
                {result.description && (
                  <p className="text-sm text-slate-500 mb-4 flex items-start gap-2">
                    <Info size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    {result.description}
                  </p>
                )}
                
                <div className="flex gap-4 mt-4">
                   <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-600 uppercase">Confidence</p>
                      <p className="text-lg font-black text-slate-800">{result.confidence}%</p>
                   </div>
                   <div className={`px-4 py-2 rounded-xl border ${
                     result.severity === "None" ? "bg-emerald-50 border-emerald-100" :
                     result.severity === "Moderate" ? "bg-amber-50 border-amber-100" :
                     result.severity === "High" ? "bg-orange-50 border-orange-100" :
                     result.severity === "Critical" ? "bg-red-50 border-red-100" :
                     "bg-amber-50 border-amber-100"
                   }`}>
                      <p className={`text-xs font-bold uppercase ${
                        result.severity === "None" ? "text-emerald-600" :
                        result.severity === "Moderate" ? "text-amber-600" :
                        result.severity === "High" ? "text-orange-600" :
                        result.severity === "Critical" ? "text-red-600" :
                        "text-amber-600"
                      }`}>Severity</p>
                      <p className="text-lg font-black text-slate-800">{result.severity}</p>
                   </div>
                </div>
              </div>
              
              {/* Solution Section */}
              <div>
                 <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <CheckCircle2 className="text-emerald-500" size={20} /> Recommended Solutions
                 </h4>
                 <ul className="space-y-3">
                   {result.solution.map((sol, index) => (
                     <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 border border-slate-100">
                        <span className="min-w-[20px] h-[20px] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                        {sol}
                     </li>
                   ))}
                 </ul>
              </div>

            </div>
          ) : (
             // 2. Empty State Placeholder
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 relative z-10">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <ImageIcon size={40} className="opacity-50" />
               </div>
               <h4 className="text-xl font-bold text-slate-500 mb-2">Waiting for Analysis</h4>
               <p className="text-sm max-w-xs">Upload an image and click "Diagnose Now" to see the AI report here.</p>
            </div>
          )}

          {/* Background Decor */}
          <Stethoscope size={200} className="absolute -bottom-10 -right-10 text-slate-50 pointer-events-none rotate-[-20deg] z-0" />
        </div>

      </div>
    </div>
  );
};

export default AgroDoctor;