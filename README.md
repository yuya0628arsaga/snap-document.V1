# snap-document.V1
s-nap（電磁界解析ソフト）のドキュメントをGPTに学習させ、Q&Aを行えるシステム

# 開発の背景
s-nap関するユーザーからの問い合わせをGPTで自動化し、業務効率を向上させるため

# 使用技術一覧
## フロント
- React 18.2.0
- TypeScript 5.3.3
## サーバ
- PHP 8.1
- Laravel 10
- Python 3.9
- FastAPI
## その他
- Docker/Docker-compose
- Github Actions CI/CD
- AWS
  - ESC Fargate
  - RDS
  - ロードバランサー
  - VPC
  - Route53
- Nginx 1.25
- MySQL 8.0
- OpenAI API


# インフラ構成図
![snap-docインフラ構成図v3](https://github.com/yuya0628arsaga/snap-document.V1/assets/99158844/92b5de5f-89c2-4d04-ab97-44e9d09cfd49)

# 機能一覧
- ログイン
- Googleログイン
- ドキュメントを選択して質問を入力すると、選択したドキュメントを元に回答を生成する機能
- GPT-3.5-Turbo または GPT-4o を選択できる機能
- 会話履歴を含めて回答を生成するか選択できる機能
- 質問のタイトルを変更できる機能
- 質問を削除できる機能
- ページネーション機能
- 過去の質問を検索できる機能

# 非機能一覧
- 自動テスト
- ECSへの自動デプロイ

# 動作概要


https://github.com/yuya0628arsaga/snap-document.V1/assets/99158844/a10af64b-a43d-4728-877d-09a83a1390d0




# URL
https://snap-doc.jp
