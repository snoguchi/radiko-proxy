# radiko-proxy

mpd で radiko を聞くためのプロキシサーバー

```bash
# 依存パッケージのインストール
npm install --production

# プロキシサーバーの起動 → `http://localhost:3000/streams/<放送局ID>` で Radiko のオーディオストリームが取得できるようになる
npm start

# プレイリストの編集（視聴する放送局の選択）
vi radiko.m3u

# mpd のプレイリストディレクトリにコピー
cp radiko.m3u /var/lib/mpd/playlists/
```

systemd への登録

```bash
vi radiko-proxy.service
sudo cp radiko-proxy.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable radiko-proxy
sudo systemctl start radiko-proxy
```