"use client";

import { Card, CardBody as CardContent, Avatar, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FamousPerson } from "@/data/famousBirthdays";

interface FamousBirthdaysProps {
  people: FamousPerson[];
}

export default function FamousBirthdays({ people }: FamousBirthdaysProps) {
  if (people.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-6xl mx-auto mt-16"
      >
        <Card className="glass border border-gray-700/50 bg-transparent">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-2xl font-semibold mb-2 text-white">No Famous Birthdays Found</h3>
            <p className="text-gray-400">
              We don't have any famous people recorded for this date yet, but that makes your birthday even more special!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full max-w-6xl mx-auto mt-16"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-3">
          Famous People Who Share Your Birthday
        </h2>
        <p className="text-gray-400 text-lg">
          You're in great company! 🌟
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person, index) => (
          <motion.div
            key={`${person.name}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <Card className="glass border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 hover:scale-105 bg-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                    fallback={person.emoji}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {person.name}
                    </h3>
                    <Chip variant="flat" color="secondary" className="mb-2">
                      {person.profession}
                    </Chip>
                    <p className="text-sm text-gray-400">
                      Born {person.birthYear > 0 ? person.birthYear : `${Math.abs(person.birthYear)} BCE`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
