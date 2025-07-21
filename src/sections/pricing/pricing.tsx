
import Image from "next/image";
import { twMerge } from "tailwind-merge";


const pricingTiers = [
  {
    title: "Free Features",
    joiningPrice: 0,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Chat Bot Access",
      "Legal News",
      "2 Free Legal Assistantance",
      "Basic support",
    ],
  },
  {
    title: "Premius Features",
    joiningPrice: 20 ,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Chat Bot Access",
      "20 Document Generation",
      "20 Document Editor and Ananlyser",
      "30 Free Legal Assistantance",
      "Basic support",
    ],
  },
  {
    title: "VIP Features",
    joiningPrice: 40,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
     "Chat Bot Access",
      "50 Document Generation",
      "50 Document Editor and Ananlyser",
      "60 Free Legal Assistantance",
      "Basic support",
      
    ],
  },
];

export const Pricing = () => {
  return (
    <>
    <section className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
        <h2 className="section-title ml-30 ">Pricing</h2>
        <p className="section-description mt-5 ml-30">Explore the pricing options and choose the one that suits your needs.

        </p>
        </div>
        <div className="flex flex-col ml-30 gap-7 items-center mt-16 lg:flex-row  lg:items-end lg:justify-center">
      
          {pricingTiers.map(({title , joiningPrice, buttonText, popular, inverse, features}, idx) => (
            <div key={title + idx} className={twMerge("card", inverse === true && 'border-black bg-black text-white/60')}>
              <div className="flex justify-between">
            <h3 className={twMerge("text-lg font-bold text-black/50" ,inverse === true && 'text-white/60')}>{title}</h3>
            {popular ===true &&(
            <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20"><span className="bg-[linear-gradient(to_right,#DD7DDF,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] text-transparent bg-clip-text font-medium">Popular</span></div>
          )}
          </div>
            <div className="flex items-baseline gap-1 mt-[30px]">
              <span className="tetx-6xl font-bold tracking-tighter leading-none">{joiningPrice} $</span>
              <span className="tracking-tight font-bold text-black/50">/Month</span>
            </div>
            <button className={twMerge("btn btn-primary w-full mt-[30px]", inverse === true && 'bg-white text-black')}>{buttonText}</button>
            <ul className="flex flex-col gap-2 mt-8">
              {features.map((feature, featureIdx) => (
                <li key={featureIdx} className="text-sm flex items-center gap-4">
                  <Image src="/check.svg" alt="check" width={20} height={20} />
                  <span>{feature}</span></li>
              ))}
            </ul>
          </div>
        ))}
    
        </div>
      </div>
    </section>
    </>
  );
};