import prisma from "../src/utils/prisma";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "admin" },
      { name: "teacher" },
      { name: "student" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("Roles seeded"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
