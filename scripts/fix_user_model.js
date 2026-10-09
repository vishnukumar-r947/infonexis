const fs = require('fs');
let userCode = fs.readFileSync('D:/Mini Projects/infonexis-ai/backend/models/User.js', 'utf8');

userCode = userCode.replace(
  /userSchema\.pre\('save', async function\(next\) \{[\s\S]*?next\(\);\s*\}\);/,
  `userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});`
);

fs.writeFileSync('D:/Mini Projects/infonexis-ai/backend/models/User.js', userCode, 'utf8');
console.log('Fixed User.js pre-save hook');
