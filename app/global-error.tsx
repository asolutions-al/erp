"use client"

import { Button } from "@/components/ui/button"

export default function Error() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
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
