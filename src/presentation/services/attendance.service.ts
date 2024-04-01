import { AttendanceModel, EnrollmentModel } from '../../data';
import { CreateAttendanceDto, CustomError, PaginationDto, UserEntity } from '../../domain';


export class AttendanceService {
    constructor(){}

    createAttendances = async(createAttendanceDtos: CreateAttendanceDto[], user: UserEntity) => {
        const createPromises = createAttendanceDtos.map(async (createAttendanceDto) => {
            const enrollment = await EnrollmentModel.findById(createAttendanceDto.enrollment);
            if(!enrollment) throw CustomError.notFound('Enrollment not found');
    
            if(enrollment.user.toString() !== user.id.toString()) {
                throw CustomError.forbidden('You do not have permission to take attendance for this enrollment');
            }
    
            const newAttendance = new AttendanceModel({
                ...createAttendanceDto,
                user: user.id,
            });
    
            return newAttendance.save();
        });
    
        const attendances = await Promise.all(createPromises);
    
        return attendances;
    }

    getAttendance  = async( paginationDto: PaginationDto) => {

        const { page, limit } = paginationDto;

        try{
        
            
            const [total, attendances] = await Promise.all([
                AttendanceModel.countDocuments(),
                AttendanceModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('enrollment')
                    //TODO: populate
            ]);
                
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/attendances?page=${page + 1}&limit=${limit}`,
                previous: (page - 1  > 0 ) ? `/api/attendances?page=${page - 1}&limit=${limit}`: null,
                 
                attendances: attendances, 
            }

        } catch(error){
            throw CustomError.internalServer(`Internal server error: ${error}`);
        }

    }

    editAttendances = async(createAttendanceDtos: CreateAttendanceDto[], user: UserEntity) => {
        const updatePromises = createAttendanceDtos.map(async (createAttendanceDto) => {
            const enrollment = await EnrollmentModel.findById(createAttendanceDto.enrollment);
            if(!enrollment) throw CustomError.notFound('Enrollment not found');
    
            if(enrollment.user.toString() !== user.id.toString()) {
                throw CustomError.forbidden('You do not have permission to edit attendance for this enrollment');
            }
    
            return AttendanceModel.updateMany(
                { enrollment: createAttendanceDto.enrollment, user: user.id },
                { $set: { attendance: createAttendanceDto.attendance as "full" | "half" | "quarter" | "none" } }
            );
        });
    
        await Promise.all(updatePromises);
    
        const attendances = await AttendanceModel.find({ user: user.id, enrollment: { $in: createAttendanceDtos.map(dto => dto.enrollment) } });
    
        return attendances;
    }

} 