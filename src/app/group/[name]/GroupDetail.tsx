'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useSwipeable } from 'react-swipeable'
import { Card, CardContent } from '@/components/ui/card'
import UserAvatar from '@/components/UserAvatar'
import { Deal, DetailedGroup, revertLastDeal, useCurrentUser } from '@/models'
import AddDeal from './AddDeal'

export default function GroupDetail({ group }: { group: DetailedGroup }) {

  const [deals, setDeals] = useState<Deal[]>(group.deals)

  return (
    <>
      <Card className="w-full min-h-0 flex-1 flex flex-col">
        <header className='p-6 flex flex-row justify-between items-center'>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">{group.name}</h3>
          <Members {...group} />
        </header>
        <CardContent className="flex-1 min-h-0 flex flex-col gap-3">
          <DealList deals={deals} group={group} onLastReverted={setDeals} />
          <AddDeal group={group} onAdded={setDeals} />
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

function DealList({ deals, group, onLastReverted }: { deals: Deal[], group: DetailedGroup, onLastReverted: (deals: Deal[]) => void }) {

  const { user } = useCurrentUser()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 300)
  }, [deals])

  if (deals.length === 0) {
    return <div className='flex-1 flex items-center justify-center text-center text-sm text-slate-500'>No deal</div>
  }
  return (
    <ul ref={listRef} className='flex-1 min-h-0 overflow-auto pt-4 flex flex-col gap-6 items-stretch'>
      {deals.map((deal, i) => {
        const isLast = i === deals.length - 1
        const revertable = isLast && user != null && user.id === deal.to
        if (!revertable) return <DealItem key={i} deal={deal} group={group} />
        return <RevertableDealItem key={i} deal={deal} group={group} onLastReverted={onLastReverted} />
      })}
    </ul>
  )
}

function RevertableDealItem({ deal, group, onLastReverted }: { deal: Deal, group: DetailedGroup, onLastReverted: (deals: Deal[]) => void }) {
  const [transform, setTransform] = useState('none')
  const removeHandlers = useSwipeable({
    onSwiping(e) {
      if (e.deltaX > 0) return
      setTransform(`translateX(${e.deltaX}px)`)
    },
    async onSwiped(e) {
      if (e.dir !== 'Left' || e.absX <= 100) { // 100px as threshold
        setTransform('none')
        return
      }
      setTransform('translateX(-100%)')
      const deals = await revertLastDeal(group.name)
      onLastReverted(deals)
    }
  })

  return <DealItem deal={deal} group={group} restProps={{ ...removeHandlers, style: { transform } }} />
}

function DealItem({ deal, group, restProps }: { deal: Deal, group: DetailedGroup, restProps?: HTMLAttributes<HTMLLIElement>}) {

  const date = dayjs(deal.time).format('DD/MM/YYYY')
  const amount = deal.amount.toFixed(2)
  const wisher = group.memberProfiles.find(m => m.id === deal.from)

  const [expanded, setExpanded] = useState(false)
  function toggleExpanded() {
    setExpanded(e => !e)
  }

  return (
    <li className='flex flex-row gap-4 items-start' {...restProps} onClick={toggleExpanded}>
      <UserAvatar className='w-10 h-10' user={wisher!} />
      <main className='flex-1 min-w-0 flex flex-col gap-1'>
        <p className={expanded ? '' : 'truncate'}>{deal.note}</p>
        <p className='text-xs text-slate-500'>@{date}</p>
      </main>
      <p className='font-mono grow-0 shrink-0 basis-auto flex items-center'>
        ${amount}
      </p>
    </li>
  )
}
