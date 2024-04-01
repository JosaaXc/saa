import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';




export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService,
  ) {}


  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash( registerUserDto.password );
      
      await user.save();

      // Email de confirmación
      // await this.sendEmailValidationLink( user.email );

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id, role: user.role });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: userEntity, 
        token: token,
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }

  }


  public async loginUser( loginUserDto: LoginUserDto ) {

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not exist');

    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');


    const { password, ...userEntity} = UserEntity.fromObject( user );
    
    const token = await JwtAdapter.generateToken({ id: user.id, role: user.role });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }


  // private sendEmailValidationLink = async( email: string ) => {

  //   const token = await JwtAdapter.generateToken({ email });
  //   if ( !token ) throw CustomError.internalServer('Error getting token');

  //   const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
  //   const html = `
  //     <h1>Validate your email</h1>
  //     <p>Click on the following link to validate your email</p>
  //     <a href="${ link }">Validate your email: ${ email }</a>
  //   `;

  //   const options = {
  //     to: email,
  //     subject: 'Validate your email',
  //     htmlBody: html,
  //   }

  //   const isSent = await this.emailService.sendEmail(options);
  //   if ( !isSent ) throw CustomError.internalServer('Error sending email');

  //   return true;
  // }


  public validateEmail = async(token:string) => {

    const payload = await JwtAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  }

  public async sendResetPasswordEmail(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.notFound('User not found');
  
    const resetPasswordToken = await JwtAdapter.generateToken({ id: user.id });
  
    const link = `${ envs.WEBSERVICE_URL }/auth/reset-password/${ resetPasswordToken }`;
    const html = `
      <h1>Change your password</h1>
      <p>Click on the following link to change your password </p>
      <a href="${ link }">Change your password: ${ email }</a>
      <p>If you didn't request this, you can ignore this email</p>
    `;

    console.log(link);

    const options = {
      to: email,
      subject: 'Change your password',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return { message: 'Reset password email sent successfully.' };
  }

  public async resetPassword(token: string, newPassword: string) {

    if (!newPassword) throw CustomError.badRequest('New password is required');

    const payload = await JwtAdapter.validateToken(token)
    const { id } = payload as { id: string };
    if (!payload) throw CustomError.badRequest('Invalid token');
  
    const user = await UserModel.findById(id);
    if (!user) throw CustomError.notFound('User not found');
  
    try{

      user.password = await bcryptAdapter.hash(newPassword);
      await user.save();

      return { message: 'Password changed successfully.' };
    
    }catch(error){
      throw CustomError.internalServer(`Password not changed: ${error}`);
    }
  
  }


}