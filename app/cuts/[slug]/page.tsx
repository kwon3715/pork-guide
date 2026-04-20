import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ChefHat,
  ShoppingBasket,
  ArrowRight,
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff,_#f1f5f9)] text-slate-900">
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
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

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
                <div className="mb-4 flex flex-wrap gap-2">
                  {cut.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="rounded-full border-0 bg-orange-500/20 text-orange-100 hover:bg-orange-500/20"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="mb-3 text-4xl font-black tracking-tight">
                  {cut.name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  {cut.shortDescription}
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">
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
                    <ShoppingBasket className="h-4 w-4 text-orange-500" />
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
                    마트나 정육점에서 볼 때의 느낌을 참고하기 위한 이미지입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-950">
                맛 / 식감 / 특징
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

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">지방감</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.fat}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">대중성</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.popularity}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <div className="text-sm text-slate-500">초보 추천 여부</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {cut.beginner}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">
                부위별 종류 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cut.variants.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-xl text-slate-950">
                  추천 요리
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
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

              <div className="rounded-2xl border border-orange-100 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {cut.cookingNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">
                구매 팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cut.tips.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-orange-100 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">
                비슷한 부위 추천
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatedCuts.slice(0, 4).map((item) => (
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
