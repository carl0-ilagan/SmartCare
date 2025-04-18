"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckCircle } from "lucide-react"

export function SignupSuccessModal({ isOpen, onClose, userData }) {
  if (!userData) return null

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
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <Dialog.Title as="h3" className="mt-4 text-lg font-medium leading-6 text-graphite">
                    Account Created Successfully!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-drift-gray">
                      Welcome to SmartCare, {userData.name}! Your account has been created as a{" "}
                      <span className="font-medium">{userData.userType}</span>.
                    </p>
                  </div>

                  <div className="mt-4 w-full rounded-md bg-pale-stone p-4 text-left">
                    <p className="text-sm font-medium text-graphite">Account Details:</p>
                    <ul className="mt-2 space-y-1 text-sm text-drift-gray">
                      <li>
                        <span className="font-medium">Name:</span> {userData.name}
                      </li>
                      <li>
                        <span className="font-medium">Email:</span> {userData.email}
                      </li>
                      <li>
                        <span className="font-medium">Account Type:</span> {userData.userType}
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 text-sm text-drift-gray">
                    <p>You will be redirected to your dashboard in a moment...</p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-soft-amber px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-amber focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
