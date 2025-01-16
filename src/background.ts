import IndexedDBHelper from './utills/IndexedDBHelper';

const dbHelper = new IndexedDBHelper('SiteNoteDB', 'notes');
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
    const { id, url, data } = message.payload;
    dbHelper
      .put({ id, url, data: data })
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
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.scripting
    .registerContentScripts([
      {
        id: 'session-script',
        js: ['content.js'],
        css: ['tailwind.css'],
        persistAcrossSessions: false,
        matches: ['<all_urls>'], // 모든 URL에 적용
        runAt: 'document_idle', // 돔 완전히 실행후를 보장
        // runAt: "document_start",
      },
    ])
    .then(() => {})
    .catch((err) => console.error('Error registering content script', err));
});