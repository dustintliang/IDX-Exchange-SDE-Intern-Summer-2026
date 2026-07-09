const express = require("express");
const router = express.Router();
const pool = require("../db");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

router.get("/", async (req, res) => {
  const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;
  let { limit = DEFAULT_LIMIT, offset = 0 } = req.query;

  // Validate limit
  limit = parseInt(limit, 10);
  if (isNaN(limit) || limit <= 0 || limit > MAX_LIMIT) {
    return res.status(400).json({ error: `limit must be a positive integer between 1 and ${MAX_LIMIT}` });
  }

  // Validate offset
  offset = parseInt(offset, 10);
  if (isNaN(offset) || offset < 0) {
    return res.status(400).json({ error: "offset must be a non-negative integer" });
  }

  // Parse and validate optional numeric filters
  let parsedMinPrice, parsedMaxPrice, parsedBeds, parsedBaths;

  if (minPrice !== undefined && minPrice !== "") {
    parsedMinPrice = Number(minPrice);
    if (isNaN(parsedMinPrice) || parsedMinPrice < 0) {
      return res.status(400).json({ error: "minPrice must be a non-negative number" });
    }
  }
  if (maxPrice !== undefined && maxPrice !== "") {
    parsedMaxPrice = Number(maxPrice);
    if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
      return res.status(400).json({ error: "maxPrice must be a non-negative number" });
    }
  }
  if (beds !== undefined && beds !== "") {
    parsedBeds = parseInt(beds, 10);
    if (isNaN(parsedBeds) || parsedBeds <= 0) {
      return res.status(400).json({ error: "beds must be a positive integer" });
    }
  }
  if (baths !== undefined && baths !== "") {
    parsedBaths = Number(baths);
    if (isNaN(parsedBaths) || parsedBaths <= 0) {
      return res.status(400).json({ error: "baths must be a positive number" });
    }
  }

  // Build WHERE clause dynamically — each condition and its value are pushed
  // together so the positions in the values array always match the placeholders
  const conditions = [];
  const values = [];

  if (city) {
    conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
    values.push(city);
  }
  if (zipcode) {
    conditions.push("L_Zip = ?");
    values.push(zipcode);
  }
  if (parsedMinPrice !== undefined) {
    conditions.push("L_SystemPrice >= ?");
    values.push(parsedMinPrice);
  }
  if (parsedMaxPrice !== undefined) {
    conditions.push("L_SystemPrice <= ?");
    values.push(parsedMaxPrice);
  }
  if (parsedBeds !== undefined) {
    conditions.push("L_Keyword2 = ?");
    values.push(parsedBeds);
  }
  if (parsedBaths !== undefined) {
    conditions.push("LM_Dec_3 = ?");
    values.push(parsedBaths);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${where}`,
      values
    );

    const [results] = await pool.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip,
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude,
              L_Remarks, YearBuilt
       FROM rets_property ${where}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({ total, limit, offset, results });
  } catch (err) {
    res.status(500).json({ error: "Database error", message: err.message });
  }
});

const MAX_ID_LENGTH = 50;

function validateId(id, res) {
  if (!id || id.length > MAX_ID_LENGTH || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    res.status(400).json({ error: "Invalid listing ID format" });
    return false;
  }
  return true;
}

// Must be registered before /:id so Express doesn't swallow "openhouses" as an id
router.get("/:id/openhouses", async (req, res) => {
  const { id } = req.params;
  if (!validateId(id, res)) return;

  try {
    const [[property]] = await pool.query(
      "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?",
      [id]
    );
    if (!property) {
      return res.status(404).json({ error: `No property found with ID ${id}` });
    }

    const [openhouses] = await pool.query(
      `SELECT L_ListingID, OpenHouseDate, OH_StartTime, OH_EndTime, all_data
       FROM rets_openhouse
       WHERE L_ListingID = ?
       ORDER BY OpenHouseDate ASC, OH_StartTime ASC`,
      [id]
    );

    res.json(openhouses);
  } catch (err) {
    res.status(500).json({ error: "Database error", message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateId(id, res)) return;

  try {
    const [[property]] = await pool.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip,
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3,
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude,
              L_Remarks, YearBuilt
       FROM rets_property WHERE L_ListingID = ?`,
      [id]
    );

    if (!property) {
      return res.status(404).json({ error: `No property found with ID ${id}` });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Database error", message: err.message });
  }
});

module.exports = router;
