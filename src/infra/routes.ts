import express, { Router } from 'express';
import { Container } from './container';
import { adminMiddleware } from './middlewares/admin-middleware';
import { userMiddleware } from './middlewares/user-middleware';
import { uploadMiddleware } from './controllers/image/upload-image-controller';
import { updateImageMiddleware } from './controllers/image/update-image-controller';

export function setupRoutes(container: Container): Router {
  const router = express.Router();

  // ============================================
  // PUBLIC ROUTES (No Authentication)
  // ============================================

  // Auth
  router.post('/auth/register', (req, res) => container.createUserController.handle(req, res));
  router.post('/auth/login', (req, res) => container.loginController.handle(req, res));
  router.post('/auth/refresh', (req, res) => container.refreshTokenController.handle(req, res));
  router.post('/auth/logout', container.authenticate, (req, res) => container.logoutController.handle(req, res));

  // ============================================
  // USER ROUTES (Authentication Required)
  // ============================================

  // User Profile
  router.get('/me', container.authenticate, (req, res) => container.meController.handle(req, res));
  router.put('/me', container.authenticate, (req, res) => container.updateUserController.handle(req, res));
  router.get('/users/:externalId', container.authenticate, (req, res) => container.getUserByIdController.handle(req, res));

  // Password Recovery
  router.post('/auth/recovery-email', (req, res) => container.sendRecoveryEmailController.handle(req, res));
  router.put('/auth/update-password', (req, res) => container.updatePasswordController.handle(req, res));

  // ============================================
  // USER ONLY ROUTES (USER role required)
  // ============================================

  // User Activities
  router.post('/user/activities', container.authenticate, userMiddleware, (req, res) => 
    container.createUserActivityController.handle(req, res)
  );

  // ============================================
  // ADMIN ROUTES (ADMIN role required)
  // ============================================

  // Admin - User Management
  router.post('/admin/admins', container.authenticate, adminMiddleware, (req, res) => 
    container.createAdminController.handle(req, res)
  );
  router.get('/admin/users', container.authenticate, adminMiddleware, (req, res) => 
    container.listUsersController.handle(req, res)
  );
  router.get('/admin/users/:externalId', container.authenticate, adminMiddleware, (req, res) => 
    container.getUserByIdAdminController.handle(req, res)
  );
  router.put('/admin/users/:externalId', container.authenticate, adminMiddleware, (req, res) => 
    container.updateUserByAdminController.handle(req, res)
  );
  router.put('/admin/users/:externalId/approve', container.authenticate, adminMiddleware, (req, res) => 
    container.approveUserController.handle(req, res)
  );
  router.put('/admin/users/:externalId/reprove', container.authenticate, adminMiddleware, (req, res) => 
    container.reproveUserController.handle(req, res)
  );
  router.put('/admin/users/:externalId/status', container.authenticate, adminMiddleware, (req, res) => 
    container.updateUserStatusController.handle(req, res)
  );
  router.delete('/admin/users/:externalId', container.authenticate, adminMiddleware, (req, res) => 
    container.deleteUserController.handle(req, res)
  );

  // Admin - Category Management
  router.post('/admin/categories', container.authenticate, adminMiddleware, (req, res) => 
    container.createCategoryController.handle(req, res)
  );
  router.put('/admin/categories/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.updateCategoryController.handle(req, res)
  );
  router.delete('/admin/categories/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.deleteCategoryController.handle(req, res)
  );

  // Admin - Action Management
  router.post('/admin/actions', container.authenticate, adminMiddleware, (req, res) => 
    container.createActionController.handle(req, res)
  );
  router.put('/admin/actions/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.updateActionController.handle(req, res)
  );
  router.delete('/admin/actions/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.deleteActionController.handle(req, res)
  );

  // Admin - Challenge Management
  router.post('/admin/challenges', container.authenticate, adminMiddleware, (req, res) => 
    container.createChallengeController.handle(req, res)
  );
  router.put('/admin/challenges/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.updateChallengeController.handle(req, res)
  );
  router.delete('/admin/challenges/:id', container.authenticate, adminMiddleware, (req, res) => 
    container.deleteChallengeController.handle(req, res)
  );

  // Admin - User Activity Status Update
  router.put('/admin/activities/:id/status', container.authenticate, adminMiddleware, (req, res) => 
    container.updateUserActivityStatusController.handle(req, res)
  );

  // ============================================
  // SHARED ROUTES (Authenticated, no role restriction)
  // ============================================

  // Categories
  router.get('/categories', container.authenticate, (req, res) => 
    container.listCategoriesController.handle(req, res)
  );
  router.get('/categories/:id', container.authenticate, (req, res) => 
    container.getCategoryByIdController.handle(req, res)
  );

  // Actions
  router.get('/actions', container.authenticate, (req, res) => 
    container.listActionsController.handle(req, res)
  );
  router.get('/actions/:id', container.authenticate, (req, res) => 
    container.getActionByIdController.handle(req, res)
  );
  router.get('/actions/category/:categoryId', container.authenticate, (req, res) => 
    container.getActionsByCategoryController.handle(req, res)
  );
  router.get('/actions/user/:userId', container.authenticate, (req, res) => 
    container.getActionsByUserController.handle(req, res)
  );

  // Challenges
  router.get('/challenges', container.authenticate, (req, res) => 
    container.listChallengesController.handle(req, res)
  );
  router.get('/challenges/:id', container.authenticate, (req, res) => 
    container.getChallengeByIdController.handle(req, res)
  );
  router.get('/challenges/category/:categoryId', container.authenticate, (req, res) => 
    container.getChallengesByCategoryController.handle(req, res)
  );
  router.get('/challenges/user/:userId', container.authenticate, (req, res) => 
    container.getChallengesByUserController.handle(req, res)
  );

  // Images
  router.post('/images', container.authenticate, uploadMiddleware, (req, res) => 
    container.uploadImageController.handle(req, res)
  );
  router.get('/images', container.authenticate, (req, res) => 
    container.listUserImagesController.handle(req, res)
  );
  router.get('/images/:id', container.authenticate, (req, res) => 
    container.getImageByIdController.handle(req, res)
  );
  router.put('/images/:id', container.authenticate, updateImageMiddleware, (req, res) => 
    container.updateImageController.handle(req, res)
  );
  router.delete('/images/:id', container.authenticate, (req, res) => 
    container.deleteImageController.handle(req, res)
  );

  return router;
}
