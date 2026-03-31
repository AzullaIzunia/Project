import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>🔮 Fortune App</h1>

      <Link href="/login">Login</Link><br />
      <Link href="/register">Register</Link><br />
      <Link href="/draw">Start Draw</Link>
    </div>
  )
}