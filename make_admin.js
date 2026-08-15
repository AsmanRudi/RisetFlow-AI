const fs = require('fs');
const dbPath = './backend/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const userIndex = db.users.findIndex(u => u.email === 'rudydanjer@gmail.com');
if (userIndex !== -1) {
  db.users[userIndex].isAdmin = true;
  db.users[userIndex].subscriptionTier = 'pro';
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Successfully updated rudydanjer@gmail.com to Super Admin and Pro');
} else {
  console.log('User not found!');
}
