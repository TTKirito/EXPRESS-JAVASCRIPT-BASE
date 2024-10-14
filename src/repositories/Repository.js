'use strict';

class Repository {

  constructor(model) {
    this.model = model;
  }

  /**
   *
   * @param {Number} id
   * @param {Object} include
   * @param {Object} attributes
   */
  async getById(id, { include = [], attributes = {} } = {}) {
    try {
      let model = await this.model.findByPk(id, {
        include,
        attributes
      });

      if (model) {
        model = model.get({ plain: true });
      }

      return model;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Object} condition object to find
   * @param {Object} include
   * @param {Object} attributes
   * @param {Array} order
   */
  async getOne(condition, { include = [], attributes = {}, order = [] } = {}) {
    try {
      if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
        condition.deleted = false;
      }

      let model = await this.model.findOne({
        where: condition,
        include,
        attributes,
        order
      });

      if (model) {
        model = model.get({ plain: true });
      }

      return model;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Number} page
   * @param {Number} limit
   * @param {Object} condition
   * @param {Object[]} include
   * @param {Array} attributes
   * @param {Object[]} order
   */
  getAll({ page, limit, condition = {}, include = [], group = [], attributes, order = [['created_at', 'DESC']], raw = false }) {
    if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
      condition.deleted = false;
    }

    /** Option to query */
    const options = {
      order,
      where: condition,
      include,
      distinct: true,
      raw,
    };

    if (group.length > 0) {
      options.group = group;
    }

    if (attributes) {
      options.attributes = attributes;
    }

    if (limit && page) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    return this.model.findAndCountAll(options);
  }

  /**
   *
   * @param {Object} condition
   * @param {Object[]} include
   * @param {Object[]} order
   */
  findAll({ condition = {}, include = [], group = [], attributes, raw = false, order = null, limit = null } = {}) {
    if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
      condition.deleted = false;
    }

    /** Option to query */
    const options = {
      order,
      where: condition,
      include,
      distinct: true,
      raw
    };

    if (group.length > 0) {
      options.group = group;
    }

    if (attributes) {
      options.attributes = attributes;
    }

    if (+limit) {
      options.limit = +limit;
    }

    return this.model.findAll(options);
  }

  /**
   *
   * @param {Number} id
   * @param {Object} attributes
   */
  async updateById(id, attributes, transaction = null) {
    try {
      let foundModel = await this.model.findByPk(id);

      /** Check for updated_at property exist on model, then add updated_at to update attributes */
      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = new Date();
      }

      // Check model exist
      if (foundModel) {
        foundModel = await foundModel.update(attributes, { transaction });
        foundModel = foundModel.get({ plain: true });
      }

      return foundModel;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Object} attributes attributes to be updated
   * @param {Object} condition Condition to find
   */
  async updateOne(attributes, condition, transaction = null) {
    try {
      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = new Date();
      }

      let foundModel = await this.model.findOne({ where: condition });

      // Check model exist
      if (foundModel) {
        foundModel = await foundModel.update(attributes, { transaction });
        foundModel = foundModel.get({ plain: true });
      }

      return foundModel;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Object} attributes attributes to be updated
   * @param {Object} model model to update
   * @param {Object} condition Condition to find
   */
  async updateOneByModel(model, attributes, transaction = null) {
    try {
      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = new Date();
      }

      // Check model exist
      if (model) {
        model = await model.update(attributes, { transaction })
        model = model.get({ plain: true });
      }

      return model;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Object} condition Condition to find
   * @param {Object} attributes attributes to be updated
   */
  async update(condition, attributes, transaction = null) {
    try {
      /** Check for updated_at property exist on model, then add updated_at to update attributes */
      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = new Date();
      }

      await this.model.update(attributes, { where: condition, transaction });
      const foundModels = await this.model.findAll({ where: condition, raw: true });

      return foundModels;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Number} id
   */
  deleteById(id, transaction = null, softDelete = true) {
    if (softDelete && this.model.rawAttributes && this.model.rawAttributes.deleted) {
      return this.updateOne({ deleted: true }, { id }, transaction);
    }

    return this.model.destroy({
      where: {
        id
      },
      transaction
    });
  }

  /**
   *
   * @param {Object} condition
   * @param {any} transaction
   * @param {Boolean} softDelete
   */
  delete(condition, transaction = null, softDelete = true) {
    if (softDelete && this.model.rawAttributes && this.model.rawAttributes.deleted) {
      // return this.updateOne({ deleted: true }, condition, transaction);
      return this.update(condition, { deleted: true }, transaction);
    }

    return this.model.destroy({ where: condition, transaction });
  }

  /**
   *
   * @param {Object} attributes
   */
  async create(attributes, transaction = null) {
    try {
      const nowDate = new Date();
      if (this.model.rawAttributes && this.model.rawAttributes.created_at) {
        attributes.created_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
        attributes.deleted = false;
      }

      const model = await this.model.create(attributes, { transaction });

      return model.get({ plain: true });
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Object} attributes
   */
  async createFullDataSequelize({ attributes, include = [], transaction = null }) {
    try {
      const nowDate = new Date();
      if (this.model.rawAttributes && this.model.rawAttributes.created_at) {
        attributes.created_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
        attributes.deleted = false;
      }

      const model = await this.model.create(attributes, { include, transaction });

      return model;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param {Array} arr là mảng các object data
   */
  async bulkCreate(arr, transaction, include = []) {
    try {
      return this.model.bulkCreate(arr, { include, transaction });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} condition the condition for finding
   * @param {Object} attributes the attributes appending with condition creating new record
   */
  async findOrCreate({ condition, attributes, transaction }) {
    try {
      const nowDate = new Date();
      if (this.model.rawAttributes && this.model.rawAttributes.created_at) {
        attributes.created_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.updated_at) {
        attributes.updated_at = nowDate;
      }

      if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
        attributes.deleted = false;
      }

      return this.model.findOrCreate({
        where: condition,
        defaults: attributes,
        transaction
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Get max id
   */
  maxId() {
    return this.model.max('id');
  }

  /**
   *
   * @param {Object} condition
   * @param {Object[]} include
   * @param {Object[]} order
   */
  Count({ condition = {}, include = [], attributes } = {}) {
    if (this.model.rawAttributes && this.model.rawAttributes.deleted) {
      condition.deleted = false;
    }

    /** Option to query */
    const options = {
      where: condition,
      include,
      distinct: true,
    };

    if (attributes) {
      options.attributes = attributes;
    }

    return this.model.count(options);
  }

  /**
   *
   * @param {Array} arr là mảng các object data
   */
  async bulkUpdate(arr, attributes, transaction) {
    try {
      return this.model.bulkCreate(
        arr,
        { updateOnDuplicate: attributes, transaction },
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {object} object data
   */
  async upsert(object, transaction) {
    try {
      return this.model.upsert(object, {transaction});
    } catch (error) {
      throw error;
    }
  }

  async findAndSum(condition, field) {
    try {
      return this.model.sum(field, { where: condition });
    } catch (e) {
      throw e;
    }
  }

}

export { Repository };
