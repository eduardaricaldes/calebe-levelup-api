import { Kysely } from 'kysely';
import { DB } from './database/types/types';

// Repositories
import {UserRepositoryKysely} from './database/kysely/user-repository-kysely';
import ActionRepositoryKysely from './database/kysely/action-repository-kysely';
import ChallengeRepositoryKysely from './database/kysely/challenge-repository-kysely';
import CategoryRepositoryKysely from './database/kysely/category-repository-kysely';
import UserActivityRepositoryKysely from './database/kysely/user-activity-repository-kysely';
import ImageRepositoryKysely from './database/kysely/image-repository-kysely';

// Services
import {Argon2PasswordHasher} from './hasher/password-hasher';
import {JwtTokenGenerator} from './jwt/token-generator';
import LocalFileStorage from './services/local-file-storage';
import NodemailerEmailSender from './services/nodemailer-email-sender';

// User Use Cases - Calebe
import CreateUserUseCase from '../app/usecases/user/calebe/create-user-usecase';
import LoginUserUseCase from '../app/usecases/user/calebe/login-usecase';
import MeUseCase from '../app/usecases/user/calebe/me-usecase';
import UpdateUserUseCase from '../app/usecases/user/calebe/update-user-usecase';
import GetUserByIdUseCase from '../app/usecases/user/calebe/get-user-by-external-id-usecase';
import SendRecoveryEmailUseCase from '../app/usecases/user/calebe/send-recovery-email-usecase';
import UpdatePasswordUseCase from '../app/usecases/user/calebe/update-password-usecase';

// User Use Cases - Admin
import CreateUserByAdminUseCase from '../app/usecases/user/admin/create-admin-usecase';
import CreateAdminUseCase from '../app/usecases/user/admin/create-admin-usecase';
import ListUsersUseCase from '../app/usecases/user/admin/list-users-usecase';
import GetUserByIdAdminUseCase from '../app/usecases/user/admin/get-user-by-external-id-usecase';
import UpdateUserByAdminUseCase from '../app/usecases/user/admin/update-user-usecase';
import ApproveUserUseCase from '../app/usecases/user/admin/approve-user-usecase';
import ReproveUserUseCase from '../app/usecases/user/admin/reprove-user-usecase';
import UpdateUserStatusUseCase from '../app/usecases/user/admin/update-user-status-usecase';
import DeleteUserUseCase from '../app/usecases/user/admin/delete-user-usecase';

// Action Use Cases
import CreateActionUseCase from '../app/usecases/action/create-action-usecase';
import GetActionByIdUseCase from '../app/usecases/action/get-action-by-id-usecase';
import ListActionsUseCase from '../app/usecases/action/list-actions-usecase';
import GetActionsByCategoryUseCase from '../app/usecases/action/get-actions-by-category-usecase';
import GetActionsByUserUseCase from '../app/usecases/action/get-actions-by-user-usecase';
import UpdateActionUseCase from '../app/usecases/action/update-action-usecase';
import DeleteActionUseCase from '../app/usecases/action/delete-action-usecase';

// Challenge Use Cases
import CreateChallengeUseCase from '../app/usecases/challenge/create-challenge-usecase';
import GetChallengeByIdUseCase from '../app/usecases/challenge/get-challenge-by-id-usecase';
import ListChallengesUseCase from '../app/usecases/challenge/list-challenges-usecase';
import GetChallengesByCategoryUseCase from '../app/usecases/challenge/get-challenges-by-category-usecase';
import GetChallengesByUserUseCase from '../app/usecases/challenge/get-challenges-by-user-usecase';
import UpdateChallengeUseCase from '../app/usecases/challenge/update-challenge-usecase';
import DeleteChallengeUseCase from '../app/usecases/challenge/delete-challenge-usecase';

// Category Use Cases
import CreateCategoryUseCase from '../app/usecases/category/create-category-usecase';
import GetCategoryByIdUseCase from '../app/usecases/category/get-category-by-id-usecase';
import ListCategoriesUseCase from '../app/usecases/category/list-categories-usecase';
import UpdateCategoryUseCase from '../app/usecases/category/update-category-usecase';
import DeleteCategoryUseCase from '../app/usecases/category/delete-category-usecase';

// User Activity Use Cases
import CreateUserActivityUseCase from '../app/usecases/user-activity/create-user-activity-usecase';
import UpdateUserActivityStatusUseCase from '../app/usecases/user-activity/update-user-activity-status-usecase';

