"use client";

import { useState } from "react";
import { UploadCloud, ArrowLeft, ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { key: "painting", label: "Painting" },
  { key: "photography", label: "Photography" },
  { key: "digital", label: "Digital Art" },
  { key: "sculpture", label: "Sculpture" },
  { key: "mixed", label: "Mixed Media" },
];

export default function AddArtworkPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/artist/artworks");
    }, 1500);
  };

  return (
    <div className="min-h-full text-foreground px-10 pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/artist/artworks"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary mb-5"
        >
          <ArrowLeft className="size-4" />
          Back to Artworks
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-[26px]">
          Add New Artwork
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Fill in the details below to list your new artwork.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">

          {/* Artwork Details Card */}
          <section className="rounded-xl border border-separator bg-accent/30 dark:bg-accent/20 p-6">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Artwork Details
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Starry Night Resonance"
                  className="w-full rounded-xl border border-separator bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="What inspired this piece? Describe the technique, meaning, and emotion behind your artwork..."
                  className="w-full rounded-xl border border-separator bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[120px]"
                />
              </div>
            </div>
          </section>

          {/* Classification & Pricing Card */}
          <section className="rounded-xl border border-separator bg-accent/30 dark:bg-accent/20 p-6">
            <h2 className="text-base font-semibold mb-5">Classification & Pricing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-separator bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="price" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-xl border border-separator bg-background pl-8 pr-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:sticky lg:top-6 space-y-6">

          {/* Image Upload Card */}
          <section className="rounded-xl border border-separator bg-accent/30 dark:bg-accent/20 p-6">
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" />
              Upload Image
            </h2>

            <div
              className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden group
                ${isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-separator bg-background hover:border-primary/40 hover:bg-accent/20"
                }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
                required={!imagePreview}
              />

              {imagePreview ? (
                <div className="absolute inset-0 z-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full flex items-center gap-2">
                      <UploadCloud className="size-4" />
                      Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center pointer-events-none">
                  <div className={`rounded-full p-3.5 transition-colors duration-200 ${isDragging ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"}`}>
                    <UploadCloud className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Drag & drop your image</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">JPG, PNG, WEBP — Max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <span className="inline-block size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Publish Artwork"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/artist/artworks")}
              className="w-full rounded-xl border border-separator bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent/40"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
