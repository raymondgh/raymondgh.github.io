

// var loanSample = {
//    "principal":2680.31,
//    "borrower":{
//       "name":"Hay Darris",
//       "email":"rgh@honey.bear",
//       "phone":"4445552929"
//    },
//    "disbursement_date":1475499600,
//    "interest_rate":4.0,
//    "lender":{
//       "name":"Sassafras R",
//       "email":"blackeyes@panda.bear",
//       "phone":"6269590101"
//    },
//    "payment_history": [
//    		{"date": 1476277200, "amount": 40},
//    		{"date": 1475141200, "amount": 30},
//          {"date": 1477141200, "amount": 20},
//          {"date": 1477141269, "amount": 21}
//    ]
// };


// principal 2680.31
// paid 30$ on 12th and 22nd


var loanSample = {
   "principal":2680.31,
   "disbursement_date":1475499600000,
   "interest_rate":.04,
   "payment_history": [
         {"date": 1476255600000, "amount": 30},
         {"date": 1477119600000, "amount": 30},
         {"date": 1477897200000, "amount": 0},
         {"date": 1477983600000, "amount": 0}
   ]
};





function totalPaid(payment_history) {
	if (payment_history.length == 0) return 0;
   return payment_history
       .map(function(payment) { return parseFloat(payment.amount); })
       .reduce(function(paymentAmount, nextPaymentAmount) { return paymentAmount + nextPaymentAmount; }, 0);
}

function totalInterest(principal, rate, disbursement_date, payment_history, today) {
   return (
       currentBalance(principal, rate, disbursement_date, payment_history, today) - 
       currentBalance(principal, 0, disbursement_date, payment_history, today)
   )
}

function dateOfLastPayment(payment_history) {
	// Check if there are any payments first
   // Return false if no payments have been made yet
	if (payment_history.length > 0) {
	   var paymentTimestamp = payment_history[payment_history.length - 1].date;
	   var paymentDate = new Date(paymentTimestamp);
	   return paymentDate;
	} else {
		return false;
	}
}

//console.log(dateOfLastPayment(loanSample.payment_history));

function amountOfLastPayment(payment_history) {
	// Check if there are any payments first
	// Return 0 if no payments have been made yet
	if (payment_history.length > 0)
   	return payment_history[payment_history.length - 1].amount;
	else
		return 0;
}

//console.log(amountOfLastPayment(loanSample.payment_history));


function currentBalanceFromLoan(loan) {
   return currentBalance(
      loan.principal,
      loan.interest_rate,
      loan.disbursement_date,
      loan.payment_history,
      new Date().getTime()
   )
}

function currentBalance(principal, rate, disbursement_date, payment_history, today) {
      var interestAccruedPerDay = rate/365 * principal;

   if (isSameMonth(today, disbursement_date)) {
      var daysSinceDisbursement = daysIntoMonth(today) - daysIntoMonth(disbursement_date);
      return principal + interestAccruedPerDay * daysSinceDisbursement - paymentsInMonthBeforeDate(disbursement_date, payment_history, today);
   } else {



      var  daysOfInterestPreviousMonth = (new Date(startOfNextMonth(disbursement_date).getFullYear(), 
                                                   startOfNextMonth(disbursement_date).getMonth(), 
                                                   0).getDate() - 
                                          daysIntoMonth(disbursement_date))




      var principalAtEndOfDisbursementMonth = l(
         principal +
         interestAccruedPerDay * daysOfInterestPreviousMonth -
         paymentsInMonth(disbursement_date, payment_history)
      );

      var principalAtStartOfMonth = principalAtEndOfDisbursementMonth +
      (rate/365 * principalAtEndOfDisbursementMonth)


      return currentBalance(
         principalAtStartOfMonth,
         rate,
         startOfNextMonth(disbursement_date),
         payment_history,
         today
      );
   }
}



function daysIntoMonth(date) {
   return new Date(date).getDate();
}

function startOfMonth(date) {
   return new Date(new Date(date).getFullYear(), new Date(date).getMonth());
}

function startOfNextMonth(date) {
   return new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1);
}

function isSameMonth(date1, date2) {
   return new Date(date1).getFullYear() === new Date(date2).getFullYear() 
   && new Date(date1).getMonth() === new Date(date2).getMonth();
}

