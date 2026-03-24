"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Beef,
  PiggyBank,
  Flame,
  Soup,
  BadgeDollarSign,
  Sparkles,
  Scale,
  Heart,
  ChevronRight,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type SubtypeInfo = {
  name: string;
  note: string;
};

type PorkCut = {
  id: string;
  name: string;
  animal: string;
  short: string;
  location: string;
  texture: string;
  fat: number;
  flavor: number;
  tenderness: number;
  price: string;
  beginner: string;
  cooking: string[];
  tags: string[];
  recommendFor: string[];
  avoidFor: string[];
  grillType?: "숯구이" | "불판구이" | "둘 다";
  alternatives: string[];
  subtypes: SubtypeInfo[];
};

type Prefs = {
  cooking: "구이" | "볶음" | "찜" | "국물요리" | "돈가스/튀김" | "수육";
  texture: "부드러운" | "쫄깃한" | "씹는 맛 있는" | "상관없음";
  fat: "담백한 게 좋음" | "적당히" | "고소하고 기름진 게 좋음";
  budget: "가성비 위주" | "보통" | "가격 상관없음";
};

type PageMode = "home" | "detail";

type RecommendationCut = PorkCut & {
  score: number;
  reasons: string[];
};

const porkCuts: PorkCut[] = [
  {
    id: "samgyeopsal",
    name: "삼겹살",
    animal: "돼지",
    short: "기름지고 고소해서 구이용으로 가장 대중적인 부위",
    location: "배 쪽",
    texture: "부드럽고 촉촉함",
    fat: 90,
    flavor: 85,
    tenderness: 78,
    price: "중간~약간 높음",
    beginner: "매우 높음",
    cooking: ["구이", "수육", "김치찜"],
    tags: ["고소함", "구이용", "대중적", "기름짐"],
    recommendFor: ["고소한 맛 좋아하는 사람", "실패 없는 구이용 찾는 사람"],
    avoidFor: ["기름진 부위를 싫어하는 사람", "다이어트 식단 찾는 사람"],
    grillType: "둘 다",
    alternatives: ["목살", "갈비"],
    subtypes: [
      { name: "일반 삼겹살", note: "가장 대중적인 형태로 구이와 수육에 무난함" },
      { name: "오겹살", note: "껍데기가 붙어 있어 식감이 더 쫀득함" },
      { name: "두꺼운 삼겹살", note: "육즙이 잘 살아 있어 구이용으로 인기" },
    ],
  },
  {
    id: "moksal",
    name: "목살",
    animal: "돼지",
    short: "적당한 지방과 살코기 균형이 좋은 구이용 인기 부위",
    location: "목 주변",
    texture: "부드럽고 약간 쫄깃함",
    fat: 62,
    flavor: 74,
    tenderness: 76,
    price: "중간",
    beginner: "매우 높음",
    cooking: ["구이", "스테이크식 구이", "제육볶음"],
    tags: ["균형형", "구이용", "덜 느끼함", "대중적"],
    recommendFor: ["삼겹살보다 덜 느끼한 부위를 원하는 사람"],
    avoidFor: ["아주 부드러운 식감만 원하는 사람"],
    grillType: "둘 다",
    alternatives: ["삼겹살", "앞다리살"],
    subtypes: [
      { name: "일반 목살", note: "가장 무난하고 대중적인 구이용" },
      { name: "두툼 목살", note: "스테이크식 구이에 잘 맞음" },
      { name: "숙성 목살", note: "풍미가 진해지고 식감이 부드러워짐" },
    ],
  },
  {
    id: "apdari",
    name: "앞다리살",
    animal: "돼지",
    short: "가성비가 좋고 활용도가 높은 실속형 부위",
    location: "앞다리 윗부분",
    texture: "약간 쫄깃하고 탄탄함",
    fat: 38,
    flavor: 58,
    tenderness: 52,
    price: "저렴한 편",
    beginner: "높음",
    cooking: ["제육볶음", "불고기", "찌개", "수육"],
    tags: ["가성비", "실속형", "볶음용", "대용량"],
    recommendFor: ["가성비 중시", "양 많은 요리"],
    avoidFor: ["구이용으로 부드러운 부위 찾는 사람"],
    alternatives: ["뒷다리살", "목살"],
    subtypes: [
      { name: "얇게 썬 앞다리살", note: "불고기와 제육볶음에 자주 사용됨" },
      { name: "수육용 앞다리살", note: "가성비 좋은 수육 재료" },
    ],
  },
  {
    id: "dwitdari",
    name: "뒷다리살",
    animal: "돼지",
    short: "지방이 적고 가격이 저렴한 실속형 부위",
    location: "뒷다리 쪽",
    texture: "단단하고 약간 퍽퍽할 수 있음",
    fat: 18,
    flavor: 45,
    tenderness: 40,
    price: "저렴함",
    beginner: "중간",
    cooking: ["장조림", "불고기", "다짐육", "튀김류"],
    tags: ["저지방", "가성비", "담백함", "실속형"],
    recommendFor: ["저렴한 부위 찾는 사람", "기름 적은 고기 원하는 사람"],
    avoidFor: ["구이에서 촉촉함을 기대하는 사람"],
    alternatives: ["앞다리살", "안심"],
    subtypes: [
      { name: "슬라이스 뒷다리살", note: "불고기나 볶음용으로 많이 사용됨" },
      { name: "다짐용 뒷다리살", note: "만두소나 다짐육용으로 활용 가능" },
    ],
  },
  {
    id: "hangjeongsal",
    name: "항정살",
    animal: "돼지",
    short: "쫄깃한 식감과 진한 고소함이 매력적인 특수부위",
    location: "목덜미 주변",
    texture: "쫄깃하고 탱탱함",
    fat: 72,
    flavor: 82,
    tenderness: 70,
    price: "비싼 편",
    beginner: "높음",
    cooking: ["구이"],
    tags: ["특수부위", "쫄깃함", "구이용", "고소함"],
    recommendFor: ["식감 있는 구이 좋아하는 사람"],
    avoidFor: ["가성비를 가장 중요하게 보는 사람"],
    grillType: "숯구이",
    alternatives: ["갈매기살", "목살"],
    subtypes: [
      { name: "생 항정살", note: "쫄깃한 식감과 고소함이 잘 살아 있음" },
      { name: "두툼 항정살", note: "씹는 맛이 더 강하게 느껴짐" },
    ],
  },
  {
    id: "galmaegi",
    name: "갈매기살",
    animal: "돼지",
    short: "진한 맛과 쫄깃함이 살아 있는 인기 특수부위",
    location: "횡격막 근처",
    texture: "쫄깃하고 씹는 맛이 좋음",
    fat: 50,
    flavor: 80,
    tenderness: 58,
    price: "중간~비쌈",
    beginner: "중간~높음",
    cooking: ["구이"],
    tags: ["특수부위", "쫄깃함", "육향", "구이용"],
    recommendFor: ["씹는 맛과 진한 육향을 좋아하는 사람"],
    avoidFor: ["아주 부드러운 고기를 원하는 사람"],
    grillType: "숯구이",
    alternatives: ["항정살", "목살"],
    subtypes: [
      { name: "양념 갈매기살", note: "강한 불향과 감칠맛을 내기 좋음" },
      { name: "생 갈매기살", note: "육향과 씹는 맛을 더 잘 느낄 수 있음" },
    ],
  },
  {
    id: "deungsim",
    name: "등심",
    animal: "돼지",
    short: "담백하면서도 적당한 육향이 있는 활용도 높은 부위",
    location: "등 쪽",
    texture: "부드럽지만 과하게 익히면 퍽퍽해짐",
    fat: 34,
    flavor: 56,
    tenderness: 63,
    price: "중간",
    beginner: "높음",
    cooking: ["돈가스", "구이", "볶음"],
    tags: ["담백함", "돈가스", "깔끔함", "활용도"],
    recommendFor: ["기름기 적당한 부위 원하는 사람"],
    avoidFor: ["진한 지방 풍미 원하는 사람"],
    grillType: "둘 다",
    alternatives: ["안심", "앞다리살"],
    subtypes: [
      { name: "돈가스용 등심", note: "튀김에 가장 많이 쓰이는 형태" },
      { name: "구이용 등심", note: "담백한 구이를 원할 때 적합" },
    ],
  },
  {
    id: "ansim",
    name: "안심",
    animal: "돼지",
    short: "매우 부드럽고 지방이 적어 담백한 부위",
    location: "등 안쪽 깊은 부위",
    texture: "매우 부드러움",
    fat: 12,
    flavor: 42,
    tenderness: 90,
    price: "중간~약간 높음",
    beginner: "높음",
    cooking: ["돈가스", "장조림", "볶음"],
    tags: ["부드러움", "저지방", "담백함", "초보용"],
    recommendFor: ["부드러운 식감 원하는 사람", "저지방 부위 찾는 사람"],
    avoidFor: ["구이에서 육즙과 풍미를 기대하는 사람"],
    alternatives: ["등심", "뒷다리살"],
    subtypes: [
      { name: "돈가스용 안심", note: "부드러운 식감이 가장 큰 장점" },
      { name: "장조림용 안심", note: "담백하고 깔끔한 맛을 내기 좋음" },
    ],
  },
  {
    id: "galbi",
    name: "갈비",
    animal: "돼지",
    short: "뼈 주변의 진한 풍미가 살아 있는 부위",
    location: "갈비뼈 주변",
    texture: "부드럽고 진한 맛",
    fat: 56,
    flavor: 84,
    tenderness: 68,
    price: "비싼 편",
    beginner: "중간",
    cooking: ["양념갈비", "찜", "구이"],
    tags: ["갈비요리", "진한맛", "특별식", "양념"],
    recommendFor: ["진한 맛", "특별한 메뉴"],
    avoidFor: ["간편한 요리"],
    grillType: "숯구이",
    alternatives: ["삼겹살", "목살"],
    subtypes: [
      { name: "양념 갈비", note: "단짠 양념과 잘 어울리는 대표 형태" },
      { name: "생 갈비", note: "고기 본연의 풍미를 느끼기 좋음" },
    ],
  },
  {
    id: "satae",
    name: "사태",
    animal: "돼지",
    short: "오래 익히면 깊은 맛이 나는 찜·국물용 부위",
    location: "다리 쪽 근육 부위",
    texture: "단단하지만 푹 익히면 부드러워짐",
    fat: 16,
    flavor: 61,
    tenderness: 44,
    price: "중간 이하",
    beginner: "중간",
    cooking: ["찜", "국물요리", "장조림"],
    tags: ["찜용", "국물용", "깊은맛", "저지방"],
    recommendFor: ["오래 끓이는 요리 좋아하는 사람"],
    avoidFor: ["바로 구워 먹을 부위 찾는 사람"],
    alternatives: ["앞다리살", "갈비"],
    subtypes: [
      { name: "장조림용 사태", note: "오래 익힐수록 결이 부드러워짐" },
      { name: "수육용 사태", note: "담백하고 진한 국물 맛을 내기 좋음" },
    ],
  },
];

