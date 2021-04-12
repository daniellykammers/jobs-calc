const Profile = require("../model/Profile");
const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  async index(req, res) {
    const profile = await Profile.get();
    const jobs = await Job.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      // somando a quantidade de status
      statusCount[status] += 1;

      // total de h/dia de jobs em progress
      jobTotalHours =
        status == "progress"
          ? (jobTotalHours += Number(job["daily-hours"]))
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
