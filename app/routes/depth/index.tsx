import { Link } from "@remix-run/react";

export default function DepthIndexPage() {
  return (
    <p>
      No depth chart selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new depth chart.
      </Link>
    </p>
  );
}
