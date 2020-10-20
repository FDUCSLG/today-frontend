/** 从评课分数到对应文案的映射 */
export const mapScoreToText: (type: 'difficulty' | 'grade' | 'workload' | 'overall', score: number) => string = (type, score) => {
  const table = {
    difficulty: ['极难', '困难', '正常', '轻松', '小学'],
    grade: ['极差', '害怕', '海星', '善良', '天使'],
    workload: ['负担', '略多', '合理', '摸鱼', '躺好'],
    overall: ['避雷', '谨慎', '还行', '推荐', '安利'],
  };

  if (score < 1 || score > 5) {
    return '';
  }

  return table[type][Math.round(score) - 1];
};
