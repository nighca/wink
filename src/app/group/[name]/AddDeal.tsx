'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Deal, DetailedGroup, addDeal, useCurrentUser } from '@/models'
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const minAmount = 1
const defaultAmount = 1

export default function AddDeal({ group, onAdded }: {
  group: DetailedGroup
  onAdded: (deals: Deal[]) => void
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
    setAmount(Math.min(defaultAmount, balance ?? 100))
  }

  const [note, setNote] = useState('')
  function handleNoteChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNote(e.target.value)
  }

  const balance = user == null ? null : (group.balance[user.id] ?? null)
  const maxAmount = balance ?? 100
  const quickAmounts = [1, 5, 10, 20, 50].filter(v => v <= maxAmount)
  const [amount, setAmount] = useState(defaultAmount)
  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.valueAsNumber)
  }
  const [submitting, setSubmitting] = useState(false)

  async function handleAddDeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const deals = await addDeal(group.name, { note, amount })
      endEditting()
      onAdded(deals)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      {balance != null && <p className='text-xs text-slate-500 text-center'>My balance: ${balance}</p>}
      {balance != null && balance > 0 && (
        <Button className={cns('w-full', editting && 'hidden')} onClick={startEditting}>
          Add deal
        </Button>
      )}
      <form className={cns("grid gap-4", !editting && 'hidden')} onSubmit={handleAddDeal}>
        <Textarea ref={noteInput} name="note" disabled={submitting} placeholder="Note" required value={note} onChange={handleNoteChange} />
        <div className='flex gap-2 items-center justify-start'>
          <Label>$</Label>
          <Input type='number' disabled={submitting} min={minAmount} max={maxAmount} value={amount} onChange={handleAmountChange} />
          {quickAmounts.map(v => (
            <Badge key={v} variant="secondary" onClick={() => setAmount(v)}>{v}</Badge>
          ))}
        </div>
        <Button type="submit" className='w-full' loading={submitting}>
          Deal
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
