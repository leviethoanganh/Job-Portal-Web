import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../models/account-company.model";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/job.model";
import City from "../models/city.model";
import CV from "../models/cv.model";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const { companyName, email, password } = req.body;

    const existAccount = await AccountCompany.findOne({
      email: email,
    });

    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newAccount = new AccountCompany({
      companyName: companyName,
      email: email,
      password: hash,
    });

    await newAccount.save();

    res.json({
      code: "success",
      message: "Account registered successfully!",
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "An error occurred, please try again later!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existAccount = await AccountCompany.findOne({
    email: email
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email not found!"
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, `${existAccount.password}`);

  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Incorrect password!"
    });
    return;
  }

  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "1d"
    }
  );

  console.log("Login email:", email);
  console.log("JWT token created:", token);

  res.cookie("token", token, {
    path: "/",
    maxAge: (24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.json({
    code: "success",
    message: "Login successful!"
  })
}

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    if (req.file) {
      req.body.logo = req.file.path;
    } else {
      delete req.body.logo;
    }

    await AccountCompany.updateOne(
      {
        _id: req.account.id
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Updated successfully!"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Update failed!"
    });
  }
};

export const createJobPost = async (req: AccountRequest, res: Response) => {
  try {
    req.body.companyId = req.account.id;

    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;

    if (req.body.technologies) {
      req.body.technologies = req.body.technologies
        .split(",")
        .map((item: string) => item.trim());
    } else {
      req.body.technologies = [];
    }

    req.body.images = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }

    const newRecord = new Job(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Job created successfully!",
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.json({
      code: "error",
      message: "Invalid data or system error!",
    });
  }
};

export const listJob = async (req: AccountRequest, res: Response) => {
  try {
    const find = {
      companyId: req.account.id,
    };

    const limitItems = 6;
    let page = 1;

    if (req.query.page) {
      page = parseInt(req.query.page.toString());
    }

    const totalRecord = await Job.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const jobs = await Job.find(find)
      .sort({ createdAt: "desc" })
      .limit(limitItems)
      .skip(skip);

    const dataFinal = jobs.map((item) => ({
      id: item.id,
      title: item.title,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      technologies: item.technologies,
    }));

    res.json({
      code: "success",
      message: "Jobs retrieved successfully!",
      jobs: dataFinal,
      totalPage: totalPage,
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Error retrieving data!",
    });
  }
};

export const editJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;
    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id
    });

    if (jobDetail) {
      res.json({
        code: "success",
        message: "Success!",
        jobDetail: jobDetail
      });
    } else {
      res.json({
        code: "error",
        message: "Job not found or access denied!"
      });
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid ID!"
    });
  }
};

export const editJobPatch = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id
    });

    if (!jobDetail) {
      return res.json({
        code: "error",
        message: "Invalid ID!"
      });
    }

    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;

    if (req.body.technologies) {
      req.body.technologies = req.body.technologies.split(",").map((t: string) => t.trim());
    }

    let imagesFinal = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imagesFinal = [...req.body.images];
      } else {
        imagesFinal.push(req.body.images);
      }
    }

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as any[]) {
        imagesFinal.push(file.path);
      }
    }

    req.body.images = imagesFinal;

    await Job.updateOne(
      {
        _id: id,
        companyId: req.account.id
      },
      req.body
    );

    res.json({
      code: "success",
      message: "Updated successfully!"
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "An error occurred while updating!"
    });
  }
};

export const deleteJobDel = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const result = await Job.deleteOne({
      _id: id,
      companyId: req.account.id
    });

    if (result.deletedCount > 0) {
      return res.json({
        code: "success",
        message: "Job deleted successfully!"
      });
    } else {
      return res.json({
        code: "error",
        message: "Job not found or delete access denied!"
      });
    }
  } catch (error) {
    return res.json({
      code: "error",
      message: "Invalid ID or system error!"
    });
  }
};


export const list = async (req: AccountRequest, res: Response) => {
  try {
    const find: any = {};

    let limitItems = 6;
    if (req.query.limitItems) {
      limitItems = parseInt(`${req.query.limitItems}`);
    }

    let page = 1;
    if (req.query.page) {
      page = Math.max(1, parseInt(`${req.query.page}`));
    }

    const totalRecord = await AccountCompany.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const companyList = await AccountCompany
      .find(find)
      .sort({
        createdAt: "desc"
      })
      .limit(limitItems)
      .skip(skip);

    const companyListFinal = [];

    for (const item of companyList) {
      const dataItemFinal = {
        id: item.id,
        logo: item.logo,
        companyName: item.companyName,
        cityName: "",
        totalJob: 0
      };

      const city = await City.findOne({
        _id: item.city
      });
      dataItemFinal.cityName = city ? city.name : "N/A";

      const totalJob = await Job.countDocuments({
        companyId: item.id
      });
      dataItemFinal.totalJob = totalJob;

      companyListFinal.push(dataItemFinal);
    }

    res.json({
      code: "success",
      message: "Company list retrieved successfully!",
      companyList: companyListFinal,
      totalPage: totalPage
    });
  } catch (error) {
    console.error("Error fetching company list:", error);
    res.json({
      code: "error",
      message: "Server error!"
    });
  }
};


