const { Pool } = require('pg');
const Log = require('./Logs')

const log = new Log('database')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'admin'
});


async function select_query(query,values) {
    try {
        const { rows } = await pool.query(query,values);
        for (let index = 0; index < rows.length; index++) {
        console.log(rows[index].email);
        }
        return rows;
    } catch (error) {
        log.EventLog(error)
        throw error
    }
}

async function insert_query(query, values) {
    try {
      const result = await pool.query(query, values);
      log.EventLog(`Inserted ${result.rowCount} row(s)`);
      return true;
    } catch (error) {
      log.EventLog("---ERROR---",error);
      return error
    }
  }
  

module.exports = {select_query,insert_query}
