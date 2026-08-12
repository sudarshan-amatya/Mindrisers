import {
    Clock3,
    Headphones,
    Mail,
    MapPin,
    PackageSearch,
    Phone,
    SendHorizontal,
    ShieldCheck,
} from 'lucide-react'
import {
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react'
import Breadcrumbs from '../components/Breadcrumbs'

const STORE_INFO = {
    storeName: 'MyShop',
    phone: '+977 9847881715',
    email: 'support@myshop.com',
    address: 'Basundhara, Kathmandu, Nepal',
    hours: 'Sun - Fri, 9:00 AM - 6:00 PM',
    mapQuery: 'New Baneshwor, Kathmandu, Nepal',
}

const FAQS = [
    {
        question: 'How long does delivery take?',
        answer: 'Delivery time depends on your location and product type. You can show your real delivery estimates here later.',
    },
    {
        question: 'How can I track my order?',
        answer: 'Customers can track orders from their order history or through your order tracking flow once connected.',
    },
    {
        question: 'Can I return a product?',
        answer: 'Yes, eligible products can be returned according to your return policy.',
    },
    {
        question: 'How do I become a seller?',
        answer: 'Use your Become Seller flow and seller registration process from the site.',
    },
]

type FormState = {
    name: string
    email: string
    subject: string
    message: string
}

const initialForm: FormState = {
    name: '',
    email: '',
    subject: '',
    message: '',
}

function Contact() {
    const [form, setForm] = useState<FormState>(initialForm)
    const [errors, setErrors] = useState<Partial<FormState>>({})
    const [submitted, setSubmitted] = useState(false)

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
        | string
        | undefined

    const mapSrc = useMemo(() => {
        if (!apiKey) return ''

        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
            STORE_INFO.mapQuery
        )}`
    }, [apiKey])

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }))
    }

    const validate = () => {
        const nextErrors: Partial<FormState> = {}

        if (!form.name.trim()) nextErrors.name = 'Full name is required.'
        if (!form.email.trim()) {
            nextErrors.email = 'Email is required.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = 'Enter a valid email address.'
        }

        if (!form.subject.trim()) nextErrors.subject = 'Subject is required.'
        if (!form.message.trim()) {
            nextErrors.message = 'Message is required.'
        } else if (form.message.trim().length < 10) {
            nextErrors.message = 'Message should be at least 10 characters.'
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(false)

        if (!validate()) return

        // Frontend-ready form:
        // Later replace this with your real backend API call, for example:
        // await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, form)

        setSubmitted(true)
        setForm(initialForm)
    }

    return (
        <main className="bg-white text-slate-900">
            <Breadcrumbs/>
            <section className="border-b border-slate-200 bg-white">
                <div className="container py-12 md:py-16">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                            Contact us
                        </span>

                        <h1 className="mt-5 text-[clamp(2.2rem,1.8rem+1.8vw,4rem)] font-bold tracking-tight text-slate-950">
                            We’re here to help with orders, products, and support
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                            Keep this page simple, clean, and real. Show your
                            business details, let people send a message, and
                            make it easy to find your location.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <FeaturePill
                                icon={<ShieldCheck size={18} />}
                                text="Trusted support"
                            />
                            <FeaturePill
                                icon={<PackageSearch size={18} />}
                                text="Order help"
                            />
                            <FeaturePill
                                icon={<Headphones size={18} />}
                                text="Fast response"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-10 md:py-14">
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-950">
                                Contact details
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                Replace these with your real business details.
                            </p>

                            <div className="mt-6 space-y-4">
                                <InfoCard
                                    icon={<Phone size={18} />}
                                    title="Phone"
                                    content={STORE_INFO.phone}
                                />
                                <InfoCard
                                    icon={<Mail size={18} />}
                                    title="Email"
                                    content={STORE_INFO.email}
                                />
                                <InfoCard
                                    icon={<MapPin size={18} />}
                                    title="Address"
                                    content={STORE_INFO.address}
                                />
                                <InfoCard
                                    icon={<Clock3 size={18} />}
                                    title="Business hours"
                                    content={STORE_INFO.hours}
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h3 className="text-xl font-semibold text-slate-950">
                                Need help with
                            </h3>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <QuickHelpCard
                                    title="Order support"
                                    text="Questions about tracking, status, or delivery."
                                />
                                <QuickHelpCard
                                    title="Product inquiry"
                                    text="Ask about product details, stock, or pricing."
                                />
                                <QuickHelpCard
                                    title="Returns & refunds"
                                    text="Help with returns, exchanges, and refund process."
                                />
                                <QuickHelpCard
                                    title="Seller support"
                                    text="Support for registration and seller onboarding."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <SendHorizontal size={18} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-950">
                                        Send us a message
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Clean white form for your support page.
                                    </p>
                                </div>
                            </div>

                            {submitted && (
                                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    Message ready. Connect this form to your backend
                                    contact endpoint to save or email submissions.
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 grid gap-5"
                            >
                                <div className="grid gap-5 md:grid-cols-2">
                                    <FormField
                                        label="Full name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        placeholder="Enter your full name"
                                    />

                                    <FormField
                                        label="Email address"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <FormField
                                    label="Subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    error={errors.subject}
                                    placeholder="What do you need help with?"
                                />

                                <TextAreaField
                                    label="Message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    error={errors.message}
                                    placeholder="Write your message here..."
                                />

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-sm leading-6 text-slate-500">
                                        Keep the form short and simple.
                                    </p>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Send message
                                        <SendHorizontal size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h3 className="text-xl font-semibold text-slate-950">
                                    Find us on the map
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Google Maps embed for your store location.
                                </p>
                            </div>

                            {mapSrc ? (
                                <iframe
                                    title="Store location"
                                    src={mapSrc}
                                    width="100%"
                                    height="360"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="flex h-90 items-center justify-center bg-slate-50 px-6 text-center">
                                    <div className="max-w-md">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                            <MapPin size={24} className="text-slate-700" />
                                        </div>
                                        <h4 className="mt-4 text-lg font-semibold text-slate-950">
                                            Add your Google Maps API key
                                        </h4>
                                        <p className="mt-2 text-sm leading-7 text-slate-600">
                                            Create a file named <code>.env</code> and add
                                            <code className="ml-1 rounded bg-white px-2 py-1 ring-1 ring-slate-200">
                                                VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY
                                            </code>
                                        </p>
                                        <p className="mt-3 text-sm text-slate-500">
                                            Current address: {STORE_INFO.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-slate-200 bg-slate-50">
                <div className="container py-10 md:py-14">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-slate-950">
                            Frequently asked questions
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                            Add a few common support answers here so users can get
                            help quickly.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {FAQS.map((faq) => (
                            <div
                                key={faq.question}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h3 className="text-lg font-semibold text-slate-950">
                                    {faq.question}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

function FeaturePill({
    icon,
    text,
}: {
    icon: React.ReactNode
    text: string
}) {
    return (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <span className="text-slate-900">{icon}</span>
            <span>{text}</span>
        </div>
    )
}

function InfoCard({
    icon,
    title,
    content,
}: {
    icon: React.ReactNode
    title: string
    content: string
}) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">{content}</p>
            </div>
        </div>
    )
}

function QuickHelpCard({
    title,
    text,
}: {
    title: string
    text: string
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </div>
    )
}

function FormField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
}: {
    label: string
    name: string
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    error?: string
    placeholder?: string
    type?: string
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-900">
                {label}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    error
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-slate-200 focus:border-slate-400'
                }`}
            />
            {error && (
                <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
            )}
        </label>
    )
}

function TextAreaField({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
}: {
    label: string
    name: string
    value: string
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    error?: string
    placeholder?: string
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-900">
                {label}
            </span>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={6}
                className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                    error
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-slate-200 focus:border-slate-400'
                }`}
            />
            {error && (
                <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
            )}
        </label>
    )
}

export default Contact