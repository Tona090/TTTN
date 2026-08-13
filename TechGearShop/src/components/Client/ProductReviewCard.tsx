import React from 'react';
import { ShieldCheck, ThumbsUp, ThumbsDown, UserCheck, CheckCircle2, AlertTriangle, Gamepad2, Award } from 'lucide-react';
import { parseProductReviewDescription } from '../../utils/productReviewParser';

interface Props {
  description: string;
  productName: string;
}

export const ProductReviewCard: React.FC<Props> = ({ description, productName }) => {
  const review = parseProductReviewDescription(description, productName);

  return (
    <div className="space-y-6">
      {/* 1. One Sentence Verdict */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
          <Award className="w-4 h-4 text-amber-500" />
          <span>ĐÁNH GIÁ TỔNG QUAN (ONE SENTENCE VERDICT)</span>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed italic">
          "{review.verdict}"
        </p>
      </div>

      {/* 2 & 3. Best For vs Not Recommended For */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best For */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>DÀNH CHO AI? (BEST FOR)</span>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {review.bestFor}
          </p>
        </div>

        {/* Not Recommended For */}
        <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>KHÔNG NÊN MUA NẾU (NOT RECOMMENDED FOR)</span>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {review.notRecommendedFor}
          </p>
        </div>
      </div>

      {/* 4. Real Gaming Scenarios */}
      {review.realScenarios && (
        <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
            <Gamepad2 className="w-4 h-4 text-indigo-500" />
            <span>TRẢI NGHIỆM CHƠI GAME THỰC TẾ (REAL GAMING SCENARIOS)</span>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {review.realScenarios}
          </p>
        </div>
      )}

      {/* 5 & 6. Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
            <span>ƯU ĐIỂM NỔI BẬT (PROS)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            {review.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
            <ThumbsDown className="w-4 h-4 text-rose-500" />
            <span>NHƯỢC ĐIỂM CẦN LƯU Ý (CONS)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            {review.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0 font-bold">✕</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Expert Opinion */}
      <div className="p-4.5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-400 tracking-wider">
            <UserCheck className="w-4 h-4 text-orange-400" />
            <span>GÓC NHÌN KỸ THUẬT VIÊN (EXPERT OPINION)</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
            TECHGEAR BUILDER NOTE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal italic">
          "{review.expertOpinion}"
        </p>
      </div>
    </div>
  );
};
