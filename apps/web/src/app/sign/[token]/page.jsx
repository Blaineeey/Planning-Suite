'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignaturePad from '@/components/esignature/SignaturePad';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

export default function SigningPage() {
  const { token } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signatureRequest, setSignatureRequest] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSignatureRequest();
  }, [token]);

  const fetchSignatureRequest = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/sign/${token}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to load signature request');
        return;
      }
      
      if (data.signed) {
        setSuccess(true);
        setError('This document has already been signed');
        return;
      }
      
      setSignatureRequest(data.signatureRequest);
    } catch (err) {
      console.error('Error fetching signature request:', err);
      setError('Failed to load signature request');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (signatureData) => {
    setSigning(true);
    
    try {
      const response = await fetch(`http://localhost:3001/api/sign/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signatureData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to process signature');
        setSigning(false);
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting signature:', err);
      setError('Failed to submit signature');
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading signature request...</p>
        </div>
      </div>
    );
  }

  if (error && !signatureRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Document
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Document Signed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for signing the contract. A copy will be sent to your email.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.print()}
              className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Download Copy
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Ruban Bleu Planning Suite</h1>
          <p className="text-gray-600 mt-2">Secure Electronic Signature Portal</p>
        </div>

        {/* Status Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Signature Requested
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires: {signatureRequest?.expiresAt ? 
                      new Date(signatureRequest.expiresAt).toLocaleDateString() : 
                      'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Recipient: <span className="font-medium">{signatureRequest?.recipientName}</span>
                </p>
                <p className="text-xs text-gray-500">{signatureRequest?.recipientEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Pad */}
        {signatureRequest && (
          <SignaturePad
            recipientName={signatureRequest.recipientName}
            contractTitle={signatureRequest.contract?.title || 'Contract'}
            contractContent={signatureRequest.contract?.content || ''}
            onSign={handleSign}
            loading={signing}
          />
        )}

        {/* Footer */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by Ruban Bleu Planning Suite | 
            <a href="/privacy" className="ml-1 text-purple-600 hover:text-purple-700">
              Privacy Policy
            </a> | 
            <a href="/terms" className="ml-1 text-purple-600 hover:text-purple-700">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
