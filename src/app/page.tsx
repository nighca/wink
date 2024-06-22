'use client'

import { createGroup } from '@/models'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Page() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create group</CardTitle>
        <CardDescription>
          Enter the group name below to create a new group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={createGroup}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" placeholder="test" required />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
