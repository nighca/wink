'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Deal, getGroup, Group } from '@/models'
import AddDeal from './AddDeal'

export default function GroupDetail({ group }: { group: Group }) {

  const [deals, setDeals] = useState<Deal[]>(group.deals)

  function handleAdded(deal: Deal) {
    setDeals(ds => [...ds, deal])
  }

  return (
    <>
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Group {group.name}</CardTitle>
          <CardDescription>
            Members: {group.members.join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Wisher</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal, i) => (
                <DealRow key={i} {...deal} />
              ))}
            </TableBody>
          </Table>
          <AddDeal group={group} onAdded={handleAdded} />
        </CardContent>
      </Card>
    </>
  )
}

function DealRow(deal: Deal) {
  const date = dayjs(deal.time).format('DD/MM/YYYY')
  const amount = deal.amount.toFixed(2)
  return (
    <TableRow>
      <TableCell className="font-medium">{date}</TableCell>
      <TableCell>{deal.from}</TableCell>
      <TableCell>{deal.note}</TableCell>
      <TableCell className="text-right">{amount}</TableCell>
    </TableRow>
  )
}