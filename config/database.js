var database = {
  connectionString: (process.env.DATABASE_URL || 'postgres://localhost:5432/tracker-serverjs')
}

module.exports = database;
