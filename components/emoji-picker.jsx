"use client"

import { useState, useEffect, useRef } from "react"

// Emoji categories
const categories = [
  { id: "smileys", name: "Smileys & Emotion", emoji: "😀" },
  { id: "people", name: "People & Body", emoji: "👋" },
  { id: "animals", name: "Animals & Nature", emoji: "🐶" },
  { id: "food", name: "Food & Drink", emoji: "🍔" },
  { id: "travel", name: "Travel & Places", emoji: "🚗" },
  { id: "activities", name: "Activities", emoji: "⚽" },
  { id: "objects", name: "Objects", emoji: "💡" },
  { id: "symbols", name: "Symbols", emoji: "❤️" },
  { id: "flags", name: "Flags", emoji: "🏁" },
]

// Common emojis for quick access
const commonEmojis = ["👍", "❤️", "😊", "😂", "🙏", "👏", "🔥", "🎉", "👌", "🤔"]

export default function EmojiPicker({ onEmojiSelect, onClose }) {
  const [isLoading, setIsLoading] = useState(true)
  const [emojis, setEmojis] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("smileys")
  const containerRef = useRef(null)

  // Load emojis
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        // In a real app, you might fetch from an API or use a library
        // For simplicity, we'll use a small set of hardcoded emojis per category
        const emojiData = {
          smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🥰", "😘"],
          people: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆"],
          animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
          food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥"],
          travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️"],
          activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🥊", "🥋", "🎯", "🎮"],
          objects: ["💡", "🔦", "🧰", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪓", "🔩", "⚙️", "🧲", "🧪", "🧫", "🧬", "🔬"],
          symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖"],
          flags: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦����", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲"],
        }

        setEmojis(emojiData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading emojis:", error)
        setIsLoading(false)
      }
    }

    fetchEmojis()
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji)
  }

  const filteredEmojis = searchTerm
    ? Object.values(emojis)
        .flat()
        .filter((emoji) => emoji.includes(searchTerm))
    : emojis[activeCategory] || []

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg border border-earth-beige overflow-hidden z-10"
    >
      {/* Search */}
      <div className="p-2 border-b border-earth-beige">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-earth-beige rounded focus:outline-none focus:border-soft-amber"
        />
      </div>

      {/* Common emojis */}
      <div className="p-2 border-b border-earth-beige">
        <div className="flex flex-wrap">
          {commonEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className="p-1 text-xl hover:bg-pale-stone rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto p-1 border-b border-earth-beige">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setSearchTerm("")
            }}
            className={`p-1 mx-1 text-lg rounded ${
              activeCategory === category.id ? "bg-soft-amber/20" : "hover:bg-pale-stone"
            }`}
            title={category.name}
          >
            {category.emoji}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="h-48 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-drift-gray">Loading emojis...</span>
          </div>
        ) : filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-1 text-xl hover:bg-pale-stone rounded flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-drift-gray">No emojis found</span>
          </div>
        )}
      </div>
    </div>
  )
}
