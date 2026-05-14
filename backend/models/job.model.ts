import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
    },
    workingForm: {
      type: String,
    },
    technologies: {
      type: [String],
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema, "jobs");

export default Job;
