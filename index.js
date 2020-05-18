class APIFeatures {

    constructor(query, queryString, model) {

        this.query = query;
        this.queryString = queryString;
        this.model = model;

        this._excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];

    }

    setExcludedFields(...args) {
        const arr = Array.from(...args);
        if (arr && arr.length) this.excludedFields = arr;
    }

    filter(options = {}) {
        const queryCopy = Object.assign({}, this.queryString);
        this._excludedFields.forEach(f => delete queryCopy[f]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr.replace(/\b(gt|lt)e?\b/gi, match => `$${match}`)

        queryStr = JSON.parse(queryStr);
        if (options.fullTextSearch) queryStr = { ...queryStr, $text: { $search: this.queryString['search'] }}

        this.query = this.query.find(queryStr)
        return this;
    }

    limitFields() {
        const { fields } = this.queryString
        let select = '-__v';
        if (fields) {
            select = fields
            .replace(/' '/g, '')
            .split(',')
            .join(' ')
        } 
        
        this.query = this.query.select(select);
        return this;
    }

    sort() {
        const {sort} = this.queryString;
        let sortable = '-created_at';
        if (sort) sortable = sort.split(',').join(' ');
        this.query = this.query.sort(sortable);
        return this;
    }

    paginator(limit=5) {
        const page = this.queryString.page * 1 || 1;
        this.limit = this.queryString.limit * 1 || limit;

        const skip = page > 1 ? ((page - 1) * this.limit) : 0;

    
        this.query = this.query.skip(skip).limit(this.limit)
        return this;
    }

    async getPaginatorConstrols() {
        if (this.model) {
            const docsCount = await this.model.countDocuments();

            // Page: Previous [1] [x] [3] Next
            const limit = this.queryString.limit * 1 || this.limit;
            
            const page = this.queryString.page * 1 || 1;
            const pages = Math.ceil(docsCount / limit);


            return {
                total: docsCount,
                limit,
                page,
                pages,
                hasNext: page < pages,
                hasPrevious: page > 1
            }
        }

        return {};
    }

}

module.exports = APIFeatures