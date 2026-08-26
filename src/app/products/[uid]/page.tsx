import {Header} from "@/components/Header";
import {ProductDetails} from "@/components/ProductDetails";
import {getProduct} from "@/lib/data";

export default async function ProductPage({params}: { params: Promise<{ uid: string }> }) {
    const {uid} = await params;
    const data = await getProduct(uid);
    return <><Header/>
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 lg:px-8">{data.product ?
            <ProductDetails product={data.product}/> : <div
                className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{data.error ?? "Product not found."}</div>}</main>
    </>;
}
