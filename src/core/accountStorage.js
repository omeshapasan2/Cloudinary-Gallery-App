// Format for storing Cloudinary account data and Session IDs in localStorage: 
// {
//   accounts: [ ... ],
//   sessions: {
//     accountId: sessionId,
//     ...
//   }
// }

const STORAGE_KEY = 'cloudinaryData';

export function getCloudinaryData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { accounts: [], sessions: {} };
}

export function saveCloudinaryData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addAccountToStorage(account) {
  const data = getCloudinaryData();
  data.accounts.push(account);
  saveCloudinaryData(data);
}

export function updateSessionInStorage(accountId, sessionId) {
  const data = getCloudinaryData();
  data.sessions[accountId] = sessionId;
  saveCloudinaryData(data);
}

export function getSession(accountId) {
  return getCloudinaryData().sessions[accountId] || null;
}

export function getAllAccounts() {
  return getCloudinaryData().accounts;
}

export function deleteAccount(accountId) {
  const data = getCloudinaryData();
  data.accounts = data.accounts.filter(acc => acc.id !== accountId);
  delete data.sessions[accountId];
  saveCloudinaryData(data);
}