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
            password: 'stormDB07',
            database: 'Swiftle',
            port: 3306
        });
        console.log('Success');

        // Les Excel-filen
        const workbook = XLSX.readFile('taylor_all_album_songs.xlsx');
        const sheet = workbook.Sheets['Ark1'];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Sett inn data i databasen
        console.log(jsonData); // Debugging: Se hvordan dataene ser ut

        for (let row of jsonData) {
            const query = `INSERT INTO Album_songs (album_name, track_number, track_name) VALUES (?, ?, ?)`;
            await conn.query(query, [row.album_name, row.track_number, row.track_name]);
            console.log(`Inserted: ${row.album_name}, ${row.track_number}, ${row.track_name}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (conn) await conn.end();
    }
}

main();
