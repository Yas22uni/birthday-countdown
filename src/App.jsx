import React, { useState, useEffect, useRef } from 'react';

// ۱. تنظیمات اصلی
const BIRTH_MONTH = 6; // جولای
const BIRTH_DAY = 27;

// ۲. لیست پیام‌های اختصاصی
const dailyMessages = [
  { date: '2026-07-27', message: 'تولدت مبارک عشق من! ✨❤️', songUrl: '/songs/birthday.mp3' },
  { date: '2026-07-26', message: 'فقط یک روز تا دیدن لبخند تولدت مونده... 🌹', songUrl: '/songs/day10.mp3' },
  { date: '2026-07-25', message: 'تعداد روزها کم میشه و قلب من پرپر می‌زنه... 💓', songUrl: '/songs/day9.mp3' },
  { date: '2026-07-24', message: 'هر روز که می‌گذره، هیجان من برای جشن گرفتن با تو بیشتر میشه موش. ✨', songUrl: '/songs/day8.mp3' },
  { date: '2026-07-23', message: 'تو زیباترین بلایی هستی که توی زندگیم افتاده بلاچک. ❤️', songUrl: '/songs/day7.mp3' },
  { date: '2026-07-22', message: 'منتظر روزی هستم که تو به دنیا تا یه روز معنی زندگی ازت بفهمم. 🌟', songUrl: '/songs/day6.mp3' },
  { date: '2026-07-21', message: 'بودن با تو، بهترین بخش از زندگی بوده. 🌸', songUrl: '/songs/day5.mp3' },
  { date: '2026-07-20', message: 'تو بی دینم میکنی من اسیر توام و این قشنگ ترین نوع اسارته. 💞', songUrl: '/songs/day4.mp3' },
  { date: '2026-07-19', message: 'تو تنها کسی هستی که می‌تونه با یه لبخند، تمام خستگی‌های روحم رو از بین ببره. 😊', songUrl: '/songs/day3.mp3' },
  { date: '2026-07-18', message: 'دیگه هیچ وقت نگو منتظر تولدت نیستم که من هر روز لحظه شماری میکنمم', songUrl: '/songs/day2.mp3' },
  { date: '2026-07-17', message: 'شروع شمارش معکوس برای عزیزترین روز سال... ⏳', songUrl: '/songs/day1.mp3' },
];

// ۳. پیام پیش‌فرض
const DEFAULT_MESSAGE = {
  message: "امروزم یه روز قشنگ دیگه مثل خود تو... ✨",
  songUrl: '/songs/song.mp3'
};

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentContent, setCurrentContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // الف: محاسبه شمارش معکوس
    const getNextBirthday = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let target = new Date(currentYear, BIRTH_MONTH, BIRTH_DAY);
      if (now > target) {
        target = new Date(currentYear + 1, BIRTH_MONTH, BIRTH_DAY);
      }
      return target;
    };

    const target = getNextBirthday();
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    // ب: پیدا کردن پیام امروز با استفاده از زمان محلی (Local Time)
    const getLocalISOString = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalISOString();
    console.log("Detected Local Date:", todayStr); // برای تست در کنسول

    const content = dailyMessages.find(item => item.date === todayStr) || DEFAULT_MESSAGE;
    setCurrentContent(content);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex flex-col items-center justify-center p-4 font-sans text-white">
      
      {/* بخش شمارش معکوس */}
      <div className="mb-10 text-center">
        <h2 className="text-xl font-light tracking-widest uppercase mb-4 opacity-80">
          {timeLeft.days > 0 ? "Countdown to your Birthday my Aurora" : "Happy Birthday! 🎉"}
        </h2>
        <div className="flex gap-4 text-center">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>

      {/* کارت پیام */}
      {currentContent && (
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl text-center transition-all duration-500">
          <h1 className="text-sm font-medium tracking-[0.2em] uppercase mb-6 opacity-60">Daily Message</h1>
          
          <p className="text-2xl font-light leading-relaxed mb-10 italic">
            "{currentContent.message}"
          </p>

          <button 
            onClick={togglePlay}
            className="group relative flex items-center justify-center mx-auto w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
          >
            <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <p className="mt-4 text-xs opacity-40">Tap to play music</p>

          <audio ref={audioRef} src={currentContent.songUrl} />
        </div>
      )}
    </div>
  );
}

// کامپوننت کمکی برای نمایش واحد زمان
const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col">
    <span className="text-4xl font-bold">{value}</span>
    <span className="text-[10px] uppercase tracking-tighter opacity-50">{label}</span>
  </div>
);

export default App;