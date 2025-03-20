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

export const findUserByGitHubId = async (githubId) => {
  const query = "SELECT * FROM users WHERE github_id = $1";

  try {
    const result = await pool.query(query, [githubId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const updateUserGitHubId = async (userId, githubId) => {
  const query = "UPDATE users SET github_id = $1 WHERE id = $2 RETURNING *";

  try {
    const result = await pool.query(query, [githubId, userId]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createUserFromGitHub = async ({
  githubId,
  name,
  email,
  password,
  age,
}) => {
  const query = `
    INSERT INTO users (name, email, password, age, github_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [name, email, password, age, githubId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