const comparisonPairs = [
  {
    title: "삼겹살 vs 목살",
    rows: [
      ["더 고소한 쪽", "삼겹살"],
      ["덜 느끼한 쪽", "목살"],
      ["구이 실패 적은 쪽", "둘 다"],
      ["다이어트에 더 나은 쪽", "목살"],
    ],
  },
  {
    title: "안심 vs 등심",
    rows: [
      ["더 부드러운 쪽", "안심"],
      ["더 풍미 있는 쪽", "등심"],
      ["돈가스용", "둘 다 가능"],
      ["더 담백한 쪽", "안심"],
    ],
  },
  {
    title: "앞다리살 vs 뒷다리살",
    rows: [
      ["더 무난한 쪽", "앞다리살"],
      ["더 저렴한 쪽", "뒷다리살"],
      ["볶음 활용도", "앞다리살"],
      ["저지방 성향", "뒷다리살"],
    ],
  },
] as const;

const recommendationQuestions = {
  cooking: ["구이", "볶음", "찜", "국물요리", "돈가스/튀김", "수육"],
  texture: ["부드러운", "쫄깃한", "씹는 맛 있는", "상관없음"],
  fat: ["담백한 게 좋음", "적당히", "고소하고 기름진 게 좋음"],
  budget: ["가성비 위주", "보통", "가격 상관없음"],
} as const;

