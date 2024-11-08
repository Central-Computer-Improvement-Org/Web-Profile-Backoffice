import { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
  Modifier,
  getDefaultKeyBinding,
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const error = validations.find((v) => v.name === name);

  useEffect(() => {
    if (value) {
      const blocksFromHTML = convertFromHTML(value);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    const contentState = newEditorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));
    const plainText = contentState.getPlainText().trim();

    if (!plainText) {
      onChange("");
      return;
    }

    onChange(htmlContent);
  };

  const keyBindingFn = (e) => {
    if (e.keyCode === 9 /* Tab */) {
      return "tab-indent";
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, editorState) => {
    if (command === "tab-indent") {
      const currentContent = editorState.getCurrentContent();
      const selection = editorState.getSelection();

      // Tambahkan spasi untuk indentasi pada posisi saat ini
      const newContent = Modifier.replaceText(
        currentContent,
        selection,
        "    " // empat spasi untuk indentasi
      );

      const newEditorState = EditorState.push(
        editorState,
        newContent,
        "insert-characters"
      );
      setEditorState(newEditorState);
      return "handled";
    }
    return "not-handled";
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
        <div
          className={`bg-gray-50 border ${
            error ? "border-red-500" : "border-gray-300"
          } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none`}
        >
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
            keyBindingFn={keyBindingFn}
            handleKeyCommand={handleKeyCommand}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "list",
                "textAlign",
                "link",
                "emoji",
                "history",
              ],
              inline: {
                options: ["bold", "italic", "underline", "strikethrough"],
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
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default RichTextEditor;
