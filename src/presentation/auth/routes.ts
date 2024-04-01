import { envs } from './../../config';
import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';




export class Authroutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );

    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.post('/register',[  AuthMiddleware.validateJWT, AuthMiddleware.isAdmin ] ,controller.registerUser );
    router.post('/forgot-password', controller.forgotPassword );
    router.post('/reset-password/:token', controller.resetPassword );
    router.delete('/delete/:userId',[ AuthMiddleware.validateJWT ] ,controller.deleteUser );
    
    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }


}

