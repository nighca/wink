'use server'

import { redirect } from 'next/navigation'
import { unstable_noStore } from 'next/cache'
import { kv } from '@vercel/kv'
import { Deal, DetailedGroup, Group } from './types'
import { ensureUser } from './user'

export async function getGroup(key: string) {
  const user = await ensureUser()
  unstable_noStore()
  const group = await kv.get<Group>(key)
  if (group == null) throw new Error('Not found')
  // TODO
  if (!group.members.includes(user.id)) throw new Error('Unauthorized')
  return group
}

export async function getDetailedGroup(name: string): Promise<DetailedGroup> {
  const group = await getGroup(name)
  const memberProfiles = group.members.map(id => {
    // TODO
    return {
      id,
      name: id,
      email: id,
      picture: '',
    }
  })
  return { ...group, memberProfiles }
}

async function setGroup(key: string, value: Group) {
  const user = await ensureUser()
  return kv.set<Group>(key, value)
}

function validateName(name: string) {
  if (name.trim() === '') throw new Error('Empty name')
  if (name.length > 20) throw new Error('Name too long')
}

export async function createGroup(formData: FormData) {
  const user = await ensureUser()
  const name = formData.get('name') as string
  validateName(name)
  const exists = (await kv.exists(name)) > 0
  if (exists) throw new Error('Group already exists')
  await kv.set<Group>(name, {
    name,
    members: [user.id],
    balance: { [user.id]: 100 },
    deals: [],
  })
  redirect(`/group/${name}`)
}

export async function addDeal(groupName: string, { amount, note }: Pick<Deal, 'amount' | 'note'>) {
  const user = await ensureUser()
  if (user == null) throw new Error('Login required')
  const group = await getGroup(groupName)
if (group.members.length !== 2) throw new Error('Not a pair')
  if (group == null) throw new Error('Group not found')
  const from = user.id
  const to = group.members.find(m => m !== user.sub)!
  const fromBalance = group.balance[from]
  if (fromBalance == null) throw new Error(`No balance for ${from}`)
  if (fromBalance < amount) throw new Error('Insufficient balance for ${from}')
  const toBalance = group.balance[to]
  if (toBalance == null) throw new Error(`No balance for ${to}`)
  const balance = {
    ...group.balance,
    [from]: fromBalance - amount,
    [to]: toBalance + amount,
  }
  const time = Date.now()
  const deal: Deal = { time, from, to, amount, note }
  await setGroup(groupName, {
    ...group,
    balance,
    deals: [...group.deals, deal],
  })
  return deal
}