// Image Use Cases
import UploadImageUseCase from '../app/usecases/image/upload-image-usecase';
import GetImageByIdUseCase from '../app/usecases/image/get-image-by-id-usecase';
import UpdateImageUseCase from '../app/usecases/image/update-image-usecase';
import DeleteImageUseCase from '../app/usecases/image/delete-image-usecase';

// Controllers - User Calebe
import {CreateUserController} from './controllers/user/calebe/create-user-controller';
import {LoginController} from './controllers/user/calebe/login-controller';
import {MeController} from './controllers/user/calebe/me-controller';
import {UpdateUserController} from './controllers/user/calebe/update-user-controller';
import {GetUserByExternalIdController} from './controllers/user/calebe/get-user-by-external-id-controller';
import {SendRecoveryEmailController} from './controllers/user/calebe/send-recovery-email-controller';
import {UpdatePasswordController} from './controllers/user/calebe/update-password-controller';

// Controllers - User Admin
import {CreateAdminController} from './controllers/user/admin/create-admin-controller';
import {ListUsersController} from './controllers/user/admin/list-users-controller';
import {GetUserByExternalIdController as GetUserByExternalIdControllerAdmin} from './controllers/user/admin/get-user-by-external-id-controller';
import {UpdateUserController as UpdateUserControllerAdmin} from './controllers/user/admin/update-user-controller';
import ApproveUserController from './controllers/user/admin/approve-user-controller';
import ReproveUserController from './controllers/user/admin/reprove-user-controller';
import {UpdateUserStatusController} from './controllers/user/admin/update-user-status-controller';
import {DeleteUserController} from './controllers/user/admin/delete-user-controller';

// Controllers - Action
import {CreateActionController} from './controllers/action/create-action-controller';
import {GetActionByIdController} from './controllers/action/get-action-by-id-controller';
import {ListActionsController} from './controllers/action/list-actions-controller';
import {GetActionsByCategoryController} from './controllers/action/get-actions-by-category-controller';
import {GetActionsByUserController} from './controllers/action/get-actions-by-user-controller';
import {UpdateActionController} from './controllers/action/update-action-controller';
import {DeleteActionController} from './controllers/action/delete-action-controller';

// Controllers - Challenge
import CreateChallengeController from './controllers/challenge/create-challenge-controller';
import GetChallengeByIdController from './controllers/challenge/get-challenge-by-id-controller';
import ListChallengesController from './controllers/challenge/list-challenges-controller';
import GetChallengesByCategoryController from './controllers/challenge/get-challenges-by-category-controller';
import GetChallengesByUserController from './controllers/challenge/get-challenges-by-user-controller';
import UpdateChallengeController from './controllers/challenge/update-challenge-controller';
import DeleteChallengeController from './controllers/challenge/delete-challenge-controller';

// Controllers - Category
import {CreateCategoryController} from './controllers/category/create-category-controller';
import {GetCategoryByIdController} from './controllers/category/get-category-by-id-controller';
import {ListCategoriesController} from './controllers/category/list-categories-controller';
import {UpdateCategoryController} from './controllers/category/update-category-controller';
import {DeleteCategoryController} from './controllers/category/delete-category-controller';

// Controllers - User Activity
import CreateUserActivityController from './controllers/user-activity/create-user-activity-controller';
import UpdateUserActivityStatusController from './controllers/user-activity/update-user-activity-status-controller';

// Controllers - Image
import UploadImageController from './controllers/image/upload-image-controller';
import GetImageByIdController from './controllers/image/get-image-by-id-controller';
import UpdateImageController from './controllers/image/update-image-controller';
import DeleteImageController from './controllers/image/delete-image-controller';
import ListUserImagesController from './controllers/image/list-user-images-controller';

// Middlewares
import { AuthMiddleware } from './middlewares/auth-middleware';

export class Container {
  // Database
  public db: Kysely<DB>;

  // Repositories
  public userRepository: UserRepositoryKysely;
  public actionRepository: ActionRepositoryKysely;
  public challengeRepository: ChallengeRepositoryKysely;
  public categoryRepository: CategoryRepositoryKysely;
  public userActivityRepository: UserActivityRepositoryKysely;
  public imageRepository: ImageRepositoryKysely;

  // Services
  public passwordHasher: Argon2PasswordHasher;
  public tokenGenerator: JwtTokenGenerator;
  public fileStorage: LocalFileStorage;
  public emailSender: NodemailerEmailSender;

  // User Use Cases - Calebe
  public createUserUseCase: CreateUserUseCase;
  public loginUserUseCase: LoginUserUseCase;
  public meUseCase: MeUseCase;
  public updateUserUseCase: UpdateUserUseCase;
  public getUserByIdUseCase: GetUserByIdUseCase;
  public sendRecoveryEmailUseCase: SendRecoveryEmailUseCase;
  public updatePasswordUseCase: UpdatePasswordUseCase;

