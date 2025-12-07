import PasswordHasher from "@/domain/services/password-hasher";
import * as argon2 from "argon2";

export class Argon2PasswordHasher implements PasswordHasher {
  
  async hash(plain: string): Promise<string> {
    return await argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch (error) {
      return false;
    }
  }
}
