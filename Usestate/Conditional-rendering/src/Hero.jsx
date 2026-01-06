export const Hero = ({ currentTab }) => {
    const heroData = {
        "Home": {
            title: "Welcome Home",
            desc: "This is the home hero section."
        },
        "Services": {
            title: "Our Services",
            desc: "We provide awesome services."
        },
        "Contact": {
            title: "Contact Us",
            desc: "Feel free to reach out anytime."
        },
        "About us": {
            title: "About Us",
            desc: "Learn more about who we are."
        },
    };

    const currentHero = heroData[currentTab];
    return (
        <section className="p-6 bg-gray-200 max-w-[95%] m-auto h-[calc(100vh-48px)]">
            <h1 className="text-3xl font-bold">{currentHero.title}</h1>
            <p>{currentHero.desc}</p>
        </section>
    );
};
