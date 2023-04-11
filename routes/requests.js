const express = require("express");
const modelRequests = require("../models/Requests");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();

/**
 * @openapi
 * /requests:
 *  get:
 *    name: Requests
 *    description: Requests Statistics endpoint.
 *    responses:
 *      200:
 *        description: Get list of all requests.
 *        content:
 *          application/json:
 *            schemas:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Requests'
 *  parameters: null
 */
router.get("/requests", async (req, res) => {
  try {
    const requests = await modelRequests.findOne({ name: "requests" });
    return res.status(StatusCodes.OK).json({ requests });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No Request statistics available." });
  }
});

module.exports = router;
