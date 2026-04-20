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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type MeatType = "pork" | "beef" | "chicken";

type Prefs = {
  cooking: "구이" | "볶음" | "찜" | "국물요리" | "튀김" | "수육";
  texture: "부드러운 편" | "쫄깃한 편" | "담백한 편" | "상관없음";
  fat: "담백한 쪽" | "중간" | "고소한 쪽";
  budget: "가성비 우선" | "보통" | "가격보다 용도";
};

type MeatCut = {
  id: string;
  meatType: MeatType;
  name: string;
  animal: string;
  short: string;
  location: string;
  factNote: string;
  usageNote: string;
  cautionNote: string;
  cooking: Prefs["cooking"][];
  tags: string[];
  alternatives: string[];
  profile: {
    fat: number;
    flavor: number;
    tender: number;
  };
};

type RecommendationCut = MeatCut & {
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
    placeholder: "삼겹살, 목심, 안심, 앞다리처럼 검색해보세요",
    sideDesc: "삼겹살, 목심, 등심, 안심 등",
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

const porkCuts: MeatCut[] = [
  {
    id: "samgyeopsal",
    meatType: "pork",
    name: "삼겹살",
    animal: "돼지",
    short: "지방층이 뚜렷해 구이로 많이 찾는 대표 부위",
    location: "배 쪽",
    factNote: "배 쪽에 위치하며 지방 비중이 비교적 높은 편으로 알려진다.",
    usageNote: "구이용으로 많이 선택되며, 볶음류에 쓰는 경우도 있다.",
    cautionNote: "기름기가 부담스러운 사람에게는 다소 무겁게 느껴질 수 있다.",
    cooking: ["구이", "볶음"],
    tags: ["대표부위", "구이용", "고소한 편"],
    alternatives: ["목심", "갈비"],
    profile: { fat: 88, flavor: 82, tender: 72 },
  },
  {
    id: "moksim",
    meatType: "pork",
    name: "목심",
    animal: "돼지",
    short: "지방과 살코기 균형이 비교적 좋아 구이에 많이 쓰이는 부위",
    location: "목 부위",
    factNote: "근육 사이에 지방이 고르게 분포하는 편으로 소개된다.",
    usageNote: "구이, 전골, 오래 익히는 요리에 두루 쓰이는 편이다.",
    cautionNote:
      "완전히 담백한 부위를 원하는 사람에게는 조금 진하게 느껴질 수 있다.",
    cooking: ["구이", "국물요리"],
    tags: ["균형형", "구이용", "대중적"],
    alternatives: ["삼겹살", "앞다리"],
    profile: { fat: 60, flavor: 76, tender: 74 },
  },
  {
    id: "deungsim_pork",
    meatType: "pork",
    name: "등심",
    animal: "돼지",
    short: "운동량이 적은 쪽이라 비교적 부드럽게 쓰기 쉬운 부위",
    location: "등 쪽",
    factNote: "등 쪽에 위치하며 비교적 연한 부위로 소개되는 경우가 많다.",
    usageNote: "커틀릿, 구이, 볶음용으로 활용하기 쉽다.",
    cautionNote: "너무 오래 익히면 퍽퍽하게 느껴질 수 있다.",
    cooking: ["튀김", "구이", "볶음"],
    tags: ["비교적 부드러움", "활용도", "담백한 편"],
    alternatives: ["안심", "앞다리"],
    profile: { fat: 34, flavor: 58, tender: 76 },
  },
  {
    id: "ansim_pork",
    meatType: "pork",
    name: "안심",
    animal: "돼지",
    short: "지방이 적고 비교적 연해 담백하게 먹기 좋은 부위",
    location: "등 안쪽",
    factNote: "운동을 적게 하는 근육으로 비교적 매우 연한 쪽으로 소개된다.",
    usageNote: "튀김, 구이, 오래 끓이는 요리에 쓰기 좋다.",
    cautionNote: "지방 풍미를 기대하면 다소 심심하게 느껴질 수 있다.",
    cooking: ["튀김", "구이", "국물요리"],
    tags: ["저지방", "담백한 편", "부드러운 편"],
    alternatives: ["등심", "뒷다리"],
    profile: { fat: 14, flavor: 46, tender: 90 },
  },
  {
    id: "apdari",
    meatType: "pork",
    name: "앞다리",
    animal: "돼지",
    short: "살코기 비중이 높고 여러 요리에 두루 쓰기 쉬운 부위",
    location: "앞다리 쪽",
    factNote: "살코기 함량이 풍부한 편으로 소개된다.",
    usageNote: "불고기, 찌개, 수육처럼 활용 범위가 넓다.",
    cautionNote: "구이만 생각하면 더 부드러운 부위가 나을 수 있다.",
    cooking: ["볶음", "국물요리", "수육"],
    tags: ["가성비", "활용도", "실속형"],
    alternatives: ["목심", "뒷다리"],
    profile: { fat: 32, flavor: 62, tender: 58 },
  },
  {
    id: "galbi_pork",
    meatType: "pork",
    name: "갈비",
    animal: "돼지",
    short: "뼈 주변 풍미를 살리기 좋아 찜이나 양념구이에 잘 어울리는 부위",
    location: "갈비뼈 주변",
    factNote: "갈비 부위는 찜이나 양념 요리에 자주 쓰인다.",
    usageNote: "갈비찜, 바비큐, 양념구이처럼 풍미를 살리는 조리에 잘 맞는다.",
    cautionNote: "손질 상태나 뼈 비중에 따라 먹는 느낌 차이가 있다.",
    cooking: ["찜", "구이"],
    tags: ["진한 맛", "양념요리", "특별식"],
    alternatives: ["삼겹살", "목심"],
    profile: { fat: 56, flavor: 84, tender: 64 },
  },
  {
    id: "satae_pork",
    meatType: "pork",
    name: "사태",
    animal: "돼지",
    short: "오래 익히는 쪽에 더 잘 맞는 편의 부위",
    location: "다리 근육 쪽",
    factNote: "근육을 많이 쓰는 부위라 오래 익히는 조리에 어울리는 편이다.",
    usageNote: "국물요리나 찜류에서 쓰기 좋다.",
    cautionNote: "빠른 구이용으로는 다소 단단하게 느껴질 수 있다.",
    cooking: ["국물요리", "찜"],
    tags: ["국물용", "오래익힘", "담백한 편"],
    alternatives: ["앞다리", "갈비"],
    profile: { fat: 18, flavor: 60, tender: 44 },
  },
  {
    id: "hangjeongsal",
    meatType: "pork",
    name: "항정살",
    animal: "돼지",
    short: "쫄깃한 식감과 진한 풍미로 인기가 높은 특수부위",
    location: "목 주변",
    factNote: "목 주변에서 나오는 부위로 특유의 식감 때문에 많이 찾는다.",
    usageNote: "구이 중심으로 즐기는 경우가 많다.",
    cautionNote: "손질 상태에 따라 식감 차이가 느껴질 수 있다.",
    cooking: ["구이"],
    tags: ["특수부위", "쫄깃함", "풍미 있음"],
    alternatives: ["목심", "삼겹살"],
    profile: { fat: 68, flavor: 82, tender: 70 },
  },
];

const beefCuts: MeatCut[] = [
  {
    id: "deungsim_beef",
    meatType: "beef",
    name: "등심",
    animal: "소",
    short: "구이와 스테이크에 많이 쓰이는 대표 부위",
    location: "등 가운데 쪽",
    factNote:
      "등 가운데에 위치하며 구이·스테이크용 대표 부위로 널리 알려져 있다.",
    usageNote: "구이, 스테이크에 가장 무난하게 접근하기 좋은 편이다.",
    cautionNote: "가격 부담이 있는 편이라 용도 대비 예산을 함께 보는 게 좋다.",
    cooking: ["구이"],
    tags: ["대표부위", "구이용", "풍미"],
    alternatives: ["채끝", "안심"],
    profile: { fat: 62, flavor: 88, tender: 82 },
  },
  {
    id: "chaekkeut",
    meatType: "beef",
    name: "채끝",
    animal: "소",
    short: "부드러움과 풍미의 균형이 좋아 스테이크용으로 많이 찾는 부위",
    location: "허리 끝 쪽",
    factNote:
      "허리 끝 부분으로 설명되며 구이·스테이크용으로 자주 쓰인다.",
    usageNote: "스테이크, 구이에 잘 맞고 비교적 균형감 있는 선택지다.",
    cautionNote:
      "완전히 담백한 부위를 기대하면 등심보다 낫지만 여전히 진한 편일 수 있다.",
    cooking: ["구이"],
    tags: ["균형형", "스테이크", "풍미"],
    alternatives: ["등심", "안심"],
    profile: { fat: 44, flavor: 84, tender: 80 },
  },
  {
    id: "ansim_beef",
    meatType: "beef",
    name: "안심",
    animal: "소",
    short: "비교적 가장 부드러운 쪽으로 많이 알려진 부위",
    location: "등 안쪽",
    factNote: "몸 안쪽에 위치해 움직임이 적어 매우 연한 편으로 설명된다.",
    usageNote: "구이, 스테이크처럼 식감을 살리는 조리에 잘 맞는다.",
    cautionNote: "지방 풍미보다 연한 식감을 우선할 때 잘 맞는다.",
    cooking: ["구이"],
    tags: ["부드러운 편", "고급", "담백한 편"],
    alternatives: ["채끝", "우둔"],
    profile: { fat: 18, flavor: 70, tender: 96 },
  },
  {
    id: "buchaesal",
    meatType: "beef",
    name: "부채살",
    animal: "소",
    short: "가성비와 활용도를 함께 보기 좋은 편의 부위",
    location: "앞다리 쪽",
    factNote: "앞다리 계열에서 많이 찾는 부위 중 하나다.",
    usageNote: "구이와 볶음에 두루 쓰기 쉬운 편이다.",
    cautionNote: "최상급 마블링 중심의 식감을 기대하면 차이가 있다.",
    cooking: ["구이", "볶음"],
    tags: ["실속형", "활용도", "구이용"],
    alternatives: ["채끝", "우둔"],
    profile: { fat: 34, flavor: 76, tender: 68 },
  },
  {
    id: "yangji",
    meatType: "beef",
    name: "양지",
    animal: "소",
    short: "오래 끓일수록 국물 맛을 살리기 좋은 부위",
    location: "앞가슴~복부 아래쪽",
    factNote:
      "결합조직이 많아 오래 끓이는 조리에 잘 맞는다고 소개된다.",
    usageNote: "국거리, 장시간 조리, 수육류에 잘 어울린다.",
    cautionNote: "빠르게 굽는 용도만 생각하면 다른 부위가 더 낫다.",
    cooking: ["국물요리", "수육"],
    tags: ["국물용", "깊은맛", "오래익힘"],
    alternatives: ["사태", "우둔"],
    profile: { fat: 28, flavor: 82, tender: 48 },
  },
  {
    id: "satae_beef",
    meatType: "beef",
    name: "사태",
    animal: "소",
    short: "근육 결이 살아 있어 오래 익히는 요리에 잘 맞는 부위",
    location: "다리 쪽",
    factNote:
      "힘줄과 결이 있는 편이라 오래 익힐수록 쓰기 좋은 쪽이다.",
    usageNote: "찜, 국물요리, 수육류에 잘 맞는다.",
    cautionNote: "구이로 바로 먹으면 질기게 느껴질 수 있다.",
    cooking: ["찜", "국물요리", "수육"],
    tags: ["쫄깃한 편", "국물용", "담백한 편"],
    alternatives: ["양지", "우둔"],
    profile: { fat: 16, flavor: 74, tender: 42 },
  },
  {
    id: "udun",
    meatType: "beef",
    name: "우둔",
    animal: "소",
    short: "지방이 적고 담백한 쪽으로 많이 고르는 부위",
    location: "뒷다리 안쪽",
    factNote: "뒷다리 계열로 비교적 지방이 적은 편으로 알려져 있다.",
    usageNote: "볶음이나 얇게 쓰는 요리에 잘 맞는다.",
    cautionNote: "육즙 중심의 구이를 기대하면 아쉬울 수 있다.",
    cooking: ["볶음"],
    tags: ["저지방", "담백한 편", "실속형"],
    alternatives: ["안심", "양지"],
    profile: { fat: 10, flavor: 56, tender: 54 },
  },
  {
    id: "galbi_beef",
    meatType: "beef",
    name: "갈비",
    animal: "소",
    short: "찜, 구이, 양념요리에서 존재감이 큰 대표 부위",
    location: "갈비뼈 주변",
    factNote: "갈비는 구이와 찜류에 대표적으로 쓰이는 부위다.",
    usageNote: "양념갈비, 갈비찜, 구이에 많이 활용된다.",
    cautionNote: "손질 상태와 뼈 비중에 따라 체감이 달라질 수 있다.",
    cooking: ["구이", "찜"],
    tags: ["진한 맛", "양념요리", "대표부위"],
    alternatives: ["등심", "양지"],
    profile: { fat: 58, flavor: 86, tender: 66 },
  },
];

const chickenCuts: MeatCut[] = [
  {
    id: "gaseumsal",
    meatType: "chicken",
    name: "가슴살",
    animal: "닭",
    short: "지방이 적고 담백한 쪽으로 많이 찾는 부위",
    location: "가슴 부위",
    factNote:
      "흉골 좌우에 붙어 있는 근육으로 설명되며 지방이 적은 편이다.",
    usageNote: "튀김, 샐러드, 스테이크처럼 손질하기 쉬운 조리에 잘 맞는다.",
    cautionNote: "과하게 익히면 퍽퍽하게 느껴질 수 있다.",
    cooking: ["튀김", "볶음", "구이"],
    tags: ["저지방", "담백한 편", "대중적"],
    alternatives: ["안심", "넓적다리"],
    profile: { fat: 10, flavor: 48, tender: 62 },
  },
  {
    id: "ansim_chicken",
    meatType: "chicken",
    name: "안심",
    animal: "닭",
    short: "가슴살 안쪽에 붙어 있으며 부드럽게 쓰기 쉬운 부위",
    location: "가슴살 안쪽",
    factNote: "가슴살 안쪽 흉골을 따라 붙어 있는 근육으로 설명된다.",
    usageNote: "튀김, 볶음, 간단한 반찬용으로 쓰기 좋다.",
    cautionNote: "얇아 빨리 익는 편이라 과조리에 주의하는 게 좋다.",
    cooking: ["튀김", "볶음"],
    tags: ["부드러운 편", "저지방", "담백한 편"],
    alternatives: ["가슴살", "넓적다리"],
    profile: { fat: 8, flavor: 44, tender: 70 },
  },
  {
    id: "dakdari",
    meatType: "chicken",
    name: "닭다리",
    animal: "닭",
    short: "지방과 단백질 균형이 좋아 선호도가 높은 편의 부위",
    location: "다리 부위",
    factNote:
      "다리 쪽은 가슴보다 진한 맛과 식감을 느끼기 쉬운 편이다.",
    usageNote: "튀김, 구이, 양념요리에 잘 어울린다.",
    cautionNote: "담백함만 찾는 경우에는 가슴살 쪽이 더 잘 맞을 수 있다.",
    cooking: ["튀김", "구이"],
    tags: ["인기부위", "고소한 편", "촉촉한 편"],
    alternatives: ["넓적다리", "날개"],
    profile: { fat: 44, flavor: 74, tender: 76 },
  },
  {
    id: "neoljeokdari",
    meatType: "chicken",
    name: "넓적다리",
    animal: "닭",
    short: "닭다리 위쪽으로 살이 많고 촉촉하게 쓰기 쉬운 부위",
    location: "허벅지 쪽",
    factNote: "다리 계열 중 살이 많은 쪽으로 많이 구분된다.",
    usageNote: "구이, 볶음, 덮밥류에 잘 어울린다.",
    cautionNote: "껍질 포함 여부에 따라 기름짐 체감 차이가 난다.",
    cooking: ["구이", "볶음"],
    tags: ["촉촉한 편", "실속형", "풍미"],
    alternatives: ["닭다리", "가슴살"],
    profile: { fat: 40, flavor: 72, tender: 74 },
  },
  {
    id: "nalgae",
    meatType: "chicken",
    name: "날개",
    animal: "닭",
    short: "살은 적지만 구이와 튀김에서 인기가 높은 부위",
    location: "날개 부위",
    factNote:
      "날개는 구이·튀김용으로 많이 소비되는 부위로 알려져 있다.",
    usageNote: "튀김, 구이, 조림처럼 양념을 살리는 조리에 잘 맞는다.",
    cautionNote:
      "먹을 수 있는 살 양은 다른 부위보다 적게 느껴질 수 있다.",
    cooking: ["튀김", "구이"],
    tags: ["양념요리", "간식용", "풍미"],
    alternatives: ["닭다리", "넓적다리"],
    profile: { fat: 46, flavor: 70, tender: 64 },
  },
];

const comparisonPairsByMeat: Record<
  MeatType,
  { title: string; rows: [string, string][] }[]
> = {
  pork: [
    {
      title: "삼겹살 vs 목심",
      rows: [
        ["더 고소하게 느껴지기 쉬운 쪽", "삼겹살"],
        ["조금 덜 무겁게 느껴지기 쉬운 쪽", "목심"],
        ["구이 입문용", "둘 다 무난"],
        ["담백한 쪽", "목심"],
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
  if (type === "pork") return porkCuts;
  if (type === "beef") return beefCuts;
  return chickenCuts;
}

function getDetailHref(cut: MeatCut) {
  if (cut.meatType !== "pork") return null;

  if (cut.id === "samgyeopsal") return "/cuts/samgyeopsal";
  if (cut.id === "moksim") return "/cuts/moksal";
  if (cut.id === "hangjeongsal") return "/cuts/hangjeongsal";

  return null;
}

function getFatLabel(value: number) {
  if (value <= 15) return "매우 담백한 편";
  if (value <= 35) return "담백한 편";
  if (value <= 60) return "중간 정도";
  if (value <= 80) return "고소한 편";
  return "기름진 편";
}

function getFlavorLabel(value: number) {
  if (value <= 45) return "은은한 편";
  if (value <= 65) return "무난한 편";
  if (value <= 80) return "풍미가 있는 편";
  return "풍미가 진한 편";
}

function getTenderLabel(value: number) {
  if (value <= 45) return "단단한 편";
  if (value <= 65) return "보통";
  if (value <= 80) return "부드러운 편";
  return "매우 부드러운 편";
}

function scoreCut(cut: MeatCut, prefs: Prefs) {
  let score = 0;

  if (cut.cooking.includes(prefs.cooking)) score += 35;
  if (prefs.texture === "부드러운 편") score += cut.profile.tender * 0.35;
  if (prefs.texture === "쫄깃한 편")
    score += cut.tags.some((t) => t.includes("쫄깃")) ? 26 : 8;
  if (prefs.texture === "담백한 편") score += (100 - cut.profile.fat) * 0.25;
  if (prefs.texture === "상관없음") score += 10;

  if (prefs.fat === "담백한 쪽") score += (100 - cut.profile.fat) * 0.28;
  if (prefs.fat === "중간") score += 25 - Math.abs(50 - cut.profile.fat) * 0.2;
  if (prefs.fat === "고소한 쪽") score += cut.profile.fat * 0.28;

  if (prefs.budget === "가성비 우선") {
    if (cut.tags.includes("실속형") || cut.tags.includes("가성비")) score += 24;
    else score += 8;
  }
  if (prefs.budget === "보통") score += 14;
  if (prefs.budget === "가격보다 용도") score += 18;

  return Math.round(score);
}

function getRecommendationReasons(cut: MeatCut, prefs: Prefs) {
  const reasons: string[] = [];

  if (cut.cooking.includes(prefs.cooking))
    reasons.push(`"${prefs.cooking}" 용도와 잘 맞는 편`);
  if (prefs.texture === "부드러운 편" && cut.profile.tender >= 70)
    reasons.push("부드러운 식감 쪽에 가까움");
  if (
    prefs.texture === "쫄깃한 편" &&
    cut.tags.some((t) => t.includes("쫄깃"))
  )
    reasons.push("쫄깃한 식감 쪽으로 보기 쉬움");
  if (prefs.texture === "담백한 편" && cut.profile.fat <= 35)
    reasons.push("상대적으로 담백한 쪽");
  if (prefs.fat === "고소한 쪽" && cut.profile.fat >= 55)
    reasons.push("고소하게 느껴지기 쉬운 편");
  if (
    prefs.budget === "가성비 우선" &&
    (cut.tags.includes("실속형") || cut.tags.includes("가성비"))
  )
    reasons.push("실속형 선택지로 보기 좋음");

  return reasons.slice(0, 3);
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function ProfileCard({ cut }: { cut: MeatCut }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <InfoPill title="지방 느낌" value={getFatLabel(cut.profile.fat)} />
      <InfoPill title="풍미 느낌" value={getFlavorLabel(cut.profile.flavor)} />
      <InfoPill title="식감 느낌" value={getTenderLabel(cut.profile.tender)} />
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
      <Card className="overflow-hidden rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">고기 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(["pork", "beef", "chicken"] as MeatType[]).map((type) => {
            const active = meatType === type;
            const icon =
              type === "pork" ? (
                <PiggyBank className="h-5 w-5" />
              ) : type === "beef" ? (
                <Beef className="h-5 w-5" />
              ) : (
                <Flame className="h-5 w-5" />
              );

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange(type)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                  active
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                <div
                  className={`rounded-2xl p-3 ${
                    active
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {meatMeta[type].label}
                  </div>
                  <div className="text-sm text-slate-500">
                    {meatMeta[type].sideDesc}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            이 버전은 <span className="font-semibold text-slate-900">정확한 숫자처럼 보이는 표현</span>을 줄이고,
            <br />
            <span className="font-semibold text-slate-900">위치 · 특징 · 대표 용도</span> 중심으로 보수적으로 정리했습니다.
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function PorkMap({
  selected,
  onSelect,
}: {
  selected: MeatCut;
  onSelect: (cut: MeatCut) => void;
}) {
  const items = [
    { id: "moksim", label: "목심", left: "32%", top: "18%" },
    { id: "deungsim_pork", label: "등심", left: "58%", top: "18%" },
    { id: "ansim_pork", label: "안심", left: "73%", top: "28%" },
    { id: "apdari", label: "앞다리", left: "25%", top: "58%" },
    { id: "samgyeopsal", label: "삼겹살", left: "61%", top: "70%" },
    { id: "galbi_pork", label: "갈비", left: "48%", top: "35%" },
    { id: "satae_pork", label: "사태", left: "78%", top: "64%" },
    { id: "hangjeongsal", label: "항정살", left: "44%", top: "10%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border border-orange-100 bg-white p-4">
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
          const active = selected.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const cut = porkCuts.find((c) => c.id === item.id);
                if (cut) onSelect(cut);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-sm transition sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200"
                  : "border border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
            >
              {item.label}
            </button>
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
  selected: MeatCut;
  onSelect: (cut: MeatCut) => void;
}) {
  const items = [
    { id: "deungsim_beef", label: "등심", left: "58%", top: "22%" },
    { id: "chaekkeut", label: "채끝", left: "76%", top: "28%" },
    { id: "ansim_beef", label: "안심", left: "66%", top: "40%" },
    { id: "buchaesal", label: "부채살", left: "28%", top: "40%" },
    { id: "yangji", label: "양지", left: "36%", top: "70%" },
    { id: "satae_beef", label: "사태", left: "79%", top: "72%" },
    { id: "udun", label: "우둔", left: "80%", top: "54%" },
    { id: "galbi_beef", label: "갈비", left: "47%", top: "36%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border border-orange-100 bg-white p-4">
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
          const active = selected.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const cut = beefCuts.find((c) => c.id === item.id);
                if (cut) onSelect(cut);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-sm transition sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200"
                  : "border border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
            >
              {item.label}
            </button>
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
  selected: MeatCut;
  onSelect: (cut: MeatCut) => void;
}) {
  const items = [
    { id: "gaseumsal", label: "가슴살", left: "50%", top: "38%" },
    { id: "ansim_chicken", label: "안심", left: "58%", top: "48%" },
    { id: "nalgae", label: "날개", left: "28%", top: "36%" },
    { id: "dakdari", label: "닭다리", left: "68%", top: "72%" },
    { id: "neoljeokdari", label: "넓적다리", left: "50%", top: "72%" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[640px] rounded-3xl border border-orange-100 bg-white p-4">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <svg viewBox="0 0 640 360" className="h-auto w-full">
          <rect width="640" height="360" fill="#f3f4f6" />
          <ellipse cx="360" cy="180" rx="140" ry="100" fill="#d1d5db" />
          <circle cx="220" cy="135" r="45" fill="#d1d5db" />
          <circle cx="248" cy="118" r="8" fill="#94a3b8" />
          <path d="M185 130 L150 120 L185 145 Z" fill="#fbbf24" />
          <ellipse cx="195" cy="190" rx="55" ry="22" fill="#d1d5db" />
          <ellipse
            cx="255"
            cy="255"
            rx="22"
            ry="58"
            fill="#d1d5db"
            transform="rotate(15 255 255)"
          />
          <ellipse
            cx="360"
            cy="270"
            rx="22"
            ry="64"
            fill="#d1d5db"
            transform="rotate(-10 360 270)"
          />
        </svg>

        {items.map((item) => {
          const active = selected.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const cut = chickenCuts.find((c) => c.id === item.id);
                if (cut) onSelect(cut);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-sm transition sm:text-sm ${
                active
                  ? "bg-orange-500 text-white ring-4 ring-orange-200"
                  : "border border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-600"
              }`}
              style={{ left: item.left, top: item.top }}
            >
              {item.label}
            </button>
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
  selected: MeatCut;
  onSelect: (cut: MeatCut) => void;
}) {
  if (meatType === "pork") {
    return <PorkMap selected={selected} onSelect={onSelect} />;
  }
  if (meatType === "beef") {
    return <BeefMap selected={selected} onSelect={onSelect} />;
  }
  return <ChickenMap selected={selected} onSelect={onSelect} />;
}

function CutCard({ cut }: { cut: MeatCut }) {
  const detailHref = getDetailHref(cut);

  return (
    <Card className="overflow-hidden rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">{cut.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{cut.short}</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {cut.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full border-orange-200"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mb-5 space-y-3">
          <InfoPill title="지방 느낌" value={getFatLabel(cut.profile.fat)} />
          <InfoPill title="대표 용도" value={cut.cooking.join(", ")} />
        </div>

        {detailHref ? (
          <Link href={detailHref} className="block">
            <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
              자세히 보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            disabled
            className="w-full rounded-2xl bg-slate-300 text-white hover:bg-slate-300"
          >
            상세페이지 준비중
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function RecommendationPanel({
  cuts,
  prefs,
  setPrefs,
}: {
  cuts: MeatCut[];
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
      <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl">상황별 추천 받기</CardTitle>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:border-orange-300 hover:bg-orange-50"
              onClick={() => setPrefs(defaultPrefs)}
            >
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
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "border-orange-200"
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
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <CardHeader>
          <CardTitle className="text-xl">추천 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((cut, idx) => {
            const detailHref = getDetailHref(cut);

            return (
              <div
                key={cut.id}
                className="rounded-2xl border border-orange-100 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-orange-500 text-white hover:bg-orange-500">
                      TOP {idx + 1}
                    </Badge>
                    <div className="font-bold text-slate-900">{cut.name}</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-600">
                    추천 참고용
                  </div>
                </div>

                <p className="mb-3 text-sm text-slate-600">{cut.short}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {cut.cooking.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="rounded-full border-orange-200"
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
                        className="rounded-full border-0 bg-slate-100 text-slate-700 hover:bg-slate-100"
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                )}

                {detailHref ? (
                  <Link href={detailHref} className="inline-block">
                    <Button className="rounded-full bg-orange-500 text-white hover:bg-orange-600">
                      상세페이지 보기
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    className="rounded-full bg-slate-300 text-white hover:bg-slate-300"
                  >
                    상세페이지 준비중
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
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
  selectedCut: MeatCut;
  filteredCuts: MeatCut[];
  currentCuts: MeatCut[];
  prefs: Prefs;
  setPrefs: React.Dispatch<React.SetStateAction<Prefs>>;
  handleSearch: (value: string) => void;
  applyQuickKeyword: (type: "grill" | "stew" | "light") => void;
  setSelectedCut: (cut: MeatCut) => void;
}) {
  const currentComparisonPairs = comparisonPairsByMeat[meatType];
  const meta = meatMeta[meatType];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff,_#f1f5f9)] text-slate-900">
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
                        <div className="text-sm text-orange-200">
                          오늘의 추천 부위
                        </div>
                        <div className="text-3xl font-bold">
                          {selectedCut.name}
                        </div>
                      </div>
                      <p className="mb-5 text-sm leading-6 text-slate-300">
                        {selectedCut.short}
                      </p>

                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Heart className="h-4 w-4 text-orange-300" />
                            지방 느낌
                          </div>
                          <div className="font-semibold">
                            {getFatLabel(selectedCut.profile.fat)}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Beef className="h-4 w-4 text-orange-300" />
                            풍미 느낌
                          </div>
                          <div className="font-semibold">
                            {getFlavorLabel(selectedCut.profile.flavor)}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                            <Scale className="h-4 w-4 text-orange-300" />
                            식감 느낌
                          </div>
                          <div className="font-semibold">
                            {getTenderLabel(selectedCut.profile.tender)}
                          </div>
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

                      {getDetailHref(selectedCut) && (
                        <div className="mt-5">
                          <Link href={getDetailHref(selectedCut)!}>
                            <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                              자세히 보기
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-950">
                      부위 위치 한눈에 보기
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MeatMap
                      meatType={meatType}
                      selected={selectedCut}
                      onSelect={setSelectedCut}
                    />
                    <p className="mt-4 text-sm text-slate-600">
                      지도의 부위를 누르면 정보가 바뀝니다.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-950">
                      {selectedCut.name} 요약
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {selectedCut.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full border-orange-200"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <ProfileCard cut={selectedCut} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoPill title="위치" value={selectedCut.location} />
                      <InfoPill
                        title="대표 용도"
                        value={selectedCut.cooking.join(", ")}
                      />
                    </div>

                    <div className="rounded-2xl border border-orange-100 p-4">
                      <div className="mb-2 text-sm font-semibold text-slate-800">
                        대표 특징
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        {selectedCut.factNote}
                      </p>
                    </div>

                    {getDetailHref(selectedCut) ? (
                      <Link href={getDetailHref(selectedCut)!}>
                        <Button className="w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                          자세히 보기
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        className="w-full rounded-2xl bg-slate-300 text-white hover:bg-slate-300"
                      >
                        상세페이지 준비중
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="recommendation-section">
              <RecommendationPanel
                cuts={currentCuts}
                prefs={prefs}
                setPrefs={setPrefs}
              />
            </section>

            <section>
              <div className="mb-5 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-950">
                  비슷한 부위 비교
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {currentComparisonPairs.map((pair) => (
                  <Card
                    key={pair.title}
                    className="rounded-3xl border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
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
                            <span className="font-semibold text-slate-900">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="pb-14">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-950">부위 목록</h2>
                <div className="text-sm text-slate-500">
                  총 {filteredCuts.length}개
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCuts.map((cut) => (
                  <CutCard key={cut.id} cut={cut} />
                ))}
              </div>
            </section>
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
  const [selectedCut, setSelectedCut] = useState<MeatCut>(porkCuts[0]);

  const currentCuts = useMemo(() => getAllCutsByType(meatType), [meatType]);

  const filteredCuts = useMemo(() => {
    const q = query.trim();
    if (!q) return currentCuts;

    return currentCuts.filter(
      (cut) =>
        cut.name.includes(q) ||
        cut.short.includes(q) ||
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
        cut.short.includes(normalized) ||
        cut.location.includes(normalized) ||
        cut.tags.some(
          (tag) => tag.includes(normalized) || normalized.includes(tag)
        ) ||
        cut.cooking.some(
          (item) => item.includes(normalized) || normalized.includes(item)
        )
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
