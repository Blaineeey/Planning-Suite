'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileSignature, 
  Type, 
  Pen, 
  Upload, 
  Check, 
  X,
  AlertCircle,
  Download
} from 'lucide-react';

export default function SignaturePad({ 
  onSign, 
  recipientName = '',
  contractTitle = '',
  contractContent = '',
  loading = false 
}) {
  const [signatureType, setSignatureType] = useState('draw'); // draw, type, upload
  const [typedSignature, setTypedSignature] = useState(recipientName);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && signatureType === 'draw') {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = '#1f2937';
      context.lineWidth = 2;
      contextRef.current = context;
    }
  }, [signatureType]);

  const startDrawing = ({ nativeEvent }) => {
    if (signatureType !== 'draw') return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || signatureType !== 'draw') return;
    
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (signatureType !== 'draw') return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms before signing');
      return;
    }

    let signatureData = '';
    
    if (signatureType === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL();
    } else if (signatureType === 'type') {
      signatureData = typedSignature;
    }
    
    if (!signatureData) {
      alert('Please provide a signature');
      return;
    }
    
    onSign({
      signature: signatureData,
      signatureType,
      timestamp: new Date().toISOString(),
      agreedToTerms
    });
  };

  const canSubmit = () => {
    if (!agreedToTerms) return false;
    
    if (signatureType === 'draw') {
      return hasSignature;
    } else if (signatureType === 'type') {
      return typedSignature.trim().length > 0;
    }
    
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Electronic Signature Required
        </h2>
        <p className="text-gray-600">
          Please sign the contract: <span className="font-medium">{contractTitle}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Signing as: <span className="font-medium">{recipientName}</span>
        </p>
      </div>

      {/* Contract Content Preview */}
      {contractContent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-2">Contract Terms</h3>
          <div className="text-sm text-gray-600 whitespace-pre-wrap">
            {contractContent}
          </div>
        </div>
      )}

      {/* Signature Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose signature method:
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSignatureType('draw')}
            className={`p-3 rounded-lg border-2 transition-all ${
              signatureType === 'draw'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Pen size={20} className="mx-auto mb-1" />
            <span className="text-sm">Draw</span>
          </button>
          
          <button
            onClick={() => setSignatureType('type')}
            className={`p-3 rounded-lg border-2 transition-all ${
              signatureType === 'type'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Type size={20} className="mx-auto mb-1" />
            <span className="text-sm">Type</span>
          </button>
          
          <button
            onClick={() => setSignatureType('upload')}
            disabled
            className="p-3 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
          >
            <Upload size={20} className="mx-auto mb-1" />
            <span className="text-sm">Upload</span>
          </button>
        </div>
      </div>

      {/* Signature Input Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Signature:
        </label>
        
        {signatureType === 'draw' ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-48 border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
              style={{ touchAction: 'none' }}
            />
            <button
              onClick={clearCanvas}
              className="absolute top-2 right-2 px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear
            </button>
            <div className="absolute bottom-2 left-2 text-xs text-gray-400">
              Sign above
            </div>
          </div>
        ) : signatureType === 'type' ? (
          <div className="relative">
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl font-signature focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ fontFamily: 'cursive' }}
            />
          </div>
        ) : null}
      </div>

      {/* Terms Agreement */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <div className="flex-1">
            <span className="text-sm text-gray-700">
              I agree that this electronic signature is the legal equivalent of my manual signature 
              on this contract. I have read and agree to all terms and conditions stated above.
            </span>
            <div className="mt-2 text-xs text-gray-500">
              <AlertCircle size={14} className="inline mr-1" />
              By signing, you agree to be legally bound by this document's terms.
            </div>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSign}
          disabled={!canSubmit() || loading}
          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
            canSubmit() && !loading
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Signing...</span>
            </>
          ) : (
            <>
              <FileSignature size={18} />
              <span>Sign Contract</span>
            </>
          )}
        </button>
      </div>

      {/* Legal Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          This document will be electronically signed and stored. 
          IP Address: {typeof window !== 'undefined' ? 'Will be recorded' : ''} | 
          Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
