export default class Category {
  id: number | null;
  name: string;
  points: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    points: number,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = null;
    this.name = name;
    this.points = points;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
