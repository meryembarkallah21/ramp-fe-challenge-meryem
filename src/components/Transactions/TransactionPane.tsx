// TransactionPane.tsx
import { useState, useEffect } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
  approved: propApproved, // Receive approved prop
}) => {
  const [approved, setApproved] = useState(propApproved !== undefined ? propApproved : transaction.approved)

  useEffect(() => {
    if (propApproved !== undefined) {
      setApproved(propApproved);
    }
  }, [propApproved]);

  const handleApprovalChange = async (newValue) => {
    try {
      await consumerSetTransactionApproval({
        transactionId: transaction.id,
        newValue,
      });

      setApproved(newValue);
    } catch (error) {
      // Handle error
    }
  }

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleApprovalChange}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
