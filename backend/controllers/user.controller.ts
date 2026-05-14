import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import CV from "../models/cv.model";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";


export const registerPost = async (req: AccountRequest, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("Received data from frontend:", { fullName, email, password });

    const existAccount = await AccountUser.findOne({
      email: email,
    });

    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAccount = new AccountUser({
      fullName: fullName,
      email: email,
      password: passwordHash,
      avatar: "",
      phone: "",
    });

    await newAccount.save();

    res.json({
      code: "success",
      message: "Account registered successfully!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "An error occurred, please try again later!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existAccount = await AccountUser.findOne({ email: email });

    if (!existAccount) {
      return res.json({
        code: "error",
        message: "Email not found!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existAccount.password);

    if (!isPasswordValid) {
      return res.json({
        code: "error",
        message: "Incorrect password!",
      });
    }

    const token = jwt.sign(
      {
        id: existAccount._id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({
      code: "success",
      message: "Login successful!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "An error occurred, please try again later!",
    });
  }
};

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountUser.updateOne(
      {
        _id: req.account._id
      },
      req.body
    );

    return res.json({
      code: "success",
      message: "Updated successfully!"
    });

  } catch (error) {
    console.error("Profile Patch Error:", error);
    return res.json({
      code: "error",
      message: "Update failed!"
    });
  }
}

export const listCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;

    const listCV = await CV.find({
      email: userEmail
    }).sort({
      createdAt: "desc"
    });

    const dataFinal = [];

    for (const item of listCV) {
      const dataItemFinal = {
        id: item.id,
        jobTitle: "",
        companyName: "",
        jobSalaryMin: 0,
        jobSalaryMax: 0,
        jobPosition: "",
        jobWorkingForm: "",
        status: item.status
      };

      const infoJob = await Job.findOne({
        _id: item.jobId
      });

      if (infoJob) {
        dataItemFinal.jobTitle = `${infoJob.title}`;
        dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
        dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
        dataItemFinal.jobPosition = `${infoJob.position}`;
        dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

        const infoCompany = await AccountCompany.findOne({
          _id: infoJob.companyId
        });

        if (infoCompany) {
          dataItemFinal.companyName = `${infoCompany.companyName}`;
          dataFinal.push(dataItemFinal);
        }
      }
    }

    res.json({
      code: "success",
      message: "CV list retrieved successfully!",
      listCV: dataFinal
    });

  } catch (error) {
    res.json({
      code: "error",
      message: "Failed!"
    });
  }
};

export const detailCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId,
      email: userEmail
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Application not found or access denied!"
      });
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId
    });

    const dataFinalCV = {
      id: infoCV.id,
      fullName: infoCV.fullName,
      email: infoCV.email,
      phone: infoCV.phone,
      fileCV: infoCV.fileCV,
      status: infoCV.status
    };

    let dataFinalJob: any = null;
    if (infoJob) {
      dataFinalJob = {
        id: infoJob.id,
        title: infoJob.title,
        salaryMin: infoJob.salaryMin,
        salaryMax: infoJob.salaryMax,
        position: infoJob.position,
        workingForm: infoJob.workingForm,
        technologies: infoJob.technologies,
      };

      const infoCompany = await AccountCompany.findOne({ _id: infoJob.companyId });
      if (infoCompany) {
        dataFinalJob.companyName = infoCompany.companyName;
      }
    }

    res.json({
      code: "success",
      message: "Success!",
      infoCV: dataFinalCV,
      infoJob: dataFinalJob
    });

  } catch (error) {
    console.error("Detail CV Error:", error);
    res.json({
      code: "error",
      message: "System error, please try again later!"
    });
  }
};

export const deleteCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId,
      email: userEmail
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Application not found or delete access denied!"
      });
    }

    await CV.deleteOne({
      _id: cvId,
      email: userEmail
    });

    res.json({
      code: "success",
      message: "Application withdrawn successfully!"
    });

  } catch (error) {
    console.error("Delete CV Error:", error);
    res.json({
      code: "error",
      message: "System error, please try again later!"
    });
  }
};
