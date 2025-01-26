"use client"

import { Button } from "@/components/ui/button"

export default function Error() {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
            <h1 className="mb-4 text-4xl font-bold text-red-600">Oops!</h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Something went wrong
            </h2>
            <p className="mb-6 text-gray-600">
              We're sorry, but it seems there was an error. Our team has been
              notified and we're working to fix it.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go back home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
