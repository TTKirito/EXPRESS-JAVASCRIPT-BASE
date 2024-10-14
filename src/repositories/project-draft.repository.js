import { Repository } from './Repository'
import { ProjectDraft } from '../models/schema/project-draft.model';

class ProjectDraftRepository extends Repository {
  constructor() {
    super(ProjectDraft);
  }
}

export { ProjectDraftRepository };
