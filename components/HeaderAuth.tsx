import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function HeaderAuth() {
  return (
    <div>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </div>
  );
}
