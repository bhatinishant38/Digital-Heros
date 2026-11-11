import { Suspense } from "react";
import { auth } from "../api/auth/[...nextauth]/auth";


export default async function Dashboard() {
 
  
 const session = await auth

  if (!session) {
    return <h1>Please login first</h1>;
  }

  return (
    <div>
      <h1 className="text-black">Welcome {session.user.id}</h1>
      <p>{session.user.email}</p>
    </div>
  );
}

