import Link from "next/link"

export default function Fail() {
  return (
    <div>
      <h1>Payment Failed ❌</h1>
      <Link href="/payment">Try Again</Link>
    </div>
  )
}