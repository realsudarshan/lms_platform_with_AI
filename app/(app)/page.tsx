import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

import {
  ArrowRight,
  Play,
  BookOpen,
  Code2,
  Rocket,
  Crown,
  CheckCircle2,
  Star,
  Users,
  Trophy,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // Fetch featured courses, stats, and check auth status
const isSignedIn = await currentUser().then(user => !!user);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">
                Learn anything with structured courses
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="block text-white">Master any subject</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                the smart way
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Your complete learning platform for school, college, and competitive exams.
              From CBSE & ICSE syllabi to{" "}
              <span className="text-emerald-400">NEB & IOE prep</span> and{" "}
              <span className="text-teal-400">skill courses</span>.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-xl shadow-emerald-600/30 px-8 h-12 text-base font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/courses">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-zinc-700 bg-white/5 text-white px-8 h-12 text-base hover:bg-white/10 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      My Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-xl shadow-emerald-600/30 px-8 h-12 text-base font-semibold"
                    >
                      <Play className="w-4 h-4 mr-2 fill-white" />
                      Start Learning Free
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-zinc-700 bg-white/5 text-white px-8 h-12 text-base hover:bg-white/10 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
 
          </div>
        </section>

       {/*Pricing modeal*/}
       <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
<div className="grid md:grid-cols-3 gap-6">
{[
{
tier: "Free",
icon: Rocket,
color: "emerald",
gradient: "from-emerald-500 to-teal-600",
bgGlow: "bg-emerald-500/10",
borderColor: "border-emerald-500/20",
description: "Start your journey with foundational courses",
features: [
"School syllabus basics",
"Community access",
"Practice quizzes",
],
},
{
tier: "Pro",
icon: Crown,
color: "emerald",
gradient: "from-emerald-500 to-teal-600",
bgGlow: "bg-emerald-500/10",
borderColor: "border-emerald-500/30",
description: "Complete syllabus coverage with exam preparation",
features: [
"All Free content",
"Full syllabus courses",
"Doubt clearing sessions",
"Certificates",
],
popular: true,
},
{
tier: "Ultra",
icon: Trophy,
color: "cyan",
gradient: "from-cyan-400 to-blue-600",
bgGlow: "bg-cyan-500/10",
borderColor: "border-cyan-500/20",
description:
"Premium learning with AI tutor & personal mentorship",
features: [
"Everything in Pro",
"AI Learning Assistant",
"Competitive exam prep",
"1-on-1 mentorship",
],
},
].map((plan) => (
<div
key={plan.tier}
className={`relative p-8 rounded-2xl ${plan.bgGlow} border ${plan.borderColor} ${plan.popular ? "ring-2 ring-emerald-500/50" : ""} transition-all duration-300 hover:scale-[1.02]`}
>
{plan.popular && (
<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-semibold">
Most Popular
</div>
)}
<div
className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}
>
<plan.icon className="w-6 h-6 text-white" />
</div>
<h3 className="text-2xl font-bold mb-2">{plan.tier}</h3>
<p className="text-zinc-400 text-sm mb-6">{plan.description}</p>
<ul className="space-y-3">
{plan.features.map((feature) => (
<li
key={feature}
className="flex items-center gap-2 text-sm text-zinc-300"
>
<CheckCircle2
className={`w-4 h-4 ${plan.color === "emerald" ? "text-emerald-400" : plan.color === "teal" ? "text-teal-400" : "text-cyan-400"}`}
/>
{feature}
</li>
))}
</ul>
</div>
))}
</div>
</section>

{/* Featured Courses */}
<section id="courses" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
<div className="text-center mb-16">
<h2 className="text-3xl md:text-5xl font-bold mb-4">
Courses built for{" "}
<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
real results
</span>
</h2>
<p className="text-zinc-400 text-lg max-w-2xl mx-auto">
Each course is structured with modules and lessons designed to help
you excel in your academics and beyond.
</p>
</div>


<div className="text-center mt-10">
<Link href="/dashboard">
<Button
variant="outline"
className="border-zinc-700 bg-white/5 text-white hover:bg-white/10 hover:text-white"
>
View All Courses
<ArrowRight className="w-4 h-4 ml-2" />
</Button>
</Link>
</div>
</section>
       
        {/* Testimonials */}
    <section
id="testimonials"
className="px-6 lg:px-12 py-20 max-w-7xl mx-auto"
>
<div className="text-center mb-16">
<h2 className="text-3xl md:text-5xl font-bold mb-4">
Students{" "}
<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
love it
</span>
</h2>
</div>

<div className="grid md:grid-cols-3 gap-6">
{[
{
name: "Aarav Sharma",
role: "Class 12 Student",
content:
"यो प्लेटफर्म सच्चै राम्रो छ! मेरो NEB परीक्षाको तयारीमा धेरै सहयोग भयो। ३ महिनामै मेरो ग्रेड सुधार भयो!",
avatar: "🧑‍💻",
},
{
name: "Priya Adhikari",
role: "IOE Aspirant",
content:
"Ultra tier को AI tutor र 1-on-1 mentorship ले मलाई IOE entrance crack गर्न मद्दत गर्यो। Best investment!",
avatar: "👩‍💼",
},
{
name: "Rohan Thapa",
role: "College Student",
content:
"Pro courses हरूले मेरो college lectures ले नबुझाएका topics राम्रोसँग explain गर्यो। धन्यवाद!",
avatar: "🎓",
},
].map((testimonial) => (
<div
key={testimonial.name}
className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800"
>
<div className="flex items-center gap-1 mb-4">
{[...Array(5)].map((_, i) => (
<Star
key={`star-${testimonial.name}-${i}`}
className="w-4 h-4 text-amber-400 fill-amber-400"
/>
))}
</div>
<p className="text-zinc-300 mb-6 leading-relaxed">
&ldquo;{testimonial.content}&rdquo;
</p>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
{testimonial.avatar}
</div>
<div>
<p className="font-semibold text-sm">{testimonial.name}</p>
<p className="text-xs text-zinc-500">{testimonial.role}</p>
</div>
</div>
</div>
))}
</div>
</section>   

        {/* CTA Section */}
     
        {/* Footer */}
        
      </main>
    </div>
  );
}