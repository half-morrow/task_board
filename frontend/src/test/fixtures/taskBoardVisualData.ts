export type VisualTask = {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  tag_names: string[];
};

export const visualTasks: VisualTask[] = [
  {
    title: '月次請求書レビュー',
    description: '経理提出前に金額と支払期限を確認する',
    status: 'todo',
    due_date: '2026-06-01',
    tag_names: ['finance', 'review'],
  },
  {
    title: '週次レポート作成',
    description: '進捗、課題、次週予定をまとめる',
    status: 'in_progress',
    due_date: '2026-06-02',
    tag_names: ['report'],
  },
  {
    title: '運用手順準備',
    description: 'アジェンダと確認事項を事前に整理する',
    status: 'todo',
    due_date: '2026-06-03',
    tag_names: ['ops', 'checklist'],
  },
  {
    title: 'UI文言確認',
    description: '一覧画面とフォームの表記ゆれを確認する',
    status: 'done',
    due_date: '2026-06-04',
    tag_names: ['frontend'],
  },
  {
    title: 'リリース手順確認',
    description: '手順書とロールバック手順を読み合わせる',
    status: 'todo',
    due_date: '2026-06-05',
    tag_names: ['release'],
  },
  {
    title: '検索条件の見直し',
    description: '利用頻度の高いキーワードを整理する',
    status: 'in_progress',
    due_date: '2026-06-08',
    tag_names: ['search', 'ux'],
  },
  {
    title: 'タグ運用ルール整理',
    description: '重複しやすいタグ名の表記を決める',
    status: 'todo',
    due_date: '2026-06-09',
    tag_names: ['tag', 'operation'],
  },
  {
    title: '運用メモ確認',
    description: '記録内容の整理と対応手順を確認する',
    status: 'todo',
    due_date: '2026-05-15',
    tag_names: ['ops'],
  },
  {
    title: 'バックログ棚卸し',
    description: '優先度が古いままのタスクを更新する',
    status: 'todo',
    due_date: '2026-06-10',
    tag_names: ['planning'],
  },
  {
    title: 'デザイン差分確認',
    description: '画面キャプチャを添えて差分を確認する',
    status: 'in_progress',
    due_date: '2026-06-11',
    tag_names: ['design'],
  },
  {
    title: 'APIレスポンス確認',
    description: '一覧取得時の件数とページ情報を確認する',
    status: 'done',
    due_date: '2026-06-12',
    tag_names: ['api'],
  },
  {
    title: '障害対応メモ更新',
    description: '直近の対応履歴と再発防止策を追記する',
    status: 'todo',
    due_date: '2026-06-15',
    tag_names: ['ops'],
  },
  {
    title: 'オンボーディング資料更新',
    description: '新メンバー向けの操作手順を最新化する',
    status: 'in_progress',
    due_date: '2026-06-16',
    tag_names: ['docs'],
  },
  {
    title: '権限設定レビュー',
    description: '不要なアクセス権が残っていないか確認する',
    status: 'todo',
    due_date: '2026-06-17',
    tag_names: ['security'],
  },
  {
    title: 'データ移行リハーサル',
    description: '検証環境で移行手順と所要時間を確認する',
    status: 'todo',
    due_date: '2026-06-18',
    tag_names: ['migration'],
  },
  {
    title: '朝会アジェンダ作成',
    description: '共有事項と相談事項を事前にまとめる',
    status: 'done',
    due_date: '2026-06-19',
    tag_names: ['team'],
  },
  {
    title: 'テスト観点追加',
    description: 'ページネーションと検索の確認項目を足す',
    status: 'in_progress',
    due_date: '2026-06-22',
    tag_names: ['qa'],
  },
  {
    title: '依存パッケージ確認',
    description: '更新候補と影響範囲を洗い出す',
    status: 'todo',
    due_date: '2026-06-23',
    tag_names: ['maintenance'],
  },
  {
    title: 'デモシナリオ作成',
    description: 'ポートフォリオ掲載用の操作手順を整理する',
    status: 'todo',
    due_date: '2026-06-24',
    tag_names: ['demo'],
  },
  {
    title: 'レビュー指摘反映',
    description: '優先度の高い指摘から順に修正する',
    status: 'in_progress',
    due_date: '2026-06-25',
    tag_names: ['review'],
  },
  {
    title: 'ページネーション確認',
    description: '2ページ目に遷移できることを確認する',
    status: 'todo',
    due_date: '2026-06-26',
    tag_names: ['e2e'],
  },
  {
    title: 'ビジュアル差分確認',
    description: '一覧画面の基準画像との差分を確認する',
    status: 'todo',
    due_date: '2026-06-29',
    tag_names: ['visual'],
  },
];
