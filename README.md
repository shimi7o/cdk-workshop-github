# cdk-workshop-github
[CDK WorkshopのCDK Pipelineの部分](https://cdkworkshop.com/20-typescript/70-advanced-topics/200-pipelines.html)をCodeCommitからGithubに変更して実施したリポジトリ。

# デプロイ方法

1. GithubへのConnectionを作成する

    1. [Connection](https://ap-northeast-1.console.aws.amazon.com/codesuite/settings/connections?region=ap-northeast-1&connections-meta=eyJmIjp7InRleHQiOiIifSwicyI6e30sIm4iOjIwLCJpIjowfQ)を開いて、接続の作成を押す。
    
        ![image](https://user-images.githubusercontent.com/22461827/177708934-1128db49-12ae-49a7-93aa-fdf03a46b552.png)

    2. Githubへの接続を選択。
    
        ![image](https://user-images.githubusercontent.com/22461827/177709084-97a676fc-42e5-4a99-9b05-b06440b2c7aa.png)

    3. 新しいアプリをインストールするをクリックして、リポジトリへの読み取り権限を与えて、接続を押す。

        ![image](https://user-images.githubusercontent.com/22461827/177709201-ee88a409-5f20-48c4-8765-d36bb51615ae.png)
        
    4. ARNを後で使うのでメモしておく。

2. パッケージインストール

```bash
$ npm install
```

3. デプロイ

```bash
$ cdk deploy -c Owner={Owner} -c Repository={Repository} -c Branch={Branch} -c ConnectionArn={ConnectionArn}
```
