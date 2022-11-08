const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class CustomerService {
  constructor() {
  }

  async create(data) {
    /*const newUser = await models.User.create(data.user)
    const newCustomer = await models.Customer.create({
      ...data,
      userId: newUser.id,
    });*/
    const newCustomer = await models.Customer.create(data, {
      include: ['user']
    });
    return newCustomer;
  }

  async find() {
    const response = await models.Customer.findAll({
      include: ['user']
    });
    return response;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id);
    if (!customer) {
      throw boom.notFound('User not found');
    }
    return customer;

  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const response = await model.update(changes);
    return response;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    await customer.destroy();
    return { id }
  }
}

module.exports = CustomerService;
