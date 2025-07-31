import tw from 'tailwind-styled-components'

export const Alert = tw.div`data-[state=open]:animate-in shadow-lg data-[state=open]:fade-in-0 [transition-behavior:allow-discrete] data-[state=open]:slide-in-from-top-4 transition-all data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 fixed top-0 left-0 right-auto flex items-center w-full bg-destructive text-destructive-foreground px-4 py-3 z-[9999] gap-3`
export const AlertContent = tw.div`inline-flex flex-col`
export const AlertTitle = tw.h5`font-medium`
export const AlertDescription = tw.p`text-sm`
export const AlertClose = tw.button`ml-auto self-start hover:opacity-80 transition-opacity duration-200 ease-in-out`
