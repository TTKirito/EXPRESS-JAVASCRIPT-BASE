import { Repository } from './Repository'
import { TokenMetrics } from '../models/schema/token-metrics.model';

class TokenMetricsRepository extends Repository {
  constructor() {
    super(TokenMetrics);
  }
}

export { TokenMetricsRepository };
