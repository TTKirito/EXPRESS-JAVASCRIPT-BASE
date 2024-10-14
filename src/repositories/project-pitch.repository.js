import { ProjectPitch } from '../models/schema/project-pitch.model';
import { Repository } from './Repository';

class ProjectPitchRepository extends Repository {
  constructor() {
    super(ProjectPitch);
  }
}

export { ProjectPitchRepository };
