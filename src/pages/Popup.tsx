import { useEffect, useRef, useState } from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import InitializeMDXEditor from '../components/InitializeMDXEditor';

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
      <div className="h-96 w-[50rem] bg-gray-100 flex items-start justify-center">
        {/* Popup Editor */}
        <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col">
          {/* Header */}
          <div className="bg-sky-500 text-white px-6 py-4 rounded-t-lg gap-1.5">
            <p className="text-sm text-blue-200 truncate">{currentTab.title}</p>
          </div>

          {/* Editor Content */}
          <div className="px-1 py-1 flex flex-1 h-80">
            <PanelGroup direction="horizontal">
              <Panel className="border-solid border-2 border-sky-200 h-full p-1 overflow-scroll">
                <InitializeMDXEditor
                  editorRef={editor}
                  autoFocus={{
                    defaultSelection: 'rootEnd',
                    preventScroll: true,
                  }}
                  markdown={note}
                  onChange={(value) => setNote(value)}
                />
              </Panel>
              <PanelResizeHandle className="pl-0.5 pr-0.5" />
              <Panel defaultSize={10} className="border-double border-2 overflow-scroll">
                <div>hi</div>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>
    )
  );
};

export default Popup;
