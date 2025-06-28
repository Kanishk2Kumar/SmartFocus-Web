"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"

const emojis = ["😀", "😍", "🚀", "🌈", "🍕", "🎸", "🐶", "🌺"]

export default function EmojiMemoryMatch() {
  const [cards, setCards] = useState<string[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    if (matchedPairs.length === emojis.length) {
      setIsWon(true)
    }
  }, [matchedPairs])

  const shuffleCards = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedIndices([])
    setMatchedPairs([])
    setMoves(0)
    setIsWon(false)
  }

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) return

    const newFlippedIndices = [...flippedIndices, index]
    setFlippedIndices(newFlippedIndices)

    if (newFlippedIndices.length === 2) {
      setMoves((prev) => prev + 1)
      if (cards[newFlippedIndices[0]] === cards[newFlippedIndices[1]]) {
        setMatchedPairs((prev) => [...prev, ...newFlippedIndices])
        setFlippedIndices([])
      } else {
        setTimeout(() => setFlippedIndices([]), 1000)
      }
    }
  }

  return (
    <div className="bg-gradient-to-br flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-primary-200 mb-8">Emoji Memory Match</h1>
      <div className=" bg-opacity-40 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {cards.map((emoji, index) => (
            <Card
              key={index}
              emoji={emoji}
              isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-indigo-800">Moves: {moves}</p>
          <Button onClick={shuffleCards} className="flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
        </div>
      </div>
      <AnimatePresence>{isWon && <WinningScreen moves={moves} onRestart={shuffleCards} />}</AnimatePresence>
    </div>
  )
}

function Card({ emoji, isFlipped, onClick }: { emoji: string; isFlipped: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="w-16 h-16 bg-white bg-opacity-70 rounded-lg shadow-md cursor-pointer flex items-center justify-center text-3xl"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute backface-hidden">{isFlipped ? emoji : "?"}</div>
    </motion.div>
  )
}

function WinningScreen({ moves, onRestart }: { moves: number; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-indigo-900 bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Congratulations!</h2>
        <p className="text-xl mb-6 text-indigo-800">You won in {moves} moves!</p>
        <Button onClick={onRestart} className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white">
          Play Again
        </Button>
      </div>
    </motion.div>
  )
}
