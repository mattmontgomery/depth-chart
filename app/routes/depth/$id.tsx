import { ActionFunction, LoaderFunction, Response } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Reorder } from "framer-motion";

import { deleteDepth, getDepth, updateDepth } from "~/models/depth.server";
import type { Depth } from "~/models/depth.server";
import { requireUserId } from "~/session.server";
import { useEffect, useState } from "react";

type LoaderData = {
  depth: Depth;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  const depth = await getDepth({ userId, id: params.id });
  if (!depth) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ depth });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");
  if (request.method === "DELETE") {
    const deleted = await deleteDepth({ userId, id: params.id });
    if (deleted.count > 0) {
      return redirect("/depth");
    }
    throw new Response("Not Found", { status: 404 });
  } else if (request.method === "POST") {
    const body = await request.formData();
    const found = await getDepth({ id: params.id, userId });
    if (!found) {
      throw new Response("Not found", { status: 404 });
    }
    await updateDepth({
      id: params.id,
      team: found?.team,
      goalkeepers: (body.get("goalkeepers") as string)?.split(",") || [],
      defenders: (body.get("defenders") as string)?.split(",") || [],
      midfielders: (body.get("midfielders") as string)?.split(",") || [],
      forwards: (body.get("forwards") as string)?.split(",") || [],
      userId,
    });
    return redirect(`/depth/${params.id}`);
  }
};

function PlayerList({
  list,
  onCommit,
}: {
  list: string[];
  onCommit: (list: string[]) => void;
}) {
  const [players, setPlayers] = useState(list);
  useEffect(() => setPlayers(list), [list]);
  return (
    <div>
      <Reorder.Group values={players} onReorder={setPlayers}>
        {players.map((player) => (
          <Reorder.Item key={player} value={player}>
            {player}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button
        onClick={() => onCommit(players)}
        className="rounded bg-green-700  py-2 px-4 text-sm text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Commit Changes
      </button>
    </div>
  );
}

export default function DetailsPage() {
  const data = useLoaderData() as LoaderData;
  const [players, setPlayers] = useState<
    Pick<Depth, "goalkeepers" | "defenders" | "midfielders" | "forwards">
  >({
    goalkeepers: data.depth.goalkeepers,
    defenders: data.depth.defenders,
    midfielders: data.depth.midfielders,
    forwards: data.depth.forwards,
  });
  return (
    <div>
      <Form method="post">
        <h3 className="text-2xl font-bold">{data.depth.team}</h3>
        <input type="hidden" name="goalkeepers" value={players.goalkeepers} />
        <input type="hidden" name="defenders" value={players.defenders} />
        <input type="hidden" name="midfielders" value={players.midfielders} />
        <input type="hidden" name="forwards" value={players.forwards} />
        <p className="py-6">
          <h4 className="text-xl font-bold">Goalkeepers</h4>
          <PlayerList
            list={data.depth.goalkeepers}
            onCommit={(list) => setPlayers({ ...players, goalkeepers: list })}
          />
        </p>
        <p className="py-6">
          <h4 className="text-xl font-bold">Defenders</h4>
          <PlayerList
            list={data.depth.defenders}
            onCommit={(list) => setPlayers({ ...players, defenders: list })}
          />
        </p>
        <p className="py-6">
          <h4 className="text-xl font-bold">Midfielders</h4>
          <PlayerList
            list={data.depth.midfielders}
            onCommit={(list) => setPlayers({ ...players, midfielders: list })}
          />
        </p>
        <p className="py-6">
          <h4 className="text-xl font-bold">Forwards</h4>
          <PlayerList
            list={data.depth.forwards}
            onCommit={(list) => setPlayers({ ...players, forwards: list })}
          />
        </p>
      </Form>
      <hr className="my-4" />
      <Form method="delete">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Depth chart not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