  // User Use Cases - Admin
  public createUserByAdminUseCase: CreateUserByAdminUseCase;
  public createAdminUseCase: CreateAdminUseCase;
  public listUsersUseCase: ListUsersUseCase;
  public getUserByIdAdminUseCase: GetUserByIdAdminUseCase;
  public updateUserByAdminUseCase: UpdateUserByAdminUseCase;
  public approveUserUseCase: ApproveUserUseCase;
  public reproveUserUseCase: ReproveUserUseCase;
  public updateUserStatusUseCase: UpdateUserStatusUseCase;
  public deleteUserUseCase: DeleteUserUseCase;

  // Action Use Cases
  public createActionUseCase: CreateActionUseCase;
  public getActionByIdUseCase: GetActionByIdUseCase;
  public listActionsUseCase: ListActionsUseCase;
  public getActionsByCategoryUseCase: GetActionsByCategoryUseCase;
  public getActionsByUserUseCase: GetActionsByUserUseCase;
  public updateActionUseCase: UpdateActionUseCase;
  public deleteActionUseCase: DeleteActionUseCase;

  // Challenge Use Cases
  public createChallengeUseCase: CreateChallengeUseCase;
  public getChallengeByIdUseCase: GetChallengeByIdUseCase;
  public listChallengesUseCase: ListChallengesUseCase;
  public getChallengesByCategoryUseCase: GetChallengesByCategoryUseCase;
  public getChallengesByUserUseCase: GetChallengesByUserUseCase;
  public updateChallengeUseCase: UpdateChallengeUseCase;
  public deleteChallengeUseCase: DeleteChallengeUseCase;

  // Category Use Cases
  public createCategoryUseCase: CreateCategoryUseCase;
  public getCategoryByIdUseCase: GetCategoryByIdUseCase;
  public listCategoriesUseCase: ListCategoriesUseCase;
  public updateCategoryUseCase: UpdateCategoryUseCase;
  public deleteCategoryUseCase: DeleteCategoryUseCase;

  // User Activity Use Cases
  public createUserActivityUseCase: CreateUserActivityUseCase;
  public updateUserActivityStatusUseCase: UpdateUserActivityStatusUseCase;

  // Image Use Cases
  public uploadImageUseCase: UploadImageUseCase;
  public getImageByIdUseCase: GetImageByIdUseCase;
  public updateImageUseCase: UpdateImageUseCase;
  public deleteImageUseCase: DeleteImageUseCase;

  // Controllers - User Calebe
  public createUserController: CreateUserController;
  public loginController: LoginController;
  public meController: MeController;
  public updateUserController: UpdateUserController;
  public getUserByIdController: GetUserByExternalIdController;
  public sendRecoveryEmailController: SendRecoveryEmailController;
  public updatePasswordController: UpdatePasswordController;

  // Controllers - User Admin
  public createAdminController: CreateAdminController;
  public listUsersController: ListUsersController;
  public getUserByIdAdminController: GetUserByExternalIdControllerAdmin;
  public updateUserByAdminController: UpdateUserControllerAdmin;
  public approveUserController: ApproveUserController;
  public reproveUserController: ReproveUserController;
  public updateUserStatusController: UpdateUserStatusController;
  public deleteUserController: DeleteUserController;

  // Controllers - Action
  public createActionController: CreateActionController;
  public getActionByIdController: GetActionByIdController;
  public listActionsController: ListActionsController;
  public getActionsByCategoryController: GetActionsByCategoryController;
  public getActionsByUserController: GetActionsByUserController;
  public updateActionController: UpdateActionController;
  public deleteActionController: DeleteActionController;

  // Controllers - Challenge
  public createChallengeController: CreateChallengeController;
  public getChallengeByIdController: GetChallengeByIdController;
  public listChallengesController: ListChallengesController;
  public getChallengesByCategoryController: GetChallengesByCategoryController;
  public getChallengesByUserController: GetChallengesByUserController;
  public updateChallengeController: UpdateChallengeController;
  public deleteChallengeController: DeleteChallengeController;

  // Controllers - Category
  public createCategoryController: CreateCategoryController;
  public getCategoryByIdController: GetCategoryByIdController;
  public listCategoriesController: ListCategoriesController;
  public updateCategoryController: UpdateCategoryController;
  public deleteCategoryController: DeleteCategoryController;

  // Controllers - User Activity
  public createUserActivityController: CreateUserActivityController;
  public updateUserActivityStatusController: UpdateUserActivityStatusController;

