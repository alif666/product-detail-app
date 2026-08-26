import {Header} from "@/components/Header";
import {Pagination} from "@/components/Pagination";
import {ProductGrid} from "@/components/ProductGrid";
import {getProducts} from "@/lib/data";

type Props = { searchParams: Promise<{ page?: string }> };
export default async function Home({searchParams}: Props) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = 12;
    const data = await getProducts((page - 1) * limit, limit);
    const totalPages = Math.max(1, Math.ceil(data.count / limit));
    return <><Header/>
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 lg:px-8">
            <section
                className="mb-12 grid gap-8 overflow-hidden rounded-3xl bg-[#fff1f1] px-7 py-10 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div><p className="mb-4 text-sm font-extrabold uppercase tracking-[0.25em] text-[#ec1c24]">Walton
                    Plaza</p><h1
                    className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Better
                    living, <span className="text-[#ec1c24]">made simple.</span></h1><p
                    className="mt-5 max-w-xl text-base leading-7 text-slate-600">Discover dependable home appliances
                    designed for modern Bangladesh. Genuine products, thoughtful features, and service you can
                    trust.</p><a href="#products"
                                 className="mt-7 inline-flex rounded-xl bg-[#ec1c24] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700">Explore
                    products <span className="ml-2">→</span></a></div>
                <div
                    className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-full bg-white/70 text-center shadow-inner">
                    <div><span className="text-7xl">❄️</span><p
                        className="mt-4 text-sm font-bold text-slate-500">Comfort for every home</p></div>
                </div>
            </section>
            <div id="products" className="mb-6 flex items-end justify-between">
                <div><p className="text-sm font-bold uppercase tracking-widest text-[#ec1c24]">Shop collection</p><h2
                    className="mt-1 text-3xl font-black text-slate-950">Featured products</h2></div>
                <span className="hidden text-sm text-slate-500 sm:block">{data.count.toLocaleString()} products available</span>
            </div>
            {data.error ?
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{data.error}</div> : <>
                    <ProductGrid products={data.products}/><Pagination page={page} totalPages={totalPages}/></>}</main>
        <footer id="why-us"
                className="border-t border-slate-200 bg-slate-950 px-5 py-10 text-center text-sm text-slate-400">Walton
            Plaza · Built for better living
        </footer>
    </>;
}