function paymentsInMonth(dateInMonth, payment_history) {
   return totalPaid(
      payment_history.filter(isPaymentInMonth.bind(null, dateInMonth))
   );
}

function paymentsBeforeDate(date, payment_history) {
      return totalPaid(
      payment_history.filter(isPaymentBeforeDate.bind(null, date))
   );
}

function isPaymentBeforeDate(dateInMonth, payment) {
   return payment.date <= dateInMonth;
}

function isPaymentInMonth(dateInMonth, payment) {
   return payment.date > startOfMonth(dateInMonth) && payment.date < startOfNextMonth(dateInMonth);
}


function paymentsInMonthBeforeDate(dateInMonth, payment_history, date) {
   return totalPaid(
      payment_history.filter(isPaymentInMonth.bind(null, dateInMonth)).filter(isPaymentBeforeDate.bind(null, date)));
}


function isPaymentInMonthBeforeDate(dateInMonth, payment, date) {
   return payment.date > startOfMonth(dateInMonth) && payment.date <= date;
}


//totalPaid(payment_history.filter(isPaymentBeforeDate.bind(null, date))

//totalPaid(loanSample.payment_history.filter(isPaymentInMonth.bind(null, loanSample.disbursement_date)))

//totalPaid(loanSample.payment_history.filter(isPaymentInMonth.bind(null, loanSample.disbursement_date)).filter(isPaymentBeforeDate.bind(null, 1477141269000)))

function l(x) {
   ///console.log(x);
   return x;
}



function getLoanStats(loan) {
	if (loan.payment_history === undefined) loan.payment_history = [];
   var loan = parseLoan(loan);
   var now = new Date()
	//console.log(loan);
   return {
      currentBalance: currentBalance(
         loan.principal,
         loan.interest_rate,
         loan.disbursement_date,
         loan.payment_history,
         now
      ),
      numberOfPayments: loan.payment_history.length,
      totalPaid: totalPaid(loan.payment_history),
      totalInterest: totalInterest(
         loan.principal,
         loan.interest_rate,
         loan.disbursement_date,
         loan.payment_history,
         now
      ),
      lastPaymentDate: dateOfLastPayment(loan.payment_history),
      lastPaymentAmount: amountOfLastPayment(loan.payment_history)
   }
}

function parseLoan(loan) {
   loan.payment_history.forEach(function(payment) {
      payment.date = new Date(payment.date * 1000);
   });
   loan.payment_history.sort(function(payment1, payment2) {
      return payment1.date > payment2.date;
   })
	loan.disbursement_date = new Date(loan.disbursement_date * 1000);
   return loan
}


// console.log(
//    currentBalance(
//       100,
//       3.65,
//       new Date(1480579200000),
//       [
//           {date: new Date(1480579200001), amount: 10},
//       ],
//       new Date(1480579200000 + 86400000 * 31)
//    )
// )

// console.log(totalInterest(
//    100,
//    3.65,
//    new Date(1480579200000),
//    [
//        {date: new Date(1480579200001), amount: 10},
//    ],
//    new Date(1480579200000 + 86400000 * 31)
// ))

// console.log(
//    currentBalance(
//       100,
//       3.65,
//       new Date(2000, 12, 1),
//       [
//           {date: new Date(2001, 1, 2), amount: 0},
//       ],
//       new Date(2002, 1, 5)
//    )
// )

// endOfDecemberBalance = l(
//    100 + // principal
//    100 * 0.01 * 31 // december interest
// )
// midJanuaryBalance = endOfDecemberBalance + endOfDecemberBalance * 0.01 * 4 - 10;
// l(midJanuaryBalance)

// console.log(totalInterest(
//    100,
//    3.65,
//    new Date(2000, 12, 1),
//    [
//        {date: new Date(2001, 1, 2), amount: 0},
//    ],
//    new Date(2002, 1, 5)
// ))


// console.log(
//    currentBalance(
//       100,
//       3.65,
//       new Date(1480579200000),
//       [
//           {date: new Date(1480579200001), amount: 10},
//       ],
//       new Date(1480579200000 + 86400000 * 41)
//    )
// )
// endOfDecemberBalance = l(
//    100 + // principal
//    100 * 0.01 * 31 - // december interest
//    10
// )
// midJanuaryBalance = endOfDecemberBalance + endOfDecemberBalance * 0.01 * 10;
// l(midJanuaryBalance)