import LoginUseCase from "@/app/usecases/user/calebe/login-usecase";
import { Request, Response } from "express";

export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}  

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({ message: 'Email and password are required' });
      }

      const result = await this.loginUseCase.execute({ email, password });

      return response.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return response.status(401).json({ message: error.message });
      }
      
      if (error.message === 'User is inactive' || error.message === 'User is waiting for approval') {
        return response.status(403).json({ message: error.message });
      }

      return response.status(500).json({ message: error.message });
    }
  }
}
