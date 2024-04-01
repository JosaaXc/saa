import { Request, Response } from 'express';
import { CreateSubjectDto, CustomError, PaginationDto } from '../../domain';
import { SubjectService } from '../services/subject.service';

export class SubjectController { 

    //DI
    constructor(
      private readonly subjectService: SubjectService
    ){}


    private handleError = (error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
          return res.status(error.statusCode).json({ error: error.message });
        }
    
        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
      } 

    createSubject = (req: Request, res: Response) => {
      const [error, createSubjectDto] = CreateSubjectDto.create(req.body);
      if(error) return this.handleError(error, res);

      this.subjectService.createSubject(createSubjectDto!, req.body.user)
        .then( subject => res.status(201).json(subject))
        .catch( error => this.handleError(error, res));

    }

    getSubject = async(req: Request, res: Response) => {

      const { page = 1, limit = 10 } = req.query;
      const [error, paginationDto] = PaginationDto.create( +page, +limit);
      if(error) return this.handleError(error, res);


      this.subjectService.getSubjects( paginationDto! )
      .then( subjects => res.status(200).json(subjects))
      .catch( error => this.handleError(error, res));
    }

    deleteSubject = async(req: Request, res: Response) => {
      const { id } = req.params;
      this.subjectService.deleteSubject(id, req.body.user)
        .then( (subject) => res.status(204).send(subject))
        .catch( error => this.handleError(error, res));
    }

    updateSubject = async(req: Request, res: Response) => {
      const { id } = req.params;
      const [error, createSubjectDto] = CreateSubjectDto.create(req.body);
      if(error) return this.handleError(error, res);

      this.subjectService.updateSubject(id, createSubjectDto!, req.body.user)
        .then( (subject) => res.status(200).json(subject))
        .catch( error => this.handleError(error, res));
    }
    
} 
