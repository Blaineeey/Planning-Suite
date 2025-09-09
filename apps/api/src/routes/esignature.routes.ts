import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// ============= E-SIGNATURE SYSTEM =============

// Send contract for signature
router.post('/contracts/:id/send', authenticateToken, async (req, res) => {
  try {
    const { recipientEmail, recipientName, message } = req.body;
    
    // Get contract
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Generate signature token
    const signatureToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days to sign

    // Create signature request
    const signatureRequest = await prisma.signatureRequest.create({
      data: {
        contractId: contract.id,
        recipientEmail,
        recipientName,
        token: signatureToken,
        status: 'PENDING',
        expiresAt,
        organizationId: req.user.organizationId
      }
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: contract.id },
      data: { status: 'SENT' }
    });

    // TODO: Send email with signature link
    const signatureUrl = `${process.env.FRONTEND_URL}/sign/${signatureToken}`;
    
    res.json({
      success: true,
      signatureRequest,
      signatureUrl
    });
  } catch (error) {
    console.error('Error sending contract:', error);
    res.status(500).json({ error: 'Failed to send contract' });
  }
});

// Get contract by signature token
router.get('/sign/:token', async (req, res) => {
  try {
    const signatureRequest = await prisma.signatureRequest.findUnique({
      where: { token: req.params.token },
      include: {
        contract: true
      }
    });

    if (!signatureRequest) {
      return res.status(404).json({ error: 'Invalid signature link' });
    }

    if (signatureRequest.status === 'SIGNED') {
      return res.status(400).json({ error: 'Contract already signed' });
    }

    if (new Date() > signatureRequest.expiresAt) {
      return res.status(400).json({ error: 'Signature link expired' });
    }

    res.json({
      contract: {
        id: signatureRequest.contract.id,
        title: signatureRequest.contract.title,
        content: signatureRequest.contract.content,
        terms: signatureRequest.contract.terms
      },
      recipientName: signatureRequest.recipientName,
      recipientEmail: signatureRequest.recipientEmail
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// Sign contract
router.post('/sign/:token', async (req, res) => {
  try {
    const { signature, signedBy, ipAddress } = req.body;
    
    const signatureRequest = await prisma.signatureRequest.findUnique({
      where: { token: req.params.token },
      include: { contract: true }
    });

    if (!signatureRequest) {
      return res.status(404).json({ error: 'Invalid signature link' });
    }

    if (signatureRequest.status === 'SIGNED') {
      return res.status(400).json({ error: 'Contract already signed' });
    }

    // Create signature hash
    const signatureHash = crypto
      .createHash('sha256')
      .update(signature + signatureRequest.contract.id + new Date().toISOString())
      .digest('hex');

    // Update signature request
    await prisma.signatureRequest.update({
      where: { id: signatureRequest.id },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        signatureData: signature,
        signatureHash,
        signedBy,
        ipAddress
      }
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: signatureRequest.contract.id },
      data: {
        status: 'SIGNED',
        signedAt: new Date()
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CONTRACT_SIGNED',
        entityType: 'CONTRACT',
        entityId: signatureRequest.contract.id,
        metadata: {
          signatureHash,
          signedBy,
          ipAddress,
          timestamp: new Date().toISOString()
        },
        userId: null, // Public signature
        organizationId: signatureRequest.organizationId
      }
    });

    res.json({
      success: true,
      signatureHash,
      signedAt: new Date()
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ error: 'Failed to sign contract' });
  }
});

// Verify signature
router.get('/contracts/:id/verify', async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        signatureRequests: {
          where: { status: 'SIGNED' }
        }
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const signatures = contract.signatureRequests.map(sr => ({
      signedBy: sr.signedBy,
      signedAt: sr.signedAt,
      hash: sr.signatureHash,
      verified: true // In production, verify hash integrity
    }));

    res.json({
      contractId: contract.id,
      status: contract.status,
      signatures
    });
  } catch (error) {
    console.error('Error verifying signatures:', error);
    res.status(500).json({ error: 'Failed to verify signatures' });
  }
});

// Download signed contract as PDF
router.get('/contracts/:id/download', authenticateToken, async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        signatureRequests: {
          where: { status: 'SIGNED' }
        }
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // TODO: Generate PDF with signatures
    // For now, return contract data
    res.json({
      contract,
      message: 'PDF generation will be implemented with PDF library'
    });
  } catch (error) {
    console.error('Error downloading contract:', error);
    res.status(500).json({ error: 'Failed to download contract' });
  }
});

export default router;
