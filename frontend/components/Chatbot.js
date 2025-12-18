import { useState } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)

  return (
    <div className="chatbot-panel">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Hide Chat' : 'Chat'}
      </button>
      {open && (
        <div className="mt-2 h-64 overflow-y-auto bg-white rounded shadow-md">
          {/* Chatbot Icon */}
          <div className="flex items-center gap-2 p-4 bg-blue-100 rounded-t">
            <img
              src="/robot-stethoscope.jpg" // Make sure this image is in your /public folder
              alt="Chatbot"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-lg font-bold text-blue-600">AI Health Assistant</h2>
          </div>

          {/* Chatbot Message */}
          <div className="p-4">
            <p className="text-sm text-gray-700">Hello! How can I help you today?</p>
          </div>
        </div>
      )}
    </div>
  )
}
