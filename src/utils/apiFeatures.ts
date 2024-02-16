import mongoose, { Document, Query } from 'mongoose';

interface ApiFeaturesQuery {
  page?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  [key: string]: any;
}

export class ApiFeatures<T> {
// In ApiFeatures class
  public mongooseQuery: mongoose.Query<T[], T, {}, T, 'find'>;
  private queryString: ApiFeaturesQuery;
  private page: number;

  constructor(mongooseQuery: mongoose.Query<T[], T, {}, T, 'find'>, queryString: ApiFeaturesQuery) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.page = 1; 

  }

  // 1- pagination.
paginate() {
  let page = this.queryString.page ? parseInt(this.queryString.page.toString()) : 1;
  if (page <= 0) page = 1;
  const skip = (page - 1) * 5;
  this.page = page;
  this.mongooseQuery.skip(skip).limit(8);
  return this;
}



  // 2- filtration.
  filter() {
    const filterObj: Record<string, any> = { ...this.queryString };
    const excludedQuery: string[] = ['page', 'sort', 'fields', 'keyword'];

    excludedQuery.forEach((q) => {
      delete filterObj[q];
    });

    let filterString = JSON.stringify(filterObj);
    filterString = filterString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    const parsedFilter = JSON.parse(filterString);

    this.mongooseQuery.find(parsedFilter);
    return this;
  }

  // 3- sort.
  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  // 4- search.
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  // 5- selected fields.
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