  // Controllers - Image
  public uploadImageController: UploadImageController;
  public getImageByIdController: GetImageByIdController;
  public updateImageController: UpdateImageController;
  public deleteImageController: DeleteImageController;
  public listUserImagesController: ListUserImagesController;

  // Middlewares
  public authMiddleware: AuthMiddleware;
  public authenticate: any;

  constructor(db: Kysely<DB>) {
    this.db = db;

    // Initialize Repositories
    this.userRepository = new UserRepositoryKysely(db);
    this.actionRepository = new ActionRepositoryKysely(db);
    this.challengeRepository = new ChallengeRepositoryKysely(db);
    this.categoryRepository = new CategoryRepositoryKysely(db);
    this.userActivityRepository = new UserActivityRepositoryKysely(db);
    this.imageRepository = new ImageRepositoryKysely(db);

    // Initialize Services
    this.passwordHasher = new Argon2PasswordHasher();
    this.tokenGenerator = new JwtTokenGenerator();
    this.fileStorage = new LocalFileStorage(
      process.env.UPLOAD_DIR || './uploads',
      process.env.BASE_URL || 'http://localhost:3000'
    );
    this.emailSender = new NodemailerEmailSender();

    // Initialize User Use Cases - Calebe
    this.createUserUseCase = new CreateUserUseCase(this.userRepository, this.passwordHasher);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository, this.passwordHasher, this.tokenGenerator);
    this.meUseCase = new MeUseCase(this.userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
    this.sendRecoveryEmailUseCase = new SendRecoveryEmailUseCase(this.userRepository, this.emailSender);
    this.updatePasswordUseCase = new UpdatePasswordUseCase(this.userRepository, this.passwordHasher);

    // Initialize User Use Cases - Admin
    this.createUserByAdminUseCase = new CreateUserByAdminUseCase(this.userRepository, this.passwordHasher);
    this.createAdminUseCase = new CreateAdminUseCase(this.userRepository, this.passwordHasher);
    this.listUsersUseCase = new ListUsersUseCase(this.userRepository);
    this.getUserByIdAdminUseCase = new GetUserByIdAdminUseCase(this.userRepository);
    this.updateUserByAdminUseCase = new UpdateUserByAdminUseCase(this.userRepository);
    this.approveUserUseCase = new ApproveUserUseCase(this.userRepository);
    this.reproveUserUseCase = new ReproveUserUseCase(this.userRepository);
    this.updateUserStatusUseCase = new UpdateUserStatusUseCase(this.userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(this.userRepository);

    // Initialize Action Use Cases
    this.createActionUseCase = new CreateActionUseCase(this.actionRepository);
    this.getActionByIdUseCase = new GetActionByIdUseCase(this.actionRepository);
    this.listActionsUseCase = new ListActionsUseCase(this.actionRepository);
    this.getActionsByCategoryUseCase = new GetActionsByCategoryUseCase(this.actionRepository);
    this.getActionsByUserUseCase = new GetActionsByUserUseCase(this.actionRepository);
    this.updateActionUseCase = new UpdateActionUseCase(this.actionRepository);
    this.deleteActionUseCase = new DeleteActionUseCase(this.actionRepository);

    // Initialize Challenge Use Cases
    this.createChallengeUseCase = new CreateChallengeUseCase(this.challengeRepository);
    this.getChallengeByIdUseCase = new GetChallengeByIdUseCase(this.challengeRepository);
    this.listChallengesUseCase = new ListChallengesUseCase(this.challengeRepository);
    this.getChallengesByCategoryUseCase = new GetChallengesByCategoryUseCase(this.challengeRepository);
    this.getChallengesByUserUseCase = new GetChallengesByUserUseCase(this.challengeRepository);
    this.updateChallengeUseCase = new UpdateChallengeUseCase(this.challengeRepository);
    this.deleteChallengeUseCase = new DeleteChallengeUseCase(this.challengeRepository);

    // Initialize Category Use Cases
    this.createCategoryUseCase = new CreateCategoryUseCase(this.categoryRepository);
    this.getCategoryByIdUseCase = new GetCategoryByIdUseCase(this.categoryRepository);
    this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepository);
    this.updateCategoryUseCase = new UpdateCategoryUseCase(this.categoryRepository);
    this.deleteCategoryUseCase = new DeleteCategoryUseCase(this.categoryRepository);

    // Initialize User Activity Use Cases
    this.createUserActivityUseCase = new CreateUserActivityUseCase(
      this.userActivityRepository,
      this.actionRepository,
      this.challengeRepository
    );
    this.updateUserActivityStatusUseCase = new UpdateUserActivityStatusUseCase(this.userActivityRepository);

    // Initialize Image Use Cases
    this.uploadImageUseCase = new UploadImageUseCase(this.imageRepository, this.fileStorage);
    this.getImageByIdUseCase = new GetImageByIdUseCase(this.imageRepository);
    this.updateImageUseCase = new UpdateImageUseCase(this.imageRepository, this.fileStorage);
    this.deleteImageUseCase = new DeleteImageUseCase(this.imageRepository, this.fileStorage);

    // Initialize Controllers - User Calebe
    this.createUserController = new CreateUserController(this.createUserUseCase);
    this.loginController = new LoginController(this.loginUserUseCase);
    this.meController = new MeController(this.meUseCase);
    this.updateUserController = new UpdateUserController(this.updateUserUseCase);
    this.getUserByIdController = new GetUserByExternalIdController(this.getUserByIdUseCase);
    this.sendRecoveryEmailController = new SendRecoveryEmailController(this.sendRecoveryEmailUseCase);
    this.updatePasswordController = new UpdatePasswordController(this.updatePasswordUseCase);

    // Initialize Controllers - User Admin
    this.createAdminController = new CreateAdminController(this.createAdminUseCase);
    this.listUsersController = new ListUsersController(this.listUsersUseCase);
    this.getUserByIdAdminController = new GetUserByExternalIdControllerAdmin(this.getUserByIdAdminUseCase);
    this.updateUserByAdminController = new UpdateUserControllerAdmin(this.updateUserByAdminUseCase);
    this.approveUserController = new ApproveUserController(this.approveUserUseCase);
    this.reproveUserController = new ReproveUserController(this.reproveUserUseCase);
    this.updateUserStatusController = new UpdateUserStatusController(this.updateUserStatusUseCase);
    this.deleteUserController = new DeleteUserController(this.deleteUserUseCase);

    // Initialize Controllers - Action
    this.createActionController = new CreateActionController(this.createActionUseCase);
    this.getActionByIdController = new GetActionByIdController(this.getActionByIdUseCase);
    this.listActionsController = new ListActionsController(this.listActionsUseCase);
    this.getActionsByCategoryController = new GetActionsByCategoryController(this.getActionsByCategoryUseCase);
    this.getActionsByUserController = new GetActionsByUserController(this.getActionsByUserUseCase);
    this.updateActionController = new UpdateActionController(this.updateActionUseCase);
    this.deleteActionController = new DeleteActionController(this.deleteActionUseCase);

    // Initialize Controllers - Challenge
    this.createChallengeController = new CreateChallengeController(this.createChallengeUseCase);
    this.getChallengeByIdController = new GetChallengeByIdController(this.getChallengeByIdUseCase);
    this.listChallengesController = new ListChallengesController(this.listChallengesUseCase);
    this.getChallengesByCategoryController = new GetChallengesByCategoryController(this.getChallengesByCategoryUseCase);
    this.getChallengesByUserController = new GetChallengesByUserController(this.getChallengesByUserUseCase);
    this.updateChallengeController = new UpdateChallengeController(this.updateChallengeUseCase);
    this.deleteChallengeController = new DeleteChallengeController(this.deleteChallengeUseCase);

    // Initialize Controllers - Category
    this.createCategoryController = new CreateCategoryController(this.createCategoryUseCase);
    this.getCategoryByIdController = new GetCategoryByIdController(this.getCategoryByIdUseCase);
    this.listCategoriesController = new ListCategoriesController(this.listCategoriesUseCase);
    this.updateCategoryController = new UpdateCategoryController(this.updateCategoryUseCase);
    this.deleteCategoryController = new DeleteCategoryController(this.deleteCategoryUseCase);

    // Initialize Controllers - User Activity
    this.createUserActivityController = new CreateUserActivityController(this.createUserActivityUseCase);
    this.updateUserActivityStatusController = new UpdateUserActivityStatusController(this.updateUserActivityStatusUseCase);

    // Initialize Controllers - Image
    this.uploadImageController = new UploadImageController(this.uploadImageUseCase);
    this.getImageByIdController = new GetImageByIdController(this.getImageByIdUseCase);
    this.updateImageController = new UpdateImageController(this.updateImageUseCase);
    this.deleteImageController = new DeleteImageController(this.deleteImageUseCase);
    this.listUserImagesController = new ListUserImagesController(this.imageRepository);

    // Initialize Middlewares
    this.authMiddleware = new AuthMiddleware(this.userRepository);
    this.authenticate = this.authMiddleware.authenticate.bind(this.authMiddleware);
  }
}
