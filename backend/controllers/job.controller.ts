import { Request, Response } from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import CV from "../models/cv.model";


export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await Job.findOne({
      _id: id
    });

    if (record) {
      const jobDetail: any = {
        id: record.id,
        title: record.title,
        companyName: "",
        salaryMin: record.salaryMin,
        salaryMax: record.salaryMax,
        images: record.images,
        position: record.position,
        workingForm: record.workingForm,
        companyAddress: "",
        technologies: record.technologies,
        description: record.description,
        companyId: record.companyId,
        companyLogo: "",
        companyModel: "",
        companyEmployees: "",
        companyWorkingTime: "",
        companyWorkOvertime: ""
      };

      const accountCompany = await AccountCompany.findOne({
        _id: record.companyId
      });

      if (accountCompany) {
        jobDetail.companyName = `${accountCompany.companyName}`;
        jobDetail.companyAddress = `${accountCompany.address}`;
        jobDetail.companyLogo = `${accountCompany.logo}`;
        jobDetail.companyModel = `${accountCompany.companyModel}`;
        jobDetail.companyEmployees = `${accountCompany.companyEmployees}`;
        jobDetail.companyWorkingTime = `${accountCompany.workingTime}`;
        jobDetail.companyWorkOvertime = `${accountCompany.workOvertime}`;
      }

      res.json({
        code: "success",
        Message: "Success!",
        jobDetail: jobDetail
      });
    } else {
      res.json({
        code: "error",
        Message: "Failed!"
      });
    }
  } catch (error) {
    res.json({
      code: "error",
      Message: "Failed!"
    });
  }
};

export const applyPost = async (req: Request, res: Response) => {
  try {
    req.body.fileCV = req.file ? req.file.path : "";

    const newRecord = new CV(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "CV submitted successfully!"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Failed to submit CV. Please try again!"
    });
  }
};
