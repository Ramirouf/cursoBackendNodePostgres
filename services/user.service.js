//const boom = require('@hapi/boom');
const pool = require("../libs/postgres.pool")
//const getConnection = require("../libs/postgres");
const { models } = require('../libs/sequelize');
class UserService {
  constructor() {
    this.users = [];
    this.pool = pool;
    this.pool.on("error", (err) => console.log(err));
  }

  async create(data) {
    let { name, items } = data;
    const queryID = "Select (MAX(ID) + 1) AS ID FROM USERS";
    const { rows } = await this.pool.query(queryID);

    if (!items) {
      items = 0
    }
    const values = [rows[0].id, name, items];
    const query = "INSERT INTO USERS (ID, NAME, ITEMS) VALUES ($1, $2, $3)";
    await this.pool.query(query, values);

    return {
      id: rows[0].id,
      ...data
    };
  }

  async find() {
    const response = await models.User.findAll();
    return response;
  }

  async findOne(id) {
    const query = `SELECT * FROM USERS WHERE ID = $1`;
    const user = await this.pool.query(query, [id]);
    return user.rows;

  }

  async update(id, changes) {
    const dataUpdate = [];
    const setQuery = [];

    Object.entries(changes).forEach((entry, index) => {
      setQuery.push(entry[0] + ` = $${index + 1}`);
      dataUpdate.push(entry[1]);
    });

    const query = `UPDATE USERS SET ${setQuery.join(", ")} WHERE ID = ${id}`;
    await this.pool.query(query, dataUpdate);

    return {
      id,
      ...changes
    };
  }

  async delete(id) {
    const query = "DELETE FROM CATEGORIES WHERE ID = $1";
    await this.pool.addListener.query(query, [id]);
    return { id };
  }
}

module.exports = UserService;