const defaultPrefs: Prefs = {
  cooking: "구이",
  texture: "부드러운",
  fat: "적당히",
  budget: "보통",
};

function scoreCut(cut: PorkCut, prefs: Prefs) {
  let score = 0;

  if (prefs.cooking === "돈가스/튀김") {
    if (cut.cooking.includes("돈가스")) score += 35;
    if (cut.cooking.includes("튀김류")) score += 24;
  } else if (cut.cooking.includes(prefs.cooking)) {
    score += 35;
  }

  if (prefs.texture === "부드러운") score += cut.tenderness * 0.35;
  if (prefs.texture === "쫄깃한") score += cut.tags.includes("쫄깃함") ? 28 : 0;
  if (prefs.texture === "씹는 맛 있는") score += cut.short.includes("쫄깃") || cut.texture.includes("쫄깃") ? 24 : 6;
  if (prefs.texture === "상관없음") score += 10;

  if (prefs.fat === "담백한 게 좋음") score += (100 - cut.fat) * 0.28;
  if (prefs.fat === "적당히") score += 26 - Math.abs(55 - cut.fat) * 0.25;
  if (prefs.fat === "고소하고 기름진 게 좋음") score += cut.fat * 0.28;

  if (prefs.budget === "가성비 위주") {
    if (cut.price.includes("저렴")) score += 30;
    else if (cut.price.includes("중간")) score += 15;
  }
  if (prefs.budget === "보통") {
    if (cut.price.includes("중간")) score += 20;
    else score += 10;
  }
  if (prefs.budget === "가격 상관없음") {
    if (cut.price.includes("비싼")) score += 14;
    score += 10;
  }

  return Math.round(score);
}

