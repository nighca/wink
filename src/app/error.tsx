'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error)
  }, [error])
 
  return (
    <>
      <h2>Something went wrong!</h2>
      <p className='mt-2 text-sm text-slate-500'>{error.message}</p>
      <footer className='mt-4'>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Go back
        </Button>
      </footer>
    </>
  )
}
