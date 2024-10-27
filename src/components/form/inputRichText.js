// RichTextEditor.jsx
import { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { 
  convertToRaw, // Untuk mengkonversi konten editor menjadi format raw
  EditorState, // Handle state untuk editor
  ContentState, // Representasi konten dalam editor
  convertFromHTML // Untuk mengkonversi HTML menjadi format yang bisa dibaca editor
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const RichTextEditor = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon = null,
  label = null,
  validations = [],
}) => {
  // Inisialisasi state editor kosong
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const error = validations.find((v) => v.name === name);

  // useEffect ini akan dijalankan saat komponen dimuat
  // Berguna untuk mengisi editor dengan nilai awal jika ada
  useEffect(() => {
    if (value) {
      // konversi setiap blok HTML menjadi format yang bisa dibaca editor
      const blocksFromHTML = convertFromHTML(value);
      // Buat konten dari state editor dari konversian HTML
      const contentState = ContentState.createFromBlockArray( 
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      // Set konten editor dengan konten yang sudah di konversi
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const onEditorStateChange = (newEditorState) => {
    // Update state editor lokal
    setEditorState(newEditorState);
    
    // Konversi konten editor menjadi string HTML:
    // 1. Ambil current content dari editor
    const contentState = newEditorState.getCurrentContent();
    // 2. Konversi ke format raw terlebih dahulu, Lalu konversi ke HTML string
    const htmlContent = draftToHtml(convertToRaw(contentState));
    const plainText = contentState.getPlainText().trim();
    // Jika kosong, kirim string kosong agar bisa divalidasi Zod
    if (!plainText) {
      onChange("");
      return;
    }
    
    // Kirimkan konten HTML ke parent component
    onChange(htmlContent);
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <div className={`bg-gray-50 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none`}>
          <Editor
            id={id}
            name={name}
            placeholder={placeholder}
            required={required}
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class h-48"
            toolbarClassName="toolbar-class"
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'history'],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough'],
              },
            }}
          />
        </div>
        {icon && (
          <div className="absolute top-0 right-0 h-full p-2.5 text-sm font-medium text-black flex justify-center items-center">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;