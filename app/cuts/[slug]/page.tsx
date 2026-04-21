import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ChefHat,
  ArrowRight,
  Sparkles,
  BadgeDollarSign,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allCuts } from "@/data/porkCuts";

export function generateStaticParams() {
  return allCuts.map((cut) => ({
    slug: cut.slug,
  }));
}

const priceGuideBySlug: Record<
  string,
  {
    priceText: string;
    note: string;
  }
> = {
  // 돼지고기
  samgyeopsal: {
    priceText: "100g 기준 온라인 판매가 참고: 약 2,000원~3,500원",
    note: "브랜드, 냉장/냉동, 두께, 구이용 손질 여부에 따라 차이가 큽니다.",
  },
  moksal: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,800원~3,200원",
    note: "브랜드와 원육 등급, 목살 두께, 구이용 포장 방식에 따라 달라질 수 있습니다.",
  },
  apdari: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,200원~2,300원",
    note: "불고기용·찌개용·수육용 등 손질 방식에 따라 가격 차이가 생길 수 있습니다.",
  },
  deungsim-pork: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,500원~2,800원",
    note: "돈가스용·구이용 절단 형태에 따라 가격이 달라질 수 있습니다.",
  },
  ansim-pork: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,700원~3,000원",
    note: "수량이 적은 편이라 판매처에 따라 가격 차이가 비교적 큰 편입니다.",
  },
  galbi-pork: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,600원~3,000원",
    note: "양념 여부와 절단 방식에 따라 가격 편차가 생길 수 있습니다.",
  },
  hangae: {
    priceText: "100g 기준 온라인 판매가 참고: 약 2,500원~4,500원",
    note: "특수부위 계열은 판매처와 재고에 따라 가격 차이가 큽니다.",
  },
  hangjeongsal: {
    priceText: "100g 기준 온라인 판매가 참고: 약 2,800원~4,800원",
    note: "특수부위라서 행사 여부와 판매처에 따라 차이가 크게 날 수 있습니다.",
  },
  satae-pork: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,200원~2,300원",
    note: "용도별 손질 여부에 따라 가격이 달라질 수 있습니다.",
  },

  // 소고기
  deungsim-beef: {
    priceText: "100g 기준 온라인 판매가 참고: 약 7,000원~15,000원",
    note: "한우/육우/수입, 등급, 숙성 여부에 따라 차이가 큽니다.",
  },
  chaekkeut: {
    priceText: "100g 기준 온라인 판매가 참고: 약 8,000원~16,000원",
    note: "한우 여부와 등급, 숙성 상태에 따라 폭이 큰 편입니다.",
  },
  ansim-beef: {
    priceText: "100g 기준 온라인 판매가 참고: 약 9,000원~18,000원",
    note: "부드러운 인기 부위라 판매처에 따라 높은 가격대가 형성되기도 합니다.",
  },
  galbi-beef: {
    priceText: "100g 기준 온라인 판매가 참고: 약 5,000원~12,000원",
    note: "양념 여부, 뼈 포함 여부, 수입/국내산에 따라 차이가 납니다.",
  },
  yangji: {
    priceText: "100g 기준 온라인 판매가 참고: 약 4,000원~9,000원",
    note: "국거리/장조림용 등 손질 형태에 따라 가격 차이가 있습니다.",
  },
  satae-beef: {
    priceText: "100g 기준 온라인 판매가 참고: 약 4,000원~8,500원",
    note: "용도와 원산지에 따라 가격 차이가 생길 수 있습니다.",
  },
  buchaesal: {
    priceText: "100g 기준 온라인 판매가 참고: 약 5,000원~10,000원",
    note: "구이용 인기 부위라 행사 여부에 따라 체감 가격 차이가 있습니다.",
  },
  udun: {
    priceText: "100g 기준 온라인 판매가 참고: 약 3,500원~7,500원",
    note: "육회용·장조림용 등 판매 형태에 따라 가격 차이가 날 수 있습니다.",
  },

  // 닭고기
  gaseumsal: {
    priceText: "100g 기준 온라인 판매가 참고: 약 700원~1,600원",
    note: "냉장/냉동, 대용량 포장 여부에 따라 차이가 큽니다.",
  },
  ansim-chicken: {
    priceText: "100g 기준 온라인 판매가 참고: 약 900원~1,900원",
    note: "손질 상태와 포장 단위에 따라 가격 차이가 있습니다.",
  },
  nalgae: {
    priceText: "100g 기준 온라인 판매가 참고: 약 900원~2,000원",
    note: "양념 여부, 절단 형태, 냉장/냉동 여부에 따라 달라질 수 있습니다.",
  },
  dakdari: {
    priceText: "100g 기준 온라인 판매가 참고: 약 900원~2,100원",
    note: "정육 여부와 냉장/냉동 여부, 수입/국산에 따라 차이가 있습니다.",
  },
  neoljeokdari: {
    priceText: "100g 기준 온라인 판매가 참고: 약 1,000원~2,200원",
    note: "정육 손질 여부와 판매처에 따라 가격 차이가 생길 수 있습니다.",
  },
};

