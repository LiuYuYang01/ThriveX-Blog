'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IDomEditor, IEditorConfig } from '@wangeditor-next/editor';
import '@wangeditor-next/editor/dist/css/style.css';
import './index.scss';

const Editor = dynamic(() => import('@wangeditor-next/editor-for-react').then((mod) => mod.Editor), { ssr: false });

export default ({ value }: { value: string }) => {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 编辑器内容
  const [html, setHtml] = useState(value);

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    readOnly: true, // 设置为只读
  };

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div className="record-content-viewer">
      <Editor defaultConfig={editorConfig} value={html} onCreated={setEditor} onChange={(editor) => setHtml(editor.getHtml())} mode="default" />
    </div>
  );
};
