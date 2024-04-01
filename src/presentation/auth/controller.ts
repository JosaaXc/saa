import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';
import { AttendanceModel, EnrollmentModel, StudentModel, SubjectModel, UserModel } from '../../data';

export class AuthController {

  // DI
  constructor(
    public readonly authService: AuthService,
  ) {}

  private handleError = (error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${ error }`);
    return res.status(500).json({ error: 'Internal server error' })
  } 


  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})


    this.authService.registerUser(registerDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }



  loginUser = (req: Request, res: Response) => {

    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})


    this.authService.loginUser(loginUserDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }

  deleteUser = async (req: Request, res: Response) => {
    
    const userId = req.params.userId;
    console.log(userId);
    const user = await UserModel.findById(userId);
    if (!user) {
      throw CustomError.notFound('User not found');
    }

    try{

      await Promise.all([
        SubjectModel.deleteMany({ user: userId }),
        StudentModel.deleteMany({ user: userId }),
        EnrollmentModel.deleteMany({ user: userId }),
        AttendanceModel.deleteMany({ user: userId }),
        UserModel.deleteOne({ _id: userId })
      ]);

      res.status(204).json({
        message: 'User deleted successfully'
      
      });

    } catch(error){
      throw CustomError.internalServer(`Internal server error: ${error}`);
  }
  }

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    
    this.authService.validateEmail( token )
      .then( () => res.json('Email was validated properly') )
      .catch( error => this.handleError(error, res) );

  }

  forgotPassword = async(req: Request, res: Response) => {

    const { email } = req.body;
    this.authService.sendResetPasswordEmail(email)
      .then( message => res.json(message))
      .catch( error => this.handleError(error, res));
  }

  resetPassword = (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    this.authService.resetPassword(token, newPassword)
      .then(() => res.json('Password was reset successfully'))
      .catch(error => this.handleError(error, res));
  }

}