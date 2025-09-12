const express = require('express');
const router = express.Router();
const db = require('../models/database');
const esignatureService = require('../services/esignature');

// ==================== E-SIGNATURE ENDPOINTS ====================

// Create signature request for contract
router.post('/contracts/:contractId/signature-request', (req, res) => {
  try {
    const { contractId } = req.params;
    const { recipientEmail, recipientName } = req.body;
    
    if (!recipientEmail || !recipientName) {
      return res.status(400).json({ 
        error: 'Recipient email and name are required' 
      });
    }
    
    const signatureRequest = esignatureService.createSignatureRequest(
      contractId,
      recipientEmail,
      recipientName
    );
    
    res.json({
      success: true,
      signatureRequest,
      message: `Signature request sent to ${recipientEmail}`
    });
  } catch (error) {
    console.error('Create signature request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get signature request by token (public endpoint for signing)
router.get('/sign/:token', (req, res) => {
  try {
    const { token } = req.params;
    const signatureRequest = esignatureService.getSignatureRequest(token);
    
    if (!signatureRequest) {
      return res.status(404).json({ error: 'Invalid or expired signature link' });
    }
    
    // Check if expired
    if (new Date(signatureRequest.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Signature request has expired' });
    }
    
    // Check if already signed
    if (signatureRequest.status === 'SIGNED') {
      return res.json({
        signed: true,
        signedAt: signatureRequest.signedAt,
        message: 'Document already signed'
      });
    }
    
    res.json({
      success: true,
      signatureRequest: {
        id: signatureRequest.id,
        recipientName: signatureRequest.recipientName,
        recipientEmail: signatureRequest.recipientEmail,
        status: signatureRequest.status,
        expiresAt: signatureRequest.expiresAt,
        contract: signatureRequest.contract
      }
    });
  } catch (error) {
    console.error('Get signature request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit signature
router.post('/sign/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { signature, signatureType = 'drawn' } = req.body;
    
    if (!signature) {
      return res.status(400).json({ error: 'Signature is required' });
    }
    
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const result = await esignatureService.processSignature(
      token,
      {
        signature,
        type: signatureType,
        timestamp: new Date().toISOString()
      },
      ipAddress
    );
    
    res.json({
      success: true,
      ...result,
      message: 'Document signed successfully'
    });
  } catch (error) {
    console.error('Process signature error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all signature requests for a contract
router.get('/contracts/:contractId/signatures', (req, res) => {
  try {
    const { contractId } = req.params;
    const signatures = esignatureService.getContractSignatures(contractId);
    
    res.json({
      success: true,
      signatures,
      count: signatures.length
    });
  } catch (error) {
    console.error('Get contract signatures error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify signature authenticity
router.post('/signatures/:signatureRequestId/verify', (req, res) => {
  try {
    const { signatureRequestId } = req.params;
    const isValid = esignatureService.verifySignature(signatureRequestId);
    
    res.json({
      success: true,
      valid: isValid,
      message: isValid ? 'Signature is valid' : 'Signature verification failed'
    });
  } catch (error) {
    console.error('Verify signature error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel signature request
router.post('/signatures/:signatureRequestId/cancel', (req, res) => {
  try {
    const { signatureRequestId } = req.params;
    const result = esignatureService.cancelSignatureRequest(signatureRequestId);
    
    res.json({
      success: true,
      ...result,
      message: 'Signature request cancelled'
    });
  } catch (error) {
    console.error('Cancel signature error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Send reminder for pending signature
router.post('/signatures/:signatureRequestId/remind', (req, res) => {
  try {
    const { signatureRequestId } = req.params;
    const result = esignatureService.sendReminder(signatureRequestId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all pending signatures for organization
router.get('/signatures/pending', (req, res) => {
  try {
    const { organizationId } = req.query;
    
    let signatures = db.findAll('signatureRequests', 
      organizationId ? { organizationId, status: 'PENDING' } : { status: 'PENDING' }
    );
    
    // Add contract details
    signatures = signatures.map(sig => {
      const contract = db.findById('contracts', sig.contractId);
      return {
        ...sig,
        contractTitle: contract?.title || 'Unknown'
      };
    });
    
    res.json({
      success: true,
      signatures,
      count: signatures.length
    });
  } catch (error) {
    console.error('Get pending signatures error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
