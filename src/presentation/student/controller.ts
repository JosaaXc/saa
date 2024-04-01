import { Request, Response } from 'express';
import { CreateStudentDto, CustomError, PaginationDto, UpdateStudentDto } from '../../domain';
import { StudentService } from '../services';


export class StudentController {

  constructor(private studentService: StudentService) {}

  private handleError = (error: unknown, res: Response ) => {
      if ( error instanceof CustomError ) {
        return res.status(error.statusCode).json({ error: error.message });
      }
  
      console.log(`${ error }`);
      return res.status(500).json({ error: 'Internal server error' })
  } 

  createStudent = (req: Request, res: Response) =>{
    const [error, createStudentDto] = CreateStudentDto.create(req.body);
    if (error) return this.handleError(error, res);
      
    this.studentService.createStudent( createStudentDto!, req.body.user )
      .then( student => res.status(201).json(student) )
      .catch( error => this.handleError(error, res) ); 
  }

  getStudent = (req: Request, res: Response) => {

    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create( +page, +limit);
    if(error) return this.handleError(error, res);


    this.studentService.getStudents( paginationDto! )
      .then( students => res.status(200).json(students))
      .catch( error => this.handleError(error, res));
      
    }

  updateStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateStudentDto] = UpdateStudentDto.update(req.body);
    if (error) return this.handleError(error, res);
    
    this.studentService.updateStudent(id, updateStudentDto!, req.body.user)
        .then( student => res.status(200).json(student))
        .catch( error => this.handleError(error, res));
  }   
    
  deleteStudent = async(req: Request, res: Response) => {
        
      const { id } = req.params;
      this.studentService.deleteStudent(id, req.body.user)
        .then( (student) => res.status(204).send(student))
        .catch( error => this.handleError(error, res));
  }

}