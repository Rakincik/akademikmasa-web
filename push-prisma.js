const { execSync } = require('child_process');
try {
  console.log("Pushing prisma schema...");
  const output = execSync('npx prisma db push', { encoding: 'utf8' });
  console.log(output);
  console.log("Push successful.");
} catch (e) {
  console.error("Error:", e.stdout || e.stderr || e.message);
}
