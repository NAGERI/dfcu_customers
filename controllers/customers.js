/**
 * @swagger
 * components:
 *  schemas:
 *    Loans:
 *      type: object
 *      description: It contains the details of a loan, that belongs to a customer.
 *      required:
 *        - loan_id
 *      properties:
 *        loan_id:
 *          type: string
 *          description: uniquire loan Identifier.
 *        date_disbursed:
 *          type: date
 *          description: Date when the loan was given out.
 *        outstanding_amount:
 *          type: integer
 *          format: int64
 *          description: The outstandnig amount for this loan to be cleared..
 *    Customers:
 *      type: object
 *      description: This is the customers Model
 *      required:
 *        - account_id
 *      properties:
 *        account_id :
 *          type: string
 *          required: true
 *          description: Account identifier, should contains ten digits.
 *        loan_status:
 *          type: string
 *          description: The status of a customers loan
 *        loans:
 *          description: Array that contains the loan Identifiers, that belong to one account.
 *          type: Array
 *
 *    Requests:
 *      type: object
 *      description: This is the requests model, it keeps track of the success and failed API requests.
 *      properties:
 *        name:
 *          type: string
 *          description: The name for querying.
 *        hit_loans:
 *          type: interger
 *          format: int64
 *          description: The number of positive requests.
 *        miss_loans:
 *          type: interger
 *          format: int64
 *          description: The number of failed requests.
 *        validatons:
 *          type: Number
 *          description: The number of failed validations.
 */

const path = require("path");

const { modelCustomer, modelLoan } = require("../models/customer");
const modelRequests = require("../models/Requests");
const { StatusCodes } = require("http-status-codes");

/**
 * @swagger
 * /customers/{account_id}:
 *   get:
 *     description: Returns a customer based on account_id.
 *     operationId: getCustomerByAccount
 *     summary: Returns customer details for a given account_id
 *     responses:
 *       200:
 *         description: Gets all details of a customer, if they have outstanding loan.
 *         operationId: getCustomers
 *         content:
 *           application/json:
 *             schemas:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customers'
 *       404:
 *          description: Customer with ${account_id} not found.
 *          content:
 *            application/json:
 *              schema:
 *                Error:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: error message
 *                    code:
 *                      type: string
 *                      description: error code number
 *       406:
 *          description: Invalid ${account_id} length.
 *          content:
 *            application/json:
 *              schema:
 *                Error:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: error message
 *                    code:
 *                      type: string
 *                      description: error code number
 *   parameters:
 *   - name: account_id
 *     in: path
 *     description: account ID of a customer
 *     required: true
 */
const getCustomerByAccount = async (req, res) => {
  const { account_id } = req.params;
  let loan_ids = [];
  let loan_array = [];

  try {
    if (account_id) {
      if (account_id.length < 10 || account_id.length > 10)
        return res
          .status(StatusCodes.NOT_ACCEPTABLE)
          .json({ msg: "Account Number length not valid" });
      await modelRequests.updateOne(
        { name: "requests" },
        {
          $inc: { validation: 1 },
        }
      );
    } else {
      await modelRequests.updateOne(
        { name: "requests" },
        {
          $inc: { validation: 1 },
        }
      );
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Please provide Account Number" });
    }
    const customer_raw = await modelCustomer.findOne({ account_id });
    if (!customer_raw) {
      await modelRequests.updateOne(
        { name: "requests" },
        {
          $inc: { validation: 1 },
        }
      );
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No customer with account number ${account_id}` });
    }
    if (!customer_raw.loans) {
      await modelRequests.updateOne(
        { name: "requests" },
        {
          $inc: { miss_loan: 1 },
        }
      );
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No loan found" });
    }
    customer_raw.loans.map((x) => {
      loan_ids.push(x);
    });

    for (i = 0; i < loan_ids.length; i++) {
      let loan_details = await modelLoan.findOne({ loan_id: loan_ids[i] });
      console.log(loan_details);
      // console.log("Directory  ", path.dirname(__filename));

      const reques = await modelRequests.updateOne(
        { name: "requests" },
        {
          $inc: { hit_loan: 1 },
        }
      );

      loan_json = {
        customer_id: loan_details.customer_id,
        loan_id: loan_details.loan_id,
        date_disbursed: loan_details.date_disbursed,
        outstanding_amount: loan_details.outstanding_amount,
      };
      loan_array.push(loan_json);
    }

    customers = {
      account_id: customer_raw.account_id,
      loan_status: customer_raw.loan_status,
      loans: loan_array,
    };

    return res.status(StatusCodes.OK).json({ customers });
  } catch (error) {
    console.error(error.message);
    await modelRequests.updateOne(
      { name: "requests" },
      {
        $inc: { validation: 1 },
      }
    );

    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Customer not found" });
  }
};

/**
 * @swagger
 * /customers:
 *   get:
 *     description: Returns all customers available.
 *     operationId: getCustomers
 *     summary: Lists all customers
 *     responses:
 *       200:
 *         description: Get list of all customers.
 *         operationId: getCustomers
 *         content:
 *           application/json:
 *             schemas:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customers'
 *       500:
 *         description: Intenal Server Error.
 *         operationId: getCustomers
 */
const getCustomers = async (req, res) => {
  try {
    const customers = await modelCustomer.find({});
    res
      .status(StatusCodes.OK)
      .json({ customers: customers, count: customers.length });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error Occured" });
  }
};

module.exports = {
  getCustomerByAccount,
  getCustomers,
};
