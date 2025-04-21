class MetaDataDto {
    constructor({ 
        currentPage,
        perPage,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage
    }) {
        this.total = totalItems;
        this.totalPage = totalPages;
        this.limit = perPage;
        this.page = currentPage;
    }
}

module.exports = MetaDataDto;
