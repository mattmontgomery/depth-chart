import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getDepthListItems } from "~/models/depth.server";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

type LoaderData = {
  depthListItems: Awaited<ReturnType<typeof getDepthListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const depthListItems = await getDepthListItems({ userId });
  return json<LoaderData>({ depthListItems });
};

export default function DepthChart() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Depth Chart
          </Link>

          <hr />

          {data.depthListItems.length === 0 ? (
            <p className="p-4">No depth charts yet</p>
          ) : (
            <ol>
              {data.depthListItems.map(({ id, team }) => (
                <li key={id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={id}
                  >
                    📝 {team}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
