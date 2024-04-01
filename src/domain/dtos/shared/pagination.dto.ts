export class PaginationDto {
    private constructor(
        public page: number,
        public limit: number
    ){}

    static create( page: number = 1, limit: number = 10 ): [string?, PaginationDto?] {
        
        if(isNaN(page) || isNaN(limit)) return ['Invalid page or limit'];
        if(page <= 0 || limit <= 0) return ['Page and limit must be greater than 0'];
        
        return [undefined, new PaginationDto(page, limit)];
    }
}