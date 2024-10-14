import { Repository } from './Repository'
import { FeaturedToken } from '../models/schema/featured-token.model';

class FeaturedTokenRepository extends Repository {
  constructor() {
    super(FeaturedToken);
  }
}

export { FeaturedTokenRepository };
