import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

/**
 * Model Note
 *
 */
export type Depth = {
  id: string;
  team: string;
  goalkeepers: string[];
  defenders: string[];
  midfielders: string[];
  forwards: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export function getDepth({
  id,
  userId,
}: Pick<Depth, "id"> & {
  userId: User["id"];
}) {
  return prisma.depth.findFirst({
    where: { id, userId },
  });
}

export function getDepthListItems({ userId }: { userId: User["id"] }) {
  return prisma.depth.findMany({
    where: { userId },
    select: { id: true, team: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createDepth({
  team,
  goalkeepers,
  defenders,
  midfielders,
  forwards,
  userId,
}: Pick<
  Depth,
  "team" | "goalkeepers" | "defenders" | "midfielders" | "forwards"
> & {
  userId: User["id"];
}) {
  return prisma.depth.create({
    data: {
      team,
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function deleteDepth({
  id,
  userId,
}: Pick<Depth, "id"> & { userId: User["id"] }) {
  return prisma.depth.deleteMany({
    where: { id, userId },
  });
}

export async function updateDepth({
  id,
  goalkeepers,
  defenders,
  midfielders,
  forwards,
  team,
  userId,
}: Pick<
  Depth,
  "id" | "goalkeepers" | "defenders" | "midfielders" | "forwards" | "team"
> & { userId: User["id"] }) {
  const updated = await prisma.depth.updateMany({
    where: { id, userId },
    data: {
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      team,
    },
  });
  return updated;
}
