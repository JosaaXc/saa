import { CustomError, PaginationDto } from "../../domain";
import { EnrollmentService } from "../services";
import { Request, Response } from 'express';
import { CreateEnrollmentDto } from '../../domain/dtos/enrollment/create-enrollment.dto';

export class EnrollmentController {
    constructor(
        private readonly enrollmentService: EnrollmentService,
    ) {}
    
    private handleError = (error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
          return res.status(error.statusCode).json({ error: error.message });
        }
    
        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
    } 

    createEnrollment = async (req: Request, res: Response) => {
        const [error, enrollmentDto] = CreateEnrollmentDto.create(req.body);
        if(error) return this.handleError(error, res);

        this.enrollmentService.createEnrollment(enrollmentDto!, req.body.user)
            .then( enrollment => res.status(201).json(enrollment))
            .catch( error => this.handleError(error, res));
    }
    
    getEnrollment = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create( +page, +limit);
        if(error) return this.handleError(error, res);
  
  
        this.enrollmentService.getEnrollments( paginationDto! )
        .then( enrollments => res.status(200).json(enrollments))
        .catch( error => this.handleError(error, res));
    }

    deleteEnrollment = async(req: Request, res: Response) => {
            
            const { id } = req.params;
            this.enrollmentService.deleteEnrollment(id, req.body.user)
            .then( (enrollment) => res.status(204).send(enrollment))
            .catch( error => this.handleError(error, res));
        
        }
}