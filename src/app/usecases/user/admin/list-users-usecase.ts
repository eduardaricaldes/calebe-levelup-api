import UserRepository from "@/domain/repositories/user-repository";
import { ListUsersRequestDTO } from "@/app/dto/list-users-requestDTO";
import { ListUsersResponseDTO } from "@/app/dto/list-users-responseDTO";

export default class ListUsersUseCase {
  
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  
  async execute(listUsersRequestDTO: ListUsersRequestDTO): Promise<ListUsersResponseDTO> {
    const page = listUsersRequestDTO.page || 1;
    const limit = listUsersRequestDTO.limit || 10;

    const filters: Record<string, string> = {};
    if (listUsersRequestDTO.status) filters.status = listUsersRequestDTO.status;
    if (listUsersRequestDTO.role) filters.role = listUsersRequestDTO.role;
    if (listUsersRequestDTO.search) filters.search = listUsersRequestDTO.search;

    const result = await this.userRepository.list(page, limit, filters);

    return {
      data: result.data.map(user => ({
        externalId: user.externalId,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }
}
