import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { mockUsers } from '../data/mockData';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = mockUsers.find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase());

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email address not recognized. Authorized email: kvishal072007@gmail.com',
        });
      }

      // Strict Password verification
      if (!password || user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please enter the authorized password.',
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          organization: user.organization,
          avatarUrl: user.avatarUrl,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      res.json({
        success: true,
        message: `Welcome back, ${user.name}! Authentication successful`,
        token,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, department, organization, avatarUrl, password } = req.body;
      const user = mockUsers.find((u) => u.id === (id || 'usr-1'));

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (name) user.name = name;
      if (department) user.department = department;
      if (organization) user.organization = organization;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (password) user.password = password;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as any;
      res.json({ success: true, user: authReq.user || mockUsers[0] });
    } catch (err) {
      next(err);
    }
  }

  static async listDemoUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, count: mockUsers.length, data: mockUsers });
    } catch (err) {
      next(err);
    }
  }
}
