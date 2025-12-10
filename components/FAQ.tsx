"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      question: "How accurate is this age calculator?",
      answer: "Our age calculator is extremely accurate. It calculates your exact age down to the day by considering the full date (year, month, and day) of your birth. The calculations account for leap years and varying month lengths to provide precise results."
    },
    {
      question: "How are the life insights calculated?",
      answer: "Life insights are based on average human consumption estimates. We use approximately 2.5 liters of water per day, 550 liters of oxygen inhaled, and 200 liters of CO₂ exhaled. These are general averages and actual values vary based on individual factors like activity level, health, and environment."
    },
    {
      question: "What is the next birthday countdown?",
      answer: "The next birthday countdown shows exactly how many days, hours, and minutes remain until your next birthday. It's calculated in real-time based on your birth date and the current date, helping you track when you'll turn a year older!"
    },
    {
      question: "Are the famous birthdays accurate?",
      answer: "Yes! Our famous birthdays database includes well-documented historical figures, celebrities, and notable personalities. We've curated a collection of people from various fields including science, arts, politics, and entertainment who were born on each day of the year."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-lg">
          Everything you need to know about our age calculator
        </p>
      </div>

      <Accordion
        variant="splitted"
        className="glass-strong"
        itemClasses={{
          base: "glass border border-purple-500/20 mb-4",
          title: "font-semibold text-lg text-white",
          trigger: "py-6 px-6 hover:bg-purple-500/10",
          content: "text-gray-300 pb-6 px-6",
        }}
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            aria-label={faq.question}
            title={faq.question}
          >
            {faq.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
