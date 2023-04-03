import { PrismaClient } from "@prisma/client";
import rawImages from "./rawImages.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Luciano",
      reports: {
        create: {
          title: "A big hole bruh",
          description: "just by my road entrance.",
          lat: 51.509553909846964,
          lng: -0.1517327791193135,
          images: {
            create: {
              hash: rawImages.image1[0],
            },
          },
        },
      },
    },
  });

  await prisma.report.create({
    data: {
      title: "🙄",
      description: "They must fix it now or I am calling the manager!",
      lat: 51.53101843530777,
      lng: -0.17431333472840427,
      author: {
        connect: {
          name: "Luciano",
        },
      },
      images: {
        create: {
          hash: rawImages.image2[0],
        },
      },
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      reports: true,
    },
  });

  console.dir(`🟢 Users created: ${allUsers}`, { depth: 1 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
