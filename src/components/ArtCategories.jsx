"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Grid, Palette, Camera, Monitor, Cuboid, Sparkles, Droplet } from "lucide-react";

const categories = [
  {
    name: "Painting",
    icon: Palette,
    color: "from-blue-500/20 to-blue-500/5",
    textColor: "text-blue-500",
    description: "Oil, acrylic, and watercolor masterpieces",
  },
  {
    name: "Digital Art",
    icon: Monitor,
    color: "from-purple-500/20 to-purple-500/5",
    textColor: "text-purple-500",
    description: "Illustrations, 3D, and vector graphics",
  },
  {
    name: "Photography",
    icon: Camera,
    color: "from-rose-500/20 to-rose-500/5",
    textColor: "text-rose-500",
    description: "Capturing moments in stunning clarity",
  },
  {
    name: "Sculpture",
    icon: Cuboid,
    color: "from-amber-500/20 to-amber-500/5",
    textColor: "text-amber-500",
    description: "Three-dimensional artistic expressions",
  },
  {
    name: "Abstract",
    icon: Sparkles,
    color: "from-emerald-500/20 to-emerald-500/5",
    textColor: "text-emerald-500",
    description: "Non-representational emotional works",
  },
  {
    name: "Watercolor",
    icon: Droplet,
    color: "from-cyan-500/20 to-cyan-500/5",
    textColor: "text-cyan-500",
    description: "Fluid and expressive color washes",
  },
];

const ArtCategories = () => {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
        >
          <Grid className="size-4" />
          <span>Explore by Style</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-4"
        >
          Browse Categories
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base md:text-lg max-w-2xl"
        >
          Find exactly what you are looking for by exploring our curated collections of different artistic mediums.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/browse?category=${encodeURIComponent(category.name)}`} className="group block h-full">
                <div className="relative overflow-hidden rounded-3xl border border-separator/60 bg-background/50 p-6 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 h-full flex flex-col">
                  {/* Background Gradient */}
                  <div className={`absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br ${category.color} blur-2xl opacity-50 transition-opacity group-hover:opacity-100`} />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-background border border-separator/60 shadow-sm ${category.textColor} group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ArtCategories;
