import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

import {
  ArrowRight,
  Play,
  BookOpen,
  GraduationCap,
  Rocket,
  Crown,
  CheckCircle2,
  Star,
  Youtube,
  Trophy,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { FEATURED_COURSES_QUERY, STATS_QUERY } from "@/sanity/lib/queries";
import { CourseCard } from "@/components/courses/CourseCard";

const FALLBACK_COURSES = [
  {
    slug: { current: "programming-with-c" },
    title: "Programming with C",
    description:
      "Master C programming from basics to advanced concepts. Learn system programming, memory management, and build a strong foundation for low-level programming.",
    tier: "free",
    moduleCount: 3,
    lessonCount: 8,
  },
  {
    slug: { current: "programming-with-cpp" },
    title: "Programming with C++",
    description:
      "Learn modern C++ programming with object-oriented design, STL, and advanced features. Perfect for building high-performance applications.",
    tier: "free",
    moduleCount: 3,
    lessonCount: 9,
  },
];

const FALLBACK_STATS = { courseCount: 2, lessonCount: 17 };

export default async function Home() {
  const isSignedIn = await currentUser().then((user) => !!user);
  const hasSanityConfig = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  );

  // Fetch featured courses, stats, and check auth status
  const [courses, stats] = hasSanityConfig
    ? await (async () => {
        const { sanityFetch } = await import("@/sanity/lib/live");
        const [{ data: fetchedCourses }, { data: fetchedStats }] =
          await Promise.all([
            sanityFetch({ query: FEATURED_COURSES_QUERY }),
            sanityFetch({ query: STATS_QUERY }),
          ]);

        return [fetchedCourses ?? [], fetchedStats ?? FALLBACK_STATS] as const;
      })()
    : [FALLBACK_COURSES, FALLBACK_STATS];
  return (
    <div className="landing-shell min-h-screen overflow-hidden text-white">
      <div className="landing-grid pointer-events-none fixed inset-0" />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="landing-hero mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12 lg:pt-16">
          <div className="relative z-10 max-w-2xl">
            {/* Badge */}
            <div
              className="mb-8 inline-flex items-center gap-2 border-l-2 border-amber-400 pl-3 text-left animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-amber-200">
                Learn anything with structured courses
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mb-8 text-5xl font-black leading-[0.94] tracking-[-0.04em] text-white md:text-7xl lg:text-[5.5rem] animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="block text-white">Master any subject</span>
              <span className="block text-emerald-300">
                the smart way
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-300 md:text-xl animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Your complete learning platform for school, college, and competitive exams.
              From CBSE & ICSE syllabi to{" "}
              <span className="text-amber-300">NEB & IOE prep</span> and{" "}
              <span className="text-emerald-300">skill courses</span>.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="h-12 border-0 bg-amber-400 px-8 text-base font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 hover:bg-amber-300"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/courses">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
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
                      className="h-12 border-0 bg-amber-400 px-8 text-base font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 hover:bg-amber-300"
                    >
                      <Play className="w-4 h-4 mr-2 fill-white" />
                      Start Learning Free
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-5 text-sm text-zinc-500">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0b0f0e] bg-emerald-500"><BookOpen className="h-3.5 w-3.5 text-zinc-950" /></span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0b0f0e] bg-amber-400"><Play className="h-3.5 w-3.5 fill-zinc-950 text-zinc-950" /></span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0b0f0e] bg-cyan-300"><GraduationCap className="h-3.5 w-3.5 text-zinc-950" /></span>
              </div>
            </div>
          </div>

          <div className="hero-art relative min-h-[25rem] overflow-hidden sm:min-h-[31rem]">
            <Image
              src="/hero-img.jpg"
              alt="Gyan Walla Academy learning platform"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0b0f0e]/10" />
          </div>

          <div className="col-span-full">

            {/* Stats */}
              <div
              className="mt-4 grid grid-cols-3 gap-4 border-y border-white/10 py-6 md:gap-16 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              {[
                {
                  value: stats?.courseCount ?? 0,
                  label: "Courses",
                  icon: BookOpen,
                },
                {
                  value: stats?.lessonCount ?? 0,
                  label: "Lessons",
                  icon: Play,
                },
                { value: "1.5K+", label: "Subscribers", icon: Youtube, link: "https://www.youtube.com/@GYAN_WALLA/videos" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  {'link' in stat && stat.link ? (
                    <a href={stat.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-1 hover:text-red-400 transition-colors">
                      <stat.icon className="w-4 h-4 text-red-500" />
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {stat.value}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4 text-violet-400" />
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {stat.value}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>


{/* Featured courses */}
 <section id="courses" className="landing-section px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Courses built for{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                real results
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Each course is packed with modules and lessons designed to take
              you from zero to job-ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course:any) => (
              <CourseCard
                key={course.slug!.current!}
                slug={{ current: course.slug!.current! }}
                title={course.title}
                description={course.description}
                tier={course.tier}
                thumbnail={course.thumbnail}
                moduleCount={course.moduleCount}
                lessonCount={course.lessonCount}
              />
            ))}
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
          </div>
        </section>

 
 
          </div>
        </section>

       {/*Pricing modeal*/}
      <section className="landing-section px-6 py-20 lg:px-12">
    <div className="mx-auto grid max-w-7xl md:grid-cols-3 gap-6">
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
className={`landing-card relative p-8 ${plan.bgGlow} ${plan.popular ? "ring-2 ring-emerald-500/50" : ""} transition-all duration-300 hover:-translate-y-1`}
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
<section id="courses" className="landing-section px-6 py-20 lg:px-12">
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
className="landing-section px-6 py-20 lg:px-12"
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
className="landing-card p-6"
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
    <section className="landing-section px-6 py-20 lg:px-12">
  <div className="relative mx-auto max-w-7xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-amber-500/10 p-12 text-center md:p-20">
{/* Animated gradient border */}
<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-xl" />

<div className="relative z-10">
<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 shadow-lg shadow-amber-500/20">
<Rocket className="w-8 h-8 text-white" />
</div>
<h2 className="text-3xl md:text-5xl font-bold mb-6">
Ready to ace your exams?
</h2>
<p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
Start with free courses or unlock everything with Pro and Ultra.
Your learning journey begins now.
</p>
<Link href="/pricing">
<Button
size="lg"
className="h-14 border-0 bg-amber-400 px-10 text-lg font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 hover:bg-amber-300"
>
View Pricing
<ArrowRight className="w-5 h-5 ml-2" />
</Button>
</Link>
</div>
</div>
</section>
        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t border-zinc-800/50 max-w-7xl mx-auto">
<div className="flex flex-col md:flex-row items-center justify-between gap-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
<GraduationCap className="w-4 h-4 text-white" />
</div>
<span className="font-bold">Gyan Walla Academy</span>
</div>
<div className="flex items-center gap-8 text-sm text-zinc-500">
<Link href="#" className="hover:text-white transition-colors">
Privacy
</Link>
<Link href="#" className="hover:text-white transition-colors">
Terms
</Link>
<Link href="#" className="hover:text-white transition-colors">
Contact
</Link>
</div>
<p className="text-sm text-zinc-600">
© 2025 Gyan Walla Academy. All rights reserved.
</p>
</div>
</footer>


        
      </main>
    </div>
  );
}