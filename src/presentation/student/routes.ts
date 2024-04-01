import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StudentController } from './controller';
import { StudentService } from '../services';

export class StudentRoutes {

    static get routes(): Router {

        const router = Router();
        const studentService = new StudentService();
        const controller = new StudentController(studentService);
        
        // Definir las rutas

        router.get('/', controller.getStudent);
        router.post('/', [ AuthMiddleware.validateJWT] , controller.createStudent);
        router.patch('/:id', [ AuthMiddleware.validateJWT] , controller.updateStudent);
        router.delete('/:id', [ AuthMiddleware.validateJWT] , controller.deleteStudent);

        return router;


        }
}
