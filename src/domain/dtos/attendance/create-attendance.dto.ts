import { Validators } from "../../../config";

export class CreateAttendanceDto {
    constructor(
        public readonly enrollment: string,
        public readonly attendance: string,
    ){}

    static create( object: { [key: string] : any }):[string?, CreateAttendanceDto?]{

        const { enrollment, attendance } = object;

        if(!enrollment) return ['Enrollment is required'];
        if(!Validators.isMongoId(enrollment)) return ['Enrollment id is invalid'];
        if(!attendance) return ['Attendance is required'];
        // attendance es un enum de strigns con full, half, quarter, none
        if(!['full', 'half', 'quarter', 'none'].includes(attendance)) return ['Attendance is invalid'];

        return [undefined, new CreateAttendanceDto(enrollment, attendance)];
        
    }
}