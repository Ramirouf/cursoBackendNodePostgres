const { models } = require("../libs/sequelize");
class ProductsService {

  constructor() {
    this.generate();
  }

  generate() {
  }

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const data = await models.Product.findAll({
      include: ['category']
    });
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
