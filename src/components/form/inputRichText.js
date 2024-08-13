import dynamic from 'next/dynamic'
import { Map } from 'immutable';
import {
  convertFromHTML,
  convertToRaw,
  EditorState,
  ContentState,
  DefaultDraftBlockRenderMap
} from 'draft-js';
import { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false })

const ImageComponent = (props) => {
  const { src } = props.contentState.getEntity(props.block.getEntityAt(0)).getData();
  return <img src={src} alt="draft-image" style={{ maxWidth: '100%' }} />;
};


const blockRendererFn = (block) => {
  if (block.getType() === "IMAGE") {
    return {
      component: ImageComponent,
      editable: false,
    };
  }
  return null;
};

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(
    Map({
      atomic: {
        element: 'figure',
        aliasedElements: ['img']
      },
    })
);

const RichTextEditor = ({ id, value, placeholder, required, onChange}) => {
  const contentState = convertFromHTML(value);
  const initialState = ContentState.createFromBlockArray(contentState.contentBlocks, contentState.entityMap);
  const [editorState, setEditorState] = useState(EditorState.createWithContent(initialState));

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    const html = draftToHtml(rawContentState);
    if (onChange) {
      onChange(html);
    }
  };

  return (


  <Editor
      id={id}
      name={name}
      value={value}
      onChange={(e) => {
        onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      }}
      placeholder={placeholder}
      required={required}
      editorState={editorState}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
      onEditorStateChange={handleEditorChange}
      blockRendererFn={blockRendererFn}
      blockRenderMap={extendedBlockRenderMap}
      // blockRenderMap={extendedBlockRenderMap}
  />
  );
};

export default RichTextEditor;