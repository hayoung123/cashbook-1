export const CATEGORY = [
  '생활',
  '식비',
  '교통',
  '쇼핑/뷰티',
  '의료/건강',
  '문화/여가',
  '미분류',
  '월급',
  '용돈',
  '기타수입',
];

export type CategoryInfoType = {
  [key in string]: { name: string; color: string };
};

export const CATEGORY__INFO: CategoryInfoType = {
  life: { name: '생활', color: '#6ed5eb' },
  food: { name: '식비', color: '#4cb8b8' },
  transport: { name: '교통', color: '#94d3cc' },
  shop: { name: '쇼핑/뷰티', color: '#4ca1de' },
  health: { name: '의료/건강', color: '#d092e2' },
  culture: { name: '문화/여가', color: '#817dce' },
  etc: { name: '미분류', color: '#4a6cc3' },
  salary: { name: '월급', color: '#b9d58c' },
  pocketMoney: { name: '용돈', color: '#e6d267' },
  incomeEtc: { name: '기타수입', color: '#e2b765' },
};