export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await AccountCompany.findOne({ _id: id });

    if (record) {
      const companyDetail = {
        id: record.id,
        logo: record.logo,
        companyName: record.companyName,
        address: record.address,
        companyModel: record.companyModel,
        companyEmployees: record.companyEmployees,
        workingTime: record.workingTime,
        workOvertime: record.workOvertime,
        description: record.description
      };

      const jobs = await Job.find({ companyId: id })
        .sort({ createdAt: "desc" });

      const cityRecord = await City.findOne({ _id: record.city });
      const cityName = cityRecord?.name || "";

      const dataFinal = jobs.map((item: any) => ({
        id: item.id,
        companyLogo: record.logo,
        title: item.title,
        companyName: record.companyName,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        companyCity: cityName,
        technologies: item.technologies
      }));

      res.json({
        code: "success",
        message: "Success!",
        companyDetail: companyDetail,
        jobs: dataFinal
      });
    } else {
      res.json({
        code: "error",
        message: "Company not found!"
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "System error!"
    });
  }
};

export const listCV = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;

    const listJob = await Job.find({
      companyId: companyId
    });

    if (!listJob || listJob.length === 0) {
      return res.json({
        code: "success",
        message: "The company has no job postings yet.",
        listCV: []
      });
    }

    const listJobId = listJob.map(item => item.id);

    const listCVRaw = await CV.find({
      jobId: { $in: listJobId }
    }).sort({ createdAt: "desc" });

    const dataFinal = listCVRaw.map(cv => {
      const infoJob = listJob.find(job => job.id === cv.jobId);

      return {
        id: cv.id,
        fullName: cv.fullName,
        email: cv.email,
        phone: cv.phone,
        fileCV: cv.fileCV,
        viewed: cv.viewed,
        status: cv.status,
        jobTitle: infoJob?.title || "",
        jobSalaryMin: infoJob?.salaryMin ? parseInt(infoJob.salaryMin.toString()) : 0,
        jobSalaryMax: infoJob?.salaryMax ? parseInt(infoJob.salaryMax.toString()) : 0,
        jobPosition: infoJob?.position || "",
        jobWorkingForm: infoJob?.workingForm || ""
      };
    });

    res.json({
      code: "success",
      message: "CV list retrieved successfully!",
      listCV: dataFinal
    });

  } catch (error) {
    console.error("Error fetching CV list:", error);
    res.json({
      code: "error",
      message: "System error while fetching CV list."
    });
  }
};

export const detailCV = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Application not found!"
      });
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId
    });

    if (!infoJob) {
      return res.json({
        code: "error",
        message: "You do not have access to this application!"
      });
    }

    const dataFinalCV = {
      id: infoCV.id,
      fullName: infoCV.fullName,
      email: infoCV.email,
      phone: infoCV.phone,
      fileCV: infoCV.fileCV,
      status: infoCV.status
    };

    const dataFinalJob = {
      id: infoJob.id,
      title: infoJob.title,
      salaryMin: infoJob.salaryMin,
      salaryMax: infoJob.salaryMax,
      position: infoJob.position,
      workingForm: infoJob.workingForm,
      technologies: infoJob.technologies,
    };

    if (!infoCV.viewed) {
      await CV.updateOne(
        { _id: cvId },
        { $set: { viewed: true } }
      );
    }

    res.json({
      code: "success",
      message: "CV details retrieved successfully!",
      infoCV: dataFinalCV,
      infoJob: dataFinalJob
    });

  } catch (error) {
    console.error("Error in detailCV:", error);
    res.json({
      code: "error",
      message: "System error, please try again later!"
    });
  }
};


export const changeStatusCVPatch = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.body.id;
    const status = req.body.status;

    const infoCV = await CV.findOne({
      _id: cvId
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Application not found!"
      });
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId
    });

    if (!infoJob) {
      return res.json({
        code: "error",
        message: "You do not have permission to change this application's status!"
      });
    }

    await CV.updateOne(
      { _id: cvId },
      {
        $set: { status: status }
      }
    );

    res.json({
      code: "success",
      message: "Status updated successfully!"
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({
      code: "error",
      message: "System error, please try again later!"
    });
  }
};

export const deleteCVDel = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "CV not found!"
      });
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId
    });

    if (!infoJob) {
      return res.json({
        code: "error",
        message: "You do not have permission to delete this CV!"
      });
    }

    await CV.deleteOne({
      _id: cvId
    });

    res.json({
      code: "success",
      message: "CV deleted successfully!"
    });

  } catch (error) {
    console.error("Delete CV Error:", error);
    res.json({
      code: "error",
      message: "System error, unable to delete CV!"
    });
  }
};

export const top = async (req: Request, res: Response) => {
  try {
    const topCompanyIds = await Job.aggregate([
      { $group: { _id: "$companyId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const result = [];
    for (const item of topCompanyIds) {
      const company = await AccountCompany.findOne({ _id: item._id });
      if (company) {
        result.push({
          id: company.id,
          companyName: company.companyName,
          totalJob: item.count
        });
      }
    }

    res.json({
      code: "success",
      message: "Top companies retrieved successfully!",
      companyList: result
    });
  } catch (error) {
    console.error("Error fetching top companies:", error);
    res.json({
      code: "error",
      message: "Server error!"
    });
  }
};
