import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'data', 'products.json');

const translations = {
  "EXTERIOR WASH ONLY": {
    nameAr: "غسيل خارجي فقط",
    descriptionAr: "غسيل خارجي للسيارة باستخدام الشامبو والشمع والماء. ملاحظة: الشركة توفر الماء والكهرباء.",
    categoryAr: "غسيل سيارات"
  },
  "Basic wash - Sedan": {
    nameAr: "غسيل أساسي - سيدان",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + مسح داخلي للغبار والأوساخ + مناشف ورقية + معطر + كناسة + تغطية الأرضيات + كيس نفايات.",
    categoryAr: "غسيل سيارات"
  },
  "Basic wash - Suv": {
    nameAr: "غسيل أساسي - دفع رباعي",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + مسح داخلي للغبار والأوساخ + مناشف ورقية + معطر + كناسة + تغطية الأرضيات + كيس نفايات.",
    categoryAr: "غسيل سيارات"
  },
  "Shine Wash - Sedan": {
    nameAr: "غسيل لامع - سيدان",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + مسح داخلي للغبار + تلميع الإطارات + مناشف ورقية + منعم + كناسة + تنظيف فتحات المكيف + تنظيف الجنوط + حاويات الأرضيات + كيس نفايات + تلميع المقصورة الأمامية.",
    categoryAr: "غسيل سيارات"
  },
  "Shine Wash - Suv": {
    nameAr: "غسيل لامع - دفع رباعي",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + مسح داخلي للغبار + تلميع الإطارات + مناشف ورقية + منعم + كناسة + تنظيف فتحات المكيف + تنظيف الجنوط + حاويات الأرضيات + كيس نفايات + تلميع المقصورة الأمامية.",
    categoryAr: "غسيل سيارات"
  },
  "Detailing - Sedan": {
    nameAr: "تلميع شامل - سيدان",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + تنظيف داخلي + غسيل المقاعد والأرضيات + كناسة + تنظيف فتحات المكيف + تلميع داخلي + تغطية الأرضيات + أكياس نفايات + إزالة البقع الصعبة.",
    categoryAr: "غسيل سيارات"
  },
  "Detailing - Suv": {
    nameAr: "تلميع شامل - دفع رباعي",
    descriptionAr: "غسيل خارجي بالشامبو والشمع + تنظيف داخلي + غسيل المقاعد والأرضيات + كناسة + تنظيف فتحات المكيف + تلميع داخلي + تغطية الأرضيات + أكياس نفايات + إزالة البقع الصعبة.",
    categoryAr: "غسيل سيارات"
  },
  "Motorcycle Wash": {
    nameAr: "غسيل دراجة نارية",
    descriptionAr: "غسيل بالشامبو والشمع + تلميع الإطارات والجنوط + تنظيف الأضواء.",
    categoryAr: "غسيل سيارات"
  },
  "Boat Wash": {
    nameAr: "غسيل قارب",
    descriptionAr: "خدمة غسيل القوارب. السعر يحدد بعد التنسيق مع الشركة.",
    categoryAr: "غسيل سيارات"
  },
  "Caravan Wash": {
    nameAr: "غسيل كرفان",
    descriptionAr: "خدمة غسيل الكرفانات. السعر يحدد بعد التنسيق مع الشركة.",
    categoryAr: "غسيل سيارات"
  },
  "PROTECTION HALF HOOD (SUV)": {
    nameAr: "حماية نصف غطاء (دفع رباعي)",
    descriptionAr: "حماية هيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "PROTECTION HALF HOOD (SEDAN)": {
    nameAr: "حماية نصف غطاء (سيدان)",
    descriptionAr: "حماية هيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "PROTECTION FULL HOOD (SEDAN)": {
    nameAr: "حماية غطاء كامل (سيدان)",
    descriptionAr: "حماية هيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "PROTECTION FULL HOOD (SUV)": {
    nameAr: "حماية غطاء كامل (دفع رباعي)",
    descriptionAr: "حماية هيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "PROTECTION FULL BODY (SUV)": {
    nameAr: "حماية هيكل كامل (دفع رباعي)",
    descriptionAr: "حماية كاملة لهيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "PROTECTION FULL BODY (SEDAN)": {
    nameAr: "حماية هيكل كامل (سيدان)",
    descriptionAr: "حماية كاملة لهيكل السيارة من COVERGARD. طبقة نانو، ذاتية الإصلاح. ضمان 10 سنوات. تشمل خدمة منزلية.",
    categoryAr: "حماية الطلاء"
  },
  "Xpel XR Plus (SUV)": {
    nameAr: "إكسبيل إكس آر بلس (دفع رباعي)",
    descriptionAr: "عزل حراري من إكسبيل. نسبة عزل 98%. تشمل خدمة منزلية. ضمان 10% على نسبة العزل.",
    categoryAr: "تظليل"
  },
  "Xpel XR Plus (SEDAN)": {
    nameAr: "إكسبيل إكس آر بلس (سيدان)",
    descriptionAr: "عزل حراري من إكسبيل. نسبة عزل 98%. تشمل خدمة منزلية. ضمان 10% على نسبة العزل.",
    categoryAr: "تظليل"
  },
  "(SUV) COVERGARD": {
    nameAr: "كفرجارد (دفع رباعي)",
    descriptionAr: "عزل حراري من كفرجارد. تشمل خدمة منزلية. ضمان 10% على نسبة العزل.",
    categoryAr: "تظليل"
  },
  "(SEDAN) COVERGARD": {
    nameAr: "كفرجارد (سيدان)",
    descriptionAr: "عزل حراري من كفرجارد. تشمل خدمة منزلية. ضمان 10% على نسبة العزل.",
    categoryAr: "تظليل"
  },
  "WIND SHIELD": {
    nameAr: "حماية الزجاج الأمامي",
    descriptionAr: "حماية الزجاج الأمامي من COVERGARD. قوة فائقة، شفاف بالكامل، عزل 99% من الأشعة فوق البنفسجية، متين ضد الرمال والغبار.",
    categoryAr: "حماية الزجاج"
  },
  "RIMS PROTECTION": {
    nameAr: "حماية الجنوط",
    descriptionAr: "حماية الجنوط من ALLOYGATOR. خدمة تركيب في المنزل. متوفر بعدة ألوان.",
    categoryAr: "حماية الجنوط"
  },
  "CHECK AND COMPARE": {
    nameAr: "فحص ومقارنة",
    descriptionAr: "خدمة فحص وقياس السيارة. يتم تحديد الأضرار والإصلاحات اللازمة.",
    categoryAr: "ورشة هيكل"
  },
  "CAR RIM PAINTING (REMOVABLE)": {
    nameAr: "دهان جنوط (قابل للإزالة)",
    descriptionAr: "دهان جنوط قابل للإزالة من STANDOX. ضمان 5 سنوات.",
    categoryAr: "ورشة هيكل"
  },
  "CAR RIM PAINTING (PERMANENT)": {
    nameAr: "دهان جنوط (دائم)",
    descriptionAr: "دهان جنوط دائم من STANDOX. ضمان 5 سنوات.",
    categoryAr: "ورشة هيكل"
  },
  "PERMANENT FULL BLACKOUT DYE": {
    nameAr: "دهان أسود كامل دائم",
    descriptionAr: "دهان أسود كامل دائم من STANDOX. ضمان 5 سنوات.",
    categoryAr: "ورشة هيكل"
  },
  "FULL CAR BLACKOUT REMOVABLE PAINT": {
    nameAr: "دهان أسود كامل قابل للإزالة",
    descriptionAr: "دهان أسود كامل قابل للإزالة من STANDOX. ضمان 5 سنوات.",
    categoryAr: "ورشة هيكل"
  },
  "CAR CALIPER PAINTING": {
    nameAr: "دهان كاليبر الفرامل",
    descriptionAr: "دهان كاليبر الفرامل من STANDOX. ضمان 5 سنوات.",
    categoryAr: "ورشة هيكل"
  },
  "REMOVE OLD WIND SHIELD": {
    nameAr: "إزالة الزجاج الأمامي القديم",
    descriptionAr: "خدمة إزالة الزجاج الأمامي القديم.",
    categoryAr: "أخرى"
  }
};

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

if (!Array.isArray(data)) {
  console.error('Expected data/products.json to be an array');
  process.exit(1);
}

let updatedCount = 0;
let notFound = [];

for (const product of data) {
  const t = translations[product.name];
  if (t) {
    product.nameAr = t.nameAr;
    product.descriptionAr = t.descriptionAr;
    product.categoryAr = t.categoryAr;
    updatedCount++;
  } else {
    notFound.push(product.name);
  }
}

writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✅ Updated ${updatedCount} products with Arabic translations.`);

if (notFound.length > 0) {
  console.log(`⚠️  ${notFound.length} products not found in translation map:`);
  notFound.forEach(n => console.log(`   - ${n}`));
}
