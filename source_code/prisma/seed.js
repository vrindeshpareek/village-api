const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const india = await prisma.country.upsert({
    where: { code: "IN" },
    update: {},
    create: { code: "IN", name: "India" }
  });

  const maharashtra = await prisma.state.upsert({
    where: { countryId_code: { countryId: india.id, code: "27" } },
    update: { name: "Maharashtra" },
    create: { code: "27", name: "Maharashtra", countryId: india.id }
  });

  const nandurbar = await prisma.district.upsert({
    where: { stateId_code: { stateId: maharashtra.id, code: "497" } },
    update: { name: "Nandurbar" },
    create: { code: "497", name: "Nandurbar", stateId: maharashtra.id }
  });

  const akkalkuwa = await prisma.subDistrict.upsert({
    where: { districtId_code: { districtId: nandurbar.id, code: "03950" } },
    update: { name: "Akkalkuwa" },
    create: { code: "03950", name: "Akkalkuwa", districtId: nandurbar.id }
  });

  for (const village of [
    ["525002", "Manibeli"],
    ["525003", "Dhankhedi"],
    ["525004", "Chimalkhadi"],
    ["525005", "Sinduri"]
  ]) {
    await prisma.village.upsert({
      where: { subDistrictId_code: { subDistrictId: akkalkuwa.id, code: village[0] } },
      update: { name: village[1] },
      create: { code: village[0], name: village[1], subDistrictId: akkalkuwa.id }
    });
  }

  const user = await prisma.user.upsert({
    where: { email: "demo@business.com" },
    update: {},
    create: {
      email: "demo@business.com",
      businessName: "Demo Logistics Pvt Ltd",
      passwordHash: await bcrypt.hash("Demo@1234", 12),
      status: "ACTIVE",
      planType: "FREE"
    }
  });

  await prisma.apiKey.upsert({
    where: { key: "ak_demo_public_key_for_presentations" },
    update: {},
    create: {
      name: "Demo Presentation Key",
      key: "ak_demo_public_key_for_presentations",
      secretHash: await bcrypt.hash("as_demo_secret_for_write_operations", 12),
      userId: user.id
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
