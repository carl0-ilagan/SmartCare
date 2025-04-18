"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { LogOut } from "lucide-react"
import { logoutUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function LogoutConfirmation({ isOpen, onClose }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutUser()
      onClose()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <LogOut className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-graphite">
                      Sign Out
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-drift-gray">Are you sure you want to sign out of your account?</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-earth-beige px-4 py-2 text-sm font-medium text-graphite hover:bg-pale-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-beige focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
