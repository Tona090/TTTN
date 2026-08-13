export interface ParsedProductReview {
  verdict: string;
  bestFor: string;
  notRecommendedFor: string;
  realScenarios: string;
  pros: string[];
  cons: string[];
  expertOpinion: string;
}

export function parseProductReviewDescription(description: string, productName: string): ParsedProductReview {
  if (!description) {
    return {
      verdict: `${productName} mang lại hiệu năng ổn định, được đội ngũ kỹ thuật TechGear kiểm định về độ bền và tính ứng dụng thực tế.`,
      bestFor: 'Game thủ và người dùng làm việc chuyên nghiệp cần sản phẩm chính hãng bền bỉ.',
      notRecommendedFor: 'Người dùng có nhu cầu đặc thù vượt ngoài phân khúc thiết kế của sản phẩm.',
      realScenarios: 'Đáp ứng tốt các tác vụ giải trí hàng ngày, thi đấu game và xử lý công việc mượt mà.',
      pros: [
        'Chất lượng hoàn thiện chắc chắn, linh kiện chọn lọc',
        'Đã qua kiểm định nhiệt độ & hiệu năng thực tế tại TechGear',
        'Bảo hành chính hãng 1 đổi 1 tận tâm'
      ],
      cons: [
        'Cần chọn đúng phiên bản cấu hình phù hợp nhu cầu'
      ],
      expertOpinion: `${productName} là lựa chọn đáng tin cậy trong tầm giá, đáp ứng đúng nhu cầu người dùng thực tế mà không màu màng hay quảng cáo thừa.`
    };
  }

  // Regex extractors for structured markdown
  const verdictMatch = description.match(/\*\*Verdict:\*\*\s*([^\n]+)/i);
  const bestForMatch = description.match(/\*\*Best for:\*\*\s*([\s\S]*?)(?=\*\*Not recommended for:|\*\*Real gaming|\*\*Pros:|$)/i);
  const notRecMatch = description.match(/\*\*Not recommended for:\*\*\s*([\s\S]*?)(?=\*\*Real gaming|\*\*Pros:|\*\*Cons:|$)/i);
  const realScenariosMatch = description.match(/\*\*Real gaming scenarios:\*\*\s*([\s\S]*?)(?=\*\*Pros:|\*\*Cons:|\*\*Expert opinion:|$)/i);
  const prosMatch = description.match(/\*\*Pros:\*\*\s*([\s\S]*?)(?=\*\*Cons:|\*\*Expert opinion:|$)/i);
  const consMatch = description.match(/\*\*Cons:\*\*\s*([\s\S]*?)(?=\*\*Expert opinion:|$)/i);
  const expertMatch = description.match(/\*\*Expert opinion:\*\*\s*([\s\S]*?)$/i);

  if (verdictMatch) {
    const parseList = (text: string) => {
      return text
        .split('\n')
        .map(l => l.replace(/^[-*•]\s*/, '').trim())
        .filter(l => l.length > 0);
    };

    return {
      verdict: verdictMatch[1].trim(),
      bestFor: (bestForMatch ? bestForMatch[1] : '').trim(),
      notRecommendedFor: (notRecMatch ? notRecMatch[1] : '').trim(),
      realScenarios: (realScenariosMatch ? realScenariosMatch[1] : '').trim(),
      pros: prosMatch ? parseList(prosMatch[1]) : [],
      cons: consMatch ? parseList(consMatch[1]) : [],
      expertOpinion: (expertMatch ? expertMatch[1].replace(/^["'\s]+|["'\s]+$/g, '') : '').trim()
    };
  }

  // If plain description, fallback with parsed content
  return {
    verdict: description,
    bestFor: 'Game thủ, coder & creator cần thiết bị hiệu năng tốt, độ bền ổn định.',
    notRecommendedFor: 'Người dùng tìm kiếm sản phẩm phân khúc giá rẻ tối đa không quan tâm độ bền.',
    realScenarios: 'Xử lý mượt mà các tựa game Esport/AAA phổ biến và tác vụ đồ họa, lập trình liên tục.',
    pros: [
      'Linh kiện hoàn thiện cao cấp, thiết kế mượt mà',
      'Được kỹ thuật viên TechGear kiểm duyệt kỹ lưỡng',
      'Chính sách bảo hành đổi mới 30 ngày'
    ],
    cons: [
      'Nên nâng cấp phụ kiện đi kèm để đạt trải nghiệm trọn vẹn nhất'
    ],
    expertOpinion: `Đánh giá từ kỹ thuật viên TechGear: ${productName} hoàn thiện tốt trong tầm giá, cân bằng hoàn hảo giữa hiệu năng và chi phí.`
  };
}
