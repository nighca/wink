import { ensureCurrentUser } from '@/models'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GroupForm from './GroupForm'

export default async function Page() {
  const user = await ensureCurrentUser()
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Hi {user?.name}</CardTitle>
        <CardDescription>
          Enter the group name below to start.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GroupForm />
      </CardContent>
    </Card>
  )
}
