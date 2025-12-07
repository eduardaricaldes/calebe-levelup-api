export default class Action {
  id: number | null;
  name: string;
  date: Date;
  description: string | null;
  categoryId: number;
  created_at: Date;
  updated_at: Date;

  constructor(
    name: string,
    date: Date,
    description: string | null,
    categoryId: number,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = null;
    this.name = name;
    this.date = date;
    this.description = description;
    this.categoryId = categoryId;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

}