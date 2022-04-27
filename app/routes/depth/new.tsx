import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createDepth } from "~/models/depth.server";

import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    team?: string;
    players?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const team = formData.get("team");
  const goalkeepers = formData.get("goalkeepers");
  const defenders = formData.get("defenders");
  const midfielders = formData.get("midfielders");
  const forwards = formData.get("forwards");

  if (typeof team !== "string" || team.length === 0) {
    return json<ActionData>(
      { errors: { team: "Team is required" } },
      { status: 400 }
    );
  }

  const depth = await createDepth({
    team,
    goalkeepers: goalkeepers?.toString().split(`\n`) || [],
    defenders: defenders?.toString().split(`\n`) || [],
    midfielders: midfielders?.toString().split(`\n`) || [],
    forwards: forwards?.toString().split(`\n`) || [],
    userId,
  });

  return redirect(`/depth/${depth.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.team) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Team: </span>
          <input
            ref={titleRef}
            name="team"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.team ? true : undefined}
            aria-errormessage={
              actionData?.errors?.team ? "team-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.team && (
          <div className="pt-1 text-red-700" id="team-error">
            {actionData.errors.team}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Goalkeepers: </span>
          <textarea
            name="goalkeepers"
            rows={4}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Defenders: </span>
          <textarea
            name="defenders"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Midfielders: </span>
          <textarea
            name="midfielders"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Forwards: </span>
          <textarea
            name="forwards"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
