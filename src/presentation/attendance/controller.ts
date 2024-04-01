
import { Request, Response } from 'express';
import { AttendanceService } from '../services';
import { CreateAttendanceDto, CustomError, PaginationDto } from '../../domain';

export class AttendanceController {
    constructor(
        private readonly attendanceService: AttendanceService,
    ){}

    private handleError = (error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
          return res.status(error.statusCode).json({ error: error.message });
        }
    
        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
    } 

    createAttendances = (req: Request, res: Response) => {
        const attendances = req.body.attendances;
        const errors = [];
        const createAttendanceDtos: CreateAttendanceDto[] = [];
    
        for (const attendance of attendances) {
            const [error, createAttendanceDto] = CreateAttendanceDto.create(attendance);
            if (error) errors.push(error);
            else if (createAttendanceDto) createAttendanceDtos.push(createAttendanceDto);
        }
    
        if (errors.length > 0) return this.handleError(errors, res);
    
        this.attendanceService.createAttendances(createAttendanceDtos, req.body.user)
            .then(attendances => res.status(201).json(attendances))
            .catch(error => this.handleError(error, res));
    }

    getAttendances = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create( +page, +limit);
        if(error) return this.handleError(error, res);
  
  
        this.attendanceService.getAttendance( paginationDto! )
        .then( attendances => res.status(200).json(attendances))
        .catch( error => this.handleError(error, res));
    }

    editAttendance = (req: Request, res: Response) => {
        const attendances = req.body.attendances;
        const errors = [];
        const createAttendanceDtos: CreateAttendanceDto[] = [];
    
        for (const attendance of attendances) {
            const [error, createAttendanceDto] = CreateAttendanceDto.create(attendance);
            if (error) errors.push(error);
            else if (createAttendanceDto) createAttendanceDtos.push(createAttendanceDto);
        }
    
        if (errors.length > 0) return this.handleError(errors, res);
    
        this.attendanceService.editAttendances(createAttendanceDtos, req.body.user)
            .then(attendances => res.status(201).json(attendances))
            .catch(error => this.handleError(error, res));
    }

}