const crypto = require('crypto');
const db = require('../models/database');

class ESignatureService {
  /**
   * Create a signature request for a document
   */
  createSignatureRequest(documentId, documentType, recipients, options = {}) {
    const document = db.findById(documentType + 's', documentId);
    
    if (!document) {
      throw new Error(`${documentType} not found`);
    }
    
    const signatureRequests = [];
    
    recipients.forEach(recipient => {
      // Generate unique token for each recipient
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (options.expiryDays || 7) * 24 * 60 * 60 * 1000);
      
      const signatureRequest = db.create('signatureRequests', {
        documentId,
        documentType: documentType.toUpperCase(),
        organizationId: document.organizationId,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        recipientRole: recipient.role || 'SIGNER',
        token,
        status: 'PENDING',
        expiresAt: expiresAt.toISOString(),
        signatureUrl: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/sign/${token}`,
        metadata: {
          documentTitle: document.title || document.name,
          documentNumber: document.number,
          senderId: options.senderId,
          message: options.message
        }
      });
      
      signatureRequests.push(signatureRequest);
    });
    
    // Update document status
    db.update(documentType + 's', documentId, {
      signatureStatus: 'SENT_FOR_SIGNATURE',
      signatureRequestIds: signatureRequests.map(sr => sr.id)
    });
    
    return signatureRequests;
  }

  /**
   * Get signature request by token
   */
  getSignatureRequest(token) {
    const request = db.findAll('signatureRequests', { token })[0];
    
    if (!request) {
      throw new Error('Invalid signature request');
    }
    
    // Check if expired
    if (new Date(request.expiresAt) < new Date()) {
      db.update('signatureRequests', request.id, { status: 'EXPIRED' });
      throw new Error('Signature request has expired');
    }
    
    // Get the document
    const document = db.findById(request.documentType.toLowerCase() + 's', request.documentId);
    
    return {
      request,
      document
    };
  }

  /**
   * Submit signature
   */
  submitSignature(token, signatureData) {
    const { request, document } = this.getSignatureRequest(token);
    
    if (request.status !== 'PENDING') {
      throw new Error('This document has already been signed');
    }
    
    // Create signature hash for verification
    const signatureHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        documentId: request.documentId,
        recipientEmail: request.recipientEmail,
        signatureData: signatureData.signature,
        timestamp: new Date().toISOString()
      }))
      .digest('hex');
    
    // Update signature request
    const updatedRequest = db.update('signatureRequests', request.id, {
      status: 'SIGNED',
      signedAt: new Date().toISOString(),
      signatureData: signatureData.signature,
      signatureType: signatureData.type, // DRAW, TYPE, UPLOAD
      signatureHash,
      ipAddress: signatureData.ipAddress,
      userAgent: signatureData.userAgent,
      signedBy: signatureData.fullName || request.recipientName
    });
    
    // Check if all signatures are collected
    const allRequests = db.findAll('signatureRequests', { 
      documentId: request.documentId,
      documentType: request.documentType 
    });
    
    const allSigned = allRequests.every(r => r.status === 'SIGNED');
    
    if (allSigned) {
      // Update document as fully signed
      db.update(request.documentType.toLowerCase() + 's', request.documentId, {
        signatureStatus: 'FULLY_SIGNED',
        signedAt: new Date().toISOString(),
        status: 'SIGNED'
      });
      
      // Create audit trail
      db.create('auditLogs', {
        entityType: request.documentType,
        entityId: request.documentId,
        action: 'DOCUMENT_SIGNED',
        details: {
          signatureCount: allRequests.length,
          signers: allRequests.map(r => ({
            name: r.signedBy,
            email: r.recipientEmail,
            signedAt: r.signedAt
          }))
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      signatureHash,
      allSigned,
      document: db.findById(request.documentType.toLowerCase() + 's', request.documentId)
    };
  }

  /**
   * Verify signature
   */
  verifySignature(signatureHash) {
    const request = db.findAll('signatureRequests', { signatureHash })[0];
    
    if (!request) {
      return {
        valid: false,
        message: 'Signature not found'
      };
    }
    
    return {
      valid: true,
      signer: {
        name: request.signedBy,
        email: request.recipientEmail,
        signedAt: request.signedAt
      },
      document: {
        type: request.documentType,
        id: request.documentId
      }
    };
  }

  /**
   * Cancel signature request
   */
  cancelSignatureRequest(requestId) {
    const request = db.findById('signatureRequests', requestId);
    
    if (!request) {
      throw new Error('Signature request not found');
    }
    
    if (request.status === 'SIGNED') {
      throw new Error('Cannot cancel a signed document');
    }
    
    return db.update('signatureRequests', requestId, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString()
    });
  }

  /**
   * Send reminder
   */
  sendReminder(requestId) {
    const request = db.findById('signatureRequests', requestId);
    
    if (!request || request.status !== 'PENDING') {
      throw new Error('Invalid signature request for reminder');
    }
    
    // Update last reminder sent
    db.update('signatureRequests', requestId, {
      lastReminderSent: new Date().toISOString(),
      reminderCount: (request.reminderCount || 0) + 1
    });
    
    // In production, this would send an actual email
    return {
      success: true,
      message: `Reminder sent to ${request.recipientEmail}`
    };
  }

  /**
   * Generate signed document PDF
   */
  generateSignedPDF(documentId, documentType) {
    const document = db.findById(documentType + 's', documentId);
    const signatures = db.findAll('signatureRequests', {
      documentId,
      documentType: documentType.toUpperCase(),
      status: 'SIGNED'
    });
    
    // In production, this would generate an actual PDF
    // For now, we'll create a mock PDF record
    const pdf = db.create('documents', {
      type: 'SIGNED_PDF',
      name: `${document.number || document.title}_signed.pdf`,
      entityType: documentType.toUpperCase(),
      entityId: documentId,
      url: `/documents/${documentId}_signed.pdf`,
      metadata: {
        signatures: signatures.map(s => ({
          name: s.signedBy,
          email: s.recipientEmail,
          signedAt: s.signedAt,
          hash: s.signatureHash
        })),
        generatedAt: new Date().toISOString()
      }
    });
    
    return pdf;
  }

  /**
   * Get signature audit trail
   */
  getAuditTrail(documentId, documentType) {
    const requests = db.findAll('signatureRequests', {
      documentId,
      documentType: documentType.toUpperCase()
    });
    
    const events = [];
    
    requests.forEach(request => {
      // Document sent event
      events.push({
        type: 'SENT',
        timestamp: request.createdAt,
        actor: 'System',
        recipient: request.recipientEmail,
        details: 'Document sent for signature'
      });
      
      // Reminder events
      if (request.lastReminderSent) {
        events.push({
          type: 'REMINDER_SENT',
          timestamp: request.lastReminderSent,
          actor: 'System',
          recipient: request.recipientEmail,
          details: `Reminder #${request.reminderCount} sent`
        });
      }
      
      // Signature event
      if (request.status === 'SIGNED') {
        events.push({
          type: 'SIGNED',
          timestamp: request.signedAt,
          actor: request.signedBy,
          recipient: request.recipientEmail,
          details: 'Document signed',
          ipAddress: request.ipAddress,
          hash: request.signatureHash
        });
      }
      
      // Cancellation event
      if (request.status === 'CANCELLED') {
        events.push({
          type: 'CANCELLED',
          timestamp: request.cancelledAt,
          actor: 'System',
          details: 'Signature request cancelled'
        });
      }
    });
    
    // Sort by timestamp
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return events;
  }
}

module.exports = new ESignatureService();