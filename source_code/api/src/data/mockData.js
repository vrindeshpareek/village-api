const geography = [
  {
    country: { id: "country_in", code: "IN", name: "India" },
    state: { id: "state_27", code: "27", name: "Maharashtra" },
    district: { id: "district_497", code: "497", name: "Nandurbar" },
    subDistrict: { id: "subdistrict_03950", code: "03950", name: "Akkalkuwa" },
    villages: [
      { id: "village_id_525002", code: "525002", name: "Manibeli" },
      { id: "village_id_525003", code: "525003", name: "Dhankhedi" },
      { id: "village_id_525004", code: "525004", name: "Chimalkhadi" },
      { id: "village_id_525005", code: "525005", name: "Sinduri" },
      { id: "village_id_525006", code: "525006", name: "Akkalkuwa" },
      { id: "village_id_525007", code: "525007", name: "Molgi" }
    ]
  },
  {
    country: { id: "country_in", code: "IN", name: "India" },
    state: { id: "state_29", code: "29", name: "Karnataka" },
    district: { id: "district_572", code: "572", name: "Bengaluru Rural" },
    subDistrict: { id: "subdistrict_05541", code: "05541", name: "Devanahalli" },
    villages: [
      { id: "village_id_612301", code: "612301", name: "Bettakote" },
      { id: "village_id_612302", code: "612302", name: "Avathi" },
      { id: "village_id_612303", code: "612303", name: "Vishwanathapura" }
    ]
  },
  {
    country: { id: "country_in", code: "IN", name: "India" },
    state: { id: "state_33", code: "33", name: "Tamil Nadu" },
    district: { id: "district_603", code: "603", name: "Coimbatore" },
    subDistrict: { id: "subdistrict_05881", code: "05881", name: "Pollachi" },
    villages: [
      { id: "village_id_644120", code: "644120", name: "Anaimalai" },
      { id: "village_id_644121", code: "644121", name: "Kottur" },
      { id: "village_id_644122", code: "644122", name: "Samathur" }
    ]
  }
];

function flattenVillages() {
  return geography.flatMap((row) =>
    row.villages.map((village) => ({
      ...village,
      subDistrict: row.subDistrict,
      district: row.district,
      state: row.state,
      country: row.country
    }))
  );
}

const users = [
  {
    id: "user_demo",
    email: "demo@business.com",
    businessName: "Demo Logistics Pvt Ltd",
    status: "ACTIVE",
    planType: "FREE",
    dailyLimit: 5000,
    todayRequests: 150,
    apiKeys: [{ id: "key_demo", key: "ak_demo_public_key_for_presentations", name: "Demo Presentation Key", status: "ACTIVE" }]
  },
  {
    id: "user_premium",
    email: "ops@bharatcart.example",
    businessName: "BharatCart",
    status: "ACTIVE",
    planType: "PREMIUM",
    dailyLimit: 50000,
    todayRequests: 18200,
    apiKeys: [{ id: "key_premium", key: "ak_premium_sample_key_1234567890abcd", name: "Production Server", status: "ACTIVE" }]
  }
];

module.exports = {
  geography,
  villages: flattenVillages(),
  users
};
