'use server'

import { redirect } from 'next/navigation'
import { unstable_noStore } from 'next/cache'
import { kv } from '@vercel/kv'
import { Deal, DetailedGroup, Group } from './types'
import { ensureCurrentUser, getUserWithId } from './user'

export async function checkInGroup(name: string) {
  const user = await ensureCurrentUser()
  unstable_noStore()
  const group = await kv.get<Group>(name)
  if (group == null) return false
  if (!group.members.includes(user.id)) return false
  return true
}

export async function getGroup(name: string) {
  const user = await ensureCurrentUser()
  unstable_noStore()
  const group = await kv.get<Group>(name)
  if (group == null) throw new Error(`Group ${name} not found`)
  // TODO
  if (!group.members.includes(user.id)) throw new Error('Unauthorized')
  return {
    ...group,
    // Only keep the last 100 deals
    deals: group.deals.slice(-100)
  }
}

export async function getDetailedGroup(name: string): Promise<DetailedGroup> {
  const group = await getGroup(name)
  const memberProfiles = await Promise.all(group.members.map(async id => {
    const user = await getUserWithId(id)
    return user
  }))
  return { ...group, memberProfiles }
}

async function setGroup(key: string, value: Group) {
  const user = await ensureCurrentUser()
  return kv.set<Group>(key, value)
}

function validateName(name: string) {
  if (name.trim() === '') throw new Error('Empty name')
  if (name.length > 20) throw new Error('Name too long')
}

export async function createGroup(formData: FormData) {
  const user = await ensureCurrentUser()
  const nameValue = formData.get('name')
  if (nameValue == null) throw new Error('Name required')
  const name = nameValue as string
  validateName(name)
  const exists = (await kv.exists(name)) > 0
  if (exists) throw new Error('Group already exists')
  const member = formData.get('member') as string
  if (member == '') throw new Error('Member required')
  const memberProfile = await getUserWithId(member)
  if (memberProfile == null) throw new Error(`Member ${member} not found`)
  if (memberProfile.id === user.id) throw new Error('Cannot add self')
  await kv.set<Group>(name, {
    name,
    members: [user.id, member],
    balance: { [user.id]: 100, [member]: 100 },
    deals: [],
  })
  redirect(`/group/${encodeURIComponent(name)}`)
}

export async function addDeal(groupName: string, { amount, note }: Pick<Deal, 'amount' | 'note'>) {
  const user = await ensureCurrentUser()
  if (user == null) throw new Error('Login required')
  const group = await getGroup(groupName)
if (group.members.length !== 2) throw new Error('Not a pair')
  if (group == null) throw new Error('Group not found')
  if (Number.isNaN(amount) || amount <= 0 || amount >= Number.MAX_SAFE_INTEGER) throw new Error('Invalid amount')
  const from = user.id
  const to = group.members.find(m => m !== user.id)!
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
  const deals = [...group.deals, deal]
  await setGroup(groupName, { ...group, balance, deals })
  return deals
}

export async function revertLastDeal(groupName: string) {
  const user = await ensureCurrentUser()
  if (user == null) throw new Error('Login required')
  const group = await getGroup(groupName)
  const lastDeal = group.deals[group.deals.length - 1]
  if (lastDeal == null) throw new Error('No deal to revert')
  if (lastDeal.to !== user.id) throw new Error('Not the receiver of the last deal')
  const fromBalance = group.balance[lastDeal.from]
  if (fromBalance == null) throw new Error(`No balance for ${lastDeal.from}`)
  const toBalance = group.balance[lastDeal.to]
  if (toBalance == null) throw new Error(`No balance for ${lastDeal.to}`)
  const balance = {
    ...group.balance,
    [lastDeal.from]: fromBalance + lastDeal.amount,
    [lastDeal.to]: toBalance - lastDeal.amount,
  }
  const deals = group.deals.slice(0, -1)
  await setGroup(groupName, { ...group, balance, deals })
  return deals
}
