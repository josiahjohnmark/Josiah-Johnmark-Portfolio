import React from "react";
import { profile } from "../data/site";
import Magnetic from "./Magnetic";

const EditorialIntro: React.FC = () => {
  return (
    <section className="section bg-cream pt-20 md:pt-28 pb-16 md:pb-24">
      <div className="shell grid lg:grid-cols-12 gap-10 md:gap-14 items-start">
        <div className="lg:col-span-8">
          <h2 className="text-ink text-[clamp(1.85rem,3.8vw,3.5rem)] font-sans font-normal leading-[1.22] tracking-[-0.03em]">
            Helping digital products and brands stand out with craft. Merging game development, system design, and high-fidelity interaction into memorable experiences.
          </h2>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-between gap-10 lg:pl-6">
          <p className="prose-body text-base md:text-lg leading-relaxed text-ink/80">
            {profile.statement}
          </p>

          <div className="pt-2">
            <Magnetic strength={0.4}>
              <a
                href="#about"
                className="btn-curve !w-[155px] !h-[155px] md:!w-[175px] md:!h-[175px] rounded-full !bg-ink !text-white flex items-center justify-center font-sans font-medium text-base shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{ "--fill-bg": "#455CE9" } as React.CSSProperties}
              >
                About me
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialIntro;
