"use client"

import { useState } from "react"
import {
  Box,
  Radio,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Stack,
} from "@mui/material"
import Image from "next/image"

export default function BillingInfo() {
  const [selectedPayment, setSelectedPayment] = useState("paypal")

  const transactions = [
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
    {
      date: "08/24/2019 02:30 PM",
      paymentId: "234453",
      project: "English Project Edition",
      amount: "$3000.00",
      status: "Payment Awaiting",
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        {/* Payment Methods Section */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Payment Methods
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Radio
                checked={selectedPayment === "paypal"}
                onChange={(e) => setSelectedPayment("paypal")}
                value="paypal"
                name="payment-method"
              />
              <Image src="/placeholder.svg?height=30&width=30" alt="PayPal" width={30} height={30} />
              <Typography>
                PayPal account: ser*****n{" "}
                <Typography component="span" color="primary">
                  (Default)
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Radio
                checked={selectedPayment === "mastercard"}
                onChange={(e) => setSelectedPayment("mastercard")}
                value="mastercard"
                name="payment-method"
              />
              <Image src="/placeholder.svg?height=30&width=30" alt="MasterCard" width={30} height={30} />
              <Typography>MasterCard ending in 8423</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Transaction History Section */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Transaction History</Typography>
            <Link href="#" underline="hover" color="primary">
              View All
            </Link>
          </Box>

          <TableContainer component={Paper}
          sx={{
            boxShadow: "none",
            border:"none"
          }}
          variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Payments ID</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.paymentId}</TableCell>
                    <TableCell>{transaction.project}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography color="primary">{transaction.status}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Box>
  )
}

