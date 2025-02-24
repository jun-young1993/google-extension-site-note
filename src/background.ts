import IndexedDBHelper from './utills/IndexedDBHelper';

const dbHelper = new IndexedDBHelper('SiteNoteDB', 'notes', 3);
dbHelper.init().catch((err) => console.error('Failed to initialize DB:', err));

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      sendResponse({ tab: currentTab });
    });
    return true; // Async response
  }
  if (message.type === 'SAVE_NOTE') {
    const { id, url, data, title } = message.payload;
    const urlInfo = new URL(url);
    dbHelper
      .put({
        id,
        url,
        data: data,
        domain: urlInfo.hostname,
        created_at: new Date(),
        title: title,
      })
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((err) => {
        console.error('Failed to save note:', err);
        sendResponse({ success: false, error: err });
      });
    return true; // Keep the message channel open for async response
  }
  if (message.type === 'GET_NOTE') {
    const { id } = message.payload;
    dbHelper
      .get<{ data: string }>(id)
      .then((result) => {
        sendResponse({ success: true, data: result?.data });
      })
      .catch((err) => {
        console.error('Failed to get note:', err);
        sendResponse({ success: false, error: err });
      });
    return true; // Keep the message channel open for async response
  }

  // manifest.json에서 content_scripts로 등록하는 것으로 변경
  chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting
      .registerContentScripts([
        {
          id: 'session-script',
          js: ['content.js'],
          css: ['tailwind.css'],
          persistAcrossSessions: false,
          matches: ['<all_urls>'],
          runAt: 'document_idle',
        },
      ])
      .then(() => {})
      .catch((err) => console.error('Error registering content script', err));
  });
  if (message.type === 'GET_DOMAIN_NOTES') {
    const { domain } = message.payload;
    dbHelper
      .getByDomain(domain)
      .then((notes) => {
        console.log('=>(background.ts:50) notes', notes);
        sendResponse(notes);
      })
      .catch((err) => {
        console.error('Failed to fetch notes by domain:', err);
      });
    return true;
  }
});
