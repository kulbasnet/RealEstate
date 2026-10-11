import { useState, useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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

gsap.registerPlugin(ScrollTrigger)

// Animations only run when the visitor has not asked for reduced motion
const MOTION_OK = "(prefers-reduced-motion: no-preference)"

export default function EMICalculator() {
  const root = useRef(null)
  const firstTabRender = useRef(true)
  const [tab, setTab] = useState("schedule")
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

  // Page animations: hero entrance, the two calculator cards, and the info tabs
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Hero: image settles in, then heading and intro rise
        gsap.fromTo(".emi-hero-img", { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out" })
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".emi-hero-title", { y: 30, autoAlpha: 0, duration: 1 }, 0.2)
          .from(".emi-hero-text", { y: 30, autoAlpha: 0, duration: 1 }, 0.45)

        // Loan Details + Payment Summary rise in one after the other.
        // clearProps drops the leftover transform after each animation.
        gsap.from(".calc-card", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".calc-grid", start: "top 85%", once: true },
        })

        // Tabs block fades up as it scrolls into view
        gsap.from(".emi-tabs", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".emi-tabs", start: "top 90%", once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  // Each time the tab changes, the newly shown card softly fades up (not on first render)
  useLayoutEffect(() => {
    if (firstTabRender.current) {
      firstTabRender.current = false
      return
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(".tab-card", { y: 16, autoAlpha: 0, duration: 0.5, ease: "power2.out", clearProps: "all" })
      })
    }, root)
    return () => ctx.revert()
  }, [tab])

  return (
    <div ref={root}>
     <div className="relative mt-[10px] overflow-hidden">
                <img src={loan || "/placeholder.svg"} alt="Home loan" className="emi-hero-img w-full h-[380px] sm:h-[460px] md:h-[540px] object-cover" />
        
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <h1 className="emi-hero-title text-4xl md:text-7xl font-bold tracking-tight text-[#b98604] mt-11">EMI CALCULATOR  </h1>
                <p className="emi-hero-text text-muted-foreground mt-2 max-w-2xl mx-auto px-4">
                Use our free EMI calculator to find out what your monthly payments and fee will be!  </p>

              
                </div>
              </div>
        <div className="container mx-auto mb-11 px-4 py-8 mt-[50px]">
      <div className="max-w-4xl mx-auto">

        <div className="calc-grid grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <Card className="calc-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Adjust the sliders to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <Label htmlFor="loan-amount">Loan Amount</Label>
                  <div className="w-32">
                    <Input
                      id="loan-amount-input"
                      type="number"
                      inputMode="decimal"
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
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <div className="w-32">
                    <Input
                      id="interest-rate-input"
                      type="number"
                      inputMode="decimal"
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
                <div className="flex flex-wrap justify-between items-center gap-2">
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
                      inputMode="decimal"
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

          <Card className="calc-card">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Your loan payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Monthly EMI</div>
                <div className="text-3xl font-bold text-primary break-words">{formatCurrency(emi)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="text-sm text-muted-foreground">Principal</div>
                  <div className="font-medium break-words">{formatCurrency(loanAmount)}</div>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm text-muted-foreground">Interest</div>
                  <div className="font-medium break-words">{formatCurrency(totalInterest)}</div>
                </div>
                <div className="space-y-1 col-span-2">
                  <div className="text-sm text-muted-foreground">Total Payment</div>
                  <div className="font-medium break-words">{formatCurrency(totalPayment)}</div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="emi-tabs mt-8 mb-11">
          <TabsList className="grid h-auto w-full grid-cols-2">
            <TabsTrigger value="schedule" className="whitespace-normal px-2 py-2 text-xs sm:text-sm">Payment Schedule</TabsTrigger>
            <TabsTrigger value="info" className="whitespace-normal px-2 py-2 text-xs sm:text-sm">About EMI</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <Card className="tab-card">
              <CardHeader>
                <CardTitle>Loan Amortization Schedule</CardTitle>
                <CardDescription>Monthly breakdown of your loan payments</CardDescription>
              </CardHeader>
              <CardContent>
                {/* The table scrolls sideways on small screens instead of breaking the page */}
                <div className="overflow-x-auto">
                <Table className="min-w-[520px]">
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
                          <TableCell className="whitespace-nowrap">{formatCurrency(yearlyPrincipal)}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatCurrency(yearlyInterest)}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatCurrency(Math.max(0, remainingBalance))}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                </div>
                {(tenureType === "years" ? loanTenure : Math.ceil(loanTenure / 12)) > 5 && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Showing of payment schedule
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card className="tab-card">
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
                  <p className="text-sm text-muted-foreground break-words">EMI = [P × R × (1+R)^N]/[(1+R)^N-1], where:</p>
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
    
    </div>
    
  )
}