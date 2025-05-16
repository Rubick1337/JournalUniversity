class MetaDataDto {
    constructor({ 
        total,
        totalPage,
        limit,
        page,
    }) {
        this.total = total;
        this.totalPage = totalPage;
        this.limit = limit;
        this.page = page;
    }
}

module.exports = MetaDataDto;
