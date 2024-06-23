import { Metadata, ResolvingMetadata } from 'next'
import { getDetailedGroup, getGroup } from '@/models'
import GroupDetail from './GroupDetail'

type Props = {
  params: { name: string }
}

export async function generateMetadata(
  { params }: Props,
  parentPromise: ResolvingMetadata
): Promise<Metadata> {
  const parent = await parentPromise
  const group = await getGroup(decodeURIComponent(params.name))
  return {
    title: [group.name, parent.title?.absolute].filter(Boolean).join(' - '),
  }
}

export default async function Page({ params }: Props) {
  const group = await getDetailedGroup(decodeURIComponent(params.name))
  return <GroupDetail group={group} />
}
