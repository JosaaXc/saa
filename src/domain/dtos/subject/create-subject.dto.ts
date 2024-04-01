export class CreateSubjectDto {
    private constructor(
        public readonly name: string,
        public readonly period: number,
        public readonly endTime: string,
        public readonly daysGiven: string[],
        public readonly user: string,
    ){}

    static create( object: { [key: string] : any }):[string?, CreateSubjectDto?]{

        const { name, period, endTime, daysGiven, user } = object;

        if(!name) return ['Name is required'];
        if(!period) return ['Period is required'];
        if(!endTime) return ['Endtime is required'];
        if(!daysGiven) return ['DaysGiven is required'];
        if(daysGiven.length === 0) return ['DaysGiven must have at least one element'];
        if(!user) return ['User is required'];

        return [undefined, new CreateSubjectDto(name, period, endTime, daysGiven, user)];
        
    }
}
