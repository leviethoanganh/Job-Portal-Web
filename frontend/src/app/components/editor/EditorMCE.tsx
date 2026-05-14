import { Editor } from '@tinymce/tinymce-react';

export const EditorMCE = (props: { editorRef: any; value: string; id: string }) => {
  const { editorRef, value, id = ""} = props;

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "code", "help", "wordcount"
          ],
          toolbar:
            "undo redo | blocks | bold italic | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | link image media | help",
          images_upload_url: `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
          automatic_uploads: true,
          images_upload_credentials: true
        }}
        id={id}
      />
    </>
  );
};
