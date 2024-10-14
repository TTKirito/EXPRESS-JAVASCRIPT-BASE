import { Repository } from './Repository'
import { SystemConfig } from '../models/schema/system-config.model';

class SystemConfigRepository extends Repository {
  constructor() {
    super(SystemConfig);
  }
}

export { SystemConfigRepository };
