import { useState } from "react";
import { ReferenceFaithfulIntro } from "./ReferenceIntro";

export default function App() {
  const [showSite, setShowSite] = useState(false);

  if (showSite) {
    return (
      <main className="demo-site" aria-label="Main invitation demo">
        <section className="demo-site__inner">
          <p className="demo-site__eyebrow">THE INVITATION CONTINUES</p>
          <h1>خالد & ندى</h1>
          <p>هنا تضع محتوى موقع دعوة الزواج الفعلي كما هو.</p>
          <button type="button" onClick={() => setShowSite(false)}>
            تشغيل المقدمة مرة أخرى
          </button>
        </section>
      </main>
    );
  }

  return (
    <ReferenceFaithfulIntro
      onReveal={() => setShowSite(true)}
    />
  );
}
