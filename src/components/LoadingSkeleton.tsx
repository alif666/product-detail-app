function SkeletonBlock({className = ""}: { className?: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200 ${className}`}/>;
}

function SkeletonHeader() {
    return <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
            <div className="flex items-center gap-2"><SkeletonBlock className="size-10 rounded-xl"/><SkeletonBlock className="h-6 w-36"/></div>
            <SkeletonBlock className="hidden h-10 w-full max-w-md lg:block"/>
            <div className="hidden items-center gap-7 md:flex"><SkeletonBlock className="h-4 w-24"/><SkeletonBlock className="h-4 w-20"/></div>
            <SkeletonBlock className="h-10 w-20 rounded-xl"/>
        </div>
    </header>;
}

function ProductCardSkeleton() {
    return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
        <SkeletonBlock className="aspect-[4/3] w-full"/>
        <SkeletonBlock className="mt-4 h-4 w-11/12"/>
        <SkeletonBlock className="mt-2 h-4 w-2/3"/>
        <SkeletonBlock className="mt-3 h-5 w-1/3"/>
        <SkeletonBlock className="mt-3 h-3 w-1/4"/>
    </div>;
}

export function ProductListingSkeleton() {
    return <div role="status" aria-label="Loading products" className="min-h-screen bg-[#f6f9fb]">
        <SkeletonHeader/>
        <main className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8">
            <section className="mb-12 grid gap-8 rounded-3xl bg-[#dff5f8] px-7 py-10 sm:px-12 lg:grid-cols-[1.2fr_0.8fr]">
                <div><SkeletonBlock className="mb-4 h-4 w-32"/><SkeletonBlock className="h-14 w-full max-w-xl"/><SkeletonBlock className="mt-5 h-5 w-full max-w-lg"/><SkeletonBlock className="mt-2 h-5 w-4/5 max-w-lg"/><SkeletonBlock className="mt-7 h-12 w-40 rounded-xl"/></div>
                <SkeletonBlock className="mx-auto aspect-square w-full max-w-sm rounded-2xl"/>
            </section>
            <div className="mb-6 flex items-end justify-between gap-4"><div><SkeletonBlock className="h-4 w-32"/><SkeletonBlock className="mt-2 h-9 w-64"/></div><SkeletonBlock className="h-9 w-36"/></div>
            <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"><SkeletonBlock className="h-11"/><SkeletonBlock className="h-11"/><SkeletonBlock className="h-11"/><SkeletonBlock className="h-11"/></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({length: 12}, (_, index) => <ProductCardSkeleton key={index}/>)}</div>
        </main>
        <span className="sr-only">Loading products...</span>
    </div>;
}

export function ProductSectionSkeleton() {
    return <div role="status" aria-label="Loading products" className="min-h-[32rem]">
        <div className="mb-6 flex justify-end">
            <SkeletonBlock className="h-9 w-36"/>
        </div>
        <div className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonBlock className="h-11"/>
            <SkeletonBlock className="h-11"/>
            <SkeletonBlock className="h-11"/>
            <SkeletonBlock className="h-11"/>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({length: 12}, (_, index) => <ProductCardSkeleton key={index}/>)}
        </div>
        <span className="sr-only">Loading products...</span>
    </div>;
}

export function ProductDetailSkeleton() {
    return <div role="status" aria-label="Loading product details" className="min-h-screen bg-[#f6f9fb]">
        <SkeletonHeader/>
        <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
            <SkeletonBlock className="mb-6 h-5 w-32"/>
            <div className="grid gap-10 lg:grid-cols-2">
                <SkeletonBlock className="aspect-square w-full rounded-3xl"/>
                <div><SkeletonBlock className="h-4 w-56"/><SkeletonBlock className="mt-4 h-12 w-full"/><SkeletonBlock className="mt-2 h-12 w-4/5"/><SkeletonBlock className="mt-8 h-10 w-48"/><div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><SkeletonBlock className="h-4 w-32"/><SkeletonBlock className="mt-4 h-10 w-24"/><SkeletonBlock className="mt-5 h-4 w-40"/><SkeletonBlock className="mt-5 h-12 w-full rounded-xl"/></div></div>
            </div>
            <div className="mt-16"><div className="flex gap-8 border-b border-slate-200 pb-3"><SkeletonBlock className="h-4 w-28"/><SkeletonBlock className="h-4 w-32"/><SkeletonBlock className="h-4 w-28"/></div><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8"><SkeletonBlock className="h-4 w-1/3"/><SkeletonBlock className="mt-5 h-4 w-full"/><SkeletonBlock className="mt-2 h-4 w-4/5"/></div></div>
        </main>
        <span className="sr-only">Loading product details...</span>
    </div>;
}
