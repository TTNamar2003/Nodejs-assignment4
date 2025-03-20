import pool from "../config/db.js";

export const createUser = async (name, email, hashedPassword, age) => {
  const query = `
    INSERT INTO users (name, email, password, age) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [name, email, hashedPassword, age];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";

  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};