function getDefaultPriceGuide(meatType: string) {
  if (meatType === "pork") {
    return {
      priceText: "100g 기준 온라인 판매가 참고: 약 1,500원~3,000원",
      note: "브랜드, 냉장/냉동, 손질 방식, 두께에 따라 가격 차이가 납니다.",
    };
  }

  if (meatType === "beef") {
    return {
      priceText: "100g 기준 온라인 판매가 참고: 약 4,000원~12,000원",
      note: "원산지, 등급, 숙성 여부에 따라 가격 차이가 큰 편입니다.",
    };
  }

  return {
    priceText: "100g 기준 온라인 판매가 참고: 약 700원~2,000원",
    note: "냉장/냉동 여부와 포장 단위, 손질 상태에 따라 가격 차이가 납니다.",
  };
}

export default function CutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const cut = allCuts.find((item) => item.slug === params.slug);

  if (!cut) {
    notFound();
  }

  const relatedCuts = allCuts.filter(
    (item) => item.slug !== cut.slug && item.meatType === cut.meatType
  );

  const priceGuide =
    priceGuideBySlug[cut.slug] ?? getDefaultPriceGuide(cut.meatType);

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#fff7ed,_#ffffff_28%,_#f8fafc)] text-slate-900">
      <section className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full border-orange-200 text-slate-700 hover:bg-orange-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* 한줄 요약 */}
        <div className="mb-6 rounded-[2rem] border border-orange-200 bg-orange-50 px-6 py-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-600">
            <Sparkles className="h-4 w-4" />
            한줄 요약
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {cut.name}
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-700">
            {cut.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {cut.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-orange-200 bg-white"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 이미지 + 특징 */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    부위 위치
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-orange-100 bg-slate-50">
                    <img
                      src={cut.locationImage}
                      alt={`${cut.name} 위치 이미지`}
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {cut.location}
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ShoppingCart className="h-4 w-4 text-orange-500" />
                    실제 고기 사진
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-orange-100 bg-slate-50">
                    <img
                      src={cut.meatImage}
                      alt={`${cut.name} 실제 고기 사진`}
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    마트나 정육점에서 볼 때의 느낌 참고용
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-slate-950">
                빠르게 보기
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">식감</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.texture}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">풍미</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.flavor}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <div className="text-sm text-slate-500">지방감</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.fat}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <ChefHat className="h-4 w-4 text-orange-500" />
                  추천 요리
                </div>

                <div className="flex flex-wrap gap-2">
                  {cut.cooking.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="rounded-full border-orange-200 bg-white"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-800">
                  고를 때 팁
                </div>

                <div className="space-y-3">
                  {cut.tips.slice(0, 3).map((tip) => (
                    <div
                      key={tip}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 가격 참고 */}
        <div className="mt-6">
          <Card className="rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <BadgeDollarSign className="h-4 w-4 text-orange-500" />
                가격 참고
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                <div className="text-lg font-bold text-slate-950">
                  {priceGuide.priceText}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {priceGuide.note}
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                실제 판매가는 브랜드, 원산지, 냉장/냉동, 손질 상태, 행사 여부에 따라
                달라질 수 있는 참고용 정보입니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 나중에 쿠팡 자리 */}
        <div className="mt-6">
          <Card className="rounded-[2rem] border-2 border-dashed border-orange-200 bg-orange-50/40 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <CardContent className="p-6">
              <div className="mb-2 text-sm font-semibold text-orange-600">
                구매 링크 영역
              </div>
              <div className="text-lg font-bold text-slate-900">
                나중에 쿠팡 제휴 링크 들어갈 자리
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                추후 제휴 설정 후 이 영역에
                <span className="font-semibold text-slate-900">
                  {" "}
                  “온라인 가격 보기” / “구매하러 가기”
                </span>
                같은 버튼을 넣으면 됩니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 비슷한 부위 */}
        <div className="mt-6">
          <Card className="rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">
                비슷한 부위 추천
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3 md:grid-cols-3">
              {relatedCuts.slice(0, 3).map((item) => (
                <Link key={item.slug} href={`/cuts/${item.slug}`} className="block">
                  <div className="rounded-2xl border border-orange-100 p-4 transition hover:bg-orange-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {item.name}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {item.shortDescription}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
