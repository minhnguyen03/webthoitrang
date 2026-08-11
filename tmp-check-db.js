const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "280303",
    database: "csdl",
  });

  const [tables] = await conn.query("SHOW TABLES LIKE 'payments'");
  console.log("payments table:", tables);

  if (tables.length) {
    const [desc] = await conn.query("DESCRIBE payments");
    console.log("schema:", desc);
    const [rows] = await conn.query("SELECT * FROM payments LIMIT 5");
    console.log("sample rows:", rows);
  }

  await conn.end();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
