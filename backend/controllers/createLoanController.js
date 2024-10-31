const Loan = require('../models/loan.js'); // Import the Loan model
const Auth = require('../models/user.js'); // Assuming an Auth model for user validation
const mongoose = require('mongoose');

module.exports.createLoanController = async (req, res) => {
    const { amount, terms, user_id, startDate } = req.body; // Expect startDate in "YYYY-MM-DD" format

    if (!amount || !terms || !user_id || !startDate) {
      return res.status(400).json({ error: 'All fields are required: amount, terms, user_id, startDate' });
    }

    try {
      // Validate user exists
      const user = await Auth.findById(user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate the repayment amount
      const repaymentAmount = (amount / terms).toFixed(2);
      const repayments = [];

      // Generate repayment schedule
      let currentDate = new Date(startDate);
      for (let i = 0; i < terms; i++) {
        const repaymentDate = new Date(currentDate.setDate(currentDate.getDate() + 7 * (i + 1)));
        const repayment = {
          date: repaymentDate.toISOString().split('T')[0],
          amount: i === terms - 1 ? (amount - repaymentAmount * (terms - 1)).toFixed(2) : repaymentAmount, // Adjust last repayment
          status: 'pending'
        };
        repayments.push(repayment);
      }

      // Ensure user_id is an ObjectId
      const userIdObject = mongoose.Types.ObjectId.isValid(user_id) ? user_id : mongoose.Types.ObjectId(user_id);

      // Create the loan with repayments
      const loan = await new Loan({
        amount,
        terms,
        user_id: userIdObject, // Ensure this is an ObjectId
        status: 'pending',
        outStanding: amount,
        remainingAmount: amount,
        repayments,
      }).save();

      res.status(201).json({ success: true, message: 'Loan created successfully', loan });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error: Unable to create loan' });
    }
};
