'use client'

import { ChangeEvent, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createGroup, checkInGroup } from '@/models'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function GroupForm() {
  return (
    <form className="grid gap-4" action={createGroup}>
      <FormContent />
    </form>
  )
}

function FormContent() {

  const router = useRouter()
  const [mode, setMode] = useState<'initial' | 'create'>('initial')
  const [checking, setChecking] = useState(false)
  const [name, setName] = useState('')

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  async function check() {
    if (name.trim() === '') return
    setChecking(true)
    try {
      const inGroup = await checkInGroup(name)
      if (inGroup) {
        router.push(`/group/${encodeURIComponent(name)}`)
        return
      }
      setMode('create')
    } finally {
      setChecking(false)
    }
  }

  const { pending } = useFormStatus()

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" readOnly={mode ==='create'} value={name} onChange={handleNameChange} required />
      </div>
      {mode === 'initial' && <Button type="button" className="w-full" loading={checking} onClick={check}>
        Continue
      </Button>}
      {mode === 'create' && <>
        <div className="grid gap-2">
          <Label htmlFor="member">The other member</Label>
          <Input type="text" name="member" disabled={pending} placeholder="Paste user ID of the other member here" required />
        </div>
        <Button type="submit" className="w-full" loading={pending}>
          Create
        </Button>
      </>}
    </>
  )
}
