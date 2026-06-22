const { prisma } = require("../db");
const { geography, villages } = require("../data/mockData");
const { toDropdownVillage } = require("../utils");

const includeHierarchy = {
  subDistrict: {
    include: {
      district: {
        include: {
          state: {
            include: { country: true }
          }
        }
      }
    }
  }
};

function normalizePrismaVillage(village) {
  return {
    id: village.id,
    code: village.code,
    name: village.name,
    subDistrict: village.subDistrict,
    district: village.subDistrict.district,
    state: village.subDistrict.district.state,
    country: village.subDistrict.district.state.country
  };
}

async function searchVillages({ q, state, district, subDistrict, limit = 25 }) {
  if (q && q.length < 2) return [];
  if (prisma) {
    const rows = await prisma.village.findMany({
      take: Number(limit),
      where: {
        status: "ACTIVE",
        name: q ? { contains: q, mode: "insensitive" } : undefined,
        subDistrict: {
          name: subDistrict ? { equals: subDistrict, mode: "insensitive" } : undefined,
          district: {
            name: district ? { equals: district, mode: "insensitive" } : undefined,
            state: { name: state ? { equals: state, mode: "insensitive" } : undefined }
          }
        }
      },
      include: includeHierarchy,
      orderBy: { name: "asc" }
    });
    return rows.map(normalizePrismaVillage).map(toDropdownVillage);
  }

  const term = (q || "").toLowerCase();
  return villages
    .filter((village) => !term || village.name.toLowerCase().includes(term))
    .filter((village) => !state || village.state.name.toLowerCase() === state.toLowerCase())
    .filter((village) => !district || village.district.name.toLowerCase() === district.toLowerCase())
    .filter((village) => !subDistrict || village.subDistrict.name.toLowerCase() === subDistrict.toLowerCase())
    .slice(0, Number(limit))
    .map(toDropdownVillage);
}

async function listStates() {
  if (prisma) return prisma.state.findMany({ orderBy: { name: "asc" } });
  return geography.map((row) => row.state).filter((state, index, all) => all.findIndex((item) => item.id === state.id) === index);
}

async function districtsByState(stateId) {
  if (prisma) return prisma.district.findMany({ where: { stateId }, orderBy: { name: "asc" } });
  return geography.filter((row) => row.state.id === stateId).map((row) => row.district);
}

async function subDistrictsByDistrict(districtId) {
  if (prisma) return prisma.subDistrict.findMany({ where: { districtId }, orderBy: { name: "asc" } });
  return geography.filter((row) => row.district.id === districtId).map((row) => row.subDistrict);
}

async function villagesBySubDistrict(subDistrictId, page = 1, limit = 500) {
  const take = Math.min(Number(limit), 10000);
  const skip = (Number(page) - 1) * take;
  if (prisma) {
    return prisma.village.findMany({ where: { subDistrictId }, orderBy: { name: "asc" }, skip, take });
  }
  return villages.filter((village) => village.subDistrict.id === subDistrictId).slice(skip, skip + take);
}

module.exports = {
  searchVillages,
  listStates,
  districtsByState,
  subDistrictsByDistrict,
  villagesBySubDistrict
};
