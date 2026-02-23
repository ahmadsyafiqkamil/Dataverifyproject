import { useState, useMemo } from "react";
import { Search, X, LayoutGrid, List, Sparkles, TrendingUp, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterSidebar } from "../components/marketplace/FilterSidebar";
import { MarketplaceCard } from "../components/marketplace/MarketplaceCard";
import { allDatasets } from "../data/marketplaceDatasets";

const ITEMS_PER_PAGE = 6;

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [qualityRange, setQualityRange] = useState<[number, number]>([0, 100]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Domain ID to label map
  const domainMap: Record<string, string> = {
    healthcare: "Healthcare",
    finance: "Finance",
    autonomous: "Autonomous Vehicles",
    nlp: "NLP",
    cv: "Computer Vision",
  };

  // Filter and sort datasets
  const filtered = useMemo(() => {
    let result = [...allDatasets];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.domain.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    }

    // Domain filter
    if (selectedDomains.length > 0) {
      result = result.filter(d =>
        selectedDomains.some(sd => domainMap[sd]?.toLowerCase() === d.domain.toLowerCase())
      );
    }

    // Quality filter
    result = result.filter(d =>
      d.qualityScore >= qualityRange[0] && d.qualityScore <= qualityRange[1]
    );

    // Price filter
    result = result.filter(d =>
      parseFloat(d.price) >= priceRange[0] && parseFloat(d.price) <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "Highest Score": result.sort((a, b) => b.qualityScore - a.qualityScore); break;
      case "Lowest Price": result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case "Highest Price": result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      case "Most Popular": result.sort((a, b) => b.purchases - a.purchases); break;
      default: result.sort((a, b) => b.id - a.id); break;
    }

    return result;
  }, [searchQuery, selectedDomains, qualityRange, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 on filter change
  const handleSearchChange = (v: string) => { setSearchQuery(v); setCurrentPage(1); };
  const handleDomains = (d: string[]) => { setSelectedDomains(d); setCurrentPage(1); };
  const handleTypes = (t: string[]) => { setSelectedTypes(t); setCurrentPage(1); };
  const handleQuality = (r: [number, number]) => { setQualityRange(r); setCurrentPage(1); };
  const handlePrice = (r: [number, number]) => { setPriceRange(r); setCurrentPage(1); };
  const handleSort = (s: string) => { setSortBy(s); setCurrentPage(1); };

  const activeFilterCount = selectedDomains.length + selectedTypes.length +
    (qualityRange[0] > 0 || qualityRange[1] < 100 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#38bdf8" }} />
            <span style={{ color: "#38bdf8", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              2,847 DATASETS AVAILABLE
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ color: "white", fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Dataset{" "}
              <span style={{ background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Marketplace
              </span>
            </h1>
            <p style={{ color: "#475569", fontSize: "0.88rem", marginTop: "5px" }}>
              Browse verified synthetic datasets mined and scored on Bittensor
            </p>
          </div>

          {/* Market stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: TrendingUp, label: "Vol 24h", value: "1,482 TAO", color: "#34d399" },
              { icon: Database, label: "New Today", value: "+38 datasets", color: "#a78bfa" },
              { icon: Sparkles, label: "Top Score", value: "98/100", color: "#fbbf24" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Icon size={12} style={{ color }} />
                <span style={{ color: "#475569", fontSize: "0.72rem" }}>{label}:</span>
                <span style={{ color: "white", fontSize: "0.72rem", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-5">
        <div
          className="relative flex items-center rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(56,189,248,0.15)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(56,189,248,0.4)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(56,189,248,0.08), 0 4px 20px rgba(0,0,0,0.2)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(56,189,248,0.15)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
          }}
        >
          <Search size={17} className="ml-4 shrink-0" style={{ color: "#38bdf8" }} />
          <input
            type="text"
            placeholder="Search datasets by domain, type, or score..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none px-3 py-3.5 text-white placeholder-slate-600"
            style={{ fontSize: "0.9rem" }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="mr-3 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            >
              <X size={13} style={{ color: "#64748b" }} />
            </button>
          )}
          {/* Search shortcut hint */}
          <div
            className="hidden md:flex items-center gap-1 mr-4 px-2 py-1 rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span style={{ color: "#334155", fontSize: "0.65rem" }}>⌘K</span>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span style={{ color: "#475569", fontSize: "0.75rem" }}>Active filters:</span>
            {selectedDomains.map(d => (
              <span
                key={d}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", fontSize: "0.72rem", fontWeight: 600 }}
                onClick={() => handleDomains(selectedDomains.filter(x => x !== d))}
              >
                {domainMap[d]}
                <X size={10} />
              </span>
            ))}
            {selectedTypes.map(t => (
              <span
                key={t}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600 }}
                onClick={() => handleTypes(selectedTypes.filter(x => x !== t))}
              >
                {t}
                <X size={10} />
              </span>
            ))}
            {(qualityRange[0] > 0 || qualityRange[1] < 100) && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: "0.72rem", fontWeight: 600 }}
                onClick={() => handleQuality([0, 100])}
              >
                Score: {qualityRange[0]}–{qualityRange[1]}
                <X size={10} />
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 50) && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: "0.72rem", fontWeight: 600 }}
                onClick={() => handlePrice([0, 50])}
              >
                Price: {priceRange[0]}–{priceRange[1]} TAO
                <X size={10} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main layout: filter sidebar + grid */}
      <div className="flex gap-5 items-start">
        {/* Filter sidebar */}
        <FilterSidebar
          selectedDomains={selectedDomains} setSelectedDomains={handleDomains}
          selectedTypes={selectedTypes} setSelectedTypes={handleTypes}
          qualityRange={qualityRange} setQualityRange={handleQuality}
          priceRange={priceRange} setPriceRange={handlePrice}
          sortBy={sortBy} setSortBy={handleSort}
        />

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                Showing{" "}
                <span style={{ color: "white", fontWeight: 600 }}>{filtered.length}</span>
                {" "}datasets
              </span>
              {searchQuery && (
                <span style={{ color: "#475569", fontSize: "0.8rem" }}>
                  for "<span style={{ color: "#38bdf8" }}>{searchQuery}</span>"
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: viewMode === "grid" ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)",
                  border: viewMode === "grid" ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  color: viewMode === "grid" ? "#38bdf8" : "#475569",
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: viewMode === "list" ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)",
                  border: viewMode === "list" ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  color: viewMode === "list" ? "#38bdf8" : "#475569",
                }}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Dataset grid */}
          {paginated.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ backgroundColor: "#1e293b", border: "1px solid rgba(56,189,248,0.08)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)" }}
              >
                <Search size={24} style={{ color: "#38bdf8" }} />
              </div>
              <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 600 }}>No datasets found</h3>
              <p style={{ color: "#475569", fontSize: "0.85rem", marginTop: "6px" }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div
              className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}
              style={viewMode === "grid" ? { gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" } : {}}
            >
              {paginated.map((dataset) => (
                <MarketplaceCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "#475569", fontSize: "0.78rem" }}>
                Page {currentPage} of {totalPages} · {filtered.length} results
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: currentPage === 1 ? "#1e293b" : "#64748b",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isEllipsis = totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 2;
                  if (isEllipsis && (p === 2 || p === totalPages - 1)) {
                    return (
                      <span key={p} style={{ color: "#334155", fontSize: "0.78rem", padding: "0 4px" }}>...</span>
                    );
                  }
                  if (isEllipsis) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: p === currentPage ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.03)",
                        border: p === currentPage ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.06)",
                        color: p === currentPage ? "#38bdf8" : "#64748b",
                        fontSize: "0.78rem",
                        fontWeight: p === currentPage ? 700 : 400,
                        boxShadow: p === currentPage ? "0 0 12px rgba(56,189,248,0.2)" : "none",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: currentPage === totalPages ? "#1e293b" : "#64748b",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}