"use client";

import { EditorMCE } from "@/app/components/editor/EditorMCE";
import JustValidate from "just-validate";
import { useEffect, useRef, useState } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Toaster, toast } from 'sonner';
import { positionList, workingFormList } from "@/configs/variable";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormEdit = (props: { id: string }) => {
  const { id } = props;
  const editorRef = useRef<any>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>([]);
  const [jobDetail, setJobDetail] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/edit/${id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === "error") {
          toast.error(data.message);
        }
        if (data.code === "success") {
          setJobDetail(data.jobDetail);
        }
      });
  }, [id]);

  useEffect(() => {
    if (jobDetail) {
      if (jobDetail.images && jobDetail.images.length > 0) {
        const listImage = jobDetail.images.map((image: string) => ({
          source: image,
          options: { type: 'local' }
        }));
        setImages(listImage);
      }

      const validator = new JustValidate('#editForm');
      validator
        .addField("#title", [
          {
            rule: "required",
            errorMessage: "Please enter the job title!",
          },
        ])
        .onFail(() => setIsValid(false))
        .onSuccess(() => setIsValid(true));

      return () => {
        validator.destroy();
      };
    }
  }, [jobDetail]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (isValid) {
      const formData = new FormData();
      formData.append("title", event.target.title.value);
      formData.append("salaryMin", event.target.salaryMin.value);
      formData.append("salaryMax", event.target.salaryMax.value);
      formData.append("position", event.target.position.value);
      formData.append("workingForm", event.target.workingForm.value);
      formData.append("technologies", event.target.technologies.value);

      if (editorRef.current) {
        formData.append("description", editorRef.current.getContent());
      }

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          if (images[i].file) {
            formData.append("images", images[i].file);
          } else {
            formData.append("images", images[i].source);
          }
        }
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/edit/${id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "error") {
            toast.error(data.message);
          }
          if (data.code === "success") {
            toast.success("Job updated successfully!");
          }
        })
        .catch(() => toast.error("An error occurred while updating!"));
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      {jobDetail && (
        <form
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          id="editForm"
          onSubmit={handleSubmit}
        >
          {/* Job Title */}
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.title}
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">
              Minimum Salary ($)
            </label>
            <input
              type="number"
              name="salaryMin"
              id="salaryMin"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.salaryMin}
            />
          </div>

          <div>
            <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">
              Maximum Salary ($)
            </label>
            <input
              type="number"
              name="salaryMax"
              id="salaryMax"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.salaryMax}
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block font-[500] text-[14px] text-black mb-[5px]">
              Position *
            </label>
            <select
              name="position"
              id="position"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.position}
            >
              {positionList.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Working Form */}
          <div>
            <label htmlFor="workingForm" className="block font-[500] text-[14px] text-black mb-[5px]">
              Working Form *
            </label>
            <select
              name="workingForm"
              id="workingForm"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.workingForm}
            >
              {workingFormList.map((item, index) => (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Technologies */}
          <div className="sm:col-span-2">
            <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              id="technologies"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail.technologies?.join(" , ")}
            />
          </div>

          {/* Images */}
          <div className="sm:col-span-2">
            <label className="block font-[500] text-[14px] text-black mb-[5px]">
              Images
            </label>
            <FilePond
              files={images}
              onupdatefiles={setImages}
              allowMultiple={true}
              maxFiles={8}
              name="images"
              labelIdle='Drag & drop or <span class="filepond--label-action">Choose</span>'
              acceptedFileTypes={['image/*']}
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block font-[500] text-[14px] text-black mb-[5px]">
              Description
            </label>
            <EditorMCE
              editorRef={editorRef}
              value={jobDetail.description}
              id="description"
            />
          </div>

          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[30px] font-[700] text-[16px] text-white hover:bg-[#0077ee] transition-all">
              Update Job
            </button>
          </div>
        </form>
      )}
    </>
  );
};
