"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Beef,
  PiggyBank,
  Flame,
  Sparkles,
  Scale,
  Heart,
  ChevronRight,
  ArrowLeftRight,
  RotateCcw,
  Drumstick,
  MapPinned,
  Layers3,
  Star,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allCuts, type CutItem } from "@/data/porkCuts";

type MeatType = "pork" | "beef" | "chicken";

type Prefs = {
  cooking: "구이" | "볶음" | "찜" | "국물요리" | "튀김" | "수육";
  texture: "부드러운 편" | "쫄깃한 편" | "담백한 편" | "상관없음";
  fat: "담백한 쪽" | "중간" | "고소한 쪽";
  budget: "가성비 우선" | "보통" | "가격보다 용도";
};

type RecommendationCut = CutItem & {
  score: number;
  reasons: string[];
};

const defaultPrefs: Prefs = {
  cooking: "구이",
  texture: "부드러운 편",
  fat: "중간",
  budget: "보통",
};

const recommendationQuestions = {
  cooking: ["구이", "볶음", "찜", "국물요리", "튀김", "수육"],
  texture: ["부드러운 편", "쫄깃한 편", "담백한 편", "상관없음"],
  fat: ["담백한 쪽", "중간", "고소한 쪽"],
  budget: ["가성비 우선", "보통", "가격보다 용도"],
} as const;

const meatMeta: Record<
  MeatType,
  {
    label: string;
    hero: string;
    placeholder: string;
    sideDesc: string;
  }
> = {
  pork: {
    label: "돼지고기",
    hero: "돼지고기 부위를 쉽게 고르는 가이드",
    placeholder: "삼겹살, 목살, 안심, 앞다리처럼 검색해보세요",
    sideDesc: "삼겹살, 목살, 등심, 안심 등",
  },
  beef: {
    label: "소고기",
    hero: "소고기 부위를 쉽게 고르는 가이드",
    placeholder: "등심, 채끝, 안심, 양지처럼 검색해보세요",
    sideDesc: "등심, 채끝, 안심, 양지 등",
  },
  chicken: {
    label: "닭고기",
    hero: "닭고기 부위를 쉽게 고르는 가이드",
    placeholder: "가슴살, 안심, 날개, 닭다리처럼 검색해보세요",
    sideDesc: "가슴살, 안심, 날개, 닭다리 등",
  },
};

const comparisonPairsByMeat: Record<
  MeatType,
  { title: string; rows: [string, string][] }[]
> = {
  pork: [
    {
      title: "삼겹살 vs 목살",
      rows: [
        ["더 고소하게 느껴지기 쉬운 쪽", "삼겹살"],
        ["조금 덜 무겁게 느껴지기 쉬운 쪽", "목살"],
        ["구이 입문용", "둘 다 무난"],
        ["담백한 쪽", "목살"],
      ],
    },
    {
      title: "등심 vs 안심",
      rows: [
        ["더 연한 쪽", "안심"],
        ["활용도 넓은 쪽", "등심"],
        ["튀김용 접근", "둘 다 가능"],
        ["더 담백한 쪽", "안심"],
      ],
    },
  ],
  beef: [
    {
      title: "등심 vs 채끝",
      rows: [
        ["대표 구이용", "등심"],
        ["균형감 있는 쪽", "채끝"],
        ["부드러운 식감 중심", "채끝"],
        ["진한 풍미 느낌", "등심"],
      ],
    },
    {
      title: "양지 vs 사태",
      rows: [
        ["국물용 이미지", "양지"],
        ["쫄깃한 편", "사태"],
        ["오래 익히는 조리", "둘 다 잘 맞음"],
        ["구이용", "둘 다 비추천"],
      ],
    },
  ],
  chicken: [
    {
      title: "가슴살 vs 안심",
      rows: [
        ["더 담백한 쪽", "둘 다 비슷"],
        ["더 부드럽게 느껴지기 쉬운 쪽", "안심"],
        ["샐러드·식단용", "가슴살"],
        ["간단 반찬용", "안심"],
      ],
    },
    {
      title: "닭다리 vs 날개",
      rows: [
        ["살이 더 많은 쪽", "닭다리"],
        ["간식·안주 느낌", "날개"],
        ["튀김용 인기", "둘 다 높음"],
        ["한 끼용 만족감", "닭다리"],
      ],
    },
  ],
};

