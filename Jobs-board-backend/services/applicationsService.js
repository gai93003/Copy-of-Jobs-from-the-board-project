import * as appModel from '../DB/application.js';

export async function createApplication({ user_id, job_id, status }) {
  return await appModel.createOrUpdateApplication(user_id, job_id, status);
}

export async function updateApplicationStatus(application_id, status) {
  return await appModel.updateApplicationStatus(application_id, status);
}

export async function getApplicationsByUser(user_id) {
  return await appModel.getApplicationsByUser(user_id);
}

export async function getApplicationByUserAndJob(user_id, job_id) {
  return await appModel.getApplicationByUserAndJob(user_id, job_id);
}

export default {
  createApplication,
  updateApplicationStatus,
  getApplicationsByUser,
  getApplicationByUserAndJob,
};