function getRecommendationReasons(cut: PorkCut, prefs: Prefs) {
  const reasons: string[] = [];

  if (prefs.cooking === "구이" && cut.cooking.includes("구이")) reasons.push("구이용으로 잘 맞음");
  if (prefs.cooking === "찜" && cut.cooking.includes("찜")) reasons.push("오래 익히는 요리에 적합");
  if (prefs.cooking === "볶음" && cut.cooking.includes("볶음")) reasons.push("볶음 요리 활용도 높음");
  if (prefs.cooking === "수육" && cut.cooking.includes("수육")) reasons.push("수육용으로 무난함");
  if (prefs.cooking === "국물요리" && cut.cooking.includes("국물요리")) reasons.push("국물 맛이 잘 남");
  if (prefs.cooking === "돈가스/튀김" && (cut.cooking.includes("돈가스") || cut.cooking.includes("튀김류"))) reasons.push("튀김/돈가스용으로 적합");

  if (prefs.texture === "부드러운" && cut.tenderness >= 70) reasons.push("부드러운 식감과 잘 맞음");
  if (prefs.texture === "쫄깃한" && cut.tags.includes("쫄깃함")) reasons.push("쫄깃한 식감이 살아 있음");
  if (prefs.texture === "씹는 맛 있는" && (cut.tags.includes("쫄깃함") || cut.texture.includes("탄탄") || cut.texture.includes("씹"))) reasons.push("씹는 맛이 괜찮음");

  if (prefs.fat === "담백한 게 좋음" && cut.fat <= 40) reasons.push("지방이 비교적 적은 편");
  if (prefs.fat === "적당히" && cut.fat >= 35 && cut.fat <= 70) reasons.push("지방과 살코기 밸런스가 적당함");
  if (prefs.fat === "고소하고 기름진 게 좋음" && cut.fat >= 60) reasons.push("고소하고 진한 맛이 강함");

  if (prefs.budget === "가성비 위주" && cut.price.includes("저렴")) reasons.push("가성비 선택에 유리함");
  if (prefs.budget === "보통" && cut.price.includes("중간")) reasons.push("부담 적은 가격대");
  if (prefs.budget === "가격 상관없음" && cut.price.includes("비싼")) reasons.push("풍미 중심 선택에 어울림");

  return reasons.slice(0, 3);
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function GrillBadge({ cut, dark = false }: { cut: PorkCut; dark?: boolean }) {
  if (!cut.cooking.includes("구이") || !cut.grillType) return null;

  const baseClass = dark ? "rounded-full border-0 bg-white/15 text-white" : "rounded-full bg-orange-50 text-orange-700";

  if (cut.grillType === "둘 다") {
    return (
      <>
        <Badge className={baseClass}>🔥 숯구이 (풍미↑)</Badge>
        <Badge className={baseClass}>🔥 불판구이 (편의↑)</Badge>
      </>
    );
  }

  if (cut.grillType === "숯구이") {
    return <Badge className={baseClass}>🔥 숯구이 (풍미↑)</Badge>;
  }

  return <Badge className={baseClass}>🔥 불판구이 (편의↑)</Badge>;
}

function PigMap({ selected, onSelect }: { selected: PorkCut; onSelect: (cut: PorkCut) => void }) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const mapItems = {
    hangjeongsal: { x: 180, y: 120, labelX: 70, labelY: 60, label: "항정살", area: { cx: 170, cy: 120, rx: 40, ry: 28 } },
    moksal: { x: 260, y: 95, labelX: 260, labelY: 40, label: "목살", area: { cx: 260, cy: 100, rx: 55, ry: 35 } },
    galbi: { x: 320, y: 130, labelX: 330, labelY: 80, label: "갈비", area: { cx: 320, cy: 140, rx: 70, ry: 45 } },
    deungsim: { x: 380, y: 95, labelX: 400, labelY: 40, label: "등심", area: { cx: 380, cy: 100, rx: 70, ry: 40 } },
    ansim: { x: 455, y: 125, labelX: 520, labelY: 70, label: "안심", area: { cx: 450, cy: 130, rx: 55, ry: 40 } },
    apdari: { x: 280, y: 170, labelX: 90, labelY: 300, label: "앞다리", area: { cx: 250, cy: 200, rx: 60, ry: 60 } },
    samgyeopsal: { x: 420, y: 210, labelX: 430, labelY: 330, label: "삼겹살", area: { cx: 420, cy: 220, rx: 90, ry: 55 } },
    galmaegi: { x: 340, y: 260, labelX: 360, labelY: 340, label: "갈매기살", area: { cx: 350, cy: 260, rx: 60, ry: 40 } },
    dwitdari: { x: 530, y: 250, labelX: 580, labelY: 330, label: "뒷다리", area: { cx: 520, cy: 250, rx: 60, ry: 70 } },
    satae: { x: 500, y: 230, labelX: 520, labelY: 280, label: "사태", area: { cx: 500, cy: 230, rx: 40, ry: 40 } },
  } as const;

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
    <div className="relative w-full max-w-xl mx-auto">
  <img
    src="/pig-map.png"
    alt="돼지고기 부위"
    className="w-full rounded-xl"
  />

  <button className="absolute top-[35%] left-[35%] bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
    목살
  </button>

  <button className="absolute top-[60%] left-[50%] bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
    삼겹살
  </button>
</div>

        {Object.entries(mapItems).map(([id, item]) => {
          const active = selected.id === id;
          return (
            <button
              key={id}
              onMouseEnter={() => setHoverId(id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => {
                const matched = porkCuts.find((c) => c.id === id);
                if (matched) onSelect(matched);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-sm transition sm:text-sm ${active ? "bg-orange-500 text-white ring-4 ring-orange-200" : "border border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"}`}
              style={{ left: `${(item.labelX / 640) * 100}%`, top: `${(item.labelY / 360) * 100}%` }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CutCard({ cut, onSelect }: { cut: PorkCut; onSelect: (cut: PorkCut) => void }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">{cut.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{cut.short}</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {cut.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full border-orange-200">#{tag}</Badge>
          ))}
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-500">지방감</div><div className="mt-1 font-semibold text-slate-900">{cut.fat}%</div></div>
          <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-500">풍미</div><div className="mt-1 font-semibold text-slate-900">{cut.flavor}%</div></div>
          <div className="rounded-2xl bg-slate-50 p-3"><div className="text-slate-500">부드러움</div><div className="mt-1 font-semibold text-slate-900">{cut.tenderness}%</div></div>
        </div>
        <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => onSelect(cut)}>
          자세히 보기
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function RecommendationPanel({ prefs, setPrefs }: { prefs: Prefs; setPrefs: React.Dispatch<React.SetStateAction<Prefs>> }) {
  const results: RecommendationCut[] = useMemo(() => {
    return porkCuts
      .map((cut) => ({ ...cut, score: scoreCut(cut, prefs), reasons: getRecommendationReasons(cut, prefs) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [prefs]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">상황별 추천 받기</CardTitle>
            <Button type="button" variant="outline" className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-4 py-2 text-sm font-medium transition" onClick={() => setPrefs(defaultPrefs)}>
              초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(recommendationQuestions).map(([key, options]) => {
            const typedKey = key as keyof Prefs;
            return (
              <div key={key}>
                <div className="mb-3 text-sm font-semibold text-slate-800">
                  {key === "cooking" && "어떻게 먹을 건가요?"}
                  {key === "texture" && "어떤 식감을 원하나요?"}
                  {key === "fat" && "기름진 정도는 어느 쪽이 좋나요?"}
                  {key === "budget" && "예산은 어느 정도인가요?"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => {
                    const active = prefs[typedKey] === option;
                    return (
                      <Button
                        key={option}
                        type="button"
                        variant={active ? "default" : "outline"}
                        className={`rounded-full ${active ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200"}`}
                        onClick={() => setPrefs((prev) => ({ ...prev, [typedKey]: option as any }))}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <CardHeader>
          <CardTitle className="text-xl">추천 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((cut, idx) => (
            <div key={cut.id} className="rounded-2xl border border-orange-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500 text-white hover:bg-orange-500">TOP {idx + 1}</Badge>
                  <div className="font-bold text-slate-900">{cut.name}</div>
                </div>
                <div className="text-sm font-semibold text-slate-600">적합도 {cut.score}</div>
              </div>
              <p className="mb-3 text-sm text-slate-600">{cut.short}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {cut.cooking.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full border-orange-200">{item}</Badge>
                ))}
                <GrillBadge cut={cut} />
              </div>
              {cut.reasons.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {cut.reasons.map((reason) => (
                    <Badge key={reason} className="rounded-full border-0 bg-slate-100 text-slate-700 hover:bg-slate-100">{reason}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailView({ selectedCut, setSelectedCut, goHome }: { selectedCut: PorkCut; setSelectedCut: (cut: PorkCut) => void; goHome: () => void }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff,_#f1f5f9)] text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button type="button" variant="outline" className="rounded-full border-orange-200" onClick={goHome}>← 목록으로 돌아가기</Button>
          <div className="text-sm text-slate-500">돼지고기 상세 페이지</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-950">부위 위치 한눈에 보기</CardTitle>
            </CardHeader>
            <CardContent>
              <PigMap selected={selectedCut} onSelect={setSelectedCut} />
              <p className="mt-4 text-sm text-slate-600">지도의 부위를 누르면 상세 정보가 바뀝니다.</p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-orange-100 bg-white">
                <div className="aspect-[4/3] w-full bg-[linear-gradient(135deg,#fff7ed,#ffedd5,#fed7aa)] p-6">
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-orange-200/70 bg-white/60 p-5 backdrop-blur">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Meat Photo</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">{selectedCut.name}</div>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">실제 고기 사진이 들어갈 자리입니다. 현재는 상세 페이지 레이아웃 확인용 플레이스홀더입니다.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCut.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} className="rounded-full border-0 bg-orange-500 text-white hover:bg-orange-500">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-3xl text-slate-950">{selectedCut.name}</CardTitle>
                <Badge className="rounded-full bg-orange-500 text-white hover:bg-orange-500">상세 정보</Badge>
              </div>
              <p className="text-sm text-slate-600">{selectedCut.short}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {selectedCut.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full border-orange-200">#{tag}</Badge>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">위치</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.location}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">식감</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.texture}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">가격 느낌</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.price}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">초보 추천도</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.beginner}</div></div>
              </div>

              <div className="space-y-4">
                <StatBar label="지방감" value={selectedCut.fat} />
                <StatBar label="풍미" value={selectedCut.flavor} />
                <StatBar label="부드러움" value={selectedCut.tenderness} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-800">추천 요리</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCut.cooking.map((item) => (
                      <Badge key={item} className="rounded-full bg-orange-500 text-white hover:bg-orange-500">{item}</Badge>
                    ))}
                    <GrillBadge cut={selectedCut} />
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-800">대체 부위</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCut.alternatives.map((item) => (
                      <Badge key={item} variant="outline" className="rounded-full border-orange-200">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-800">부위별 종류</div>
                  <Badge variant="outline" className="rounded-full border-orange-200">{selectedCut.subtypes.length}가지</Badge>
                </div>
                <div className="space-y-3">
                  {selectedCut.subtypes.map((item) => (
                    <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-800">이런 사람에게 추천</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {selectedCut.recommendFor.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-orange-100 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-800">이런 경우 비추천</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {selectedCut.avoidFor.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function HomeView({
  query,
  setQuery,
  selectedCut,
  filteredCuts,
  prefs,
  setPrefs,
  handleSearch,
  applyQuickKeyword,
  openDetailPage,
  setSelectedCut,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedCut: PorkCut;
  filteredCuts: PorkCut[];
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
  handleSearch: (value: string) => void;
  applyQuickKeyword: (type: "grill" | "stew" | "budget") => void;
  openDetailPage: (cut: PorkCut) => void;
  setSelectedCut: (cut: PorkCut) => void;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff,_#f1f5f9)] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-100 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-amber-50 blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                <Sparkles className="h-4 w-4" /> 돼지고기 부위를 쉽게 고르는 가이드
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                어떤 돼지고기를 살지
                <span className="block bg-gradient-to-r from-slate-900 to-orange-500 bg-clip-text text-transparent">한눈에 고르는 사이트</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">부위 이름만 보여주는 사전이 아니라, 구이·찜·가성비·식감까지 고려해서 초보자도 쉽게 선택할 수 있게 도와주는 인터랙티브 가이드입니다.</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="rounded-full border-0 bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-900"><PiggyBank className="mr-2 h-4 w-4" /> 돼지고기 MVP</Badge>
                <button
  type="button"
  onClick={() => applyQuickKeyword("grill")}
  className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-4 py-2 text-sm font-medium transition border"
>
  🔥 구이 추천
</button>

<button
  type="button"
  onClick={() => applyQuickKeyword("stew")}
  className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-4 py-2 text-sm font-medium transition border"
>
  🍲 찜·국물용
</button>

<button
  type="button"
  onClick={() => applyQuickKeyword("budget")}
  className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-4 py-2 text-sm font-medium transition border"
>
  💰 가성비 선택
</button>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="삼겹살, 목살, 구이용, 가성비처럼 검색해보세요" className="h-12 rounded-2xl border-orange-100 bg-white pl-11 shadow-sm focus-visible:ring-orange-300" />
                </div>
                <Button className="h-12 rounded-2xl bg-orange-500 px-6 text-white shadow-lg shadow-orange-200 hover:bg-orange-600" onClick={() => handleSearch(query)}>부위 찾기</Button>
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.20)]">
                <div className="mb-4"><div className="text-sm text-orange-200">오늘의 추천 부위</div><div className="text-3xl font-bold">{selectedCut.name}</div></div>
                <p className="mb-5 text-sm leading-6 text-slate-300">{selectedCut.short}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><div className="mb-1 flex items-center gap-2 text-sm text-slate-300"><Heart className="h-4 w-4 text-orange-300" /> 지방감</div><div className="text-xl font-bold">{selectedCut.fat}%</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><div className="mb-1 flex items-center gap-2 text-sm text-slate-300"><Beef className="h-4 w-4 text-orange-300" /> 풍미</div><div className="text-xl font-bold">{selectedCut.flavor}%</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><div className="mb-1 flex items-center gap-2 text-sm text-slate-300"><Scale className="h-4 w-4 text-orange-300" /> 부드러움</div><div className="text-xl font-bold">{selectedCut.tenderness}%</div></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <GrillBadge cut={selectedCut} dark />
                  {selectedCut.cooking.map((item) => (
                    <Badge key={item} className="rounded-full border-0 bg-orange-500/20 text-orange-100 hover:bg-orange-500/20">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader><CardTitle className="text-2xl text-slate-950">부위 위치 한눈에 보기</CardTitle></CardHeader>
            <CardContent>
              <PigMap selected={selectedCut} onSelect={setSelectedCut} />
              <p className="mt-4 text-sm text-slate-600">지도의 부위를 누르면 상세 정보가 바뀝니다.</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader><CardTitle className="text-2xl text-slate-950">{selectedCut.name} 상세 정보</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">{selectedCut.tags.map((tag) => <Badge key={tag} variant="outline" className="rounded-full border-orange-200">#{tag}</Badge>)}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">위치</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.location}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">식감</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.texture}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">가격 느낌</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.price}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">초보 추천도</div><div className="mt-1 font-semibold text-slate-900">{selectedCut.beginner}</div></div>
              </div>
              <div className="space-y-4">
                <StatBar label="지방감" value={selectedCut.fat} />
                <StatBar label="풍미" value={selectedCut.flavor} />
                <StatBar label="부드러움" value={selectedCut.tenderness} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-800">추천 요리</div>
                  <div className="flex flex-wrap gap-2">{selectedCut.cooking.map((item) => <Badge key={item} className="rounded-full bg-orange-500 text-white hover:bg-orange-500">{item}</Badge>)}<GrillBadge cut={selectedCut} /></div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-800">대체 부위</div>
                  <div className="flex flex-wrap gap-2">{selectedCut.alternatives.map((item) => <Badge key={item} variant="outline" className="rounded-full border-orange-200">{item}</Badge>)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="recommendation-section" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RecommendationPanel prefs={prefs} setPrefs={setPrefs} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2"><ArrowLeftRight className="h-5 w-5 text-orange-500" /><h2 className="text-2xl font-bold text-slate-950">비슷한 부위 비교</h2></div>
        <div className="grid gap-6 lg:grid-cols-3">
          {comparisonPairs.map((pair) => (
            <Card key={pair.title} className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <CardHeader><CardTitle className="text-lg">{pair.title}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {pair.rows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="text-slate-600">{label}</span><span className="font-semibold text-slate-900">{value}</span></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 pb-14 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-slate-950">부위 목록</h2><div className="text-sm text-slate-500">총 {filteredCuts.length}개</div></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCuts.map((cut) => <CutCard key={cut.id} cut={cut} onSelect={openDetailPage} />)}
        </div>
      </section>
    </div>
  );
}

export default function MeatSelectorSite() {
  const [query, setQuery] = useState("");
  const [selectedCut, setSelectedCut] = useState<PorkCut>(porkCuts[0]);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [currentPage, setCurrentPage] = useState<PageMode>("home");

  const filteredCuts = useMemo(() => {
    const q = query.trim();
    if (!q) return porkCuts;
    return porkCuts.filter(
      (cut) => cut.name.includes(q) || cut.short.includes(q) || cut.tags.some((tag) => tag.includes(q)) || cut.cooking.some((item) => item.includes(q))
    );
  }, [query]);

  const handleSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;

    const matchedCut = porkCuts.find(
      (cut) =>
        cut.name.includes(normalized) ||
        normalized.includes(cut.name) ||
        cut.tags.some((tag) => tag.includes(normalized) || normalized.includes(tag)) ||
        cut.cooking.some((item) => item.includes(normalized) || normalized.includes(item))
    );

    if (matchedCut) {
      setSelectedCut(matchedCut);
      setCurrentPage("detail");
    }
  };

  const scrollToRecommendation = () => {
    const el = document.getElementById("recommendation-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyQuickKeyword = (type: "grill" | "stew" | "budget") => {
    const nextPrefs: Prefs = { ...defaultPrefs };
    if (type === "grill") {
      nextPrefs.cooking = "구이";
      nextPrefs.texture = "상관없음";
    }
    if (type === "stew") {
      nextPrefs.cooking = "찜";
      nextPrefs.texture = "부드러운";
    }
    if (type === "budget") {
      nextPrefs.cooking = "볶음";
      nextPrefs.texture = "상관없음";
      nextPrefs.budget = "가성비 위주";
    }
    setPrefs(nextPrefs);
    scrollToRecommendation();
  };

  const openDetailPage = (cut: PorkCut) => {
    setSelectedCut(cut);
    setCurrentPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentPage === "detail") {
    return <DetailView selectedCut={selectedCut} setSelectedCut={setSelectedCut} goHome={goHome} />;
  }

  return (
    <HomeView
      query={query}
      setQuery={setQuery}
      selectedCut={selectedCut}
      filteredCuts={filteredCuts}
      prefs={prefs}
      setPrefs={setPrefs}
      handleSearch={handleSearch}
      applyQuickKeyword={applyQuickKeyword}
      openDetailPage={openDetailPage}
      setSelectedCut={setSelectedCut}
    />
  );
}

console.assert(typeof RecommendationPanel === "function", "RecommendationPanel should be defined");
console.assert(typeof scoreCut === "function", "scoreCut should be defined");
console.assert(typeof getRecommendationReasons === "function", "getRecommendationReasons should be defined");
console.assert(scoreCut(porkCuts[0], defaultPrefs) > 0, "scoreCut should return a positive score");
console.assert(Array.isArray(getRecommendationReasons(porkCuts[0], defaultPrefs)), "getRecommendationReasons should return an array");
