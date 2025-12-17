import TokenGenerator, { TokenPayload } from "@/domain/services/token-generator";
import jwt, { SignOptions } from "jsonwebtoken";
import { randomBytes } from "crypto";

export class JwtTokenGenerator implements TokenGenerator {
  private readonly secret: string;
  private readonly expiresIn: string | number;
  private readonly refreshExpiresIn: string | number;

  constructor(secret?: string, expiresIn?: string | number, refreshExpiresIn?: string | number) {
    this.secret = secret || process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
    this.expiresIn = expiresIn || process.env.JWT_EXPIRES_IN || "7d";
    this.refreshExpiresIn = refreshExpiresIn || process.env.JWT_REFRESH_EXPIRES_IN || "30d";
  }

  async generate(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          sub: payload.sub,
          email: payload.email,
        },
        this.secret,
        {
          expiresIn: this.expiresIn,
        } as SignOptions,
        (error, token) => {
          if (error || !token) {
            reject(error || new Error("Failed to generate token"));
          } else {
            resolve(token);
          }
        }
      );
    });
  }

  async verify(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (error, decoded) => {
        if (error || !decoded || typeof decoded === 'string') {
          reject(new Error("Invalid or expired token"));
        } else {
          resolve({
            sub: decoded.sub as string,
            email: decoded.email as string,
          });
        }
      });
    });
  }

  async generateRefreshToken(): Promise<string> {
    return randomBytes(64).toString('hex');
  }

  getRefreshTokenExpirationDate(): Date {
    const expiresIn = this.refreshExpiresIn;
    const now = new Date();
    
    if (typeof expiresIn === 'number') {
      return new Date(now.getTime() + expiresIn);
    }
    
    // Parse string format like "30d", "7d", "24h"
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      // Default to 30 days if format is invalid
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    let milliseconds = 0;
    switch (unit) {
      case 'd':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      case 'h':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'm':
        milliseconds = value * 60 * 1000;
        break;
      case 's':
        milliseconds = value * 1000;
        break;
    }
    
    return new Date(now.getTime() + milliseconds);
  }
}
