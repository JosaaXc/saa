import { Validators } from "../../../config";


export class CreateEnrollmentDto {
    constructor(
        readonly student: string,
        readonly subject: string,
    ){}

    static create( props: { [key: string]: any }): [string?, CreateEnrollmentDto?] {
        const { student, subject } = props;
        if (!student) return ['Student is required'];
        if(!Validators.isMongoId(student)) return ['Student id is not invalid'];
        if (!subject) return ['Subject is required'];
        if(!Validators.isMongoId(subject)) return ['Subject id is not invalid'];
        return [undefined, new CreateEnrollmentDto(student, subject)];
    }
}