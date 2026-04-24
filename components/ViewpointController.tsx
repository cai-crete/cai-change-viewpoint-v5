"use client";

export type ViewpointType = "street" | "aerial" | "detail" | "quarter";

interface ViewpointMeta {
  id: ViewpointType;
  label: string;
  sublabel: string;
  lens: string;
  icon: React.ReactNode;
}

interface Props {
  selected: ViewpointType | null;
  onViewpointSelect: (viewpoint: ViewpointType) => void;
  disabled?: boolean;
}

const VIEWPOINTS: ViewpointMeta[] = [
  {
    id: "street",
    label: "Street View",
    sublabel: "눈높이 1.6m",
    lens: "23mm Tilt-Shift",
    icon: <StreetIcon />,
  },
  {
    id: "aerial",
    label: "Aerial View",
    sublabel: "고도 150m+",
    lens: "32mm Phase One",
    icon: <AerialIcon />,
  },
  {
    id: "detail",
    label: "Detail View",
    sublabel: "근접 촬영",
    lens: "110mm Macro f/2.8",
    icon: <DetailIcon />,
  },
  {
    id: "quarter",
    label: "Quarter View",
    sublabel: "45° 코너",
    lens: "45mm Standard",
    icon: <QuarterIcon />,
  },
];

export default function ViewpointController({
  selected,
  onViewpointSelect,
  disabled,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-xs text-neutral-500 uppercase tracking-widest px-1">
        시점 선택
      </p>
      <div className="grid grid-cols-2 gap-2">
        {VIEWPOINTS.map((vp) => {
          const isActive = selected === vp.id;
          return (
            <button
              key={vp.id}
              onClick={() => !disabled && onViewpointSelect(vp.id)}
              disabled={disabled}
              className={[
                "relative flex flex-col items-start gap-2 rounded-xl px-4 py-3",
                "border transition-all duration-150 text-left",
                disabled
                  ? "cursor-not-allowed opacity-40 border-neutral-800 bg-neutral-900"
                  : isActive
                  ? "cursor-default border-neutral-300 bg-neutral-800"
                  : "cursor-pointer border-neutral-700 bg-neutral-900 hover:border-neutral-500 hover:bg-neutral-800",
              ].join(" ")}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-white" />
              )}

              {/* Icon */}
              <span
                className={`transition-colors duration-150 ${
                  isActive ? "text-neutral-100" : "text-neutral-500"
                }`}
              >
                {vp.icon}
              </span>

              {/* Text */}
              <span className="flex flex-col gap-0.5">
                <span
                  className={`text-sm font-medium leading-none transition-colors duration-150 ${
                    isActive ? "text-neutral-100" : "text-neutral-400"
                  }`}
                >
                  {vp.label}
                </span>
                <span className="text-xs text-neutral-600 leading-none">
                  {vp.sublabel}
                </span>
              </span>

              {/* Lens badge */}
              <span
                className={`text-[10px] leading-none px-1.5 py-0.5 rounded border transition-colors duration-150 ${
                  isActive
                    ? "border-neutral-500 text-neutral-400 bg-neutral-700"
                    : "border-neutral-800 text-neutral-600 bg-transparent"
                }`}
              >
                {vp.lens}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Icons ── */

function StreetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
  );
}

function AerialIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function DetailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function QuarterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h5l3-9 4 18 3-9h5" />
    </svg>
  );
}
