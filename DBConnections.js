const { Pool } = require('pg');

const pool = new Pool({
  host: '192.168.0.14',
  port: 5432,
  database: 'mobilserv',
  user: 'postgres',
  password: 'Uztwhn@41'
});


async function select_query(query) {
    try {
        const { rows } = await pool.query(query);
        for (let index = 0; index < rows.length; index++) {
        console.log(rows[index].email);
        }
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
    }
}
module.exports = {select_query}
