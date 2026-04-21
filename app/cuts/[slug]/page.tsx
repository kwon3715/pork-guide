import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ChefHat,
  ArrowRight,
  Sparkles,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 text-slate-900">
      <section className="mx-auto max-w-[1000px] px-4 py-8">

        {/* 뒤로가기 */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Button>
          </Link>
        </div>

        {/* 1️⃣ 한줄 결론 */}
        <div className="mb-6 rounded-3xl border border-orange-200 bg-orange-50 p-6">
          <div className="mb-2 flex items-center gap-2 text-orange-600 font-semibold">
            <Sparkles className="h-4 w-4" />
            한줄 요약
          </div>

          <h1 className="text-3xl font-bold">
            {cut.name} → {cut.shortDescription}
          </h1>
        </div>

        {/* 2️⃣ 이미지 */}
        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <div className="rounded-2xl overflow-hidden border">
            <img src={cut.locationImage} />
          </div>
          <div className="rounded-2xl overflow-hidden border">
            <img src={cut.meatImage} />
          </div>
        </div>

        {/* 3️⃣ 핵심 특징 */}
        <div className="grid gap-4 mb-6 grid-cols-3 text-center">
          <div className="p-4 rounded-2xl bg-white border">
            <div className="text-sm text-slate-500">식감</div>
            <div className="font-bold">{cut.texture}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border">
            <div className="text-sm text-slate-500">풍미</div>
            <div className="font-bold">{cut.flavor}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border">
            <div className="text-sm text-slate-500">지방</div>
            <div className="font-bold">{cut.fat}</div>
          </div>
        </div>

        {/* 4️⃣ 추천 요리 */}
        <div className="mb-6 rounded-2xl border p-4">
          <div className="mb-3 font-semibold flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-orange-500" />
            추천 요리
          </div>

          <div className="flex flex-wrap gap-2">
            {cut.cooking.map((item) => (
              <Badge key={item} className="rounded-full">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* 5️⃣ 선택 팁 */}
        <div className="mb-6 rounded-2xl border p-4">
          <div className="mb-3 font-semibold">이럴 때 선택</div>

          <div className="space-y-2">
            {cut.tips.slice(0, 3).map((tip) => (
              <div key={tip} className="text-sm bg-slate-50 p-3 rounded-xl">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* 6️⃣ 비슷한 부위 */}
        <div className="rounded-2xl border p-4">
          <div className="mb-4 font-semibold">비슷한 부위</div>

          <div className="grid gap-3 md:grid-cols-3">
            {relatedCuts.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/cuts/${item.slug}`}>
                <div className="p-4 border rounded-xl hover:bg-orange-50">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-slate-500">
                    {item.shortDescription}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
