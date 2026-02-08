import { UsersIcon } from "lucide-react";
import Link from "next/link";

export default function NetworkPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-3">
          <UsersIcon className="h-6 w-6 text-[#0a66c2]" />
          <h1 className="text-xl font-semibold">My Network</h1>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Grow your network by connecting with people from your industry.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Follow more creators",
            "Import professional contacts",
            "Suggested connections",
            "People from your company",
          ].map((item) => (
            <div
              key={item}
              className="border rounded-md p-3 text-sm bg-gray-50"
            >
              {item}
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
