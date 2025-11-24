import CreateUserUseCase from "@/app/usecases/user/calebe/create-user-usecase";

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}  

  async handle(request: any, response: any): Promise<any> {
    try {
      const { name, email, password } = request.body;

      const user = await this.createUserUseCase.execute({ name, email, password });

      return response.status(201).json(user);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}