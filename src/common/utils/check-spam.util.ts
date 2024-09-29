const farsiSpamWords: string[] = [
  'شماره 1',
  'عمل کن',
  'درآمد اضافی',
  'مقرون به صرفه',
  'کاملا طبیعی',
  'جدید',
  'حیرت زده',
  'همین حالا اقدام کنید',
  'متحیر شوید',
  'رئیس خودت',
  'ذینفع',
  'صورتحساب',
  'بیلیون',
  'جایزه',
  'خرید',
  'تماس رایگان',
  'لغو',
  'پول نقد',
  'کازینو',
  'مجاز ارزان',
  'اینجا کلیک کنید',
  'ترخیص کالا از گمرک',
  'جمع کن',
  'مقایسه نرخ ها',
  'تبریک می گویم',
  'کارت اعتباری',
  'ارائه می دهد',
  'درمان می کند',
  'معامله',
  'دوست عزیز',
  'بدهی',
  'تخفیف',
  'ایمیل مستقیم',
  'حذف نکنید',
  'تردید کنید',
  'درآمد خود را دو برابر کنید',
  'بدست آوردن',
  'اضافی',
  'منقضی شود',
  'خارق العاده',
  'دسترسی رایگان',
  'هدیه',
  'آزادی',
  'اکنون آن را دریافت کنید',
  'آغاز شده',
  'پرداخت شده',
  'ضمانت',
  'درآمد',
  'افزایش فروش',
  'فوری',
  'سرمایه گذاری',
  'جنس اوراق و شکسته',
  'محدود',
  'از دست دادن',
  'پایین ترین قیمت',
  'لوکس',
  'دلار بدست آورید',
  'دارو',
  'بدون اعتبار چک',
  'تجربه',
  'تعهد',
  'پیشنهاد',
  'فقط',
  'باز کن',
  'اکنون سفارش دهید',
  'لطفا',
  'در حال حاضر',
  'وعده',
  'نقل قول',
  'نرخ ها',
  'سرمایه گذاری مجدد',
  'بازپرداخت',
  'برداشتن',
  'درخواست',
  'بی خطر',
  'حراجی',
  'رضایت',
  'صرفه جویی',
  'جدی',
  'هرزنامه ها',
  'موفقیت',
  'تدارکات',
  'اقدام به',
  'مقررات',
  'آزمایش',
  'نامحدود',
  'وزن',
  'در حالی که',
  'تدارکات',
  'آخر',
  'پیروزی',
  'برنده',
  'بهترین ',
  'معتبر ترین',
  'ویژه ',
  'مهم',
  'درآمد ',
  'کسب وکار',
  'مدت محدود',
  'پیشنهاد عالی',
  'تعطلل نکنید',
  'همین حالا',
  'تضمینی',
  'تبریک',
  'رایگان',
  'هدیه رایگان',
  'سهمیه رایگان',
  'مشاوره رایگان',
  'برنده اید',
  'قانونی',
  'هزاران',
  'میلیون',
  'میلیارد',
  'استثنایی',
  'کاهش وزن',
  'افزایش قد',
  'هورمون',
  'کاشت مو',
  'چین و چروک',
  'رفع سفیدی',
  'بیمه عمر',
  'لینک زیر',
  'فرم زیر',
  'کلیک',
  'عزیر',
  'هرگز',
  'معجزه',
  'شانس',
  'فرصت',
  'موقعیت',
  'سود',
  'وام',
  'کمترین',
  'بیشترین',
  'بهترین',
  'سود خالص',
  'بدون بهره',
  'پولدار',
  'ویژه',
  'بی نظیر',
  'شرط بندی',
  'کلیک کنید',
  'گرین کارت',
  'سلام عزیز',
  'بی صبرانه',
  'هدایای ویژه',
  'فراموش نکنید',
  'فرصت دارید',
  'تخفیف ویژه',
  'هشدار',
  'جنسی',
  'ارزانترین',
  'گرانترین',
  'پیشنهاد بزرگ',
  'خرید فوری',
  'همین الان',
  'معامله فوق العاده',
  'آفر رایگان',
  'قول می دهم',
  'فقط ریال',
  'لطفا بخوانید',
  'بدون ریسک',
  'بی درد سر',
  'پس انداز رایگان',
  'سهام',
  'بورس',
  'این یک اسپم نیست',
  'استرداد رایگان',
  'قیمت رقابتی',
  'پهنای باند رایگان',
  'هر چیزی',
  'استخدام',
  'بهترین کیفیت',
  'مجانی',
  'لاغری سریع',
  'سرعت فوق العاده',
  'چاقی در کمترین زمان',
  'خرید عالی',
  'کمیاب',
  'فروش',
  'خاص',
  'ویلا',
  'خریدار',
  'مهلت',
  'هدیه',
  'هوشمندانه',
  'تخفیف',
  'اقساط',
  'نتیجه',
  'ویژه',
  'هیجان انگیز',
  'کالا',
  'رضایت',
  'بهره مندی',
  'جشنواره',
  'فصل',
  'استقبال',
  'فصلی',
  'رایگان ',
  'برنده ',
  'هموطن',
  'شگفت انگیز',
  'گرامی',
  'دریافت',
  'پیامک',
  'پروژه ',
  'سقف',
  'سفر',
  'اهدا',
  'واریز',
  'طرح',
  'تعویض',
  'درگاه',
  'ثبت نام',
  'بازار',
  'تایید',
  'تحصیلی',
  'تسهیلات',
  'سند',
  'تراکنش',
  'ماهیانه',
  'مشتری',
  'خدمات ',
  'ایمن',
  'منزل',
  'درصد',
  'دلچسب',
  'خالص',
  'مردمی',
  'حمایت',
  'تمام',
  'اتمام',
  'پایانی',
  'تاریخ',
  'بلیط',
  'ناب',
  'تور',
  'آرام',
  'همین الان عمل کن',
  'اکنون تماس  بگیر',
  'اینجا را کلیک کنید',
  'ترخیص',
  'منقضی می شود',
  'معامله انحصاری',
  'به شدت کاهش می یابد',
  'خرید کنید',
  'خرید مستقیم',
  'اکنون ان را دریافت کنید',
  'زمان محدود',
  'فقط مشتریان جدید',
  'اکنون شروع کنید',
  'اکنون فقط',
  'تبلیغ ویژه',
  'اقدام کنید',
  'هم اکنون سفارش دهید',
  'در حالی که سهام ادامه دارد',
  'اکنون اقدام کنید',
  'کاملا جدید',
  'بهترین قیمت',
  'دوره آموزشی رایگان',
  'معامله باورنکردنی',
  'برای دسترسی فوری',
  'رضایت تضمین شده',
  'اطلاعات رایگان',
  'پول بلاعوض',
  'عضویت رایگان',
  'بدون صید',
  'بدون محدودیت سنی',
  'خریدی لازم نیست',
  'بدون تعهد',
  'بدون تجربه',
  'فرصت ',
  'پس انداز بزرگ',
  'به مایون ها نفر بپیوندید',
  'از بدهی خارج شوید',
  'منقضی شدن پیشنهاد',
  'یک بار در طول زندگی',
  'لطفا مطالعه کنید',
  'اقدام به',
  'این دوام نخواهد داشت',
  'در حالی که سهام آخرین است',
  'چانه زدن',
  'بازاریابی ایمیلی',
  'امتحان رایگان',
  'آیا شما رد شده است؟',
  'به میلیونها آمریکایی بپیوندید',
  'چشمانت را باور نخواهد کرد',
  'درخواست آنلاین',
  'زنگ زدن',
  'الان تماس بگیر',
  'امروز این کار را بکن',
  'منقضی',
  'در حال حاضر آغاز شده است',
  'اطلاعات مهم در مورد',
  'فقط الان',
  'دوره آزمایشی رایگان',
  'رضایت تضمینی',
  'امروز سفارش دهید',
  'بازاریابی مستقیم',
  'وب سایت ما را مشاهده کنید',
  'ارزان',
  'کارت پذیرفته می شود',
  'کارت تخفیف',
  'گواهی رایگان',
  'روی لینک کلیک کنید',
  'دیجی برند',
  'ایمیل عزیز',
  'خرید انلاین',
  'خرید رایگان',
  'دانلود رایگان',
  'توجه توجه',
  'درآمد روزانه',
  'افزایش درآمد',
  'پوکر',
  'هکر',
  'قمار',
  'سایت بت',
  'بت سایت',
  'سی دی رایگان',
  'برای شما ارزان شد',
  'ارزان بخرید',
  'از سایت ما دیدن کنید',
  'تخفیف 50 درصدی',
  'امروز ارزان بخرید',
  'ارزان فروشی',
  'فروش ویژه',
  'ایرانسل',
  'همراه اول',
  'خرید آنلاین',
  'تماس بگیرید',
  'امروز این کار را انجام دهید',
  'لاتاری',
  'قرعه کشی',
  'محرمانه',
  'برهنه',
  'خبرنامه',
  'فروشگاه',
  'سفارش',
  'دعوت',
  'درآمد زیاد',
  'ویزا',
  'ادامه تحصیل',
  'مجله',
  'توجه',
  'فوق العاده',
  'حراج',
  'مشتری گرامی',
  'تصاویر',
  'شگفت انگیز',
  'شگفتانه',
  'ارسال رایگان',
  'اینترنت رایگان',
  'شارژ رایگان',
  'اسنپ',
  'خاله',
  '100 درصد',
  'آسان',
  'هیجان انگیز',
  'فروش فوق العاده',
  'کسب درآمد',
  'عضویت',
  'سفارش دهید',
  'میلیونرشو',
  'پولدار شو',
  'کاهش هزینه',
  'امتحان کنید',
  'پیشنهاد اختصاصی',
  'هیجان ',
  'انتخاب',
  'پرفروش ترین',
  'پرطرفدارترین',
  'جادویی',
  'رویایی',
  'سریع',
  'مقایسه کنید',
  'تو برنده ای',
  'مشهور',
];

export function containsSpam(text: string): boolean {
  return farsiSpamWords.some((spamWord) => text.includes(spamWord));
}
