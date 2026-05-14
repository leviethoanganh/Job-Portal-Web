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
import  { positionList ,  workingFormList }  from  "@/configs/variable" ;

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormCreate = () => {
  const editorRef = useRef<any>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const validator = new JustValidate('#createForm');

    validator
      .addField("#title", [
        {
          rule: "required",
          errorMessage: "Please enter the job title!",
        },
      ])
      .onFail(() => {
        setIsValid(false);
      })
      .onSuccess(() => {
        setIsValid(true);
      });

    return () => {
      validator.destroy();
    };
  }, []);

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
          formData.append("images", images[i].file);
        }
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            toast.error(data.message);
          }
          if (data.code === "success") {
            toast.success("Job created successfully!");
            event.target.reset();
            setImages([]);
            if (editorRef.current) {
              editorRef.current.setContent("");
            }
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("An error occurred while connecting to the server!");
        });
    } else {
      toast.error("Please fill in all required fields!");
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form
        className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
        id="createForm"
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
            placeholder="e.g. Senior Frontend Developer"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black"
          >
            {positionList.map((item: any, index: number) => (
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black"
          >
            {workingFormList.map((item: any, index: number) => (
              <option value={item.value} key={item.value || index}>
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
            placeholder="ReactJS, NodeJS, Docker..."
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>

        {/* Images */}
        <div className="sm:col-span-2">
          <label htmlFor="images" className="block font-[500] text-[14px] text-black mb-[5px]">
            Project / Office Images
          </label>
          <FilePond
            files={images}
            onupdatefiles={setImages}
            allowMultiple={true}
            maxFiles={8}
            name="images"
            labelIdle='Drag & drop or <span class="filepond--label-action">Choose image</span>'
            acceptedFileTypes={['image/*']}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Job Description
          </label>
          <EditorMCE
            editorRef={editorRef}
            value=""
            id="description"
          />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="bg-[#0088FF] rounded-[4px] h-[48px] px-[30px] font-[700] text-[16px] text-white hover:bg-[#0077ee] transition-all"
          >
            Create Job
          </button>
        </div>
      </form>
    </>
  );
};
