import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;  //动态路由参数，通过这种方式获取。url参数通过searchParams获取

    // const invoice = await fetchInvoiceById(id);
    // const customers = await fetchCustomers();
    const [customers, invoice] = await Promise.all([fetchCustomers(), fetchInvoiceById(id)]);
    console.log('invoice', invoice)
    if (!invoice) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}