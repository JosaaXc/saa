import { Validators } from "../../../config";


export class CreateStudentDto {
    
    private constructor(
        public readonly name: string,
        public readonly enrollment: string, 
        public readonly user: string
        ){}

        static create( props: { [key: string]: any }): [string?, CreateStudentDto?] {
            
            const { name, enrollment, user } = props;
            if (!name) return ['Name is required'];
            if (!enrollment) return ['Enrollment is required'];
            if (!user) return ['User is required'];
            // if( !Validators.isMongoId(user) ) return ['Invalid user id'];
            // console.log('CreateStudentDto.create', name, enrollment, user);
            return [undefined, new CreateStudentDto(name, enrollment, user)];

        }

}
