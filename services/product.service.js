const { Op } = require ("sequelize") //Used for price filtering with min and max
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

  //Now, with paging, find must be "dynamic". Which means that it behaves differently if there's a limit and offset, or not
  async find(query) {
    const options = {
      include: ['category'], // With paging or not, category is needed
      where: {} //Used for filtering by specific price when asking for a product
    }
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset
    }
    const { price } = query;
    if (price) {
      options.where.price = price;
    }

    const { price_min, price_max } = query;
    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min, //Greater or equal than price_min
        [Op.lte]: price_max  //Lesser or equal than price_max
      }
    }
    const products = await models.Product.findAll(options);
    return products;
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
