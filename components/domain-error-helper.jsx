import { Info } from "lucide-react"

export function DomainErrorHelper() {
  return (
    <div className="p-4 rounded-md bg-amber-50 text-amber-700 text-sm flex items-start">
      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Firebase Authentication Domain Error</p>
        <p className="mt-1">To fix this error, you need to add your current domain to Firebase authorized domains:</p>
        <ol className="list-decimal ml-5 mt-1">
          <li>
            Go to the Firebase Console:{" "}
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 underline"
            >
              https://console.firebase.google.com/
            </a>
          </li>
          <li>Select your project</li>
          <li>Go to Authentication → Settings → Authorized Domains</li>
          <li>Add your current domain (Vercel preview URL or localhost)</li>
        </ol>
        <p className="mt-2">Common domains to add:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>localhost</li>
          <li>Your Vercel preview URL (e.g., smart-care-git-main-yourusername.vercel.app)</li>
          <li>Your production domain</li>
        </ul>
      </div>
    </div>
  )
}
