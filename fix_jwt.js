const fs = require('fs');
const jwt = require('jsonwebtoken');

const dbPath = './backend/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const JWT_SECRET = process.env.JWT_SECRET || 'risetflow_super_secret_key_2026';

const userIndex = db.users.findIndex(u => u.email === 'rudydanjer@gmail.com');
if (userIndex !== -1) {
  const user = db.users[userIndex];
  // Sign a new real JWT
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  db.users[userIndex].token = token;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Successfully updated token to real JWT');
} else {
  console.log('User not found!');
}
