import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      
      <div className="flex flex-col items-center justify-center text-center space-y-8">

        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Ready to Conquer Your Interview Fears?
        </h1>

        
        <p className="max-w-2xl text-lg md:text-xl text-gray-300"> 
          
          Step into our AI-powered mock interview room. Practice, get feedback, and build the confidence to land your dream job.
        </p>

        
        <Link href={'/dashboard'}>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Let's Begin
          </Button>
        </Link>

      </div>

    </main>
  );
}