import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = await open({
    filename: './healthcare.db',
    driver: sqlite3.Database,
  });

  const {
    username, gender, dob, allergies,
    address, phone, height, heightUnit,
    weight, weightUnit
  } = req.body;

  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        gender TEXT,
        dob TEXT,
        allergies TEXT,
        address TEXT,
        phone TEXT,
        height REAL,
        heightUnit TEXT,
        weight REAL,
        weightUnit TEXT
      )
    `);

    await db.run(`
      INSERT INTO profiles (username, gender, dob, allergies, address, phone, height, heightUnit, weight, weightUnit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      username, gender, dob, allergies,
      address, phone, height, heightUnit,
      weight, weightUnit
    ]);

    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
}
