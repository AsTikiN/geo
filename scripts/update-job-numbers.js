const { prisma } = require("@/lib/prisma");
const { v4: uuidv4 } = require("uuid");

async function updateAllJobNumbers() {
  const pits = await prisma.pit.findMany();
  for (const pit of pits) {
    await prisma.pit.update({
      where: { id: pit.id },
      data: { jobNumber: uuidv4() },
    });
    console.log(`Updated pit ${pit.id}`);
  }
  await prisma.$disconnect();
}

updateAllJobNumbers();
