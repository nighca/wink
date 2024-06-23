'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Deal, DetailedGroup, addDeal, useCurrentUser } from '@/models'
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from '@/components/ui/label'

export default function AddDeal({ group, onAdded }: {
  group: DetailedGroup
  onAdded: (deal: Deal) => void
}) {
  const { user } = useCurrentUser()
  const noteInput = useRef<HTMLTextAreaElement>(null)

  const [editting, setEditting] = useState(false)
  function startEditting() {
    setEditting(true)
    setTimeout(() => {
      noteInput.current?.focus()
    }, 0)
  }
  function endEditting() {
    setEditting(false)
    setNote('')
    setAmount(Math.min(10, balance ?? 100))
  }

  const [note, setNote] = useState('')
  function handleNoteChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNote(e.target.value)
  }

  const balance = user == null ? null : (group.balance[user.id] ?? null)
  const minAmount = 1
  const maxAmount = balance ?? 100
  const [amount, setAmount] = useState(1)
  function handleAmountChange([amount]: number[]) {
    setAmount(amount)
  }

  const [submitting, setSubmitting] = useState(false)

  async function handleAddDeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const deal = await addDeal(group.name, { note, amount })
      endEditting()
      onAdded(deal)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      {balance != null && <p className='text-xs text-slate-500 text-center'>My balance: {balance}</p>}
      {balance != null && balance > 0 && (
        <Button className={cns('w-full', editting && 'hidden')} onClick={startEditting}>
          Add deal
        </Button>
      )}
      <form className={cns("grid gap-4", !editting && 'hidden')} onSubmit={handleAddDeal}>
        <Textarea ref={noteInput} name="note" disabled={submitting} placeholder="Note" required value={note} onChange={handleNoteChange} />
        <div className='flex gap-2 items-center'>
          <Label>Amount</Label>
          <span className='text-xs text-slate-500'>{minAmount}</span>
          <Slider disabled={submitting} min={minAmount} max={maxAmount} step={1} value={[amount]} onValueChange={handleAmountChange} />
          <span className='text-xs text-slate-500'>{maxAmount}</span>
          </div>
        <Button type="submit" className='w-full' loading={submitting}>
          Deal {amount}
        </Button>
        <Button type="button" variant="ghost" disabled={submitting} onClick={endEditting}>
          Cancel
        </Button>
      </form>
    </>
  )
}

function cns(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ')
}
