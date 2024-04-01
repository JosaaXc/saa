
import { Router } from 'express';
import { EnrollmentService } from '../services';
import { EnrollmentController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export class EnrollmentRoutes {

    static get routes(): Router {

        const router = Router();
        const enrollmentService = new EnrollmentService();
        const controller = new EnrollmentController(enrollmentService);
        
        // Definir las rutas

        router.get('/', controller.getEnrollment);
        router.post('/', [ AuthMiddleware.validateJWT ] , controller.createEnrollment);
        router.delete('/:id', [ AuthMiddleware.validateJWT ] , controller.deleteEnrollment);

        return router;


        }
}
