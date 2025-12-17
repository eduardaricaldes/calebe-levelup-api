import RefreshTokenUseCase from "@/app/usecases/user/calebe/refresh-token-usecase";
import { Request, Response } from "express";

export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return response.status(400).json({ message: 'Refresh token is required' });
      }

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      return response.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === 'Invalid or expired refresh token' ||
        error.message === 'Refresh token has expired' ||
        error.message === 'User not found'
      ) {
        return response.status(401).json({ message: error.message });
      }

      if (error.message.includes('All sessions invalidated')) {
        return response.status(401).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
