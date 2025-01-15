import { useEffect, useRef, useState } from 'react';
import InitializeMDXEditor from '../components/InitializeMDXEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';

const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' }, (response) => {
      if (response?.tab) {
        resolve(response.tab);
      } else {
        reject('[NOT FOUND TAB]');
      }
    });
  });
};

const Popup = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [note, setNote] = useState<string>('');
  const editor = useRef<MDXEditorMethods | null>(null);

  useEffect(() => {
    const getTabInfo = async () => {
      const tab = await getCurrentTab();
      setCurrentTab(tab);
      if (tab.url) {
        chrome.runtime.sendMessage(
          { type: 'GET_NOTE', payload: { id: tab.url } },
          (response) => {
            if (response?.data) {
              setNote(response.data);
              if (editor && editor.current) {
                editor.current?.setMarkdown(response.data);
              }
            }
          }
        );
      }
    };

    getTabInfo();
  }, []);
  useEffect(() => {
    // Save note when the popup is closed

    if (currentTab?.url && note.trim()) {
      chrome.runtime.sendMessage({
        type: 'SAVE_NOTE',
        payload: {
          id: currentTab.url,
          url: currentTab.url,
          data: note,
        },
      });
    }
  }, [currentTab, note]);

  return (
    currentTab && (
      <div className="bg-gray-100 flex items-center justify-center">
        {/* Popup Editor */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-lg font-bold">Edit Note</h2>
            <p className="text-sm text-blue-200 truncate">{currentTab.title}</p>
          </div>

          {/* Editor Content */}
          <div className="px-6 py-4">
            <InitializeMDXEditor
              editorRef={editor}
              autoFocus={{
                defaultSelection: 'rootEnd',
                preventScroll: true,
              }}
              markdown={note}
              onChange={(value) => setNote(value)}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default Popup;
