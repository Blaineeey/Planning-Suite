import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../../utils/errors';
import { config } from '../../config';

const prisma = new PrismaClient();

// Validation schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().optional(),
  role: z.enum(['OWNER', 'PLANNER', 'CLIENT', 'VENDOR'])
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class AuthService {
  async register(data: z.infer<typeof RegisterSchema>) {
    const validated = RegisterSchema.parse(data);
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email }
    });
    
    if (existing) {
      throw new AppError('User already exists', 409);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);
    
    // Create organization if owner
    let organizationId: string | undefined;
    if (validated.role === 'OWNER' && validated.organizationName) {
      const org = await prisma.organization.create({
        data: {
          name: validated.organizationName,
          slug: validated.organizationName.toLowerCase().replace(/\s+/g, '-')
        }
      });
      organizationId = org.id;
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        firstName: validated.firstName,
        lastName: validated.lastName,
        role: validated.role,
        organizationId
      }
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }
  
  async login(data: z.infer<typeof LoginSchema>) {
    const validated = LoginSchema.parse(data);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { organization: true }
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Verify password
    const isValid = await bcrypt.compare(validated.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization
      },
      accessToken,
      refreshToken
    };
  }
  
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
      
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: payload.userId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
  
  async logout(userId: string) {
    // In a production app, you might want to invalidate tokens here
    // For now, we'll rely on client-side token removal
    return { success: true };
  }
  
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organization: user.organization
    };
  }
  
  private async generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
    
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
