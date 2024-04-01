import { Validators } from "../../config";
import { AttendanceModel, EnrollmentModel, StudentModel, SubjectModel } from "../../data";
import { CreateEnrollmentDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class EnrollmentService {
    constructor() {}
    
    createEnrollment = async ( createEnrollmentDto: CreateEnrollmentDto, user: UserEntity ) => {
        
        const subject = SubjectModel.findById(createEnrollmentDto.subject);
        if(!subject) throw CustomError.notFound('Subject not found');

        const student = await StudentModel.findById(createEnrollmentDto.student);
        if(!student) throw CustomError.notFound('Student not found');

        const existingEnrollment = await EnrollmentModel.findOne({
            student: createEnrollmentDto.student,
            subject: createEnrollmentDto.subject,
        });

        if (existingEnrollment) {
            throw CustomError.badRequest('Enrollment already exists');
        }

        try{
            const enrollment = new EnrollmentModel({
                ...createEnrollmentDto,
                user: user.id,
            });
    
            await enrollment.save();
            return enrollment;
        }
        catch(error){
            throw CustomError.internalServer(`${error}`);
        }

    }

    async getEnrollments( paginationDto: PaginationDto){

        const { page, limit } = paginationDto;

        try{
        
            
            const [total, enrollments] = await Promise.all([
                EnrollmentModel.countDocuments(),
                EnrollmentModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('subject')
                    .populate('student')
                    //TODO: populate
            ]);
                
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/enrollments?page=${page + 1}&limit=${limit}`,
                previous: (page - 1  > 0 ) ? `/api/enrollments?page=${page - 1}&limit=${limit}`: null,
                 
                enrollments: enrollments, 
            }

        } catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }

    }

    deleteEnrollment = async(id: string, user: UserEntity) => {
        
        if(!Validators.isMongoId(id)) throw CustomError.badRequest('Invalid id');
        const enrollment = await EnrollmentModel.findById(id); 
        if(!enrollment) throw CustomError.notFound('Enrollment not found');


        if(enrollment.user.toString() !== user.id.toString()) {
            throw CustomError.forbidden('You do not have permission to delete this enrollment');
        }

        try {

            await Promise.all([
                EnrollmentModel.deleteOne({ _id: id }),
                AttendanceModel.deleteMany({ enrollment: id }),
            ]);

            return enrollment;

        }catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }
        
    }

}
