'use client'

import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent } from '@/components/ui/card'
import UserAvatar from '@/components/UserAvatar'
import { Deal, DetailedGroup } from '@/models'
import AddDeal from './AddDeal'

export default function GroupDetail({ group }: { group: DetailedGroup }) {

  const [deals, setDeals] = useState<Deal[]>(group.deals)

  function handleAdded(deal: Deal) {
    setDeals(ds => [...ds, deal])
  }

  return (
    <>
      <Card className="w-full min-h-0 flex-1 flex flex-col">
        <header className='p-6 flex flex-row justify-between items-center'>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">{group.name}</h3>
          <Members {...group} />
        </header>
        <CardContent className="flex-1 min-h-0 flex flex-col gap-2">
          <DealList deals={deals} group={group} />
          <AddDeal group={group} onAdded={handleAdded} />
        </CardContent>
      </Card>
    </>
  )
}

function Members({ memberProfiles }: DetailedGroup) {
  return (
    <div className='group flex gap-2'>
      {memberProfiles.map(m => (
        <UserAvatar key={m.id} className='w-6 h-6 ml-[-20px] group-hover:ml-0' user={m} />
      ))}
    </div>
  )
}

function DealList({ deals, group }: { deals: Deal[], group: DetailedGroup }) {

  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    console.log('listRef.current', listRef.current?.scrollHeight)
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 300)
  }, [deals])

  if (deals.length === 0) {
    return <div className='flex-1 flex items-center justify-center text-center text-sm text-slate-500'>No deal</div>
  }
  return (
    <ul ref={listRef} className='flex-1 min-h-0 overflow-auto pt-4 flex flex-col gap-6 items-stretch'>
      {deals.map((deal, i) => (
        <DealItem key={i} deal={deal} group={group} />
      ))}
    </ul>
  )
}

function DealItem({ deal, group }: { deal: Deal, group: DetailedGroup }) {
  const date = dayjs(deal.time).format('DD/MM/YYYY')
  const amount = deal.amount.toFixed(2)
  const wisher = group.memberProfiles.find(m => m.id === deal.from)
  return (
    <li className='flex flex-row gap-4 items-start'>
      <UserAvatar className='w-10 h-10' user={wisher!} />
      <main className='flex-1 min-w-0 flex flex-col gap-1'>
        <p className=''>{deal.note}</p>
        <p className='text-xs text-slate-500'>@{date}</p>
      </main>
      <p className='font-mono grow-0 shrink-0 basis-16 text-right'>{amount}</p>
    </li>
  )
}