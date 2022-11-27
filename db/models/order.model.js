const { Model, DataTypes, Sequelize } = require('sequelize')
const { CUSTOMER_TABLE } = require('./customer.model')

const ORDER_TABLE = 'order';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  total: { //Calculated with Node. Not recommended if there are lots of elements.
    type: DataTypes.VIRTUAL, //Virtual for it to not exist in DB
    get() { //How to get or calculate this field
      if (this.items.length > 0) { //'this.items' references to 'items' in belongsToMany relationship
        return this.items.reduce((total, item) => {
          return total + (item.price * item.OrderProduct.amount);
        }, 0);
      }
    }
  }
}

class Order extends Model {

  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer'
    });
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct, //Solved through OrderProduct
      foreignKey: 'orderId',
      otherKey: 'productId'
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false
    }
  }
}

module.exports = {
  ORDER_TABLE,
  OrderSchema,
  Order
}
