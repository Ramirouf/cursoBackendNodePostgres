const faker = require('faker');
//const boom = require('@hapi/boom');

const sequelize = require("../libs/sequelize");
class ProductsService {

  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
        isBlock: faker.datatype.boolean(),
      });
    }
  }

  async create(data) {
    let { name, items } = data;
    const queryID = "Select (MAX(ID) + 1) AS ID FROM PRODUCTS";
    const { rows } = await this.pool.query(queryID);

    if (!items) {
      items = 0
    }
    const values = [rows[0].id, name, items];
    const query = "INSERT INTO PRODUCTS (ID, NAME, ITEMS) VALUES ($1, $2, $3)";
    await this.pool.query(query, values);

    return {
      id: rows[0].id,
      ...data
    };
  }

  async find() {
    const query = "SELECT * FROM tasks";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findOne(id) {
    const query = `SELECT * FROM PRODUCTS where id = $1`
    const product = await this.pool.query(query, [id]);
    return product.rows;
  }

  async update(id, changes) {
    const dataUpdate = [];
    const setQuery = [];

    Object.entries(changes).forEach((entry, index) => {
      setQuery.push(entry[0] + ` = $${index + 1}`);
      dataUpdate.push(entry[1]);
    });

    const query = `UPDATE PRODUCTS SET ${setQuery.join(", ")} WHERE ID = ${id}`;
    await this.pool.query(query, dataUpdate);

    return {
      id,
      ...changes
    };
  }

  async delete(id) {
    const query = "DELETE FROM CATEGORIES WHERE ID = $1";
    await this.pool.query(query, [id]);
    return { id };
  }

}

module.exports = ProductsService;
