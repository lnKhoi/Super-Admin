import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { convertImage } from '~/apis/campaign';

const ReactQuill = React.lazy(() => import('react-quill'));

type EditorProps = {
  onChange?: (content: string) => void;
  value: string;
  showToolbar?: boolean;
  disabled?: boolean; // Add the disabled prop
};

const Editor = ({
  onChange,
  value,
  showToolbar = true,
  disabled = false, // Default to false
}: EditorProps) => {
  const [code, setCode] = useState<string>(value);
  const quillRef = useRef<any>(null)

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleProcedureContentChange = async (content: string) => {
    setCode(content);
    onChange?.(content);
    console.log(content);

  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('media', file);
    const res = await convertImage(formData)
    return res.data.mediaUrl
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        const quill = quillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: showToolbar && !disabled // Hide toolbar when disabled
      ? {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ size: [] }],
          [{ font: [] }],
          [{ align: ['right', 'center', 'justify'] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
          ['code-block'],
          ['clean'],
          [{ color: ['red', '#785412'] }],
          [{ background: ['red', '#785412'] }],
        ],
        handlers: {
          image: imageHandler,
        },
      } : false
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'color',
    'image',
    'background',
    'align',
    'size',
    'font',
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        defaultValue={code}
        formats={formats}
        value={code}
        onChange={disabled ? undefined : handleProcedureContentChange} // Disable onChange if disabled
        readOnly={disabled} // Set ReactQuill to read-only mode
      />
    </Suspense>
  );
};

export default Editor;
