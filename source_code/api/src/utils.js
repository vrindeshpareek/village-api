function toDropdownVillage(record) {
  return {
    value: record.id,
    label: record.name,
    fullAddress: `${record.name}, ${record.subDistrict.name}, ${record.district.name}, ${record.state.name}, ${record.country.name}`,
    hierarchy: {
      village: record.name,
      subDistrict: record.subDistrict.name,
      district: record.district.name,
      state: record.state.name,
      country: record.country.name
    }
  };
}

function ok(req, res, data, extra = {}) {
  const payload = {
    success: true,
    count: Array.isArray(data) ? data.length : data ? 1 : 0,
    data,
    meta: {
      requestId: req.requestId,
      responseTime: Date.now() - req.startedAt,
      rateLimit: req.rateLimitMeta || {
        remaining: 4850,
        limit: 5000,
        reset: new Date(Date.now() + 86400000).toISOString()
      },
      ...extra
    }
  };
  res.json(payload);
}

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = { toDropdownVillage, ok, ApiError };
