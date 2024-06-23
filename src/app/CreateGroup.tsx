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

export default function CreateGroup() {
  return (
    <Card className="mx-auto max-w-sm h-full">
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
            <Input type="text" name="name" placeholder="" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="member">Another member</Label>
            <Input type="text" name="member" placeholder="Paste the user ID here" required />
          </div>
          {/* TODO: pending status for submit button */}
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
