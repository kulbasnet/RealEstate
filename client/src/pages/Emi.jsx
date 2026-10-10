
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Slider } from "@/Components/ui/slider"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Calculator, RefreshCw, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import Footer from "@/Components/Footer";
import loan from "./loan.jpg"

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [loanTenure, setLoanTenure] = useState(5)
  const [tenureType, setTenureType] = useState("years")
  const [emi, setEmi] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)

  useEffect(() => {
    calculateEMI()
  }, [loanAmount, interestRate, loanTenure, tenureType])

  const calculateEMI = () => {
    const principal = Number.parseFloat(loanAmount.toString())
    const rateOfInterest = Number.parseFloat(interestRate.toString()) / 100 / 12
    const time =
      tenureType === "years" ? Number.parseFloat(loanTenure.toString()) * 12 : Number.parseFloat(loanTenure.toString())

    if (principal > 0 && rateOfInterest > 0 && time > 0) {
      const emiValue =
        (principal * rateOfInterest * Math.pow(1 + rateOfInterest, time)) / (Math.pow(1 + rateOfInterest, time) - 1)
      const totalPaymentValue = emiValue * time
      const totalInterestValue = totalPaymentValue - principal

      setEmi(Math.round(emiValue))
      setTotalInterest(Math.round(totalInterestValue))
      setTotalPayment(Math.round(totalPaymentValue))
    } else {
      setEmi(0)
      setTotalInterest(0)
      setTotalPayment(0)
    }
  }

  const resetValues = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setLoanTenure(5)
    setTenureType("years")
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "Nrs",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  

  const handleLoanAmountChange = (value) => {
    setLoanAmount(value[0])
  }

  const handleInterestRateChange = (value) => {
    setInterestRate(value[0])
  }

  const handleLoanTenureChange = (value) => {
    setLoanTenure(value[0])
  }

  return (
    <>
     <div className="relative ">
                <img src={loan || "/placeholder.svg"} className="w-full h-[540px] mt-[10px] object-cover" />
        
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                <h1 className="text-7xl font-bold tracking-tight text-[#b98604] mt-11">EMI CALCULATOR  </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Use our free EMI calculator to find out what your monthly payments and fee will be!  </p>

              
                </div>
              </div>
        <div className="container mx-auto mb-11 px-4 py-8 mt-[50px]">
      <div className="max-w-4xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Adjust the sliders to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="loan-amount">Loan Amount</Label>
                  <div className="w-32">
                    <Input
                      id="loan-amount-input"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="text-right"
                    />
                  </div>
                </div>
                <Slider
                  id="loan-amount"
                  min={10000}
                  max={10000000}
                  step={10000}
                  value={[loanAmount]}
                  onValueChange={handleLoanAmountChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>NRS.10,000</span>
                  <span>NRS.10,000,000</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <div className="w-32">
                    <Input
                      id="interest-rate-input"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="text-right"
                      step="0.1"
                    />
                  </div>
                </div>
                <Slider
                  id="interest-rate"
                  min={1}
                  max={30}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={handleInterestRateChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="loan-tenure">Loan Tenure</Label>
                    <Select value={tenureType} onValueChange={setTenureType}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="years">Years</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Input
                      id="loan-tenure-input"
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="text-right"
                    />
                  </div>
                </div>
                <Slider
                  id="loan-tenure"
                  min={tenureType === "years" ? 1 : 1}
                  max={tenureType === "years" ? 30 : 360}
                  step={tenureType === "years" ? 1 : 1}
                  value={[loanTenure]}
                  onValueChange={handleLoanTenureChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{tenureType === "years" ? "1 Year" : "1 Month"}</span>
                  <span>{tenureType === "years" ? "30 Years" : "360 Months"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm" onClick={resetValues} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Your loan payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Monthly EMI</div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(emi)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Principal</div>
                  <div className="font-medium">{formatCurrency(loanAmount)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Interest</div>
                  <div className="font-medium">{formatCurrency(totalInterest)}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-sm text-muted-foreground">Total Payment</div>
                  <div className="font-medium">{formatCurrency(totalPayment)}</div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="mt-8 mb-11">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
            <TabsTrigger value="info">About EMI</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Loan Amortization Schedule</CardTitle>
                <CardDescription>Monthly breakdown of your loan payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Principal Paid</TableHead>
                      <TableHead>Interest Paid</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({
                      length: Math.min(30, tenureType === "years" ? loanTenure : Math.ceil(loanTenure / 12)),
                    }).map((_, index) => {
                      const year = index + 1
                      const monthsInYear = 12
                      const monthlyInterestRate = interestRate / 100 / 12
                      const totalMonths = tenureType === "years" ? loanTenure * 12 : loanTenure

                      let remainingBalance = loanAmount
                      let yearlyPrincipal = 0
                      let yearlyInterest = 0

                      // Calculate for all months up to this year
                      for (let month = 1; month <= year * monthsInYear; month++) {
                        if (month > totalMonths) break

                        const monthlyInterest = remainingBalance * monthlyInterestRate
                        const monthlyPrincipal = emi - monthlyInterest

                        if (month > (year - 1) * monthsInYear) {
                          yearlyPrincipal += monthlyPrincipal
                          yearlyInterest += monthlyInterest
                        }

                        remainingBalance -= monthlyPrincipal
                      }

                      return (
                        <TableRow key={year}>
                          <TableCell>{year}</TableCell>
                          <TableCell>{formatCurrency(yearlyPrincipal)}</TableCell>
                          <TableCell>{formatCurrency(yearlyInterest)}</TableCell>
                          <TableCell>{formatCurrency(Math.max(0, remainingBalance))}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                {(tenureType === "years" ? loanTenure : Math.ceil(loanTenure / 12)) > 5 && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Showing of payment schedule
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Understanding EMI</CardTitle>
                <CardDescription>Equated Monthly Installment explained</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>What is EMI?</AlertTitle>
                  <AlertDescription>
                    EMI (Equated Monthly Installment) is the fixed payment amount made by a borrower to a lender at a
                    specified date each month. EMIs are used to pay off both interest and principal each month so that
                    over a specified number of years, the loan is paid off in full.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="font-medium">EMI Formula</h3>
                  <p className="text-sm text-muted-foreground">EMI = [P × R × (1+R)^N]/[(1+R)^N-1], where:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>P = Principal loan amount</li>
                    <li>R = Monthly interest rate (annual rate divided by 12 and then by 100)</li>
                    <li>N = Number of monthly installments</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Factors Affecting EMI</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Loan amount: Higher loan amount leads to higher EMI</li>
                    <li>Interest rate: Higher interest rate leads to higher EMI</li>
                    <li>Loan tenure: Longer tenure reduces EMI but increases total interest paid</li>
                    <li>Prepayment: Paying extra amounts reduces the principal and future interest</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
    </div>
<Footer/>
    
    </>
    
  )
}
