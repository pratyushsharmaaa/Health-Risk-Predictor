import { useState } from 'react'
import axios from 'axios'

export default function ChatBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: '💬 Hi there! Sorry to see you here! How can I help you?' }
  ])
  const [input, setInput] = useState('')
  const toggle = () => setOpen(o => !o)

  const send = async () => {
    if (!input.trim()) return

    // Add user message immediately
    const userMsg = { from: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setInput('')

    // Compose endpoint and log it
    const endpoint = `${process.env.NEXT_PUBLIC_API_BASE}/chat`
    console.log('🗨️ Sending chat request to:', endpoint)

    try {
      const { data } = await axios.post(
        endpoint,
        { prompt: input },
        { withCredentials: true }
      )
      setMessages(m => [...m, { from: 'bot', text: data.reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(m => [
        ...m,
        { from: 'bot', text: 'Sorry, I could not reach the server. Please try again later.' }
      ])
    }
  }

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-50"
      >
        💬
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-2 border-b flex justify-between">
            <strong>Health Bot</strong>
            <button onClick={toggle}>✕</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2 h-60">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.from === 'bot' ? 'bg-gray-100 self-start' : 'bg-green-100 self-end'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2"
              placeholder="Ask about liver, diabetes…"
            />
            <button onClick={send} className="bg-blue-600 text-white px-4 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
