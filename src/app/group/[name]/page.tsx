import { getGroup } from '@/models'
import GroupDetail from './GroupDetail'

export default async function Page({ params }: { params: { name: string } }) {
  const group = await getGroup(params.name)
  if (group == null) throw new Error('Group not found')
  return <GroupDetail group={group} />
}
