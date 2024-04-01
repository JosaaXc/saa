import { AttendanceModel, EnrollmentModel, SubjectModel } from "../../data";
import { CreateSubjectDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class SubjectService{
    //DI
    constructor(){}

    createSubject = async( createSubjectDto: CreateSubjectDto, user: UserEntity)=>{
        
        const subjectExist = await SubjectModel.findOne({ name: createSubjectDto.name });
        if(subjectExist) throw CustomError.badRequest('Subject already exists');
        try{
            const subject = new SubjectModel({
                ...createSubjectDto,
                user: user.id
            });

            await subject.save();
            return {
                id: subject.id,
                name: subject.name,
                period: subject.period,
                endTime: subject.endTime,
                daysGiven: subject.daysGiven,
            }

        }catch(error){
            throw CustomError.internalServer(`${error}`);

    }

    }
    
    getSubjects = async( paginationDto: PaginationDto) => {

        const { page, limit } = paginationDto;

        try{
            // Código bloqueante, mala práctica 
            // const total = await SubjectModel.countDocuments();
            // const subjects = await SubjectModel.find()
            //     .skip( (page - 1) * limit )
            //     .limit( limit );
            
            const [total, subjects] = await Promise.all([
                SubjectModel.countDocuments(),
                SubjectModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('user', ['name', 'email'])
            ]);
                
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/subjects?page=${page + 1}&limit=${limit}`,
                previous: (page - 1  > 0 ) ? `/api/subjects?page=${page - 1}&limit=${limit}`: null,
                 
                subjects: subjects.map( subject => ({
                    id: subject.id,
                    name: subject.name,
                    period: subject.period,
                    endTime: subject.endTime,
                    daysGiven: subject.daysGiven,
                })),
            }

        } catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }

    }

    deleteSubject = async(id: string, user: UserEntity) => {
        const subject = await SubjectModel.findById(id);
        if(!subject) throw CustomError.notFound('Subject not found');
        if(subject.user.toString() !== user.id.toString()) throw CustomError.forbidden('You are not allowed to delete this subject');

        const enrollments = await EnrollmentModel.find({ subject: id });
        const enrollmentIds = enrollments.map(enrollment => enrollment._id);
        
        try{

            await Promise.all([
                EnrollmentModel.deleteMany({ subject: id }),
                AttendanceModel.deleteMany({ enrollment: { $in: enrollmentIds } }),
                SubjectModel.findByIdAndDelete(id),
            ]);

        return subject;

        }catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }
    }

    updateSubject = async(id: string, createSubjectDto: CreateSubjectDto, user: UserEntity) => {
        const subject = await SubjectModel.findById(id);
        if(!subject) throw CustomError.notFound('Subject not found');
        if(subject.name === createSubjectDto.name) throw CustomError.badRequest('Subject already exists');
        if(subject.user.toString() !== user.id.toString()) throw CustomError.forbidden('You are not allowed to edit this subject');

        try{
            const updatedSubject = await SubjectModel.findByIdAndUpdate(id, createSubjectDto, { new: true });
            return {
                id: id,
                name: updatedSubject!.name,
                period: updatedSubject!.period,
                endTime: updatedSubject!.endTime,
                daysGiven: updatedSubject!.daysGiven,
            }

        }catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }
    }
}