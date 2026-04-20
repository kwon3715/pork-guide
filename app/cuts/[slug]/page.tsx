import Link from "next/link";
import { notFound } from "next/navigation";
import { porkCuts } from "@/data/porkCuts";

export function generateStaticParams() {
  return porkCuts.map((cut) => ({
    slug: cut.slug,
  }));
}

export default function CutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const cut = porkCuts.find((item) => item.slug === params.slug);

  if (!cut) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← 메인으로 돌아가기
        </Link>
      </div>

      <section className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {cut.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mb-3 text-3xl font-bold">{cut.name}</h1>
        <p className="text-lg text-gray-700">{cut.shortDescription}</p>
      </section>

      <section className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">부위 위치</h2>
          <div className="mb-4 overflow-hidden rounded-xl border bg-gray-50">
            <img
              src={cut.locationImage}
              alt={`${cut.name} 위치 이미지`}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="text-gray-700">{cut.location}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">실제 고기 사진</h2>
          <div className="mb-4 overflow-hidden rounded-xl border bg-gray-50">
            <img
              src={cut.meatImage}
              alt={`${cut.name} 실제 고기 사진`}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="text-gray-700">
            마트나 정육점에서 실제로 볼 때의 느낌을 참고하기 위한 이미지 영역
          </p>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">부위별 종류 정보</h2>
        <ul className="space-y-3 text-gray-700">
          {cut.variants.map((item) => (
            <li key={item} className="rounded-xl bg-gray-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">맛 / 식감 / 특징</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">식감</p>
            <p className="mt-1 font-medium">{cut.texture}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">풍미</p>
            <p className="mt-1 font-medium">{cut.flavor}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">지방감</p>
            <p className="mt-1 font-medium">{cut.fat}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">대중성</p>
            <p className="mt-1 font-medium">{cut.popularity}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
            <p className="text-sm text-gray-500">초보 추천 여부</p>
            <p className="mt-1 font-medium">{cut.beginner}</p>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">추천 요리</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {cut.cooking.map((item) => (
            <span
              key={item}
              className="rounded-full border px-3 py-2 text-sm"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-gray-700">{cut.cookingNote}</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">구매 팁</h2>
        <ul className="space-y-3 text-gray-700">
          {cut.tips.map((tip) => (
            <li key={tip} className="rounded-xl bg-gray-50 px-4 py-3">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