function getAllCutsByType(type: MeatType) {
  return allCuts.filter((cut) => cut.meatType === type);
}

function getFatLabel(value: string) {
  return value;
}

function getFlavorLabel(value: string) {
  return value;
}

function getTenderLabel(value: string) {
  return value;
}

function scoreCut(cut: CutItem, prefs: Prefs) {
  let score = 0;

  if (cut.cooking.includes(prefs.cooking)) score += 35;

  if (prefs.texture === "부드러운 편") {
    if (cut.texture.includes("매우 부드")) score += 30;
    else if (cut.texture.includes("부드")) score += 24;
    else score += 8;
  }

  if (prefs.texture === "쫄깃한 편") {
    if (cut.texture.includes("쫄깃")) score += 28;
    else score += 8;
  }

  if (prefs.texture === "담백한 편") {
    if (cut.fat.includes("매우 낮") || cut.fat.includes("낮")) score += 26;
    else score += 8;
  }

  if (prefs.texture === "상관없음") score += 10;

  if (prefs.fat === "담백한 쪽") {
    if (cut.fat.includes("매우 낮") || cut.fat.includes("낮")) score += 26;
    else score += 8;
  }

  if (prefs.fat === "중간") {
    if (cut.fat.includes("중간")) score += 24;
    else score += 12;
  }

  if (prefs.fat === "고소한 쪽") {
    if (cut.fat.includes("높") || cut.fat.includes("중간 이상")) score += 26;
    else score += 8;
  }

  if (prefs.budget === "가성비 우선") {
    if (cut.tags.includes("실속형") || cut.tags.includes("가성비")) score += 24;
    else score += 8;
  }

  if (prefs.budget === "보통") score += 14;
  if (prefs.budget === "가격보다 용도") score += 18;

  return Math.round(score);
}

function getRecommendationReasons(cut: CutItem, prefs: Prefs) {
  const reasons: string[] = [];

  if (cut.cooking.includes(prefs.cooking)) {
    reasons.push(`"${prefs.cooking}" 용도와 잘 맞는 편`);
  }

  if (prefs.texture === "부드러운 편" && cut.texture.includes("부드")) {
    reasons.push("부드러운 식감 쪽에 가까움");
  }

  if (prefs.texture === "쫄깃한 편" && cut.texture.includes("쫄깃")) {
    reasons.push("쫄깃한 식감 쪽으로 보기 쉬움");
  }

  if (
    prefs.texture === "담백한 편" &&
    (cut.fat.includes("낮") || cut.fat.includes("매우 낮"))
  ) {
    reasons.push("상대적으로 담백한 쪽");
  }

  if (
    prefs.fat === "고소한 쪽" &&
    (cut.fat.includes("높") || cut.fat.includes("중간 이상"))
  ) {
    reasons.push("고소하게 느껴지기 쉬운 편");
  }

  if (
    prefs.budget === "가성비 우선" &&
    (cut.tags.includes("실속형") || cut.tags.includes("가성비"))
  ) {
    reasons.push("실속형 선택지로 보기 좋음");
  }

  return reasons.slice(0, 3);
}

