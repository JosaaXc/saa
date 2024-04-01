import { Router } from 'express';
import { SubjectController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SubjectService } from '../services/subject.service';

export class SubjectRoutes {

    static get routes(): Router {

        const router = Router();
        const subjectSevice = new SubjectService();
        const controller = new SubjectController(subjectSevice);
        
        // Definir las rutas

        router.get('/', controller.getSubject);
        router.post('/', [ AuthMiddleware.validateJWT] ,controller.createSubject);
        router.patch('/:id', [ AuthMiddleware.validateJWT] , controller.updateSubject);
        router.delete('/:id', [ AuthMiddleware.validateJWT] ,controller.deleteSubject);

        return router;


        }
}
