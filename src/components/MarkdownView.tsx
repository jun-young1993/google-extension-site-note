import InitializeMDXEditor from "./InitializeMDXEditor";
import {useEffect, useRef} from "react";
import {MDXEditorMethods} from "@mdxeditor/editor";
interface MarkdownViewProps {
    markdown?: string
}
const MarkdownView = ({markdown} : MarkdownViewProps) => {
    const editor = useRef<MDXEditorMethods | null>(null);
    useEffect(() => {
        if (editor && editor.current && markdown) {
            editor.current?.setMarkdown(markdown);
        }
    },[editor])
    return (
        <InitializeMDXEditor
            editorRef={editor}
            usePlugin={false}
            readOnly={true}
            markdown={''}
            // addClassName={"line-clamp-1"}
        />
    )
}

export default MarkdownView;