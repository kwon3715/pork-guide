export const porkCuts = [
  {
    slug: "samgyeopsal",
    name: "삼겹살",
    shortDescription: "지방과 살코기가 층을 이루는 대표적인 구이용 부위",
    tags: ["구이용", "대중적", "지방감 있음"],

    location: "배쪽(복부) 부위",
    locationImage: "/cuts/location-samgyeopsal.png",
    meatImage: "/cuts/meat-samgyeopsal.png",

    variants: [
      "일반 삼겹살",
      "오겹살",
      "두께에 따라 식감 차이가 있을 수 있음",
    ],

    texture: "부드럽고 탄력 있는 편",
    flavor: "고소한 풍미가 강한 편",
    fat: "높은 편",
    popularity: "매우 높음",
    beginner: "높음",

    cooking: ["불판구이", "숯불구이", "에어프라이어 조리"],
    cookingNote:
      "지방감이 있는 편이라 구이 요리에 많이 활용되며, 두께와 절단 방식에 따라 식감 차이가 있을 수 있습니다.",

    tips: [
      "지방과 살코기 층이 비교적 고르게 보이는 제품이 무난합니다.",
      "지나치게 얇으면 굽는 과정에서 식감이 약해질 수 있습니다.",
      "구이용은 사용 목적에 맞는 두께를 고르는 것이 중요합니다.",
    ],
  },

  {
    slug: "moksal",
    name: "목살",
    shortDescription: "지방과 살코기 균형이 좋은 구이용 인기 부위",
    tags: ["구이용", "균형형", "대중적"],

    location: "목 주변 부위",
    locationImage: "/cuts/location-moksal.png",
    meatImage: "/cuts/meat-moksal.png",

    variants: [
      "일반 목살",
      "절단 두께에 따라 구이감 차이가 있을 수 있음",
    ],

    texture: "탄탄하면서도 지나치게 질기지 않은 편",
    flavor: "고기 풍미와 지방감의 균형이 좋은 편",
    fat: "중간 정도",
    popularity: "높음",
    beginner: "높음",

    cooking: ["불판구이", "숯불구이", "스테이크 스타일 구이"],
    cookingNote:
      "목살은 비교적 활용도가 높고, 굽는 방식에 따라 풍미 차이가 살아나는 편입니다.",

    tips: [
      "지방이 한쪽에 과하게 몰리지 않은 제품이 다루기 편합니다.",
      "너무 얇으면 목살 특유의 식감을 느끼기 어려울 수 있습니다.",
      "구이용이라면 절단 두께와 지방 분포를 함께 보는 것이 좋습니다.",
    ],
  },

  {
    slug: "hangjeongsal",
    name: "항정살",
    shortDescription: "쫄깃한 식감과 진한 풍미로 인기가 높은 특수부위",
    tags: ["특수부위", "쫄깃함", "풍미 있음"],

    location: "목 주변에서 나오는 부위",
    locationImage: "/cuts/location-hangjeongsal.png",
    meatImage: "/cuts/meat-hangjeongsal.png",

    variants: ["절단 형태에 따라 식감 차이가 날 수 있음"],

    texture: "쫄깃하고 탄력 있는 편",
    flavor: "풍미가 진한 편",
    fat: "중간 이상",
    popularity: "높음",
    beginner: "중간",

    cooking: ["직화구이", "불판구이"],
    cookingNote:
      "항정살은 식감과 풍미를 즐기는 용도로 많이 찾는 편이며, 과하게 익히면 식감이 달라질 수 있습니다.",

    tips: [
      "결 방향과 지방 분포를 함께 보는 것이 좋습니다.",
      "과도하게 얇거나 지나치게 두꺼우면 조리감이 달라질 수 있습니다.",
      "소량 포장 제품은 구이용으로 접근하기 편합니다.",
    ],
  },
];
