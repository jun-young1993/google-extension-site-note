'use client';
import {
  toolbarPlugin,
  KitchenSinkToolbar,
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  diffSourcePlugin,
  markdownShortcutPlugin,
  SandpackConfig,
  MDXEditor,
  MDXEditorProps,
  MDXEditorMethods,
} from '@mdxeditor/editor';

import '../styles/tailwind.css';
import { ForwardedRef } from 'react';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const reactSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};
const allPlugins = (diffMarkdown: string) => [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin(),
  linkPlugin(),
  linkDialogPlugin(),

  imagePlugin({ imageUploadHandler: async () => '/sample-image.png' }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  sandpackPlugin({ sandpackConfig: reactSandpackConfig }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: 'JavaScript',
      css: 'CSS',
      txt: 'text',
      tsx: 'TypeScript',
    },
  }),
  directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown }),
  markdownShortcutPlugin(),
];

/**
 * @url https://github.com/mdx-editor/site/blob/master/app/DemoEditor.tsx
 * @param {string} markdown
 * @return {JSX.Element}
 * @constructor
 */
export default function InitializeMDXEditor({
  markdown,
  editorRef,
  ...props
}: {
  markdown: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps) {
  return (
    <MDXEditor
      {...props}
      ref={editorRef}
      markdown={markdown}
      className="full-demo-mdxeditor"
      contentEditableClassName="prose min-h-32 h-full max-w-full font-sans"
      plugins={allPlugins(markdown)}
    />
  );
}
