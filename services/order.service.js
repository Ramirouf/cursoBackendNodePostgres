//const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize')
class OrderService {

  constructor() {
  }
  async create(data) {
    const newOrder = await models.Order.create(data)
    return newOrder;
  }

  async addItem(data) { //Receive data, which is already validated
    const newItem = await models.OrderProduct.create(data)
    return newItem;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [{
        association: 'customer',
        include: ['user']
      },
        'items' //Models has a belongsToMany, with an assoc. called 'items'
      ]
    });
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }

}

module.exports = OrderService;
