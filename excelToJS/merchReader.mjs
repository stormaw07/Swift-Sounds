import mariadb from 'mariadb';
import dotenv from 'dotenv';
import XLSX from 'xlsx';

dotenv.config();

async function main() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASSWORD,
            database: 'Swiftle',
            port: 3306
        });
        console.log('Success');

        // Les Excel-filen
        const workbook = XLSX.readFile('Merch.xlsx');
        const sheet = workbook.Sheets['Ark1'];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Sett inn data i databasen
        console.log(jsonData); // Debugging: Se hvordan dataene ser ut

        for (let row of jsonData) {
            const query = `INSERT INTO Merch (id, name, url, price, type) VALUES (?, ?, ?, ?, ?)`;
            await conn.query(query, [row.id, row.name, row.url, row.price, row.type]);
            console.log(`Inserted: ${row.id}, ${row.name}, ${row.url}, ${row.price}, ${row.type}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (conn) await conn.end();
    }
}

main();