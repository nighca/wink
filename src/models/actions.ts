'use server'

import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'
import { Deal, Group } from './types'

import { unstable_noStore } from 'next/cache'

export async function getGroup(key: string) {
  unstable_noStore()
  return kv.get<Group>(key)
}

export async function setGroup(key: string, value: Group) {
  return kv.set<Group>(key, value)
}

export async function createGroup(formData: FormData) {
  const name = formData.get('name') as string
  if (name.trim() === '') throw new Error('Invalid name')
  const exists = (await kv.exists(name)) > 0
  if (exists) {
    throw new Error('Group already exists')
  }
  await kv.set<Group>(name, {
    name,
    members: ['nighca', 'ttt'],
    balance: { nighca: 100, ttt: 100 },
    deals: [],
  })
  redirect(`/group/${name}`)
}

export async function addDeal(group: string, deal: Deal) {
  const g = await getGroup(group)
  if (g == null) throw new Error('Group not found')
  g.deals.push(deal)
  await setGroup(group, g)
}
