import { Repository } from './Repository'
import { Understand } from '../models/schema/understand.model';

class UnderstandRepository extends Repository {
  constructor() {
    super(Understand);
  }
}

export { UnderstandRepository };
