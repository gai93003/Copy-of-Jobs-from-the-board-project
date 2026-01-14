import cron from 'node-cron';
import { importJobsFromExternal } from './externalJobsService.js';
import { deleteOldJobs } from './deleteOldJobs.js';

export function setupCronJobs() {
  cron.schedule(
    '* * * * *',// this is testing it fetches every one min, we need to change to 07 to change it to fetche at 7am every morning
    async () => {
      console.log('[CRON] Starting daily jobs import + cleanup');
      await importJobsFromExternal();
      await deleteOldJobs();
      console.log('[CRON] Finished daily jobs import + cleanup');
    },
    { timezone: 'Europe/London' }
  );
}



