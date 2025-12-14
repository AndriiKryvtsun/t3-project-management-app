import {AuthContainer} from "@/components/AuthContainer";

export default function Home() {
  return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <AuthContainer />
      </main>
  );
}
