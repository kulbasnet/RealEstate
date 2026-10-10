import { useState } from 'react';
import Footer from "@/Components/Footer";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowDownUp, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import land from "./landSurvery.jpg";

function LandUnit() {
  const [values, setValues] = useState({
    ropani: '',
    aana: '',
    paisa: '',
    daam: '',
    bigha: '',
    kattha: '',
    dhur: '',
    sqFeet: '',
    sqMeter: ''
  });

  const conversionsToSqM = {
    ropani: 508.72,
    aana: 31.80,
    paisa: 7.95,
    daam: 1.99,
    bigha: 6772.63,
    kattha: 338.63,
    dhur: 16.93,
    sqFeet: 0.0929,
    sqMeter: 1,
  };

  const handleChange = (field, value) => {
    if (value === '') {
      setValues({
        ropani: '',
        aana: '',
        paisa: '',
        daam: '',
        bigha: '',
        kattha: '',
        dhur: '',
        sqFeet: '',
        sqMeter: ''
      });
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const sqMeters = numValue * conversionsToSqM[field];

    const newValues = {
      ropani: sqMeters / 508.72,
      aana: sqMeters / 31.80,
      paisa: (sqMeters / 31.80) * 4,
      daam: (sqMeters / 31.80) * 16,
      bigha: sqMeters / 6772.63,
      kattha: (sqMeters / 6772.63) * 20,
      dhur: (sqMeters / 6772.63) * 400,
      sqFeet: sqMeters * 10.764,
      sqMeter: sqMeters
    };

    const roundedValues = {};
    Object.keys(newValues).forEach(key => {
      roundedValues[key] = parseFloat(newValues[key].toFixed(4));
    });

    setValues(roundedValues);
  };

  return (
    <>
      <div className="relative">
        <img src={land || "/placeholder.svg"} className="w-full h-[540px] mt-[10px] object-cover" alt="Land Survey" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-[#b98604] mt-11">
            Land Area Converter
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto px-4">
            Explore "Unit" - your handy tool for measuring real estate dimensions in Nepal. 
            Get precise measurements and plan your space effortlessly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[50px]">
        <div className="border rounded-lg p-4 sm:p-8 mb-11 w-full max-w-[1350px] mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ropani System</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['ropani', 'aana', 'paisa', 'daam'].map((field) => (
                <div key={field}>
                  <p className="text-sm text-gray-500 mb-2 capitalize">{field}</p>
                  <Input
                    type="number"
                    value={values[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Bigha System</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['bigha', 'kattha', 'dhur'].map((field) => (
                <div key={field}>
                  <p className="text-sm text-gray-500 mb-2 capitalize">{field}</p>
                  <Input
                    type="number"
                    value={values[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder="0"
                    min="0"

                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Feet/Meter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['sqFeet', 'sqMeter'].map((field) => (
                <div key={field}>
                  <p className="text-sm text-gray-500 mb-2">
                    {field === 'sqFeet' ? 'Sq. Feet' : 'Sq. Meter'}
                  </p>
                  <Input
                    type="number"
                    value={values[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder="0"
                    min="0"

                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full max-w-[1350px] mx-auto mt-10 mb-10">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Conversion Info</TabsTrigger>
            <TabsTrigger value="rates">Conversion Rates</TabsTrigger>
            <TabsTrigger value="terai">Terai Region</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Area Converter Information</CardTitle>
                <CardDescription>Units used to calculate land in Nepal</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    The units of measurement of area of land depends on the part of the country where they are being
                    used, with the Bigha-Katha-Dhur measurements common in the Terai region while the Ropani-Aana
                    measurements are common in hilly and mountainous regions.
                  </AlertDescription>
                </Alert>

                <ul className="grid gap-2 list-disc pl-5">
                  <li>1 Bigha = 20 Kattha = 6772.63 m² = 72900 sq.ft. = 13.31 Ropani</li>
                  <li>1 Katha = 20 Dhur = 338.63 m² = 3645 sq.ft.</li>
                  <li>1 Dhur = 16.93 m² = 182.25 sq.ft.</li>
                  <li>1 Ropani = 16 Aana = 64 Paisa = 508.72 m² = 5476 sq.ft. = 256 Daam = 4 llka</li>
                  <li>1 Aana = 4 Paisa = 31.80 m² = 342.25 sq. ft. = 16 Daam</li>
                  <li>1 Paisa = 4 Daam = 7.95 m² = 85.56 sq. ft.</li>
                  <li>1 Daam = 1.99 m² = 21.39 sq. ft.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Standard conversion rates between units</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 list-disc pl-5">
                  <li>1 ropani = 74 feet × 74 feet</li>
                  <li>1 bigha = 13 ropani</li>
                  <li>1 kattha = 442 square yards or 338 square meters</li>
                  <li>1 sq. meter = 10.764 sq. feet</li>
                  <li>1 sq. feet = 0.0929 sq. meter</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowDownUp className="h-4 w-4" />
                    <span className="font-medium">Quick Tip:</span>
                    <span>Enter values in any field to automatically convert to all other units.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terai">
            <Card>
              <CardHeader>
                <CardTitle>Terai Region</CardTitle>
                <CardDescription>Units used in the southern parts of Nepal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  In the Terai region, the southern parts of Nepal, the customary units are those used elsewhere in
                  South Asia:
                </p>
                <ul className="grid gap-2 list-disc pl-5 mb-4">
                  <li>1 katha = 20 dhur</li>
                  <li>1 bigha = 20 katha</li>
                </ul>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Divisions</TableHead>
                        <TableHead>In square meters</TableHead>
                        <TableHead>In square feet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Dhur</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>16.93 m²</TableCell>
                        <TableCell>182.25 sq.ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kattha</TableCell>
                        <TableCell>20 Dhur</TableCell>
                        <TableCell>338.62 m²</TableCell>
                        <TableCell>3,645 sq.ft</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bigha</TableCell>
                        <TableCell>20 Katha</TableCell>
                        <TableCell>6772.41 m²</TableCell>
                        <TableCell>72,900 sq.ft</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </>
  );
}

export default LandUnit;