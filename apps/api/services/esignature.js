const crypto = require('crypto');
const db = require('../models/database');

class ESignatureService {
  /**
   * Create a signature request for a contract
   */
  createSignatureRequest(contractId, recipientEmail, recipientName) {
    const contract = db.findById('contracts', contractId);
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    // Generate unique token for signature URL
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const signatureRequest = db.create('signatureRequests', {
      contractId,
      organizationId: contract.organizationId,
      recipientEmail,
      recipientName,
      token,
      status: 'PENDING',
      expiresAt: expiresAt.toISOString(),
      signatureUrl: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/sign/${token}`
    });
    
    // Update contract status
    db.update('contracts', contractId, { status: 'SENT' });
    
    return signatureRequest;
  }
  
  /**
   * Process signature submission
   */
  async processSignature(token, signatureData, ipAddress) {
    const requests = db.findAll('signatureRequests', { token });
    
    if (!requests || requests.length === 0) {
      throw new Error('Invalid signature request');
    }
    
    const request = requests[0];
    
    // Check if expired
    if (new Date(request.expiresAt) < new Date()) {
      throw new Error('Signature request has expired');
    }
    
    // Check if already signed
    if (request.status === 'SIGNED') {
      throw new Error('Document already signed');
    }
    
    // Generate signature hash for verification
    const signatureHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        contractId: request.contractId,
        signatureData,
        timestamp: new Date().toISOString(),
        ipAddress
      }))
      .digest('hex');
    
    // Update signature request
    db.update('signatureRequests', request.id, {
      status: 'SIGNED',
      signedAt: new Date().toISOString(),
      signatureData,
      signatureHash,
      signedBy: request.recipientName,
      ipAddress
    });
    
    // Update contract status
    db.update('contracts', request.contractId, {
      status: 'SIGNED',
      signedAt: new Date().toISOString()
    });
    
    // Create audit log
    db.create('auditLogs', {
      organizationId: request.organizationId,
      action: 'CONTRACT_SIGNED',
      entityType: 'contract',
      entityId: request.contractId,
      metadata: {
        signatureRequestId: request.id,
        signedBy: request.recipientName,
        ipAddress,
        signatureHash
      }
    });
    
    return {
      success: true,
      contractId: request.contractId,
      signatureHash
    };
  }
  
  /**
   * Get signature request by token
   */
  getSignatureRequest(token) {
    const requests = db.findAll('signatureRequests', { token });
    
    if (!requests || requests.length === 0) {
      return null;
    }
    
    const request = requests[0];
    
    // Include contract details
    const contract = db.findById('contracts', request.contractId);
    
    return {
      ...request,
      contract: contract ? {
        id: contract.id,
        title: contract.title,
        content: contract.content,
        terms: contract.terms
      } : null
    };
  }
  
  /**
   * Verify signature authenticity
   */
  verifySignature(signatureRequestId) {
    const request = db.findById('signatureRequests', signatureRequestId);
    
    if (!request || !request.signatureHash) {
      return false;
    }
    
    // Recreate hash and compare
    const verificationHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        contractId: request.contractId,
        signatureData: request.signatureData,
        timestamp: request.signedAt,
        ipAddress: request.ipAddress
      }))
      .digest('hex');
    
    return verificationHash === request.signatureHash;
  }
  
  /**
   * Cancel signature request
   */
  cancelSignatureRequest(signatureRequestId) {
    const request = db.findById('signatureRequests', signatureRequestId);
    
    if (!request) {
      throw new Error('Signature request not found');
    }
    
    if (request.status === 'SIGNED') {
      throw new Error('Cannot cancel signed document');
    }
    
    db.update('signatureRequests', signatureRequestId, {
      status: 'CANCELLED'
    });
    
    return { success: true };
  }
  
  /**
   * Get all signature requests for a contract
   */
  getContractSignatures(contractId) {
    return db.findAll('signatureRequests', { contractId });
  }
  
  /**
   * Send reminder for pending signature
   */
  sendReminder(signatureRequestId) {
    const request = db.findById('signatureRequests', signatureRequestId);
    
    if (!request) {
      throw new Error('Signature request not found');
    }
    
    if (request.status !== 'PENDING') {
      throw new Error('Can only send reminders for pending signatures');
    }
    
    // In production, this would send an email
    // For now, just log and update metadata
    db.update('signatureRequests', signatureRequestId, {
      lastReminderSent: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Reminder sent to ' + request.recipientEmail
    };
  }
}

module.exports = new ESignatureService();
