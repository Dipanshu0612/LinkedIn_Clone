import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="h-6 w-6 text-[#0a66c2]" />
          <h1 className="text-xl font-semibold">Jobs</h1>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Discover roles that match your profile and interests.
        </p>

        <div className="space-y-3">
          {[
            {
              title: "Frontend Developer",
              company: "TechNova",
              location: "Bengaluru",
            },
            {
              title: "Full Stack Engineer",
              company: "CloudPeak",
              location: "Remote",
            },
            {
              title: "Backend Developer",
              company: "DataNest",
              location: "Pune",
            },
          ].map((job) => (
            <div
              key={job.title + job.company}
              className="border rounded-md p-4"
            >
              <p className="font-medium">{job.title}</p>
              <p className="text-sm text-gray-600">
                {job.company} • {job.location}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Link href="/" className="text-sm text-[#0a66c2] hover:underline">
            Back to Home Feed
          </Link>
        </div>
      </div>
    </main>
  );
}
