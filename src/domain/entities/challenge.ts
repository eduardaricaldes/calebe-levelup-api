export default class Challenge {
  id: number | null;
  name: string;
  date: Date;
  description: string | null;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    date: Date,
    description: string | null,
    categoryId: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = null;
    this.name = name;
    this.date = date;
    this.description = description;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
