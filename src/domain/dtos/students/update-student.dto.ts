export class UpdateStudentDto {
    
    private constructor(
        public readonly name?: string,
        public readonly enrollment?: string, 
        ){}

        static update( props: { [key: string]: any }): [string?, UpdateStudentDto?] {
            
            const { name, enrollment } = props;
            return [undefined, new UpdateStudentDto(name, enrollment)];

        }

}