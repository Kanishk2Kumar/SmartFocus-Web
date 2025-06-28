'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const GRID_SIZE = 4
const CELL_SIZE = 6 // in rem
const CELL_GAP = 0.5 // in rem

type Tile = {
  value: number
  id: string
  mergedFrom?: Tile[]
  justMerged?: boolean
  isNew?: boolean
  row: number
  col: number
}

export default function Game2048() {
  const [board, setBoard] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeGame()
    const storedBestScore = localStorage.getItem('bestScore')
    if (storedBestScore) setBestScore(parseInt(storedBestScore))
    
    if (gameContainerRef.current) {
      gameContainerRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem('bestScore', score.toString())
    }
  }, [score, bestScore])

  const initializeGame = () => {
    const newBoard: Tile[] = []
    addNewTile(newBoard)
    addNewTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setIsGameOver(false)
  }

  const addNewTile = (board: Tile[]) => {
    const emptyTiles = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!board.some(tile => tile.row === row && tile.col === col)) {
          emptyTiles.push({ row, col })
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
      board.push({
        value: Math.random() < 0.9 ? 2 : 4,
        id: `${row}-${col}-${Date.now()}`,
        row,
        col,
        isNew: true
      })
    }
  }

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (isGameOver) return

    let newBoard = board.map(tile => ({ ...tile, justMerged: false, isNew: false }))
    let changed = false
    let newScore = score

    const sortedTiles = [...newBoard].sort((a, b) => {
      if (direction === 'up' || direction === 'down') {
        return direction === 'up' ? a.row - b.row : b.row - a.row
      } else {
        return direction === 'left' ? a.col - b.col : b.col - a.col
      }
    })

    for (const tile of sortedTiles) {
      let { row, col } = tile
      let newRow = row
      let newCol = col

      while (true) {
        newRow += direction === 'up' ? -1 : direction === 'down' ? 1 : 0
        newCol += direction === 'left' ? -1 : direction === 'right' ? 1 : 0

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
          newRow -= direction === 'up' ? -1 : direction === 'down' ? 1 : 0
          newCol -= direction === 'left' ? -1 : direction === 'right' ? 1 : 0
          break
        }

        const targetTile = newBoard.find(t => t.row === newRow && t.col === newCol)
        if (targetTile) {
          if (targetTile.value === tile.value && !targetTile.justMerged) {
            newBoard = newBoard.filter(t => t !== targetTile && t !== tile)
            newBoard.push({
              value: tile.value * 2,
              id: tile.id,
              row: newRow,
              col: newCol,
              justMerged: true
            })
            newScore += tile.value * 2
            changed = true
          } else {
            newRow -= direction === 'up' ? -1 : direction === 'down' ? 1 : 0
            newCol -= direction === 'left' ? -1 : direction === 'right' ? 1 : 0
          }
          break
        }
      }

      if (newRow !== row || newCol !== col) {
        changed = true
        tile.row = newRow
        tile.col = newCol
      }
    }

    if (changed) {
      addNewTile(newBoard)
      setBoard(newBoard)
      setScore(newScore)
      if (isGameOverState(newBoard)) {
        setIsGameOver(true)
      }
    } else if (isGameOverState(newBoard)) {
      setIsGameOver(true)
    }
  }

  const isGameOverState = (board: Tile[]) => {
    if (board.length < GRID_SIZE * GRID_SIZE) return false

    for (const tile of board) {
      const { row, col, value } = tile
      if (
        (row > 0 && board.some(t => t.row === row - 1 && t.col === col && t.value === value)) ||
        (row < GRID_SIZE - 1 && board.some(t => t.row === row + 1 && t.col === col && t.value === value)) ||
        (col > 0 && board.some(t => t.row === row && t.col === col - 1 && t.value === value)) ||
        (col < GRID_SIZE - 1 && board.some(t => t.row === row && t.col === col + 1 && t.value === value))
      ) {
        return false
      }
    }

    return true
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        move('up')
        break
      case 'ArrowDown':
        move('down')
        break
      case 'ArrowLeft':
        move('left')
        break
      case 'ArrowRight':
        move('right')
        break
    }
  }

  const cellColor = (value: number) => {
    switch (value) {
      case 2: return 'bg-[#eee4da] text-[#776e65]'
      case 4: return 'bg-[#ede0c8] text-[#776e65]'
      case 8: return 'bg-[#f2b179] text-white'
      case 16: return 'bg-[#f59563] text-white'
      case 32: return 'bg-[#f67c5f] text-white'
      case 64: return 'bg-[#f65e3b] text-white'
      case 128: return 'bg-[#edcf72] text-white'
      case 256: return 'bg-[#edcc61] text-white'
      case 512: return 'bg-[#edc850] text-white'
      case 1024: return 'bg-[#edc53f] text-white'
      case 2048: return 'bg-[#edc22e] text-white'
      default: return 'bg-[#cdc1b4]'
    }
  }

  const tileVariants = {
    initial: { scale: 0 },
    enter: { scale: 1 },
    merged: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    }
  }

  return (
    <div 
      className="flex flex-col items-center justify-center text-[#776e65] mt-8"
      ref={gameContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="2048 Game Board"
    >
      <div className="w-full max-w-md p-4 flex flex-col items-center">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-6xl font-bold">2048</h1>
          <div className="flex gap-2 ml-10">
            <div className="bg-[#bbada0] p-2 h-14 w-14 rounded-md text-white flex flex-col items-center">
              <div className="text-sm">SCORE</div>
              <div className="font-bold">{score}</div>
            </div>
            <div className="bg-[#bbada0] h-14 w-14 rounded-md p-2 text-white flex flex-col items-center">
              <div className="text-sm">BEST</div>
              <div className="font-bold">{bestScore}</div>
            </div>
          </div>
        </div>
        <div className="bg-[#bbada0] p-2 rounded-lg w-fit">
          <div className="relative" style={{ width: `${CELL_SIZE * GRID_SIZE + CELL_GAP * (GRID_SIZE - 1)}rem`, height: `${CELL_SIZE * GRID_SIZE + CELL_GAP * (GRID_SIZE - 1)}rem` }}>
            {/* Background grid */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
              <div
                key={`cell-${index}`}
                className="absolute bg-[#cdc1b4] rounded-md"
                style={{
                  width: `${CELL_SIZE}rem`,
                  height: `${CELL_SIZE}rem`,
                  left: `${(index % GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
                  top: `${Math.floor(index / GRID_SIZE) * (CELL_SIZE + CELL_GAP)}rem`,
                }}
              />
            ))}
            {/* Tiles */}
            <AnimatePresence>
              {board.map((tile) => (
                <motion.div
                  key={tile.id}
                  initial={tile.isNew ? { scale: 0, x: tile.col * (CELL_SIZE + CELL_GAP) + 'rem', y: tile.row * (CELL_SIZE + CELL_GAP) + 'rem' } : { scale: 0 }}
                  animate={{
                    scale: 1,
                    x: tile.col * (CELL_SIZE + CELL_GAP) + 'rem',
                    y: tile.row * (CELL_SIZE + CELL_GAP) + 'rem',
                  }}
                  exit={{ scale: 0 }}
                  transition={tile.isNew ? { duration: 0.15 } : { x: { duration: 0.15 }, y: { duration: 0.15 } }}
                  className={`absolute rounded-md flex items-center justify-center text-2xl font-bold ${cellColor(tile.value)}`}
                  style={{
                    width: `${CELL_SIZE}rem`,
                    height: `${CELL_SIZE}rem`,
                  }}
                >
                  <motion.div
                    variants={tileVariants}
                    animate={tile.justMerged ? "merged" : "enter"}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {tile.value}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p><strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong></p>
        </div>
        <div className="mt-4">
          <Button onClick={initializeGame} className="bg-[#8f7a66] text-white hover:bg-[#9f8a76]">
            New Game
          </Button>
        </div>
      </div>

      <Dialog open={isGameOver} onOpenChange={setIsGameOver}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over!</DialogTitle>
            <DialogDescription>
              Your score: {score}
              {score === bestScore && score > 0 && " (New Best!)"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={initializeGame} className="bg-[#8f7a66] text-white hover:bg-[#9f8a76]">
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}