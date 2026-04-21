import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Sparkles,
  BadgeDollarSign,
  ShoppingCart,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allCuts } from "@/data/porkCuts";

export function generateStaticParams() {
  return allCuts.map((cut) => ({
    slug: cut.slug,
  }));
}

const priceGuideBySlug: Record<string, { priceText: string; note: string }> = {
  "samgyeopsal": {
    priceText: "100g 기준: 약 2,000원~3,500원",
    note: "브랜드, 냉장/냉동에 따라 차이 있음",
  },
  "moksal": {
    priceText: "100g 기준: 약 1,800원~3,200원",
    note: "두께, 원육에 따라 차이 있음",
  },
  "apdari": {
    priceText: "100g 기준: 약 1,200원~2,300원",
    note: "용도별 손질에 따라 가격 변동",
  },
  "deungsim-pork": {
    priceText: "100g 기준: 약 1,500원~2,800원",
    note: "돈가스/구이용에 따라 다름",
  },
  "ansim-pork": {
    priceText: "100g 기준: 약 1,700원~3,000원",
    note: "수량 적어서 가격 편차 큼",
  },
  "galbi-pork": {
    priceText: "100g 기준: 약 1,600원~3,000원",
    note: "양념 여부 영향 큼",
  },
  "hangjeongsal": {
    priceText: "100g 기준: 약 2,800원~4,800원",
    note: "특수부위라 가격 높음",
  },
  "satae-pork": {
    priceText: "100g 기준: 약 1,200원~2,300원",
    note: "찌개용/수육용 차이 있음",
  },

  "deungsim-beef": {
    priceText: "100g 기준: 약 7,000원~15,000원",
    note: "한우/수입 차이 큼",
  },
  "chaekkeut": {
    priceText: "100g 기준: 약 8,000원~16,000원",
    note: "등급 영향 큼",
  },
  "ansim-beef": {
    priceText: "100g 기준: 약 9,000원~18,000원",
    note: "고급 부위",
  },

  "gaseumsal": {
    priceText: "100g 기준: 약 700원~1,600원",
    note: "냉동/대용량 영향 큼",
  },
  "ansim-chicken": {
    priceText: "100g 기준: 약 900원~1,900원",
    note: "손질 상태 영향",
  },
  "dakdari": {
    priceText: "100g 기준: 약 900원~2,100원",
    note: "국산/수입 차이 있음",
  },
};

function getDefaultPriceGuide(meatType: string) {
  if (meatType === "pork") {
    return {
      priceText: "100g 기준: 약 1,500원~3,000원",
      note: "돼지고기 평균 가격 참고용",
    };
  }

  if (meatType === "beef") {
    return {
      priceText: "100g 기준: 약 5,000원~12,000원",
      note: "소고기 평균 가격 참고용",
    };
  }

  return {
    priceText: "100g 기준: 약 700원~2,000원",
    note: "닭고기 평균 가격 참고용",
  };
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  );
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
        </div>

        {/* 첫 화면: 큰 이미지 자리 + 특징 */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* 큰 이미지 자리 */}
          <Card className="overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ImageIcon className="h-4 w-4 text-orange-500" />
                대표 이미지 영역
              </div>

              <div className="flex min-h-[360px] items-center justify-center rounded-[1.5rem] border-2 border-dashed border-orange-200 bg-orange-50/40">
                <div className="text-center">
                  <div className="text-base font-semibold text-slate-800">
                    여기에 {cut.name} 대표 이미지 들어갈 자리
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    나중에 고기 사진 또는 부위 대표 이미지를 넣으면 됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 고기 특징 */}
          <Card className="rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-orange-600">
                  고기 특징
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  {cut.name} 빠르게 보기
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBox title="식감" value={cut.texture} />
                <InfoBox title="풍미" value={cut.flavor} />
                <div className="sm:col-span-2">
                  <InfoBox title="지방감" value={cut.fat} />
                </div>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                <div className="mb-2 text-sm font-semibold text-slate-800">
                  위치
                </div>
                <p className="text-sm leading-6 text-slate-700">{cut.location}</p>
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

        {/* 추천요리 */}
        <div className="mt-6">
          <Card className="rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
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

        {/* 쿠팡 자리 크게 */}
        <div className="mt-6">
          <Card className="rounded-[2rem] border-2 border-dashed border-orange-200 bg-orange-50/40 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <CardContent className="p-8">
              <div className="mb-2 text-sm font-semibold text-orange-600">
                구매 링크 영역
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                나중에 쿠팡 제휴 링크 들어갈 자리
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                추후 제휴 설정 후 이 영역에
                <span className="font-semibold text-slate-900">
                  {" "}
                  “온라인 가격 보기” / “구매하러 가기”
                </span>
                버튼을 크게 넣으면 됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
