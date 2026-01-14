import { runSetup } from './DB/migrations.js';

runSetup()
  .then(() => {
    console.log('✅ DB setup finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ DB setup failed', err);
    process.exit(1);
  });
