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

// ✅ 오류 안나게 전부 따옴표 처리된 버전
const priceGuideBySlug: Record<
  string,
  { priceText: string; note: string }
> = {
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
      note: "돼지고기 평균 가격",
    };
  }
  if (meatType === "beef") {
    return {
      priceText: "100g 기준: 약 5,000원~12,000원",
      note: "소고기 평균 가격",
    };
  }
  return {
    priceText: "100g 기준: 약 700원~2,000원",
    note: "닭고기 평균 가격",
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
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-[1000px] px-4 py-8">

        {/* 뒤로가기 */}
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </Link>

        {/* 한줄 요약 */}
        <div className="mb-6 p-5 border rounded-xl bg-orange-50">
          <h1 className="text-2xl font-bold mb-2">{cut.name}</h1>
          <p>{cut.shortDescription}</p>
        </div>

        {/* 이미지 + 특징 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <img src={cut.locationImage} className="rounded-xl border" />
          <img src={cut.meatImage} className="rounded-xl border" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3 border rounded-xl">
            <div>식감</div>
            <div className="font-bold">{cut.texture}</div>
          </div>
          <div className="p-3 border rounded-xl">
            <div>풍미</div>
            <div className="font-bold">{cut.flavor}</div>
          </div>
          <div className="p-3 border rounded-xl">
            <div>지방</div>
            <div className="font-bold">{cut.fat}</div>
          </div>
        </div>

        {/* 추천요리 */}
        <div className="mb-6">
          <div className="font-bold mb-2">추천 요리</div>
          {cut.cooking.map((c) => (
            <Badge key={c} className="mr-2">{c}</Badge>
          ))}
        </div>

        {/* 가격 */}
        <div className="mb-6 p-4 border rounded-xl">
          <div className="font-bold mb-2">가격 참고</div>
          <div>{priceGuide.priceText}</div>
          <div className="text-sm text-gray-500">{priceGuide.note}</div>
        </div>

        {/* 쿠팡 자리 */}
        <div className="mb-6 p-5 border border-dashed rounded-xl">
          👉 여기에 쿠팡 링크 들어갈 예정
        </div>

        {/* 비슷한 부위 */}
        <div>
          <div className="font-bold mb-3">비슷한 부위</div>
          <div className="grid md:grid-cols-3 gap-3">
            {relatedCuts.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/cuts/${item.slug}`}>
                <div className="p-3 border rounded-xl hover:bg-gray-50">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
