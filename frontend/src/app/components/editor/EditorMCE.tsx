import { Editor } from '@tinymce/tinymce-react';

export const EditorMCE = (props: { editorRef: any; value: string; id: string }) => {
  const { editorRef, value, id = ""} = props;

  return (
    <>
      <Editor
        // Sửa lỗi từ process.approx thành process.env
        apiKey={process.env.NEXT_PUBLIC_TINYMCE} 
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        init={{
          height: 500,
          menubar: false, // Thêm tùy chọn này nếu bạn muốn giao diện gọn hơn
          plugins: [
            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "code", "help", "wordcount"
          ],
          toolbar: 
            "undo redo | blocks | bold italic | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | link image media | help",
          // Sửa lỗi từ process.approx thành process.env
          images_upload_url: `${process.env.NEXT_PUBLIC_API_URL}/upload/image`,
          automatic_uploads: true,
          images_upload_credentials: true // Cho phép gửi kèm cookie/session khi upload ảnh
        }}
        id={id}
      />
    </>
  );
};