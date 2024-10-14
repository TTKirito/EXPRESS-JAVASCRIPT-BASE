import { Repository } from './Repository'
import { Project } from '../models/schema/project.model';

class ProjectRepository extends Repository {
  constructor() {
    super(Project);
  }

   /**
  *
  * @param {*} objectQuery
  * @param {*} option
  */
    getListDataAndCountByCondition(objectQuery, option) {
      return this.model.findAndCountAll({
        where: objectQuery,
        distinct: true,
        ...option
      })
    }
}

export { ProjectRepository };
