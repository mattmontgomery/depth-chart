import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "montgomery.matt@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("nDJ3fcM8K$Jm?5Qk", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.depth.create({
    data: {
      team: "RSL 2022",
      goalkeepers: "Ochoa,Dewsnup,MacMath,Beavers,Gomez".split(","),
      defenders:
        "Brody,Farnsworth,Glad,Halsey,Herrera,Holt,Kappelhof,Orozco,Schmitt,Silva".split(
          ","
        ),
      midfielders:
        "Benitez,Besler,Caldwell,Chang,Davis,Kreilach,Luiz,Ruiz,Wellings".split(
          ","
        ),
      forwards:
        "Kei,Córdova,Fonseca,Garcia,Menendez,Meram,Rubin,Subah,Wood".split(","),
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
