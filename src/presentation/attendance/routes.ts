
import { Router } from 'express';
import { AttendanceService, EnrollmentService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AttendanceController } from './controller';


export class AttendanceRoutes {

    static get routes(): Router {

        const router = Router();
        const attendanceService = new AttendanceService(); 
        const controller = new AttendanceController(attendanceService);
        
        // Definir las rutas

        router.get('/', controller.getAttendances);
        router.post('/', [ AuthMiddleware.validateJWT ] ,controller.createAttendances);
        router.patch('/', [ AuthMiddleware.validateJWT ] ,controller.editAttendance );

        return router;


        }
}
