import TokenGenerator, { TokenPayload } from "@/domain/services/token-generator";
import jwt, { SignOptions } from "jsonwebtoken";

export class JwtTokenGenerator implements TokenGenerator {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor(secret?: string, expiresIn?: string | number) {
    this.secret = secret || process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
    this.expiresIn = expiresIn || process.env.JWT_EXPIRES_IN || "7d";
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
}
