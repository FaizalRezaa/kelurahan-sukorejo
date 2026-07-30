"use client";

import 'react-quill-new/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  { ssr: false }
);

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

// DI SINI PERUBAHANNYA: "bullet" sudah dihapus karena sudah diwakili oleh "list"
const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "link",
];

export function QuillEditor({ value, onChange, placeholder, className }: QuillEditorProps) {
  const modules = useMemo(() => QUILL_MODULES, []);
  const formats = useMemo(() => QUILL_FORMATS, []);

  return (
    <div className={`quill-wrapper ${className ?? ""}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder ?? "Tulis konten artikel..."}
      />
      <style>{`
        .quill-wrapper .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          min-height: 180px;
        }
        .quill-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f8fafc;
        }
        .quill-wrapper .ql-toolbar,
        .quill-wrapper .ql-container {
          border-color: #e2e8f0;
        }
        .quill-wrapper .ql-editor {
          min-height: 180px;
          max-height: 340px;
          overflow-y: auto;
          line-height: 1.7;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}