function SectionBox({
  label,
  title,
  icon,
  children,
  dark = false,
  right,
}: {
  label: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dark?: boolean;
  right?: React.ReactNode;
}) {
  if (dark) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950 px-6 py-5 text-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              {icon}
              {label}
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{title}</h2>
          </div>
          {right}
        </div>
        <div className="p-6 text-white">{children}</div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4 border-b-2 border-slate-200 bg-slate-50 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
            {icon}
            {label}
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function InfoPill({
  title,
  value,
  dark = false,
}: {
  title: string;
  value: string;
  dark?: boolean;
}) {
  if (dark) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-slate-300">{title}</div>
        <div className="mt-1 font-semibold text-white">{value}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function ProfileCard({ cut }: { cut: CutItem }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <InfoPill title="지방 느낌" value={getFatLabel(cut.fat)} />
      <InfoPill title="풍미 느낌" value={getFlavorLabel(cut.flavor)} />
      <InfoPill title="식감 느낌" value={getTenderLabel(cut.texture)} />
    </div>
  );
}

function Sidebar({
  meatType,
  onChange,
}: {
  meatType: MeatType;
  onChange: (type: MeatType) => void;
}) {
  return (
    <aside className="w-full lg:sticky lg:top-6 lg:h-fit">
      <SectionBox
        label="MEAT TYPE"
        title="고기 선택"
        icon={<List className="h-4 w-4" />}
      >
        <div className="space-y-3">
          {(["pork", "beef", "chicken"] as MeatType[]).map((type) => {
            const active = meatType === type;
            const icon =
              type === "pork" ? (
                <PiggyBank className="h-5 w-5" />
              ) : type === "beef" ? (
                <Beef className="h-5 w-5" />
              ) : (
                <Drumstick className="h-5 w-5" />
              );

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange(type)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition ${
                  active
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {icon}
                </div>
                <div>
                  <div className="font-bold">{meatMeta[type].label}</div>
                  <div
                    className={`text-sm ${
                      active ? "text-white/85" : "text-slate-500"
                    }`}
                  >
                    {meatMeta[type].sideDesc}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-slate-600">
            위치 · 특징 · 대표 용도를 먼저 보고 빠르게 고르기 쉽게 정리한
            안내형 버전입니다.
          </div>
        </div>
      </SectionBox>
    </aside>
  );
}

function PorkMap({
  selected,
  onSelect,
}: {
  selected: CutItem;
  onSelect: (cut: CutItem) => void;
}) {
  const items = [
    { id: "moksal", label: "목살", left: "32%", top: "18%" },
    { id: "deungsim-pork", label: "등심", left: "58%", top: "18%" },
    { id: "ansim-pork", label: "안심", left: "73%", top: "28%" },
    { id: "apdari", label: "앞다리", left: "25%", top: "58%" },
    { id: "samgyeopsal", label: "삼겹살", left: "61%", top: "70%" },
    { id: "galbi-pork", label: "갈비", left: "48%", top: "35%" },
    { id: "satae-pork", label: "사태", left: "78%", top: "64%" },
    { id: "hangjeongsal", label: "항정살", left: "40%", top: "10%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border-2 border-orange-100 bg-white p-4">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <svg viewBox="0 0 640 360" className="h-auto w-full">
          <rect width="640" height="360" fill="#f3f4f6" />
          <path d="M200 120 C240 90, 320 80, 420 100 C500 115, 560 150, 560 200 C560 260, 520 300, 440 310 C360 320, 260 310, 200 280 C150 250, 140 180, 200 120 Z" fill="#d1d5db" />
          <circle cx="140" cy="160" r="55" fill="#d1d5db" />
          <circle cx="110" cy="110" r="18" fill="#d1d5db" />
          <circle cx="170" cy="110" r="18" fill="#d1d5db" />
          <rect x="260" y="260" width="16" height="60" fill="#d1d5db" />
          <rect x="300" y="260" width="16" height="60" fill="#d1d5db" />
          <rect x="420" y="260" width="16" height="60" fill="#d1d5db" />
          <rect x="460" y="260" width="16" height="60" fill="#d1d5db" />
        </svg>

        {items.map((item) => {
          const active = selected.slug === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={active ? "default" : "outline"}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200 hover:bg-orange-500"
                  : "border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
              onClick={() => {
                const cut = allCuts.find((c) => c.slug === item.id);
                if (cut) onSelect(cut);
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function BeefMap({
  selected,
  onSelect,
}: {
  selected: CutItem;
  onSelect: (cut: CutItem) => void;
}) {
  const items = [
    { id: "deungsim-beef", label: "등심", left: "58%", top: "22%" },
    { id: "chaekkeut", label: "채끝", left: "76%", top: "28%" },
    { id: "ansim-beef", label: "안심", left: "66%", top: "40%" },
    { id: "buchaesal", label: "부채살", left: "28%", top: "40%" },
    { id: "yangji", label: "양지", left: "36%", top: "70%" },
    { id: "satae-beef", label: "사태", left: "79%", top: "72%" },
    { id: "udun", label: "우둔", left: "80%", top: "54%" },
    { id: "galbi-beef", label: "갈비", left: "47%", top: "36%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border-2 border-orange-100 bg-white p-4">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <svg viewBox="0 0 640 360" className="h-auto w-full">
          <rect width="640" height="360" fill="#f3f4f6" />
          <path d="M170 130 C210 85, 320 78, 465 98 C545 110, 585 150, 582 200 C580 270, 535 305, 455 310 C350 318, 250 312, 180 280 C145 262, 118 215, 130 170 C136 150, 148 138, 170 130 Z" fill="#d1d5db" />
          <circle cx="115" cy="165" r="48" fill="#d1d5db" />
          <path d="M86 126 L66 90 L102 108 Z" fill="#d1d5db" />
          <path d="M142 126 L160 88 L130 108 Z" fill="#d1d5db" />
          <rect x="240" y="265" width="16" height="58" fill="#d1d5db" />
          <rect x="295" y="265" width="16" height="58" fill="#d1d5db" />
          <rect x="435" y="265" width="16" height="58" fill="#d1d5db" />
          <rect x="490" y="265" width="16" height="58" fill="#d1d5db" />
        </svg>

        {items.map((item) => {
          const active = selected.slug === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={active ? "default" : "outline"}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200 hover:bg-orange-500"
                  : "border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
              onClick={() => {
                const cut = allCuts.find((c) => c.slug === item.id);
                if (cut) onSelect(cut);
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function ChickenMap({
  selected,
  onSelect,
}: {
  selected: CutItem;
  onSelect: (cut: CutItem) => void;
}) {
  const items = [
    { id: "gaseumsal", label: "가슴살", left: "50%", top: "38%" },
    { id: "ansim-chicken", label: "안심", left: "58%", top: "48%" },
    { id: "nalgae", label: "날개", left: "28%", top: "36%" },
    { id: "dakdari", label: "닭다리", left: "68%", top: "72%" },
    { id: "neoljeokdari", label: "넓적다리", left: "50%", top: "72%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border-2 border-orange-100 bg-white p-4">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <svg viewBox="0 0 640 360" className="h-auto w-full">
          <rect width="640" height="360" fill="#f3f4f6" />
          <ellipse cx="360" cy="180" rx="140" ry="100" fill="#d1d5db" />
          <circle cx="220" cy="135" r="45" fill="#d1d5db" />
          <circle cx="248" cy="118" r="8" fill="#94a3b8" />
          <path d="M185 130 L150 120 L185 145 Z" fill="#fbbf24" />
          <ellipse cx="195" cy="190" rx="55" ry="22" fill="#d1d5db" />
          <ellipse cx="255" cy="255" rx="22" ry="58" fill="#d1d5db" transform="rotate(15 255 255)" />
          <ellipse cx="360" cy="270" rx="22" ry="64" fill="#d1d5db" transform="rotate(-10 360 270)" />
        </svg>

        {items.map((item) => {
          const active = selected.slug === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={active ? "default" : "outline"}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200 hover:bg-orange-500"
                  : "border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
              onClick={() => {
                const cut = allCuts.find((c) => c.slug === item.id);
                if (cut) onSelect(cut);
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function MeatMap({
  meatType,
  selected,
  onSelect,
}: {
  meatType: MeatType;
  selected: CutItem;
  onSelect: (cut: CutItem) => void;
}) {
  if (meatType === "pork") return <PorkMap selected={selected} onSelect={onSelect} />;
  if (meatType === "beef") return <BeefMap selected={selected} onSelect={onSelect} />;
  return <ChickenMap selected={selected} onSelect={onSelect} />;
}

function CutCard({ cut }: { cut: CutItem }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">{cut.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{cut.shortDescription}</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {cut.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full border-orange-200 bg-white">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mb-5 space-y-3">
          <InfoPill title="지방 느낌" value={getFatLabel(cut.fat)} />
          <InfoPill title="대표 용도" value={cut.cooking.join(", ")} />
        </div>

        <Link href={`/cuts/${cut.slug}`} className="block">
          <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
            자세히 보기
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function RecommendationPanel({
  cuts,
  prefs,
  setPrefs,
}: {
  cuts: CutItem[];
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
}) {
  const results: RecommendationCut[] = useMemo(() => {
    return cuts
      .map((cut) => ({
        ...cut,
        score: scoreCut(cut, prefs),
        reasons: getRecommendationReasons(cut, prefs),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [cuts, prefs]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <SectionBox
        label="PREFERENCE"
        title="상황별 추천 받기"
        icon={<Sparkles className="h-4 w-4" />}
        right={
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:border-orange-300 hover:bg-orange-50"
            onClick={() => setPrefs(defaultPrefs)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
        }
      >
        <div className="space-y-6">
          {Object.entries(recommendationQuestions).map(([key, options]) => {
            const typedKey = key as keyof Prefs;
            return (
              <div key={key} className="rounded-2xl border-2 border-orange-100 bg-orange-50/40 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-800">
                  {key === "cooking" && "어떻게 먹을 건가요?"}
                  {key === "texture" && "어떤 느낌을 원하나요?"}
                  {key === "fat" && "지방감은 어느 쪽이 좋나요?"}
                  {key === "budget" && "예산 기준은 어떻게 보나요?"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => {
                    const active = prefs[typedKey] === option;
                    return (
                      <Button
                        key={option}
                        type="button"
                        variant={active ? "default" : "outline"}
                        className={`rounded-full ${
                          active
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "border-orange-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                        }`}
                        onClick={() =>
                          setPrefs((prev) => ({
                            ...prev,
                            [typedKey]: option as Prefs[keyof Prefs],
                          }))
                        }
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SectionBox>

      <SectionBox
        label="RESULT"
        title="추천 결과"
        icon={<Star className="h-4 w-4" />}
        dark
      >
        <div className="space-y-4">
          {results.map((cut, idx) => (
            <div key={cut.slug} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500 text-white hover:bg-orange-500">
                    TOP {idx + 1}
                  </Badge>
                  <div className="font-bold text-white">{cut.name}</div>
                </div>
                <div className="text-sm font-semibold text-slate-400">추천 참고용</div>
              </div>

              <p className="mb-3 text-sm text-slate-300">{cut.shortDescription}</p>

              <div className="mb-3 flex flex-wrap gap-2">
                {cut.cooking.map((item) => (
                  <Badge
                    key={item}
                    className="rounded-full border-0 bg-white/10 text-slate-100 hover:bg-white/10"
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              {cut.reasons.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {cut.reasons.map((reason) => (
                    <Badge
                      key={reason}
                      className="rounded-full border-0 bg-orange-500/15 text-orange-100 hover:bg-orange-500/15"
                    >
                      {reason}
                    </Badge>
                  ))}
                </div>
              )}

              <Link href={`/cuts/${cut.slug}`} className="inline-block">
                <Button className="rounded-full bg-orange-500 text-white hover:bg-orange-600">
                  상세페이지 보기
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}

function HomeView({
  meatType,
  setMeatType,
  query,
  setQuery,
  selectedCut,
  filteredCuts,
  currentCuts,
  prefs,
  setPrefs,
  handleSearch,
  applyQuickKeyword,
  setSelectedCut,
}: {
  meatType: MeatType;
  setMeatType: (type: MeatType) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedCut: CutItem;
  filteredCuts: CutItem[];
  currentCuts: CutItem[];
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
  handleSearch: (value: string) => void;
  applyQuickKeyword: (type: "grill" | "stew" | "light") => void;
  setSelectedCut: (cut: CutItem) => void;
}) {
  const currentComparisonPairs = comparisonPairsByMeat[meatType];
  const meta = meatMeta[meatType];

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#fff7ed,_#ffffff_28%,_#f8fafc)] text-slate-900">
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar meatType={meatType} onChange={setMeatType} />

          <div className="space-y-6">
            <section>
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-100 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-amber-50 blur-3xl" />

                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                      <Sparkles className="h-4 w-4" />
                      {meta.hero}
                    </div>

                    <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                      어떤 {meta.label}를 고를지
                      <span className="block bg-gradient-to-r from-slate-900 to-orange-500 bg-clip-text text-transparent">
                        한눈에 보는 가이드
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                      정확한 수치처럼 보이는 표현은 줄이고, 부위의 위치·대표 용도·느낌을 보수적으로 정리한 안내형 버전입니다.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-orange-200 text-orange-600"
                        onClick={() => applyQuickKeyword("grill")}
                      >
                        🔥 구이 위주
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-orange-200 text-orange-600"
                        onClick={() => applyQuickKeyword("stew")}
                      >
                        🍲 국물·찜 위주
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-orange-200 text-orange-600"
                        onClick={() => applyQuickKeyword("light")}
                      >
                        🥗 담백한 쪽
                      </Button>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={meta.placeholder}
                          className="h-12 rounded-2xl border-orange-100 bg-white pl-11 shadow-sm focus-visible:ring-orange-300"
                        />
                      </div>
                      <Button
                        className="h-12 rounded-2xl bg-orange-500 px-6 text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
                        onClick={() => handleSearch(query)}
                      >
                        부위 찾기
                      </Button>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.20)]">
                      <div className="mb-4">
                        <div className="text-sm text-orange-200">오늘의 추천 부위</div>
                        <div className="text-3xl font-bold">{selectedCut.name}</div>
                      </div>
                      <p className="mb-5 text-sm leading-6 text-slate-300">
                        {selectedCut.shortDescription}
                      </p>

                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Heart className="h-4 w-4 text-orange-300" />
                            지방 느낌
                          </div>
                          <div className="font-semibold">{getFatLabel(selectedCut.fat)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Beef className="h-4 w-4 text-orange-300" />
                            풍미 느낌
                          </div>
                          <div className="font-semibold">{getFlavorLabel(selectedCut.flavor)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Scale className="h-4 w-4 text-orange-300" />
                            식감 느낌
                          </div>
                          <div className="font-semibold">{getTenderLabel(selectedCut.texture)}</div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {selectedCut.cooking.map((item) => (
                          <Badge
                            key={item}
                            className="rounded-full border-0 bg-orange-500/20 text-orange-100 hover:bg-orange-500/20"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-5">
                        <Link href={`/cuts/${selectedCut.slug}`}>
                          <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                            자세히 보기
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <SectionBox
                label="CUT MAP"
                title="부위 위치 한눈에 보기"
                icon={<MapPinned className="h-4 w-4" />}
              >
                <MeatMap meatType={meatType} selected={selectedCut} onSelect={setSelectedCut} />
                <p className="mt-4 text-sm text-slate-600">
                  지도의 부위를 누르면 정보가 바뀝니다.
                </p>
              </SectionBox>

              <SectionBox
                label="SUMMARY"
                title={`${selectedCut.name} 빠른 요약`}
                icon={<Layers3 className="h-4 w-4" />}
              >
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {selectedCut.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full border-orange-200 bg-white">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <ProfileCard cut={selectedCut} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoPill title="위치" value={selectedCut.location} />
                    <InfoPill title="대표 용도" value={selectedCut.cooking.join(", ")} />
                  </div>

                  <div className="rounded-2xl border-2 border-orange-100 bg-orange-50/40 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">대표 특징</div>
                    <p className="text-sm leading-6 text-slate-600">{selectedCut.shortDescription}</p>
                  </div>

                  <Link href={`/cuts/${selectedCut.slug}`}>
                    <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                      자세히 보기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </SectionBox>
            </div>

            <section id="recommendation-section">
              <RecommendationPanel cuts={currentCuts} prefs={prefs} setPrefs={setPrefs} />
            </section>

            <SectionBox
              label="COMPARE"
              title="비슷한 부위 비교"
              icon={<ArrowLeftRight className="h-4 w-4" />}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {currentComparisonPairs.map((pair) => (
                  <Card
                    key={pair.title}
                    className="rounded-3xl border-2 border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{pair.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {pair.rows.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                          >
                            <span className="text-slate-600">{label}</span>
                            <span className="font-semibold text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionBox>

            <SectionBox
              label="CUT LIST"
              title="부위 목록"
              icon={<List className="h-4 w-4" />}
              right={<div className="text-sm text-slate-500">총 {filteredCuts.length}개</div>}
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCuts.map((cut) => (
                  <CutCard key={cut.slug} cut={cut} />
                ))}
              </div>
            </SectionBox>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MeatSelectorSite() {
  const [meatType, setMeatType] = useState<MeatType>("pork");
  const [query, setQuery] = useState("");
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  const initialPorkCuts = getAllCutsByType("pork");
  const [selectedCut, setSelectedCut] = useState<CutItem>(initialPorkCuts[0]);

  const currentCuts = useMemo(() => getAllCutsByType(meatType), [meatType]);

  const filteredCuts = useMemo(() => {
    const q = query.trim();
    if (!q) return currentCuts;

    return currentCuts.filter(
      (cut) =>
        cut.name.includes(q) ||
        cut.shortDescription.includes(q) ||
        cut.location.includes(q) ||
        cut.tags.some((tag) => tag.includes(q)) ||
        cut.cooking.some((item) => item.includes(q))
    );
  }, [query, currentCuts]);

  const handleSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;

    const matchedCut = currentCuts.find(
      (cut) =>
        cut.name.includes(normalized) ||
        cut.shortDescription.includes(normalized) ||
        cut.location.includes(normalized) ||
        cut.tags.some((tag) => tag.includes(normalized) || normalized.includes(tag)) ||
        cut.cooking.some((item) => item.includes(normalized) || normalized.includes(item))
    );

    if (matchedCut) {
      setSelectedCut(matchedCut);
      const target = document.getElementById("recommendation-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToRecommendation = () => {
    const el = document.getElementById("recommendation-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyQuickKeyword = (type: "grill" | "stew" | "light") => {
    const nextPrefs: Prefs = { ...defaultPrefs };

    if (type === "grill") {
      nextPrefs.cooking = "구이";
      nextPrefs.texture = "상관없음";
      nextPrefs.fat = "중간";
    }

    if (type === "stew") {
      nextPrefs.cooking = meatType === "chicken" ? "볶음" : "국물요리";
      nextPrefs.texture = "부드러운 편";
      nextPrefs.fat = "중간";
    }

    if (type === "light") {
      nextPrefs.texture = "담백한 편";
      nextPrefs.fat = "담백한 쪽";
      nextPrefs.budget = "보통";
    }

    setPrefs(nextPrefs);
    scrollToRecommendation();
  };

  const handleChangeMeatType = (type: MeatType) => {
    const nextCuts = getAllCutsByType(type);
    setMeatType(type);
    setQuery("");
    setPrefs(defaultPrefs);
    setSelectedCut(nextCuts[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <HomeView
      meatType={meatType}
      setMeatType={handleChangeMeatType}
      query={query}
      setQuery={setQuery}
      selectedCut={selectedCut}
      filteredCuts={filteredCuts}
      currentCuts={currentCuts}
      prefs={prefs}
      setPrefs={setPrefs}
      handleSearch={handleSearch}
      applyQuickKeyword={applyQuickKeyword}
      setSelectedCut={setSelectedCut}
    />
  );
}
