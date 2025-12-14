"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody as CardContent, Button, Input, Tab, Tabs } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";

const landFAQs = [
  {
    question: "How do I calculate land area?",
    answer: "Land area calculation depends on the shape of the land. For rectangles, multiply length by width. For triangles, it's half of the base times height. For irregular shapes, it's best to divide them into simpler shapes like rectangles and triangles."
  },
  {
    question: "What is an Acre?",
    answer: "An Acre is a unit of land area used in the imperial and US customary systems. It is approximately equivalent to 4,046.86 square meters or 43,560 square feet."
  },
  {
    question: "What is a Hectare?",
    answer: "A Hectare is a metric unit of square measure, equal to 100 ares (10,000 square meters). It is primarily used in the measurement of land."
  }
];

type Shape = "rectangle" | "triangle" | "circle";

export default function LandCalculator() {
  const [shape, setShape] = useState<Shape>("rectangle");
  
  // Rectangle
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  // Triangle
  const [base, setBase] = useState("");
  const [height, setHeight] = useState("");

  // Circle
  const [radius, setRadius] = useState("");

  const [resultSqFt, setResultSqFt] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    let area = 0;

    if (shape === "rectangle") {
      if (!length || !width) {
        setError("Please enter length and width");
        return;
      }
      area = parseFloat(length) * parseFloat(width);
    } else if (shape === "triangle") {
      if (!base || !height) {
        setError("Please enter base and height");
        return;
      }
      area = 0.5 * parseFloat(base) * parseFloat(height);
    } else if (shape === "circle") {
      if (!radius) {
         setError("Please enter radius");
         return;
      }
      area = Math.PI * Math.pow(parseFloat(radius), 2);
    }

    if (isNaN(area) || area <= 0) {
      setError("Please check your inputs");
      return;
    }

    setResultSqFt(area);
  };

  const reset = () => {
    setResultSqFt(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              Land Calculator
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Calculate land area for different shapes including rectangles, triangles, and circles.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <Card className="glass-strong border-2 border-green-500/20 shadow-2xl shadow-green-900/20">
              <CardHeader className="flex flex-col gap-2 pb-0">
                 <Tabs 
                  selectedKey={shape} 
                  onSelectionChange={(key) => {
                    setShape(key as Shape);
                    reset();
                  }}
                  color="success"
                  variant="bordered"
                  classNames={{
                    tabList: "bg-black/20 border-green-500/20",
                    cursor: "bg-green-500/20",
                    tabContent: "text-white group-data-[selected=true]:text-green-300"
                  }}
                >
                  <Tab key="rectangle" title="Rectangle" />
                  <Tab key="triangle" title="Triangle" />
                  <Tab key="circle" title="Circle" />
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4">
                  {shape === "rectangle" && (
                     <>
                        <Input
                          type="number"
                          label="Length (ft)"
                          placeholder="Length"
                          value={length}
                          onValueChange={setLength}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-green-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                        <Input
                          type="number"
                          label="Width (ft)"
                          placeholder="Width"
                          value={width}
                          onValueChange={setWidth}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-green-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                     </>
                  )}
                  {shape === "triangle" && (
                     <>
                        <Input
                          type="number"
                          label="Base (ft)"
                          placeholder="Base"
                          value={base}
                          onValueChange={setBase}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-green-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                        <Input
                          type="number"
                          label="Height (ft)"
                          placeholder="Height"
                          value={height}
                          onValueChange={setHeight}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-green-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                     </>
                  )}
                  {shape === "circle" && (
                     <Input
                          type="number"
                          label="Radius (ft)"
                          placeholder="Radius"
                          value={radius}
                          onValueChange={setRadius}
                          variant="bordered"
                          classNames={{
                            inputWrapper: "border-green-500/30 bg-black/20 hover:bg-black/30",
                            label: "text-gray-300",
                            input: "text-white",
                          }}
                        />
                  )}
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button 
                  onPress={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 text-white border-0"
                >
                  Calculate Area
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      <AnimatePresence>
        {resultSqFt !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 space-y-12"
          >
            <AdPlaceholder position="top" />

            <div id="results" className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
               <Card className="glass-strong border-2 border-green-500/20 p-6">
                 <h3 className="text-xl text-gray-300 mb-4">Metric Units</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Square Meters</span>
                        <span className="text-2xl font-bold text-white">{(resultSqFt * 0.092903).toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Hectares</span>
                        <span className="text-2xl font-bold text-white">{(resultSqFt * 0.0000092903).toFixed(4)} ha</span>
                    </div>
                 </div>
               </Card>

               <Card className="glass-strong border-2 border-green-500/20 p-6">
                 <h3 className="text-xl text-gray-300 mb-4">Imperial Units</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Square Feet</span>
                        <span className="text-2xl font-bold text-white">{resultSqFt.toFixed(2)} ft²</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Acres</span>
                        <span className="text-2xl font-bold text-white">{(resultSqFt / 43560).toFixed(4)} ac</span>
                    </div>
                 </div>
               </Card>
            </div>

            <AdPlaceholder position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      <FAQ items={landFAQs} />
    </div>
  );
}
