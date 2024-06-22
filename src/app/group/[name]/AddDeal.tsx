'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Deal, Group, addDeal } from '@/models'
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from '@/components/ui/label'

export default function AddDeal({ group, onAdded }: {
  group: Group
  onAdded: (deal: Deal) => void
}) {
  const noteInput = useRef<HTMLTextAreaElement>(null)

  const [editting, setEditting] = useState(false)
  function handleEdit() {
    setEditting(true)
    setTimeout(() => {
      noteInput.current?.focus()
    }, 0)
  }
  function handleCancel() {
    setEditting(false)
  }

  const [note, setNote] = useState('')
  function handleNoteChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNote(e.target.value)
  }

  const [amount, setAmount] = useState(10)
  function handleAmountChange([amount]: number[]) {
    setAmount(amount)
  }

  const [submitting, setSubmitting] = useState(false)

  async function handleAddDeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const deal = await addDeal(group.name, { note, amount })
      onAdded(deal)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      <Button className={cns('w-full', editting && 'hidden')} onClick={handleEdit}>
        Add deal
      </Button>
      <form className={cns("grid gap-4", !editting && 'hidden')} onSubmit={handleAddDeal}>
        <Textarea ref={noteInput} name="note" placeholder="Note" required value={note} onChange={handleNoteChange} />
        {/* <Input type="number" name="amount" required value={amount} onChange={handleAmountChange} /> */}
        <div className='flex gap-2 items-center'>
          <Label>Amount</Label>
          <Slider min={0} max={100} step={1} value={[amount]} onValueChange={handleAmountChange} />
        </div>
        <Button type="submit" className='w-full' disabled={submitting}>
          Deal {amount}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </form>
    </>
  )
}

function cns(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ')
}
