import Image from "next/image"
//import Link from "next/link"


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/logo.png"
          alt="Image"
          width="1920"
          height="720"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
