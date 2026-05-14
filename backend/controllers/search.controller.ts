import { Request, Response } from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import City from "../models/city.model";

export const search = async (req: Request, res: Response) => {
  const dataFinal = [];
  let totalRecord = 0;
  let totalPage = 1;

  try {
    const find: any = {};

    const language = req.query.language as string;
    const cityQuery = req.query.city as string;

    if (language) {
      find.technologies = { $regex: language, $options: "i" };
    }

    if (cityQuery) {
      const cityInfo = await City.findOne({
        name: { $regex: cityQuery, $options: "i" }
      } as any);

      if (cityInfo) {
        const listAccountCompanyInCity = await AccountCompany.find({
          city: cityInfo._id.toString()
        } as any);

        const companyIds = listAccountCompanyInCity.map((item: any) => item._id.toString());

        find.companyId = {
          $in: companyIds
        };
      } else {
        return res.json({ code: "success", message: "No city found!", jobs: [], totalRecord: 0, totalPage: 1 });
      }
    }

    if (req.query.company) {
      const accountCompany = await AccountCompany.findOne({
        companyName: req.query.company
      });

      find.companyId = accountCompany?.id;
    }

    // A safer way to handle this
    if (req.query.keyword) {
      // Escape special characters to prevent ReDoS
      const keyword = req.query.keyword as string;

      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      find.title = { $regex: escapedKeyword, $options: "i" };
    }

    if (req.query.position) {
      find.position = req.query.position as string;
    }

    if (req.query.workingForm) {
      find.workingForm = req.query.workingForm as string;
    }

    const limitItems = 9;
    let page = 1;

    if (req.query.page) {
      page = parseInt(`${req.query.page}`);
    }

    totalRecord = await Job.countDocuments(find);
    totalPage = Math.ceil(totalRecord / limitItems);

    const skip = (page - 1) * limitItems;

    const jobs = await Job.find(find).sort({ createdAt: "desc" } as any).skip(skip).limit(limitItems);

    for (const item of jobs) {
      const itemFinal: any = {
        id: item._id,
        title: item.title,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        technologies: item.technologies,
        companyLogo: "",
        companyName: "",
        companyCity: ""
      };

      if (item.companyId) {
        const companyInfo = await AccountCompany.findOne({ _id: item.companyId } as any);

        if (companyInfo) {
          itemFinal.companyLogo = companyInfo.logo;
          itemFinal.companyName = companyInfo.companyName;

          if (companyInfo.city) {
            const cityData = await City.findOne({ _id: companyInfo.city } as any);
            itemFinal.companyCity = cityData ? cityData.name : "N/A";
          }
        }
      }
      dataFinal.push(itemFinal);
    }

    res.json({
      code: "success",
      message: "Success!",
      jobs: dataFinal,
      totalRecord: totalRecord,
      totalPage: totalPage
    });

  } catch (error) {
    console.error("Search API error:", error);
    res.json({
      code: "error",
      message: "System error!"
    });
  }
};