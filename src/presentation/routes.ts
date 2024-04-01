import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { SubjectRoutes } from './subject/routes';
import { StudentRoutes } from './student/routes';
import { EnrollmentRoutes } from './enrollment/routes';
import { AttendanceRoutes } from './attendance/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/subjects', SubjectRoutes.routes );
    router.use('/api/students', StudentRoutes.routes );
    router.use('/api/enrollments', EnrollmentRoutes.routes );
    router.use('/api/attendances', AttendanceRoutes.routes );


    return router;
  }


}

