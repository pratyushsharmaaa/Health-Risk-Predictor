// lets the user pick “Personal Info” vs “Health Metrics” etc
import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '../components/ui/button'

export default function ProfileEditOptions() {
  const router = useRouter()
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10 space-y-4">
      <h2 className="text-xl">What would you like to edit?</h2>
      <Button onClick={() => router.push('/edit-profile/me')} className="w-full">
        Full Profile
      </Button>
      {/* You could add more buttons here if you split sections */}
    </div>
  )
}
