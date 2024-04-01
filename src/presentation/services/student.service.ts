import { AttendanceModel, EnrollmentModel, StudentModel } from "../../data";
import { CreateStudentDto, CustomError, PaginationDto, UpdateStudentDto, UserEntity } from "../../domain";


export class StudentService {
    constructor() { }

    async createStudent(createStudentDto: CreateStudentDto, user: UserEntity) {
        
        const matStudentExist = await StudentModel.findOne({ enrollment: createStudentDto.enrollment });
        if(matStudentExist) throw CustomError.badRequest('Enrollment already exists');
        
        try {
            
            
            const student = new StudentModel({ 
                ...createStudentDto, 
                user: user.id 
            })

            // console.log(student);
            await student.save();

            return student;

        }
        catch (error) {
            throw CustomError.internalServer(`{error}`);
        }

    }

    async getStudents( paginationDto: PaginationDto){

        const { page, limit } = paginationDto;

        try{
        
            
            const [total, students] = await Promise.all([
                StudentModel.countDocuments(),
                StudentModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('user')
                    //TODO: populate
            ]);
                
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/students?page=${page + 1}&limit=${limit}`,
                previous: (page - 1  > 0 ) ? `/api/students?page=${page - 1}&limit=${limit}`: null,
                 
                students: students, 
            }

        } catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }

    }

    updateStudent = async(id: string, updateStudentDto:UpdateStudentDto, user: UserEntity) => {
        const student = await StudentModel.findById(id);
        if(!student) throw CustomError.notFound('Student not found');
    
        if(student.user.toString() != user.id.toString()) throw CustomError.forbidden('You are not allowed to update this student');
    
        if(updateStudentDto.enrollment && student.enrollment !== updateStudentDto.enrollment) {
            const matStudentExist = await StudentModel.findOne({ enrollment: updateStudentDto.enrollment });
            if(matStudentExist) throw CustomError.badRequest('Enrollment already exists');
            student.enrollment = updateStudentDto.enrollment;
        }
    
        if(updateStudentDto.name) {
            student.name = updateStudentDto.name;
        }
    
        try{
            await student.save();
            return student;
        } catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }
    }

    deleteStudent = async(id: string, user: UserEntity) => {

        const student = await StudentModel.findById(id);
        if(!student) throw CustomError.notFound('Student not found');
    
        if(student.user.toString() != user.id.toString()) throw CustomError.forbidden('You are not allowed to delete this student');
    
        try{
            const enrollments = await EnrollmentModel.find({ student: id }); // Aquí está la corrección
            const enrollmentIds = enrollments.map(enrollment => enrollment._id);
            
            await Promise.all([
                EnrollmentModel.deleteMany({ student: id }),
                AttendanceModel.deleteMany({ enrollment: { $in: enrollmentIds } }),
                StudentModel.findByIdAndDelete(id),
            ]);
    
            return student;
        } catch(error){
        throw CustomError.internalServer(`Internal server error: ${error}`);
    }
    
    }
}