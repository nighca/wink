'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Deal, Group, addDeal } from '@/models'

export default function AddDeal({ group, onAdded }: {
  group: Group
  onAdded: (deal: Deal) => void
}) {
  const [submitting, setSubmitting] = useState(false)

  async function handleAddDeal() {
    const deal = {
      time: Date.now(),
      from: 'nighca',
      to: 'ttt',
      note: 'Test',
      amount: 10,
    }
    setSubmitting(true)
    try {
      await addDeal(group.name, deal)
      onAdded(deal)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <Button className="w-full" disabled={submitting} onClick={handleAddDeal}>
      Add deal
    </Button>
  )
}
