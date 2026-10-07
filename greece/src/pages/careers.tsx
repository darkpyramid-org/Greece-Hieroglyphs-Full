import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import { Briefcase, Heart, Zap, Users } from "lucide-react";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";

const OPENINGS = [
  { title: "Senior Graphic Designer", dept: "Creative", location: "Cairo, Egypt", type: "Full-time", desc: "Design premium Egyptian streetwear graphics, seasonal collections, and brand identity materials.", skills: ["Adobe Illustrator", "Photoshop", "Brand design", "Typography"] },
  { title: "Social Media & Content Manager", dept: "Marketing", location: "Cairo, Egypt", type: "Full-time", desc: "Build GREECE's digital presence across Instagram, TikTok, and YouTube.", skills: ["Instagram/TikTok", "Video editing", "Copywriting", "Arabic & English"] },
  { title: "E-commerce & Fulfillment Specialist", dept: "Operations", location: "Cairo, Egypt", type: "Full-time", desc: "Manage order processing, inventory, and logistics for our rapidly growing online store.", skills: ["Inventory management", "Shipping logistics", "Customer service", "Excel"] },
  { title: "Fashion Photographer & Videographer", dept: "Creative", location: "Cairo, Egypt", type: "Freelance", desc: "Capture GREECE's Egyptian streetwear aesthetic in editorial photoshoots and video campaigns.", skills: ["DSLR/Mirrorless", "Lightroom", "Video production", "Street photography"] },
];

const PERKS = [
  { icon: Heart, title: "Wear What You Make", desc: "Annual clothing allowance — wear GREECE to work, every day." },
  { icon: Zap, title: "Move Fast, Build Real", desc: "Flat structure. Your ideas become products in weeks, not years." },
  { icon: Users, title: "Culture-Forward Team", desc: "Work with Egyptians passionate about heritage, design, and street culture." },
  { icon: Briefcase, title: "Grow With the Brand", desc: "Early team members grow as the brand grows. Equity for exceptional talent." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.careers} />
      <Navbar />

      {/* ── HERO ── */}
      <section className="py-20 section-ink text-[#FDF8EF] text-center">
        <div className="container mx-auto px-4">
          <Briefcase className="h-12 w-12 text-[#C89D29] mx-auto mb-6" />
          <h1 className="text-5xl font-black hieroglyph-font mb-4">
            JOIN THE <span className="text-[#C89D29]">GREECE TEAM</span>
          </h1>
          <p className="text-[#FDF8EF]/70 max-w-xl mx-auto">
            Build the future of Egyptian streetwear with passionate creators based in Cairo.
          </p>
        </div>
      </section>

      {/* Wave: Hero → Content */}
      <WaveDivider from="ink" to="paper" variant={2} flip />

      {/* ── WHY GREECE ── */}
      <section className="py-16 section-paper">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-black hieroglyph-font mb-8 section-heading">WHY <span className="text-[#C89D29]">GREECE</span></h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {PERKS.map((p, i) => (
              <div key={i} className="greece-card p-5 flex gap-4">
                <div className="w-10 h-10 bg-[#C89D29]/15 rounded-lg flex items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-[#C89D29]" />
                </div>
                <div>
                  <p className="font-black hieroglyph-font text-sm mb-1 section-heading">{p.title}</p>
                  <p className="text-xs section-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black hieroglyph-font mb-8 section-heading">OPEN <span className="text-[#C89D29]">POSITIONS</span></h2>
          <div className="space-y-4">
            {OPENINGS.map((job, i) => (
              <div key={i} className="greece-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-black hieroglyph-font text-base section-heading">{job.title}</h3>
                    <div className="flex items-center gap-3 text-xs section-faint mt-1">
                      <span>{job.dept}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span className={`font-bold ${job.type === "Freelance" ? "text-[#213D9A] dark:text-[#7B93E8]" : "text-[#1D4D4F] dark:text-[#4A9EA1]"}`}>{job.type}</span>
                    </div>
                  </div>
                  <a href="mailto:darkpyramid.solutions@gmail.com" className="bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] px-4 py-2 text-xs font-black hieroglyph-font rounded-lg transition-all shrink-0">
                    APPLY NOW
                  </a>
                </div>
                <p className="text-sm section-muted mb-3">{job.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s, j) => (
                    <span key={j} className="text-[10px] font-bold bg-[#C89D29]/15 dark:bg-[#C89D29]/20 text-[#1B1B1B] dark:text-[#FDF8EF] px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Content → Footer */}
      <WaveDivider from="paper" to="ink" variant={4} />

      <Footer />
    </div>
  );
}
