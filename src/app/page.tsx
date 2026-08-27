import {Header} from "@/components/Header";
import {Pagination} from "@/components/Pagination";
import {ProductGrid} from "@/components/ProductGrid";
import {getProducts} from "@/lib/data";
import {SparklesIcon} from "@/components/Icons";
import {PageSizeSelect} from "@/components/PageSizeSelect";
import {DEFAULT_PAGE_SIZE, normalizePageSize} from "@/lib/pagination";

type Props = { searchParams: Promise<{ page?: string; limit?: string }> };
export default async function Home({searchParams}: Props) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = normalizePageSize(params.limit ?? String(DEFAULT_PAGE_SIZE));
    const data = await getProducts((page - 1) * limit, limit);
    const totalPages = Math.max(1, Math.ceil(data.count / limit));
    return <><Header/>
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 lg:px-8">
            <section
                className="relative mb-12 grid gap-8 overflow-hidden rounded-3xl bg-[#c8eef5] px-7 py-10 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div><p className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.25em] text-[#1a998d]"><SparklesIcon className="size-4"/>Walton
                    Plaza</p><h1
                    className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Better
                    living, <span className="text-[#cd2027]">made simple.</span></h1><p
                    className="mt-5 max-w-xl text-base leading-7 text-[#233f6c]">Discover dependable home appliances
                    designed for modern Bangladesh. Genuine products, thoughtful features, and service you can
                    trust.</p><a href="#products"
                                 className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#cd2027] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-[#a1191f]">Explore
                    products <span className="ml-2">→</span></a></div>
                <div
                    className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-center shadow-xl">
                    <div><span className="text-7xl">❄️</span><p
                        className="mt-4 text-sm font-bold text-slate-500">Comfort for every home</p></div>
                </div>
            </section>
            <div id="products" className="mb-6 flex items-end justify-between gap-4">
                <div className="flex flex-col items-start"><p className="text-sm font-bold uppercase tracking-widest text-[#1a998d]">Shop collection</p><h2
                    className="mt-1 text-3xl font-black text-[#192d4d]">Featured products</h2></div>
                <div className="flex shrink-0 items-center gap-4"><PageSizeSelect value={limit}/>
                    <span className="hidden text-sm text-slate-500 lg:block">{data.count.toLocaleString()} products available</span>
                </div>
            </div>
            {data.error ?
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{data.error}</div> :
                <>
                    <ProductGrid products={data.products}/><Pagination page={page} totalPages={totalPages} limit={limit}/>
                </>
            }
        </main>
        <footer id="why-us"
                className="border-t border-[#233f6c] bg-[#192d4d] px-5 py-10 text-center text-sm text-slate-300">Walton
            Plaza · Built for better living
        </footer>
    </>;
}
