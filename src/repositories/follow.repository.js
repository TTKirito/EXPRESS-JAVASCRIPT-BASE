import { Repository } from './Repository'
import { Follow } from '../models/schema/follow.model';

class FollowRepository extends Repository {
  constructor() {
    super(Follow);
  }
}

export { FollowRepository };
